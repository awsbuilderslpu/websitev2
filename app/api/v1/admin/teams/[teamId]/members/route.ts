import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ teamId: string }>;
};

export async function GET(
  _request: NextRequest,
  { params }: RouteContext,
) {
  const { teamId } = await params;

  const { data, error } = await supabaseServer
    .from("team_members")
    .select(
      `
        id,
        team_id,
        profile_id,
        designation,
        is_lead,
        is_active,
        joined_at,
        left_at,
        profiles (
          id,
          full_name,
          email,
          avatar_url,
          role
        )
      `,
    )
    .eq("team_id", teamId)
    .order("is_lead", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ members: data });
}

export async function POST(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { teamId } = await params;
    const body = await request.json();

    const profileId =
      typeof body.profile_id === "string" ? body.profile_id : "";
    const designation =
      typeof body.designation === "string" ? body.designation.trim() : "";

    if (!profileId || !designation) {
      return NextResponse.json(
        { error: "Profile and designation are required." },
        { status: 400 },
      );
    }

    const { data: profile, error: profileError } = await supabaseServer
      .from("profiles")
      .select("id, role")
      .eq("id", profileId)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 },
      );
    }

    if (!profile || !["core", "admin"].includes(profile.role ?? "")) {
      return NextResponse.json(
        { error: "Only core members and admins can be assigned to teams." },
        { status: 403 },
      );
    }

    const { data, error } = await supabaseServer
      .from("team_members")
      .upsert(
        {
          team_id: teamId,
          profile_id: profileId,
          designation,
          is_lead: body.is_lead === true,
          is_active: true,
          left_at: null,
        },
        { onConflict: "team_id,profile_id" },
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ member: data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { teamId } = await params;
    const body = await request.json();
    const memberId =
      typeof body.id === "string" ? body.id : "";

    if (!memberId) {
      return NextResponse.json(
        { error: "Membership ID is required." },
        { status: 400 },
      );
    }

    const updates: Record<string, unknown> = {};

    if (typeof body.designation === "string") {
      const designation = body.designation.trim();

      if (!designation) {
        return NextResponse.json(
          { error: "Designation cannot be empty." },
          { status: 400 },
        );
      }

      updates.designation = designation;
    }

    if (typeof body.is_lead === "boolean") {
      updates.is_lead = body.is_lead;
    }

    if (typeof body.is_active === "boolean") {
      updates.is_active = body.is_active;
      updates.left_at = body.is_active ? null : new Date().toISOString();
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields supplied." },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseServer
      .from("team_members")
      .update(updates)
      .eq("id", memberId)
      .eq("team_id", teamId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ member: data });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params;
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("id");

    if (!teamId || !memberId) {
      return Response.json(
        { error: "Team ID and membership ID are required" },
        { status: 400 }
      );
    }

    const { data: membership, error: fetchError } = await supabaseServer
      .from("team_members")
      .select("id, team_id")
      .eq("id", memberId)
      .maybeSingle();

    if (fetchError) {
      console.error("Failed to fetch team membership:", fetchError);

      return Response.json(
        { error: fetchError.message },
        { status: 500 }
      );
    }

    if (!membership) {
      return Response.json(
        { error: "Team membership not found" },
        { status: 404 }
      );
    }

    if (membership.team_id !== teamId) {
      return Response.json(
        { error: "Membership does not belong to this team" },
        { status: 400 }
      );
    }

    const { error: deleteError } = await supabaseServer
      .from("team_members")
      .delete()
      .eq("id", memberId)
      .eq("team_id", teamId);

    if (deleteError) {
      console.error("Failed to delete team membership:", deleteError);

      return Response.json(
        { error: deleteError.message },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Unexpected membership deletion error:", error);

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}