import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION_COOKIE = "site_admin_session";
const STATE_COOKIE = "site_admin_oauth_state";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value) {
    throw new Error("ADMIN_SESSION_SECRET is not configured");
  }
  return value;
}

function sign(value) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function encodeSigned(value) {
  const payload = Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decodeSigned(value) {
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return data.expiresAt > Date.now() ? data : null;
  } catch {
    return null;
  }
}

export function getCookie(req, name) {
  const cookieHeader = req.headers.cookie ?? "";
  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  if (!cookie) return null;
  try {
    return decodeURIComponent(cookie.slice(name.length + 1));
  } catch {
    return null;
  }
}

function cookie(name, value, maxAge) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export function stateCookie(state) {
  return cookie(
    STATE_COOKIE,
    encodeSigned({ state, expiresAt: Date.now() + 10 * 60 * 1000 }),
    600,
  );
}

export function clearStateCookie() {
  return cookie(STATE_COOKIE, "", 0);
}

export function getOAuthState(req) {
  return decodeSigned(getCookie(req, STATE_COOKIE))?.state ?? null;
}

export function sessionCookie(username) {
  return cookie(
    SESSION_COOKIE,
    encodeSigned({
      username,
      expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000,
    }),
    SESSION_TTL_SECONDS,
  );
}

export function clearSessionCookie() {
  return cookie(SESSION_COOKIE, "", 0);
}

export function getSession(req) {
  const session = decodeSigned(getCookie(req, SESSION_COOKIE));
  const allowedUser = process.env.GITHUB_ADMIN_USERNAME?.toLowerCase();
  if (!session?.username || session.username.toLowerCase() !== allowedUser) {
    return null;
  }
  return { username: session.username };
}

export function isSameOrigin(req) {
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (!origin || !host) return false;
  try {
    const parsedOrigin = new URL(origin);
    return parsedOrigin.host === host;
  } catch {
    return false;
  }
}
