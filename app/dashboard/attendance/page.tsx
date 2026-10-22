import { requireUser } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";
import {
  UserAttendanceView,
  type UserAttendanceAction,
  type UserAttendanceEvent,
} from "@/components/dashboard/attendance/user-attendance-view";

type EventRecord = {
  id: string;
  title: string;
  slug: string;
  event_type: string;
  location: string | null;
  start_at: string | null;
  end_at: string | null;
  is_cancelled: boolean;
  cover_image_url: string | null;
};

type AttendanceRow = {
  id: string;
  event_id: string;
  user_id: string;
  action: UserAttendanceAction;
  recorded_at: string;
  event: EventRecord | EventRecord[] | null;
};

export default async function AttendancePage() {
  const user = await requireUser("/dashboard/attendance");

  const { data, error } = await supabaseServer
    .from("attendance")
    .select(`
      id,
      event_id,
      user_id,
      action,
      recorded_at,
      event:events!attendance_event_id_fkey (
        id,
        title,
        slug,
        event_type,
        location,
        start_at,
        end_at,
        is_cancelled,
        cover_image_url
      )
    `)
    .eq("user_id", user.sub)
    .order("recorded_at", { ascending: false });

  if (error) {
    console.error("Failed to load user attendance:", error);
  }

  const rows = (data ?? []) as unknown as AttendanceRow[];

  const eventMap = new Map<string, UserAttendanceEvent>();

  for (const row of rows) {
    const event = Array.isArray(row.event)
      ? row.event[0]
      : row.event;

    if (!event) continue;

    let entry = eventMap.get(event.id);

    if (!entry) {
      entry = {
        event,
        actions: [],
      };

      eventMap.set(event.id, entry);
    }

    entry.actions.push({
      id: row.id,
      action: row.action,
      recorded_at: row.recorded_at,
    });
  }

  const attendanceEvents = Array.from(eventMap.values())
    .map((entry) => ({
      ...entry,
      actions: entry.actions.sort(
        (a, b) =>
          new Date(a.recorded_at).getTime() -
          new Date(b.recorded_at).getTime()
      ),
    }))
    .sort((a, b) => {
      const aLast =
        a.actions[a.actions.length - 1]?.recorded_at ?? "";
      const bLast =
        b.actions[b.actions.length - 1]?.recorded_at ?? "";

      return (
        new Date(bLast).getTime() -
        new Date(aLast).getTime()
      );
    });

  return (
    <UserAttendanceView
      events={attendanceEvents}
      userName={user.name || "there"}
      hasError={Boolean(error)}
    />
  );
}