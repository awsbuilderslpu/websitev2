"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Award,
  CalendarCheck,
  CheckCircle2,
  Copy,
  Download,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";

type AuthUser = {
  sub: string;
  name: string | null;
  email: string | null;
  picture: string | null;
  role: "member" | "core" | "admin";
};

type CoreDashboardProps = {
  user: AuthUser;
};

const dashboardItems = [
  {
    title: "My Profile",
    description:
      "View and manage your AWS SBG profile information.",
    href: "/profile",
    icon: UserRound,
  },
  {
    title: "Manage Attendance",
    description:
      "Manage attendance and participation for community events.",
    href: "/dashboard/attendance/manage",
    icon: ShieldCheck,
  },
  {
    title: "My Attendance",
    description:
      "View your event attendance and participation history.",
    href: "/dashboard/attendance",
    icon: CalendarCheck,
  },
  {
    title: "My Badges",
    description:
      "View the badges you have earned through the community.",
    href: "/dashboard/badges",
    icon: Award,
  },
];

export function CoreDashboard({
  user,
}: CoreDashboardProps) {
  const [copied, setCopied] = useState(false);

  const displayName =
    user.name ||
    user.email?.split("@")[0] ||
    "Core Member";

  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const qrUrl = useMemo(() => {
    const encodedId = encodeURIComponent(user.sub);

    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedId}`;
  }, [user.sub]);

  async function copyId() {
    try {
      await navigator.clipboard.writeText(user.sub);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }

  function downloadQr() {
    const link = document.createElement("a");

    link.href = qrUrl;
    link.download = `sbg-profile-${user.sub}.png`;
    link.target = "_blank";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <main className="min-h-screen bg-[#111827] text-[#F5F5F5]">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute -right-48 -top-48 h-150 w-150 rounded-full bg-[#A855F7]/10 blur-[140px]" />

        <div className="mx-auto max-w-360 px-5 pb-16 pt-16 sm:px-8 lg:px-10 lg:pb-20 lg:pt-20">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[#B45CFF]">
                <span className="h-px w-8 bg-[#A855F7]" />
                Core Dashboard
              </div>

              <h1 className="text-5xl font-bold leading-[0.95] tracking-[-0.055em] sm:text-6xl">
                Welcome,
                <br />
                <span className="text-[#A855F7]">
                  {displayName.split(" ")[0]}.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-[#9CA3AF] sm:text-lg">
                Your SBG profile, attendance, badges, and
                community operations.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Avatar
                src={user.picture}
                initials={initials}
                name={displayName}
              />

              <div>
                <p className="text-sm font-medium text-white">
                  {displayName}
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs text-[#737B8C]">
                    {user.email}
                  </span>

                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#A855F7]">
                    Core
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-360 px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="grid gap-16 lg:grid-cols-[1fr_0.7fr] lg:gap-24">
          <div>
            <div className="mb-10">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B45CFF]">
                Core access
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Your SBG space.
              </h2>
            </div>

            <div className="border-t border-white/10">
              {dashboardItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group grid gap-5 border-b border-white/10 py-8 transition-colors hover:bg-white/[0.025] sm:grid-cols-[55px_1fr_auto] sm:items-center sm:gap-8"
                  >
                    <span className="font-mono text-xs text-[#596273]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div>
                      <div className="flex items-center gap-3">
                        <Icon
                          size={18}
                          className="text-[#A855F7]"
                        />

                        <h3 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-[#B45CFF] sm:text-2xl">
                          {item.title}
                        </h3>
                      </div>

                      <p className="mt-2 max-w-xl text-sm leading-6 text-[#7F8797]">
                        {item.description}
                      </p>
                    </div>

                    <span className="flex h-10 w-10 items-center justify-center border border-white/10 text-[#7F8797] transition-all group-hover:border-[#A855F7] group-hover:bg-[#A855F7] group-hover:text-white">
                      <ArrowUpRight size={17} />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-10">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B45CFF]">
                Your identity
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Your QR.
              </h2>
            </div>

            <div className="border border-white/10 bg-[#0D1421] p-6 sm:p-8">
              <div className="flex flex-col items-center">
                <div className="bg-white p-4">
                  <Image
                    src={qrUrl}
                    alt="Your AWS SBG profile QR code"
                    width={300}
                    height={300}
                    unoptimized
                    className="h-auto w-[220px] sm:w-[260px]"
                  />
                </div>

                <div className="mt-6 text-center">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#A855F7]">
                    Profile QR
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#8F96A5]">
                    Use this QR code for quick profile
                    identification at SBG events.
                  </p>
                </div>

                <div className="mt-6 w-full border border-white/10 bg-[#111827] p-3">
                  <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.15em] text-[#596273]">
                    Profile ID
                  </p>

                  <div className="flex items-center gap-3">
                    <code className="min-w-0 flex-1 truncate font-mono text-xs text-[#C7CAD2]">
                      {user.sub}
                    </code>

                    <button
                      type="button"
                      onClick={copyId}
                      className="flex h-8 w-8 shrink-0 items-center justify-center border border-white/10 text-[#8F96A5] transition-colors hover:border-[#A855F7] hover:bg-[#A855F7] hover:text-white"
                      aria-label="Copy profile ID"
                    >
                      {copied ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-5 flex w-full gap-2">
                  <button
                    type="button"
                    onClick={downloadQr}
                    className="flex flex-1 items-center justify-center gap-2 border border-white/10 px-4 py-3 text-xs font-medium text-[#C7CAD2] transition-colors hover:border-[#A855F7] hover:bg-[#A855F7] hover:text-white"
                  >
                    <Download size={15} />
                    Download
                  </button>

                  <Link
                    href="/profile"
                    className="flex flex-1 items-center justify-center gap-2 border border-white/10 px-4 py-3 text-xs font-medium text-[#C7CAD2] transition-colors hover:border-[#A855F7] hover:bg-[#A855F7] hover:text-white"
                  >
                    Profile
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Avatar({
  src,
  initials,
  name,
}: {
  src: string | null;
  initials: string;
  name: string;
}) {
  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#A855F7]/15">
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes="48px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-[#C084FC]">
          {initials}
        </div>
      )}
    </div>
  );
}