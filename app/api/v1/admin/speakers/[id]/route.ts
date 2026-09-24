import { NextResponse } from "next/server";

import { supabaseServer } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    await requireRole(["admin"]);

    const { id } = await context.params;

    const { data, error } = await supabaseServer
      .from("speakers")
      .select(`
        id,
        name,
        bio,
        designation,
        company,
        avatar_url,
        linkedin_url,
        github_url,
        x_url,
        website_url,
        is_public,
        created_at,
        updated_at,
        talk_speakers(
          talk_id,
          sort_order,
          talks(
            id,
            title,
            event_id,
            events(
              id,
              title,
              slug
            )
          )
        )
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        { error: "Speaker not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      speaker: data,
    });
  } catch (error) {
    console.error("Failed to fetch speaker:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch speaker",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    await requireRole(["admin"]);

    const { id } = await context.params;
    const body = await request.json();

    const {
      name,
      bio,
      designation,
      company,
      avatar_url,
      linkedin_url,
      github_url,
      x_url,
      website_url,
      is_public,
    } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Speaker name is required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseServer
      .from("speakers")
      .update({
        name: name.trim(),
        bio: bio?.trim() || null,
        designation: designation?.trim() || null,
        company: company?.trim() || null,
        avatar_url: avatar_url?.trim() || null,
        linkedin_url: linkedin_url?.trim() || null,
        github_url: github_url?.trim() || null,
        x_url: x_url?.trim() || null,
        website_url: website_url?.trim() || null,
        is_public: is_public ?? true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        { error: "Speaker not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      speaker: data,
    });
  } catch (error) {
    console.error("Failed to update speaker:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update speaker",
      },
      { status: 500 },
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

    const { count, error: countError } =
      await supabaseServer
        .from("talk_speakers")
        .select("talk_id", {
          count: "exact",
          head: true,
        })
        .eq("speaker_id", id);

    if (countError) {
      throw countError;
    }

    if ((count ?? 0) > 0) {
      return NextResponse.json(
        {
          error:
            "This speaker is attached to one or more sessions. Remove those session associations first.",
        },
        { status: 409 },
      );
    }

    const { error } = await supabaseServer
      .from("speakers")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Failed to delete speaker:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete speaker",
      },
      { status: 500 },
    );
  }
}