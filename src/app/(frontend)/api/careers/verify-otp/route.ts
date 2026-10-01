import { NextResponse } from "next/server";
import { verifyOtpChallenge, createPhoneVerifiedToken } from "@/lib/otp";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const otp = typeof body?.otp === "string" ? body.otp.trim() : "";
  const token = typeof body?.token === "string" ? body.token : "";

  if (!phone || !otp || !token) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!verifyOtpChallenge(phone, otp, token)) {
    return NextResponse.json({ error: "Incorrect or expired OTP." }, { status: 400 });
  }

  return NextResponse.json({ verifiedToken: createPhoneVerifiedToken(phone) });
}
