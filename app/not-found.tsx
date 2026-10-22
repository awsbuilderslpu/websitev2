import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Construction,
  Home,
  Sparkles,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAF9F6] px-5 py-16 text-[#242333]">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#F9DCC8]/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-[#DCDDFB]/60 blur-3xl" />

      <div className="relative mx-auto w-full max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-10 flex h-56 w-64 items-center justify-center sm:h-64 sm:w-80">
            <div className="absolute left-5 top-8 h-20 w-20 rotate-[-12deg] rounded-[28px] bg-[#FBE5A8] sm:left-10 sm:h-24 sm:w-24" />

            <div className="absolute bottom-7 right-5 h-24 w-24 rotate-[12deg] rounded-[30px] bg-[#DCDDFB] sm:bottom-9 sm:right-10 sm:h-28 sm:w-28" />

            <div className="absolute right-9 top-5 text-[#F07832] sm:right-14">
              <Sparkles size={28} strokeWidth={1.7} />
            </div>

            <div className="absolute bottom-9 left-7 text-[#5257C8] sm:bottom-12 sm:left-12">
              <Sparkles size={21} strokeWidth={1.7} />
            </div>

            <div className="relative z-10 flex h-40 w-40 -rotate-3 flex-col items-center justify-center rounded-[36px] border border-white/80 bg-white/90 shadow-[0_20px_60px_rgba(36,35,51,0.10)] sm:h-48 sm:w-48">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FCE7D9] text-[#F07832] sm:h-20 sm:w-20">
                <Compass
                  size={42}
                  strokeWidth={1.5}
                  className="sm:hidden"
                />
                <Compass
                  size={50}
                  strokeWidth={1.5}
                  className="hidden sm:block"
                />
              </div>

              <div className="flex gap-1.5">
                <span className="h-1.5 w-5 rounded-full bg-[#F07832]" />
                <span className="h-1.5 w-5 rounded-full bg-[#DCDDFB]" />
                <span className="h-1.5 w-5 rounded-full bg-[#FBE5A8]" />
              </div>
            </div>

            <div className="absolute -right-1 bottom-3 flex h-12 w-12 rotate-12 items-center justify-center rounded-2xl bg-[#DDF3E4] text-[#32875A] shadow-sm sm:right-3 sm:bottom-5">
              <Construction size={23} strokeWidth={1.8} />
            </div>
          </div>

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E9E6DE] bg-white/80 px-3.5 py-2 text-xs font-medium text-[#777487] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#F07832]" />
            A LITTLE DETOUR
          </div>

          <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.055em] sm:text-5xl md:text-6xl">
            This page isn&apos;t
            <span className="mt-1 block text-[#5257C8]">
              available right now.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-sm leading-7 text-[#777487] sm:text-base">
            Looks like you&apos;ve reached a page that isn&apos;t ready for you
            just yet. It may still be in development, or it might have moved.
            Either way, there&apos;s nothing to see here just yet.
          </p>

          <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/dashboard"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#5257C8] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(82,87,200,0.18)] transition hover:-translate-y-0.5 hover:bg-[#4549B4] hover:shadow-[0_12px_24px_rgba(82,87,200,0.24)]"
            >
              <Home size={17} />
              Back to dashboard
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E7E4DC] bg-white/80 px-6 py-3.5 text-sm font-semibold text-[#444256] transition hover:-translate-y-0.5 hover:border-[#D7D3C9] hover:bg-white"
            >
              <ArrowLeft size={16} />
              Go to homepage
            </Link>
          </div>

          <div className="mt-16 flex items-center gap-2 text-xs text-[#9290A0]">
            <span className="h-px w-8 bg-[#E5E1D8]" />
            Built for builders, one feature at a time.
            <span className="h-px w-8 bg-[#E5E1D8]" />
          </div>
        </div>
      </div>
    </main>
  );
}