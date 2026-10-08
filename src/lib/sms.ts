import "server-only";
import { buildOtpSmsUrl } from "@/lib/sms-url";

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

  const { url, body } = buildOtpSmsUrl({ key, from: sender, entityId, templateId, phone, otp });
  // Everything except the API key and the code, so a delivery problem can
  // be compared against what the SMS provider has registered.
  console.log("[sms] sending", {
    to: `91XXXXXX${phone.slice(-4)}`,
    from: sender,
    entityid: entityId,
    templateid: templateId,
    body: body.replace(otp, "XXXXXX"),
  });

  const res = await fetch(url);
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
