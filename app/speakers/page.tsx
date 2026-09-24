import { ArrowUpRight, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
};

async function getSpeakers(): Promise<Speaker[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/speakers`, {
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch speakers");
  }

  const data = await response.json();

  return data.speakers;
}

export default async function SpeakersPage() {
  const speakers = await getSpeakers();

  return (
    <main className="min-h-screen bg-[#111827] text-[#F5F5F5]">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#A855F7]/10 blur-[130px]" />

        <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-24 sm:px-8 lg:px-10 lg:pb-32 lg:pt-32">
          <div className="max-w-4xl">
            <div className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[#B45CFF]">
              <span className="h-px w-8 bg-[#A855F7]" />
              Speakers
            </div>

            <h1 className="max-w-4xl text-5xl font-bold leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-[6rem]">
              People who
              <br />
              <span className="text-[#A855F7]">move ideas forward.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#C7CAD2] sm:text-xl">
              Meet the builders, engineers, founders, educators, and
              technologists who share their experience with the AWS Student
              Builder Group at LPU.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="mb-12 flex items-end justify-between gap-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B45CFF]">
              The people behind the sessions
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Learn from people who build.
            </h2>
          </div>

          <p className="hidden max-w-sm text-right text-sm leading-6 text-[#9CA3AF] md:block">
            Every speaker brings a different perspective, experience, and
            story to the community.
          </p>
        </div>

        {speakers.length === 0 ? (
          <div className="border-y border-white/10 py-24 text-center">
            <p className="font-mono text-sm text-[#9CA3AF]">
              No speakers available yet.
            </p>
          </div>
        ) : (
          <div className="border-t border-white/10">
            {speakers.map((speaker, index) => (
              <article
                key={speaker.id}
                className="group border-b border-white/10 py-8 transition-colors duration-300 hover:bg-white/[0.025] sm:py-10 lg:py-12"
              >
                <div className="grid items-center gap-8 lg:grid-cols-[70px_150px_1fr_auto] lg:gap-10">
                  <span className="font-mono text-xs text-[#6B7280]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="relative h-24 w-24 overflow-hidden bg-[#172033] sm:h-28 sm:w-28">
                    {speaker.avatar_url ? (
                      <Image
                        src={speaker.avatar_url}
                        alt={speaker.name}
                        fill
                        sizes="112px"
                        className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-[#A855F7]">
                        {speaker.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold tracking-[-0.03em] transition-colors group-hover:text-[#B45CFF] sm:text-3xl">
                      {speaker.name}
                    </h3>

                    {(speaker.designation || speaker.company) && (
                      <p className="mt-2 text-sm text-[#C7CAD2] sm:text-base">
                        {speaker.designation}
                        {speaker.designation && speaker.company && " · "}
                        {speaker.company}
                      </p>
                    )}

                    {speaker.bio && (
                      <p className="mt-4 max-w-2xl text-sm leading-6 text-[#8F96A5]">
                        {speaker.bio}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 lg:justify-end">
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
                      <SocialLink href={speaker.x_url} label="X">
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
                        <Globe size={17} />
                      </SocialLink>
                    )}

                    <Link
                      href={`/speakers/${speaker.id}`}
                      className="ml-2 inline-flex h-10 w-10 items-center justify-center border border-white/10 text-[#C7CAD2] transition-all duration-300 hover:border-[#A855F7] hover:bg-[#A855F7] hover:text-white"
                      aria-label={`View ${speaker.name}`}
                    >
                      <ArrowUpRight size={18} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B45CFF]">
                More voices
              </p>

              <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
                Great communities are built around great conversations.
              </h2>
            </div>

            <div className="lg:pl-20">
              <p className="max-w-xl text-lg leading-8 text-[#C7CAD2]">
                From technical deep dives to career stories and lessons from
                the real world, our sessions are designed to give builders
                something they can take with them.
              </p>

              <Link
                href="/events"
                className="mt-8 inline-flex items-center gap-3 border border-[#A855F7] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#A855F7]"
              >
                Explore events
                <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#A855F7] text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 py-20 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:py-24">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/70">
              AWS Student Builder Group
            </p>

            <h2 className="mt-5 max-w-2xl text-4xl font-bold leading-tight tracking-[-0.045em] sm:text-5xl">
              Come for the session.
              <br />
              Stay for the community.
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