import "server-only";
import crypto from "crypto";

// Phone-number verification for the Careers application form. Stateless
// by design, same reasoning as captcha.ts (HMAC-signed token round-
// tripped through the client, no server-side session store needed) —
// but unlike captcha.ts, the token here must NOT let anyone recover the
// real OTP by decoding it: it only ever carries a signature *over* the
// OTP, never the OTP itself, so verifying means "does this guess hash to
// the same signature", not "read the stored value and compare". Comparison
// is timing-safe since, unlike the arithmetic captcha, this guards an
// actual one-time secret dispatched over SMS.

const OTP_TTL_MS = 10 * 60 * 1000; // matches "valid for 10 minutes" in the SMS text
const VERIFIED_TTL_MS = 30 * 60 * 1000; // generous window to finish filling out the rest of the form

function secret(): string {
  return process.env.PAYLOAD_SECRET ?? "dev-only-otp-secret";
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function decodeToken(token: string): string[] | null {
  try {
    return Buffer.from(token, "base64url").toString("utf8").split(":");
  } catch {
    return null;
  }
}

export type OtpChallenge = { otp: string; token: string };

/** Generates a 6-digit OTP to send over SMS, plus the token the client
 * round-trips back on verification. The token never contains the OTP
 * itself — only a signature committing to it. */
export function createOtpChallenge(phone: string): OtpChallenge {
  const otp = String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
  const expires = Date.now() + OTP_TTL_MS;
  const sig = sign(`otp:${phone}:${otp}:${expires}`);
  const token = Buffer.from(`${phone}:${expires}:${sig}`).toString("base64url");
  return { otp, token };
}

/** Checks a submitted OTP against the token from createOtpChallenge —
 * true only if it's for the same phone number, hasn't expired, and the
 * guess's signature matches the one committed at send time. */
export function verifyOtpChallenge(phone: string, otp: string, token: string): boolean {
  const parts = decodeToken(token);
  if (!parts || parts.length !== 3) return false;
  const [tokenPhone, expiresStr, sig] = parts;
  if (tokenPhone !== phone) return false;
  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;
  const expectedSig = sign(`otp:${phone}:${otp}:${expires}`);
  return timingSafeEqual(sig, expectedSig);
}

/** Issued once a phone number has passed OTP verification — the client
 * carries this into the final application submission, and the apply
 * route re-checks it (see api/careers/apply/route.ts) so a direct POST
 * can't skip verification just by not calling the verify-otp endpoint. */
export function createPhoneVerifiedToken(phone: string): string {
  const expires = Date.now() + VERIFIED_TTL_MS;
  const sig = sign(`verified:${phone}:${expires}`);
  return Buffer.from(`${phone}:${expires}:${sig}`).toString("base64url");
}

export function verifyPhoneVerifiedToken(phone: string, token: string): boolean {
  const parts = decodeToken(token);
  if (!parts || parts.length !== 3) return false;
  const [tokenPhone, expiresStr, sig] = parts;
  if (tokenPhone !== phone) return false;
  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;
  const expectedSig = sign(`verified:${phone}:${expires}`);
  return timingSafeEqual(sig, expectedSig);
}
