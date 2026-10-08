import { NextResponse } from "next/server";
import { createOtpChallenge } from "@/lib/otp";
import { sendOtpSms } from "@/lib/sms";
import { normalizeIndianMobile } from "@/lib/phone";

// Simple per-phone-number cooldown so one visitor can't spam the SMS
// gateway (each send costs money and could also be used to harass an
// unrelated phone number). In-memory, so it resets on a server restart
// and isn't shared across multiple server instances — acceptable for
// this form's traffic volume; swap for a shared store if that changes.
const COOLDOWN_MS = 60 * 1000;
const lastSentAt = new Map<string, number>();

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const phone = typeof body?.phone === "string" ? normalizeIndianMobile(body.phone) : null;

  if (!phone) {
    return NextResponse.json({ error: "Enter a valid 10-digit mobile number." }, { status: 400 });
  }

  const last = lastSentAt.get(phone);
  if (last && Date.now() - last < COOLDOWN_MS) {
    return NextResponse.json({ error: "Please wait a minute before requesting another OTP." }, { status: 429 });
  }

  const { otp, token } = createOtpChallenge(phone);
  try {
    await sendOtpSms(phone, otp);
  } catch (err) {
    console.error("Failed to send OTP SMS:", err);
    return NextResponse.json({ error: "Could not send the OTP right now. Please try again." }, { status: 502 });
  }

  lastSentAt.set(phone, Date.now());
  return NextResponse.json({ token });
}
