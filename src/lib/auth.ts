import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "mrtech_admin";

function getEnv(name: string) {
  return process.env[name];
}

function timingSafeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

function sign(payload: string) {
  const secret = getEnv("AUTH_SECRET");
  if (!secret) return null;
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export function createAdminToken() {
  const issuedAt = Date.now().toString();
  const payload = `admin.${issuedAt}`;
  const sig = sign(payload);
  if (!sig) return null;
  return `${payload}.${sig}`;
}

export function verifyAdminToken(token: string | undefined | null) {
  if (!getEnv("AUTH_SECRET")) return false;
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  const sig = parts[2];
  const expected = sign(payload);
  if (!expected) return false;
  if (!timingSafeEqual(sig, expected)) return false;

  const issuedAt = Number(parts[1]);
  if (!Number.isFinite(issuedAt)) return false;

  const maxAgeMs = 1000 * 60 * 60 * 24 * 14;
  if (Date.now() - issuedAt > maxAgeMs) return false;

  return parts[0] === "admin";
}

export async function requireAdmin() {
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminToken(token);
}

export function verifyAdminPassword(password: string) {
  const expected = getEnv("ADMIN_PASSWORD");
  if (!expected) return false;
  return timingSafeEqual(password, expected);
}
