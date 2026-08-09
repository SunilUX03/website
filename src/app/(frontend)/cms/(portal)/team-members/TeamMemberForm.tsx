"use client";

import Image from "next/image";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";

export type TeamMemberFormValues = {
  name: string;
  designation: string;
  subject: string;
  order: number;
  photoUrl?: string;
  status?: "draft" | "published";
};

export function TeamMemberForm({
  action,
  values,
}: {
  action: (formData: FormData) => void;
  values: TeamMemberFormValues;
}) {
  return (
    <form action={action} className="flex max-w-[560px] flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Name <span className="normal-case text-[11px]">(use &quot;Vacant&quot; for an unfilled post)</span>
          </label>
          <input
            name="name"
            defaultValue={values.name}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Designation</label>
          <input
            name="designation"
            defaultValue={values.designation}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Department/division <span className="normal-case text-[11px]">(leave blank for the CEO)</span>
          </label>
          <input
            name="subject"
            defaultValue={values.subject}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Photo</label>
          {values.photoUrl ? (
            <div className="relative mb-2 h-24 w-24 overflow-hidden rounded-full border border-hairline">
              <Image src={values.photoUrl} alt="" fill className="object-cover" />
            </div>
          ) : null}
          <input type="file" name="photo" accept="image/*" className="type-body-sm block" />
        </div>

        <div className="max-w-[160px]">
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Order <span className="normal-case text-[11px]">(0 = shows first, normally the CEO)</span>
          </label>
          <input
            type="number"
            name="order"
            defaultValue={values.order}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button type="submit" name="intent" value="draft" className="type-button btn-outline">
          Save draft
        </button>
        {values.status === "published" ? (
          <ConfirmSubmitButton
            name="intent"
            value="unpublish"
            confirmMessage="Unpublish this team member? They'll disappear from the live site."
            className="type-button btn-outline"
          >
            Unpublish
          </ConfirmSubmitButton>
        ) : (
          <ConfirmSubmitButton
            name="intent"
            value="publish"
            confirmMessage="Publish this team member? It will go live immediately."
            className="type-button btn-primary"
          >
            Publish
          </ConfirmSubmitButton>
        )}
      </div>
    </form>
  );
}
