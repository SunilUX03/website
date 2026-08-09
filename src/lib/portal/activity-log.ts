import "server-only";
import { getPayloadClient } from "@/lib/payload-client";
import type { PortalUser } from "@/lib/portal/auth";

type LogAction = "created" | "updated" | "published" | "unpublished" | "deleted";

/** Called from every Server Action that changes content, right after the
 * change succeeds — a single unified feed across every section, since
 * Payload's own per-document version history can't be viewed as one
 * combined list across collections. */
export async function logActivity(user: PortalUser, action: LogAction, section: string, summary: string) {
  const payload = await getPayloadClient();
  await payload.create({
    collection: "activity-log",
    data: { userEmail: user.email, action, section, summary },
    overrideAccess: true,
  });
}
