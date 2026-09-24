const principles = [
  {
    number: "01",
    title: "Learn openly.",
    description:
      "Ask questions, share knowledge, experiment freely, and learn from the people around you.",
  },
  {
    number: "02",
    title: "Build together.",
    description:
      "Great ideas become better when different people bring their skills, perspectives, and energy to them.",
  },
  {
    number: "03",
    title: "Share what you know.",
    description:
      "Your experience can help someone else take their next step. Knowledge grows when it moves.",
  },
];

export function Philosophy() {
  return (
    <section className="border-b border-white/[0.08] bg-[#111827]">
      <div className="mx-auto max-w-360 px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
        <div className="max-w-5xl">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#A855F7]">
            What we believe
          </p>

          <h2 className="mt-8 text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-white sm:text-6xl lg:text-8xl">
            Learn.
            <br />
            Build.
            <br />
            <span className="text-[#A855F7]">Share.</span>
          </h2>
        </div>

        <div className="mt-20 border-t border-white/[0.1]">
          {principles.map((principle) => (
            <div
              key={principle.number}
              className="grid gap-6 border-b border-white/[0.1] py-8 md:grid-cols-[80px_0.8fr_1.2fr] md:items-start md:gap-12 lg:py-10"
            >
              <span className="font-mono text-xs text-[#626A7A]">
                {principle.number}
              </span>

              <h3 className="text-2xl font-medium tracking-[-0.03em] text-white sm:text-3xl">
                {principle.title}
              </h3>

              <p className="max-w-lg text-sm leading-7 text-[#858C9B] sm:text-base">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}