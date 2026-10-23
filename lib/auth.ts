import { cache } from "react";
import { redirect } from "next/navigation";
import { createAuthServerClient } from "@/lib/supabase/auth-server";

export type UserRole = "member" | "core" | "admin";

export type AuthUser = {
  id: string;
  sub: string;
  name: string | null;
  email: string | null;
  picture: string | null;
  role: UserRole;
};

type UserMetadata = Record<string, unknown>;

function getString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function normalizeRole(value: unknown): UserRole {
  if (value === "admin" || value === "core" || value === "member") {
    return value;
  }

  return "member";
}

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const supabase = await createAuthServerClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || typeof data?.claims?.sub !== "string") {
    return null;
  }

  const claims = data.claims;
  const userId = claims.sub;
  const metadata = (claims.user_metadata ?? {}) as UserMetadata;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url, role")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    console.error("[AUTH] Profile lookup failed:", profileError.message);
    throw new Error("Unable to load your profile. Please try again later.");
  }

  if (!profile) {
    redirect("https://sso.awslpu.in/");
  }

  return {
    id: userId,
    sub: userId,
    name:
      getString(profile.full_name) ??
      getString(metadata.full_name) ??
      getString(metadata.name),
    email: getString(profile.email) ?? getString(claims.email),
    picture:
      getString(profile.avatar_url) ??
      getString(metadata.avatar_url) ??
      getString(metadata.picture),
    role: normalizeRole(profile.role),
  };
});

export async function getCurrentUserRole(): Promise<UserRole | null> {
  const user = await getCurrentUser();
  return user?.role ?? null;
}

export async function isAuthenticated(): Promise<boolean> {
  return Boolean(await getCurrentUser());
}

export async function requireUser(
  nextPath = "/dashboard",
): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/auth/login?next=${encodeURIComponent(nextPath)}`);
  }

  return user;
}

export async function requireRole(
  roles: UserRole[],
  nextPath = "/dashboard",
): Promise<AuthUser> {
  const user = await requireUser(nextPath);

  if (!roles.includes(user.role)) {
    redirect("/");
  }

  return user;
}