
"use client";

import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type AdminEvent = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  event_type: "offline" | "online" | "hybrid";
  location: string | null;
  online_url: string | null;
  start_at: string;
  end_at: string;
  registration_deadline: string;
  is_paid: boolean;
  is_published: boolean;
  is_cancelled: boolean;
  cancelled_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

type Filter = "all" | "published" | "draft" | "cancelled";

const filters: { value: Filter; label: string; color: string; ink: string }[] = [
  { value: "all", label: "Everything", color: "#E5E2FF", ink: "#6252BD" },
  { value: "published", label: "Live", color: "#DDF2E5", ink: "#287B56" },
  { value: "draft", label: "In the works", color: "#FFE5A5", ink: "#8C6200" },
  { value: "cancelled", label: "Cancelled", color: "#FFDCCF", ink: "#B84F28" },
];

const eventColors = [
  { background: "#E5E2FF", ink: "#6252BD", shape: "#C8BFFF", label: "A little violet" },
  { background: "#FFE5A5", ink: "#875A00", shape: "#FFD36B", label: "Butter yellow" },
  { background: "#DDF2E5", ink: "#287B56", shape: "#B5E3C9", label: "Mint green" },
  { background: "#FFDCCF", ink: "#B84F28", shape: "#FFBEA7", label: "Peachy" },
  { background: "#DCEBFF", ink: "#365CA8", shape: "#B9D3FF", label: "Sky blue" },
  { background: "#F9DDF0", ink: "#A03F79", shape: "#F3B8DB", label: "Pink pop" },
];

export function ManageEvents() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/v1/admin/events", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch events");
      }

      setEvents(data.events ?? []);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch events",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  async function deleteEvent(id: string) {
    const event = events.find((item) => item.id === id);

    if (!event || deletingId) return;

    const confirmed = window.confirm(
      `Delete "${event.title}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      const response = await fetch(`/api/v1/admin/events/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete event");
      }

      setEvents((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete event",
      );
    } finally {
      setDeletingId(null);
    }
  }

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesSearch =
        !query ||
        event.title.toLowerCase().includes(query) ||
        event.slug.toLowerCase().includes(query);

      const matchesFilter =
        filter === "all" ||
        (filter === "published" &&
          event.is_published &&
          !event.is_cancelled) ||
        (filter === "draft" &&
          !event.is_published &&
          !event.is_cancelled) ||
        (filter === "cancelled" && event.is_cancelled);

      return matchesSearch && matchesFilter;
    });
  }, [events, search, filter]);

  const counts = useMemo(
    () => ({
      all: events.length,
      published: events.filter(
        (event) => event.is_published && !event.is_cancelled,
      ).length,
      draft: events.filter(
        (event) => !event.is_published && !event.is_cancelled,
      ).length,
      cancelled: events.filter((event) => event.is_cancelled).length,
    }),
    [events],
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FAF9F6] text-[#242333]">
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#E5E2FF]/60 blur-3xl" />
      <div className="pointer-events-none absolute -left-28 top-[38rem] h-80 w-80 rounded-full bg-[#FFE5A5]/35 blur-3xl" />

      <div className="relative mx-auto max-w-[1440px] px-5 py-7 sm:px-8 sm:py-9 lg:px-12">
        <header className="relative">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#777584]">
            <span className="rounded-full border border-[#EAE6DE] bg-white px-3 py-1.5">
              AWS Student Builder Group
            </span>
            <span className="text-[#D1CBC1]">/</span>
            <span>Event studio</span>
          </div>

          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-[clamp(2.8rem,7vw,5.8rem)] font-semibold leading-[0.94] tracking-[-0.085em]">
                A little something
                <br />
                is <span className="font-serif font-medium italic text-[#6252BD]">happening.</span>
                <span className="text-[#F07832]">✳</span>
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-6 text-[#777584] sm:text-base">
                Workshops, meetups, build nights and big ideas. Make the next
                community moment happen.
              </p>
            </div>

            <Link
              href="/dashboard/events/new"
              className="group inline-flex w-fit shrink-0 items-center gap-3 rounded-full bg-[#F07832] px-5 py-3.5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-1 hover:bg-[#DB6524] hover:shadow-[0_8px_24px_rgba(240,120,50,0.22)]"
            >
              <Plus size={17} strokeWidth={2.5} />
              Make an event
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          <div className="mt-7 flex items-center gap-3">
            <div className="flex -space-x-2">
              {eventColors.slice(0, 4).map((color) => (
                <span
                  key={color.label}
                  className="h-5 w-5 rounded-full border-2 border-[#FAF9F6]"
                  style={{ backgroundColor: color.shape }}
                />
              ))}
            </div>
            <p className="text-xs text-[#777584]">
              <span className="font-semibold text-[#242333]">
                {events.length} {events.length === 1 ? "event" : "events"}
              </span>{" "}
              in your community collection
            </p>
          </div>
        </header>

        <section className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {filters.map((item, index) => {
            const active = filter === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`group relative min-h-[122px] overflow-hidden rounded-[1.35rem] border p-4 text-left transition duration-200 hover:-translate-y-1 sm:min-h-[142px] sm:p-5 ${
                  active
                    ? "border-transparent shadow-[0_8px_25px_rgba(36,35,51,0.07)]"
                    : "border-[#EAE6DE] bg-white/70 hover:border-transparent hover:shadow-[0_8px_25px_rgba(36,35,51,0.05)]"
                }`}
                style={active ? { backgroundColor: item.color } : undefined}
              >
                <span
                  className="absolute -right-4 -top-5 h-20 w-20 rounded-full opacity-60 transition-transform duration-300 group-hover:scale-125"
                  style={{ backgroundColor: item.color }}
                />
                <span className="relative flex items-start justify-between gap-2">
                  <span
                    className="text-3xl font-semibold tracking-[-0.07em] sm:text-4xl"
                    style={{ color: active ? item.ink : "#242333" }}
                  >
                    {counts[item.value]}
                  </span>
                  {active && (
                    <Check
                      size={16}
                      className="mt-1 shrink-0"
                      style={{ color: item.ink }}
                    />
                  )}
                </span>
                <span className="relative mt-4 block text-xs font-semibold sm:text-sm">
                  {item.label}
                </span>
                <span
                  className="relative mt-1 block text-[10px] sm:text-xs"
                  style={{ color: active ? item.ink : "#9693A1" }}
                >
                  {item.value === "all" && "The whole collection"}
                  {item.value === "published" && "Out in the world"}
                  {item.value === "draft" && "Still taking shape"}
                  {item.value === "cancelled" && "Called off"}
                </span>
              </button>
            );
          })}
        </section>

        <section className="mt-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F07832]">
                The community calendar
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.06em] sm:text-3xl">
                Your events, your way
                <span className="text-[#6252BD]">.</span>
              </h2>
              <p className="mt-1.5 text-xs text-[#9693A1]">
                Find one, tweak one, or dream up the next one.
              </p>
            </div>

            <label className="flex w-full items-center gap-3 rounded-full border border-[#EAE6DE] bg-white px-4 py-3 transition focus-within:border-[#BDB3F0] focus-within:shadow-[0_0_0_3px_rgba(98,82,189,0.08)] sm:max-w-sm">
              <Search size={17} className="shrink-0 text-[#9693A1]" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Find an event..."
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#A5A2AD]"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-[#9693A1] transition hover:text-[#242333]"
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </label>
          </div>

          {error && (
            <div className="mt-5 flex items-start justify-between gap-3 rounded-2xl border border-[#F2C7BA] bg-[#FFF0EA] p-4 text-sm text-[#A43F2A]">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Dismiss error"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {loading ? (
            <div className="mt-6 flex items-center gap-3 rounded-[1.5rem] border border-[#EAE6DE] bg-white/70 p-8 text-sm text-[#777584]">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#E5E2FF] border-t-[#6252BD]" />
              Gathering the good stuff...
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="relative mt-6 overflow-hidden rounded-[2rem] border border-dashed border-[#D8D3CA] bg-white/60 px-6 py-16 text-center">
              <span className="absolute -right-5 -top-8 h-28 w-28 rounded-full bg-[#FFE5A5]/70" />
              <span className="absolute -bottom-8 -left-5 h-24 w-24 rounded-full bg-[#E5E2FF]/70" />
              <div className="relative mx-auto flex h-14 w-14 rotate-[-8deg] items-center justify-center rounded-[1.25rem] bg-[#E5E2FF] text-[#6252BD]">
                <Sparkles size={25} />
              </div>
              <h3 className="relative mt-5 text-2xl font-semibold tracking-[-0.06em]">
                Nothing on the board. Yet.
              </h3>
              <p className="relative mx-auto mt-2 max-w-sm text-sm leading-6 text-[#777584]">
                {search
                  ? "No matches this time. Try a different search or switch up the filters."
                  : "Every great community moment starts somewhere. This could be your sign."}
              </p>
              {!search && filter === "all" && (
                <Link
                  href="/dashboard/events/new"
                  className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-[#242333] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6252BD]"
                >
                  <Plus size={16} />
                  Create your first event
                </Link>
              )}
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredEvents.map((event, index) => {
                const palette = eventColors[index % eventColors.length];

                return (
                  <article
                    key={event.id}
                    className="group relative flex min-w-0 flex-col overflow-hidden rounded-[1.6rem] border border-[#EAE6DE] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#D8D0F8] hover:shadow-[0_16px_40px_rgba(36,35,51,0.08)]"
                  >
                    <div
                      className="relative min-h-[178px] overflow-hidden p-5 sm:p-6"
                      style={{ backgroundColor: palette.background }}
                    >
                      <span
                        className="absolute -right-7 -top-10 h-36 w-36 rounded-full transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundColor: palette.shape }}
                      />
                      <span
                        className="absolute -bottom-12 right-20 h-24 w-24 rotate-[-22deg] rounded-[2rem] transition-transform duration-500 group-hover:rotate-[-12deg]"
                        style={{ backgroundColor: palette.shape }}
                      />
                      <span className="relative inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: palette.ink }}>
                        <CalendarDays size={12} />
                        {formatMonth(event.start_at)}
                      </span>

                      <div className="relative mt-5 flex items-end justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: palette.ink }}>
                            {formatWeekday(event.start_at)}
                          </p>
                          <p className="mt-0.5 text-5xl font-semibold leading-none tracking-[-0.09em]" style={{ color: palette.ink }}>
                            {formatDay(event.start_at)}
                          </p>
                        </div>
                        <div className="mb-1 flex h-11 w-11 shrink-0 rotate-3 items-center justify-center rounded-[1.1rem] border border-white/70 bg-white/60 transition-transform duration-300 group-hover:rotate-[-5deg]">
                          <ArrowDownRight size={23} style={{ color: palette.ink }} />
                        </div>
                      </div>

                      <span className="absolute right-5 top-5 text-2xl opacity-70" style={{ color: palette.ink }}>
                        {index % 3 === 0 ? "✳" : index % 3 === 1 ? "✦" : "✷"}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge event={event} />
                        <span className="rounded-full bg-[#F5F2EC] px-2.5 py-1 text-[10px] font-semibold capitalize text-[#777584]">
                          {event.event_type}
                        </span>
                        {event.is_paid && (
                          <span className="rounded-full bg-[#FFE5A5] px-2.5 py-1 text-[10px] font-semibold text-[#875A00]">
                            Paid
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/dashboard/events/${event.id}`}
                        className="mt-4 block"
                      >
                        <h3 className="line-clamp-2 text-xl font-semibold leading-snug tracking-[-0.055em] transition-colors group-hover:text-[#6252BD]">
                          {event.title}
                        </h3>
                      </Link>

                      <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-[#777584]">
                        {event.description || "A new community moment is taking shape."}
                      </p>

                      <div className="mt-4 space-y-2 border-t border-[#F0EEE9] pt-4 text-xs text-[#777584]">
                        <div className="flex items-start gap-2">
                          <Clock3 size={14} className="mt-0.5 shrink-0 text-[#F07832]" />
                          <span>{formatDate(event.start_at)}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-start gap-2">
                            <MapPin size={14} className="mt-0.5 shrink-0 text-[#6252BD]" />
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                        )}
                        <p className="truncate pl-[22px] text-[10px] text-[#A5A2AD]">
                          /{event.slug}
                        </p>
                      </div>

                      <div className="mt-5 flex items-center gap-2">
                        <Link
                          href={`/dashboard/events/${event.id}`}
                          className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full bg-[#242333] px-4 text-xs font-semibold text-white transition hover:bg-[#6252BD]"
                        >
                          Manage event
                          <ArrowUpRight size={14} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => deleteEvent(event.id)}
                          disabled={deletingId !== null}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#EAE6DE] text-[#9693A1] transition hover:border-[#F2C7BA] hover:bg-[#FFF0EA] hover:text-[#B84F28] disabled:cursor-wait disabled:opacity-40"
                          aria-label={`Delete ${event.title}`}
                          title="Delete event"
                        >
                          {deletingId === event.id ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#FFDCCF] border-t-[#B84F28]" />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!loading && filteredEvents.length > 0 && (
            <p className="mt-5 text-center text-[11px] text-[#9693A1]">
              Showing {filteredEvents.length} of {events.length} events · Made
              for builders, by builders.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

function StatusBadge({ event }: { event: AdminEvent }) {
  if (event.is_cancelled) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#FFDCCF] px-2.5 py-1 text-[10px] font-semibold text-[#B84F28]">
        <X size={11} />
        Cancelled
      </span>
    );
  }

  if (event.is_published) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#DDF2E5] px-2.5 py-1 text-[10px] font-semibold text-[#287B56]">
        <Check size={11} />
        Published
      </span>
    );
  }

  return (
    <span className="rounded-full bg-[#F0EEE9] px-2.5 py-1 text-[10px] font-semibold text-[#777584]">
      Draft
    </span>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatMonth(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
  })
    .format(date)
    .toUpperCase();
}

function formatDay(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
  }).format(date);
}

function formatWeekday(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date to be confirmed";

  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
  }).format(date);
}
