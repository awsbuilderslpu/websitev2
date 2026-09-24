import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Globe,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getPublicSpeaker,
  type PublicSpeaker,
  type SpeakerTalk,
} from "@/lib/speakers";

function formatDate(date: string | null) {
  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatTime(date: string | null) {
  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatTalkType(type: string) {
  return type
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default async function SpeakerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const speaker = await getPublicSpeaker(id);

  if (!speaker) {
    notFound();
  }

  const eventCount = new Set(
    speaker.talks
      .map((talk) => talk.event?.id)
      .filter(Boolean),
  ).size;

  return (
    <main className="min-h-screen bg-[#111827] text-[#F5F5F5]">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px]" />
        </div>

        <div className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-[#A855F7]/8 blur-[150px]" />

        <div className="relative mx-auto max-w-360 px-5 pb-16 pt-8 sm:px-8 lg:px-10 lg:pb-20 lg:pt-10">
          <Link
            href="/speakers"
            className="group inline-flex items-center gap-2 text-sm text-[#737B8C] transition-colors hover:text-white"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            All speakers
          </Link>

          <div className="mt-14 grid gap-12 lg:grid-cols-[320px_1fr] lg:gap-20 xl:grid-cols-[360px_1fr]">
            <div>
              <SpeakerPortrait speaker={speaker} />
            </div>

            <div className="flex flex-col justify-end">
              <div className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#B45CFF]">
                <span className="h-px w-7 bg-[#A855F7]" />
                Speaker profile
              </div>

              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-[5rem]">
                {speaker.name}
              </h1>

              {(speaker.designation || speaker.company) && (
                <p className="mt-5 text-lg text-[#C7CAD2]">
                  {speaker.designation}
                  {speaker.designation &&
                    speaker.company &&
                    " · "}
                  {speaker.company}
                </p>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-white/10 py-5">
                <ProfileStat
                  value={speaker.talks_count}
                  label={
                    speaker.talks_count === 1
                      ? "Session"
                      : "Sessions"
                  }
                />

                <div className="h-5 w-px bg-white/10" />

                <ProfileStat
                  value={eventCount}
                  label={
                    eventCount === 1
                      ? "Event"
                      : "Events"
                  }
                />
              </div>

              {hasSocials(speaker) && (
                <div className="mt-7 flex items-center gap-2">
                  {speaker.linkedin_url && (
                    <SocialLink
                      href={speaker.linkedin_url}
                      label="LinkedIn"
                    >
                      <span className="text-[13px] font-bold leading-none">
                        in
                      </span>
                    </SocialLink>
                  )}

                  {speaker.github_url && (
                    <SocialLink
                      href={speaker.github_url}
                      label="GitHub"
                    >
                      <span className="font-mono text-[11px] font-medium leading-none">
                        GH
                      </span>
                    </SocialLink>
                  )}

                  {speaker.x_url && (
                    <SocialLink
                      href={speaker.x_url}
                      label="X"
                    >
                      <span className="text-sm font-medium leading-none">
                        𝕏
                      </span>
                    </SocialLink>
                  )}

                  {speaker.website_url && (
                    <SocialLink
                      href={speaker.website_url}
                      label="Website"
                    >
                      <Globe size={16} />
                    </SocialLink>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-360 px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[320px_1fr] lg:gap-20 xl:grid-cols-[360px_1fr]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#B45CFF]">
              About
            </p>

            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">
              In their own words.
            </h2>
          </div>

          <div>
            {speaker.bio ? (
              <p className="max-w-3xl text-lg leading-8 text-[#C7CAD2]">
                {speaker.bio}
              </p>
            ) : (
              <p className="text-sm text-[#737B8C]">
                Speaker biography will be available soon.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0D1421]">
        <div className="mx-auto max-w-360 px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[320px_1fr] lg:gap-20 xl:grid-cols-[360px_1fr]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#B45CFF]">
                Session history
              </p>

              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
                Talks & sessions.
              </h2>

              <p className="mt-5 max-w-sm text-sm leading-6 text-[#737B8C]">
                Sessions presented through the AWS Student
                Builder Group at LPU.
              </p>
            </div>

            <div className="border-t border-white/10">
              {speaker.talks.length === 0 ? (
                <div className="border-b border-white/10 py-12">
                  <p className="text-sm text-[#737B8C]">
                    No public sessions available yet.
                  </p>
                </div>
              ) : (
                speaker.talks.map((talk, index) => (
                  <TalkRow
                    key={talk.id}
                    talk={talk}
                    index={index}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-360 px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="flex flex-col gap-8 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#596273]">
              AWS Student Builder Group
            </p>

            <p className="mt-2 text-sm text-[#737B8C]">
              Discover more people, ideas, and events.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/speakers"
              className="inline-flex items-center gap-2 border border-white/10 px-5 py-3 text-sm font-medium text-[#C7CAD2] transition-colors hover:border-white/20 hover:bg-white/[0.03] hover:text-white"
            >
              All speakers
              <ArrowUpRight size={16} />
            </Link>

            <Link
              href="/events"
              className="inline-flex items-center gap-2 bg-[#A855F7] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#B45CFF]"
            >
              Explore events
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function SpeakerPortrait({
  speaker,
}: {
  speaker: PublicSpeaker;
}) {
  const initials = speaker.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="relative aspect-[4/5] w-full max-w-[360px] overflow-hidden bg-[#172033]">
      {speaker.avatar_url ? (
        <Image
          src={speaker.avatar_url}
          alt={speaker.name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 360px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-7xl font-semibold text-[#A855F7]">
          {initials}
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />

      <div className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-[0.16em] text-white/60">
        AWS SBG · LPU
      </div>
    </div>
  );
}

function ProfileStat({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-semibold tracking-[-0.03em]">
        {String(value).padStart(2, "0")}
      </span>

      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#596273]">
        {label}
      </span>
    </div>
  );
}

function TalkRow({
  talk,
  index,
}: {
  talk: SpeakerTalk;
  index: number;
}) {
  return (
    <article className="group border-b border-white/10 py-8 sm:py-9">
      <div className="grid gap-6 lg:grid-cols-[48px_1fr_180px_auto] lg:items-start lg:gap-8">
        <span className="font-mono text-xs text-[#596273]">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#B45CFF]">
              {formatTalkType(talk.talk_type)}
            </span>

            {talk.event && (
              <>
                <span className="h-1 w-1 bg-[#596273]" />

                <span className="text-xs text-[#737B8C]">
                  {talk.event.title}
                </span>
              </>
            )}
          </div>

          <h3 className="mt-3 text-xl font-semibold tracking-tight transition-colors group-hover:text-[#B45CFF] sm:text-2xl">
            {talk.title}
          </h3>

          {talk.description && (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#8F96A5]">
              {talk.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 lg:block lg:text-right">
          {talk.starts_at && (
            <div className="flex items-center gap-2 text-xs text-[#737B8C] lg:justify-end">
              <CalendarDays size={13} />
              {formatDate(talk.starts_at)}
            </div>
          )}

          {talk.starts_at && (
            <p className="mt-1 font-mono text-[10px] text-[#596273]">
              {formatTime(talk.starts_at)}

              {talk.ends_at &&
                ` – ${formatTime(talk.ends_at)}`}
            </p>
          )}
        </div>

        {talk.event ? (
          <Link
            href={`/events/${talk.event.slug}`}
            className="inline-flex h-10 w-10 items-center justify-center border border-white/10 text-[#8F96A5] transition-colors hover:border-[#A855F7] hover:bg-[#A855F7] hover:text-white"
            aria-label={`View ${talk.event.title}`}
          >
            <ArrowUpRight size={17} />
          </Link>
        ) : (
          <div className="hidden h-10 w-10 lg:block" />
        )}
      </div>
    </article>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center border border-white/10 text-[#8F96A5] transition-colors hover:border-[#A855F7] hover:bg-[#A855F7] hover:text-white"
    >
      {children}
    </a>
  );
}

function hasSocials(speaker: PublicSpeaker) {
  return Boolean(
    speaker.linkedin_url ||
      speaker.github_url ||
      speaker.x_url ||
      speaker.website_url,
  );
}