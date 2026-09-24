import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#111827]">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#A855F7]/10 blur-[120px]" />

      <div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-10">
        <div className="relative grid min-h-[calc(100vh-76px)] items-center gap-14 py-16 lg:grid-cols-[1fr_0.9fr] lg:gap-20 lg:py-20">
          
          <div className="relative z-10">
            <div className="mb-7 flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7]" />

              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8F96A5]">
                AWS Student Builder Group · LPU
              </span>
            </div>

            <h1 className="max-w-3xl text-6xl font-bold leading-[0.92] tracking-[-0.065em] text-[#F5F5F5] sm:text-7xl lg:text-[6.5rem]">
              Build what&apos;s{" "}
              <span className="text-[#A855F7]">next.</span>
            </h1>

            <p className="mt-8 max-w-lg text-base leading-7 text-[#AEB4C0] sm:text-lg">
              A student-led community at Lovely Professional University for
              people who want to learn cloud, build real products, and grow
              alongside each other.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                href="/events"
                className="group inline-flex items-center gap-3 bg-[#A855F7] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#B45CFF]"
              >
                Explore events

                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/community"
                className="group inline-flex items-center gap-2 text-sm font-medium text-[#D8DBE2] transition-colors hover:text-[#B45CFF]"
              >
                Meet the community

                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            <div className="mt-14 flex items-center gap-8">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#5F6776]">
                  Focus
                </p>
                <p className="mt-1 text-sm text-[#AEB4C0]">
                  Cloud · Development
                </p>
              </div>

              <div className="h-8 w-px bg-white/[0.1]" />

              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#5F6776]">
                  Community
                </p>
                <p className="mt-1 text-sm text-[#AEB4C0]">
                  Learn · Build · Share
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto max-w-[570px]">
              <div className="absolute -left-4 -top-4 h-16 w-16 border-l border-t border-[#A855F7]/60" />

              <div className="absolute -bottom-4 -right-4 h-16 w-16 border-b border-r border-[#A855F7]/60" />

              <div className="relative overflow-hidden">
                <Image
                  src="/images/hero.jpg"
                  alt="AWS Student Builder Group at LPU"
                  width={1536}
                  height={1024}
                  priority
                  sizes="(max-width: 1024px) 100vw, 570px"
                  className="block h-auto w-full"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/70 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5 sm:p-6">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/50">
                      Student community
                    </p>

                    <p className="mt-1.5 text-lg font-semibold tracking-[-0.02em] text-white">
                      Learn. Build. Grow.
                    </p>
                  </div>

                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#A855F7]">
                    LPU / 01
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-5 text-right font-mono text-[9px] uppercase tracking-[0.18em] text-[#5F6776]">
              Lovely Professional University · Punjab, India
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}