import { NextResponse } from "next/server";
import {
  createSession,
  exchangeCode,
  fetchUserInfo,
  verifyIdToken,
  buildAuthUser,
} from "@/lib/sso";
import { SESSION_COOKIE } from "@/lib/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.json(
      {
        error:
          url.searchParams.get("error_description") ?? error,
      },
      { status: 400 },
    );
  }

  if (!code || !state) {
    return NextResponse.json(
      { error: "Invalid SSO callback" },
      { status: 400 },
    );
  }

  const cookieHeader = request.headers.get("cookie") ?? "";

  function getCookie(name: string): string | undefined {
    const prefix = `${name}=`;

    const entry = cookieHeader
      .split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith(prefix));

    if (!entry) return undefined;

    const value = entry.slice(prefix.length);

    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }

  const storedState = getCookie("sso_state");
  const nonce = getCookie("sso_nonce");
  const codeVerifier = getCookie("sso_code_verifier");

  const next = getCookie("sso_next") ?? "/dashboard";

  if (!storedState || !nonce || !codeVerifier) {
    console.error("[SSO] Missing temporary authentication cookies", {
      hasState: Boolean(storedState),
      hasNonce: Boolean(nonce),
      hasCodeVerifier: Boolean(codeVerifier),
    });

    return NextResponse.json(
      {
        error:
          "SSO authentication state expired. Please start login again.",
      },
      { status: 400 },
    );
  }

  if (state !== storedState) {
    console.error("[SSO] State validation failed");

    return NextResponse.json(
      { error: "Invalid SSO state" },
      { status: 400 },
    );
  }

  try {
    const tokens = await exchangeCode(code, codeVerifier);

    if (!tokens.id_token || !tokens.access_token) {
      throw new Error("SSO did not return the required tokens");
    }

    const idToken = await verifyIdToken(
      tokens.id_token,
      nonce,
    );

    if (!idToken.sub) {
      throw new Error("ID token does not contain a subject");
    }

    const userinfo = await fetchUserInfo(
      tokens.access_token,
      String(idToken.sub),
    );

    const user = buildAuthUser(
      idToken as Record<string, unknown>,
      userinfo,
    );

    const session = await createSession(user);

    const safeNext =
      next.startsWith("/") && !next.startsWith("//")
        ? next
        : "/dashboard";

    const response = NextResponse.redirect(
      new URL(safeNext, url.origin),
    );

    response.cookies.set(SESSION_COOKIE, session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    const expiredCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 0,
      path: "/",
    };

    response.cookies.set("sso_state", "", expiredCookieOptions);
    response.cookies.set("sso_nonce", "", expiredCookieOptions);
    response.cookies.set(
      "sso_code_verifier",
      "",
      expiredCookieOptions,
    );
    response.cookies.set("sso_next", "", expiredCookieOptions);

    console.info("[SSO] Session created; redirecting", {
      destination: safeNext,
      role: user.role,
    });

    return response;
  } catch (error) {
    console.error("[SSO] Callback failed:", error);

    return NextResponse.json(
      {
        error: "Authentication with AWS LPU SSO failed",
      },
      { status: 500 },
    );
  }
}