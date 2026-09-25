import {
  ArrowLeft,
  CalendarDays,
  Shield,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: "member" | "core" | "admin";
  avatar_url: string | null;
  workspace_name: string | null;
  workspace_uid: string | null;
  sso_sub: string | null;
  created_at: string;
};

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth/login");
  }

  const { data: profile, error } =
    await supabaseServer
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
      .eq("id", currentUser.sub)
      .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!profile) {
    redirect("/auth/login");
  }

  return (
    <main className="min-h-screen bg-[#111827] text-[#F5F5F5]">
      <div className="mx-auto max-w-300 px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        <Link
          href="/dashboard"
          className="group inline-flex items-center gap-2 text-sm text-[#737B8C] transition-colors hover:text-white"
        >
          <ArrowLeft
            size={16}
            className="transition-transform duration-200 group-hover:-translate-x-1"
          />
          Dashboard
        </Link>

        <section className="mt-12 border-b border-white/10 pb-12">
          <div className="grid gap-10 lg:grid-cols-[140px_1fr_auto] lg:items-end">
            <ProfileAvatar profile={profile} />

            <div>
              <div className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#B45CFF]">
                <span className="h-px w-8 bg-[#A855F7]" />
                Your profile
              </div>

              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                {profile.full_name ||
                  "Unnamed user"}
              </h1>

              <p className="mt-3 text-base text-[#8F96A5]">
                {profile.email ||
                  "No email available"}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <RoleBadge
                  role={profile.role}
                />

                {profile.workspace_name && (
                  <>
                    <span className="h-1 w-1 bg-[#596273]" />

                    <span className="text-sm text-[#C7CAD2]">
                      {profile.workspace_name}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="lg:text-right">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#596273]">
                Member since
              </p>

              <p className="mt-2 text-sm text-[#C7CAD2]">
                {formatDate(
                  profile.created_at,
                )}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-10 border-b border-white/10 py-12 lg:grid-cols-[280px_1fr] lg:gap-20">
          <SectionIntro
            title="Account"
            description="Your account information as stored by AWS Student Builder Group at LPU."
          />

          <div className="border-t border-white/10">
            <InfoRow
              label="Full name"
              value={
                profile.full_name ||
                "Not available"
              }
            />

            <InfoRow
              label="Email"
              value={
                profile.email ||
                "Not available"
              }
            />

            <InfoRow
              label="Workspace"
              value={
                profile.workspace_name ||
                "Not assigned"
              }
            />

            <InfoRow
              label="Workspace UID"
              value={
                profile.workspace_uid ||
                "Not assigned"
              }
              mono
            />
          </div>
        </section>

        <section className="grid gap-10 border-b border-white/10 py-12 lg:grid-cols-[280px_1fr] lg:gap-20">
          <SectionIntro
            title="Access"
            description="Your role determines which community and management features are available to your account."
          />

          <div className="border-t border-white/10">
            <InfoRow
              label="Role"
              value={formatRole(
                profile.role,
              )}
              icon={
                profile.role ===
                "admin" ? (
                  <Shield size={14} />
                ) : (
                  <UserRound
                    size={14}
                  />
                )
              }
            />

            <InfoRow
              label="Access level"
              value={getAccessDescription(
                profile.role,
              )}
            />
          </div>
        </section>

        <section className="grid gap-10 border-b border-white/10 py-12 lg:grid-cols-[280px_1fr] lg:gap-20">
          <SectionIntro
            title="Identity"
            description="Identifiers connecting your profile to the AWS LPU identity system."
          />

          <div className="border-t border-white/10">
            <InfoRow
              label="Profile ID"
              value={profile.id}
              mono
            />

            <InfoRow
              label="SSO subject"
              value={
                profile.sso_sub ||
                "Not available"
              }
              mono
            />
          </div>
        </section>

        <section className="py-12">
          <div className="flex items-start gap-3 border border-white/10 bg-[#0D1421] p-5">
            <CalendarDays
              size={16}
              className="mt-0.5 shrink-0 text-[#A855F7]"
            />

            <div>
              <p className="text-sm font-medium text-[#C7CAD2]">
                Identity-managed account
              </p>

              <p className="mt-1 text-sm leading-6 text-[#737B8C]">
                Your name, email, avatar, and SSO
                identity are managed through the AWS LPU
                identity system. Contact an administrator if
                those details need to be corrected.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function ProfileAvatar({
  profile,
}: {
  profile: Profile;
}) {
  const initials =
    profile.full_name
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
      {profile.avatar_url ? (
        <Image
          src={profile.avatar_url}
          alt={
            profile.full_name ||
            "Profile"
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
  role: Profile["role"];
}) {
  const styles = {
    member:
      "border-white/10 text-[#8F96A5]",
    core:
      "border-blue-400/20 text-blue-300",
    admin:
      "border-[#A855F7]/30 text-[#C084FC]",
  };

  return (
    <span
      className={`inline-flex items-center border bg-[#0D1421] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] ${styles[role]}`}
    >
      {formatRole(role)}
    </span>
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
      <h2 className="text-xl font-semibold tracking-tighter">
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
            ? "break-all font-mono text-[11px]"
            : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function formatRole(
  role: Profile["role"],
) {
  return (
    role.charAt(0).toUpperCase() +
    role.slice(1)
  );
}

function getAccessDescription(
  role: Profile["role"],
) {
  if (role === "admin") {
    return "Full administrative access.";
  }

  if (role === "core") {
    return "Community management access.";
  }

  return "Standard community member access.";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  ).format(new Date(value));
}