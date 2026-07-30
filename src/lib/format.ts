/** Formats an integer using the Indian numbering system (e.g. 1,28,243). */
export function formatIndianNumber(value: number): string {
  const isNegative = value < 0;
  const digits = Math.round(Math.abs(value)).toString();

  if (digits.length <= 3) return (isNegative ? "-" : "") + digits;

  const last3 = digits.slice(-3);
  const rest = digits.slice(0, -3);
  const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");

  return (isNegative ? "-" : "") + grouped + "," + last3;
}

/** Eased-out progress curve: fast start, gentle settle. */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
