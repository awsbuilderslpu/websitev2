"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CirclePlay,
  Clock3,
  Coffee,
  LogIn,
  LogOut,
  MapPin,
  Search,
  ShieldCheck,
  TicketCheck,
  Timer,
  type LucideIcon,
} from "lucide-react";

export type UserAttendanceAction =
  | "checkin"
  | "checkout"
  | "start_break"
  | "end_break";

type AttendanceState =
  | "checked-in"
  | "on-break"
  | "completed"
  | "not-checked-in"
  | "invalid";

type AttendanceEventDetails = {
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

type AttendanceActionRecord = {
  id: string;
  action: UserAttendanceAction;
  recorded_at: string;
};

export type UserAttendanceEvent = {
  event: AttendanceEventDetails;
  actions: AttendanceActionRecord[];
};

type Props = {
  events: UserAttendanceEvent[];
  userName: string;
  hasError?: boolean;
};

type Summary = {
  entry: UserAttendanceEvent;
  state: AttendanceState;
  hasCheckedIn: boolean;
  checkInAt: string | null;
  lastActionAt: string | null;
  durationMs: number;
  breakCount: number;
};

type FilterKey = "all" | "active" | "on-break" | "completed";

const ACTION_DETAILS: Record<
  UserAttendanceAction,
  {
    label: string;
    icon: LucideIcon;
    color: string;
    background: string;
  }
> = {
  checkin: {
    label: "Checked in",
    icon: LogIn,
    color: "text-[#376DB6]",
    background: "bg-[#E5F0FF]",
  },
  start_break: {
    label: "Break started",
    icon: Coffee,
    color: "text-[#93691B]",
    background: "bg-[#FFF0CC]",
  },
  end_break: {
    label: "Break ended",
    icon: CirclePlay,
    color: "text-[#27754A]",
    background: "bg-[#DFF3E5]",
  },
  checkout: {
    label: "Checked out",
    icon: LogOut,
    color: "text-[#A34327]",
    background: "bg-[#FCE5DD]",
  },
};

const STATE_DETAILS: Record<
  AttendanceState,
  {
    label: string;
    description: string;
    className: string;
    dotClassName: string;
  }
> = {
  "checked-in": {
    label: "Currently checked in",
    description: "Your attendance session is in progress.",
    className: "bg-[#DFF3E5] text-[#246C42]",
    dotClassName: "bg-[#36965D]",
  },
  "on-break": {
    label: "On break",
    description: "Your break is currently in progress.",
    className: "bg-[#FFF0CC] text-[#855F15]",
    dotClassName: "bg-[#D69A27]",
  },
  completed: {
    label: "Completed",
    description: "You have checked out of this event.",
    className: "bg-[#EFEBFF] text-[#5257C8]",
    dotClassName: "bg-[#5257C8]",
  },
  "not-checked-in": {
    label: "Not checked in",
    description: "No check-in has been recorded yet.",
    className: "bg-[#F0EEE9] text-[#777584]",
    dotClassName: "bg-[#AAA7B2]",
  },
  invalid: {
    label: "Needs review",
    description: "The recorded actions need to be reviewed.",
    className: "bg-[#FCE5DD] text-[#A34327]",
    dotClassName: "bg-[#C45536]",
  },
};

function formatDate(
  value: string | null | undefined,
  fallback = "Date unavailable"
) {
  if (!value) return fallback;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return fallback;

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function formatDateTime(
  value: string | null | undefined,
  fallback = "Not recorded"
) {
  if (!value) return fallback;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return fallback;

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function formatDuration(milliseconds: number) {
  const totalMinutes = Math.max(
    0,
    Math.floor(milliseconds / 60_000)
  );

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}

function getEventDuration(
  actions: AttendanceActionRecord[],
  now: number
) {
  let activeSince: number | null = null;
  let totalMilliseconds = 0;

  for (const record of actions) {
    const timestamp = new Date(record.recorded_at).getTime();

    if (Number.isNaN(timestamp)) continue;

    switch (record.action) {
      case "checkin": {
        if (activeSince === null) {
          activeSince = timestamp;
        }

        break;
      }

      case "start_break": {
        if (activeSince !== null) {
          totalMilliseconds += Math.max(
            0,
            timestamp - activeSince
          );

          activeSince = null;
        }

        break;
      }

      case "end_break": {
        if (activeSince === null) {
          activeSince = timestamp;
        }

        break;
      }

      case "checkout": {
        if (activeSince !== null) {
          totalMilliseconds += Math.max(
            0,
            timestamp - activeSince
          );

          activeSince = null;
        }

        break;
      }
    }
  }

  // Include the ongoing session, but not time spent on a break.
  if (activeSince !== null && now > 0) {
    totalMilliseconds += Math.max(0, now - activeSince);
  }

  return totalMilliseconds;
}

function buildSummary(
  entry: UserAttendanceEvent,
  now: number
): Summary {
  const actions = [...entry.actions].sort(
    (a, b) =>
      new Date(a.recorded_at).getTime() -
      new Date(b.recorded_at).getTime()
  );

  const lastAction = actions[actions.length - 1] ?? null;

  const checkInRecord =
    actions.find((action) => action.action === "checkin") ?? null;

  let state: AttendanceState = "not-checked-in";

  if (lastAction?.action === "checkout") {
    state = "completed";
  } else if (lastAction?.action === "start_break") {
    state = "on-break";
  } else if (
    lastAction?.action === "checkin" ||
    lastAction?.action === "end_break"
  ) {
    state = "checked-in";
  } else if (lastAction) {
    state = "invalid";
  }

  return {
    entry: {
      ...entry,
      actions,
    },
    state,
    hasCheckedIn: Boolean(checkInRecord),
    checkInAt: checkInRecord?.recorded_at ?? null,
    lastActionAt: lastAction?.recorded_at ?? null,
    durationMs: getEventDuration(actions, now),
    breakCount: actions.filter(
      (action) => action.action === "start_break"
    ).length,
  };
}

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  className,
  iconClassName,
}: {
  label: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  className: string;
  iconClassName: string;
}) {
  return (
    <div
      className={`rounded-[24px] border border-[#EAE7E0] p-5 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#777584]">
            {label}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-[#242333]">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconClassName}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-3 text-xs leading-5 text-[#777584]">
        {description}
      </p>
    </div>
  );
}

function EmptyState({
  filtered,
  onClear,
}: {
  filtered: boolean;
  onClear: () => void;
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-[#DCD8CF] bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#EFEBFF] text-[#5257C8]">
        <CalendarDays className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-lg font-bold">
        {filtered
          ? "No matching attendance records"
          : "Your attendance journey starts here"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#777584]">
        {filtered
          ? "Try changing your search or selecting another status filter."
          : "Once your attendance is recorded at an AWS SBG event, your check-in history and attendance duration will appear here."}
      </p>

      {filtered && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 rounded-xl bg-[#5257C8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4448B6]"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

function AttendanceEventCard({
  summary,
}: {
  summary: Summary;
}) {
  const { entry, state } = summary;
  const event = entry.event;
  const status = STATE_DETAILS[state];

  const latestAction =
    entry.actions[entry.actions.length - 1] ?? null;

  return (
    <article className="overflow-hidden rounded-[24px] border border-[#EAE7E0] bg-white transition hover:border-[#D9D5EF] hover:shadow-sm">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#E5F0FF] text-[#376DB6]">
            <TicketCheck className="h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${status.dotClassName}`}
                />

                {status.label}
              </span>

              {event.is_cancelled && (
                <span className="rounded-full bg-[#FCE5DD] px-2.5 py-1 text-xs font-semibold text-[#A34327]">
                  Event cancelled
                </span>
              )}

              {event.event_type && (
                <span className="rounded-full bg-[#F0EEE9] px-2.5 py-1 text-xs font-medium capitalize text-[#777584]">
                  {event.event_type.replace(/[_-]/g, " ")}
                </span>
              )}
            </div>

            <h3 className="mt-3 break-words text-lg font-bold tracking-tight text-[#242333] sm:text-xl">
              {event.title}
            </h3>

            <div className="mt-2 flex flex-col gap-2 text-sm text-[#777584] sm:flex-row sm:flex-wrap sm:gap-4">
              {event.start_at && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 shrink-0" />
                  {formatDate(event.start_at)}
                </span>
              )}

              {event.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="break-words">
                    {event.location}
                  </span>
                </span>
              )}
            </div>
          </div>

          <div className="shrink-0 rounded-2xl bg-[#FAF9F6] px-4 py-3 sm:text-right">
            <p className="text-xs font-medium text-[#898795]">
              Attended time
            </p>

            <p className="mt-1 text-xl font-bold text-[#242333]">
              {formatDuration(summary.durationMs)}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-[#F7F6FC] p-3.5">
            <div className="flex items-center gap-1.5 text-xs text-[#777584]">
              <LogIn className="h-3.5 w-3.5" />
              First check-in
            </div>

            <p className="mt-2 text-sm font-semibold text-[#242333]">
              {summary.checkInAt
                ? formatDateTime(summary.checkInAt)
                : "Not recorded"}
            </p>
          </div>

          <div className="rounded-2xl bg-[#FAF5E9] p-3.5">
            <div className="flex items-center gap-1.5 text-xs text-[#777584]">
              <Coffee className="h-3.5 w-3.5" />
              Breaks taken
            </div>

            <p className="mt-2 text-sm font-semibold text-[#242333]">
              {summary.breakCount}
              {summary.breakCount === 1 ? " break" : " breaks"}
            </p>
          </div>

          <div className="col-span-2 rounded-2xl bg-[#F2F6F0] p-3.5 sm:col-span-1">
            <div className="flex items-center gap-1.5 text-xs text-[#777584]">
              <Clock3 className="h-3.5 w-3.5" />
              Last activity
            </div>

            <p className="mt-2 text-sm font-semibold text-[#242333]">
              {latestAction
                ? ACTION_DETAILS[latestAction.action].label
                : "No activity"}
            </p>

            <p className="mt-1 text-xs text-[#777584]">
              {formatDateTime(latestAction?.recorded_at)}
            </p>
          </div>
        </div>

        <details className="group mt-5 border-t border-[#F0EEE9] pt-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl text-sm font-semibold text-[#5257C8] outline-none transition hover:text-[#4448B6] [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              View attendance history ({entry.actions.length})
            </span>

            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
          </summary>

          {entry.actions.length > 0 ? (
            <div className="mt-5 space-y-0">
              {entry.actions.map((action, index) => {
                const details = ACTION_DETAILS[action.action];
                const Icon = details.icon;
                const isLast = index === entry.actions.length - 1;

                return (
                  <div
                    key={action.id}
                    className="relative flex gap-3 pb-5 last:pb-0"
                  >
                    {!isLast && (
                      <span className="absolute bottom-0 left-[17px] top-9 w-px bg-[#EAE7E0]" />
                    )}

                    <div
                      className={`relative z-10 flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-xl ${details.background} ${details.color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="text-sm font-semibold text-[#242333]">
                        {details.label}
                      </p>

                      <p className="mt-1 text-xs text-[#777584]">
                        {formatDateTime(action.recorded_at)}
                      </p>
                    </div>

                    {isLast && (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#36965D]" />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-4 text-sm text-[#777584]">
              No attendance actions have been recorded.
            </p>
          )}
        </details>
      </div>
    </article>
  );
}

export function UserAttendanceView({
  events,
  userName,
  hasError = false,
}: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  // Initialise after hydration so elapsed time is consistent
  // between the server-rendered HTML and the browser.
  const [now, setNow] = useState(0);

  useEffect(() => {
    setNow(Date.now());

    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  const summaries = useMemo(
    () => events.map((entry) => buildSummary(entry, now)),
    [events, now]
  );

  const totalEvents = summaries.filter(
    (summary) => summary.hasCheckedIn
  ).length;

  const completedEvents = summaries.filter(
    (summary) => summary.state === "completed"
  ).length;

  const activeEvents = summaries.filter(
    (summary) => summary.state === "checked-in"
  ).length;

  const eventsOnBreak = summaries.filter(
    (summary) => summary.state === "on-break"
  ).length;

  const totalAttendedMs = summaries.reduce(
    (total, summary) => total + summary.durationMs,
    0
  );

  const filteredSummaries = summaries.filter((summary) => {
    const searchableText = [
      summary.entry.event.title,
      summary.entry.event.event_type,
      summary.entry.event.location ?? "",
      summary.entry.event.slug,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(
      search.trim().toLowerCase()
    );

    let matchesFilter = true;

    switch (filter) {
      case "active":
        matchesFilter = summary.state === "checked-in";
        break;

      case "on-break":
        matchesFilter = summary.state === "on-break";
        break;

      case "completed":
        matchesFilter = summary.state === "completed";
        break;

      case "all":
      default:
        matchesFilter = true;
    }

    return matchesSearch && matchesFilter;
  });

  const hasActiveFilters =
    search.trim().length > 0 || filter !== "all";

  function clearFilters() {
    setSearch("");
    setFilter("all");
  }

  const filters: {
    key: FilterKey;
    label: string;
    count: number;
  }[] = [
    {
      key: "all",
      label: "All events",
      count: summaries.length,
    },
    {
      key: "active",
      label: "Checked in",
      count: activeEvents,
    },
    {
      key: "on-break",
      label: "On break",
      count: eventsOnBreak,
    },
    {
      key: "completed",
      label: "Completed",
      count: completedEvents,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] px-4 py-7 text-[#242333] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div>
              <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-[#EAE7E0] bg-white px-3 py-1.5 text-xs font-semibold text-[#5257C8]">
                <ShieldCheck className="h-3.5 w-3.5" />
                YOUR ATTENDANCE
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Your attendance
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777584] sm:text-base">
                Hey {userName.split(" ")[0]}, here's your attendance
                across AWS SBG events, including your check-ins,
                breaks, and time attended.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-2xl border border-[#EAE7E0] bg-white px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DFF3E5] text-[#246C42]">
                <CalendarDays className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs text-[#898795]">
                  Recorded events
                </p>

                <p className="text-sm font-bold">
                  {totalEvents}{" "}
                  {totalEvents === 1 ? "event" : "events"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {hasError && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-[#F1C7BC] bg-[#FFF0EB] p-4 text-sm leading-6 text-[#A34327]"
          >
            We couldn't load your attendance right now. Please
            refresh the page to try again.
          </div>
        )}

        <section
          aria-label="Attendance summary"
          className="mb-9 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <StatCard
            label="Events attended"
            value={totalEvents}
            description="Events with a recorded check-in."
            icon={TicketCheck}
            className="bg-white"
            iconClassName="bg-[#E5F0FF] text-[#376DB6]"
          />

          <StatCard
            label="Completed"
            value={completedEvents}
            description="Events where you've checked out."
            icon={CheckCircle2}
            className="bg-[#F3F8F1]"
            iconClassName="bg-[#DFF3E5] text-[#27754A]"
          />

          <StatCard
            label="Currently checked in"
            value={activeEvents}
            description={
              eventsOnBreak > 0
                ? `${eventsOnBreak} ${eventsOnBreak === 1 ? "event has" : "events have"} a break in progress.`
                : "Your active attendance sessions."
            }
            icon={Activity}
            className="bg-[#F4F2FF]"
            iconClassName="bg-[#E8E3FF] text-[#5257C8]"
          />

          <StatCard
            label="Total attended time"
            value={formatDuration(totalAttendedMs)}
            description="Time across recorded sessions, excluding breaks."
            icon={Timer}
            className="bg-[#FFF6E8]"
            iconClassName="bg-[#FFE9C2] text-[#93691B]"
          />
        </section>

        <section aria-label="Attendance history">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                Attendance history
              </h2>

              <p className="mt-1 text-sm text-[#777584]">
                Every recorded check-in, break, and check-out,
                organised by event.
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#898795]" />

              <input
                type="search"
                aria-label="Search attendance history"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search events or locations..."
                className="w-full rounded-2xl border border-[#EAE7E0] bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-[#AAA7B2] focus:border-[#777BE0] focus:ring-4 focus:ring-[#5257C8]/10"
              />
            </div>
          </div>

          <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
            {filters.map((item) => {
              const selected = filter === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setFilter(item.key)}
                  aria-pressed={selected}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition ${
                    selected
                      ? "border-[#5257C8] bg-[#5257C8] text-white"
                      : "border-[#EAE7E0] bg-white text-[#777584] hover:border-[#D4D0EE] hover:text-[#5257C8]"
                  }`}
                >
                  {item.label}

                  <span
                    className={`rounded-lg px-1.5 py-0.5 text-xs ${
                      selected
                        ? "bg-white/15 text-white"
                        : "bg-[#F0EEE9] text-[#777584]"
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>

          {hasError ? (
            <div className="rounded-[28px] border border-[#EAE7E0] bg-white px-6 py-12 text-center">
              <p className="font-semibold">
                Attendance history is temporarily unavailable.
              </p>

              <p className="mt-2 text-sm text-[#777584]">
                Refresh the page to try again.
              </p>
            </div>
          ) : filteredSummaries.length > 0 ? (
            <div className="space-y-4">
              {filteredSummaries.map((summary) => (
                <AttendanceEventCard
                  key={summary.entry.event.id}
                  summary={summary}
                />
              ))}

              <p className="pt-2 text-center text-xs text-[#898795]">
                Showing {filteredSummaries.length} of{" "}
                {summaries.length}{" "}
                {summaries.length === 1
                  ? "event"
                  : "events"}
                .
              </p>
            </div>
          ) : (
            <EmptyState
              filtered={hasActiveFilters}
              onClear={clearFilters}
            />
          )}
        </section>

        <footer className="mt-8 flex items-start gap-3 rounded-2xl border border-[#EAE7E0] bg-white p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EFEBFF] text-[#5257C8]">
            <ShieldCheck className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-semibold">
              Your attendance records
            </p>

            <p className="mt-1 text-xs leading-5 text-[#777584]">
              This page shows attendance associated with your
              signed-in account. Break time is excluded from
              attended time. If a record appears incorrect, contact
              the event organisers.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}