import { NextResponse } from "next/server";
import { createAuthServerClient } from "@/lib/supabase/auth-server";

function getSafeNextPath(value: string | null): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.startsWith("/\\")
  ) {
    return "/dashboard";
  }

  try {
    const base = new URL("https://internal.invalid");
    const target = new URL(value, base);

    if (target.origin !== base.origin) {
      return "/dashboard";
    }

    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return "/dashboard";
  }
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const appOrigin = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/login?error=oauth_callback_failed", appOrigin),
    );
  }

  const supabase = await createAuthServerClient();

  const { data, error } =
    await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    console.error("[AUTH] OAuth code exchange failed:", error?.message);

    return NextResponse.redirect(
      new URL("/auth/login?error=oauth_callback_failed", appOrigin),
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError) {
    console.error("[AUTH] Profile lookup failed:", profileError.message);

    await supabase.auth.signOut();

    return NextResponse.redirect(
      new URL("/auth/login?error=profile_lookup_failed", appOrigin),
    );
  }

  if (!profile) {
    await supabase.auth.signOut();

    return NextResponse.redirect("https://sso.awslpu.in/");
  }

  const next = getSafeNextPath(requestUrl.searchParams.get("next"));

  return NextResponse.redirect(new URL(next, appOrigin));
}