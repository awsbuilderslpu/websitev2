import { NextResponse, type NextRequest } from "next/server";
import { createAuthServerClient } from "@/lib/supabase/auth-server";

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "invalid_request" }, 400);
  }

  if (!body || typeof body !== "object") {
    return jsonResponse({ error: "invalid_request" }, 400);
  }

  const { email, password } = body as Record<string, unknown>;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password ||
    email.length > 320 ||
    password.length > 1024
  ) {
    return jsonResponse(
      { error: "invalid_credentials_format" },
      400,
    );
  }

  const supabase = await createAuthServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error || !data.user) {
    return jsonResponse(
      { error: "invalid_login", message: "Invalid email or password." },
      401,
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError) {
    console.error(
      "[AUTH] Password login profile lookup failed:",
      profileError.message,
    );

    await supabase.auth.signOut();

    return jsonResponse(
      { error: "profile_lookup_failed" },
      500,
    );
  }

  if (!profile) {
    await supabase.auth.signOut();

    return jsonResponse(
      {
        error: "account_not_approved",
        redirect: "https://sso.awslpu.in/",
      },
      403,
    );
  }

  return jsonResponse({ ok: true });
}