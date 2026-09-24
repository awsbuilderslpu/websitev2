import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Globe2,
  Heart,
  Users,
  Zap,
} from "lucide-react";

const waysToConnect = [
  {
    icon: Users,
    title: "Meet people",
    description:
      "Find students who are learning the same things, solving different problems, and building their own path in tech.",
  },
  {
    icon: Zap,
    title: "Build together",
    description:
      "Join projects, challenges, workshops, and experiments where ideas turn into something real.",
  },
  {
    icon: Globe2,
    title: "Think beyond LPU",
    description:
      "Connect with builders, mentors, speakers, and communities beyond your campus.",
  },
  {
    icon: Heart,
    title: "Give back",
    description:
      "Share what you know, help someone get unstuck, and contribute to a community that grows together.",
  },
];

const communityValues = [
  {
    number: "01",
    title: "Curiosity",
    description:
      "You don't need to know everything. You just need to be willing to explore.",
  },
  {
    number: "02",
    title: "Collaboration",
    description:
      "The best ideas rarely happen alone. We learn faster when we build alongside others.",
  },
  {
    number: "03",
    title: "Ownership",
    description:
      "Take an idea, make it yours, and turn it into something people can actually use.",
  },
];

export default function CommunityPage() {
  return (
    <main className="bg-[#111827] text-white">
      <section className="relative overflow-hidden border-b border-white/[0.08]">
        <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#A855F7]/10 blur-3xl" />

        <div className="mx-auto max-w-360 px-5 py-28 sm:px-8 sm:py-36 lg:px-10 lg:py-10">
          <div className="max-w-5xl">
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7]" />
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#8F96A5]">
                The community
              </span>
            </div>

            <h1 className="mt-8 text-6xl font-semibold leading-[0.9] tracking-[-0.065em] sm:text-7xl lg:text-[9rem]">
              Find your
              <br />
              <span className="text-[#A855F7]">people.</span>
            </h1>

            <p className="mt-10 max-w-2xl text-base leading-7 text-[#858C9B] sm:text-lg sm:leading-8">
              AWS Student Builder Group at LPU brings together students,
              developers, creators, mentors, and curious minds who want to
              learn, experiment, and build together.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.08] bg-[#0D1421]">
        <div className="mx-auto max-w-360 px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
          <div className="grid gap-16 lg:grid-cols-[0.75fr_1.25fr] lg:gap-28">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#A855F7]">
                More than a club
              </p>

              <h2 className="mt-7 text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                A community built around{" "}
                <span className="text-[#A855F7]">doing.</span>
              </h2>
            </div>

            <div className="max-w-2xl">
              <p className="text-lg leading-8 text-[#C7CAD2]">
                Community is at the center of everything we do. Events are
                only one part of it. The real value comes from the people you
                meet, the conversations you have, the things you build, and
                the knowledge you pass on.
              </p>

              <p className="mt-7 text-base leading-7 text-[#858C9B]">
                Whether you're taking your first steps into cloud computing or
                already building production systems, there's room to learn,
                contribute, and find your place here.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.08] bg-[#111827]">
        <div className="mx-auto max-w-360 px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#A855F7]">
              Get involved
            </p>

            <h2 className="mt-7 text-5xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
              There&apos;s more than
              <br />
              one way to <span className="text-[#A855F7]">belong.</span>
            </h2>
          </div>

          <div className="mt-20 border-t border-white/[0.1]">
            {waysToConnect.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="grid gap-6 border-b border-white/[0.08] py-10 sm:grid-cols-[80px_0.8fr_1.2fr] sm:items-start sm:gap-8"
                >
                  <Icon
                    size={22}
                    strokeWidth={1.5}
                    className="text-[#A855F7]"
                  />

                  <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white">
                    {item.title}
                  </h3>

                  <p className="max-w-xl text-sm leading-7 text-[#858C9B] sm:text-base">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b border-white/[0.08] bg-[#0D1421]">
        <div className="mx-auto max-w-360 px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
          <div className="grid items-center gap-16 lg:grid-cols-[1fr_0.85fr] lg:gap-24">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#A855F7]">
                Beyond campus
              </p>

              <h2 className="mt-7 max-w-2xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                Your network can go{" "}
                <span className="text-[#A855F7]">farther.</span>
              </h2>

              <p className="mt-8 max-w-xl text-base leading-7 text-[#858C9B]">
                Being part of SBG LPU can open doors to conversations and
                connections outside your immediate circle. Meet people from
                other student communities, developers, mentors, speakers, and
                builders working on different ideas around the world.
              </p>
            </div>

            <div className="relative mx-auto flex aspect-square w-full max-w-[460px] items-center justify-center">
              <div className="absolute h-full w-full rounded-full border border-white/[0.08]" />
              <div className="absolute h-[76%] w-[76%] rounded-full border border-white/[0.08]" />
              <div className="absolute h-[52%] w-[52%] rounded-full border border-[#A855F7]/30" />

              <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-[#A855F7] text-[#111827]">
                <Globe2 size={38} strokeWidth={1.5} />
              </div>

              <span className="absolute left-[8%] top-[28%] font-mono text-[10px] uppercase tracking-[0.18em] text-[#686F7E]">
                LPU
              </span>

              <span className="absolute right-[5%] top-[45%] font-mono text-[10px] uppercase tracking-[0.18em] text-[#686F7E]">
                Global
              </span>

              <span className="absolute bottom-[17%] left-[24%] font-mono text-[10px] uppercase tracking-[0.18em] text-[#686F7E]">
                Connect
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.08] bg-[#111827]">
        <div className="mx-auto max-w-360 px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
          <div className="max-w-4xl">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#A855F7]">
              How we show up
            </p>

            <h2 className="mt-7 text-5xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-6xl lg:text-8xl">
              Learn.
              <br />
              Build.
              <br />
              <span className="text-[#A855F7]">Share.</span>
            </h2>
          </div>

          <div className="mt-20 border-t border-white/[0.1]">
            {communityValues.map((value) => (
              <div
                key={value.number}
                className="grid gap-5 border-b border-white/[0.08] py-10 sm:grid-cols-[80px_0.7fr_1.3fr] sm:items-start sm:gap-8"
              >
                <span className="font-mono text-xs text-[#686F7E]">
                  {value.number}
                </span>

                <h3 className="text-2xl font-semibold tracking-[-0.03em]">
                  {value.title}
                </h3>

                <p className="max-w-xl text-sm leading-7 text-[#858C9B] sm:text-base">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#A855F7] text-[#111827]">
        <div className="mx-auto max-w-360 px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-36">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] opacity-70">
                Your next step
              </p>

              <h2 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-6xl lg:text-8xl">
                Come build
                <br />
                with us.
              </h2>
            </div>

            <Link
              href="/events"
              className="group inline-flex w-fit items-center gap-3 border-b border-[#111827]/40 pb-2 text-sm font-semibold"
            >
              Explore events
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