import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  buildAuthorizationUrl,
  generateCodeChallenge,
  generateCodeVerifier,
  generateNonce,
  generateState,
} from "@/lib/sso";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requestedNext = url.searchParams.get("next");

  const next =
    requestedNext?.startsWith("/") &&
    !requestedNext.startsWith("//")
      ? requestedNext
      : "/dashboard";
      
  const state = generateState();
  const nonce = generateNonce();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const cookieStore = await cookies();

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 600,
    path: "/",
  };

  cookieStore.set("sso_state", state, cookieOptions);
  cookieStore.set("sso_nonce", nonce, cookieOptions);
  cookieStore.set("sso_code_verifier", codeVerifier, cookieOptions);
  cookieStore.set("sso_next", next, cookieOptions);

  const authorizationUrl = buildAuthorizationUrl({
    state,
    nonce,
    codeChallenge,
  });

  return NextResponse.redirect(authorizationUrl);
}