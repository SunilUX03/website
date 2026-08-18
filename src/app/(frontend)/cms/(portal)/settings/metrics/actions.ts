"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { str, optionalStr } from "@/lib/portal/form-utils";

function buildData(formData: FormData) {
  return {
    metrics: Array.from({ length: 6 }, (_, i) => {
      const decimalsStr = optionalStr(formData, `metric${i}Decimals`);
      return {
        value: Number(str(formData, `metric${i}Value`) || "0"),
        decimals: decimalsStr ? Number(decimalsStr) : undefined,
        prefix: str(formData, `metric${i}Prefix`),
        suffix: str(formData, `metric${i}Suffix`),
        label: str(formData, `metric${i}Label`),
      };
    }),
  };
}

export async function updateMetrics(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const intent = formData.get("intent");

  if (intent === "publish") {
    await payload.updateGlobal({ slug: "metrics-content", data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "metrics-content", data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "metrics-content", data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Homepage Metrics", `${action} the homepage metrics`);
  revalidatePath("/", "layout");
  redirect("/cms/settings/metrics?saved=1");
}
