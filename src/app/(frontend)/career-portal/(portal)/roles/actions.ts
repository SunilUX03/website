"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/admin-session";
import { db } from "@/lib/db";

export async function createRole(formData: FormData) {
  await requireAdminSession();
  const label = String(formData.get("label") ?? "").trim();
  if (!label) redirect("/career-portal/roles");

  const last = await db.jobRole.findFirst({ orderBy: { order: "desc" } });
  await db.jobRole.create({ data: { label, order: (last?.order ?? -1) + 1 } });

  revalidatePath("/", "layout");
  redirect("/career-portal/roles");
}

export async function renameRole(id: string, formData: FormData) {
  await requireAdminSession();
  const label = String(formData.get("label") ?? "").trim();
  if (!label) redirect("/career-portal/roles");

  await db.jobRole.update({ where: { id }, data: { label } });
  revalidatePath("/", "layout");
  redirect("/career-portal/roles");
}

export async function deleteRole(id: string) {
  await requireAdminSession();
  await db.jobRole.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect("/career-portal/roles");
}

export async function moveRole(id: string, direction: "up" | "down") {
  await requireAdminSession();
  const roles = await db.jobRole.findMany({ orderBy: { order: "asc" } });

  const index = roles.findIndex((r) => r.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= roles.length) {
    redirect("/career-portal/roles");
  }

  const current = roles[index];
  const neighbor = roles[swapIndex];
  await Promise.all([
    db.jobRole.update({ where: { id: current.id }, data: { order: neighbor.order } }),
    db.jobRole.update({ where: { id: neighbor.id }, data: { order: current.order } }),
  ]);

  revalidatePath("/", "layout");
  redirect("/career-portal/roles");
}
