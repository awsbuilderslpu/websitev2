import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type IncomingSession = {
  id?: string;
  title?: string;
  description?: string | null;
  talk_type?: string;
  starts_at?: string | null;
  ends_at?: string | null;
  location?: string | null;
  talk_speakers?: {
    speaker_id?: string;
  }[];
};

type IncomingEvent = {
  title?: string;
  slug?: string;
  description?: string | null;
  cover_image_url?: string | null;
  event_type?: string;
  location?: string | null;
  online_url?: string | null;
  start_at?: string;
  end_at?: string;
  registration_deadline?: string;
  is_paid?: boolean;
  is_published?: boolean;
};

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    await requireRole(["admin"]);

    const { id } = await context.params;
    const body = await request.json();

    const event = body.event as IncomingEvent | undefined;
    const sessions = Array.isArray(body.sessions)
      ? (body.sessions as IncomingSession[])
      : [];

    if (!event) {
      return NextResponse.json(
        {
          error: "Event data is required",
        },
        {
          status: 400,
        },
      );
    }

    if (!event.title?.trim()) {
      return NextResponse.json(
        {
          error: "Event title is required",
        },
        {
          status: 400,
        },
      );
    }

    if (!event.slug?.trim()) {
      return NextResponse.json(
        {
          error: "Event slug is required",
        },
        {
          status: 400,
        },
      );
    }

    if (!event.event_type) {
      return NextResponse.json(
        {
          error: "Event type is required",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !event.start_at ||
      !event.end_at ||
      !event.registration_deadline
    ) {
      return NextResponse.json(
        {
          error:
            "Start time, end time, and registration deadline are required",
        },
        {
          status: 400,
        },
      );
    }

    const { data: existingEvent, error: findEventError } =
      await supabaseServer
        .from("events")
        .select("id, title")
        .eq("id", id)
        .maybeSingle();

    if (findEventError) {
      throw findEventError;
    }

    if (!existingEvent) {
      return NextResponse.json(
        {
          error: "Event not found",
        },
        {
          status: 404,
        },
      );
    }

    const { data: duplicateSlugEvent, error: slugError } =
      await supabaseServer
        .from("events")
        .select("id")
        .eq("slug", event.slug.trim())
        .neq("id", id)
        .maybeSingle();

    if (slugError) {
      throw slugError;
    }

    if (duplicateSlugEvent) {
      return NextResponse.json(
        {
          error: "Another event already uses this slug",
        },
        {
          status: 409,
        },
      );
    }

    if (
      new Date(event.end_at).getTime() <=
      new Date(event.start_at).getTime()
    ) {
      return NextResponse.json(
        {
          error: "Event end time must be after start time",
        },
        {
          status: 400,
        },
      );
    }

    const { data: existingTalks, error: talksError } =
      await supabaseServer
        .from("talks")
        .select("id")
        .eq("event_id", id);

    if (talksError) {
      throw talksError;
    }

    const existingTalkIds = new Set(
      (existingTalks ?? []).map((talk) => talk.id),
    );

    const incomingExistingTalkIds = new Set(
      sessions
        .map((session) => session.id)
        .filter(
          (sessionId): sessionId is string =>
            Boolean(
              sessionId &&
                existingTalkIds.has(sessionId),
            ),
        ),
    );

    const talksToDelete = (existingTalks ?? [])
      .map((talk) => talk.id)
      .filter(
        (talkId) =>
          !incomingExistingTalkIds.has(talkId),
      );

    for (const talkId of talksToDelete) {
      const { error: deleteAssociationsError } =
        await supabaseServer
          .from("talk_speakers")
          .delete()
          .eq("talk_id", talkId);

      if (deleteAssociationsError) {
        throw deleteAssociationsError;
      }

      const { error: deleteTalkError } =
        await supabaseServer
          .from("talks")
          .delete()
          .eq("id", talkId)
          .eq("event_id", id);

      if (deleteTalkError) {
        throw deleteTalkError;
      }
    }

    for (
      let index = 0;
      index < sessions.length;
      index += 1
    ) {
      const session = sessions[index];

      const title = session.title?.trim();

      if (!title) {
        return NextResponse.json(
          {
            error: `Session ${index + 1} requires a title`,
          },
          {
            status: 400,
          },
        );
      }

      const talkPayload = {
        title,
        description:
          session.description?.trim() || null,
        talk_type:
          session.talk_type?.trim() || "session",
        starts_at: session.starts_at || null,
        ends_at: session.ends_at || null,
        location:
          session.location?.trim() || null,
        sort_order: index,
        updated_at: new Date().toISOString(),
      };

      let talkId: string;

      if (
        session.id &&
        existingTalkIds.has(session.id)
      ) {
        const {
          data: updatedTalk,
          error: updateTalkError,
        } = await supabaseServer
          .from("talks")
          .update(talkPayload)
          .eq("id", session.id)
          .eq("event_id", id)
          .select("id")
          .single();

        if (updateTalkError) {
          throw updateTalkError;
        }

        talkId = updatedTalk.id;
      } else {
        const {
          data: createdTalk,
          error: createTalkError,
        } = await supabaseServer
          .from("talks")
          .insert({
            ...talkPayload,
            event_id: id,
          })
          .select("id")
          .single();

        if (createTalkError) {
          throw createTalkError;
        }

        talkId = createdTalk.id;
      }

      const {
        error: deleteAssociationsError,
      } = await supabaseServer
        .from("talk_speakers")
        .delete()
        .eq("talk_id", talkId);

      if (deleteAssociationsError) {
        throw deleteAssociationsError;
      }

      const speakerIds = Array.isArray(
        session.talk_speakers,
      )
        ? [
            ...new Set(
              session.talk_speakers
                .map(
                  (item) =>
                    item.speaker_id,
                )
                .filter(
                  (
                    speakerId,
                  ): speakerId is string =>
                    Boolean(speakerId),
                ),
            ),
          ]
        : [];

      if (speakerIds.length > 0) {
        const {
          error: insertAssociationsError,
        } = await supabaseServer
          .from("talk_speakers")
          .insert(
            speakerIds.map(
              (speakerId, speakerIndex) => ({
                talk_id: talkId,
                speaker_id: speakerId,
                sort_order: speakerIndex,
              }),
            ),
          );

        if (insertAssociationsError) {
          throw insertAssociationsError;
        }
      }
    }

    const { error: updateEventError } =
      await supabaseServer
        .from("events")
        .update({
          title: event.title.trim(),
          slug: event.slug.trim(),
          description:
            event.description?.trim() || null,
          cover_image_url:
            event.cover_image_url?.trim() || null,
          event_type: event.event_type,
          location:
            event.location?.trim() || null,
          online_url:
            event.online_url?.trim() || null,
          start_at: event.start_at,
          end_at: event.end_at,
          registration_deadline:
            event.registration_deadline,
          is_paid: Boolean(event.is_paid),
          is_published: Boolean(
            event.is_published,
          ),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

    if (updateEventError) {
      throw updateEventError;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Failed to update event:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update event",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  try {
    await requireRole(["admin"]);

    const { id } = await context.params;

    const { data: event, error: findEventError } =
      await supabaseServer
        .from("events")
        .select("id, title")
        .eq("id", id)
        .maybeSingle();

    if (findEventError) {
      throw findEventError;
    }

    if (!event) {
      return NextResponse.json(
        {
          error: "Event not found",
        },
        {
          status: 404,
        },
      );
    }

    const { data: talks, error: talksError } =
      await supabaseServer
        .from("talks")
        .select("id")
        .eq("event_id", id);

    if (talksError) {
      throw talksError;
    }

    const talkIds = (talks ?? []).map(
      (talk) => talk.id,
    );

    if (talkIds.length > 0) {
      const {
        error: deleteAssociationsError,
      } = await supabaseServer
        .from("talk_speakers")
        .delete()
        .in("talk_id", talkIds);

      if (deleteAssociationsError) {
        throw deleteAssociationsError;
      }

      const { error: deleteTalksError } =
        await supabaseServer
          .from("talks")
          .delete()
          .eq("event_id", id);

      if (deleteTalksError) {
        throw deleteTalksError;
      }
    }

    const { error: deleteEventError } =
      await supabaseServer
        .from("events")
        .delete()
        .eq("id", id);

    if (deleteEventError) {
      console.error(
        `Failed to delete event "${id}":`,
        deleteEventError,
      );

      return NextResponse.json(
        {
          error:
            "The event could not be deleted because other records still reference it.",
          details: deleteEventError.message,
        },
        {
          status: 409,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Event "${event.title}" deleted successfully.`,
    });
  } catch (error) {
    console.error(
      "Failed to delete event:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete event",
      },
      {
        status: 500,
      },
    );
  }
}