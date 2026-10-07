"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { optionalStr, str, parseRepeatable } from "@/lib/portal/form-utils";
import { isStale, STALE_CONTENT_MESSAGE } from "@/lib/portal/staleness";

function buildData(formData: FormData) {
  // Kept as full row objects (not collapsed to plain strings) so each
  // row's `id` survives into the Payload data below — losing it makes
  // Payload treat the row as brand new and wipes that field's Tamil
  // translation on save. See RepeatableRows.tsx for the full explanation.
  const statsRows = parseRepeatable(formData, "stats", ["value", "suffix", "label"]);
  return {
    badge: optionalStr(formData, "badge"),
    stats: statsRows.map((r) => ({ ...(r.id ? { id: r.id } : {}), value: Number(r.value || "0"), suffix: r.suffix, label: r.label })),
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
  const locale = formData.get("locale") === "ta" ? "ta" : "en";

  // Catches a save built from a stale page load (e.g. a locale tab left
  // open since before someone else's edit) before it can silently
  // overwrite whatever changed in the meantime — see staleness.ts.
  const current = await payload.findByID({ collection: "projects-spotlight", id, depth: 0, draft: true, overrideAccess: true });
  if (isStale(current.updatedAt, formData.get("_loadedUpdatedAt") as string | null)) {
    redirect(`/cms/projects-spotlight/${id}/edit?locale=${locale}&error=${encodeURIComponent(STALE_CONTENT_MESSAGE)}`);
  }

  if (intent === "publish") {
    await payload.update({ collection: "projects-spotlight", id, locale, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.update({ collection: "projects-spotlight", id, locale, data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.update({ collection: "projects-spotlight", id, locale, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Projects Spotlight", `${action} a spotlight entry`);
  revalidatePath("/", "layout");
  redirect(`/cms/projects-spotlight/${id}/edit?locale=${locale}&saved=1`);
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
