import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Monitor,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getPublicEvents, type Event } from "@/lib/events";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatMonth(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
  })
    .format(new Date(date))
    .toUpperCase();
}

function formatDay(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
  }).format(new Date(date));
}

function formatTime(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function isUpcoming(date: string) {
  return new Date(date).getTime() >= Date.now();
}

function getEventType(event: Event) {
  if (event.event_type === "online") return "Online";
  if (event.event_type === "hybrid") return "Hybrid";
  return "In person";
}

function getEventColor(index: number) {
  return [
    {
      background: "#FFD166",
      text: "#614615",
      accent: "#F07832",
    },
    {
      background: "#DCD9FF",
      text: "#4545A0",
      accent: "#5257C8",
    },
    {
      background: "#DDF2E5",
      text: "#286746",
      accent: "#43956B",
    },
    {
      background: "#FFD9C8",
      text: "#91472D",
      accent: "#F07832",
    },
  ][index % 4];
}

export default async function EventsPage() {
  let events: Event[] = [];

  try {
    events = await getPublicEvents();
  } catch (error) {
    console.error("Failed to load events:", error);
  }

  const sortedEvents = [...events].sort(
    (a, b) =>
      new Date(a.start_at).getTime() - new Date(b.start_at).getTime(),
  );

  const upcomingEvents = sortedEvents.filter((event) =>
    isUpcoming(event.start_at),
  );

  const pastEvents = sortedEvents
    .filter((event) => !isUpcoming(event.start_at))
    .reverse();

  const featuredEvent = upcomingEvents[0];

  return (
    <main className="overflow-hidden bg-[#FAF9F6] text-[#242333]">
      <section className="relative">
        <div className="mx-auto max-w-360 px-5 pb-10 pt-12 sm:px-8 sm:pt-16 lg:px-10 lg:pt-20">

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_290px] lg:items-end">
            <h1 className="text-6xl font-semibold leading-[0.9] tracking-[-0.075em] sm:text-7xl lg:text-[7rem]">
              Something&apos;s
              <br />
              <span className="relative inline-block text-[#F07832]">
                happening.
                <svg
                  viewBox="0 0 320 13"
                  fill="none"
                  className="absolute -bottom-2 left-0 w-full"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8C85 1 225 2 317 7"
                    stroke="#F07832"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <div className="relative pb-1 lg:pb-3">
              <Sparkles
                size={27}
                className="absolute -right-1 -top-8 rotate-12 text-[#5257C8]"
              />

              <p className="max-w-sm text-sm leading-7 text-[#656474] sm:text-base">
                From hands-on workshops to community meetups, there&apos;s
                always something new to learn, someone new to meet, or an idea
                worth exploring.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#FFD166] px-3 py-1.5 text-xs font-medium">
                  Learn something
                </span>
                <span className="rounded-full bg-[#DCD9FF] px-3 py-1.5 text-xs font-medium">
                  Meet builders
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {featuredEvent && (
        <section className="px-5 pb-10 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-360">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold tracking-tight">
                Up next <span className="text-[#F07832]">✳</span>
              </h2>

              <span className="text-xs text-[#858292]">
                {upcomingEvents.length} upcoming{" "}
                {upcomingEvents.length === 1 ? "event" : "events"}
              </span>
            </div>

            <Link
              href={`/events/${featuredEvent.slug}`}
              className="group block overflow-hidden rounded-[28px] bg-[#FFD166] transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
                <div className="relative min-h-[240px] overflow-hidden sm:min-h-[320px] lg:min-h-[370px]">
                  {featuredEvent.cover_image_url ? (
                    <Image
                      src={featuredEvent.cover_image_url}
                      alt={featuredEvent.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="relative flex h-full min-h-[240px] items-center justify-center overflow-hidden sm:min-h-[320px]">
                      <div className="absolute -left-8 -top-10 h-48 w-48 rounded-full bg-[#F07832] sm:h-64 sm:w-64" />
                      <div className="absolute -bottom-12 -right-6 h-48 w-48 rotate-12 rounded-[40px] bg-[#DCD9FF] sm:h-56 sm:w-56" />

                      <div className="relative flex h-32 w-32 rotate-[-6deg] flex-col items-center justify-center rounded-[28px] border-4 border-white bg-[#5257C8] text-white shadow-lg sm:h-40 sm:w-40">
                        <CalendarDays size={30} />
                        <span className="mt-3 text-xs font-semibold uppercase tracking-[0.12em]">
                          Save a spot
                        </span>
                      </div>

                      <span className="absolute left-5 top-5 rotate-[-8deg] rounded-full bg-white px-3 py-2 text-xs font-semibold shadow-sm">
                        It&apos;s happening!
                      </span>
                    </div>
                  )}

                  <span className="absolute left-5 top-5 rounded-full bg-[#FAF9F6] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#242333] shadow-sm">
                    {getEventType(featuredEvent)}
                  </span>
                </div>

                <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-[70px] w-[70px] rotate-[-4deg] flex-col items-center justify-center rounded-2xl bg-white">
                        <span className="text-2xl font-semibold leading-none tracking-tight">
                          {formatDay(featuredEvent.start_at)}
                        </span>
                        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#F07832]">
                          {formatMonth(featuredEvent.start_at)}
                        </span>
                      </div>

                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white transition-transform group-hover:rotate-45">
                        <ArrowUpRight size={19} />
                      </span>
                    </div>

                    <p className="mt-7 text-xs font-semibold uppercase tracking-[0.12em] text-[#77571B]">
                      The next get-together
                    </p>

                    <h2 className="mt-3 text-3xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-4xl">
                      {featuredEvent.title}
                    </h2>

                    {featuredEvent.description && (
                      <p className="mt-4 max-w-lg text-sm leading-6 text-[#614F2E]">
                        {featuredEvent.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-7 space-y-3 border-t border-[#242333]/10 pt-5">
                    <div className="flex items-center gap-2.5 text-xs text-[#614F2E] sm:text-sm">
                      <CalendarDays size={15} />
                      <span>
                        {formatDate(featuredEvent.start_at)} ·{" "}
                        {formatTime(featuredEvent.start_at)}
                      </span>
                    </div>

                    {featuredEvent.location && (
                      <div className="flex items-center gap-2.5 text-xs text-[#614F2E] sm:text-sm">
                        {featuredEvent.event_type === "online" ? (
                          <Monitor size={15} />
                        ) : (
                          <MapPin size={15} />
                        )}
                        <span>{featuredEvent.location}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-medium text-[#77571B]">
                        {featuredEvent.talks.length}{" "}
                        {featuredEvent.talks.length === 1
                          ? "session"
                          : "sessions"}
                      </span>

                      <span className="inline-flex items-center gap-2 rounded-full bg-[#242333] px-4 py-2.5 text-xs font-medium text-white transition-colors group-hover:bg-[#5257C8]">
                        Get the details
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {events.length === 0 && (
        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-360 rounded-[28px] bg-[#DCD9FF] px-6 py-12 text-center sm:px-10">
            <div className="mx-auto flex h-14 w-14 rotate-[-6deg] items-center justify-center rounded-2xl bg-white text-[#5257C8]">
              <CalendarDays size={25} />
            </div>

            <h2 className="mt-5 text-2xl font-semibold tracking-[-0.04em]">
              Nothing on the calendar. Yet.
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#49486A]">
              No published events right now. We&apos;re always up for a good
              reason to get together, so check back soon.
            </p>

            <Link
              href="/community"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#5257C8] px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[#4145AD]"
            >
              Meet the community <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}

      {events.length > 0 && (
        <>
          <section className="px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
            <div className="mx-auto max-w-360">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5257C8]">
                    More to look forward to
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">
                    Coming up next.
                  </h2>
                </div>

                <span className="text-xs text-[#858292]">
                  More learning. More people. More building.
                </span>
              </div>

              {upcomingEvents.length <= 1 ? (
                <div className="rounded-2xl border border-dashed border-[#DCD7CC] px-5 py-8">
                  <p className="text-sm text-[#858292]">
                    That&apos;s all for now. More events coming soon ✳
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {upcomingEvents.slice(1).map((event, index) => (
                    <EventCard key={event.id} event={event} index={index} />
                  ))}
                </div>
              )}
            </div>
          </section>

          {pastEvents.length > 0 && (
            <section className="px-5 py-8 sm:px-8 sm:py-12 lg:px-10">
              <div className="mx-auto max-w-360 rounded-[28px] bg-[#F0EDE5] p-5 sm:p-8">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#F07832]">
                      The good times archive
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">
                      Been there. Built that.
                    </h2>
                  </div>

                  <span className="text-xs text-[#858292]">
                    A little look back ✳
                  </span>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {pastEvents.map((event, index) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      index={index}
                      past
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <section className="px-5 pb-8 pt-5 sm:px-8 sm:pb-12 lg:px-10">
        <div className="mx-auto max-w-360 overflow-hidden rounded-[28px] bg-[#5257C8] px-6 py-8 sm:px-9 sm:py-10 lg:flex lg:items-end lg:justify-between lg:gap-8">
          <div>
            <span className="inline-flex rotate-[-2deg] rounded-full bg-[#FFD166] px-3 py-1.5 text-[10px] font-semibold text-[#242333]">
              Your people are here ✳
            </span>

            <h2 className="mt-4 text-4xl font-semibold leading-[0.94] tracking-[-0.065em] text-white sm:text-5xl lg:text-6xl">
              Come curious.
              <br />
              Leave inspired.
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-white/75">
              Meet fellow builders, explore new ideas, and find your place in
              the AWS SBG community at LPU.
            </p>
          </div>

          <Link
            href="/community"
            className="group mt-6 inline-flex w-fit shrink-0 items-center gap-3 rounded-full bg-[#FAF9F6] px-5 py-3 text-sm font-semibold text-[#242333] transition-transform hover:-translate-y-0.5 lg:mt-0"
          >
            Find your people
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>
    </main>
  );
}

function EventCard({
  event,
  index,
  past = false,
}: {
  event: Event;
  index: number;
  past?: boolean;
}) {
  const color = getEventColor(index);

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex flex-col rounded-[24px] border border-[#EAE6DE] bg-white p-5 transition-transform duration-200 hover:-translate-y-1 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className="flex h-[62px] w-[62px] shrink-0 flex-col items-center justify-center rounded-2xl"
          style={{ backgroundColor: color.background, color: color.text }}
        >
          <span className="text-2xl font-semibold leading-none tracking-tight">
            {formatDay(event.start_at)}
          </span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em]">
            {formatMonth(event.start_at)}
          </span>
        </div>

        <span
          className="rounded-full px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em]"
          style={{ backgroundColor: color.background, color: color.text }}
        >
          {past ? "Past event" : getEventType(event)}
        </span>

        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5F2EC] transition-colors group-hover:bg-[#5257C8] group-hover:text-white">
          <ArrowUpRight
            size={16}
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      </div>

      <h3 className="mt-5 text-xl font-semibold leading-tight tracking-[-0.045em] transition-colors group-hover:text-[#5257C8] sm:text-2xl">
        {event.title}
      </h3>

      {event.description && (
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#656474]">
          {event.description}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#EAE6DE] pt-4 text-xs text-[#858292]">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays size={13} style={{ color: color.accent }} />
          {formatDate(event.start_at)}
        </span>

        <span className="inline-flex items-center gap-1.5">
          {event.event_type === "online" ? (
            <Monitor size={13} style={{ color: color.accent }} />
          ) : (
            <MapPin size={13} style={{ color: color.accent }} />
          )}
          <span className="max-w-[180px] truncate">
            {event.location || getEventType(event)}
          </span>
        </span>
      </div>
    </Link>
  );
}