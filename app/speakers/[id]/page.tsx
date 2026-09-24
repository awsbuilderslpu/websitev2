import { ArrowLeft, ArrowUpRight, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Talk = {
  id: string;
  title: string;
  description: string | null;
  talk_type: string;
  starts_at: string | null;
  ends_at: string | null;
  event: {
    id: string;
    title: string;
    slug: string;
  } | null;
};

type Speaker = {
  id: string;
  name: string;
  bio: string | null;
  designation: string | null;
  company: string | null;
  avatar_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  x_url: string | null;
  website_url: string | null;
  talks: Talk[];
};

async function getSpeaker(id: string): Promise<Speaker | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/speakers/${id}`, {
    next: {
      revalidate: 60,
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch speaker");
  }

  const data = await response.json();

  return data.speaker;
}

function formatDate(date: string | null) {
  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
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
  return type.replaceAll("_", " ");
}

export default async function SpeakerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const speaker = await getSpeaker(id);

  if (!speaker) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#111827] text-[#F5F5F5]">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute -right-48 -top-48 h-[650px] w-[650px] rounded-full bg-[#A855F7]/10 blur-[140px]" />

        <div className="mx-auto max-w-[1440px] px-5 pb-20 pt-10 sm:px-8 lg:px-10 lg:pb-28 lg:pt-14">
          <Link
            href="/speakers"
            className="group inline-flex items-center gap-2 text-sm text-[#9CA3AF] transition-colors hover:text-white"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            All speakers
          </Link>

          <div className="mt-16 grid items-end gap-14 lg:grid-cols-[280px_1fr] lg:gap-20">
            <div className="relative aspect-square w-full max-w-[280px] overflow-hidden bg-[#172033]">
              {speaker.avatar_url ? (
                <Image
                  src={speaker.avatar_url}
                  alt={speaker.name}
                  fill
                  priority
                  sizes="280px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-7xl font-semibold text-[#A855F7]">
                  {speaker.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <div className="mb-7 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[#B45CFF]">
                <span className="h-px w-8 bg-[#A855F7]" />
                Speaker
              </div>

              <h1 className="max-w-5xl text-5xl font-bold leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-[5.8rem]">
                {speaker.name}
              </h1>

              {(speaker.designation || speaker.company) && (
                <p className="mt-7 text-lg text-[#C7CAD2] sm:text-xl">
                  {speaker.designation}
                  {speaker.designation && speaker.company && " · "}
                  {speaker.company}
                </p>
              )}

              {speaker.bio && (
                <p className="mt-7 max-w-2xl text-base leading-7 text-[#9CA3AF] sm:text-lg sm:leading-8">
                  {speaker.bio}
                </p>
              )}

              <div className="mt-8 flex flex-wrap gap-2">
                {speaker.linkedin_url && (
                  <SocialLink href={speaker.linkedin_url} label="LinkedIn">
                    <span className="text-[13px] font-bold leading-none">
                      in
                    </span>
                  </SocialLink>
                )}

                {speaker.github_url && (
                  <SocialLink href={speaker.github_url} label="GitHub">
                    <span className="font-mono text-[11px] font-medium leading-none">
                      GH
                    </span>
                  </SocialLink>
                )}

                {speaker.x_url && (
                  <SocialLink href={speaker.x_url} label="X">
                    <span className="text-sm font-medium leading-none">
                      𝕏
                    </span>
                  </SocialLink>
                )}

                {speaker.website_url && (
                  <SocialLink href={speaker.website_url} label="Website">
                    <Globe size={17} />
                  </SocialLink>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.5fr] lg:gap-24">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B45CFF]">
              On the agenda
            </p>

            <h2 className="mt-5 max-w-md text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
              Sessions by {speaker.name.split(" ")[0]}.
            </h2>

            <p className="mt-6 max-w-md text-base leading-7 text-[#9CA3AF]">
              Explore talks, workshops, panels, and other sessions delivered
              as part of the AWS Student Builder Group community.
            </p>
          </div>

          <div>
            {speaker.talks.length === 0 ? (
              <div className="border-y border-white/10 py-16">
                <p className="font-mono text-sm text-[#9CA3AF]">
                  No sessions available yet.
                </p>
              </div>
            ) : (
              <div className="border-t border-white/10">
                {speaker.talks.map((talk, index) => (
                  <article
                    key={talk.id}
                    className="group border-b border-white/10 py-8 sm:py-10"
                  >
                    <div className="grid gap-6 sm:grid-cols-[60px_1fr_auto] sm:items-start sm:gap-8">
                      <span className="font-mono text-xs text-[#6B7280]">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div>
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#B45CFF]">
                            {formatTalkType(talk.talk_type)}
                          </span>

                          {talk.event && (
                            <>
                              <span className="h-1 w-1 bg-[#6B7280]" />

                              <span className="text-xs text-[#6B7280]">
                                {talk.event.title}
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="text-2xl font-semibold tracking-[-0.03em] transition-colors group-hover:text-[#B45CFF] sm:text-3xl">
                          {talk.title}
                        </h3>

                        {talk.description && (
                          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#8F96A5]">
                            {talk.description}
                          </p>
                        )}

                        {(talk.starts_at || talk.ends_at) && (
                          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-[#6B7280]">
                            {talk.starts_at && (
                              <span>
                                {formatDate(talk.starts_at)}
                              </span>
                            )}

                            {talk.starts_at && (
                              <span>
                                {formatTime(talk.starts_at)}
                                {talk.ends_at &&
                                  ` – ${formatTime(talk.ends_at)}`}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {talk.event && (
                        <Link
                          href={`/events/${talk.event.slug}`}
                          className="inline-flex h-10 w-10 items-center justify-center border border-white/10 text-[#C7CAD2] transition-all hover:border-[#A855F7] hover:bg-[#A855F7] hover:text-white"
                          aria-label={`View ${talk.event.title}`}
                        >
                          <ArrowUpRight size={18} />
                        </Link>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0D1421]">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B45CFF]">
                Keep exploring
              </p>

              <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
                There&apos;s always another conversation to join.
              </h2>
            </div>

            <Link
              href="/events"
              className="inline-flex w-fit items-center gap-3 border border-[#A855F7] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#A855F7]"
            >
              Explore events
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
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
      className="inline-flex h-10 w-10 items-center justify-center border border-white/10 text-[#9CA3AF] transition-all duration-300 hover:border-[#A855F7] hover:bg-[#A855F7] hover:text-white"
    >
      {children}
    </a>
  );
}