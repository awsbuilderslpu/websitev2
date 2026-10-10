import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  Code2,
  Globe2,
  GraduationCap,
  Lightbulb,
  Mic2,
  Trophy,
  Users,
  Handshake
} from "lucide-react";

const learningPerks = [
  {
    icon: GraduationCap,
    title: "Mentorship",
    description:
      "Learn from experienced builders, mentors, and community leaders who can help you find your direction.",
    color: "bg-[#DDF2E5]",
    iconColor: "text-[#287B56]",
  },
  {
    icon: Award,
    title: "AWS Certification",
    description:
      "Explore certification preparation, learning resources, and voucher opportunities when available.",
    color: "bg-[#FFE3D3]",
    iconColor: "text-[#D45B2A]",
  },
  {
    icon: BookOpen,
    title: "Mock Exams",
    description:
      "Practice your knowledge with certification-focused mock assessments and learn at your own pace.",
    color: "bg-[#E5E2FF]",
    iconColor: "text-[#6252BD]",
  },
];

const buildPerks = [
  { label: "Hackathons", icon: Trophy, color: "bg-[#FFE5A5]" },
  { label: "Build challenges", icon: Lightbulb, color: "bg-[#E5E2FF]" },
  { label: "Open source", icon: Code2, color: "bg-[#DDF2E5]" },
  { label: "Project guidance", icon: GraduationCap, color: "bg-[#FFDCCF]" },
  { label: "Technical workshops", icon: BookOpen, color: "bg-[#DCEBFF]" },
  { label: "Speaking opportunities", icon: Mic2, color: "bg-[#F9DDF0]" },
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
    <main className="overflow-hidden bg-[#FAF9F6] text-[#242333]">
      <section className="px-5 pb-14 pt-10 sm:px-8 sm:pb-16 sm:pt-14 lg:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div>

            <h1 className="mt-7 max-w-3xl text-[clamp(3.5rem,8vw,7rem)] font-semibold leading-[0.88] tracking-[-0.075em]">
              More than
              <br />
              just a <span className="text-[#F07832]">club.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-[#656474] sm:text-lg sm:leading-8">
              A place to learn new skills, build real things, meet your people,
              and discover what you can do. Your next opportunity might start
              with a conversation here.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/auth/login"
                className="group inline-flex items-center gap-3 rounded-full bg-[#242333] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#F07832]"
              >
                Find your people
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <span className="text-sm text-[#777584]">
                Learn something. Build something.
              </span>
            </div>
          </div>

          <div className="relative mx-auto flex min-h-[330px] w-full max-w-lg items-center justify-center sm:min-h-[390px]">
            <div className="absolute left-[10%] top-[12%] h-24 w-24 rotate-[-12deg] rounded-[2rem] bg-[#FFE5A5] sm:h-28 sm:w-28" />
            <div className="absolute right-[8%] top-[8%] h-20 w-20 rounded-full bg-[#DCEBFF] sm:h-24 sm:w-24" />
            <div className="absolute bottom-[8%] left-[12%] h-24 w-24 rounded-full bg-[#DDF2E5] sm:h-28 sm:w-28" />
            <div className="absolute bottom-[12%] right-[9%] h-24 w-24 rotate-12 rounded-[2rem] bg-[#F9DDF0] sm:h-28 sm:w-28" />

            <div className="relative z-10 flex h-64 w-64 rotate-[-4deg] flex-col justify-between rounded-[2.5rem] bg-[#E5E2FF] p-6 shadow-[0_16px_50px_rgba(36,35,51,0.08)] sm:h-72 sm:w-72 sm:p-8">
              <div className="flex items-start justify-between">
                <span className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold">
                  AWS SBG · LPU
                </span>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6252BD] text-white">
                  <Lightbulb size={23} />
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-[#6252BD]">
                  Curiosity looks good on you.
                </p>
                <h2 className="mt-3 text-4xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-5xl">
                  Learn.
                  <br />
                  Build.
                  <br />
                  <span className="text-[#6252BD]">Belong.</span>
                </h2>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#6252BD]">
                  Your next chapter starts here
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#6252BD]">
                  <ArrowRight size={17} />
                </div>
              </div>
            </div>

            <div className="absolute right-[2%] top-[38%] z-20 flex h-14 w-14 rotate-12 items-center justify-center rounded-2xl bg-[#F07832] text-white shadow-lg sm:right-[4%]">
              <Code2 size={25} />
            </div>

            <div className="absolute bottom-[5%] left-[6%] z-20 flex h-12 w-12 -rotate-12 items-center justify-center rounded-full bg-[#242333] text-[#FFE5A5] sm:left-[8%]">
              <Users size={22} />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-[#F07832]">
                First things first
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.055em] sm:text-4xl">
                Get better at your craft.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-[#656474]">
              You don&apos;t need to know everything before you start. You just
              need room to learn and people to learn with.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {learningPerks.map((perk) => {
              const Icon = perk.icon;

              return (
                <article
                  key={perk.title}
                  className={`${perk.color} flex min-h-[220px] flex-col rounded-[1.75rem] p-6 transition-transform duration-200 hover:-translate-y-1 sm:p-7`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 ${perk.iconColor}`}
                  >
                    <Icon size={23} strokeWidth={1.8} />
                  </div>

                  <div className="mt-8">
                    <h3 className="text-xl font-semibold tracking-tight">
                      {perk.title}
                    </h3>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-[#555466]">
                      {perk.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="mt-4 text-xs leading-5 text-[#777584]">
            Certification vouchers and other benefits depend on program
            eligibility and availability.
          </p>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#FFE5A5] p-7 sm:p-9">
            <div className="relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-[#A56A00]">
                <Globe2 size={23} />
              </div>

              <p className="mt-7 text-sm font-semibold text-[#A56A00]">
                Beyond the classroom
              </p>

              <h2 className="mt-3 max-w-lg text-4xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-5xl">
                Your campus is only the beginning.
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-6 text-[#66532C] sm:text-base sm:leading-7">
                Meet students, developers, mentors, and speakers. Share what
                you&apos;re learning, discover new perspectives, and find
                collaborators for what comes next.
              </p>
            </div>

            <div className="absolute -bottom-14 -right-10 h-48 w-48 rounded-full border-[28px] border-white/30" />
            <div className="absolute right-[22%] top-[10%] h-3 w-3 rounded-full bg-[#F07832]" />
          </div>

          <div className="rounded-[2rem] bg-[#242333] p-7 text-white sm:p-9">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DDF2E5] text-[#287B56]">
              <Code2 size={23} />
            </div>

            <p className="mt-7 text-sm font-semibold text-[#B8B3FF]">
              Make it real
            </p>

            <h2 className="mt-3 max-w-lg text-4xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-5xl">
              Ideas are great. Built things are better.
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-6 text-white/70 sm:text-base sm:leading-7">
              Turn curiosity into hands-on experience through hackathons,
              open-source contributions, build challenges, and practical
              workshops.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {buildPerks.map((perk) => (
                <span
                  key={perk.label}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-[#242333] ${perk.color}`}
                >
                  <perk.icon size={14} />
                  {perk.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#DCEBFF] p-7 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-[#3B5FA3]">
                <Trophy size={23} />
              </div>

              <p className="mt-6 text-sm font-semibold text-[#3B5FA3]">
                Your journey, your way
              </p>

              <h2 className="mt-3 max-w-md text-4xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-5xl">
                Grow into the builder you want to be.
              </h2>

              <p className="mt-4 max-w-md text-sm leading-6 text-[#455875] sm:text-base sm:leading-7">
                Take initiative, share your work, learn from others, and find
                opportunities to contribute. There&apos;s no single path to
                growth.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {growthPerks.map((perk, index) => (
                <div
                  key={perk}
                  className={`flex min-h-28 flex-col justify-between rounded-2xl p-4 sm:min-h-32 sm:p-5 ${
                    [
                      "bg-white/80",
                      "bg-[#FFE5A5]",
                      "bg-[#DDF2E5]",
                      "bg-[#F9DDF0]",
                      "bg-white/80",
                      "bg-[#FFE3D3]",
                    ][index]
                  }`}
                >
                  <span className="text-xs font-semibold text-[#777584]">
                    0{index + 1}
                  </span>
                  <span className="text-base font-semibold leading-tight tracking-tight text-[#242333] sm:text-lg">
                    {perk}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3 border-t border-[#3B5FA3]/15 pt-5 text-sm leading-6 text-[#455875]">
            <Handshake size={19} className="mt-0.5 shrink-0" />
            <p>
              Some opportunities depend on program eligibility, availability,
              and participation. The community is here to help you keep moving
              forward.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 pb-10 pt-6 sm:px-8 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#F07832] px-7 py-10 sm:px-10 sm:py-12 lg:px-12">
          <div className="relative z-10 flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/25 px-3 py-1.5 text-xs font-semibold text-[#542B1A]">
                <span className="h-2 w-2 rounded-full bg-[#542B1A]" />
                Your next chapter
              </div>

              <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[0.95] tracking-[-0.065em] text-[#242333] sm:text-5xl lg:text-6xl">
                Find your people.
                <br />
                Make something matter.
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-6 text-[#542B1A] sm:text-base">
                Bring your curiosity. We&apos;ll figure out the rest together.
              </p>
            </div>

            <Link
              href="/auth/login"
              className="group inline-flex shrink-0 items-center justify-center gap-3 self-start rounded-full bg-[#242333] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white hover:text-[#242333] md:self-auto"
            >
              Join SBG
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="absolute -right-12 -top-20 h-52 w-52 rounded-full border-[30px] border-white/20" />
          <div className="absolute bottom-[-35px] right-[28%] h-20 w-20 rotate-12 rounded-3xl bg-[#FFE5A5]" />
        </div>
      </section>
    </main>
  );
}