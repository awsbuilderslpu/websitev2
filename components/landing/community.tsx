import Link from "next/link";
import { ArrowUpRight, Globe2, Users } from "lucide-react";

export function Community() {
  return (
    <section className="overflow-hidden border-b border-white/[0.08] bg-[#0D1421]">
      <div className="mx-auto max-w-360 px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_0.85fr] lg:gap-24">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7]" />

              <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#8F96A5]">
                The community
              </span>
            </div>

            <h2 className="mt-7 max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              Built by
              <br />
              <span className="text-[#A855F7]">people.</span>
              <br />
              For people.
            </h2>

            <p className="mt-8 max-w-xl text-base leading-7 text-[#858C9B]">
              Meet students, developers, creators, mentors, and builders who
              are learning, experimenting, and creating together at LPU.
            </p>

            <Link
              href="/community"
              className="group mt-9 inline-flex items-center gap-3 text-sm font-medium text-white transition-colors hover:text-[#B45CFF]"
            >
              Explore the community
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-[480px]">
            <div className="relative aspect-square">
              <div className="absolute inset-[8%] rounded-full border border-white/[0.08]" />

              <div className="absolute inset-[20%] rounded-full border border-[#A855F7]/25" />

              <div className="absolute inset-[32%] rounded-full bg-[#A855F7]" />

              <div className="absolute left-[2%] top-[20%] flex h-14 w-14 items-center justify-center border border-white/[0.1] bg-[#111827] text-[#A855F7]">
                <Users size={21} strokeWidth={1.6} />
              </div>

              <div className="absolute bottom-[15%] right-[5%] flex h-14 w-14 items-center justify-center border border-white/[0.1] bg-[#111827] text-[#A855F7]">
                <Globe2 size={21} strokeWidth={1.6} />
              </div>

              <div className="absolute right-[11%] top-[8%] h-2 w-2 bg-[#A855F7]" />

              <div className="absolute bottom-[8%] left-[18%] h-2 w-2 bg-white/30" />

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#111827]/60">
                  AWS SBG
                </p>

                <p className="mt-1 text-lg font-semibold tracking-[-0.03em] text-[#111827]">
                  LPU
                </p>
              </div>
            </div>

            <div className="absolute -bottom-2 left-0 font-mono text-[10px] uppercase tracking-[0.14em] text-[#626A7A]">
              Learn · Build · Connect
            </div>

            <div className="absolute -right-1 top-1/2 hidden -translate-y-1/2 rotate-90 font-mono text-[10px] uppercase tracking-[0.14em] text-[#626A7A] sm:block">
              Beyond campus
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}