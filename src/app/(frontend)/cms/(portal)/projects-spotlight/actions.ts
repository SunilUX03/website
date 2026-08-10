"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { optionalStr, str, parseRepeatable } from "@/lib/portal/form-utils";

function buildData(formData: FormData) {
  const statsRows = parseRepeatable(formData, "stats", ["value", "suffix", "label"]);
  const ctasRows = parseRepeatable(formData, "ctas", ["label", "href"]);
  return {
    badge: optionalStr(formData, "badge"),
    stats: statsRows.map((r) => ({ value: Number(r.value || "0"), suffix: r.suffix, label: r.label })),
    ctas: ctasRows.map((r) => ({ label: r.label, href: r.href })),
    order: Number(str(formData, "order") || "0"),
  };
}

export async function addServicesToSpotlight(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const serviceIds = formData.getAll("serviceId").map((v) => Number(v));

  if (serviceIds.length === 0) {
    redirect(`/cms/projects-spotlight/add?error=${encodeURIComponent("Pick at least one service to add.")}`);
  }

  const { docs: existing } = await payload.find({
    collection: "projects-spotlight",
    limit: 200,
    sort: "-order",
    depth: 0,
    select: { order: true },
    overrideAccess: true,
  });
  let nextOrder = (existing[0]?.order ?? -1) + 1;

  const names: string[] = [];
  for (const serviceId of serviceIds) {
    const service = await payload.findByID({ collection: "services", id: serviceId, overrideAccess: true }).catch(() => null);
    if (!service) continue;
    await payload.create({
      collection: "projects-spotlight",
      data: { service: serviceId, stats: [], ctas: [], order: nextOrder, _status: "draft" },
      draft: true,
      overrideAccess: true,
    });
    names.push(service.name);
    nextOrder += 1;
  }

  await logActivity(user, "created", "Projects Spotlight", `Added ${names.join(", ")} as drafts`);
  revalidatePath("/", "layout");
  redirect("/cms/projects-spotlight");
}

export async function updateProjectSpotlight(id: number, formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const intent = formData.get("intent");

  if (intent === "publish") {
    await payload.update({ collection: "projects-spotlight", id, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.update({ collection: "projects-spotlight", id, data: { ...data, _status: "draft" }, draft: true, overrideAccess: true });
  } else {
    await payload.update({ collection: "projects-spotlight", id, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Projects Spotlight", `${action} a spotlight entry`);
  revalidatePath("/", "layout");
  redirect(`/cms/projects-spotlight/${id}/edit`);
}

export async function deleteProjectSpotlight(id: number, label: string) {
  const user = await requireSession();
  if (user.role !== "admin") throw new Error("Only an admin can delete.");
  const payload = await getPayloadClient();
  await payload.delete({ collection: "projects-spotlight", id, overrideAccess: true });
  await logActivity(user, "deleted", "Projects Spotlight", `Removed "${label}" from the spotlight`);
  revalidatePath("/", "layout");
  redirect("/cms/projects-spotlight");
}

export async function moveProjectSpotlight(id: number, direction: "up" | "down") {
  await requireSession();
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "projects-spotlight",
    sort: "order",
    limit: 200,
    depth: 0,
    select: { order: true, _status: true },
    draft: true,
    overrideAccess: true,
  });

  const index = docs.findIndex((d) => d.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= docs.length) {
    revalidatePath("/", "layout");
    redirect("/cms/projects-spotlight");
  }

  const current = docs[index];
  const neighbor = docs[swapIndex];

  await Promise.all(
    [
      [current, neighbor.order] as const,
      [neighbor, current.order] as const,
    ].map(([doc, order]) =>
      doc._status === "draft"
        ? payload.update({ collection: "projects-spotlight", id: doc.id, data: { order }, draft: true, overrideAccess: true })
        : payload.update({ collection: "projects-spotlight", id: doc.id, data: { order }, overrideAccess: true })
    )
  );

  revalidatePath("/", "layout");
  redirect("/cms/projects-spotlight");
}
