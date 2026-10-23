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

function normalizeField(
  value: unknown,
  maxLength: number,
): { value: string | null; valid: boolean } {
  if (typeof value !== "string") {
    return { value: null, valid: false };
  }

  const normalized = value.trim();

  if (
    normalized.length > maxLength ||
    /[\u0000-\u001F\u007F]/.test(normalized)
  ) {
    return { value: null, valid: false };
  }

  return {
    value: normalized || null,
    valid: true,
  };
}

export async function PATCH(request: NextRequest) {
  const origin = request.headers.get("origin");
  const configuredOrigin =
    process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;

  let allowedOrigin: string;

  try {
    allowedOrigin = new URL(configuredOrigin).origin;
  } catch {
    return jsonResponse({ error: "server_configuration_error" }, 500);
  }

  if (!origin) {
    return jsonResponse({ error: "missing_origin" }, 403);
  }

  try {
    if (new URL(origin).origin !== allowedOrigin) {
      return jsonResponse({ error: "forbidden_origin" }, 403);
    }
  } catch {
    return jsonResponse({ error: "invalid_origin" }, 403);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "invalid_request" }, 400);
  }

  if (!body || typeof body !== "object") {
    return jsonResponse({ error: "invalid_request" }, 400);
  }

  const input = body as Record<string, unknown>;

  const workspaceName = normalizeField(input.workspace_name, 120);
  const workspaceUid = normalizeField(input.workspace_uid, 80);

  if (!workspaceName.valid || !workspaceUid.valid) {
    return jsonResponse(
      {
        error: "invalid_fields",
        message:
          "Workspace name must be 120 characters or fewer, and workspace UID must be 80 characters or fewer.",
      },
      400,
    );
  }

  const supabase = await createAuthServerClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  if (claimsError || typeof userId !== "string") {
    return jsonResponse({ error: "unauthenticated" }, 401);
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      workspace_name: workspaceName.value,
      workspace_uid: workspaceUid.value,
    })
    .eq("id", userId)
    .select("workspace_name, workspace_uid")
    .maybeSingle();

  if (error) {
    console.error("[PROFILE] Workspace update failed:", error.message);

    return jsonResponse(
      { error: "update_failed" },
      error.code === "42501" ? 403 : 500,
    );
  }

  if (!data) {
    return jsonResponse(
      {
        error: "profile_not_updated",
        message:
          "Your profile could not be updated. Check your profile and database permissions.",
      },
      403,
    );
  }

  return jsonResponse({
    success: true,
    workspace_name: data.workspace_name,
    workspace_uid: data.workspace_uid,
  });
}