/** Turns the ways people actually write an Indian mobile number (+91 98765
 * 43210, 098765-43210, 91 9876543210, ...) into the plain 10 digits the SMS
 * gateway and the saved application use. Returns null when it isn't a valid
 * 10-digit Indian mobile number (which must start with 6 to 9). Used by both
 * the form and the server routes so they always agree on the same number. */
export function normalizeIndianMobile(input: string): string | null {
  let digits = input.replace(/[\s\-().]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (digits.startsWith("0091")) digits = digits.slice(4);
  else if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}
