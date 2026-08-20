"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { str } from "@/lib/portal/form-utils";

function buildService(formData: FormData, i: number) {
  return {
    name: str(formData, `service${i}Name`),
    description: str(formData, `service${i}Description`),
  };
}

function buildData(formData: FormData) {
  return {
    hero: {
      eyebrow: str(formData, "heroEyebrow"),
      heading: str(formData, "heroHeading"),
      body: str(formData, "heroBody"),
    },
    services: [buildService(formData, 0), buildService(formData, 1), buildService(formData, 2), buildService(formData, 3)],
    tableIntro: {
      eyebrow: str(formData, "tableIntroEyebrow"),
      heading: str(formData, "tableIntroHeading"),
      body: str(formData, "tableIntroBody"),
    },
    raiseTicketLabel: str(formData, "raiseTicketLabel"),
    raiseTicketHref: str(formData, "raiseTicketHref"),
  };
}

export async function updateServicesToGovernmentContent(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const intent = formData.get("intent");

  if (intent === "publish") {
    await payload.updateGlobal({ slug: "services-to-government-content", data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "services-to-government-content", data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "services-to-government-content", data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Services to Government Page", `${action} the Services to Government page content`);
  revalidatePath("/", "layout");
  redirect("/cms/settings/services-to-government?saved=1");
}
