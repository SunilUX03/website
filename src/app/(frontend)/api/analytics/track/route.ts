import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";

// Receives the beacons analytics-client.ts sends (pageview/click/
// conversion/accessibility events) and appends them to a plain
// `analytics_events` table — not a Payload collection, since this is
// pure append-only log data with no versions/drafts/publish workflow to
// speak of, and Payload's document machinery would be pure overhead on
// what's meant to be a cheap, high-frequency write path. Written via
// Prisma (the same client the Career Portal already uses) since it can
// run raw SQL against any table in the shared Postgres database, not
// just Prisma-modelled ones — see src/lib/db.ts.
//
// The client already gates every call on analytics consent before it
// ever reaches here, so this route trusts the request rather than
// re-deriving consent state server-side (there's no consent cookie to
// check server-side anyway — consent lives in localStorage, by design,
// so it never leaves the browser as its own tracking signal).

const EVENT_TYPES = new Set(["pageview", "click", "conversion", "accessibility"]);

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const { type, path, label, visitorId, locale, device } = body as Record<string, unknown>;

  if (typeof type !== "string" || !EVENT_TYPES.has(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
  if (typeof visitorId !== "string" || !visitorId) {
    return NextResponse.json({ error: "Missing visitorId" }, { status: 400 });
  }

  await db.$executeRaw`
    INSERT INTO "analytics_events" ("type", "path", "label", "visitor_id", "locale", "device")
    VALUES (
      ${type},
      ${typeof path === "string" ? path.slice(0, 500) : null},
      ${typeof label === "string" ? label.slice(0, 200) : null},
      ${visitorId.slice(0, 100)},
      ${typeof locale === "string" ? locale.slice(0, 10) : null},
      ${typeof device === "string" ? device.slice(0, 20) : null}
    )
  `;

  return NextResponse.json({ ok: true });
}
