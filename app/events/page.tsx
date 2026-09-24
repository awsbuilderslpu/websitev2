import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Monitor,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type EventSpeaker = {
  id: string;
  name: string;
  avatar_url: string | null;
};

type EventTalk = {
  id: string;
  title: string;
  talk_type: string;
  speakers: EventSpeaker[];
};

type Event = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  event_type: string;
  location: string | null;
  online_url: string | null;
  start_at: string;
  end_at: string;
  registration_deadline: string;
  is_paid: boolean;
  talks: EventTalk[];
};

async function getEvents(): Promise<Event[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/events`, {
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  const data = await response.json();

  return data.events;
}

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
  if (event.event_type === "online") {
    return "Online";
  }

  if (event.event_type === "hybrid") {
    return "Hybrid";
  }

  return "In person";
}

export default async function EventsPage() {
  const events = await getEvents();

  const upcomingEvents = events.filter((event) =>
    isUpcoming(event.start_at),
  );

  const pastEvents = events.filter(
    (event) => !isUpcoming(event.start_at),
  );

  const featuredEvent = upcomingEvents[0];

  return (
    <main className="min-h-screen bg-[#111827] text-[#F5F5F5]">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#A855F7]/10 blur-[130px]" />

        <div className="mx-auto max-w-[1440px] px-5 pb-20 pt-24 sm:px-8 lg:px-10 lg:pb-28 lg:pt-32">
          <div className="max-w-5xl">
            <div className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[#B45CFF]">
              <span className="h-px w-8 bg-[#A855F7]" />
              Events
            </div>

            <h1 className="max-w-4xl text-5xl font-bold leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-[6rem]">
              Learn something.
              <br />
              <span className="text-[#A855F7]">Build something.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#C7CAD2] sm:text-xl">
              Workshops, technical sessions, community meetups, and
              conversations with people building the future.
            </p>
          </div>
        </div>
      </section>

      {featuredEvent && (
        <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B45CFF]">
                Next up
              </p>
            </div>

            <span className="font-mono text-xs text-[#6B7280]">
              01 / {String(upcomingEvents.length).padStart(2, "0")}
            </span>
          </div>

          <Link
            href={`/events/${featuredEvent.slug}`}
            className="group block overflow-hidden border border-white/10 transition-colors duration-300 hover:border-[#A855F7]/60"
          >
            <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
              <div className="relative min-h-85 bg-[#172033] sm:min-h-115">
                {featuredEvent.cover_image_url ? (
                  <Image
                    src={featuredEvent.cover_image_url}
                    alt={featuredEvent.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-full items-end p-8 sm:p-12">
                    <span className="font-mono text-[10rem] font-medium leading-none text-white/[0.04]">
                      01
                    </span>
                  </div>
                )}

                <div className="absolute left-6 top-6 border border-white/20 bg-[#111827]/80 px-3 py-2 backdrop-blur-sm">
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#B45CFF]">
                    {getEventType(featuredEvent)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between bg-[#0D1421] p-8 sm:p-12 lg:p-14">
                <div>
                  <div className="mb-8 flex items-start justify-between gap-6">
                    <div>
                      <p className="font-mono text-4xl font-medium leading-none text-[#A855F7]">
                        {formatDay(featuredEvent.start_at)}
                      </p>

                      <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-[#6B7280]">
                        {formatMonth(featuredEvent.start_at)}
                      </p>
                    </div>

                    <ArrowUpRight
                      size={24}
                      className="text-[#6B7280] transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#A855F7]"
                    />
                  </div>

                  <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
                    {featuredEvent.title}
                  </h2>

                  {featuredEvent.description && (
                    <p className="mt-6 max-w-xl text-sm leading-7 text-[#9CA3AF]">
                      {featuredEvent.description}
                    </p>
                  )}
                </div>

                <div className="mt-12 space-y-3 border-t border-white/10 pt-6">
                  <EventMeta
                    icon={<CalendarDays size={16} />}
                    text={`${formatDate(featuredEvent.start_at)} · ${formatTime(featuredEvent.start_at)}`}
                  />

                  {featuredEvent.location && (
                    <EventMeta
                      icon={
                        featuredEvent.event_type === "online" ? (
                          <Monitor size={16} />
                        ) : (
                          <MapPin size={16} />
                        )
                      }
                      text={featuredEvent.location}
                    />
                  )}

                  <div className="pt-4 font-mono text-xs text-[#6B7280]">
                    {featuredEvent.talks.length}{" "}
                    {featuredEvent.talks.length === 1
                      ? "session"
                      : "sessions"}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      <section className="mx-auto max-w-360 px-5 pb-24 sm:px-8 lg:px-10 lg:pb-32">
        <div className="mb-10 flex items-end justify-between gap-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B45CFF]">
              Upcoming
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              What&apos;s happening next.
            </h2>
          </div>
        </div>

        {upcomingEvents.length <= 1 ? (
          <div className="border-y border-white/10 py-16">
            <p className="font-mono text-sm text-[#6B7280]">
              No more upcoming events yet.
            </p>
          </div>
        ) : (
          <div className="border-t border-white/10">
            {upcomingEvents.slice(1).map((event, index) => (
              <EventRow
                key={event.id}
                event={event}
                index={index + 2}
              />
            ))}
          </div>
        )}
      </section>

      {pastEvents.length > 0 && (
        <section className="border-t border-white/10 bg-[#0D1421]">
          <div className="mx-auto max-w-360 px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
            <div className="mb-10">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B45CFF]">
                Archive
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Where we&apos;ve been.
              </h2>
            </div>

            <div className="border-t border-white/10">
              {pastEvents.map((event, index) => (
                <EventRow
                  key={event.id}
                  event={event}
                  index={index + 1}
                  past
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#A855F7] text-white">
        <div className="mx-auto flex max-w-360 flex-col gap-8 px-5 py-20 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:py-24">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/70">
              AWS Student Builder Group
            </p>

            <h2 className="mt-5 max-w-2xl text-4xl font-bold leading-tight tracking-[-0.045em] sm:text-5xl">
              Come curious.
              <br />
              Leave with something.
            </h2>
          </div>

          <Link
            href="/community"
            className="inline-flex w-fit items-center gap-3 border border-white px-6 py-3 text-sm font-semibold transition-colors hover:bg-white hover:text-[#A855F7]"
          >
            Join the community
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}

function EventRow({
  event,
  index,
  past = false,
}: {
  event: Event;
  index: number;
  past?: boolean;
}) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group grid gap-6 border-b border-white/10 py-8 transition-colors duration-300 hover:bg-white/2.5 sm:grid-cols-[90px_1fr_auto] sm:items-center sm:gap-10 sm:py-10"
    >
      <div>
        <p className="font-mono text-3xl font-medium leading-none text-[#A855F7]">
          {formatDay(event.start_at)}
        </p>

        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#6B7280]">
          {formatMonth(event.start_at)}
        </p>
      </div>

      <div>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#B45CFF]">
            {getEventType(event)}
          </span>

          {past && (
            <>
              <span className="h-1 w-1 bg-[#6B7280]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6B7280]">
                Past event
              </span>
            </>
          )}
        </div>

        <h3 className="text-2xl font-semibold tracking-[-0.03em] transition-colors group-hover:text-[#B45CFF] sm:text-3xl">
          {event.title}
        </h3>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#8F96A5]">
          <span>{formatTime(event.start_at)}</span>

          {event.location && (
            <span className="flex items-center gap-2">
              <MapPin size={14} />
              {event.location}
            </span>
          )}

          <span>
            {event.talks.length}{" "}
            {event.talks.length === 1 ? "session" : "sessions"}
          </span>
        </div>
      </div>

      <div className="hidden sm:block">
        <span className="flex h-11 w-11 items-center justify-center border border-white/10 text-[#9CA3AF] transition-all group-hover:border-[#A855F7] group-hover:bg-[#A855F7] group-hover:text-white">
          <ArrowUpRight size={18} />
        </span>
      </div>
    </Link>
  );
}

function EventMeta({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-[#9CA3AF]">
      <span className="text-[#A855F7]">{icon}</span>
      <span>{text}</span>
    </div>
  );
}