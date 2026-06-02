import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const evaSessionCookieName = "edupocket_eva_session";

const sessionMaxAgeSeconds = 60 * 60 * 24 * 7;
const localPreviewPasscode = "eva-local-preview";

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

function passcodeHash() {
  return process.env.EVA_PORTAL_PASSCODE_HASH?.trim() ?? "";
}

function sessionSecret() {
  const explicitSecret = process.env.EVA_PORTAL_SESSION_SECRET?.trim();
  if (explicitSecret) return explicitSecret;
  if (process.env.NODE_ENV !== "production") return "edupocket-local-eva-preview-session";
  return "";
}

export function getEvaSessionCookieOptions() {
  return {
    httpOnly: true,
    maxAge: sessionMaxAgeSeconds,
    path: "/eva-digital-booklet",
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export function validateEvaPasscode(passcode: string) {
  const cleaned = passcode.trim();
  const configuredHash = passcodeHash();

  if (configuredHash) return safeEqual(sha256(cleaned), configuredHash);
  if (process.env.NODE_ENV !== "production") return safeEqual(cleaned, localPreviewPasscode);
  return false;
}

export function canCreateEvaSession() {
  return Boolean(sessionSecret());
}

export function createEvaSessionToken() {
  const secret = sessionSecret();
  if (!secret) return "";

  const issuedAt = Date.now().toString();
  const signature = createHmac("sha256", secret).update(issuedAt).digest("hex");

  return `${issuedAt}.${signature}`;
}

export function isValidEvaSessionToken(token?: string) {
  const secret = sessionSecret();
  if (!secret || !token) return false;

  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature) return false;

  const issuedAtNumber = Number(issuedAt);
  if (!Number.isFinite(issuedAtNumber)) return false;

  const ageSeconds = (Date.now() - issuedAtNumber) / 1000;
  if (ageSeconds < 0 || ageSeconds > sessionMaxAgeSeconds) return false;

  const expected = createHmac("sha256", secret).update(issuedAt).digest("hex");
  return safeEqual(signature, expected);
}

