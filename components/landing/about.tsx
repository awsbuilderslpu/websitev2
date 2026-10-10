import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function About() {
  return (
    <section className="overflow-hidden border-b border-[#EAE6DE] bg-[#FAF9F6] text-[#242333]">
      <div className="mx-auto max-w-360 px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="grid items-start gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E8E1D7] bg-white px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-[#F07832]" />
              <span className="text-xs font-semibold text-[#555365]">
                A little about us
              </span>
            </div>

            <p className="mt-6 max-w-xs text-base leading-7 text-[#656474]">
              Based at Lovely Professional University, we&apos;re a bunch of
              curious students exploring what&apos;s possible with technology.
              Some come with ideas, some come with questions, and some just
              want to figure out why their code isn&apos;t working.
            </p>

            <Link
              href="/community"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#343348] transition-colors hover:text-[#D96120]"
            >
              Come hang out with us
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div>
            <h2 className="max-w-5xl text-4xl font-semibold leading-[1.08] tracking-[-0.06em] sm:text-5xl lg:text-6xl">
              We like our ideas{" "}
              <span className="text-[#F07832]">big</span>, our code{" "}
              <span className="text-[#5257C8]">messy</span>, and our coffee
              dangerously close to the keyboard.
            </h2>

            <div className="relative mt-8 overflow-hidden rounded-[28px] bg-[#FFE7BD] p-6 sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[#FFC95C] sm:h-64 sm:w-64" />

              <div className="pointer-events-none absolute -bottom-20 right-[28%] h-44 w-44 rounded-full bg-[#F7B9A8]/80" />

              <div className="relative grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="max-w-lg">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8E5828]">
                    So, what happens here?
                  </p>

                  <p className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.04em] text-[#353044] sm:text-3xl">
                    We learn a thing.
                    <br />
                    We build a thing.
                    <br />
                    <span className="text-[#B9562C]">
                      Sometimes we break a thing.
                    </span>
                    <br />
                    Then we figure it out together.
                  </p>
                </div>

                <div className="flex h-20 w-20 rotate-6 items-center justify-center rounded-[26px] bg-[#5257C8] text-3xl text-white shadow-lg shadow-[#5257C8]/15 sm:h-24 sm:w-24">
                  {"</>"}
                </div>
              </div>
            </div>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#656474] sm:text-lg sm:leading-8">
              From experimenting with AWS and shipping side projects to
              learning from each other at workshops, tech talks, and community
              events, we believe the best way to understand technology is to
              get your hands dirty. You don&apos;t need to know everything
              before you join. Being curious is a pretty good start.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium">
              <span className="rounded-full bg-[#E5E5FF] px-3 py-1.5 text-[#5257C8]">
                Cloud curious ☁️
              </span>
              <span className="rounded-full bg-[#DDF2E5] px-3 py-1.5 text-[#327454]">
                Builder energy ✳
              </span>
              <span className="rounded-full bg-[#FCE0D5] px-3 py-1.5 text-[#B9562C]">
                Always learning ↗
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}