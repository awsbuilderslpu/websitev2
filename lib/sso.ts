import {
  createRemoteJWKSet,
  jwtVerify,
  SignJWT,
} from "jose";

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, "");
}

function normalizeEndpoint(
  value: string | undefined,
  fallback: string,
) {
  const endpoint = (value ?? fallback).trim();
  const url = new URL(endpoint);

  if (url.protocol !== "https:" && url.hostname !== "localhost") {
    throw new Error("SSO endpoints must use HTTPS");
  }

  return url.toString();
}

const issuerBase = normalizeBaseUrl(
  process.env.SSO_ISSUER ?? "https://sso.awslpu.in",
);

const issuer = issuerBase;

const authorizeUrl = normalizeEndpoint(
  process.env.SSO_AUTHORIZE_URL,
  `${issuerBase}/authorize`,
);

const tokenUrl = normalizeEndpoint(
  process.env.SSO_TOKEN_URL,
  `${issuerBase}/oauth/token`,
);

const userinfoUrl = normalizeEndpoint(
  process.env.SSO_USERINFO_URL,
  `${issuerBase}/oauth/userinfo`,
);

const jwksUrl = normalizeEndpoint(
  process.env.SSO_JWKS_URL,
  `${issuerBase}/oauth/jwks`,
);

const clientId = process.env.SSO_CLIENT_ID;
const clientSecret = process.env.SSO_CLIENT_SECRET;
const redirectUri = process.env.SSO_REDIRECT_URI;
const sessionSecret = process.env.SSO_SESSION_SECRET;

if (!clientId) {
  throw new Error("SSO_CLIENT_ID is not configured");
}

if (!redirectUri) {
  throw new Error("SSO_REDIRECT_URI is not configured");
}

if (!sessionSecret) {
  throw new Error("SSO_SESSION_SECRET is not configured");
}

if (sessionSecret.length < 32) {
  throw new Error("SSO_SESSION_SECRET must be at least 32 characters");
}

const config = {
  issuer,
  authorizeUrl,
  tokenUrl,
  userinfoUrl,
  jwksUrl,
  clientId,
  clientSecret,
  redirectUri,
  sessionSecret,
};

const sessionKey = new TextEncoder().encode(
  config.sessionSecret,
);

const jwks = createRemoteJWKSet(
  new URL(config.jwksUrl),
);

export type SsoRole = "member" | "core" | "admin";

export type AuthUser = {
  sub: string;
  name: string | null;
  email: string | null;
  picture: string | null;
  role: SsoRole;
};

async function fetchWithDiagnostics(
  label: string,
  url: string,
  init?: RequestInit,
): Promise<Response> {
  console.info(`[SSO] ${label}: starting`, {
    url,
    method: init?.method ?? "GET",
  });

  try {
    const response = await fetch(url, init);

    console.info(`[SSO] ${label}: response`, {
      status: response.status,
      redirected: response.redirected,
      url: response.url,
    });

    return response;
  } catch (error) {
    console.error(`[SSO] ${label}: fetch failed`, {
      name:
        error instanceof Error
          ? error.name
          : "UnknownError",
      message:
        error instanceof Error
          ? error.message
          : String(error),
      cause:
        error instanceof Error
          ? error.cause instanceof Error
            ? error.cause.message
            : error.cause === undefined
              ? undefined
              : String(error.cause)
          : undefined,
    });

    throw error;
  }
}

export function getSSOConfig() {
  return {
    issuer: config.issuer,
    authorizeUrl: config.authorizeUrl,
    tokenUrl: config.tokenUrl,
    userinfoUrl: config.userinfoUrl,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    redirectUri: config.redirectUri,
  };
}

function randomBytes(length: number) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

function base64UrlEncode(bytes: Uint8Array): string {
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function generateState() {
  return base64UrlEncode(randomBytes(32));
}

export function generateNonce() {
  return base64UrlEncode(randomBytes(32));
}

export function generateCodeVerifier() {
  return base64UrlEncode(randomBytes(64));
}

export async function generateCodeChallenge(
  verifier: string,
) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );

  return base64UrlEncode(new Uint8Array(digest));
}

export async function verifyIdToken(
  idToken: string,
  nonce: string,
) {
  console.info("[SSO] ID token verification: starting");

  try {
    const { payload } = await jwtVerify(
      idToken,
      jwks,
      {
        issuer: config.issuer,
        audience: config.clientId,
        algorithms: ["RS256"],
      },
    );

    if (!payload.sub) {
      throw new Error(
        "ID token does not contain a subject",
      );
    }

    if (payload.nonce !== nonce) {
      throw new Error("Invalid ID token nonce");
    }

    console.info("[SSO] ID token verification: successful");

    return payload;
  } catch (error) {
    console.error("[SSO] ID token verification failed", {
      name:
        error instanceof Error
          ? error.name
          : "UnknownError",
      message:
        error instanceof Error
          ? error.message
          : String(error),
    });

    throw error;
  }
}

export async function fetchUserInfo(
  accessToken: string,
  expectedSub: string,
) {
  const response = await fetchWithDiagnostics(
    "userinfo",
    config.userinfoUrl,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
      redirect: "manual",
    },
  );

  if (response.status >= 300 && response.status < 400) {
    console.error("[SSO] Userinfo endpoint redirected", {
      status: response.status,
      location: response.headers.get("location"),
    });

    throw new Error(
      `SSO userinfo endpoint returned HTTP ${response.status} redirect`,
    );
  }

  if (!response.ok) {
    const responseText = await response.text();

    console.error("[SSO] Userinfo request failed", {
      status: response.status,
      response: responseText.slice(0, 1000),
    });

    throw new Error(
      `Failed to fetch userinfo: HTTP ${response.status}`,
    );
  }

  const userinfo = await response.json() as Record<
    string,
    unknown
  >;

  if (
    typeof userinfo.sub !== "string" ||
    !userinfo.sub
  ) {
    throw new Error(
      "Userinfo does not contain a subject",
    );
  }

  if (userinfo.sub !== expectedSub) {
    throw new Error("Userinfo subject mismatch");
  }

  return userinfo;
}

function normalizeRole(value: unknown): SsoRole {
  if (
    value === "admin" ||
    value === "core" ||
    value === "member"
  ) {
    return value;
  }

  return "member";
}

export function buildAuthUser(
  idToken: Record<string, unknown>,
  userinfo: Record<string, unknown>,
): AuthUser {
  const sub = userinfo.sub ?? idToken.sub;

  if (typeof sub !== "string" || !sub) {
    throw new Error(
      "Cannot build authenticated user without a subject",
    );
  }

  const role =
    userinfo.role ?? idToken.role ?? "member";

  return {
    sub,
    name:
      typeof userinfo.name === "string"
        ? userinfo.name
        : typeof userinfo.preferred_username === "string"
          ? userinfo.preferred_username
          : null,
    email:
      typeof userinfo.email === "string"
        ? userinfo.email
        : null,
    picture:
      typeof userinfo.picture === "string"
        ? userinfo.picture
        : null,
    role: normalizeRole(role),
  };
}

export async function createSession(user: AuthUser) {
  return new SignJWT(user)
    .setProtectedHeader({
      alg: "HS256",
    })
    .setSubject(user.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(sessionKey);
}

export async function verifySession(token: string) {
  const { payload } = await jwtVerify(
    token,
    sessionKey,
    {
      algorithms: ["HS256"],
    },
  );

  if (!payload.sub) {
    throw new Error(
      "Session does not contain a subject",
    );
  }

  return {
    sub: payload.sub,
    name:
      typeof payload.name === "string"
        ? payload.name
        : null,
    email:
      typeof payload.email === "string"
        ? payload.email
        : null,
    picture:
      typeof payload.picture === "string"
        ? payload.picture
        : null,
    role: normalizeRole(payload.role),
  } satisfies AuthUser;
}

export function buildAuthorizationUrl({
  state,
  nonce,
  codeChallenge,
}: {
  state: string;
  nonce: string;
  codeChallenge: string;
}) {
  const url = new URL(config.authorizeUrl);

  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set(
    "scope",
    "openid profile email",
  );
  url.searchParams.set("state", state);
  url.searchParams.set("nonce", nonce);
  url.searchParams.set(
    "code_challenge",
    codeChallenge,
  );
  url.searchParams.set(
    "code_challenge_method",
    "S256",
  );

  return url;
}

export async function exchangeCode(
  code: string,
  codeVerifier: string,
) {
  if (!config.clientSecret) {
    throw new Error(
      "SSO_CLIENT_SECRET is not configured",
    );
  }

  const credentials = Buffer.from(
    `${config.clientId}:${config.clientSecret}`,
  ).toString("base64");

  const body = new URLSearchParams();

  body.set("grant_type", "authorization_code");
  body.set("code", code);
  body.set("redirect_uri", config.redirectUri);
  body.set("code_verifier", codeVerifier);

  const response = await fetchWithDiagnostics(
    "token exchange",
    config.tokenUrl,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body,
      cache: "no-store",
      redirect: "manual",
    },
  );

  if (response.status >= 300 && response.status < 400) {
    console.error(
      "[SSO] Token endpoint redirected",
      {
        status: response.status,
        location: response.headers.get("location"),
      },
    );

    throw new Error(
      `SSO token endpoint returned HTTP ${response.status} redirect`,
    );
  }

  if (!response.ok) {
    const responseText = await response.text();

    console.error("[SSO] Token exchange failed", {
      status: response.status,
      response: responseText.slice(0, 1000),
    });

    throw new Error(
      `Failed to exchange authorization code: HTTP ${response.status}`,
    );
  }

  return response.json();
}