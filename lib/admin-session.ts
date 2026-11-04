import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

export const ADMIN_COOKIE_NAME = "divyajyoti_admin_session";

const SESSION_DURATION_SECONDS = 60 * 60 * 8;

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be set and at least 32 characters long."
    );
  }

  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSecret())
    .update(value)
    .digest("hex");
}

function safeCompare(a: string, b: string) {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  return (
    bufferA.length === bufferB.length &&
    timingSafeEqual(bufferA, bufferB)
  );
}

export function verifyAdminPassword(password: string) {
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    throw new Error("ADMIN_PASSWORD is not configured.");
  }

  return safeCompare(password, expectedPassword);
}

export function createAdminSession() {
  const expiresAt =
    Math.floor(Date.now() / 1000) +
    SESSION_DURATION_SECONDS;

  const payload = String(expiresAt);
  const signature = sign(payload);

  return {
    token: `${payload}.${signature}`,
    maxAge: SESSION_DURATION_SECONDS,
  };
}

export function verifyAdminSession(token?: string) {
  if (!token) return false;

  const parts = token.split(".");

  if (parts.length !== 2) return false;

  const [payload, signature] = parts;

  if (!/^\d+$/.test(payload)) return false;

  const expectedSignature = sign(payload);

  if (!safeCompare(signature, expectedSignature)) {
    return false;
  }

  const expiresAt = Number(payload);

  return (
    Number.isSafeInteger(expiresAt) &&
    expiresAt > Math.floor(Date.now() / 1000)
  );
}