import { ArrowUpRight, Cloud, Code2, Users } from "lucide-react";

const areas = [
  {
    number: "01",
    icon: Cloud,
    title: "Cloud",
    description:
      "Explore AWS through hands-on learning, workshops, and real infrastructure.",
  },
  {
    number: "02",
    icon: Code2,
    title: "Projects",
    description:
      "Turn ideas into working products with modern technologies and cloud services.",
  },
  {
    number: "03",
    icon: Users,
    title: "Community",
    description:
      "Meet builders, share knowledge, collaborate, and grow together.",
  },
];

export function Build() {
  return (
    <section className="border-b border-white/[0.08] bg-[#111827]">
      <div className="mx-auto max-w-360 px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
        <div className="grid gap-16 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7]" />

              <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#8F96A5]">
                What we build
              </span>
            </div>

            <h2 className="mt-6 max-w-md text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-white sm:text-5xl">
              More than
              <br />
              <span className="text-[#A855F7]">just events.</span>
            </h2>

            <p className="mt-7 max-w-sm text-sm leading-7 text-[#858C9B]">
              SBG is a place to experiment with technology, work on meaningful
              ideas, and find people to build alongside.
            </p>
          </div>

          <div className="border-t border-white/[0.1]">
            {areas.map((area) => {
              const Icon = area.icon;

              return (
                <div
                  key={area.number}
                  className="group grid gap-6 border-b border-white/[0.1] py-8 transition-colors hover:bg-white/[0.025] sm:grid-cols-[56px_48px_1fr_auto] sm:items-center"
                >
                  <span className="font-mono text-xs text-[#626A7A]">
                    {area.number}
                  </span>

                  <div className="flex h-11 w-11 items-center justify-center border border-white/[0.1] text-[#A855F7] transition-all duration-200 group-hover:border-[#A855F7] group-hover:bg-[#A855F7] group-hover:text-white">
                    <Icon size={19} strokeWidth={1.7} />
                  </div>

                  <div>
                    <h3 className="text-2xl font-medium tracking-tight text-white">
                      {area.title}
                    </h3>

                    <p className="mt-2 max-w-lg text-sm leading-6 text-[#858C9B]">
                      {area.description}
                    </p>
                  </div>

                  <ArrowUpRight
                    size={19}
                    className="hidden text-[#626A7A] transition-all duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#A855F7] sm:block"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}