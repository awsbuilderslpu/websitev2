import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Globe,
  MapPin,
  Users,
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
  if (type === "online") {
    return "Online";
  }

  if (type === "hybrid") {
    return "Hybrid";
  }

  return "In person";
}

function getTalkType(type: string) {
  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default async function EventPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const event = await getPublicEvent(slug);

  if (!event) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#111827] text-[#F5F5F5]">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute -right-48 -top-48 h-150 w-150 rounded-full bg-[#A855F7]/10 blur-[140px]" />

        <div className="mx-auto max-w-360 px-5 pb-16 pt-10 sm:px-8 lg:px-10 lg:pb-24 lg:pt-14">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm text-[#737B8C] transition-colors hover:text-white"
          >
            <ArrowLeft size={16} />
            All events
          </Link>

          <div className="mt-16 grid gap-14 lg:grid-cols-[1fr_0.75fr] lg:items-end lg:gap-24">
            <div>
              <div className="mb-7 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-[#B45CFF]">
                <span className="h-px w-8 bg-[#A855F7]" />
                {getEventType(event.event_type)}

                {event.is_paid && (
                  <>
                    <span className="h-1 w-1 bg-[#596273]" />
                    Paid
                  </>
                )}
              </div>

              <h1 className="max-w-5xl text-5xl font-bold leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-[5.5rem]">
                {event.title}
              </h1>

              {event.description && (
                <p className="mt-8 max-w-2xl text-lg leading-8 text-[#C7CAD2]">
                  {event.description}
                </p>
              )}
            </div>

            <div className="border-l border-white/10 pl-6 lg:pl-10">
              <div className="space-y-5">
                <EventMeta
                  icon={<CalendarDays size={17} />}
                  label="Date"
                  value={formatDate(event.start_at)}
                />

                <EventMeta
                  icon={<Clock3 size={17} />}
                  label="Time"
                  value={`${formatTime(event.start_at)} – ${formatTime(event.end_at)}`}
                />

                {event.location && (
                  <EventMeta
                    icon={
                      event.event_type === "online" ? (
                        <Globe size={17} />
                      ) : (
                        <MapPin size={17} />
                      )
                    }
                    label="Location"
                    value={event.location}
                  />
                )}

                {event.online_url && (
                  <a
                    href={event.online_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#B45CFF] transition-colors hover:text-white"
                  >
                    Join online
                    <ArrowUpRight size={15} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {event.cover_image_url && (
        <section className="mx-auto max-w-360 px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
          <div className="relative aspect-[16/7] overflow-hidden bg-[#172033]">
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

      <section className="mx-auto max-w-360 px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="grid gap-16 lg:grid-cols-[0.65fr_1.35fr] lg:gap-24">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B45CFF]">
              Programme
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Sessions.
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-6 text-[#737B8C]">
              Explore the talks, workshops, and conversations
              happening throughout the event.
            </p>
          </div>

          <div className="border-t border-white/10">
            {event.talks.length === 0 ? (
              <div className="border-b border-white/10 py-10 text-sm text-[#737B8C]">
                Session details will be announced soon.
              </div>
            ) : (
              event.talks.map((talk, index) => (
                <article
                  key={talk.id}
                  className="border-b border-white/10 py-10"
                >
                  <div className="grid gap-6 sm:grid-cols-[55px_1fr] sm:gap-8">
                    <span className="font-mono text-xs text-[#596273]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#A855F7]">
                          {getTalkType(talk.talk_type)}
                        </span>

                        {talk.starts_at && (
                          <>
                            <span className="h-1 w-1 bg-[#596273]" />

                            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#737B8C]">
                              {formatTime(talk.starts_at)}
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                        {talk.title}
                      </h3>

                      {talk.description && (
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#8F96A5]">
                          {talk.description}
                        </p>
                      )}

                      {talk.speakers.length > 0 && (
                        <div className="mt-7">
                          <div className="mb-4 flex items-center gap-2 text-xs text-[#737B8C]">
                            <Users size={14} />
                            Speakers
                          </div>

                          <div className="flex flex-wrap gap-3">
                            {talk.speakers.map((speaker) => (
                              <Link
                                key={speaker.id}
                                href={`/speakers/${speaker.id}`}
                                className="group flex items-center gap-3 border border-white/10 bg-[#0D1421] px-3 py-2 transition-colors hover:border-[#A855F7]"
                              >
                                <div className="relative h-8 w-8 overflow-hidden rounded-full bg-[#172033]">
                                  {speaker.avatar_url ? (
                                    <Image
                                      src={speaker.avatar_url}
                                      alt={speaker.name}
                                      fill
                                      sizes="32px"
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center text-xs font-medium text-[#A855F7]">
                                      {speaker.name
                                        .split(" ")
                                        .map((part) =>
                                          part.charAt(0),
                                        )
                                        .slice(0, 2)
                                        .join("")}
                                    </div>
                                  )}
                                </div>

                                <span className="text-sm text-[#C7CAD2] transition-colors group-hover:text-white">
                                  {speaker.name}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {talk.location && (
                        <div className="mt-6 flex items-center gap-2 text-xs text-[#737B8C]">
                          <MapPin size={13} />
                          {talk.location}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0D1421]">
        <div className="mx-auto max-w-360 px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <InfoBlock
              label="Registration"
              value={formatDateTime(event.registration_deadline)}
            />

            <InfoBlock
              label="Format"
              value={getEventType(event.event_type)}
            />

            <InfoBlock
              label="Sessions"
              value={`${event.talks.length}`}
            />
          </div>
        </div>
      </section>

      <section className="bg-[#A855F7] text-white">
        <div className="mx-auto flex max-w-360 flex-col gap-8 px-5 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-20">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/70">
              AWS Student Builder Group
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
              Keep building with us.
            </h2>
          </div>

          <Link
            href="/events"
            className="inline-flex w-fit items-center gap-3 border border-white px-6 py-3 text-sm font-semibold transition-colors hover:bg-white hover:text-[#A855F7]"
          >
            Explore more events
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}

function EventMeta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#596273]">
        <span className="text-[#A855F7]">{icon}</span>
        {label}
      </div>

      <p className="mt-2 text-sm leading-6 text-[#C7CAD2]">
        {value}
      </p>
    </div>
  );
}

function InfoBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-t border-white/10 pt-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#596273]">
        {label}
      </p>

      <p className="mt-3 text-lg font-medium text-[#C7CAD2]">
        {value}
      </p>
    </div>
  );
}