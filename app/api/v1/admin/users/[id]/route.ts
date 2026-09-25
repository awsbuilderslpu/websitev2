import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";

const allowedRoles = [
  "member",
  "core",
  "admin",
] as const;

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    await requireRole(["admin"]);

    const { id } = await context.params;
    const body = await request.json();

    const role = body.role;

    if (
      typeof role !== "string" ||
      !allowedRoles.includes(
        role as (typeof allowedRoles)[number],
      )
    ) {
      return NextResponse.json(
        {
          error: "Invalid user role",
        },
        {
          status: 400,
        },
      );
    }

    const {
      data: user,
      error: findError,
    } = await supabaseServer
      .from("profiles")
      .select("id, full_name, email, role")
      .eq("id", id)
      .maybeSingle();

    if (findError) {
      throw findError;
    }

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        },
      );
    }

    const {
      data: updatedUser,
      error: updateError,
    } = await supabaseServer
      .from("profiles")
      .update({
        role,
      })
      .eq("id", id)
      .select(
        `
          id,
          full_name,
          email,
          role,
          avatar_url,
          workspace_name,
          workspace_uid,
          created_at
        `,
      )
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      user: updatedUser,
    });
  } catch (error) {
    console.error(
      "Failed to update user:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update user",
      },
      {
        status: 500,
      },
    );
  }
}