import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

export async function GET(request: Request) {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete("sso_state");
  cookieStore.delete("sso_nonce");
  cookieStore.delete("sso_code_verifier");
  cookieStore.delete("sso_next");

  return NextResponse.redirect(new URL("/", request.url));
}