import {
  Activity,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Users,
} from "lucide-react";
import Link from "next/link";

import { AttendanceEventsTable } from "@/components/dashboard/attendance/attendance-events-table";
import { requireRole } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";

type EventStatus =
  | "Upcoming"
  | "Ongoing"
  | "Past"
  | "Draft"
  | "Cancelled";

type RawEvent = {
  id: string;
  title: string;
  slug: string;
  event_type: string;
  location: string | null;
  start_at: string;
  end_at: string;
  is_published: boolean;
  is_cancelled: boolean;
  attendance: {
    count: number;
  }[] | null;
};

export type AttendanceEvent = {
  id: string;
  title: string;
  slug: string;
  event_type: string;
  location: string | null;
  start_at: string;
  end_at: string;
  is_published: boolean;
  is_cancelled: boolean;
  attendanceActionCount: number;
  status: EventStatus;
};

function getEventStatus(
  event: RawEvent,
  now: number,
): EventStatus {
  if (event.is_cancelled) {
    return "Cancelled";
  }

  if (!event.is_published) {
    return "Draft";
  }

  const start = new Date(event.start_at).getTime();
  const end = new Date(event.end_at).getTime();

  if (now < start) {
    return "Upcoming";
  }

  if (now <= end) {
    return "Ongoing";
  }

  return "Past";
}

export default async function ManageAttendancePage() {
  await requireRole(
    ["core", "admin"],
    "/dashboard/attendance/manage",
  );

  const { data, error } = await supabaseServer
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
      is_cancelled,
      attendance(count)
    `)
    .order("start_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Failed to fetch attendance events:",
      error,
    );

    throw new Error(
      "Failed to load attendance events.",
    );
  }

  const now = Date.now();

  const events: AttendanceEvent[] = (
    (data ?? []) as unknown as RawEvent[]
  ).map((event) => ({
    id: event.id,
    title: event.title,
    slug: event.slug,
    event_type: event.event_type,
    location: event.location,
    start_at: event.start_at,
    end_at: event.end_at,
    is_published: event.is_published,
    is_cancelled: event.is_cancelled,
    attendanceActionCount:
      event.attendance?.[0]?.count ?? 0,
    status: getEventStatus(event, now),
  }));

  const activeCount = events.filter(
    (event) =>
      event.status === "Upcoming" ||
      event.status === "Ongoing",
  ).length;

  const ongoingCount = events.filter(
    (event) => event.status === "Ongoing",
  ).length;

  const totalActions = events.reduce(
    (total, event) =>
      total + event.attendanceActionCount,
    0,
  );

  const draftCount = events.filter(
    (event) => event.status === "Draft",
  ).length;

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#242333]">
      <div className="mx-auto max-w-360 px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
        {/* Page header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/dashboard"
              className="mb-5 inline-flex items-center gap-2 text-xs font-medium text-[#858292] transition-colors hover:text-[#5257C8]"
            >
              <ArrowLeft size={14} />
              Dashboard
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFDCCF] text-[#B84F28]">
                <CheckCircle2 size={22} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#B84F28]">
                  Administration
                </p>

                <h1 className="mt-1 text-3xl font-semibold tracking-[-0.055em] sm:text-4xl">
                  Attendance
                </h1>
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#777584]">
              Select an event to manage check-ins, review
              attendance history, or download records.
            </p>
          </div>

          <Link
            href="/dashboard/events"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[#EAE6DE] bg-white px-5 py-3 text-xs font-semibold transition-colors hover:border-[#D3CCFF] hover:bg-[#E5E2FF]"
          >
            <CalendarDays size={15} />
            Manage events
          </Link>
        </div>

        {/* Overview statistics */}
        <section className="mt-9 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Total events"
            value={events.length}
            description="Across all event records"
            icon={<CalendarDays size={19} />}
            background="#E5E2FF"
            foreground="#6252BD"
          />

          <SummaryCard
            label="Active & upcoming"
            value={activeCount}
            description={`${ongoingCount} currently ongoing`}
            icon={<Clock3 size={19} />}
            background="#FFE5A5"
            foreground="#A56A00"
          />

          <SummaryCard
            label="Attendance actions"
            value={totalActions}
            description="Check-ins, check-outs and breaks"
            icon={<Activity size={19} />}
            background="#DDF2E5"
            foreground="#287B56"
          />

          <SummaryCard
            label="Draft events"
            value={draftCount}
            description="Not published yet"
            icon={<Users size={19} />}
            background="#DCEBFF"
            foreground="#345DA8"
          />
        </section>

        {/* Event management */}
        <section className="mt-10">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-[-0.035em]">
                Event attendance
              </h2>

              <p className="mt-1.5 text-sm text-[#858292]">
                Browse events and manage their attendance records.
              </p>
            </div>

            <span className="text-xs text-[#858292]">
              {events.length}{" "}
              {events.length === 1 ? "event" : "events"}
            </span>
          </div>

          <AttendanceEventsTable events={events} />
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  description,
  icon,
  background,
  foreground,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  background: string;
  foreground: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-[#EAE6DE] bg-white p-5 transition-shadow hover:shadow-[0_8px_24px_rgba(36,35,51,0.04)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-[#777584]">
          {label}
        </p>

        <div
          className="flex h-10 w-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: background,
            color: foreground,
          }}
        >
          {icon}
        </div>
      </div>

      <p className="mt-5 text-3xl font-semibold tracking-[-0.055em]">
        {value.toLocaleString("en-IN")}
      </p>

      <p className="mt-1.5 text-xs leading-5 text-[#858292]">
        {description}
      </p>
    </div>
  );
}