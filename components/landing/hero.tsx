import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FAF9F6] text-[#242333]">
      <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-[#FFD166]/35 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-[#B8C8FF]/35 blur-3xl" />

      <div className="relative mx-auto grid max-w-360 items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-10 lg:py-16">
        <div className="relative z-10">

          <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.065em] sm:text-6xl lg:text-7xl xl:text-8xl">
            Learn cloud.
            <br />
            <span className="text-[#F07832]">Build software.</span>
            <br />
            <span className="text-[#5257C8]">Grow together.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-[#656474] sm:text-lg sm:leading-8">
            We&apos;re a student-led tech community at Lovely Professional
            University, bringing builders together to explore AWS and cloud
            computing, develop real-world projects, and learn through hands-on
            workshops, tech talks, and community events.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/community"
              className="group inline-flex items-center gap-3 rounded-full bg-[#F07832] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#D96120]"
            >
              Join our community
              <ArrowUpRight
                size={17}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>

            <Link
              href="/events"
              className="group inline-flex items-center gap-2 px-2 py-3 text-sm font-semibold text-[#343348] transition-colors hover:text-[#5257C8]"
            >
              Explore events
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#858292]">
            <span>Cloud</span>
            <span className="text-[#F07832]">✳</span>
            <span>Development</span>
            <span className="text-[#5257C8]">✳</span>
            <span>Community</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[540px] lg:ml-auto">
          <div className="relative aspect-[0.95] sm:aspect-square">
            <div className="absolute right-[7%] top-[5%] h-[76%] w-[76%] rotate-[9deg] rounded-[42%_58%_62%_38%/43%_39%_61%_57%] bg-[#FFD166]" />

            <div className="absolute right-[2%] top-[14%] h-[67%] w-[68%] -rotate-[8deg] rounded-[55%_45%_37%_63%/42%_56%_44%_58%] bg-[#B9C5FF]" />

            <div className="absolute right-[9%] top-[19%] flex h-[62%] w-[65%] rotate-[4deg] flex-col justify-between rounded-[44%_56%_52%_48%/52%_42%_58%_48%] bg-[#F07832] p-7 text-white sm:p-9">
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                  AWS SBG · LPU
                </span>
                <ArrowUpRight size={22} />
              </div>

              <div className="-rotate-[4deg]">
                <p className="text-[clamp(3rem,6vw,5.5rem)] font-semibold leading-[0.82] tracking-[-0.08em]">
                  IDEAS
                  <br />
                  INTO
                  <br />
                  <span className="text-[#FFE28A]">ACTION.</span>
                </p>
              </div>

              <p className="text-xs font-medium text-white/90">
                Learn together. Build for real.
              </p>
            </div>

            <div className="absolute left-[2%] top-[14%] flex h-[94px] w-[94px] rotate-[-12deg] items-center justify-center rounded-[28px] bg-[#5257C8] text-white shadow-lg shadow-[#5257C8]/15 sm:h-[112px] sm:w-[112px]">
              <div className="text-center">
                <span className="block text-3xl font-semibold leading-none">
                  {"</>"}
                </span>
                <span className="mt-2 block text-[9px] font-semibold uppercase tracking-[0.15em]">
                  Code
                </span>
              </div>
            </div>

            <div className="absolute bottom-[8%] left-[2%] flex h-[86px] w-[86px] items-center justify-center rounded-full bg-[#9BCDB4] text-[#244C3B] sm:h-[102px] sm:w-[102px]">
              <div className="text-center">
                <span className="block text-3xl">✳</span>
                <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.15em]">
                  Connect
                </span>
              </div>
            </div>

            <div className="absolute bottom-[12%] right-[1%] -rotate-6 rounded-full bg-white px-4 py-3 text-xs font-semibold text-[#343348] shadow-sm sm:right-0">
              Your next project starts here ↗
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}