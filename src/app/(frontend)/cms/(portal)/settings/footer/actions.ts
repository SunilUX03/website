"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { parseRepeatable, str } from "@/lib/portal/form-utils";

type LinkRow = { label: string; href: string; taLabel: string };
type Rows = { quickLinks: LinkRow[]; citizenServices: LinkRow[]; helpSupport: LinkRow[] };

function readRows(formData: FormData): Rows {
  const keys = ["label", "href", "taLabel"];
  return {
    quickLinks: parseRepeatable(formData, "quickLinks", keys) as LinkRow[],
    citizenServices: parseRepeatable(formData, "citizenServices", keys) as LinkRow[],
    helpSupport: parseRepeatable(formData, "helpSupport", keys) as LinkRow[],
  };
}

function buildEnData(formData: FormData, rows: Rows) {
  return {
    description: str(formData, "description"),
    address: str(formData, "address"),
    phone: str(formData, "phone"),
    email: str(formData, "email"),
    socialLinks: parseRepeatable(formData, "socialLinks", ["label", "href"]) as {
      label: "Facebook" | "X" | "YouTube" | "Instagram" | "LinkedIn";
      href: string;
    }[],
    quickLinks: rows.quickLinks.map((r) => ({ label: r.label, href: r.href })),
    citizenServices: rows.citizenServices.map((r) => ({ label: r.label, href: r.href })),
    helpSupport: rows.helpSupport.map((r) => ({ label: r.label, href: r.href })),
  };
}

// phone/email/socialLinks aren't localized, so they're left out of the
// Tamil payload entirely — href isn't localized either but still needs
// to be resupplied per row, same reasoning as nav-content's actions.ts.
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

function buildTaData(formData: FormData, rows: Rows, enResult: { quickLinks?: { id?: string | null }[] | null; citizenServices?: { id?: string | null }[] | null; helpSupport?: { id?: string | null }[] | null }) {
  return {
    description: str(formData, "descriptionTa"),
    address: str(formData, "addressTa"),
    quickLinks: rows.quickLinks.map((r, i) => withId(enResult.quickLinks ?? [], { label: r.taLabel, href: r.href }, i)),
    citizenServices: rows.citizenServices.map((r, i) => withId(enResult.citizenServices ?? [], { label: r.taLabel, href: r.href }, i)),
    helpSupport: rows.helpSupport.map((r, i) => withId(enResult.helpSupport ?? [], { label: r.taLabel, href: r.href }, i)),
  };
}

export async function updateFooterContent(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const rows = readRows(formData);
  const enData = buildEnData(formData, rows);
  const intent = formData.get("intent");

  let enResult;
  if (intent === "publish") {
    enResult = await payload.updateGlobal({ slug: "footer-content", data: { ...enData, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    enResult = await payload.updateGlobal({ slug: "footer-content", data: { ...enData, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    enResult = await payload.updateGlobal({ slug: "footer-content", data: enData, draft: true, overrideAccess: true });
  }

  const taData = buildTaData(formData, rows, enResult);
  if (intent === "publish") {
    await payload.updateGlobal({ slug: "footer-content", locale: "ta", data: taData, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "footer-content", locale: "ta", data: taData, draft: false, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "footer-content", locale: "ta", data: taData, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Footer", `${action} the site footer`);
  revalidatePath("/", "layout");
  redirect("/cms/settings/footer?saved=1");
}
