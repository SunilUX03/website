"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { str, optionalStr } from "@/lib/portal/form-utils";

function buildData(formData: FormData) {
  return {
    topPrimary: str(formData, "topPrimary"),
    topSecondary: str(formData, "topSecondary"),
    branches: Array.from({ length: 6 }, (_, i) => ({
      director: str(formData, `branch${i}Director`),
      engineer: optionalStr(formData, `branch${i}Engineer`),
      manager: str(formData, `branch${i}Manager`),
      base: str(formData, `branch${i}Base`),
    })),
  };
}

export async function updateOrgChart(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const intent = formData.get("intent");

  if (intent === "publish") {
    await payload.updateGlobal({ slug: "org-chart-content", data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "org-chart-content", data: { ...data, _status: "draft" }, draft: true, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "org-chart-content", data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Organisation Structure", `${action} the About page's org chart`);
  revalidatePath("/", "layout");
  redirect("/cms/settings/org-chart");
}
