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
  const next = getSafeNextPath(requestUrl.searchParams.get("next"));

  const callbackUrl = new URL("/auth/callback", appOrigin);
  callbackUrl.searchParams.set("next", next);

  const supabase = await createAuthServerClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl.toString(),
      queryParams: {
        prompt: "select_account",
      },
    },
  });

  if (error || !data.url) {
    console.error("[AUTH] Failed to start Google OAuth:", error?.message);

    return NextResponse.redirect(
      new URL("/auth/login?error=oauth_start_failed", appOrigin),
    );
  }

  return NextResponse.redirect(data.url);
}