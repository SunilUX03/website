import "server-only";

// Government SMS gateway (tmegov.onex-aura.com) for the Careers OTP
// step. The gateway's API key lives only here, read from
// SMS_GATEWAY_API_KEY — this file is server-only and must never be
// imported from client code, or the key would ship in the browser
// bundle and anyone could send SMS on the department's account.

export async function sendOtpSms(phone: string, otp: string): Promise<void> {
  const key = process.env.SMS_GATEWAY_API_KEY;
  const entityId = process.env.SMS_GATEWAY_ENTITY_ID;
  const templateId = process.env.SMS_GATEWAY_TEMPLATE_ID_OTP;
  const sender = process.env.SMS_GATEWAY_SENDER ?? "TNGOVT";

  if (!key || !entityId || !templateId) {
    throw new Error("SMS gateway is not configured — missing SMS_GATEWAY_* environment variables.");
  }

  const body = `Dear User, ${otp} is your OTP for TNeGA Job Application submission valid for 10 minutes. Do not share this with anyone. - TNeGA`;

  const url = new URL("https://tmegov.onex-aura.com/api/sms");
  url.searchParams.set("key", key);
  url.searchParams.set("from", sender);
  url.searchParams.set("entityid", entityId);
  url.searchParams.set("to", `91${phone}`);
  url.searchParams.set("body", body);
  url.searchParams.set("templateid", templateId);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`SMS gateway responded with HTTP ${res.status}`);
  }
}
