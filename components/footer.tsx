import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const navigation = [
  { label: "Events", href: "/events" },
  { label: "Projects", href: "/projects" },
  { label: "Community", href: "/community" },
  { label: "Perks", href: "/perks" },
];

const social = [
  { label: "Instagram", href: "https://instagram.com/awsbuilders.lpu" },
  { label: "LinkedIn", href: "https://linkedin.com/company/awsbuilderslpu" },
  { label: "GitHub", href: "https://github.com/awsbuilderslpu" },
];

export function Footer() {
  return (
    <footer className="bg-[#0D1421] text-white">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
        <div className="border-b border-white/[0.08] py-20 sm:py-24 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-[1.4fr_0.6fr]">
            <div>
              <Image
                src="/images/logo/aws_sbg.png"
                alt="AWS Student Builder Group at LPU"
                width={220}
                height={60}
                className="h-auto w-[190px]"
              />

              <h2 className="mt-10 max-w-2xl text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                Keep learning.
                <br />
                Keep building.
              </h2>

              <p className="mt-6 max-w-lg text-sm leading-6 text-[#858C9B] sm:text-base">
                A student-led community at Lovely Professional University for
                people who want to learn, build, and grow together.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-2">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#A855F7]">
                  Explore
                </p>

                <nav className="mt-6 flex flex-col gap-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="w-fit text-sm text-[#C7CAD2] transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#A855F7]">
                  Connect
                </p>

                <nav className="mt-6 flex flex-col gap-4">
                  {social.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="group flex w-fit items-center gap-2 text-sm text-[#C7CAD2] transition-colors hover:text-white"
                    >
                      {item.label}
                      <ArrowUpRight
                        size={13}
                        className="opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-7 text-xs text-[#686F7E] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} AWS Student Builder Group at LPU.
          </p>

          <div className="flex items-center gap-5">
            <span>Built by students at LPU</span>
            <span className="h-1 w-1 rounded-full bg-[#A855F7]" />
            <span>Keep building.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}