import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { getEvaSeedUser, type EvaSeedUser, type EvaUserId } from "@/lib/eva-learning-db";

export const evaSessionCookieName = "edupocket_eva_session";

const sessionMaxAgeSeconds = 60 * 60 * 24 * 7;
const localPreviewPasscodeHashes: Record<EvaUserId, string> = {
  ali: "1ad5d3a395b20fc99740e04fcb251556f2116b28ca3c494e0a83faefe3d16f06",
  eva: "1e45ae3938c047fb760f2ac40116cc6066cd9fee811795f5a20125fc653290a8",
  elham: "df69fafb53a23cac8391b13af0352275ccbf60b83c3d2c5bbe9de82d3fb05b89",
};

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

function legacyPasscodeHash() {
  return process.env.EVA_PORTAL_PASSCODE_HASH?.trim() ?? "";
}

function configuredPasscodeHashes() {
  const raw = process.env.EVA_PORTAL_USER_PASSCODE_HASHES?.trim();
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<Record<EvaUserId, string>>;
    return parsed;
  } catch {
    return null;
  }
}

function sessionSecret() {
  const explicitSecret = process.env.EVA_PORTAL_SESSION_SECRET?.trim();
  if (explicitSecret) return explicitSecret;
  if (process.env.NODE_ENV !== "production") return "edupocket-local-eva-preview-session";
  return "";
}

function allowsLocalPreviewPasscodes() {
  return process.env.NODE_ENV !== "production" || sessionSecret() === "edupocket-local-eva-preview-session";
}

export function getEvaSessionCookieOptions() {
  return {
    httpOnly: true,
    maxAge: sessionMaxAgeSeconds,
    path: "/eva-digital-booklet",
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production" && !allowsLocalPreviewPasscodes(),
  };
}

export type EvaAuthenticatedUser = EvaSeedUser;

export function validateEvaPasscode(passcode: string): EvaAuthenticatedUser | null {
  const cleaned = passcode.trim();
  const cleanedHash = sha256(cleaned);
  const configuredHashes = configuredPasscodeHashes();

  if (configuredHashes) {
    for (const [userId, hash] of Object.entries(configuredHashes) as Array<[EvaUserId, string | undefined]>) {
      if (hash && safeEqual(cleanedHash, hash)) return getEvaSeedUser(userId) ?? null;
    }

    return null;
  }

  const configuredHash = legacyPasscodeHash();
  if (configuredHash && safeEqual(cleanedHash, configuredHash)) return getEvaSeedUser("eva") ?? null;

  if (allowsLocalPreviewPasscodes()) {
    for (const [userId, hash] of Object.entries(localPreviewPasscodeHashes) as Array<[EvaUserId, string]>) {
      if (safeEqual(cleanedHash, hash)) return getEvaSeedUser(userId) ?? null;
    }
  }

  return null;
}

export function canCreateEvaSession() {
  return Boolean(sessionSecret());
}

export function createEvaSessionToken(userId: EvaUserId) {
  const secret = sessionSecret();
  if (!secret) return "";

  const issuedAt = Date.now().toString();
  const payload = `${issuedAt}.${userId}`;
  const signature = createHmac("sha256", secret).update(payload).digest("hex");

  return `${payload}.${signature}`;
}

export function getEvaSessionUser(token?: string): EvaAuthenticatedUser | null {
  const secret = sessionSecret();
  if (!secret || !token) return null;

  const [issuedAt, userId, signature] = token.split(".");
  if (!issuedAt || !userId || !signature) return null;

  const issuedAtNumber = Number(issuedAt);
  if (!Number.isFinite(issuedAtNumber)) return null;

  const ageSeconds = (Date.now() - issuedAtNumber) / 1000;
  if (ageSeconds < 0 || ageSeconds > sessionMaxAgeSeconds) return null;

  const expected = createHmac("sha256", secret).update(`${issuedAt}.${userId}`).digest("hex");
  if (!safeEqual(signature, expected)) return null;

  return getEvaSeedUser(userId) ?? null;
}

export function isValidEvaSessionToken(token?: string) {
  return Boolean(getEvaSessionUser(token));
}
