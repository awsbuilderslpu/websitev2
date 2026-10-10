import {
  ArrowLeft,
  CalendarDays,
  Copy,
  Fingerprint,
  Shield,
  UserRound,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CopyButton } from "@/components/dashboard/copy-button";
import { requireRole } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type UserRole = "member" | "core" | "admin";

type UserProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: UserRole;
  avatar_url: string | null;
  workspace_name: string | null;
  workspace_uid: string | null;
  sso_sub: string | null;
  created_at: string;
};

export default async function UserProfilePage({
  params,
}: PageProps) {
  await requireRole(["admin"], "/dashboard/users");

  const { id } = await params;

  const { data: user, error } = await supabaseServer
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      role,
      avatar_url,
      workspace_name,
      workspace_uid,
      sso_sub,
      created_at
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#242333]">
      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
        <Link
          href="/dashboard/users"
          className="group inline-flex items-center gap-2 rounded-full border border-[#EAE6DE] bg-white px-4 py-2.5 text-sm font-medium text-[#656474] transition hover:border-[#D3CCFF] hover:bg-[#E5E2FF] hover:text-[#6252BD]"
        >
          <ArrowLeft
            size={15}
            className="transition-transform duration-200 group-hover:-translate-x-1"
          />
          All people
        </Link>

        <section className="relative mt-7 overflow-hidden rounded-[30px] border border-[#EEE9E0] bg-white p-6 sm:p-9 lg:p-10">
          <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-[#E5E2FF] opacity-70" />
          <div className="pointer-events-none absolute right-36 top-24 h-20 w-20 rounded-[28px] bg-[#FFE5A5] opacity-70 rotate-12" />

          <div className="relative grid gap-7 lg:grid-cols-[auto_1fr_auto] lg:items-center">
            <UserAvatar user={user} />

            <div className="min-w-0">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#E5E2FF] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6252BD]">
                <Fingerprint size={13} />
                Member profile
              </div>

              <h1 className="break-words text-3xl font-semibold tracking-[-0.05em] sm:text-4xl lg:text-5xl">
                {user.full_name || "Unnamed user"}
              </h1>

              <p className="mt-3 break-all text-sm text-[#777586] sm:text-base">
                {user.email || "No email address"}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {user.workspace_name && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#DDF2E5] px-3 py-2 text-xs font-medium text-[#287B56]">
                    <UsersRound size={13} />
                    {user.workspace_name}
                  </span>
                )}

                {user.workspace_uid && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#F3F0E9] px-3 py-2 font-mono text-[11px] text-[#656474]">
                    ID · {user.workspace_uid}
                    <CopyButton
                      value={user.workspace_uid}
                      label="Workspace UID"
                    />
                  </span>
                )}
              </div>
            </div>

            <div className="relative rounded-[24px] border border-[#EEE9E0] bg-[#FAF9F6] p-5 lg:min-w-44">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#898797]">
                Access level
              </p>
              <RoleBadge role={user.role} />
              <p className="mt-3 text-xs leading-5 text-[#777586]">
                Assigned permissions for this account.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <section className="rounded-[28px] border border-[#EEE9E0] bg-white p-5 sm:p-7">
            <SectionIntro
              icon={<UserRound size={17} />}
              title="The basics"
              description="Profile details associated with this account."
              color="lavender"
            />

            <div className="mt-6">
              <InfoRow
                label="Full name"
                value={user.full_name || "Not provided"}
              />
              <InfoRow
                label="Email address"
                value={user.email || "Not provided"}
              />
              <InfoRow
                label="Workspace"
                value={user.workspace_name || "Not assigned"}
              />
              <InfoRow
                label="Workspace UID"
                value={user.workspace_uid || "Not assigned"}
                mono
              />
            </div>
          </section>

          <section className="rounded-[28px] border border-[#EEE9E0] bg-white p-5 sm:p-7">
            <SectionIntro
              icon={<Fingerprint size={17} />}
              title="Identity & access"
              description="Identifiers connecting the profile to the identity system."
              color="peach"
            />

            <div className="mt-6">
              <CopyableInfoRow
                label="Profile ID"
                value={user.id}
              />
              <CopyableInfoRow
                label="SSO subject"
                value={user.sso_sub}
              />
            </div>

            <div className="mt-5 rounded-2xl bg-[#FFF1E9] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#D96730]">
                  <Shield size={17} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#633D2B]">
                    Role management
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#8B6653]">
                    To change this person’s role, return to the user directory
                    and use the role selector.
                  </p>
                  <Link
                    href="/dashboard/users"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#B95526] transition hover:text-[#803A19]"
                  >
                    Open user directory
                    <ArrowLeft
                      size={13}
                      className="rotate-180"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-5 rounded-[28px] border border-[#EEE9E0] bg-[#EAF1FF] p-5 sm:p-7">
          <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <SectionIntro
              icon={<CalendarDays size={17} />}
              title="Account timeline"
              description="When this profile was first created."
              color="blue"
            />

            <div className="rounded-2xl border border-white/80 bg-white/80 px-5 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#777586]">
                Joined on
              </p>
              <p className="mt-1.5 text-lg font-semibold tracking-tight text-[#343B64]">
                {formatDateTime(user.created_at)}
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-6 flex flex-col gap-4 rounded-[24px] border border-[#EEE9E0] bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <p className="text-sm font-semibold">
              That’s the whole profile.
            </p>
            <p className="mt-1 text-xs text-[#777586]">
              Need to update permissions? Head back to the directory.
            </p>
          </div>

          <Link
            href="/dashboard/users"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[#242333] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#6252BD]"
          >
            <ArrowLeft size={15} />
            Back to people
          </Link>
        </footer>
      </div>
    </main>
  );
}

function UserAvatar({ user }: { user: UserProfile }) {
  const initials =
    user.full_name
      ?.split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "?";

  return (
    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[30px] border-4 border-white bg-[#E5E2FF] shadow-[0_5px_20px_rgba(36,35,51,0.08)] sm:h-32 sm:w-32">
      {user.avatar_url ? (
        <Image
          src={user.avatar_url}
          alt={user.full_name || "User"}
          fill
          priority
          sizes="128px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-4xl font-semibold tracking-tight text-[#6252BD]">
          {initials}
        </div>
      )}
    </div>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  const config = {
    member: {
      label: "Member",
      icon: <UserRound size={14} />,
      className: "bg-[#DDF2E5] text-[#287B56]",
    },
    core: {
      label: "Core team",
      icon: <UsersRound size={14} />,
      className: "bg-[#DCEBFF] text-[#365DB4]",
    },
    admin: {
      label: "Admin",
      icon: <Shield size={14} />,
      className: "bg-[#E5E2FF] text-[#6252BD]",
    },
  }[role];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold ${config.className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

function SectionIntro({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "lavender" | "peach" | "blue";
}) {
  const colors = {
    lavender: "bg-[#E5E2FF] text-[#6252BD]",
    peach: "bg-[#FFDCCF] text-[#B95526]",
    blue: "bg-white text-[#365DB4]",
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-2xl ${colors[color]}`}
        >
          {icon}
        </div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      </div>
      <p className="mt-3 max-w-sm text-sm leading-6 text-[#777586]">
        {description}
      </p>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="grid gap-1.5 border-b border-[#F0EDE7] py-4 last:border-b-0 sm:grid-cols-[130px_1fr] sm:items-center sm:gap-4">
      <span className="text-xs font-medium text-[#898797]">{label}</span>
      <p
        className={`break-words text-sm text-[#343343] ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function CopyableInfoRow({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div className="grid gap-2 border-b border-[#F0EDE7] py-4 last:border-b-0 sm:grid-cols-[110px_1fr_auto] sm:items-center sm:gap-3">
      <span className="text-xs font-medium text-[#898797]">{label}</span>
      <p className="break-all font-mono text-[11px] leading-5 text-[#656474]">
        {value || "Not available"}
      </p>
      {value && <CopyButton value={value} label={label} />}
    </div>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}