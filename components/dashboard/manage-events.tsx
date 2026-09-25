"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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

type Filter =
  | "all"
  | "published"
  | "draft"
  | "cancelled";

export function ManageEvents() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadEvents() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/v1/admin/events",
        {
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to fetch events",
        );
      }

      setEvents(data.events ?? []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch events",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function deleteEvent(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/v1/admin/events/${id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete event",
        );
      }

      setEvents((current) =>
        current.filter((event) => event.id !== id),
      );
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to delete event",
      );
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
        (filter === "cancelled" &&
          event.is_cancelled);

      return matchesSearch && matchesFilter;
    });
  }, [events, search, filter]);

  return (
    <main className="min-h-screen bg-[#111827] text-[#F5F5F5]">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-360 px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[#B45CFF]">
                <span className="h-px w-8 bg-[#A855F7]" />
                Administration
              </div>

              <h1 className="text-5xl font-bold tracking-[-0.055em] sm:text-6xl">
                Manage Events.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-[#8F96A5]">
                Create, publish, update, and manage the
                community&apos;s events.
              </p>
            </div>

            <Link
              href="/dashboard/events/new"
              className="inline-flex w-fit items-center gap-2 bg-[#A855F7] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#B45CFF]"
            >
              <Plus size={17} />
              Create Event
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-360 px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["all", "All"],
                ["published", "Published"],
                ["draft", "Drafts"],
                ["cancelled", "Cancelled"],
              ] as [Filter, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`px-4 py-2 text-xs font-medium transition-colors ${
                  filter === value
                    ? "bg-[#A855F7] text-white"
                    : "border border-white/10 text-[#8F96A5] hover:border-[#A855F7] hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search events..."
            className="w-full border border-white/10 bg-[#0D1421] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-[#596273] focus:border-[#A855F7] lg:max-w-sm"
          />
        </div>

        {loading ? (
          <div className="py-20 text-center text-sm text-[#737B8C]">
            Loading events...
          </div>
        ) : error ? (
          <div className="border border-red-400/20 bg-red-400/5 p-6 text-sm text-red-300">
            {error}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="border-b border-white/10 py-20 text-center">
            <CalendarDays
              size={30}
              className="mx-auto text-[#596273]"
            />

            <p className="mt-4 text-lg font-medium">
              No events found.
            </p>

            <p className="mt-2 text-sm text-[#737B8C]">
              Create an event or change your filters.
            </p>
          </div>
        ) : (
          <div className="border-b border-white/10">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className="group grid gap-6 border-t border-white/10 py-7 lg:grid-cols-[55px_1fr_auto] lg:items-center lg:gap-8"
              >
                <span className="font-mono text-xs text-[#596273]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <Link
                  href={`/dashboard/events/${event.id}`}
                  className="min-w-0"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="truncate text-xl font-semibold tracking-tight transition-colors group-hover:text-[#B45CFF]">
                      {event.title}
                    </h2>

                    <StatusBadge event={event} />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#737B8C]">
                    <span className="flex items-center gap-2">
                      <Clock3 size={13} />
                      {formatDate(event.start_at)}
                    </span>

                    <span className="capitalize">
                      {event.event_type}
                    </span>

                    {event.location && (
                      <span>{event.location}</span>
                    )}
                  </div>

                  <p className="mt-2 text-xs text-[#596273]">
                    /{event.slug}
                  </p>
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/events/${event.id}`}
                    className="flex h-10 w-10 items-center justify-center border border-white/10 text-[#8F96A5] transition-colors hover:border-[#A855F7] hover:bg-[#A855F7] hover:text-white"
                    aria-label={`Edit ${event.title}`}
                  >
                    <ArrowUpRight size={16} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => deleteEvent(event.id)}
                    className="flex h-10 w-10 items-center justify-center border border-white/10 text-[#8F96A5] transition-colors hover:border-red-400 hover:bg-red-400 hover:text-white"
                    aria-label={`Delete ${event.title}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function StatusBadge({
  event,
}: {
  event: AdminEvent;
}) {
  if (event.is_cancelled) {
    return (
      <span className="inline-flex items-center gap-1.5 border border-red-400/20 bg-red-400/5 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-red-300">
        <X size={11} />
        Cancelled
      </span>
    );
  }

  if (event.is_published) {
    return (
      <span className="inline-flex items-center gap-1.5 border border-emerald-400/20 bg-emerald-400/5 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-emerald-300">
        <Check size={11} />
        Published
      </span>
    );
  }

  return (
    <span className="inline-flex items-center border border-white/10 bg-white/3 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#8F96A5]">
      Draft
    </span>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}