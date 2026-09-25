import {
  ArrowLeft,
  CalendarDays,
  Copy,
  Shield,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { requireRole } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";

import { CopyButton } from "@/components/dashboard/copy-button";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type UserRole =
  | "member"
  | "core"
  | "admin";

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
  await requireRole(
    ["admin"],
    "/dashboard/users",
  );

  const { id } = await params;

  const {
    data: user,
    error,
  } = await supabaseServer
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
    <main className="min-h-screen bg-[#111827] text-[#F5F5F5]">
      <div className="mx-auto max-w-300 px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <Link
          href="/dashboard/users"
          className="group inline-flex items-center gap-2 text-sm text-[#737B8C] transition-colors hover:text-white"
        >
          <ArrowLeft
            size={16}
            className="transition-transform duration-200 group-hover:-translate-x-1"
          />
          Users
        </Link>

        <section className="mt-12 border-b border-white/10 pb-12">
          <div className="grid gap-10 lg:grid-cols-[140px_1fr_auto] lg:items-end">
            <UserAvatar user={user} />

            <div>
              <div className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#B45CFF]">
                <span className="h-px w-8 bg-[#A855F7]" />
                User profile
              </div>

              <h1 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                {user.full_name ||
                  "Unnamed user"}
              </h1>

              <p className="mt-3 text-base text-[#8F96A5]">
                {user.email ||
                  "No email address"}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                {user.workspace_name && (
                  <span className="text-sm text-[#C7CAD2]">
                    {user.workspace_name}
                  </span>
                )}

                {user.workspace_uid && (
                  <>
                    <span className="h-1 w-1 bg-[#596273]" />

                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#596273]">
                      {user.workspace_uid}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="lg:min-w-45">
              <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[#596273]">
                Access role
              </p>

              <RoleBadge role={user.role} />
            </div>
          </div>
        </section>

        <section className="grid gap-10 border-b border-white/10 py-12 lg:grid-cols-[280px_1fr] lg:gap-20">
          <SectionIntro
            title="Account"
            description="Basic profile information associated with this account."
          />

          <div className="border-t border-white/10">
            <InfoRow
              label="Full name"
              value={
                user.full_name ||
                "Not provided"
              }
            />

            <InfoRow
              label="Email"
              value={
                user.email ||
                "Not provided"
              }
            />

            <InfoRow
              label="Workspace"
              value={
                user.workspace_name ||
                "Not assigned"
              }
            />

            <InfoRow
              label="Workspace UID"
              value={
                user.workspace_uid ||
                "Not assigned"
              }
              mono
            />
          </div>
        </section>

        <section className="grid gap-10 border-b border-white/10 py-12 lg:grid-cols-[280px_1fr] lg:gap-20">
          <SectionIntro
            title="Identity"
            description="Identifiers used by the application and the AWS LPU identity system."
          />

          <div className="border-t border-white/10">
            <CopyableInfoRow
              label="Profile ID"
              value={user.id}
            />

            <CopyableInfoRow
              label="SSO subject"
              value={user.sso_sub}
            />
          </div>
        </section>

        <section className="grid gap-10 border-b border-white/10 py-12 lg:grid-cols-[280px_1fr] lg:gap-20">
          <SectionIntro
            title="Timeline"
            description="Basic account lifecycle information."
          />

          <div className="border-t border-white/10">
            <InfoRow
              label="Created"
              value={formatDateTime(
                user.created_at,
              )}
              icon={
                <CalendarDays size={14} />
              }
            />
          </div>
        </section>

        <section className="pt-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#596273]">
                User management
              </p>

              <p className="mt-2 text-sm text-[#737B8C]">
                Access permissions can be changed from
                the user directory.
              </p>
            </div>

            <Link
              href="/dashboard/users"
              className="inline-flex w-fit items-center gap-2 border border-white/10 px-5 py-3 text-sm font-medium text-[#C7CAD2] transition-colors hover:border-[#A855F7] hover:bg-[#A855F7] hover:text-white"
            >
              Back to users
              <ArrowLeft size={15} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function UserAvatar({
  user,
}: {
  user: UserProfile;
}) {
  const initials =
    user.full_name
      ?.split(/\s+/)
      .slice(0, 2)
      .map((part) =>
        part
          .charAt(0)
          .toUpperCase(),
      )
      .join("") || "?";

  return (
    <div className="relative h-28 w-28 overflow-hidden rounded-full bg-[#172033]">
      {user.avatar_url ? (
        <Image
          src={user.avatar_url}
          alt={
            user.full_name ||
            "User"
          }
          fill
          priority
          sizes="112px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-[#A855F7]">
          {initials}
        </div>
      )}
    </div>
  );
}

function RoleBadge({
  role,
}: {
  role: UserRole;
}) {
  const config = {
    member: {
      label: "Member",
      icon: <UserRound size={14} />,
      className:
        "border-white/10 text-[#8F96A5]",
    },
    core: {
      label: "Core",
      icon: <UserRound size={14} />,
      className:
        "border-blue-400/20 text-blue-300",
    },
    admin: {
      label: "Admin",
      icon: <Shield size={14} />,
      className:
        "border-[#A855F7]/30 text-[#C084FC]",
    },
  }[role];

  return (
    <div
      className={`inline-flex items-center gap-2 border bg-[#0D1421] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] ${config.className}`}
    >
      {config.icon}
      {config.label}
    </div>
  );
}

function SectionIntro({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight">
        {title}
      </h2>

      <p className="mt-3 max-w-sm text-sm leading-6 text-[#737B8C]">
        {description}
      </p>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono = false,
  icon,
}: {
  label: string;
  value: string;
  mono?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 border-b border-white/10 py-5 sm:grid-cols-[180px_1fr] sm:items-center">
      <div className="flex items-center gap-2 text-xs text-[#596273]">
        {icon && (
          <span className="text-[#A855F7]">
            {icon}
          </span>
        )}

        {label}
      </div>

      <p
        className={`text-sm text-[#C7CAD2] ${
          mono
            ? "font-mono text-[11px]"
            : ""
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
    <div className="grid gap-3 border-b border-white/10 py-5 sm:grid-cols-[180px_1fr_auto] sm:items-center">
      <span className="text-xs text-[#596273]">
        {label}
      </span>

      <p className="break-all font-mono text-[11px] text-[#8F96A5]">
        {value || "Not available"}
      </p>

      {value && (
        <CopyButton
          value={value}
          label={label}
        />
      )}
    </div>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
  ).format(new Date(value));
}