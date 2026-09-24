import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  BriefcaseBusiness,
  Code2,
  Globe2,
  GraduationCap,
  Handshake,
  Lightbulb,
  Mic2,
  Trophy,
  Users,
} from "lucide-react";

const learningPerks = [
  {
    icon: GraduationCap,
    title: "Mentorship",
    description:
      "Guidance from experienced builders, mentors, and community leaders.",
  },
  {
    icon: Award,
    title: "AWS Certification",
    description:
      "Certification preparation, learning resources, and voucher opportunities.",
  },
  {
    icon: BookOpen,
    title: "Mock Exams",
    description:
      "Practice and prepare with certification-focused mock assessments.",
  },
];

const buildPerks = [
  "Hackathons",
  "Build challenges",
  "Open source",
  "Project guidance",
  "Technical workshops",
  "Speaking opportunities",
];

const growthPerks = [
  "Leadership",
  "Career exposure",
  "Industry insights",
  "Portfolio building",
  "Recognition",
  "Community collaboration",
];

export function Perks() {
  return (
    <main className="overflow-hidden bg-[#111827]">
      <section className="relative">
        <div className="mx-auto max-w-[1440px] px-5 pb-28 pt-16 sm:px-8 sm:pb-36 sm:pt-32 lg:px-10 lg:pb-44 lg:pt-10">
          <div className="max-w-6xl">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#8F96A5]">
              Member perks
            </p>

            <h1 className="mt-8 text-[clamp(4rem,10vw,9rem)] font-semibold leading-[0.84] tracking-[-0.075em] text-white">
              Be part of
              <br />
              something
              <br />
              <span className="text-[#A855F7]">bigger.</span>
            </h1>

            <p className="mt-12 max-w-xl text-base leading-7 text-[#858C9B] sm:text-lg">
              SBG is more than a place to attend events. It is a community
              where knowledge, people, opportunities, and ideas come together.
            </p>
          </div>

          <div className="mt-20 flex items-center gap-4 text-[#626A7A]">
            <span className="h-px w-12 bg-[#626A7A]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.16em]">
              01 / Learn
            </span>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.08]">
        <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
          <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr] lg:gap-28">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#A855F7]">
                Learn
              </p>

              <h2 className="mt-5 max-w-md text-4xl font-semibold leading-[1] tracking-[-0.045em] text-white sm:text-5xl">
                Keep learning.
                <br />
                Keep getting better.
              </h2>
            </div>

            <div className="divide-y divide-white/[0.08]">
              {learningPerks.map((perk) => {
                const Icon = perk.icon;

                return (
                  <div
                    key={perk.title}
                    className="group flex gap-6 py-7 first:pt-0 last:pb-0"
                  >
                    <div className="mt-1 shrink-0 text-[#A855F7]">
                      <Icon size={22} strokeWidth={1.6} />
                    </div>

                    <div>
                      <h3 className="text-xl font-medium tracking-[-0.02em] text-white">
                        {perk.title}
                      </h3>

                      <p className="mt-2 max-w-xl text-sm leading-6 text-[#858C9B]">
                        {perk.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[1440px] px-5 py-28 sm:px-8 sm:py-36 lg:px-10 lg:py-44">
          <div className="grid items-center gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-24">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#A855F7]">
                Global connections
              </p>

              <h2 className="mt-7 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
                Your campus
                <br />
                is only the
                <br />
                <span className="text-[#A855F7]">beginning.</span>
              </h2>

              <p className="mt-8 max-w-xl text-base leading-7 text-[#858C9B]">
                Connect with students, developers, mentors, speakers, and AWS
                communities beyond LPU. The people you meet can become
                collaborators, mentors, teammates, and friends.
              </p>
            </div>

            <div className="relative flex aspect-square max-w-[420px] items-center justify-center lg:ml-auto">
              <div className="absolute inset-[12%] rounded-full border border-white/[0.1]" />
              <div className="absolute inset-[25%] rounded-full border border-[#A855F7]/30" />
              <div className="absolute inset-[38%] rounded-full bg-[#A855F7]" />

              <div className="absolute left-[4%] top-[22%] flex h-12 w-12 items-center justify-center border border-white/[0.1] bg-[#111827] text-[#A855F7]">
                <Globe2 size={19} />
              </div>

              <div className="absolute bottom-[18%] right-[8%] flex h-12 w-12 items-center justify-center border border-white/[0.1] bg-[#111827] text-[#A855F7]">
                <Users size={19} />
              </div>

              <div className="absolute right-[4%] top-[15%] h-2 w-2 bg-[#A855F7]" />
              <div className="absolute bottom-[8%] left-[22%] h-2 w-2 bg-white/30" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.08]">
        <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
          <div className="grid gap-14 lg:grid-cols-[0.65fr_1.35fr] lg:gap-24">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#A855F7]">
                Build
              </p>

              <h2 className="mt-5 text-4xl font-semibold leading-[1] tracking-[-0.045em] text-white sm:text-5xl">
                Make things
                <br />
                that matter.
              </h2>
            </div>

            <div className="flex flex-wrap content-start gap-x-10 gap-y-5">
              {buildPerks.map((perk) => (
                <span
                  key={perk}
                  className="text-2xl font-medium tracking-[-0.025em] text-[#C7CAD2] transition-colors hover:text-[#A855F7] sm:text-3xl"
                >
                  {perk}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1440px] px-5 py-28 sm:px-8 sm:py-36 lg:px-10 lg:py-44">
          <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#A855F7]">
                Grow
              </p>

              <h2 className="mt-6 max-w-xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-white sm:text-6xl">
                Build your
                <br />
                own path.
              </h2>
            </div>

            <div>
              <div className="flex flex-wrap gap-x-8 gap-y-5">
                {growthPerks.map((perk) => (
                  <span
                    key={perk}
                    className="text-lg text-[#858C9B] transition-colors hover:text-white"
                  >
                    {perk}
                  </span>
                ))}
              </div>

              <div className="mt-14 border-t border-white/[0.08] pt-8">
                <p className="max-w-lg text-sm leading-6 text-[#626A7A]">
                  Opportunities can vary by program, eligibility, availability,
                  and participation. What remains constant is the community
                  around you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="relative overflow-hidden bg-[#A855F7] px-7 py-16 sm:px-12 lg:px-16 lg:py-20">
            <div className="relative z-10 flex flex-col justify-between gap-10 md:flex-row md:items-end">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#111827]/60">
                  Ready to build?
                </p>

                <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-none tracking-[-0.05em] text-[#111827] sm:text-5xl lg:text-6xl">
                  Find your people.
                  <br />
                  Start building.
                </h2>
              </div>

              <Link
                href="/auth/login"
                className="group inline-flex shrink-0 items-center gap-3 bg-[#111827] px-6 py-4 text-sm font-medium text-white transition-colors hover:bg-[#172033]"
              >
                Join SBG
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border-[40px] border-[#111827]/10" />
          </div>
        </div>
      </section>
    </main>
  );
}