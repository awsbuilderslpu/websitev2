"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Award,
  CalendarCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  Cloud,
  Copy,
  Download,
  Printer,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";

type AuthUser = {
  sub: string;
  name: string | null;
  email: string | null;
  picture: string | null;
  role: "member" | "core" | "admin";
};

type AdminDashboardProps = {
  user: AuthUser;
};

const adminItems = [
  {
    title: "Events",
    description: "Create, publish, and manage community events.",
    href: "/dashboard/events",
    icon: CalendarDays,
    color: "#E5E2FF",
    iconColor: "#6252BD",
  },
  {
    title: "Members",
    description: "Manage accounts, profiles, and community roles.",
    href: "/dashboard/users",
    icon: Users,
    color: "#DDF2E5",
    iconColor: "#287B56",
  },
  {
    title: "Badges",
    description: "Create badges and manage badge issuance.",
    href: "/dashboard/badges/manage",
    icon: ShieldCheck,
    color: "#FFE5A5",
    iconColor: "#A56A00",
  },
  {
    title: "Attendance",
    description: "Manage participation across community events.",
    href: "/dashboard/attendance/manage",
    icon: CheckCircle2,
    color: "#FFDCCF",
    iconColor: "#B84F28",
  },
  {
    title: "Speakers",
    description: "Manage speakers and their community sessions.",
    href: "/dashboard/speakers",
    icon: UserRound,
    color: "#DCEBFF",
    iconColor: "#345DA8",
  },
];

const personalItems = [
  {
    title: "My Profile",
    description: "Your account and personal information.",
    href: "/profile",
    icon: UserRound,
    color: "#E5E2FF",
    iconColor: "#6252BD",
  },
  {
    title: "My Attendance",
    description: "Your event participation history.",
    href: "/dashboard/attendance",
    icon: CalendarCheck,
    color: "#DDF2E5",
    iconColor: "#287B56",
  },
  {
    title: "My Badges",
    description: "Your community achievements.",
    href: "/dashboard/badges",
    icon: Award,
    color: "#FFE5A5",
    iconColor: "#A56A00",
  },
];

function getMemberCode(sub: string) {
  return sub
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(-8)
    .toUpperCase()
    .padStart(8, "0");
}

function MemberIdCard({
  user,
  displayName,
  roleLabel,
  cardRef,
}: {
  user: AuthUser;
  displayName: string;
  roleLabel: string;
  cardRef: React.RefObject<HTMLDivElement | null>;
}) {
  const firstName = displayName.split(/\s+/)[0] || "Member";
  const lastName = displayName.split(/\s+/).slice(1).join(" ");
  const memberCode = getMemberCode(user.sub);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=4&data=${encodeURIComponent(user.sub)}`;

  return (
    <div
      ref={cardRef}
      id="sbg-member-id-card"
      className="relative mx-auto flex w-full max-w-[370px] flex-col overflow-hidden border border-[#BFC1C4] bg-[#FCFBF8] text-[#172033] shadow-[0_12px_32px_rgba(36,35,51,0.07)]"
      style={{ aspectRatio: "370 / 550" }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.12]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle, #B8B1A7 0.6px, transparent 0.8px)",
            backgroundSize: "7px 7px",
          }}
        />
      </div>

      <header className="relative z-10 flex shrink-0 items-center justify-between gap-2 border-b border-[#BFC1C4] px-[5.5%] py-[4%]">
        <div className="min-w-0">
          <p className="truncate text-[clamp(9px,2.7vw,12px)] font-bold uppercase tracking-[0.12em]">
            AWS STUDENT BUILDER
          </p>
          <p className="mt-1 text-[8px] font-medium uppercase tracking-[0.17em] text-[#656474]">
            GROUP · LPU
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <span className="flex h-7 items-center border border-[#F07832] px-1.5 font-mono text-[10px] text-[#D75D22]">
            SBG
          </span>
          <div className="flex h-7 w-7 items-center justify-center bg-[#242333] text-white">
            <Cloud size={15} />
          </div>
        </div>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1">
        <div className="flex w-[10%] shrink-0 items-center justify-center border-r border-[#BFC1C4]">
          <span
            className="whitespace-nowrap text-[8px] font-medium uppercase tracking-[0.25em] text-[#555C68]"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            REGISTERED MEMBER
          </span>
        </div>

        <div className="relative flex min-w-0 flex-1 flex-col justify-between overflow-hidden px-[6%] py-[6%]">
          <div className="pointer-events-none absolute bottom-16 right-[-20px] h-28 w-32 opacity-40">
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #F07832 1.7px, transparent 2px)",
                backgroundSize: "9px 9px",
                maskImage:
                  "radial-gradient(ellipse at bottom right, black 5%, transparent 72%)",
              }}
            />
          </div>

          <div className="relative z-10">
            <p className="text-[8px] font-medium uppercase tracking-[0.2em] text-[#777584]">
              BUILDER IDENTITY
            </p>

            <div className="mt-3 flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <h2 className="break-words text-[clamp(26px,7.4vw,39px)] font-semibold leading-[0.94] tracking-[-0.065em]">
                  {firstName}
                  {lastName && (
                    <>
                      <br />
                      {lastName}
                    </>
                  )}
                </h2>

                <p className="mt-3 break-all text-[clamp(9px,2.6vw,11px)] text-[#465064]">
                  {user.email || "AWS SBG Member"}
                </p>
              </div>
            </div>

            <div className="mt-3 inline-flex items-center gap-1.5 border border-[#C9C6C0] bg-white/80 px-2 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F07832]" />
              <span className="text-[8px] font-semibold uppercase tracking-[0.12em]">
                {roleLabel}
              </span>
            </div>
          </div>

          <div className="relative z-10 -mx-[7%] mt-3">
            <div className="grid grid-cols-2 border-y border-[#BFC1C4]">
              <div className="border-r border-[#BFC1C4] px-[8%] py-2.5">
                <p className="text-[8px] uppercase tracking-[0.15em] text-[#656474]">
                  MEMBER
                </p>
                <p className="mt-1 font-mono text-[10px] tracking-wider">
                  SBG-{memberCode}
                </p>
              </div>

              <div className="px-[8%] py-2.5">
                <p className="text-[8px] uppercase tracking-[0.15em] text-[#656474]">
                  AFFILIATION
                </p>
                <p className="mt-1 text-[9px] font-medium">
                  LPU · PHAGWARA
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-3 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[8px] font-medium uppercase tracking-[0.15em] text-[#656474]">
                DIGITAL MEMBER CARD
              </p>
              <p className="mt-1 text-[9px] leading-4 text-[#777584]">
                Scan to read profile ID
              </p>
              <p className="mt-3 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#D75D22]">
                AWS SBG · LPU
              </p>
            </div>

            <div className="shrink-0 border border-[#D5D1CA] bg-white p-1.5">
              <Image
                src={qrUrl}
                alt="QR code containing your SSO profile ID"
                width={180}
                height={180}
                unoptimized
                className="h-[clamp(64px,19vw,88px)] w-[clamp(64px,19vw,88px)]"
              />
            </div>
          </div>

          <div className="relative z-10 mt-3">
            <div
              className="h-6 w-full"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, #172033 0px, #172033 1px, transparent 1px, transparent 3px, #172033 3px, #172033 5px, transparent 5px, transparent 7px, #172033 7px, #172033 8px, transparent 8px, transparent 10px)",
              }}
              role="img"
              aria-label={`Decorative barcode for member ${memberCode}`}
            />
            <div className="mt-1.5 flex items-center justify-between gap-2">
              <span className="font-mono text-[8px] tracking-[0.13em] text-[#D75D22]">
                SBG-{memberCode}
              </span>
              <span className="text-[8px] tracking-[0.08em] text-[#656474]">
                MEMBER EDITION
              </span>
            </div>
          </div>
        </div>
      </div>

      <footer className="relative z-10 flex shrink-0 items-center justify-between border-t border-[#BFC1C4] px-[5.5%] py-[2.5%]">
        <span className="text-[8px] font-semibold uppercase tracking-[0.15em]">
          STUDENT BUILDER GROUP
        </span>
        <ShieldCheck size={13} className="text-[#6252BD]" />
      </footer>
    </div>
  );
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const displayName =
    user.name || user.email?.split("@")[0] || "SBG Member";

  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const roleLabel =
    user.role === "admin"
      ? "Administrator"
      : user.role === "core"
        ? "Core Team"
        : "Community Member";

  const memberCode = useMemo(() => getMemberCode(user.sub), [user.sub]);

  async function copyId() {
    try {
      await navigator.clipboard.writeText(user.sub);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function downloadCard() {
    if (!cardRef.current || downloading) return;

    setDownloading(true);

    try {
      const htmlToImage = await import("html-to-image");

      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        pixelRatio: 3,
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `aws-sbg-id-${memberCode}.png`;
      link.click();
    } catch {
      window.print();
    } finally {
      setDownloading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FAF9F6] text-[#242333]">
      <div className="pointer-events-none absolute -right-36 -top-36 h-96 w-96 rounded-full bg-[#E5E2FF]/45 blur-3xl" />

      <div className="relative mx-auto max-w-[1440px] px-5 py-6 sm:px-8 sm:py-8 lg:px-12">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_410px]">
          <div className="min-w-0">
            <section>
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#F07832]">
                  Your corner
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-[-0.065em] sm:text-4xl">
                  Your SBG activity.
                </h1>

                <p className="mt-2 text-sm leading-6 text-[#777584]">
                  Welcome back, {displayName.split(/\s+/)[0]}. Your profile,
                  participation, and achievements.
                </p>
              </div>

              <DashboardSection
                items={personalItems}
              />
            </section>

            {user.role === "admin" && (
              <section className="mt-10 border-t border-[#EAE6DE] pt-8">
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6252BD]">
                    Administration
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.06em] sm:text-3xl">
                    Run the community.
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#777584]">
                    Manage the people and activities that keep SBG moving.
                  </p>
                </div>

                <DashboardSection
                  items={adminItems}
                />
              </section>
            )}
          </div>

          <aside className="min-w-0">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#F07832]">
                  Your identity
                </p>

                <h2 className="mt-1.5 text-2xl font-semibold tracking-[-0.06em]">
                  Your SBG ID.
                </h2>
              </div>

              <span className="rounded-full bg-[#DDF2E5] px-3 py-1.5 text-[10px] font-semibold text-[#287B56]">
                Digital card
              </span>
            </div>

            <MemberIdCard
              user={user}
              displayName={displayName}
              roleLabel={roleLabel}
              cardRef={cardRef}
            />

            <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#EAE6DE] bg-white px-3 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E5E2FF] text-[#6252BD]">
                <ShieldCheck size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold">Member identification</p>
                <p className="mt-1 text-[11px] leading-4 text-[#777584]">
                  Unique SSO profile ID
                </p>
              </div>

              <button
                type="button"
                onClick={copyId}
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#FAF9F6] px-3 py-2 text-xs font-semibold transition hover:bg-[#E5E2FF] hover:text-[#6252BD]"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy ID"}
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={downloadCard}
                disabled={downloading}
                className="flex items-center justify-center gap-2 rounded-full bg-[#242333] px-3 py-3 text-xs font-semibold text-white transition hover:bg-[#6252BD] disabled:opacity-60"
              >
                <Download size={15} />
                {downloading ? "Preparing..." : "Download ID"}
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 rounded-full border border-[#EAE6DE] bg-white px-3 py-3 text-xs font-semibold transition hover:border-[#D3CCFF] hover:bg-[#E5E2FF]"
              >
                <Printer size={15} />
                Print card
              </button>
            </div>

            <Link
              href="/profile"
              className="mt-3 flex items-center justify-between rounded-xl px-1 py-2 text-sm font-medium text-[#656474] transition hover:text-[#6252BD]"
            >
              Manage your profile
              <ArrowUpRight size={16} />
            </Link>
          </aside>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }

          #sbg-member-id-card,
          #sbg-member-id-card * {
            visibility: visible !important;
          }

          #sbg-member-id-card {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 370px !important;
            height: 550px !important;
            max-width: none !important;
            box-shadow: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          @page {
            size: 90mm 135mm;
            margin: 0;
          }
        }
      `}</style>
    </main>
  );
}

function DashboardSection({
  items,
}: {
  items: {
    title: string;
    description: string;
    href: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    color: string;
    iconColor: string;
  }[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="group flex min-h-[138px] flex-col rounded-[1.5rem] border border-[#EAE6DE] bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-[#D3CCFF] hover:shadow-[0_12px_30px_rgba(36,35,51,0.06)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: item.color,
                  color: item.iconColor,
                }}
              >
                <Icon size={20} />
              </div>

              <ArrowUpRight
                size={18}
                className="text-[#B4B0BE] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#6252BD]"
              />
            </div>

            <div className="mt-4">
              <h3 className="text-base font-semibold tracking-tight">
                {item.title}
              </h3>

              <p className="mt-1.5 text-xs leading-5 text-[#777584]">
                {item.description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}