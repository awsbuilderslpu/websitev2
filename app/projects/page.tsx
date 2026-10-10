"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Cloud,
  Users,
  ShieldCheck,
  GraduationCap,
  CalendarDays,
  X,
} from "lucide-react";

const projects = [
  {
    number: "01",
    name: "Recruitment Management Portal",
    category: "OPERATIONS",
    description:
      "A centralized recruitment system for managing applications, candidate screening, communication, and onboarding.",
    stack: ["Next.js", "Supabase", "PostgreSQL"],
    live: "https://recruitment.awslpu.in/",
    github:
      "https://github.com/awsbuilderslpu/Recruitment-Management-Portal",
    color: "#FFD166",
    icon: Users,
    rotation: "-rotate-3",
  },
  {
    number: "02",
    name: "Identity Services",
    category: "INFRASTRUCTURE",
    description:
      "A centralized identity layer providing authentication across AWS LPU platforms through OAuth 2.0 and OpenID Connect.",
    stack: ["Next.js", "OAuth 2.0", "OIDC", "JWT"],
    live: "https://sso.awslpu.in/",
    github: "https://github.com/awsbuilderslpu/SSO",
    color: "#DCD9FF",
    icon: ShieldCheck,
    rotation: "rotate-2",
  },
  {
    number: "03",
    name: "Mock Certifications",
    category: "LEARNING",
    description:
      "A certification preparation platform designed to give students a dedicated environment for technical and cloud exam practice.",
    stack: ["Next.js", "Supabase", "PostgreSQL"],
    live: "https://mock.awslpu.in/",
    github: "https://github.com/awsbuilderslpu/Mock-Certifications",
    color: "#DDF2E5",
    icon: GraduationCap,
    rotation: "-rotate-2",
  },
  {
    number: "04",
    name: "Calendly",
    category: "RECRUITMENT EXTENSION",
    description:
      "An interview scheduling system extending the Recruitment Management Portal with interview slot management and candidate scheduling.",
    stack: ["Next.js", "Supabase", "Scheduling"],
    live: null,
    github: "https://github.com/awsbuilderslpu/Calendly",
    color: "#FFD9C8",
    icon: CalendarDays,
    rotation: "rotate-3",
  },
];

const navigation = [
  {
    name: "Club Website",
    description: "Explore the community, events, projects, and opportunities.",
    color: "#FFD166",
  },
  {
    name: "Recruitment",
    description: "Manage applications and candidate workflows.",
    color: "#DCD9FF",
  },
  {
    name: "Identity",
    description: "Authenticate users across the platform ecosystem.",
    color: "#DDF2E5",
  },
  {
    name: "Learning",
    description: "Practice technical and cloud certification questions.",
    color: "#FFD9C8",
  },
];

function ActionLink({
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
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium transition-all hover:-translate-y-0.5 ${
        primary
          ? "bg-[#5257C8] text-white hover:bg-[#4145AD]"
          : "border border-[#E5E0D7] bg-white/70 text-[#656474] hover:border-[#5257C8]/40 hover:text-[#5257C8]"
      }`}
    >
      {label}
      <ExternalLink
        size={13}
        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </Link>
  );
}

function AlreadyHereModal({
  open,
  onClose,
  onContinue,
}: {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#242333]/45 p-5 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="already-here-title"
        className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-[#EAE6DE] bg-[#FAF9F6] p-6 text-[#242333] shadow-2xl sm:p-8"
      >
        <div className="absolute -right-5 -top-7 h-24 w-24 rotate-12 rounded-[28px] bg-[#FFD166]" />
        <div className="absolute right-14 top-9 h-3 w-3 rounded-full bg-[#5257C8]" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 transition-colors hover:bg-white"
        >
          <X size={17} />
        </button>

        <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFD9C8] text-3xl">
          🤨
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-[#F07832]">
          Hold up a second
        </p>

        <h2
          id="already-here-title"
          className="mt-3 text-3xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-4xl"
        >
          Really, dude??
          <br />
          <span className="text-[#5257C8]">You&apos;re already here.</span>
        </h2>

        <p className="mt-4 text-sm leading-6 text-[#656474]">
          Wanna redirect to the website you&apos;re literally browsing right
          now? 😂
        </p>

        <div className="mt-7 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-[#FFD166] px-4 py-3 text-sm font-semibold transition-colors hover:bg-[#F6C34F]"
          >
            Nah, I&apos;m good
          </button>

          <button
            type="button"
            onClick={onContinue}
            className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#5257C8] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#4145AD]"
          >
            Yes, redirect me
            <ArrowUpRight
              size={15}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </button>
        </div>

        <p className="mt-5 text-center text-[11px] text-[#858292]">
          We admire your commitment to navigation. ✳
        </p>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [showAlreadyHere, setShowAlreadyHere] = useState(false);

  return (
    <main className="overflow-hidden bg-[#FAF9F6] text-[#242333]">
      <section className="relative">
        <div className="mx-auto max-w-360 px-5 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-16 lg:px-10 lg:pt-20">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#EAE6DE] bg-white/70 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#656474]">
              <span className="h-2 w-2 rounded-full bg-[#F07832]" />
              Built by AWS SBG · LPU
            </span>

            <span className="rounded-full bg-[#DDF2E5] px-3 py-2 text-[10px] font-medium text-[#28764A]">
              Student-built software ✳
            </span>
          </div>

          <div className="mt-10 grid items-end gap-8 lg:grid-cols-[1fr_300px]">
            <div>
              <h1 className="max-w-5xl text-6xl font-semibold leading-[0.91] tracking-[-0.075em] sm:text-7xl lg:text-[7rem]">
                Ideas become
                <br />
                <span className="relative inline-block text-[#F07832]">
                  real things.
                  <svg
                    viewBox="0 0 300 12"
                    fill="none"
                    className="absolute -bottom-2 left-0 w-full"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8C69 1 204 2 296 7"
                      stroke="#F07832"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
            </div>

            <div className="relative pb-1 lg:pb-3">
              <div className="absolute -right-1 -top-7 text-4xl text-[#5257C8]">
                ✳
              </div>

              <p className="max-w-sm text-sm leading-7 text-[#656474] sm:text-base">
                Meet the platforms we build to make our community work better
                — from recruitment and identity to learning and events.
              </p>

              <p className="mt-4 text-xs font-medium text-[#5257C8]">
                Designed, developed, and improved by students.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {["Web platforms", "Cloud technology", "Open source", "Real problems"].map(
              (item, index) => (
                <span
                  key={item}
                  className={`rounded-full px-3.5 py-2 text-xs font-medium ${
                    [
                      "bg-[#FFD166]",
                      "bg-[#DCD9FF]",
                      "bg-[#DDF2E5]",
                      "bg-[#FFD9C8]",
                    ][index]
                  }`}
                >
                  {item}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="px-5 pb-12 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-360 overflow-hidden rounded-[28px] bg-[#DCD9FF]">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-6 sm:p-9 lg:p-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5257C8]" />
                The home base
              </span>

              <h2 className="mt-6 text-4xl font-semibold leading-[0.95] tracking-[-0.065em] sm:text-5xl lg:text-6xl">
                AWS SBG
                <br />
                <span className="text-[#5257C8]">LPU Website</span>
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-[#49486A] sm:text-base">
                The digital home of AWS Student Builder Group at LPU. Discover
                community activities, upcoming events, student projects,
                learning perks, and ways to get involved.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {["Next.js", "TypeScript", "Tailwind CSS"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#5257C8]/15 bg-white/50 px-3 py-1.5 text-[10px] font-medium text-[#49486A]"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShowAlreadyHere(true)}
                  className="group inline-flex items-center gap-2 rounded-full bg-[#5257C8] px-4 py-2.5 text-xs font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-[#4145AD]"
                >
                  Visit website
                  <ExternalLink
                    size={13}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </button>

                <ActionLink
                  href="https://github.com/awsbuilderslpu/club-website"
                  label="Source code"
                />
              </div>
            </div>

            <div className="relative flex min-h-[230px] items-center justify-center overflow-hidden p-8 sm:min-h-[280px] lg:min-h-[360px]">
              <div className="absolute right-[10%] top-[5%] h-36 w-36 rounded-full bg-[#FFD166] sm:h-48 sm:w-48" />
              <div className="absolute bottom-[5%] left-[8%] h-32 w-32 rounded-[35%] bg-[#F07832] sm:h-40 sm:w-40" />
              <div className="absolute right-[12%] bottom-[10%] h-16 w-16 rotate-12 rounded-2xl bg-[#DDF2E5] sm:h-20 sm:w-20" />

              <div className="relative flex h-40 w-40 rotate-[-5deg] flex-col items-center justify-center rounded-[32px] border-[5px] border-white bg-[#5257C8] text-white shadow-xl shadow-[#5257C8]/15 sm:h-48 sm:w-48">
                <Cloud size={34} strokeWidth={1.6} />
                <span className="mt-3 text-3xl font-semibold tracking-[-0.06em]">
                  AWS SBG
                </span>
                <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">
                  LPU builders
                </span>
              </div>

              <span className="absolute left-[12%] top-[12%] rotate-[-10deg] rounded-full bg-white px-3 py-2 text-xs font-semibold shadow-sm">
                Made at LPU ✳
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
        <div className="mx-auto max-w-360">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#F07832]">
                The things we&apos;re making
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">
                Small teams. Useful tools.
              </h2>
            </div>

            <span className="text-xs text-[#858292]">
              Built around real community needs ✳
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => {
              const Icon = project.icon;

              return (
                <article
                  key={project.number}
                  className="group flex flex-col rounded-[26px] border border-[#EAE6DE] bg-white p-5 transition-transform duration-200 hover:-translate-y-1 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${project.rotation}`}
                      style={{ backgroundColor: project.color }}
                    >
                      <Icon size={22} strokeWidth={1.7} />
                    </div>

                    <span className="rounded-full bg-[#F5F2EC] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#656474]">
                      {project.category}
                    </span>
                  </div>

                  <h3 className="mt-5 text-2xl font-semibold leading-tight tracking-[-0.05em] sm:text-[27px]">
                    {project.name}
                  </h3>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-[#656474]">
                    {project.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {project.stack.map((technology) => (
                      <span
                        key={technology}
                        className="rounded-full bg-[#F5F2EC] px-2.5 py-1.5 text-[10px] font-medium text-[#656474]"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2 border-t border-[#EAE6DE] pt-4">
                    {project.live && (
                      <ActionLink
                        href={project.live}
                        label="Open project"
                        primary
                      />
                    )}

                    <ActionLink href={project.github} label="Source code" />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
        <div className="mx-auto max-w-360 rounded-[28px] bg-[#F0EDE5] p-6 sm:p-9 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
            <div>
              <span className="inline-flex rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-[#5257C8]">
                Behind the scenes
              </span>

              <h2 className="mt-4 max-w-md text-4xl font-semibold leading-[0.95] tracking-[-0.065em] sm:text-5xl">
                Different tools.
                <br />
                <span className="text-[#F07832]">One community.</span>
              </h2>

              <p className="mt-4 max-w-sm text-sm leading-6 text-[#656474]">
                Each platform has a job to do, helping different parts of the
                community run more smoothly.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="rounded-2xl bg-white p-4 sm:p-5"
                >
                  <span
                    className="mb-3 block h-2 w-9 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <h3 className="text-sm font-semibold">{item.name}</h3>
                  <p className="mt-2 text-xs leading-5 text-[#656474]">
                    {item.description}
                  </p>
                </div>
              ))}

              <div className="rounded-2xl bg-[#DDF2E5] p-4 sm:col-span-2 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold">
                      Interview scheduling
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-[#496B58]">
                      Calendly extends recruitment with interview slots and
                      candidate scheduling.
                    </p>
                  </div>

                  <Link
                    href="https://github.com/awsbuilderslpu/Calendly"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-medium transition-colors hover:bg-[#5257C8] hover:text-white"
                  >
                    View source <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-10 pt-6 sm:px-8 sm:pb-14 lg:px-10">
        <div className="mx-auto max-w-360 overflow-hidden rounded-[28px] bg-[#F07832] px-6 py-8 sm:px-9 sm:py-10 lg:flex lg:items-end lg:justify-between lg:gap-8">
          <div>
            <span className="inline-flex rounded-full bg-white/25 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#242333]">
              Your turn ✳
            </span>

            <h2 className="mt-4 text-4xl font-semibold leading-[0.92] tracking-[-0.065em] text-[#242333] sm:text-5xl lg:text-6xl">
              Got an idea?
              <br />
              Let&apos;s make it real.
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-[#4B3024]">
              Come learn with us, contribute to a project, or start building
              something of your own.
            </p>
          </div>

          <Link
            href="/community"
            className="group mt-6 inline-flex w-fit shrink-0 items-center gap-3 rounded-full bg-[#242333] px-5 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 lg:mt-0"
          >
            Join the community
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      <AlreadyHereModal
        open={showAlreadyHere}
        onClose={() => setShowAlreadyHere(false)}
        onContinue={() => {
          window.open("https://awslpu.in/", "_blank", "noopener,noreferrer");
          setShowAlreadyHere(false);
        }}
      />
    </main>
  );
}