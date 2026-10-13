import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET() {
  const { data, error } = await supabaseServer
    .from("teams")
    .select(
      `
        id,
        name,
        slug,
        description,
        icon,
        color,
        is_active,
        sort_order,
        created_at,
        updated_at,
        team_members (
          id,
          profile_id,
          designation,
          is_lead,
          is_active,
          profiles (
            id,
            full_name,
            email,
            avatar_url,
            role
          )
        )
      `,
    )
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ teams: data });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const slug =
      typeof body.slug === "string"
        ? body.slug.trim().toLowerCase()
        : "";
    const description =
      typeof body.description === "string"
        ? body.description.trim() || null
        : null;
    const icon = typeof body.icon === "string" ? body.icon : null;
    const color =
      typeof body.color === "string" ? body.color : "#6252BD";
    const sortOrder = Number.isInteger(body.sort_order)
      ? body.sort_order
      : 0;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Team name and slug are required." },
        { status: 400 },
      );
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return NextResponse.json(
        { error: "Slug must contain lowercase letters, numbers, and hyphens." },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseServer
      .from("teams")
      .insert({
        name,
        slug,
        description,
        icon,
        color,
        sort_order: sortOrder,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ team: data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : "";

    if (!id) {
      return NextResponse.json(
        { error: "Team ID is required." },
        { status: 400 },
      );
    }

    const updates: Record<string, unknown> = {};

    if (typeof body.name === "string") updates.name = body.name.trim();
    if (typeof body.slug === "string") {
      const slug = body.slug.trim().toLowerCase();

      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        return NextResponse.json(
          { error: "Invalid team slug." },
          { status: 400 },
        );
      }

      updates.slug = slug;
    }
    if (typeof body.description === "string" || body.description === null) {
      updates.description = body.description?.trim() || null;
    }
    if (typeof body.icon === "string" || body.icon === null) {
      updates.icon = body.icon;
    }
    if (typeof body.color === "string") updates.color = body.color;
    if (typeof body.is_active === "boolean") {
      updates.is_active = body.is_active;
    }
    if (Number.isInteger(body.sort_order)) {
      updates.sort_order = body.sort_order;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields supplied." },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseServer
      .from("teams")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ team: data });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Team ID is required." },
      { status: 400 },
    );
  }

  const { error } = await supabaseServer.from("teams").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}