import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  AuthUser,
  verifySession,
} from "@/lib/sso";

export const SESSION_COOKIE =
  "sbg_session";

export async function getCurrentUser(): Promise<
  AuthUser | null
> {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    SESSION_COOKIE,
  )?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifySession(token);
  } catch {
    return null;
  }
}

export async function getCurrentUserRole() {
  const user = await getCurrentUser();

  return user?.role ?? null;
}

export async function isAuthenticated() {
  return Boolean(await getCurrentUser());
}

export async function requireUser(
  nextPath = "/",
) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(
      `/auth/login?next=${encodeURIComponent(nextPath)}`,
    );
  }

  return user;
}

export async function requireRole(
  roles: Array<"member" | "core" | "admin">,
  nextPath = "/",
) {
  const user = await requireUser(nextPath);

  if (!roles.includes(user.role)) {
    redirect("/");
  }

  return user;
}