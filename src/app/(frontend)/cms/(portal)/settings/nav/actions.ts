"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { parseRepeatable, str } from "@/lib/portal/form-utils";

type LinkRow = { label: string; href: string; taLabel: string };
type Rows = { about: LinkRow[]; services: LinkRow[]; notificationsUpdates: LinkRow[]; notificationsDocuments: LinkRow[] };

function readRows(formData: FormData): Rows {
  const keys = ["label", "href", "taLabel"];
  return {
    about: parseRepeatable(formData, "about", keys) as LinkRow[],
    services: parseRepeatable(formData, "services", keys) as LinkRow[],
    notificationsUpdates: parseRepeatable(formData, "notificationsUpdates", keys) as LinkRow[],
    notificationsDocuments: parseRepeatable(formData, "notificationsDocuments", keys) as LinkRow[],
  };
}

function buildEnData(formData: FormData, rows: Rows) {
  return {
    govLabel: str(formData, "govLabel"),
    about: rows.about.map((r) => ({ label: r.label, href: r.href })),
    services: rows.services.map((r) => ({ label: r.label, href: r.href })),
    notificationsUpdates: rows.notificationsUpdates.map((r) => ({ label: r.label, href: r.href })),
    notificationsDocuments: rows.notificationsDocuments.map((r) => ({ label: r.label, href: r.href })),
  };
}

// href isn't localized, but Payload validates the full array-row shape on
// every locale update — each row needs its (unchanged) href supplied
// again here alongside the Tamil label.
//
// `withId` re-attaches the row id Payload just assigned on the EN write
// (enRows, same order) to each Tamil row. Array rows share one id across
// locales — submitting a Tamil-locale array update WITHOUT that id makes
// Payload treat every row as brand new, silently deleting the English
// locale data that lived on the old row. Always save EN first, then pass
// its resulting rows in here before saving TA.
function withId<T extends { id?: string | null }>(enRows: T[], row: Omit<T, "id">, i: number): T {
  const id = enRows[i]?.id;
  return (id ? { ...row, id } : row) as T;
}

function buildTaData(formData: FormData, rows: Rows, enResult: { about?: { id?: string | null }[] | null; services?: { id?: string | null }[] | null; notificationsUpdates?: { id?: string | null }[] | null; notificationsDocuments?: { id?: string | null }[] | null }) {
  return {
    govLabel: str(formData, "govLabelTa"),
    about: rows.about.map((r, i) => withId(enResult.about ?? [], { label: r.taLabel, href: r.href }, i)),
    services: rows.services.map((r, i) => withId(enResult.services ?? [], { label: r.taLabel, href: r.href }, i)),
    notificationsUpdates: rows.notificationsUpdates.map((r, i) => withId(enResult.notificationsUpdates ?? [], { label: r.taLabel, href: r.href }, i)),
    notificationsDocuments: rows.notificationsDocuments.map((r, i) => withId(enResult.notificationsDocuments ?? [], { label: r.taLabel, href: r.href }, i)),
  };
}

export async function updateNavContent(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const rows = readRows(formData);
  const enData = buildEnData(formData, rows);
  const intent = formData.get("intent");

  let enResult;
  if (intent === "publish") {
    enResult = await payload.updateGlobal({ slug: "nav-content", data: { ...enData, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    enResult = await payload.updateGlobal({ slug: "nav-content", data: { ...enData, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    enResult = await payload.updateGlobal({ slug: "nav-content", data: enData, draft: true, overrideAccess: true });
  }

  const taData = buildTaData(formData, rows, enResult);
  if (intent === "publish") {
    await payload.updateGlobal({ slug: "nav-content", locale: "ta", data: taData, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "nav-content", locale: "ta", data: taData, draft: false, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "nav-content", locale: "ta", data: taData, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Site Navigation", `${action} the header navigation`);
  revalidatePath("/", "layout");
  redirect("/cms/settings/nav?saved=1");
}
