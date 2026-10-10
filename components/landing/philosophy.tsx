const principles = [
  {
    title: "Stay curious.",
    description:
      "Nobody starts knowing everything. Ask the weird question, try the unfamiliar tool, break something in a sandbox, and learn why it happened.",
    color: "#F07832",
    background: "bg-[#FFE3B3]",
    rotation: "rotate-[-2deg]",
    symbol: "?",
  },
  {
    title: "Make things real.",
    description:
      "Tutorials are a start, not the finish line. Turn what you learn into projects, experiment with AWS, and discover how things work in the real world.",
    color: "#5257C8",
    background: "bg-[#E5E5FF]",
    rotation: "rotate-[1.5deg]",
    symbol: "</>",
  },
  {
    title: "Pass it on.",
    description:
      "Share your discoveries, help someone through a bug, and talk about what went wrong as well as what worked. We all get better when knowledge is shared.",
    color: "#327454",
    background: "bg-[#DDF2E5]",
    rotation: "rotate-[-1deg]",
    symbol: "✳",
  },
];

export function Philosophy() {
  return (
    <section className="overflow-hidden border-b border-[#EAE6DE] bg-[#FAF9F6] text-[#242333]">
      <div className="mx-auto max-w-360 px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E8E1D7] bg-white px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-[#F07832]" />
              <span className="text-xs font-semibold text-[#555365]">
                The way we do things
              </span>
            </div>

            <h2 className="mt-6 text-6xl font-semibold leading-[0.88] tracking-[-0.075em] sm:text-7xl lg:text-8xl">
              Learn.
              <br />
              <span className="text-[#F07832]">Build.</span>
              <br />
              <span className="text-[#5257C8]">Share.</span>
            </h2>
          </div>

          <p className="max-w-lg text-base leading-7 text-[#656474] sm:text-lg sm:leading-8 lg:justify-self-end">
            We&apos;re here to do more than collect certificates or sit through
            sessions. We want to understand how technology works, create
            things we&apos;re proud of, and make the journey easier for the
            next person.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {principles.map((principle) => (
            <article
              key={principle.title}
              className={`group relative flex min-h-[270px] flex-col justify-between overflow-hidden rounded-[28px] p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-7 ${principle.background}`}
            >
              <div className="flex items-start justify-between">
                <span
                  className="text-xs font-semibold uppercase tracking-[0.16em]"
                  style={{ color: principle.color }}
                >
                  A little reminder
                </span>

                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white/75 text-lg font-semibold transition-transform duration-300 group-hover:rotate-6 ${principle.rotation}`}
                  style={{ color: principle.color }}
                >
                  {principle.symbol}
                </span>
              </div>

              <div className="relative">
                <h3
                  className="text-3xl font-semibold tracking-[-0.055em] sm:text-4xl"
                  style={{ color: principle.color }}
                >
                  {principle.title}
                </h3>

                <p className="mt-3 max-w-sm text-sm leading-6 text-[#555365]">
                  {principle.description}
                </p>
              </div>

              <div
                className="pointer-events-none absolute -bottom-12 -right-10 h-32 w-32 rounded-full border-[20px] border-white/30 transition-transform duration-300 group-hover:scale-110"
                aria-hidden="true"
              />
            </article>
          ))}
        </div>

        <p className="mt-8 text-sm font-medium text-[#858292]">
          No one knows everything. Everyone has something to share. ✳
        </p>
      </div>
    </section>
  );
}