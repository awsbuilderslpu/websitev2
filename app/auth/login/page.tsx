"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Cloud,
  ShieldCheck,
  Code2,
  Users,
  Sparkles,
} from "lucide-react";

function LoginContent() {
  const searchParams = useSearchParams();
  const requestedNext = searchParams.get("next");

  const next =
    requestedNext?.startsWith("/") &&
    !requestedNext.startsWith("//") &&
    !requestedNext.startsWith("/\\")
      ? requestedNext
      : "/dashboard";

  const loginUrl = `/auth/login/start?next=${encodeURIComponent(next)}`;

  return (
    <main className="relative flex min-h-[calc(100svh-80px)] items-center overflow-hidden bg-[#FAF9F6] px-5 py-6 text-[#242333] sm:px-10 lg:px-16">
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-[#E5E2FF]/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-10 h-56 w-56 rounded-full bg-[#FFE5A5]/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-100px] left-[42%] h-64 w-64 rounded-full bg-[#FFDCCF]/35 blur-3xl" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
        <section className="relative">
          <div className="pointer-events-none absolute right-12 top-0 hidden h-20 w-20 rotate-12 rounded-[1.75rem] bg-[#FFE5A5] sm:block" />

          <div className="relative z-10">

            <h1 className="mt-6 max-w-3xl text-[3.6rem] font-semibold leading-[0.9] tracking-[-0.085em] sm:text-7xl lg:text-[6.2rem]">
              Good things
              <br />
              start with
              <br />
              <span className="relative inline-block text-[#6252BD]">
                building.
                <svg
                  viewBox="0 0 280 16"
                  fill="none"
                  className="absolute -bottom-3 left-0 w-full"
                  aria-hidden="true"
                >
                  <path
                    d="M4 10C65 2 179 1 274 8"
                    stroke="#F07832"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-[#656474] sm:text-lg">
              Learn cloud. Build real projects. Meet people who love making
              things as much as you do. Your AWS SBG community is just one
              sign-in away.
            </p>

            <div className="relative mt-9 flex min-h-24 items-center">
              <div className="absolute left-2 top-1 h-20 w-20 rounded-full bg-[#FFE5A5] sm:left-8 sm:h-24 sm:w-24" />
              <div className="absolute left-16 top-5 h-16 w-16 rotate-12 rounded-[1.5rem] bg-[#F07832] sm:left-24 sm:h-20 sm:w-20" />
              <div className="absolute left-28 top-1 flex h-14 w-14 items-center justify-center rounded-full bg-[#DDF2E5] text-[#287B56] sm:left-40 sm:h-16 sm:w-16">
                <Code2 size={25} />
              </div>
              <div className="ml-48 sm:ml-64">
                <p className="text-sm font-semibold">Made for builders.</p>
                <p className="mt-1 text-xs leading-5 text-[#777584]">
                  Curious minds. Real projects.
                  <br />
                  A community that builds together.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative mx-auto w-full max-w-md lg:ml-auto lg:mr-0">
          <div className="pointer-events-none absolute -right-2 -top-5 h-14 w-14 rotate-12 rounded-[1.25rem] bg-[#FFDCCF] sm:-right-6" />
          <div className="pointer-events-none absolute -bottom-5 -left-5 h-16 w-16 rounded-full bg-[#E5E2FF]/80" />

          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFE5A5] text-[#A56A00]">
              <Cloud size={25} />
            </div>

            <p className="mt-5 text-sm font-semibold text-[#F07832]">
              Welcome back, builder
            </p>

            <h2 className="mt-2 text-4xl font-semibold leading-tight tracking-[-0.075em] sm:text-5xl">
              Your space
              <br />
              awaits.
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#777584] sm:text-base">
              Sign in to access your dashboard, discover opportunities, and
              stay connected with AWS SBG.
            </p>

            <a
              href={loginUrl}
              className="group mt-6 flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[#242333] px-6 py-4 text-sm font-semibold text-white transition duration-200 hover:bg-[#6252BD] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E5E2FF]"
            >
              Continue with AWS SBG
              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </a>

            <div className="mt-4 flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DDF2E5] text-[#287B56]">
                <ShieldCheck size={19} />
              </div>

              <div>
                <p className="text-sm font-semibold">Secure sign-in</p>
                <p className="mt-1 text-xs leading-5 text-[#777584]">
                  Authentication is handled by AWS SBG Identity Services.
                  Your password is never entered on this page.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#777584]">
              <Users size={14} />
              <span>One identity for your AWS SBG community.</span>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-[#777584]">
              <Sparkles size={14} className="shrink-0 text-[#F07832]" />
              <span>
                Securely redirected to{" "}
                <span className="font-semibold text-[#242333]">
                  sso.awslpu.in
                </span>
              </span>
            </div>

            <Link
              href="/"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#656474] transition hover:text-[#6252BD]"
            >
              <ArrowRight size={15} className="rotate-180" />
              Back to home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[calc(100svh-80px)] items-center justify-center bg-[#FAF9F6]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E5E2FF] border-t-[#6252BD]" />
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}