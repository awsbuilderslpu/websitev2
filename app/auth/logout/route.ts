import { NextResponse, type NextRequest } from "next/server";
import { createAuthServerClient } from "@/lib/supabase/auth-server";

export async function POST(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const appOrigin = new URL(
    process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin,
  ).origin;
  const origin = request.headers.get("origin");

  if (origin) {
    try {
      if (new URL(origin).origin !== appOrigin) {
        return new NextResponse("Forbidden", { status: 403 });
      }
    } catch {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  const supabase = await createAuthServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("[AUTH] Sign-out failed:", error.message);

    return NextResponse.redirect(
      new URL("/auth/login?error=logout_failed", appOrigin),
      303,
    );
  }

  return NextResponse.redirect(new URL("/auth/login", appOrigin), 303);
}