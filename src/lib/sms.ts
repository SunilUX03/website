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
  const responseText = await res.text();
  // This gateway (like most Indian DLT-compliant bulk SMS APIs) can
  // return HTTP 200 even when it rejects the send — e.g. a mismatched
  // entity/template ID, an unapproved sender, or no balance all come
  // back as 200 with the real error described in the body. Checking
  // only res.ok silently treated every one of those as a successful
  // send. Logging the body (never the request URL, which carries the
  // API key) is the only way to see the gateway's real reason.
  console.log(`[sms] gateway response (HTTP ${res.status}):`, responseText);
  if (!res.ok) {
    throw new Error(`SMS gateway responded with HTTP ${res.status}`);
  }
  if (/error|invalid|fail|reject/i.test(responseText)) {
    throw new Error(`SMS gateway rejected the request: ${responseText}`);
  }
}
