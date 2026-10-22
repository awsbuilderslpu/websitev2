"use client";

import {
  Activity,
  ArrowDownAZ,
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  MapPin,
  ScanLine,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { AttendanceEvent } from "@/app/dashboard/attendance/manage/page";

type StatusFilter = "All" | AttendanceEvent["status"];

const statusOptions: StatusFilter[] = [
  "All",
  "Ongoing",
  "Upcoming",
  "Past",
  "Draft",
  "Cancelled",
];

const pageSizes = [10, 20, 50];

export function AttendanceEventsTable({
  events,
}: {
  events: AttendanceEvent[];
}) {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("All");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortNewestFirst, setSortNewestFirst] =
    useState(true);

  const filteredEvents = useMemo(() => {
    const query = search.toLowerCase().trim();

    return events
      .filter((event) => {
        const matchesStatus =
          statusFilter === "All" ||
          event.status === statusFilter;

        const searchableText = [
          event.title,
          event.slug,
          event.location,
          event.event_type,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return (
          matchesStatus &&
          (!query || searchableText.includes(query))
        );
      })
      .sort((a, b) => {
        const difference =
          new Date(a.start_at).getTime() -
          new Date(b.start_at).getTime();

        return sortNewestFirst
          ? -difference
          : difference;
      });
  }, [events, search, statusFilter, sortNewestFirst]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEvents.length / pageSize),
  );

  const currentPage = Math.min(page, totalPages);

  const visibleEvents = filteredEvents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const start =
    filteredEvents.length === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;

  const end = Math.min(
    currentPage * pageSize,
    filteredEvents.length,
  );

  function applySearch(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  }

  function changeStatus(nextStatus: StatusFilter) {
    setStatusFilter(nextStatus);
    setPage(1);
  }

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-[#EAE6DE] bg-white">
      {/* Search and filters */}
      <div className="border-b border-[#F0EEE9] p-4 sm:p-5">
        <form
          onSubmit={applySearch}
          className="flex w-full gap-2"
        >
          <div className="relative min-w-0 flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A6A2B0]"
            />

            <input
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
              }
              placeholder="Search events, locations, or slugs..."
              className="w-full rounded-xl border border-[#EAE6DE] bg-[#FAF9F6] py-3 pl-11 pr-4 text-sm text-[#242333] outline-none transition-colors placeholder:text-[#A6A2B0] focus:border-[#B9B3F5]"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-[#242333] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#5257C8] sm:px-5"
          >
            Search
          </button>
        </form>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {statusOptions.map((status) => {
              const active = statusFilter === status;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => changeStatus(status)}
                  className={`rounded-full px-3 py-2 text-[11px] font-medium transition-colors ${
                    active
                      ? "bg-[#E5E2FF] text-[#6252BD]"
                      : "text-[#858292] hover:bg-[#F5F3EF] hover:text-[#343348]"
                  }`}
                >
                  {status}
                  {status === "All" && (
                    <span className="ml-1.5 opacity-65">
                      {events.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              setSortNewestFirst((current) => !current);
              setPage(1);
            }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[#EAE6DE] px-3 py-2 text-[11px] font-medium text-[#656474] transition-colors hover:bg-[#FAF9F6]"
          >
            <ArrowDownAZ size={14} />
            {sortNewestFirst
              ? "Newest first"
              : "Oldest first"}
          </button>
        </div>
      </div>

      {/* Table header */}
      <div className="hidden grid-cols-[minmax(0,1fr)_150px_130px_170px] gap-4 bg-[#FAF9F6] px-5 py-3.5 lg:grid">
        <TableHeading>Event</TableHeading>
        <TableHeading>Date</TableHeading>
        <TableHeading>Activity</TableHeading>
        <TableHeading>Actions</TableHeading>
      </div>

      {/* Event rows */}
      {visibleEvents.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E5E2FF] text-[#6252BD]">
            <CalendarDays size={22} />
          </div>

          <h3 className="mt-4 text-base font-semibold">
            No matching events
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#858292]">
            Try another search term or select a different
            status filter.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSearchInput("");
              setStatusFilter("All");
              setPage(1);
            }}
            className="mt-4 text-xs font-semibold text-[#6252BD] hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div>
          {visibleEvents.map((event) => (
            <EventRow
              key={event.id}
              event={event}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col gap-4 border-t border-[#F0EEE9] bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs text-[#858292]">
            Showing{" "}
            <span className="font-medium text-[#343348]">
              {start}–{end}
            </span>{" "}
            of{" "}
            <span className="font-medium text-[#343348]">
              {filteredEvents.length}
            </span>
          </p>

          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
            className="rounded-lg border border-[#EAE6DE] bg-[#FAF9F6] px-2.5 py-2 text-[11px] text-[#656474] outline-none focus:border-[#B9B3F5]"
            aria-label="Events per page"
          >
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EAE6DE] text-[#656474] transition-colors hover:bg-[#F5F3EF] disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="min-w-16 text-center text-xs text-[#858292]">
            {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EAE6DE] text-[#656474] transition-colors hover:bg-[#F5F3EF] disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function EventRow({
  event,
}: {
  event: AttendanceEvent;
}) {
  return (
    <article className="border-b border-[#F0EEE9] px-4 py-5 transition-colors last:border-b-0 hover:bg-[#FFFEFC] sm:px-5 sm:py-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_150px_130px_170px] lg:items-center lg:gap-4">
        {/* Event identity */}
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              event.status === "Ongoing"
                ? "bg-[#DDF2E5] text-[#287B56]"
                : event.status === "Cancelled"
                  ? "bg-[#FFE5E0] text-[#B84F28]"
                  : "bg-[#E5E2FF] text-[#6252BD]"
            }`}
          >
            <CalendarDays size={18} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/dashboard/attendance/manage/${event.id}`}
                className="break-words text-sm font-semibold text-[#343348] transition-colors hover:text-[#6252BD]"
              >
                {event.title}
              </Link>

              <StatusBadge status={event.status} />
            </div>

            <p className="mt-1.5 break-all text-[11px] text-[#A6A2B0]">
              {event.slug}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[#858292]">
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={12} />
                {formatTime(event.start_at)}
                {" – "}
                {formatTime(event.end_at)}
              </span>

              {event.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={12} />
                  {event.location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 pl-[52px] text-xs text-[#656474] lg:pl-0">
          <span className="text-[#A6A2B0] lg:hidden">
            Date:
          </span>

          {formatDate(event.start_at)}
        </div>

        {/* Activity */}
        <div className="flex items-center gap-2 pl-[52px] lg:pl-0">
          <Activity
            size={15}
            className="text-[#6252BD]"
          />

          <div>
            <p className="text-sm font-semibold text-[#343348]">
              {event.attendanceActionCount.toLocaleString(
                "en-IN",
              )}
            </p>

            <p className="text-[10px] text-[#A6A2B0]">
              Recorded actions
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pl-[52px] lg:pl-0">
          <Link
            href={`/dashboard/attendance/manage/${event.id}`}
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#E5E2FF] px-3 text-[11px] font-semibold text-[#6252BD] transition-colors hover:bg-[#D3CCFF]"
          >
            View
            <ArrowUpRight size={13} />
          </Link>

          <a
            href={`/api/v1/admin/events/${event.id}/attendance/export`}
            download
            title="Download attendance CSV"
            aria-label={`Download ${event.title} attendance CSV`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#EAE6DE] text-[#656474] transition-colors hover:border-[#F07832] hover:bg-[#FFF0E5] hover:text-[#B84F28]"
          >
            <Download size={15} />
          </a>

          <Link
            href={`/dashboard/attendance/manage/${event.id}/scanner`}
            title="Open attendance scanner"
            aria-label={`Open scanner for ${event.title}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F07832] text-white transition-colors hover:bg-[#D96120]"
          >
            <ScanLine size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function StatusBadge({
  status,
}: {
  status: AttendanceEvent["status"];
}) {
  const styles: Record<AttendanceEvent["status"], string> = {
    Ongoing: "bg-[#DDF2E5] text-[#287B56]",
    Upcoming: "bg-[#DCEBFF] text-[#345DA8]",
    Past: "bg-[#F0EFF4] text-[#656474]",
    Draft: "bg-[#FFE5A5] text-[#8A5A00]",
    Cancelled: "bg-[#FFE5E0] text-[#B84F28]",
  };

  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-2 py-1 text-[9px] font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function TableHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A6A2B0]">
      {children}
    </div>
  );
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