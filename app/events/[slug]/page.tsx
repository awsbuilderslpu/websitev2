import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Globe,
  MapPin,
  Users,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPublicEvent } from "@/lib/events";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatTime(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatDateTime(date: string) {
  return `${formatDate(date)} · ${formatTime(date)}`;
}

function getEventType(type: string) {
  if (type === "online") return "Online";
  if (type === "hybrid") return "Hybrid";
  return "In person";
}

function getTalkType(type: string) {
  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

const sessionColors = [
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
];

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getPublicEvent(slug);

  if (!event) {
    notFound();
  }

  return (
    <main className="overflow-hidden bg-[#FAF9F6] text-[#242333]">
      <section className="relative">
        <div className="mx-auto max-w-360 px-5 pb-8 pt-8 sm:px-8 sm:pb-10 sm:pt-10 lg:px-10">
          <Link
            href="/events"
            className="group inline-flex items-center gap-2 rounded-full border border-[#EAE6DE] bg-white px-4 py-2.5 text-xs font-medium text-[#656474] transition-colors hover:border-[#5257C8]/30 hover:text-[#5257C8]"
          >
            <ArrowLeft
              size={14}
              className="transition-transform group-hover:-translate-x-1"
            />
            All events
          </Link>

          <div className="mt-9 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#DCD9FF] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#4545A0]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5257C8]" />
                  {getEventType(event.event_type)}
                </span>

                {event.is_paid && (
                  <span className="rounded-full bg-[#FFD9C8] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#91472D]">
                    Paid event
                  </span>
                )}

                <span className="text-lg text-[#F07832]">✳</span>
              </div>

              <h1 className="mt-6 max-w-5xl text-5xl font-semibold leading-[0.93] tracking-[-0.07em] sm:text-6xl lg:text-7xl">
                {event.title}
                <span className="text-[#F07832]">.</span>
              </h1>

              {event.description && (
                <p className="mt-5 max-w-2xl text-sm leading-7 text-[#656474] sm:text-base sm:leading-8">
                  {event.description}
                </p>
              )}
            </div>

            <div className="relative overflow-hidden rounded-[24px] bg-[#FFD166] p-5 sm:p-6">
              <div className="absolute -right-5 -top-8 h-24 w-24 rotate-12 rounded-[26px] bg-[#F07832]/20" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#77571B]">
                    Mark your calendar
                  </p>

                  <p className="mt-3 text-3xl font-semibold leading-none tracking-[-0.06em]">
                    {new Intl.DateTimeFormat("en-IN", {
                      day: "numeric",
                      month: "short",
                    }).format(new Date(event.start_at))}
                  </p>

                  <p className="mt-2 text-sm text-[#77571B]">
                    {formatDate(event.start_at)}
                  </p>
                </div>

                <div className="flex h-12 w-12 rotate-6 items-center justify-center rounded-2xl bg-white text-[#F07832]">
                  <CalendarDays size={23} />
                </div>
              </div>

              <div className="relative mt-5 border-t border-[#614615]/15 pt-4">
                <div className="flex items-center gap-2 text-sm text-[#614615]">
                  <Clock3 size={15} />
                  {formatTime(event.start_at)} – {formatTime(event.end_at)}
                </div>

                {event.location && (
                  <div className="mt-3 flex items-start gap-2 text-sm text-[#614615]">
                    {event.event_type === "online" ? (
                      <Globe size={15} className="mt-0.5 shrink-0" />
                    ) : (
                      <MapPin size={15} className="mt-0.5 shrink-0" />
                    )}
                    <span>{event.location}</span>
                  </div>
                )}

                {event.online_url && (
                  <a
                    href={event.online_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#242333] px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[#5257C8]"
                  >
                    Join online
                    <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {event.cover_image_url && (
        <section className="px-5 pb-8 sm:px-8 lg:px-10">
          <div className="relative mx-auto aspect-[16/7] max-w-360 overflow-hidden rounded-[26px] bg-[#F0EDE5]">
            <Image
              src={event.cover_image_url}
              alt={event.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1440px"
              className="object-cover"
            />
          </div>
        </section>
      )}

      <section className="px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
        <div className="mx-auto grid max-w-360 gap-7 lg:grid-cols-[270px_1fr] lg:gap-12">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#DDF2E5] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#286746]">
              <Sparkles size={12} />
              The plan
            </span>

            <h2 className="mt-4 text-4xl font-semibold leading-[0.95] tracking-[-0.065em] sm:text-5xl">
              Good things
              <br />
              are <span className="text-[#5257C8]">on the agenda.</span>
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-[#656474]">
              Talks, workshops, and conversations to make your time here
              worthwhile.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#FFD9C8] px-3 py-2 text-xs font-medium text-[#91472D]">
              <Users size={14} />
              {event.talks.length}{" "}
              {event.talks.length === 1 ? "session" : "sessions"}
            </div>
          </div>

          <div className="space-y-3">
            {event.talks.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-[#DCD7CC] bg-white px-5 py-10 text-center sm:px-8">
                <CalendarDays
                  size={26}
                  className="mx-auto text-[#5257C8]"
                />
                <h3 className="mt-4 text-lg font-semibold">
                  The details are still brewing.
                </h3>
                <p className="mt-2 text-sm text-[#656474]">
                  Session details and speakers will be announced soon.
                </p>
              </div>
            ) : (
              event.talks.map((talk, index) => {
                const color = sessionColors[index % sessionColors.length];

                return (
                  <article
                    key={talk.id}
                    className="rounded-[24px] border border-[#EAE6DE] bg-white p-5 sm:p-6"
                  >
                    <div className="flex items-start gap-4 sm:gap-5">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold"
                        style={{
                          backgroundColor: color.background,
                          color: color.text,
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em]"
                            style={{
                              backgroundColor: color.background,
                              color: color.text,
                            }}
                          >
                            {getTalkType(talk.talk_type)}
                          </span>

                          {talk.starts_at && (
                            <span className="inline-flex items-center gap-1.5 text-xs text-[#858292]">
                              <Clock3 size={12} />
                              {formatTime(talk.starts_at)}
                            </span>
                          )}
                        </div>

                        <h3 className="mt-3 text-xl font-semibold leading-tight tracking-[-0.045em] sm:text-2xl">
                          {talk.title}
                        </h3>

                        {talk.description && (
                          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#656474]">
                            {talk.description}
                          </p>
                        )}

                        {talk.speakers.length > 0 && (
                          <div className="mt-5">
                            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#858292]">
                              Meet your speakers
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {talk.speakers.map((speaker) => (
                                <Link
                                  key={speaker.id}
                                  href={`/speakers/${speaker.id}`}
                                  className="group inline-flex items-center gap-2 rounded-full border border-[#EAE6DE] bg-[#FAF9F6] py-1.5 pl-1.5 pr-3 transition-colors hover:border-[#5257C8]/40 hover:bg-[#DCD9FF]/40"
                                >
                                  <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#DCD9FF] text-[10px] font-semibold text-[#5257C8]">
                                    {speaker.avatar_url ? (
                                      <Image
                                        src={speaker.avatar_url}
                                        alt={speaker.name}
                                        fill
                                        sizes="32px"
                                        className="object-cover"
                                      />
                                    ) : (
                                      speaker.name
                                        .split(" ")
                                        .map((part) => part.charAt(0))
                                        .slice(0, 2)
                                        .join("")
                                    )}
                                  </div>

                                  <span className="text-xs font-medium text-[#656474] transition-colors group-hover:text-[#5257C8]">
                                    {speaker.name}
                                  </span>

                                  <ArrowUpRight
                                    size={12}
                                    className="text-[#858292]"
                                  />
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {talk.location && (
                          <div className="mt-4 flex items-center gap-2 text-xs text-[#858292]">
                            <MapPin size={13} className="text-[#F07832]" />
                            {talk.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-360 gap-3 sm:grid-cols-3">
          <InfoCard
            label="Registration deadline"
            value={formatDateTime(event.registration_deadline)}
            background="#FFD166"
            text="#614615"
            icon={<CalendarDays size={19} />}
          />

          <InfoCard
            label="Event format"
            value={getEventType(event.event_type)}
            background="#DCD9FF"
            text="#4545A0"
            icon={<Globe size={19} />}
          />

          <InfoCard
            label="On the agenda"
            value={`${event.talks.length} ${
              event.talks.length === 1 ? "session" : "sessions"
            }`}
            background="#DDF2E5"
            text="#286746"
            icon={<Users size={19} />}
          />
        </div>
      </section>

      <section className="px-5 pb-8 pt-5 sm:px-8 sm:pb-12 lg:px-10">
        <div className="mx-auto flex max-w-360 flex-col gap-6 rounded-[28px] bg-[#F07832] p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex rotate-[-2deg] rounded-full bg-[#FFD166] px-3 py-1.5 text-[10px] font-semibold text-[#242333]">
              Come curious ✳
            </span>

            <h2 className="mt-4 text-3xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-4xl">
              Your next idea starts here.
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-[#4B3024]">
              Explore more events, meet fellow builders, and find your next
              reason to create something.
            </p>
          </div>

          <Link
            href="/events"
            className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-[#242333] px-5 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
          >
            Explore more events
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  label,
  value,
  background,
  text,
  icon,
}: {
  label: string;
  value: string;
  background: string;
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="rounded-[22px] p-5"
      style={{ backgroundColor: background, color: text }}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] opacity-75">
          {label}
        </p>
        {icon}
      </div>

      <p className="mt-4 text-lg font-semibold leading-snug tracking-[-0.035em]">
        {value}
      </p>
    </div>
  );
}