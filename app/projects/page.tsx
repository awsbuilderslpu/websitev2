import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";

const projects = [
  {
    number: "02",
    name: "Recruitment Management Portal",
    category: "OPERATIONS",
    description:
      "A centralized recruitment system for managing applications, candidate screening, communication, and onboarding.",
    stack: ["Next.js", "Supabase", "PostgreSQL"],
    live: "https://recruitment.awslpu.in/",
    github:
      "https://github.com/awsbuilderslpu/Recruitment-Management-Portal",
  },
  {
    number: "03",
    name: "Identity Services",
    category: "INFRASTRUCTURE",
    description:
      "A centralized identity layer providing authentication across AWS LPU platforms through OAuth 2.0 and OpenID Connect.",
    stack: ["Next.js", "OAuth 2.0", "OIDC", "JWT"],
    live: "https://sso.awslpu.in/",
    github: "https://github.com/awsbuilderslpu/SSO",
  },
  {
    number: "04",
    name: "Mock Certifications",
    category: "LEARNING",
    description:
      "A certification preparation platform designed to give students a dedicated environment for technical and cloud exam practice.",
    stack: ["Next.js", "Supabase", "PostgreSQL"],
    live: "https://mock.awslpu.in/",
    github:
      "https://github.com/awsbuilderslpu/Mock-Certifications",
  },
  {
    number: "05",
    name: "Calendly",
    category: "RECRUITMENT EXTENSION",
    description:
      "An interview scheduling system extending the Recruitment Management Portal with interview slot management and candidate scheduling.",
    stack: ["Next.js", "Supabase", "Scheduling"],
    live: null,
    github: "https://github.com/awsbuilderslpu/Calendly",
  },
];

function ActionButton({
  href,
  label,
  primary = false,
}: {
  href: string;
  label: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`group inline-flex items-center justify-between gap-8 border px-4 py-3 transition-all duration-200 ${
        primary
          ? "border-[#A855F7] bg-[#A855F7] text-white hover:bg-[#B45CFF]"
          : "border-white/[0.14] bg-white/[0.02] text-[#D8DBE2] hover:border-[#A855F7]/60 hover:bg-[#A855F7]/10 hover:text-white"
      }`}
    >
      <span className="font-mono text-[9px] uppercase tracking-[0.16em]">
        {label}
      </span>

      <ExternalLink
        size={14}
        strokeWidth={1.5}
        className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </Link>
  );
}

export default function ProjectsPage() {
  return (
    <main className="overflow-hidden bg-[#111827] text-white">
      {/* HERO */}

      <section className="relative">
        <div className="absolute right-[-15%] top-[-30%] h-[600px] w-[600px] rounded-full bg-[#A855F7]/10 blur-[130px]" />

        <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-28 sm:px-8 sm:pb-32 sm:pt-36 lg:px-10 lg:pb-40 lg:pt-44">
          <div className="flex flex-col gap-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7]" />

                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8F96A5]">
                  AWS SBG LPU / Engineering
                </span>
              </div>

              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#555D6D]">
                2026
              </span>
            </div>

            <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:items-end">
              <h1 className="max-w-5xl text-6xl font-semibold leading-[0.86] tracking-[-0.07em] sm:text-7xl lg:text-[7rem]">
                We build the
                <br />
                <span className="text-[#A855F7]">infrastructure</span>
                <br />
                around us.
              </h1>

              <p className="max-w-sm text-sm leading-7 text-[#858C9B] lg:pb-2">
                Platforms created by students to run, connect, and improve the
                AWS Student Builder Group at LPU.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}

      <section className="bg-[#0D1421]">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
          <div className="mb-8 flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#A855F7]">
              01 / Featured
            </span>

            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#555D6D]">
              Main platform
            </span>
          </div>

          <div className="relative overflow-hidden border border-white/[0.1]">
            <div className="absolute right-0 top-0 h-full w-[35%] bg-[#A855F7]/[0.035]" />

            <div className="relative grid lg:grid-cols-[1.2fr_0.8fr]">
              <div className="border-b border-white/[0.1] p-8 sm:p-12 lg:border-b-0 lg:border-r lg:p-16">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#626A7A]">
                  Community Platform
                </p>

                <h2 className="mt-6 max-w-3xl text-5xl font-semibold leading-[0.9] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                  AWS SBG
                  <br />
                  <span className="text-[#A855F7]">LPU Website</span>
                </h2>

                <p className="mt-8 max-w-xl text-base leading-7 text-[#858C9B]">
                  The main digital home of AWS Student Builder Group at LPU.
                  The platform brings the community, events, projects, perks,
                  and opportunities together in one place.
                </p>

                <div className="mt-10 flex flex-wrap gap-2">
                  {["Next.js", "TypeScript", "Tailwind CSS"].map((item) => (
                    <span
                      key={item}
                      className="border border-white/[0.1] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#747C8B]"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-12 flex flex-wrap gap-3">
                  <ActionButton
                    href="https://awslpu.in/"
                    label="Visit live site"
                    primary
                  />

                  <ActionButton
                    href="https://github.com/awsbuilderslpu/club-website"
                    label="View GitHub"
                  />
                </div>
              </div>

              <div className="relative flex min-h-[360px] items-center justify-center p-10 lg:min-h-[500px]">
                <div className="absolute h-[280px] w-[280px] rounded-full border border-white/[0.06]" />

                <div className="absolute h-[200px] w-[200px] rounded-full border border-[#A855F7]/20" />

                <div className="absolute h-[110px] w-[110px] rounded-full bg-[#A855F7]/10 blur-2xl" />

                <div className="relative text-center">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#626A7A]">
                    AWS
                  </span>

                  <p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
                    SBG
                  </p>

                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[#A855F7]">
                    LPU
                  </p>

                  <div className="mx-auto mt-6 h-px w-10 bg-[#A855F7]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT INDEX */}

      <section className="bg-[#111827]">
        <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
          <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-24">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#A855F7]">
                Project index
              </p>

              <p className="mt-5 max-w-[220px] text-sm leading-6 text-[#626A7A]">
                The systems that support different parts of the SBG ecosystem.
              </p>
            </div>

            <div>
              {projects.map((project) => (
                <article
                  key={project.number}
                  className="group border-t border-white/[0.1] py-12 last:border-b sm:py-16"
                >
                  <div className="grid gap-8 lg:grid-cols-[70px_1fr] lg:gap-10">
                    <span className="font-mono text-[10px] text-[#555D6D]">
                      {project.number}
                    </span>

                    <div>
                      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#626A7A]">
                            {project.category}
                          </p>

                          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] transition-colors group-hover:text-[#B45CFF] sm:text-4xl lg:text-5xl">
                            {project.name}
                          </h2>
                        </div>

                        <div className="flex shrink-0 gap-2">
                          {project.live && (
                            <ActionButton
                              href={project.live}
                              label="Live site"
                              primary
                            />
                          )}

                          <ActionButton
                            href={project.github}
                            label="GitHub"
                          />
                        </div>
                      </div>

                      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
                        <p className="max-w-2xl text-sm leading-7 text-[#858C9B] sm:text-base">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 md:max-w-[300px] md:justify-end">
                          {project.stack.map((technology) => (
                            <span
                              key={technology}
                              className="border border-white/[0.08] px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-[#626A7A]"
                            >
                              {technology}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RELATIONSHIP */}

      <section className="bg-[#0D1421]">
        <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
          <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr] lg:gap-32">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#A855F7]">
                The bigger picture
              </p>

              <h2 className="mt-6 text-5xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-6xl">
                One ecosystem.
                <br />
                <span className="text-[#A855F7]">Different jobs.</span>
              </h2>
            </div>

            <div>
              <div className="border-t border-white/[0.1]">
                <div className="grid gap-5 border-b border-white/[0.08] py-8 sm:grid-cols-[180px_1fr]">
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#626A7A]">
                    Club Website
                  </span>

                  <p className="max-w-xl text-sm leading-7 text-[#858C9B]">
                    The public-facing layer — where students discover the
                    community and everything it offers.
                  </p>
                </div>

                <div className="grid gap-5 border-b border-white/[0.08] py-8 sm:grid-cols-[180px_1fr]">
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#626A7A]">
                    Recruitment
                  </span>

                  <p className="max-w-xl text-sm leading-7 text-[#858C9B]">
                    The Recruitment Management Portal handles applications and
                    candidate workflows.
                  </p>
                </div>

                <div className="grid gap-5 border-b border-white/[0.08] py-8 sm:grid-cols-[180px_1fr]">
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#626A7A]">
                    Scheduling
                  </span>

                  <p className="max-w-xl text-sm leading-7 text-[#858C9B]">
                    Calendly extends recruitment with interview scheduling and
                    slot management.
                  </p>
                </div>

                <div className="grid gap-5 border-b border-white/[0.08] py-8 sm:grid-cols-[180px_1fr]">
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#626A7A]">
                    Identity
                  </span>

                  <p className="max-w-xl text-sm leading-7 text-[#858C9B]">
                    Identity Services provides authentication across the
                    ecosystem.
                  </p>
                </div>

                <div className="grid gap-5 py-8 sm:grid-cols-[180px_1fr]">
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#626A7A]">
                    Learning
                  </span>

                  <p className="max-w-xl text-sm leading-7 text-[#858C9B]">
                    Mock Certifications gives members a dedicated place to
                    prepare and practice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="bg-[#A855F7] text-[#111827]">
        <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-36">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] opacity-60">
                Build something
              </p>

              <h2 className="mt-6 text-5xl font-semibold leading-[0.9] tracking-[-0.06em] sm:text-6xl lg:text-8xl">
                Your idea
                <br />
                could be next.
              </h2>
            </div>

            <Link
              href="/community"
              className="group inline-flex w-fit items-center gap-3 border-b border-[#111827]/40 pb-2 text-sm font-semibold"
            >
              Join the community

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}