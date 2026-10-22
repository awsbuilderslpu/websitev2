"use client";

import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  MapPin,
  ScanLine,
  Search,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

type AttendanceAction = {
  id: string;
  action: string;
  recorded_at: string;
  created_at: string;
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

type AttendanceEvent = {
  id: string;
  title: string;
  slug: string;
  event_type: string;
  location: string | null;
  start_at: string;
  end_at: string;
  is_published: boolean;
  is_cancelled: boolean;
};

type StatusFilter = "all" | AttendanceStatus;

const statusOptions: {
  value: StatusFilter;
  label: string;
  color: string;
}[] = [
  {
    value: "all",
    label: "Everyone",
    color: "#6252BD",
  },
  {
    value: "checked-in",
    label: "Checked in",
    color: "#287B56",
  },
  {
    value: "on-break",
    label: "On break",
    color: "#A56A00",
  },
  {
    value: "completed",
    label: "Completed",
    color: "#345DA8",
  },
  {
    value: "incomplete",
    label: "Incomplete",
    color: "#777584",
  },
];

const pageSizeOptions = [10, 20, 50];

export function EventAttendanceViewer({
  event,
  attendees,
}: {
  event: AttendanceEvent;
  attendees: Attendee[];
}) {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const counts = useMemo(
    () => ({
      participants: attendees.length,
      checkedIn: attendees.filter(
        (person) => person.status === "checked-in",
      ).length,
      onBreak: attendees.filter(
        (person) => person.status === "on-break",
      ).length,
      completed: attendees.filter(
        (person) => person.status === "completed",
      ).length,
      actions: attendees.reduce(
        (total, person) => total + person.actions.length,
        0,
      ),
    }),
    [attendees],
  );

  const filteredAttendees = useMemo(() => {
    const query = search.trim().toLowerCase();

    return attendees.filter((person) => {
      const matchesStatus =
        statusFilter === "all" ||
        person.status === statusFilter;

      const searchableText = [
        person.full_name,
        person.email,
        person.workspace_name,
        person.workspace_uid,
        person.user_id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        matchesStatus &&
        (!query || searchableText.includes(query))
      );
    });
  }, [attendees, search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAttendees.length / pageSize),
  );

  const currentPage = Math.min(page, totalPages);

  const visibleAttendees = filteredAttendees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const rangeStart =
    filteredAttendees.length === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;

  const rangeEnd = Math.min(
    currentPage * pageSize,
    filteredAttendees.length,
  );

  function applySearch(
    eventObject: FormEvent<HTMLFormElement>,
  ) {
    eventObject.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  }

  function clearFilters() {
    setSearchInput("");
    setSearch("");
    setStatusFilter("all");
    setPage(1);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#FAF9F6] text-[#242333]">
      <div className="mx-auto max-w-360 px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
        {/* Breadcrumb */}
        <Link
          href="/dashboard/attendance/manage"
          className="group inline-flex items-center gap-2 text-xs font-medium text-[#858292] transition-colors hover:text-[#6252BD]"
        >
          <ArrowLeft
            size={14}
            className="transition-transform group-hover:-translate-x-1"
          />
          Attendance management
        </Link>

        {/* Event overview */}
        <section className="relative mt-6 overflow-hidden rounded-[28px] border border-[#EAE6DE] bg-white p-5 sm:p-7 lg:p-9">
          <div className="pointer-events-none absolute -right-8 -top-12 h-44 w-44 rounded-full bg-[#FFD166]/30" />

          <div className="pointer-events-none absolute right-20 top-16 h-20 w-20 rounded-[25px] rotate-12 bg-[#B9C5FF]/35" />

          <div className="pointer-events-none absolute bottom-[-45px] right-48 h-28 w-28 rounded-full bg-[#9BCDB4]/25" />

          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFE5D8] px-3 py-1.5 text-[10px] font-semibold text-[#B84F28]">
                <Activity size={12} />
                Attendance workspace
              </span>

              <EventStatusBadge event={event} />
            </div>

            <div className="mt-5 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="min-w-0">
                <h1 className="max-w-4xl break-words text-3xl font-semibold leading-tight tracking-[-0.055em] sm:text-4xl lg:text-5xl">
                  {event.title}
                  <span className="text-[#F07832]">.</span>
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-[#777584]">
                  <span className="inline-flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFE5A5] text-[#A56A00]">
                      <CalendarDays size={14} />
                    </span>
                    {formatDate(event.start_at)}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E5E2FF] text-[#6252BD]">
                      <Clock3 size={14} />
                    </span>
                    {formatTime(event.start_at)}
                    {" – "}
                    {formatTime(event.end_at)}
                  </span>

                  {event.location && (
                    <span className="inline-flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DDF2E5] text-[#287B56]">
                        <MapPin size={14} />
                      </span>
                      {event.location}
                    </span>
                  )}
                </div>

                <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.13em] text-[#A6A2B0]">
                  {formatEventType(event.event_type)}
                  {"  /  "}
                  {event.slug}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <a
                  href={`/api/v1/admin/events/${event.id}/attendance/export`}
                  className="inline-flex items-center gap-2 rounded-full border border-[#EAE6DE] bg-white px-4 py-3 text-xs font-semibold transition-colors hover:border-[#D3CCFF] hover:bg-[#E5E2FF] hover:text-[#6252BD]"
                >
                  <Download size={15} />
                  Export CSV
                </a>

                <Link
                  href={`/dashboard/attendance/manage/${event.id}/scanner`}
                  className="inline-flex items-center gap-2 rounded-full bg-[#F07832] px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#D96120]"
                >
                  <ScanLine size={15} />
                  Open scanner
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Playful statistics */}
        <section className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-5">
          <MetricCard
            label="People tracked"
            value={counts.participants}
            caption="With attendance records"
            icon={<Users size={19} />}
            background="#E5E2FF"
            foreground="#6252BD"
            decoration="#C9C2FF"
          />

          <MetricCard
            label="Checked in"
            value={counts.checkedIn}
            caption="Currently attending"
            icon={<CheckCircle2 size={19} />}
            background="#DDF2E5"
            foreground="#287B56"
            decoration="#A8DFC0"
          />

          <MetricCard
            label="On a break"
            value={counts.onBreak}
            caption="Taking a breather"
            icon={<Clock3 size={19} />}
            background="#FFE5A5"
            foreground="#A56A00"
            decoration="#FFD166"
          />

          <MetricCard
            label="Completed"
            value={counts.completed}
            caption="Checked out"
            icon={<Check size={19} />}
            background="#DCEBFF"
            foreground="#345DA8"
            decoration="#AACBFF"
          />

          <MetricCard
            label="Actions"
            value={counts.actions}
            caption="Recorded timestamps"
            icon={<Activity size={19} />}
            background="#FFDCCF"
            foreground="#B84F28"
            decoration="#FFB69A"
          />
        </section>

        {/* Main attendance workspace */}
        <section className="mt-9 overflow-hidden rounded-[28px] border border-[#EAE6DE] bg-white">
          <div className="border-b border-[#F0EEE9] p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold tracking-[-0.04em]">
                    Who&apos;s here?
                  </h2>

                  <span className="rotate-[-8deg] text-xl text-[#F07832]">
                    ✳
                  </span>
                </div>

                <p className="mt-1.5 text-xs leading-5 text-[#858292]">
                  Find a participant and check their attendance story.
                </p>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#F5F3EF] px-3.5 py-2 text-[10px] font-semibold text-[#656474]">
                <Users size={13} className="text-[#6252BD]" />
                {filteredAttendees.length.toLocaleString("en-IN")}{" "}
                {filteredAttendees.length === 1
                  ? "person"
                  : "people"}
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <form
                onSubmit={applySearch}
                className="flex w-full gap-2 xl:max-w-lg"
              >
                <div className="relative min-w-0 flex-1">
                  <Search
                    size={15}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A6A2B0]"
                  />

                  <input
                    value={searchInput}
                    onChange={(eventObject) =>
                      setSearchInput(eventObject.target.value)
                    }
                    placeholder="Name, email, workspace UID..."
                    className="w-full rounded-2xl border border-[#EAE6DE] bg-[#FAF9F6] py-3.5 pl-10 pr-4 text-xs text-[#242333] outline-none transition-colors placeholder:text-[#A6A2B0] focus:border-[#B9B3F5]"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-2xl bg-[#242333] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#6252BD]"
                >
                  Find
                </button>
              </form>

              <div className="flex flex-wrap gap-1.5">
                {statusOptions.map((option) => {
                  const active =
                    statusFilter === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setStatusFilter(option.value);
                        setPage(1);
                      }}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2.5 text-[10px] font-semibold transition-colors ${
                        active
                          ? "border-[#242333] bg-[#242333] text-white"
                          : "border-[#EAE6DE] bg-white text-[#777584] hover:bg-[#FAF9F6]"
                      }`}
                    >
                      {active && (
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{
                            backgroundColor: option.color,
                          }}
                        />
                      )}

                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Participant cards */}
          <div className="bg-[#FAF9F6]/70 p-3 sm:p-5">
            {visibleAttendees.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-[#DCD8E8] bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#E5E2FF] text-[#6252BD]">
                  <Users size={24} />
                </div>

                <h3 className="mt-5 text-lg font-semibold tracking-[-0.03em]">
                  {attendees.length === 0
                    ? "It's a little quiet here."
                    : "No matches this time."}
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-[#858292]">
                  {attendees.length === 0
                    ? "Once attendance actions start rolling in, participants will show up here."
                    : "Try another name or switch up the status filter."}
                </p>

                {(search ||
                  searchInput ||
                  statusFilter !== "all") && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 rounded-full bg-[#E5E2FF] px-4 py-2.5 text-xs font-semibold text-[#6252BD] transition-colors hover:bg-[#D3CCFF]"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {visibleAttendees.map((attendee, index) => (
                  <AttendeeCard
                    key={attendee.user_id}
                    attendee={attendee}
                    index={
                      (currentPage - 1) * pageSize +
                      index +
                      1
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-4 border-t border-[#F0EEE9] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[11px] text-[#858292]">
                Showing{" "}
                <span className="font-semibold text-[#343348]">
                  {rangeStart}–{rangeEnd}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[#343348]">
                  {filteredAttendees.length}
                </span>
              </p>

              <select
                value={pageSize}
                onChange={(eventObject) => {
                  setPageSize(Number(eventObject.target.value));
                  setPage(1);
                }}
                aria-label="Participants per page"
                className="rounded-xl border border-[#EAE6DE] bg-[#FAF9F6] px-3 py-2 text-[10px] text-[#656474] outline-none focus:border-[#B9B3F5]"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size} per page
                  </option>
                ))}
              </select>
            </div>

            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </section>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 px-1">
          <p className="text-[10px] leading-5 text-[#A6A2B0]">
            One person, one summary. Every recorded action stays in their history.
          </p>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DDF2E5] px-3 py-1.5 text-[9px] font-semibold text-[#287B56]">
            <CheckCircle2 size={12} />
            Timestamps shown in IST
          </span>
        </div>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  caption,
  icon,
  background,
  foreground,
  decoration,
}: {
  label: string;
  value: number;
  caption: string;
  icon: ReactNode;
  background: string;
  foreground: string;
  decoration: string;
}) {
  return (
    <div
      className="group relative overflow-hidden rounded-[24px] p-4 transition-transform duration-200 hover:-translate-y-1 sm:p-5"
      style={{ backgroundColor: background }}
    >
      <div
        className="pointer-events-none absolute -right-5 -top-7 h-24 w-24 rounded-full transition-transform duration-500 group-hover:scale-125"
        style={{ backgroundColor: decoration }}
      />

      <div className="relative flex items-start justify-between gap-2">
        <div>
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.1em]"
            style={{ color: foreground }}
          >
            {label}
          </p>

          <p className="mt-5 text-3xl font-semibold tracking-[-0.07em] sm:text-4xl">
            {value.toLocaleString("en-IN")}
          </p>
        </div>

        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white/65"
          style={{ color: foreground }}
        >
          {icon}
        </div>
      </div>

      <p
        className="relative mt-2 text-[10px] leading-4"
        style={{ color: foreground, opacity: 0.8 }}
      >
        {caption}
      </p>
    </div>
  );
}

function AttendeeCard({
  attendee,
  index,
}: {
  attendee: Attendee;
  index: number;
}) {
  return (
    <article className="overflow-hidden rounded-[22px] border border-[#EAE6DE] bg-white transition-all duration-200 hover:border-[#D8D2F6] hover:shadow-[0_8px_25px_rgba(36,35,51,0.035)]">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          {/* Identity */}
          <div className="flex min-w-0 items-center gap-3.5">
            <span className="hidden w-5 shrink-0 font-mono text-[9px] text-[#C2BDCB] sm:block">
              {String(index).padStart(2, "0")}
            </span>

            <Avatar attendee={attendee} />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="break-words text-sm font-semibold text-[#343348]">
                  {attendee.full_name || "Unnamed user"}
                </h3>

                <StatusBadge status={attendee.status} />
              </div>

              <p className="mt-1 truncate text-xs text-[#858292]">
                {attendee.email || "No email available"}
              </p>

              {attendee.workspace_uid && (
                <p className="mt-1 truncate font-mono text-[9px] text-[#B0ACB9]">
                  {attendee.workspace_uid}
                </p>
              )}
            </div>
          </div>

          {/* Attendance times */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:min-w-[510px]">
            <TimeChip
              label="Checked in"
              value={attendee.checkin_at}
              background="#DDF2E5"
              foreground="#287B56"
              icon={<CheckCircle2 size={13} />}
            />

            <TimeChip
              label="Checked out"
              value={attendee.checkout_at}
              background="#DCEBFF"
              foreground="#345DA8"
              icon={<ArrowUpRight size={13} />}
            />

            <TimeChip
              label={`${attendee.break_count} ${
                attendee.break_count === 1 ? "break" : "breaks"
              }`}
              value={formatDuration(attendee.break_minutes)}
              background="#FFF0CD"
              foreground="#946100"
              icon={<Clock3 size={13} />}
            />
          </div>
        </div>

        {/* History toggle */}
        <details className="group/history mt-4 border-t border-[#F0EEE9] pt-3">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-2 py-2 transition-colors hover:bg-[#FAF9F6]">
            <span className="inline-flex items-center gap-2 text-[11px] font-medium text-[#777584]">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#E5E2FF] text-[#6252BD]">
                <Activity size={14} />
              </span>

              Attendance history

              <span className="rounded-full bg-[#F0EFF4] px-2 py-1 text-[9px] text-[#656474]">
                {attendee.actions.length}
              </span>
            </span>

            <ChevronDown
              size={15}
              className="text-[#A6A2B0] transition-transform group-open/history:rotate-180"
            />
          </summary>

          <div className="mt-3 rounded-2xl bg-[#FAF9F6] p-3 sm:p-4">
            {attendee.actions.length === 0 ? (
              <p className="py-4 text-center text-xs text-[#858292]">
                No recorded actions.
              </p>
            ) : (
              <div className="space-y-2">
                {attendee.actions.map((action, actionIndex) => (
                  <ActionRow
                    key={action.id}
                    action={action}
                    index={actionIndex}
                  />
                ))}
              </div>
            )}
          </div>
        </details>
      </div>
    </article>
  );
}

function TimeChip({
  label,
  value,
  background,
  foreground,
  icon,
}: {
  label: string;
  value: string | null;
  background: string;
  foreground: string;
  icon: ReactNode;
}) {
  return (
    <div
      className="min-w-0 rounded-2xl p-3"
      style={{ backgroundColor: background }}
    >
      <div
        className="flex items-center gap-1.5 text-[9px] font-semibold"
        style={{ color: foreground }}
      >
        {icon}
        <span className="truncate">{label}</span>
      </div>

      <p
        className="mt-2 text-[11px] font-semibold"
        style={{ color: foreground }}
      >
        {value || "—"}
      </p>
    </div>
  );
}

function ActionRow({
  action,
  index,
}: {
  action: AttendanceAction;
  index: number;
}) {
  const style = getActionStyle(action.action);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#EAE6DE]/75 bg-white px-3 py-3 sm:px-4">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{
          backgroundColor: style.background,
          color: style.foreground,
        }}
      >
        {style.icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-[#343348]">
          {formatAction(action.action)}
        </p>

        <p className="mt-1 text-[9px] text-[#A6A2B0]">
          Action {String(index + 1).padStart(2, "0")}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-[10px] font-semibold text-[#656474] sm:text-xs">
          {formatDateTime(action.recorded_at)}
        </p>

        <p className="mt-1 text-[9px] text-[#B0ACB9]">
          Record created {formatTime(action.created_at)}
        </p>
      </div>
    </div>
  );
}

function Avatar({
  attendee,
}: {
  attendee: Attendee;
}) {
  const initials =
    attendee.full_name
      ?.split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "?";

  return (
    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl bg-[#E5E2FF]">
      {attendee.avatar_url ? (
        <Image
          src={attendee.avatar_url}
          alt={attendee.full_name || "Participant"}
          fill
          sizes="44px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-[#6252BD]">
          {initials}
        </div>
      )}
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: AttendanceStatus;
}) {
  const styles: Record<
    AttendanceStatus,
    { background: string; foreground: string; label: string }
  > = {
    "checked-in": {
      background: "#DDF2E5",
      foreground: "#287B56",
      label: "Checked in",
    },
    "on-break": {
      background: "#FFE5A5",
      foreground: "#946100",
      label: "On break",
    },
    completed: {
      background: "#DCEBFF",
      foreground: "#345DA8",
      label: "Completed",
    },
    incomplete: {
      background: "#F0EFF4",
      foreground: "#777584",
      label: "Incomplete",
    },
  };

  const style = styles[status];

  return (
    <span
      className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-semibold"
      style={{
        backgroundColor: style.background,
        color: style.foreground,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {style.label}
    </span>
  );
}

function EventStatusBadge({
  event,
}: {
  event: AttendanceEvent;
}) {
  const status = event.is_cancelled
    ? "Cancelled"
    : !event.is_published
      ? "Draft"
      : Date.now() < new Date(event.start_at).getTime()
        ? "Upcoming"
        : Date.now() <= new Date(event.end_at).getTime()
          ? "Ongoing"
          : "Past";

  const styles: Record<string, { background: string; foreground: string }> = {
    Upcoming: { background: "#DCEBFF", foreground: "#345DA8" },
    Ongoing: { background: "#DDF2E5", foreground: "#287B56" },
    Past: { background: "#F0EFF4", foreground: "#656474" },
    Draft: { background: "#FFE5A5", foreground: "#946100" },
    Cancelled: { background: "#FFE5E0", foreground: "#B84F28" },
  };

  const style = styles[status];

  return (
    <span
      className="rounded-full px-3 py-1.5 text-[10px] font-semibold"
      style={{
        backgroundColor: style.background,
        color: style.foreground,
      }}
    >
      {status}
    </span>
  );
}

function MetricCardLabel({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="text-[10px] font-semibold uppercase tracking-[0.1em]">
      {children}
    </span>
  );
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EAE6DE] text-[#656474] transition-colors hover:bg-[#F5F3EF] disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      <span className="min-w-16 text-center text-xs text-[#858292]">
        {page} / {totalPages}
      </span>

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EAE6DE] text-[#656474] transition-colors hover:bg-[#F5F3EF] disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

function getActionStyle(action: string) {
  if (action === "checkin") {
    return {
      background: "#DDF2E5",
      foreground: "#287B56",
      icon: <CheckCircle2 size={16} />,
    };
  }

  if (action === "checkout") {
    return {
      background: "#DCEBFF",
      foreground: "#345DA8",
      icon: <ArrowUpRight size={16} />,
    };
  }

  if (action === "start_break") {
    return {
      background: "#FFE5A5",
      foreground: "#946100",
      icon: <Clock3 size={16} />,
    };
  }

  if (action === "end_break") {
    return {
      background: "#E5E2FF",
      foreground: "#6252BD",
      icon: <Check size={16} />,
    };
  }

  return {
    background: "#F0EFF4",
    foreground: "#656474",
    icon: <Activity size={16} />,
  };
}

function formatAction(action: string) {
  const labels: Record<string, string> = {
    checkin: "Checked in",
    checkout: "Checked out",
    start_break: "Break started",
    end_break: "Break ended",
  };

  return labels[action] ?? action;
}

function formatEventType(type: string) {
  const labels: Record<string, string> = {
    offline: "In person",
    online: "Online",
    hybrid: "Hybrid",
  };

  return labels[type] ?? type;
}

function formatDuration(minutes: number) {
  if (minutes <= 0) {
    return "0 min";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}