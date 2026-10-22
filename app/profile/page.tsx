import { requireUser } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";
import {
  ArrowUpRight,
  AtSign,
  CalendarDays,
  CheckCircle2,
  Fingerprint,
  IdCard,
  Mail,
  ShieldCheck,
  UserRound,
  Users,
  Building2,
} from "lucide-react";

const SSO_DASHBOARD_URL =
  process.env.NEXT_PUBLIC_SSO_DASHBOARD_URL ||
  "https://sso.awslpu.in/dashboard";

type ProfileRecord = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  avatar_url: string | null;
  created_at: string | null;
  workspace_name: string | null;
  workspace_uid: string | null;
  sso_sub: string | null;
};

function formatDate(value: string | null | undefined) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U"
  );
}

function getRoleDetails(role: string) {
  switch (role.toLowerCase()) {
    case "admin":
      return {
        label: "Administrator",
        className: "bg-[#EFEBFF] text-[#5257C8]",
      };

    case "core":
      return {
        label: "Core Team",
        className: "bg-[#FFF0CC] text-[#855F15]",
      };

    default:
      return {
        label: "Member",
        className: "bg-[#DFF3E5] text-[#246C42]",
      };
  }
}

function DetailItem({
  label,
  value,
  icon: Icon,
  mono = false,
}: {
  label: string;
  value: string | null | undefined;
  icon: typeof UserRound;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-[#EAE7E0] bg-white p-4 sm:p-5">
      <div className="flex items-center gap-2 text-[#898795]">
        <Icon className="h-4 w-4 shrink-0" />

        <span className="text-xs font-medium">{label}</span>
      </div>

      <p
        className={`mt-3 break-words text-sm font-semibold text-[#242333] ${
          mono ? "font-mono text-xs sm:text-sm" : ""
        }`}
      >
        {value || "Not provided"}
      </p>
    </div>
  );
}

export default async function ProfilePage() {
  const user = await requireUser("/dashboard/profile");

  const { data, error } = await supabaseServer
    .from("profiles")
    .select(
      `
        id,
        full_name,
        email,
        role,
        avatar_url,
        created_at,
        workspace_name,
        workspace_uid,
        sso_sub
      `
    )
    .eq("id", user.sub)
    .maybeSingle();

  if (error) {
    console.error("Failed to load member profile:", error);
  }

  const profile = data as ProfileRecord | null;

  const fullName =
    profile?.full_name?.trim() || user.name || "Member";

  const email = profile?.email || user.email || null;

  const role = profile?.role || user.role || "member";

  const avatarUrl = profile?.avatar_url || user.picture || null;

  const profileId = profile?.id || user.sub;

  const workspaceName = profile?.workspace_name || null;

  const workspaceUid = profile?.workspace_uid || null;

  const roleDetails = getRoleDetails(role);

  return (
    <main className="min-h-screen bg-[#FAF9F6] px-4 py-7 text-[#242333] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-[#EAE7E0] bg-white px-3 py-1.5 text-xs font-semibold text-[#5257C8]">
            <UserRound className="h-3.5 w-3.5" />
            MY ACCOUNT
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Your profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777584] sm:text-base">
            Your account, your identity, your community. Here's
            the information associated with your AWS SBG membership.
          </p>
        </header>

        {error && (
          <div
            role="status"
            className="mb-6 rounded-2xl border border-[#F1D9A6] bg-[#FFF8E8] p-4 text-sm leading-6 text-[#855F15]"
          >
            Some profile details couldn't be loaded. Information
            below may be based on your current signed-in session.
          </div>
        )}

        <section className="overflow-hidden rounded-[28px] border border-[#EAE7E0] bg-white shadow-sm">
          <div className="h-2 bg-gradient-to-r from-[#5257C8] via-[#908AE8] to-[#F07832]" />

          <div className="p-5 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {avatarUrl ? (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[25px] border border-[#EAE7E0] bg-[#EFEBFF]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarUrl}
                    alt={`${fullName}'s profile`}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[25px] bg-[#EFEBFF] text-2xl font-bold text-[#5257C8]">
                  {getInitials(fullName)}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="break-words text-2xl font-bold tracking-tight">
                    {fullName}
                  </h2>

                  <span className="inline-flex items-center gap-1 rounded-full bg-[#DFF3E5] px-2.5 py-1 text-xs font-semibold text-[#246C42]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Signed in
                  </span>
                </div>

                <p className="mt-1 break-all text-sm text-[#777584]">
                  {email || "No email associated with this account"}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${roleDetails.className}`}
                  >
                    {roleDetails.label}
                  </span>

                  {workspaceUid && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#EAE7E0] bg-[#FAF9F6] px-3 py-1.5 text-xs font-medium text-[#777584]">
                      <Fingerprint className="h-3.5 w-3.5" />
                      {workspaceUid}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 self-start rounded-2xl bg-[#F5F3EE] px-3.5 py-2.5 text-xs font-medium text-[#777584] sm:self-center">
                <ShieldCheck className="h-4 w-4 text-[#5257C8]" />
                Read only
              </div>
            </div>
          </div>
        </section>

        <section className="mt-7">
          <div className="mb-4">
            <h2 className="text-xl font-bold tracking-tight">
              Personal information
            </h2>

            <p className="mt-1 text-sm text-[#777584]">
              Your identity details associated with your account.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DetailItem
              label="Full name"
              value={fullName}
              icon={UserRound}
            />

            <DetailItem
              label="Email address"
              value={email}
              icon={Mail}
            />

            <DetailItem
              label="Account role"
              value={roleDetails.label}
              icon={ShieldCheck}
            />

            <DetailItem
              label="Account created"
              value={formatDate(profile?.created_at)}
              icon={CalendarDays}
            />
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold tracking-tight">
              Community identity
            </h2>

            <p className="mt-1 text-sm text-[#777584]">
              Your AWS SBG workspace and account identifiers.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DetailItem
              label="Workspace name"
              value={workspaceName}
              icon={Building2}
            />

            <DetailItem
              label="Workspace UID"
              value={workspaceUid}
              icon={IdCard}
              mono
            />

            <DetailItem
              label="Profile ID"
              value={profileId}
              icon={Fingerprint}
              mono
            />

            <DetailItem
              label="Single sign-on"
              value="AWS SBG Identity Services"
              icon={AtSign}
            />
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-[28px] border border-[#DCD8F5] bg-[#F2F0FF]">
          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#5257C8]">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  Need to update your details?
                </h2>

                <p className="mt-1 max-w-lg text-sm leading-6 text-[#777584]">
                  Profile information is managed centrally by AWS
                  SBG Identity Services. Open the SSO dashboard to
                  manage your account details.
                </p>
              </div>
            </div>

            <a
              href={SSO_DASHBOARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#5257C8] px-5 py-3 font-semibold text-white transition hover:bg-[#4448B6]"
            >
              Open SSO dashboard
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </section>

        <footer className="mt-6 flex items-start gap-3 rounded-2xl border border-[#EAE7E0] bg-white p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E6] text-[#C7652E]">
            <Users className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-semibold">
              One account, one identity
            </p>

            <p className="mt-1 text-xs leading-5 text-[#777584]">
              Your profile is linked to your AWS SBG identity.
              Changes made through the SSO dashboard may take a
              moment to appear here, depending on when your
              profile data is synchronised.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}