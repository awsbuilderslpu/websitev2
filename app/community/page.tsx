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
    color: "bg-[#FFE5A5]",
    iconColor: "text-[#A56A00]",
  },
  {
    icon: Zap,
    title: "Build together",
    description:
      "Join projects, challenges, workshops, and experiments where ideas turn into something real.",
    color: "bg-[#E5E2FF]",
    iconColor: "text-[#6252BD]",
  },
  {
    icon: Globe2,
    title: "Think beyond LPU",
    description:
      "Connect with builders, mentors, speakers, and communities beyond your campus.",
    color: "bg-[#DCEBFF]",
    iconColor: "text-[#3B5FA3]",
  },
  {
    icon: Heart,
    title: "Give back",
    description:
      "Share what you know, help someone get unstuck, and contribute to a community that grows together.",
    color: "bg-[#FFDCCF]",
    iconColor: "text-[#D45B2A]",
  },
];

const communityValues = [
  {
    number: "01",
    title: "Stay curious.",
    description:
      "You don't need to know everything. You just need to be willing to explore.",
    color: "bg-[#FFE5A5]",
  },
  {
    number: "02",
    title: "Build together.",
    description:
      "The best ideas rarely happen alone. We learn faster when we build alongside others.",
    color: "bg-[#E5E2FF]",
  },
  {
    number: "03",
    title: "Take ownership.",
    description:
      "Take an idea, make it yours, and turn it into something people can actually use.",
    color: "bg-[#DDF2E5]",
  },
];

export default function CommunityPage() {
  return (
    <main className="overflow-hidden bg-[#FAF9F6] text-[#242333]">
      <section className="px-5 pb-10 pt-10 sm:px-8 sm:pb-12 sm:pt-14 lg:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <div>
            <h1 className="mt-7 text-[clamp(3.8rem,9vw,7.5rem)] font-semibold leading-[0.86] tracking-[-0.08em]">
              Find your
              <br />
              <span className="text-[#6252BD]">people.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-[#656474] sm:text-lg sm:leading-8">
              AWS Student Builder Group at LPU brings together students,
              developers, creators, mentors, and curious minds who want to
              learn, experiment, and build together.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/events"
                className="group inline-flex items-center gap-3 rounded-full bg-[#242333] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#F07832]"
              >
                Find your next event
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <span className="text-sm text-[#777584]">
                Come curious. Leave inspired.
              </span>
            </div>
          </div>

          <div className="relative mx-auto flex min-h-[320px] w-full max-w-lg items-center justify-center sm:min-h-[390px]">
            <div className="absolute left-[8%] top-[9%] h-24 w-24 rotate-[-12deg] rounded-[2rem] bg-[#FFE5A5] sm:h-28 sm:w-28" />
            <div className="absolute right-[8%] top-[7%] h-20 w-20 rounded-full bg-[#DCEBFF] sm:h-24 sm:w-24" />
            <div className="absolute bottom-[7%] left-[12%] h-24 w-24 rounded-full bg-[#DDF2E5] sm:h-28 sm:w-28" />
            <div className="absolute bottom-[11%] right-[8%] h-24 w-24 rotate-12 rounded-[2rem] bg-[#FFDCCF] sm:h-28 sm:w-28" />

            <div className="relative z-10 flex h-64 w-64 rotate-[-4deg] flex-col justify-between rounded-[2.5rem] bg-[#E5E2FF] p-6 shadow-[0_16px_50px_rgba(36,35,51,0.08)] sm:h-72 sm:w-72 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold">
                  AWS SBG · LPU
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6252BD] text-white">
                  <Users size={21} />
                </span>
              </div>

              <div>
                <p className="text-sm font-medium text-[#6252BD]">
                  Better, together.
                </p>
                <h2 className="mt-3 text-4xl font-semibold leading-[0.92] tracking-[-0.065em] sm:text-5xl">
                  Find
                  <br />
                  your
                  <br />
                  <span className="text-[#F07832]">tribe.</span>
                </h2>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#6252BD]">
                  Many minds. One community.
                </span>
                <Heart size={19} className="text-[#F07832]" />
              </div>
            </div>

            <div className="absolute right-[2%] top-[40%] z-20 flex h-14 w-14 rotate-12 items-center justify-center rounded-2xl bg-[#F07832] text-white shadow-lg sm:right-[4%]">
              <Zap size={25} />
            </div>

            <div className="absolute bottom-[5%] left-[6%] z-20 flex h-12 w-12 -rotate-12 items-center justify-center rounded-full bg-[#242333] text-[#FFE5A5] sm:left-[8%]">
              <Heart size={21} />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[1.75rem] bg-[#FFE5A5] p-6 sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-[#A56A00]">
              <Heart size={22} />
            </div>

            <p className="mt-6 text-sm font-semibold text-[#A56A00]">
              More than a club
            </p>

            <h2 className="mt-3 max-w-md text-3xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-4xl">
              It&apos;s not just about showing up.
            </h2>
          </div>

          <div className="flex flex-col justify-center rounded-[1.75rem] bg-white p-6 sm:p-8">
            <p className="text-lg leading-8 text-[#424153]">
              Community is at the center of everything we do. Events are only
              one part of it. The real value comes from the people you meet,
              the conversations you have, the things you build, and the
              knowledge you pass on.
            </p>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#777584] sm:text-base">
              Whether you&apos;re taking your first steps into cloud computing
              or already building production systems, there&apos;s room to
              learn, contribute, and find your place here.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-[#F07832]">
                Get involved
              </p>
              <h2 className="mt-2 max-w-2xl text-3xl font-semibold leading-[1] tracking-[-0.06em] sm:text-4xl lg:text-5xl">
                There&apos;s more than one way to belong.
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-6 text-[#656474]">
              Find your thing, try something new, and make the community your
              own.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {waysToConnect.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className={`rounded-[1.75rem] p-6 transition-transform duration-200 hover:-translate-y-1 sm:p-7 ${item.color}`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 ${item.iconColor}`}
                  >
                    <Icon size={23} strokeWidth={1.8} />
                  </div>

                  <h3 className="mt-6 text-2xl font-semibold tracking-[-0.045em]">
                    {item.title}
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-7 text-[#555466] sm:text-base">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[2rem] bg-[#DCEBFF] p-6 sm:p-9">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-[#3B5FA3]">
              <Globe2 size={24} />
            </div>

            <p className="mt-6 text-sm font-semibold text-[#3B5FA3]">
              Beyond campus
            </p>

            <h2 className="mt-3 max-w-xl text-4xl font-semibold leading-[0.95] tracking-[-0.065em] sm:text-5xl">
              Your network can go farther.
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-[#455875] sm:text-base">
              Connect with other student communities, developers, mentors,
              speakers, and builders exploring different ideas. Your next
              collaborator might be a conversation away.
            </p>
          </div>

          <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-[2rem] bg-[#242333] p-6 sm:min-h-[360px]">
            <div className="absolute h-64 w-64 rounded-full border border-white/10 sm:h-80 sm:w-80" />
            <div className="absolute h-48 w-48 rounded-full border border-[#B8B3FF]/30 sm:h-60 sm:w-60" />
            <div className="absolute h-32 w-32 rounded-full border border-[#F07832]/50 sm:h-40 sm:w-40" />

            <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[#E5E2FF] text-[#6252BD] sm:h-28 sm:w-28">
              <Globe2 size={38} strokeWidth={1.5} />
            </div>

            <span className="absolute left-[12%] top-[23%] rounded-full bg-[#FFE5A5] px-4 py-2 text-xs font-semibold text-[#66532C]">
              LPU
            </span>

            <span className="absolute right-[8%] top-[43%] rounded-full bg-[#DDF2E5] px-4 py-2 text-xs font-semibold text-[#287B56]">
              Connect
            </span>

            <span className="absolute bottom-[15%] left-[22%] rounded-full bg-[#FFDCCF] px-4 py-2 text-xs font-semibold text-[#A64B2A]">
              Collaborate
            </span>
          </div>
        </div>
      </section>

      <section className="px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <p className="text-sm font-semibold text-[#6252BD]">
              How we show up
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.055em] sm:text-4xl">
              The things we believe in.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {communityValues.map((value) => (
              <article
                key={value.number}
                className={`rounded-[1.75rem] p-6 sm:p-7 ${value.color}`}
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-xs font-semibold text-[#656474]">
                  {value.number}
                </span>

                <h3 className="mt-7 text-2xl font-semibold tracking-[-0.045em]">
                  {value.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#555466]">
                  {value.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-4 rounded-[1.75rem] bg-[#242333] px-6 py-7 text-white sm:px-8">
            <p className="text-2xl font-semibold tracking-[-0.045em] sm:text-3xl">
              Learn something. Build something.{" "}
              <span className="text-[#B8B3FF]">Share it with someone.</span>
            </p>
            <p className="mt-3 text-sm leading-6 text-white/65">
              You don&apos;t have to be an expert to make a difference here.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 pb-10 pt-6 sm:px-8 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#F07832] px-6 py-9 sm:px-9 sm:py-10">
          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/25 px-3 py-1.5 text-xs font-semibold text-[#542B1A]">
                <span className="h-2 w-2 rounded-full bg-[#542B1A]" />
                Your people are out there
              </div>

              <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[0.95] tracking-[-0.065em] text-[#242333] sm:text-5xl lg:text-6xl">
                Come curious.
                <br />
                Leave connected.
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-6 text-[#542B1A] sm:text-base">
                Find your next event and take the first step into the
                community.
              </p>
            </div>

            <Link
              href="/events"
              className="group inline-flex shrink-0 items-center gap-3 self-start rounded-full bg-[#242333] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white hover:text-[#242333] md:self-auto"
            >
              Explore events
              <ArrowUpRight
                size={17}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          <div className="absolute -right-10 -top-16 h-44 w-44 rounded-full border-[25px] border-white/20" />
          <div className="absolute bottom-[-22px] right-[32%] h-12 w-12 rotate-12 rounded-2xl bg-[#FFE5A5]" />
        </div>
      </section>
    </main>
  );
}