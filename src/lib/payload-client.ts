import { getPayload, type Payload } from "payload";
import config from "@/payload.config";

// Payload's Local API talks to the database directly — no HTTP round
// trip needed since this runs in the same process as the rest of the
// app's Server Components. Cached across calls within a request/build
// the same way the Prisma client singleton is (see lib/db.ts) so
// repeated calls during one render don't each re-initialize Payload.
let cached: Promise<Payload> | null = null;

export function getPayloadClient(): Promise<Payload> {
  if (!cached) cached = getPayload({ config });
  return cached;
}
