import Link from "next/link";
import { ArrowUpRight, Globe2, Users } from "lucide-react";

export function Community() {
  return (
    <section className="overflow-hidden border-b border-[#EAE6DE] bg-[#FAF9F6] text-[#242333]">
      <div className="mx-auto max-w-360 px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E8E1D7] bg-white px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-[#5257C8]" />
              <span className="text-xs font-semibold text-[#555365]">
                People make the community
              </span>
            </div>

            <h2 className="mt-6 max-w-3xl text-5xl font-semibold leading-[0.96] tracking-[-0.065em] sm:text-6xl lg:text-7xl">
              Find your
              <br />
              <span className="text-[#F07832]">kind of</span>
              <br />
              <span className="text-[#5257C8]">people.</span>
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-[#656474] sm:text-lg sm:leading-8">
              Have a cloud question, a half-built project, or an idea you
              can&apos;t stop thinking about? You&apos;ll fit right in. AWS SBG
              brings LPU students together to learn AWS, share what they know,
              collaborate on projects, and make technology a little less
              intimidating.
            </p>

            <Link
              href="/community"
              className="group mt-7 inline-flex items-center gap-3 rounded-full bg-[#5257C8] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#4145AE]"
            >
              Come be part of it
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>

            <p className="mt-5 text-sm text-[#858292]">
              No need to know it all. Just bring your curiosity.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[480px]">
            <div className="relative aspect-square">
              <div className="absolute right-[7%] top-[5%] h-[70%] w-[70%] rotate-12 rounded-[38%_62%_57%_43%/42%_39%_61%_58%] bg-[#FFD166]" />

              <div className="absolute bottom-[5%] left-[5%] h-[64%] w-[64%] -rotate-12 rounded-[57%_43%_35%_65%/48%_56%_44%_52%] bg-[#B9C5FF]" />

              <div className="absolute right-[8%] top-[19%] flex h-[53%] w-[65%] rotate-[5deg] flex-col justify-between rounded-[30px] bg-[#F07832] p-6 text-white sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                    AWS SBG · LPU
                  </span>
                  <Users size={21} />
                </div>

                <div className="-rotate-[5deg]">
                  <p className="text-5xl font-semibold leading-[0.86] tracking-[-0.075em] sm:text-6xl">
                    BETTER
                    <br />
                    <span className="text-[#FFE3B3]">TOGETHER.</span>
                  </p>
                </div>

                <p className="text-xs font-medium text-white/85">
                  Different minds. Shared curiosity.
                </p>
              </div>

              <div className="absolute left-[0%] top-[12%] flex h-[82px] w-[82px] -rotate-12 items-center justify-center rounded-[25px] bg-[#5257C8] text-white shadow-lg shadow-[#5257C8]/15 sm:h-[96px] sm:w-[96px]">
                <div className="text-center">
                  <Globe2 size={27} strokeWidth={1.6} className="mx-auto" />
                  <span className="mt-2 block text-[9px] font-semibold uppercase tracking-[0.12em]">
                    Explore
                  </span>
                </div>
              </div>

              <div className="absolute bottom-[7%] right-[2%] flex h-[88px] w-[88px] rotate-6 flex-col items-center justify-center rounded-full bg-[#DDF2E5] text-[#327454] sm:h-[100px] sm:w-[100px]">
                <span className="text-3xl">✳</span>
                <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.12em]">
                  Connect
                </span>
              </div>

              <div className="absolute bottom-[9%] left-[4%] -rotate-6 rounded-full bg-white px-4 py-3 text-xs font-semibold text-[#343348] shadow-sm">
                Your people are out there ↗
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}