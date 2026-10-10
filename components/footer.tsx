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
  {
    label: "Instagram",
    href: "https://instagram.com/awsbuilders.lpu",
    hover: "hover:bg-[#FFD9E5] hover:text-[#B83264]",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/awsbuilderslpu",
    hover: "hover:bg-[#DCD9FF] hover:text-[#5257C8]",
  },
  {
    label: "GitHub",
    href: "https://github.com/awsbuilderslpu",
    hover: "hover:bg-[#DDF2E5] hover:text-[#28764A]",
  },
];

export function Footer() {
  return (
    <footer className="bg-[#FAF9F6] px-4 pb-4 text-[#242333] sm:px-6">
      <div className="mx-auto max-w-360 overflow-hidden rounded-[28px] bg-[#F0EDE5]">
        <div className="relative flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFD166]">
              <Image
                src="/images/logo/aws_sbg.png"
                alt="AWS Student Builder Group logo"
                width={100}
                height={36}
                className="h-auto w-[88px] max-w-none"
              />
            </div>

            <div>
              <p className="text-sm font-semibold tracking-tight">
                AWS Student Builder Group
              </p>
              <p className="mt-0.5 text-xs text-[#656474]">
                Lovely Professional University
              </p>
            </div>
          </div>

          <nav
            aria-label="Footer navigation"
            className="relative z-10 flex flex-wrap gap-2"
          >
            {navigation.map((item, index) => {
              const colors = [
                "bg-[#FFD166] hover:bg-[#F6C34F]",
                "bg-[#DCD9FF] hover:bg-[#CBC7FF]",
                "bg-[#DDF2E5] hover:bg-[#C7E9D4]",
                "bg-[#FFD9C8] hover:bg-[#FFC7AF]",
              ];

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3.5 py-2 text-xs font-medium transition-transform hover:-translate-y-0.5 ${colors[index]}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="pointer-events-none absolute -right-3 -top-7 h-20 w-20 rotate-12 rounded-[24px] bg-[#F07832]/15 sm:right-[25%] sm:top-auto sm:bottom-[-30px]" />

          <div className="pointer-events-none absolute right-8 top-3 h-3 w-3 rounded-full bg-[#5257C8] sm:right-[28%] sm:top-5" />

          <span className="pointer-events-none absolute right-5 bottom-4 rotate-[-12deg] text-2xl text-[#F07832] sm:right-[27%]">
            ✳
          </span>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#242333]/10 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <p className="text-[11px] text-[#656474]">
            © {new Date().getFullYear()} AWS SBG · LPU
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[11px] text-[#656474]">
              Find us around the web
            </span>

            {social.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit AWS SBG on ${item.label}`}
                className={`group inline-flex h-8 items-center gap-1.5 rounded-full bg-white px-3 text-[11px] font-medium text-[#656474] transition-all hover:-translate-y-0.5 ${item.hover}`}
              >
                {item.label}
                <ArrowUpRight
                  size={12}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}