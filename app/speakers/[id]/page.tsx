import {
  ArrowLeft,
  ArrowRight,
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
  if (!date) return null;

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatTime(date: string | null) {
  if (!date) return null;

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

  if (!speaker) notFound();

  const eventCount = new Set(
    speaker.talks.map((talk) => talk.event?.id).filter(Boolean),
  ).size;

  return (
    <main className="overflow-hidden bg-[#FAF9F6] text-[#242333]">
      <section className="px-5 pb-10 pt-8 sm:px-8 sm:pb-12 sm:pt-10 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/speakers"
            className="group inline-flex items-center gap-2 rounded-full border border-[#E7E2D9] bg-white px-4 py-2.5 text-sm font-medium text-[#656474] transition hover:border-[#6252BD] hover:text-[#6252BD]"
          >
            <ArrowLeft
              size={15}
              className="transition-transform group-hover:-translate-x-1"
            />
            All speakers
          </Link>

          <div className="mt-7 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="relative min-h-[320px] overflow-hidden rounded-[2rem] bg-[#E5E2FF] sm:min-h-[400px] lg:min-h-[490px]">
              <div className="absolute -right-8 -top-10 h-44 w-44 rounded-full border-[26px] border-white/35" />
              <div className="absolute bottom-12 left-6 h-4 w-4 rounded-full bg-[#F07832]" />

              <SpeakerPortrait speaker={speaker} />

              <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-[#6252BD]">
                AWS SBG · LPU
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[2rem] bg-white p-6 sm:p-9 lg:p-10">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#DDF2E5] px-3 py-1.5 text-xs font-semibold text-[#287B56]">
                  <span className="h-2 w-2 rounded-full bg-[#287B56]" />
                  Meet the speaker
                </div>

                <h1 className="mt-6 break-words text-[clamp(2.8rem,6vw,5.5rem)] font-semibold leading-[0.9] tracking-[-0.075em]">
                  {speaker.name}
                  <span className="text-[#F07832]">.</span>
                </h1>

                {(speaker.designation || speaker.company) && (
                  <p className="mt-5 text-base leading-7 text-[#656474] sm:text-lg">
                    {speaker.designation}
                    {speaker.designation && speaker.company && " · "}
                    {speaker.company}
                  </p>
                )}
              </div>

              <div>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="rounded-[1.25rem] bg-[#FFE5A5] p-4 sm:p-5">
                    <p className="text-3xl font-semibold tracking-[-0.06em]">
                      {speaker.talks_count}
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#66532C]">
                      {speaker.talks_count === 1 ? "Session" : "Sessions"}
                    </p>
                  </div>

                  <div className="rounded-[1.25rem] bg-[#DDF2E5] p-4 sm:p-5">
                    <p className="text-3xl font-semibold tracking-[-0.06em]">
                      {eventCount}
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#456654]">
                      {eventCount === 1 ? "Event" : "Events"}
                    </p>
                  </div>
                </div>

                {hasSocials(speaker) && (
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {speaker.linkedin_url && (
                      <SocialLink href={speaker.linkedin_url} label="LinkedIn">
                        <span className="text-sm font-bold">in</span>
                      </SocialLink>
                    )}

                    {speaker.github_url && (
                      <SocialLink href={speaker.github_url} label="GitHub">
                        <span className="font-mono text-xs font-semibold">
                          GH
                        </span>
                      </SocialLink>
                    )}

                    {speaker.x_url && (
                      <SocialLink href={speaker.x_url} label="X">
                        <span className="text-sm font-medium">𝕏</span>
                      </SocialLink>
                    )}

                    {speaker.website_url && (
                      <SocialLink href={speaker.website_url} label="Website">
                        <Globe size={17} />
                      </SocialLink>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.65fr_1.35fr]">
          <div className="rounded-[1.75rem] bg-[#FFE5A5] p-6 sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-[#A56A00]">
              <Globe size={22} />
            </div>

            <p className="mt-6 text-sm font-semibold text-[#A56A00]">
              A little introduction
            </p>

            <h2 className="mt-2 text-3xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-4xl">
              The person behind the knowledge.
            </h2>
          </div>

          <div className="flex min-h-[220px] flex-col justify-center rounded-[1.75rem] bg-white p-6 sm:p-9">
            {speaker.bio ? (
              <p className="whitespace-pre-line text-base leading-8 text-[#555466] sm:text-lg">
                {speaker.bio}
              </p>
            ) : (
              <p className="text-base leading-7 text-[#777584]">
                This speaker&apos;s introduction is coming soon. Check out
                their sessions to discover what they share with the community.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-[#6252BD]">
                From the stage
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.055em] sm:text-4xl">
                Talks & sessions.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-[#656474]">
              Explore the sessions this speaker has delivered through AWS SBG
              at LPU.
            </p>
          </div>

          {speaker.talks.length === 0 ? (
            <div className="rounded-[1.75rem] bg-[#E5E2FF] px-6 py-10 sm:px-9">
              <p className="text-sm font-semibold text-[#6252BD]">
                More to come
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                No public sessions just yet.
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#6252BD]">
                Keep an eye on the events page for upcoming conversations.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {speaker.talks.map((talk, index) => (
                <TalkCard key={talk.id} talk={talk} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-5 pb-10 pt-6 sm:px-8 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#F07832] px-6 py-9 sm:px-9 sm:py-10">
          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/25 px-3 py-1.5 text-xs font-semibold text-[#542B1A]">
                <span className="h-2 w-2 rounded-full bg-[#542B1A]" />
                Keep exploring
              </div>

              <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[0.95] tracking-[-0.065em] text-[#242333] sm:text-5xl">
                One conversation
                <br />
                can spark an idea.
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-6 text-[#542B1A] sm:text-base">
                Find your next session, discover more speakers, and stay
                connected with the builder community.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/speakers"
                className="inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-3 text-sm font-semibold text-[#242333] transition hover:bg-white"
              >
                All speakers
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/events"
                className="group inline-flex items-center gap-2 rounded-full bg-[#242333] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#242333]"
              >
                Explore events
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>

          <div className="absolute -right-10 -top-16 h-44 w-44 rounded-full border-[25px] border-white/20" />
          <div className="absolute bottom-[-22px] right-[32%] h-12 w-12 rotate-12 rounded-2xl bg-[#FFE5A5]" />
        </div>
      </section>
    </main>
  );
}

function SpeakerPortrait({ speaker }: { speaker: PublicSpeaker }) {
  const initials = speaker.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="absolute inset-0">
      {speaker.avatar_url ? (
        <Image
          src={speaker.avatar_url}
          alt={speaker.name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 560px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-7xl font-semibold tracking-[-0.06em] text-[#6252BD]">
          {initials}
        </div>
      )}
    </div>
  );
}

function TalkCard({
  talk,
  index,
}: {
  talk: SpeakerTalk;
  index: number;
}) {
  const colors = [
    "bg-[#E5E2FF]",
    "bg-[#DDF2E5]",
    "bg-[#FFE5A5]",
    "bg-[#FFDCCF]",
    "bg-[#DCEBFF]",
    "bg-[#F9DDF0]",
  ];

  return (
    <article
      className={`flex min-w-0 flex-col rounded-[1.75rem] p-5 sm:p-6 ${colors[index % colors.length]}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-white/75 px-3 py-1.5 text-xs font-semibold text-[#6252BD]">
          {formatTalkType(talk.talk_type)}
        </span>

        {talk.event && (
          <span className="max-w-full truncate rounded-full bg-white/65 px-3 py-1.5 text-xs font-medium text-[#656474]">
            {talk.event.title}
          </span>
        )}
      </div>

      <h3 className="mt-5 text-xl font-semibold leading-tight tracking-[-0.04em] sm:text-2xl">
        {talk.title}
      </h3>

      {talk.description && (
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#555466]">
          {talk.description}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
        <div>
          {talk.starts_at && (
            <>
              <p className="flex items-center gap-2 text-sm font-medium text-[#555466]">
                <CalendarDays size={15} />
                {formatDate(talk.starts_at)}
              </p>

              <p className="mt-1 text-xs text-[#777584]">
                {formatTime(talk.starts_at)}
                {talk.ends_at && ` – ${formatTime(talk.ends_at)}`}
              </p>
            </>
          )}
        </div>

        {talk.event && (
          <Link
            href={`/events/${talk.event.slug}`}
            aria-label={`View ${talk.event.title}`}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/80 text-[#242333] transition hover:bg-[#242333] hover:text-white"
          >
            <ArrowUpRight size={18} />
          </Link>
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
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E7E2D9] bg-white text-[#656474] transition hover:border-[#6252BD] hover:bg-[#E5E2FF] hover:text-[#6252BD]"
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