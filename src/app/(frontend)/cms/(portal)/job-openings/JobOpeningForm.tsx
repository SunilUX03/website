"use client";

import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";

export type JobOpeningFormValues = {
  role: string;
  type: string;
  department: string;
  deadline: string;
  jdHref: string;
  status?: "draft" | "published";
};

export function JobOpeningForm({
  action,
  values,
}: {
  action: (formData: FormData) => void;
  values: JobOpeningFormValues;
}) {
  return (
    <form action={action} className="flex max-w-[560px] flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Role</label>
          <input
            name="role"
            defaultValue={values.role}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Type</label>
            <input
              name="type"
              defaultValue={values.type}
              placeholder="Contract"
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Department</label>
            <input
              name="department"
              defaultValue={values.department}
              required
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Deadline</label>
          <input
            type="date"
            name="deadline"
            defaultValue={values.deadline}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Job description link <span className="normal-case text-[11px]">(optional — leave blank to hide the Download JD button)</span>
          </label>
          <input
            name="jdHref"
            defaultValue={values.jdHref}
            placeholder="/documents/careers/role-name.pdf"
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
            confirmMessage="Unpublish this opening? It will disappear from the live site."
            className="type-button btn-outline"
          >
            Unpublish
          </ConfirmSubmitButton>
        ) : (
          <ConfirmSubmitButton
            name="intent"
            value="publish"
            confirmMessage="Publish this opening? It will go live immediately."
            className="type-button btn-primary"
          >
            Publish
          </ConfirmSubmitButton>
        )}
      </div>
    </form>
  );
}
