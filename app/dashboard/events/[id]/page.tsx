import { notFound } from "next/navigation";

import { ManageEvent } from "@/components/dashboard/manage-event";
import { requireRole } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ManageEventPage({
  params,
}: PageProps) {
  await requireRole(
    ["admin"],
    "/dashboard/events",
  );

  const { id } = await params;

  const [{ data: event }, { data: speakers }] =
    await Promise.all([
      supabaseServer
        .from("events")
        .select(`
          id,
          title,
          slug,
          description,
          cover_image_url,
          event_type,
          location,
          online_url,
          start_at,
          end_at,
          registration_deadline,
          is_paid,
          is_published,
          is_cancelled,
          cancelled_at,
          created_by,
          created_at,
          updated_at,
          talks (
            id,
            title,
            description,
            talk_type,
            starts_at,
            ends_at,
            location,
            sort_order,
            talk_speakers (
              speaker_id,
              sort_order
            )
          )
        `)
        .eq("id", id)
        .maybeSingle(),

      supabaseServer
        .from("speakers")
        .select(`
          id,
          name,
          designation,
          company,
          avatar_url,
          is_public
        `)
        .order("name", {
          ascending: true,
        }),
    ]);

  if (!event) {
    notFound();
  }

  const normalizedEvent = {
    ...event,
    talks: [...(event.talks ?? [])]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((talk) => ({
        ...talk,
        talk_speakers: [...(talk.talk_speakers ?? [])].sort(
          (a, b) => a.sort_order - b.sort_order,
        ),
      })),
  };

  return (
    <ManageEvent
      event={normalizedEvent}
      speakers={speakers ?? []}
    />
  );
}