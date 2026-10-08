/** Builds the gateway request address. Parameters are percent-encoded with
 * %20 for spaces, exactly as a browser would send the vendor's own example
 * address. (URLSearchParams would write spaces as "+", and a gateway that
 * doesn't decode "+" would see a message text that no longer matches its
 * registered DLT template, which makes carriers drop the SMS silently even
 * though the gateway reports it as submitted.) */
export function buildOtpSmsUrl(opts: {
  key: string;
  from: string;
  entityId: string;
  templateId: string;
  phone: string;
  otp: string;
}): { url: string; body: string } {
  const body = `Dear User, ${opts.otp} is your OTP for TNeGA Job Application submission valid for 10 minutes. Do not share this with anyone. - TNeGA`;
  const params: [string, string][] = [
    ["key", opts.key],
    ["from", opts.from],
    ["entityid", opts.entityId],
    ["to", `91${opts.phone}`],
    ["body", body],
    ["templateid", opts.templateId],
  ];
  const query = params.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
  return { url: `https://tmegov.onex-aura.com/api/sms?${query}`, body };
}
