import {
  ArrowRight,
  ArrowUpRight,
  Globe,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  getPublicSpeakers,
  type Speaker,
} from "@/lib/speakers";

const cardColors = [
  "bg-[#FFE5A5]",
  "bg-[#E5E2FF]",
  "bg-[#DDF2E5]",
  "bg-[#FFDCCF]",
  "bg-[#DCEBFF]",
  "bg-[#F9DDF0]",
];

export default async function SpeakersPage() {
  const speakers = await getPublicSpeakers();

  const totalSessions = speakers.reduce(
    (total, speaker) => total + speaker.talks_count,
    0,
  );

  return (
    <main className="overflow-hidden bg-[#FAF9F6] text-[#242333]">
      <section className="px-5 pb-10 pt-10 sm:px-8 sm:pb-12 sm:pt-14 lg:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>

            <h1 className="mt-7 max-w-4xl text-[clamp(3.5rem,8vw,6.5rem)] font-semibold leading-[0.88] tracking-[-0.075em]">
              Big ideas.
              <br />
              <span className="text-[#6252BD]">Real people.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#656474] sm:text-lg sm:leading-8">
              Meet the engineers, builders, educators, founders, and
              technologists who share their knowledge with the AWS Student
              Builder Group at LPU.
            </p>
          </div>

          <div className="flex gap-3 lg:gap-4">
            <div className="min-w-[112px] rounded-[1.5rem] bg-[#FFE5A5] p-4 sm:min-w-[130px] sm:p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/75 text-[#A56A00]">
                <Users size={19} />
              </div>
              <p className="mt-5 text-3xl font-semibold tracking-[-0.06em]">
                {speakers.length}
              </p>
              <p className="mt-1 text-xs font-medium text-[#66532C]">
                {speakers.length === 1 ? "Speaker" : "Speakers"}
              </p>
            </div>

            <div className="min-w-[112px] rounded-[1.5rem] bg-[#E5E2FF] p-4 sm:min-w-[130px] sm:p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/75 text-[#6252BD]">
                <Globe size={19} />
              </div>
              <p className="mt-5 text-3xl font-semibold tracking-[-0.06em]">
                {totalSessions}
              </p>
              <p className="mt-1 text-xs font-medium text-[#6252BD]">
                {totalSessions === 1 ? "Session" : "Sessions"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#F07832]">
                Our speaker directory
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.05em] sm:text-3xl">
                Get to know the builders.
              </h2>
            </div>

            <span className="rounded-full border border-[#E7E2D9] bg-white px-3 py-1.5 text-xs font-medium text-[#656474]">
              {String(speakers.length).padStart(2, "0")} profiles
            </span>
          </div>

          {speakers.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {speakers.map((speaker, index) => (
                <SpeakerCard
                  key={speaker.id}
                  speaker={speaker}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#DDF2E5] px-6 py-9 sm:px-9 sm:py-10">
          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5 text-xs font-semibold text-[#287B56]">
                <span className="h-2 w-2 rounded-full bg-[#287B56]" />
                Keep the conversation going
              </div>

              <h2 className="mt-5 max-w-2xl text-3xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-4xl lg:text-5xl">
                There&apos;s always
                <br />
                something to learn.
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-6 text-[#456654] sm:text-base">
                Join a session, meet fellow builders, and discover what the
                community is working on next.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/events"
                className="group inline-flex items-center gap-2 rounded-full bg-[#242333] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#F07832]"
              >
                Browse events
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>

              <Link
                href="/community"
                className="inline-flex items-center gap-2 rounded-full border border-[#287B56]/20 bg-white/75 px-5 py-3 text-sm font-semibold text-[#287B56] transition hover:bg-white"
              >
                Explore community
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="absolute -right-10 -top-16 h-44 w-44 rounded-full border-[25px] border-white/40" />
          <div className="absolute bottom-[-22px] right-[32%] h-12 w-12 rotate-12 rounded-2xl bg-[#FFE5A5]" />
        </div>
      </section>
    </main>
  );
}

function SpeakerCard({
  speaker,
  index,
}: {
  speaker: Speaker;
  index: number;
}) {
  const initials = speaker.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const color = cardColors[index % cardColors.length];

  return (
    <article className="group flex min-w-0 flex-col rounded-[1.75rem] border border-[#EAE6DE] bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(36,35,51,0.07)] sm:p-5">
      <div
        className={`relative flex min-h-[190px] items-center justify-center overflow-hidden rounded-[1.25rem] ${color}`}
      >
        <div className="absolute -right-7 -top-8 h-28 w-28 rounded-full border-[17px] border-white/35" />
        <div className="absolute bottom-4 left-5 h-3 w-3 rounded-full bg-white/70" />

        <div className="relative h-28 w-28 overflow-hidden rounded-[2rem] border-4 border-white/80 bg-white/70 shadow-sm transition-transform duration-300 group-hover:rotate-2 group-hover:scale-105">
          {speaker.avatar_url ? (
            <Image
              src={speaker.avatar_url}
              alt={speaker.name}
              fill
              sizes="112px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl font-semibold tracking-tight text-[#6252BD]">
              {initials}
            </div>
          )}
        </div>

        {speaker.talks_count > 0 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#242333]">
            {speaker.talks_count}{" "}
            {speaker.talks_count === 1 ? "session" : "sessions"}
          </span>
        )}

        <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-xs font-semibold text-[#656474]">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-5">
        <h3 className="text-xl font-semibold tracking-[-0.04em] text-[#242333]">
          {speaker.name}
        </h3>

        {(speaker.designation || speaker.company) && (
          <p className="mt-1.5 text-sm leading-5 text-[#656474]">
            {speaker.designation}
            {speaker.designation && speaker.company && " · "}
            {speaker.company}
          </p>
        )}

        {speaker.bio ? (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#777584]">
            {speaker.bio}
          </p>
        ) : (
          <p className="mt-3 text-sm leading-6 text-[#777584]">
            Sharing knowledge, ideas, and experience with the community.
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <SpeakerSocials speaker={speaker} />

          <Link
            href={`/speakers/${speaker.id}`}
            aria-label={`View ${speaker.name}'s profile`}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#242333] text-white transition group-hover:bg-[#F07832]"
          >
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function SpeakerSocials({ speaker }: { speaker: Speaker }) {
  const links = [
    {
      label: "in",
      href: speaker.linkedin_url,
      name: "LinkedIn",
      className: "font-bold",
    },
    {
      label: "GH",
      href: speaker.github_url,
      name: "GitHub",
      className: "font-mono text-[10px]",
    },
    {
      label: "𝕏",
      href: speaker.x_url,
      name: "X",
      className: "text-sm",
    },
  ].filter(
    (link): link is typeof link & { href: string } => Boolean(link.href),
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {links.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`${speaker.name} on ${link.name}`}
          className={`flex h-8 min-w-8 items-center justify-center rounded-full border border-[#EAE6DE] px-2 text-xs text-[#656474] transition hover:border-[#6252BD] hover:bg-[#E5E2FF] hover:text-[#6252BD] ${link.className}`}
        >
          {link.label}
        </a>
      ))}

      {speaker.website_url && (
        <a
          href={speaker.website_url}
          target="_blank"
          rel="noreferrer"
          aria-label={`${speaker.name}'s website`}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#EAE6DE] text-[#656474] transition hover:border-[#6252BD] hover:bg-[#E5E2FF] hover:text-[#6252BD]"
        >
          <Globe size={14} />
        </a>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[1.75rem] bg-[#E5E2FF] px-6 py-12 text-center sm:px-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-[#6252BD]">
        <Users size={26} />
      </div>

      <h2 className="mt-5 text-2xl font-semibold tracking-[-0.04em]">
        The speaker list is taking a little breather.
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6252BD]">
        New speaker profiles will appear here as they become available. In the
        meantime, come see what&apos;s happening at our events.
      </p>

      <Link
        href="/events"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#242333] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#F07832]"
      >
        Explore events
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}