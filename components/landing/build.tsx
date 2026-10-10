import Link from "next/link";
import { ArrowUpRight, Cloud, Code2, Users } from "lucide-react";

const areas = [
  {
    icon: Cloud,
    title: "Cloud, without the mystery.",
    description:
      "Get hands-on with AWS, explore cloud services, experiment with deployments, and understand how real infrastructure works.",
    color: "bg-[#FFE3B3]",
    iconColor: "text-[#9A4D00]",
    accent: "text-[#C66B35]",
    shape: "rounded-[30px_30px_30px_8px]",
    label: "EXPLORE",
  },
  {
    icon: Code2,
    title: "Ideas that actually ship.",
    description:
      "Build websites, applications, automations, and cloud-powered projects. Learn by solving problems instead of just collecting tutorials.",
    color: "bg-[#E5E5FF]",
    iconColor: "text-[#5257C8]",
    accent: "text-[#5257C8]",
    shape: "rounded-[30px_8px_30px_30px]",
    label: "EXPERIMENT",
  },
  {
    icon: Users,
    title: "Better things, together.",
    description:
      "Join workshops, tech talks, hackathons, and collaborative sessions where students exchange ideas and help each other grow.",
    color: "bg-[#DDF2E5]",
    iconColor: "text-[#327454]",
    accent: "text-[#327454]",
    shape: "rounded-[8px_30px_30px_30px]",
    label: "COLLABORATE",
  },
];

export function Build() {
  return (
    <section className="overflow-hidden border-b border-[#EAE6DE] bg-[#FAF9F6] text-[#242333]">
      <div className="mx-auto max-w-360 px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E8E1D7] bg-white px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-[#5257C8]" />
              <span className="text-xs font-semibold text-[#555365]">
                What we get up to
              </span>
            </div>

            <h2 className="mt-6 max-w-md text-4xl font-semibold leading-[1.04] tracking-[-0.06em] sm:text-5xl lg:text-6xl">
              Less talking.
              <br />
              More <span className="text-[#F07832]">making.</span>
            </h2>

            <p className="mt-5 max-w-sm text-base leading-7 text-[#656474]">
              Technology makes a lot more sense when you get your hands dirty.
              Around here, curiosity usually turns into code, experiments, and
              projects worth sharing.
            </p>

            <Link
              href="/projects"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#343348] transition-colors hover:text-[#F07832]"
            >
              See what we build
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>

            <div className="relative mt-10 hidden max-w-xs sm:block">
              <div className="absolute -left-2 top-1 h-12 w-12 rotate-12 rounded-2xl bg-[#FFD166]" />
              <div className="relative ml-5 rotate-[-3deg] rounded-[24px] bg-[#5257C8] px-5 py-4 text-white">
                <p className="text-lg font-semibold tracking-tight">
                  Curious enough to try?
                </p>
                <p className="mt-1 text-sm text-white/80">
                  You&apos;re already one of us.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {areas.map((area, index) => {
              const Icon = area.icon;

              return (
                <article
                  key={area.title}
                  className={`group relative flex min-h-[250px] flex-col justify-between overflow-hidden p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-7 ${
                    index === 0
                      ? `${area.color} ${area.shape}`
                      : index === 1
                        ? `${area.color} ${area.shape}`
                        : `${area.color} ${area.shape} sm:col-span-2 sm:min-h-[190px]`
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 ${area.iconColor}`}
                    >
                      <Icon size={22} strokeWidth={1.8} />
                    </div>

                    <span
                      className={`text-[10px] font-semibold tracking-[0.16em] ${area.accent}`}
                    >
                      {area.label}
                    </span>
                  </div>

                  <div
                    className={
                      index === 2
                        ? "sm:grid sm:grid-cols-[1fr_1fr] sm:items-end sm:gap-8"
                        : ""
                    }
                  >
                    <h3 className="max-w-sm text-2xl font-semibold leading-tight tracking-[-0.045em] text-[#242333] sm:text-[27px]">
                      {area.title}
                    </h3>

                    <p className="mt-3 max-w-md text-sm leading-6 text-[#555365]">
                      {area.description}
                    </p>
                  </div>

                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute -bottom-10 -right-8 h-28 w-28 rounded-full border-[18px] border-white/25 transition-transform duration-300 group-hover:scale-110 ${
                      index === 0
                        ? "rotate-12"
                        : index === 1
                          ? "-rotate-12"
                          : "rotate-45"
                    }`}
                  />
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}