import { notFound } from "next/navigation";

import { EventAttendanceViewer } from "@/components/dashboard/attendance/event-attendance-viewer";
import { requireRole } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{
    eventId: string;
  }>;
};

type AttendanceAction = {
  id: string;
  action: string;
  recorded_at: string;
  created_at: string;
};

type AttendanceProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  workspace_name: string | null;
  workspace_uid: string | null;
};

type RawAttendanceRecord = {
  id: string;
  user_id: string;
  action: string;
  recorded_at: string;
  created_at: string;
  profiles:
    | AttendanceProfile
    | AttendanceProfile[]
    | null;
};

type AttendanceStatus =
  | "checked-in"
  | "on-break"
  | "completed"
  | "incomplete";

type Attendee = {
  user_id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  workspace_name: string | null;
  workspace_uid: string | null;
  checkin_at: string | null;
  checkout_at: string | null;
  status: AttendanceStatus;
  break_count: number;
  break_minutes: number;
  active_break_started_at: string | null;
  actions: AttendanceAction[];
};

export default async function EventAttendancePage({
  params,
}: PageProps) {
  await requireRole(
    ["core", "admin"],
    "/dashboard/attendance/manage",
  );

  const { eventId } = await params;

  const [
    {
      data: event,
      error: eventError,
    },
    {
      data: records,
      error: attendanceError,
    },
  ] = await Promise.all([
    supabaseServer
      .from("events")
      .select(`
        id,
        title,
        slug,
        event_type,
        location,
        start_at,
        end_at,
        is_published,
        is_cancelled
      `)
      .eq("id", eventId)
      .maybeSingle(),

    supabaseServer
      .from("attendance")
      .select(`
        id,
        user_id,
        action,
        recorded_at,
        created_at,
        profiles!attendance_user_id_fkey (
          id,
          full_name,
          email,
          avatar_url,
          workspace_name,
          workspace_uid
        )
      `)
      .eq("event_id", eventId)
      .order("recorded_at", {
        ascending: true,
      }),
  ]);

  if (eventError) {
    console.error(
      "Failed to fetch attendance event:",
      eventError,
    );

    throw new Error("Failed to load event.");
  }

  if (!event) {
    notFound();
  }

  if (attendanceError) {
    console.error(
      "Failed to fetch attendance records:",
      attendanceError,
    );

    throw new Error(
      "Failed to load attendance records.",
    );
  }

  const groupedRecords = new Map<
    string,
    {
      profile: AttendanceProfile | null;
      actions: AttendanceAction[];
    }
  >();

  for (
    const record of
    (records ?? []) as unknown as RawAttendanceRecord[]
  ) {
    const profile = Array.isArray(record.profiles)
      ? record.profiles[0] ?? null
      : record.profiles;

    const action: AttendanceAction = {
      id: record.id,
      action: record.action,
      recorded_at: record.recorded_at,
      created_at: record.created_at,
    };

    const existing = groupedRecords.get(
      record.user_id,
    );

    if (existing) {
      existing.actions.push(action);

      if (!existing.profile && profile) {
        existing.profile = profile;
      }
    } else {
      groupedRecords.set(record.user_id, {
        profile,
        actions: [action],
      });
    }
  }

  const attendees: Attendee[] = [
    ...groupedRecords.entries(),
  ]
    .map(([userId, group]) =>
      summarizeAttendance(
        userId,
        group.profile,
        group.actions,
      ),
    )
    .sort((a, b) =>
      (a.full_name ?? "").localeCompare(
        b.full_name ?? "",
      ),
    );

  return (
    <EventAttendanceViewer
      event={event}
      attendees={attendees}
    />
  );
}

function summarizeAttendance(
  userId: string,
  profile: AttendanceProfile | null,
  actionRecords: AttendanceAction[],
): Attendee {
  const actions = [...actionRecords].sort(
    (a, b) =>
      new Date(a.recorded_at).getTime() -
      new Date(b.recorded_at).getTime(),
  );

  const checkins = actions.filter(
    (action) => action.action === "checkin",
  );

  const checkouts = actions.filter(
    (action) => action.action === "checkout",
  );

  const latestCheckin =
    checkins[checkins.length - 1] ?? null;

  const latestCheckout =
    checkouts[checkouts.length - 1] ?? null;

  const isCheckedIn =
    Boolean(latestCheckin) &&
    (
      !latestCheckout ||
      new Date(latestCheckin!.recorded_at).getTime() >
        new Date(latestCheckout.recorded_at).getTime()
    );

  let checkinAt: string | null = null;
  let checkoutAt: string | null = null;

  if (isCheckedIn && latestCheckin) {
    checkinAt = latestCheckin.recorded_at;
  } else if (latestCheckout) {
    const matchingCheckin = [...checkins]
      .reverse()
      .find(
        (checkin) =>
          new Date(checkin.recorded_at).getTime() <=
          new Date(latestCheckout.recorded_at).getTime(),
      );

    checkinAt =
      matchingCheckin?.recorded_at ?? null;

    checkoutAt = latestCheckout.recorded_at;
  }

  const sessionStart = checkinAt
    ? new Date(checkinAt).getTime()
    : null;

  const sessionEnd = checkoutAt
    ? new Date(checkoutAt).getTime()
    : null;

  const sessionActions = actions.filter(
    (action) => {
      const timestamp = new Date(
        action.recorded_at,
      ).getTime();

      if (
        sessionStart !== null &&
        timestamp < sessionStart
      ) {
        return false;
      }

      if (
        sessionEnd !== null &&
        timestamp > sessionEnd
      ) {
        return false;
      }

      return true;
    },
  );

  let openBreak: string | null = null;
  let breakMinutes = 0;
  let breakCount = 0;

  for (const action of sessionActions) {
    if (action.action === "start_break") {
      if (!openBreak) {
        openBreak = action.recorded_at;
        breakCount += 1;
      }
    } else if (
      action.action === "end_break" &&
      openBreak
    ) {
      const duration =
        new Date(action.recorded_at).getTime() -
        new Date(openBreak).getTime();

      if (duration >= 0) {
        breakMinutes += Math.floor(
          duration / 60000,
        );
      }

      openBreak = null;
    }
  }

  if (openBreak) {
    breakMinutes += Math.max(
      0,
      Math.floor(
        (Date.now() -
          new Date(openBreak).getTime()) /
          60000,
      ),
    );
  }

  let status: AttendanceStatus;

  if (!checkinAt) {
    status = "incomplete";
  } else if (isCheckedIn) {
    status = openBreak
      ? "on-break"
      : "checked-in";
  } else if (checkoutAt) {
    status = "completed";
  } else {
    status = "incomplete";
  }

  return {
    user_id: userId,
    full_name: profile?.full_name ?? null,
    email: profile?.email ?? null,
    avatar_url: profile?.avatar_url ?? null,
    workspace_name: profile?.workspace_name ?? null,
    workspace_uid: profile?.workspace_uid ?? null,
    checkin_at: checkinAt,
    checkout_at: checkoutAt,
    status,
    break_count: breakCount,
    break_minutes: breakMinutes,
    active_break_started_at: openBreak,
    actions,
  };
}