import { NextResponse } from "next/server";

import { supabaseServer } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    await requireRole(["admin"]);

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
        talk_speakers(count)
      `)
      .order("name", {
        ascending: true,
      });

    if (error) {
      throw error;
    }

    const speakers = (data ?? []).map((speaker) => ({
      id: speaker.id,
      name: speaker.name,
      bio: speaker.bio,
      designation: speaker.designation,
      company: speaker.company,
      avatar_url: speaker.avatar_url,
      linkedin_url: speaker.linkedin_url,
      github_url: speaker.github_url,
      x_url: speaker.x_url,
      website_url: speaker.website_url,
      is_public: speaker.is_public,
      created_at: speaker.created_at,
      updated_at: speaker.updated_at,
      talks_count: speaker.talk_speakers?.[0]?.count ?? 0,
    }));

    return NextResponse.json({
      speakers,
    });
  } catch (error) {
    console.error("Failed to fetch admin speakers:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch speakers",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireRole(["admin"]);

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
      .insert({
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
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        speaker: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create speaker:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create speaker",
      },
      { status: 500 },
    );
  }
}