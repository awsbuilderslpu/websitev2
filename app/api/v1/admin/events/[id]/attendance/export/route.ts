import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function csvCell(value: unknown) {
  let text = value == null ? "" : String(value);

  if (/^[\t\r ]*[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

function createCsvRow(values: unknown[]) {
  return values.map(csvCell).join(",");
}

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  if (!["core", "admin"].includes(user.role)) {
    return NextResponse.json(
      { error: "You do not have permission to export attendance" },
      { status: 403 },
    );
  }

  try {
    const { id } = await context.params;

    const { data: event, error: eventError } =
      await supabaseServer
        .from("events")
        .select("id, title, slug")
        .eq("id", id)
        .maybeSingle();

    if (eventError) {
      throw eventError;
    }

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 },
      );
    }

    const { data: records, error: attendanceError } =
      await supabaseServer
        .from("attendance")
        .select(`
          user_id,
          action,
          recorded_at,
          created_at,
          profiles (
            full_name,
            email,
            workspace_name,
            workspace_uid
          )
        `)
        .eq("event_id", id)
        .order("recorded_at", {
          ascending: true,
        });

    if (attendanceError) {
      throw attendanceError;
    }

    const header = [
      "Event Title",
      "Event Slug",
      "User ID",
      "Full Name",
      "Email",
      "Workspace",
      "Workspace UID",
      "Action",
      "Recorded At",
      "Record Created At",
    ];

    const rows = (records ?? []).map((record) => {
      const profile = Array.isArray(record.profiles)
        ? record.profiles[0]
        : record.profiles;

      return [
        event.title,
        event.slug,
        record.user_id,
        profile?.full_name,
        profile?.email,
        profile?.workspace_name,
        profile?.workspace_uid,
        record.action,
        record.recorded_at,
        record.created_at,
      ];
    });

    const csv = [
      createCsvRow(header),
      ...rows.map(createCsvRow),
    ].join("\r\n");

    const safeSlug =
      event.slug.replace(/[^a-z0-9-_]/gi, "-") ||
      event.id;

    return new NextResponse(`\uFEFF${csv}`, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="attendance-${safeSlug}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(
      "Failed to export event attendance:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to export attendance",
      },
      { status: 500 },
    );
  }
}