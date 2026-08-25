import "server-only";
import crypto from "crypto";

// Self-contained arithmetic captcha for the two admin login forms (CMS,
// Career Portal) — no external service (reCAPTCHA/Turnstile) account or
// API key needed, which none of this project's env config has. Not
// meant to stop a determined, purpose-built bot (the answer is trivial
// arithmetic once parsed) — it stops the generic credential-stuffing
// scripts that just POST a username/password pair with no idea an extra
// field exists, which is the realistic threat against an admin login
// nobody advertises.
//
// Stateless by design: the expected answer + an expiry are signed into
// the token itself (HMAC, keyed off PAYLOAD_SECRET — already required
// config, so this doesn't need a new env var) and round-tripped through
// a hidden form field, rather than kept in a server-side session store.

const TTL_MS = 10 * 60 * 1000;

function secret(): string {
  return process.env.PAYLOAD_SECRET ?? "dev-only-captcha-secret";
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

export type Captcha = { question: string; token: string };

export function generateCaptcha(): Captcha {
  const a = 1 + Math.floor(Math.random() * 9);
  const b = 1 + Math.floor(Math.random() * 9);
  const answer = String(a + b);
  const expires = Date.now() + TTL_MS;
  const payload = `${answer}:${expires}`;
  const token = Buffer.from(`${payload}:${sign(payload)}`).toString("base64url");
  return { question: `${a} + ${b}`, token };
}

export function verifyCaptcha(token: unknown, answer: unknown): boolean {
  if (typeof token !== "string" || typeof answer !== "string" || !token) return false;
  let decoded: string;
  try {
    decoded = Buffer.from(token, "base64url").toString("utf8");
  } catch {
    return false;
  }
  const [expectedAnswer, expiresStr, sig] = decoded.split(":");
  if (!expectedAnswer || !expiresStr || !sig) return false;
  if (sign(`${expectedAnswer}:${expiresStr}`) !== sig) return false;
  if (Date.now() > Number(expiresStr)) return false;
  return answer.trim() === expectedAnswer;
}
