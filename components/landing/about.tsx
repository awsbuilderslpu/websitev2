import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function About() {
  return (
    <section className="border-b border-white/[0.08] bg-[#111827]">
      <div className="mx-auto max-w-360 px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7]" />

              <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#8F96A5]">
                Who we are
              </span>
            </div>

            <p className="mt-8 max-w-xs text-sm leading-6 text-[#777F90]">
              A student-led AWS community at Lovely Professional University,
              built around people who want to create, experiment and learn.
            </p>

            <Link
              href="/community"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#F5F5F5] transition-colors hover:text-[#B45CFF]"
            >
              Meet the community
              <ArrowUpRight
                size={15}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div>
            <h2 className="max-w-5xl text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#F5F5F5] sm:text-5xl lg:text-6xl">
              A place to{" "}
              <span className="text-[#A855F7]">learn</span>, build real
              things, and find people who are just as curious as you.
            </h2>

            <div className="mt-16 grid gap-10 border-t border-white/[0.08] pt-10 sm:grid-cols-3">
              <div>
                <p className="text-2xl font-semibold tracking-tight text-white">
                  Learn
                </p>

                <p className="mt-3 text-sm leading-6 text-[#858C9B]">
                  Workshops, sessions and hands-on experiences that turn cloud
                  concepts into practical skills.
                </p>
              </div>

              <div>
                <p className="text-2xl font-semibold tracking-tight text-white">
                  Build
                </p>

                <p className="mt-3 text-sm leading-6 text-[#858C9B]">
                  Work on projects, experiment with AWS and turn ideas into
                  things people can actually use.
                </p>
              </div>

              <div>
                <p className="text-2xl font-semibold tracking-tight text-white">
                  Connect
                </p>

                <p className="mt-3 text-sm leading-6 text-[#858C9B]">
                  Meet developers, creators and builders from across the LPU
                  community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}