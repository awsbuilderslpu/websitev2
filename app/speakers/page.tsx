import {
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

export default async function SpeakersPage() {
  const speakers = await getPublicSpeakers();

  const totalSessions = speakers.reduce(
    (total, speaker) => total + speaker.talks_count,
    0,
  );

  return (
    <main className="min-h-screen bg-[#111827] text-[#F5F5F5]">
      <section className="relative border-b border-white/10 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px]" />
        </div>

        <div className="pointer-events-none absolute -right-48 -top-48 h-150 w-150 rounded-full bg-[#A855F7]/8 blur-[150px]" />

        <div className="relative mx-auto max-w-360 px-5 pb-16 pt-14 sm:px-8 lg:px-10 lg:pb-20 lg:pt-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#B45CFF]">
                <span className="h-px w-7 bg-[#A855F7]" />
                Speaker directory
              </div>

              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-[5.4rem]">
                Meet the people
                <br />
                behind the ideas.
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-7 text-[#9CA3AF] sm:text-lg">
                Engineers, builders, educators, founders, and
                technologists who share their experience with
                the AWS Student Builder Group at LPU.
              </p>
            </div>

            <div className="flex gap-8 border-t border-white/10 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <DirectoryStat
                icon={<Users size={15} />}
                value={speakers.length}
                label={
                  speakers.length === 1
                    ? "Speaker"
                    : "Speakers"
                }
              />

              <div className="h-10 w-px bg-white/10" />

              <DirectoryStat
                value={totalSessions}
                label={
                  totalSessions === 1
                    ? "Session"
                    : "Sessions"
                }
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-360 px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="mb-7 flex items-center justify-between border-b border-white/10 pb-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#596273]">
            Speakers
          </p>

          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#596273]">
            {String(speakers.length).padStart(2, "0")} profiles
          </p>
        </div>

        {speakers.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="border-t border-white/10">
            {speakers.map((speaker, index) => (
              <SpeakerRow
                key={speaker.id}
                speaker={speaker}
                index={index}
              />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-white/10 bg-[#0D1421]">
        <div className="mx-auto max-w-360 px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#B45CFF]">
                Continue exploring
              </p>

              <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
                Follow the conversations beyond
                the speaker list.
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 border border-white/10 px-5 py-3 text-sm font-medium text-[#C7CAD2] transition-colors hover:border-white/20 hover:bg-white/[0.03] hover:text-white"
              >
                Browse events
                <ArrowUpRight size={16} />
              </Link>

              <Link
                href="/community"
                className="inline-flex items-center gap-2 bg-[#A855F7] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#B45CFF]"
              >
                Explore community
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SpeakerRow({
  speaker,
  index,
}: {
  speaker: Speaker;
  index: number;
}) {
  return (
    <article className="group border-b border-white/10">
      <Link
        href={`/speakers/${speaker.id}`}
        className="grid gap-7 py-8 transition-colors duration-300 hover:bg-white/[0.02] sm:py-9 lg:grid-cols-[48px_96px_1fr_auto] lg:items-center lg:gap-8 lg:py-10"
      >
        <span className="font-mono text-[10px] tracking-[0.12em] text-[#596273]">
          {String(index + 1).padStart(2, "0")}
        </span>

        <SpeakerAvatar speaker={speaker} />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <h2 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-[#B45CFF] sm:text-2xl">
              {speaker.name}
            </h2>

            {speaker.talks_count > 0 && (
              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#596273]">
                {String(speaker.talks_count).padStart(
                  2,
                  "0",
                )}{" "}
                {speaker.talks_count === 1
                  ? "session"
                  : "sessions"}
              </span>
            )}
          </div>

          {(speaker.designation || speaker.company) && (
            <p className="mt-2 text-sm text-[#C7CAD2]">
              {speaker.designation}
              {speaker.designation &&
                speaker.company &&
                " · "}
              {speaker.company}
            </p>
          )}

          {speaker.bio && (
            <p className="mt-3 max-w-2xl line-clamp-2 text-sm leading-6 text-[#737B8C]">
              {speaker.bio}
            </p>
          )}

          <div className="mt-4 flex items-center gap-4">
            <SpeakerSocials speaker={speaker} />
          </div>
        </div>

        <div className="flex items-center lg:justify-end">
          <span className="inline-flex h-10 w-10 items-center justify-center border border-white/10 text-[#737B8C] transition-all duration-300 group-hover:border-[#A855F7] group-hover:bg-[#A855F7] group-hover:text-white">
            <ArrowUpRight size={17} />
          </span>
        </div>
      </Link>
    </article>
  );
}

function SpeakerAvatar({
  speaker,
}: {
  speaker: Speaker;
}) {
  const initials = speaker.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase(),
    )
    .join("");

  return (
    <div className="relative h-20 w-20 overflow-hidden bg-[#172033] sm:h-24 sm:w-24">
      {speaker.avatar_url ? (
        <Image
          src={speaker.avatar_url}
          alt={speaker.name}
          fill
          sizes="96px"
          className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-[#A855F7]">
          {initials}
        </div>
      )}
    </div>
  );
}

function SpeakerSocials({
  speaker,
}: {
  speaker: Speaker;
}) {
  return (
    <div className="flex items-center gap-3 text-[#596273]">
      {speaker.linkedin_url && (
        <span className="text-[11px] font-bold transition-colors group-hover:text-[#8F96A5]">
          in
        </span>
      )}

      {speaker.github_url && (
        <span className="font-mono text-[10px] transition-colors group-hover:text-[#8F96A5]">
          GH
        </span>
      )}

      {speaker.x_url && (
        <span className="text-xs transition-colors group-hover:text-[#8F96A5]">
          𝕏
        </span>
      )}

      {speaker.website_url && (
        <Globe
          size={14}
          className="transition-colors group-hover:text-[#8F96A5]"
        />
      )}
    </div>
  );
}

function DirectoryStat({
  icon,
  value,
  label,
}: {
  icon?: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        {icon && (
          <span className="text-[#A855F7]">
            {icon}
          </span>
        )}

        <span className="text-2xl font-semibold tracking-[-0.03em]">
          {String(value).padStart(2, "0")}
        </span>
      </div>

      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-[#596273]">
        {label}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border-b border-white/10 py-20">
      <div className="max-w-md">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#B45CFF]">
          No profiles
        </p>

        <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em]">
          Speaker profiles will appear here.
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#737B8C]">
          Check back when the next set of sessions is
          announced.
        </p>
      </div>
    </div>
  );
}