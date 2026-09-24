import {
  createRemoteJWKSet,
  jwtVerify,
  SignJWT,
} from "jose";

const issuer =
  process.env.SSO_ISSUER ?? "https://sso.awslpu.in";

const authorizeUrl =
  process.env.SSO_AUTHORIZE_URL ??
  "https://sso.awslpu.in/authorize";

const tokenUrl =
  process.env.SSO_TOKEN_URL ??
  "https://sso.awslpu.in/oauth/token";

const userinfoUrl =
  process.env.SSO_USERINFO_URL ??
  "https://sso.awslpu.in/oauth/userinfo";

const jwksUrl =
  process.env.SSO_JWKS_URL ??
  "https://sso.awslpu.in/oauth/jwks";

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
  throw new Error(
    "SSO_SESSION_SECRET is not configured",
  );
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

export type SsoRole =
  | "member"
  | "core"
  | "admin";

export type AuthUser = {
  sub: string;
  name: string | null;
  email: string | null;
  picture: string | null;
  role: SsoRole;
};

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

function base64UrlEncode(bytes: Uint8Array) {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return Buffer.from(binary, "binary")
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

  return base64UrlEncode(
    new Uint8Array(digest),
  );
}

export async function verifyIdToken(
  idToken: string,
  nonce: string,
) {
  const { payload } = await jwtVerify(
    idToken,
    jwks,
    {
      issuer: config.issuer,
      audience: config.clientId,
    },
  );

  if (!payload.sub) {
    throw new Error(
      "ID token does not contain a subject",
    );
  }

  if (payload.nonce !== nonce) {
    throw new Error(
      "Invalid ID token nonce",
    );
  }

  return payload;
}

export async function fetchUserInfo(
  accessToken: string,
  expectedSub: string,
) {
  const response = await fetch(
    config.userinfoUrl,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch userinfo",
    );
  }

  const userinfo = await response.json();

  if (!userinfo.sub) {
    throw new Error(
      "Userinfo does not contain a subject",
    );
  }

  if (userinfo.sub !== expectedSub) {
    throw new Error(
      "Userinfo subject mismatch",
    );
  }

  return userinfo;
}

function normalizeRole(
  value: unknown,
): SsoRole {
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
  const role =
    userinfo.role ??
    idToken.role ??
    "member";

  return {
    sub: String(
      userinfo.sub ?? idToken.sub,
    ),
    name:
      typeof userinfo.name === "string"
        ? userinfo.name
        : typeof userinfo.preferred_username ===
            "string"
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

export async function createSession(
  user: AuthUser,
) {
  return new SignJWT(user)
    .setProtectedHeader({
      alg: "HS256",
    })
    .setSubject(user.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(sessionKey);
}

export async function verifySession(
  token: string,
) {
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
  const url = new URL(
    config.authorizeUrl,
  );

  url.searchParams.set(
    "response_type",
    "code",
  );

  url.searchParams.set(
    "client_id",
    config.clientId,
  );

  url.searchParams.set(
    "redirect_uri",
    config.redirectUri,
  );

  url.searchParams.set(
    "scope",
    "openid profile email",
  );

  url.searchParams.set(
    "state",
    state,
  );

  url.searchParams.set(
    "nonce",
    nonce,
  );

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

  body.set(
    "grant_type",
    "authorization_code",
  );

  body.set(
    "code",
    code,
  );

  body.set(
    "redirect_uri",
    config.redirectUri,
  );

  body.set(
    "code_verifier",
    codeVerifier,
  );

  const response = await fetch(
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
    },
  );

  if (!response.ok) {
    const text = await response.text();

    console.error(
      "SSO token exchange failed:",
      text,
    );

    throw new Error(
      "Failed to exchange authorization code",
    );
  }

  return response.json();
}

