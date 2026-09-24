import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  createSession,
  exchangeCode,
  fetchUserInfo,
  verifyIdToken,
  buildAuthUser,
  getSSOConfig,
} from "@/lib/sso";
import { SESSION_COOKIE } from "@/lib/auth";

export async function GET(
  request: Request,
) {
  const url = new URL(request.url);

  const code =
    url.searchParams.get("code");

  const state =
    url.searchParams.get("state");

  const error =
    url.searchParams.get("error");

  if (error) {
    return NextResponse.json(
      {
        error:
          url.searchParams.get(
            "error_description",
          ) ?? error,
      },
      {
        status: 400,
      },
    );
  }

  if (!code || !state) {
    return NextResponse.json(
      {
        error: "Invalid SSO callback",
      },
      {
        status: 400,
      },
    );
  }

  const cookieStore = await cookies();

  const storedState =
    cookieStore.get(
      "sso_state",
    )?.value;

  const nonce =
    cookieStore.get(
      "sso_nonce",
    )?.value;

  const codeVerifier =
    cookieStore.get(
      "sso_code_verifier",
    )?.value;

  const next =
    cookieStore.get(
      "sso_next",
    )?.value ?? "/";

  if (
    !storedState ||
    !nonce ||
    !codeVerifier
  ) {
    return NextResponse.json(
      {
        error:
          "SSO authentication state expired",
      },
      {
        status: 400,
      },
    );
  }

  if (state !== storedState) {
    return NextResponse.json(
      {
        error: "Invalid SSO state",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const tokens = await exchangeCode(
      code,
      codeVerifier,
    );

    if (!tokens.id_token) {
      throw new Error(
        "SSO did not return an ID token",
      );
    }

    if (!tokens.access_token) {
      throw new Error(
        "SSO did not return an access token",
      );
    }

    const idToken = await verifyIdToken(
      tokens.id_token,
      nonce,
    );

    const userinfo =
      await fetchUserInfo(
        tokens.access_token,
        String(idToken.sub),
      );

    const user = buildAuthUser(
      idToken as Record<string, unknown>,
      userinfo,
    );

    const session =
      await createSession(user);

    cookieStore.set(
      SESSION_COOKIE,
      session,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      },
    );

    cookieStore.delete("sso_state");
    cookieStore.delete("sso_nonce");
    cookieStore.delete(
      "sso_code_verifier",
    );
    cookieStore.delete("sso_next");

    const safeNext =
      next.startsWith("/") ? next : "/";

    const redirectUrl =
      new URL(
        safeNext,
        request.url,
      );

    return NextResponse.redirect(
      redirectUrl,
    );
  } catch (error) {
    console.error(
      "SSO callback failed:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Authentication with AWS LPU SSO failed",
      },
      {
        status: 500,
      },
    );
  }
}