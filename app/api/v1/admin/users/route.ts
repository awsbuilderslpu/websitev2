import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";

const allowedRoles = [
  "member",
  "core",
  "admin",
] as const;

type UserRole = (typeof allowedRoles)[number];

function sanitizeSearch(value: string) {
  return value
    .trim()
    .replace(/[%_,]/g, "")
    .slice(0, 100);
}

export async function GET(request: Request) {
  try {
    await requireRole(["admin"]);

    const { searchParams } = new URL(request.url);

    const requestedPage = Number(
      searchParams.get("page") ?? "1",
    );

    const requestedPageSize = Number(
      searchParams.get("pageSize") ?? "20",
    );

    const search = sanitizeSearch(
      searchParams.get("search") ?? "",
    );

    const role = searchParams.get("role");

    const page = Number.isFinite(requestedPage)
      ? Math.max(1, requestedPage)
      : 1;

    const pageSize = Number.isFinite(requestedPageSize)
      ? Math.min(
          100,
          Math.max(10, requestedPageSize),
        )
      : 20;

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabaseServer
      .from("profiles")
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
        {
          count: "exact",
        },
      )
      .order("created_at", {
        ascending: false,
      })
      .range(from, to);

    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,workspace_uid.ilike.%${search}%`,
      );
    }

    if (
      role &&
      allowedRoles.includes(role as UserRole)
    ) {
      query = query.eq("role", role);
    }

    const {
      data,
      error,
      count,
    } = await query;

    if (error) {
      throw error;
    }

    const total = count ?? 0;
    const totalPages = Math.max(
      1,
      Math.ceil(total / pageSize),
    );

    return NextResponse.json({
      users: data ?? [],
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error(
      "Failed to fetch admin users:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch users",
      },
      {
        status: 500,
      },
    );
  }
}