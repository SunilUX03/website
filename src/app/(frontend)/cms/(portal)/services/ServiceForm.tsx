"use client";

import Image from "next/image";
import { RepeatableRows } from "@/components/portal/RepeatableRows";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";

export type ServiceFormValues = {
  name: string;
  description: string;
  stats: string;
  accessPortalHref: string;
  sections: string[];
  imageUrl?: string;
  tagline: string;
  aboutSecondParagraph: string;
  calloutText: string;
  statistics: string[];
  keyFeatures: string[];
  eligibility: string[];
  whatYoullNeed: string[];
  faqs: { q: string; a: string }[];
  comingSoon: boolean;
  gatedAccess: boolean;
  typeLabel: string;
  contactEmail: string;
  contactPhone: string;
  status?: "draft" | "published";
};

const SECTIONS = [
  { value: "citizen-services", label: "Citizen Services" },
  { value: "e-governance-projects", label: "e-Governance Projects" },
  { value: "services", label: "Services" },
];

export function ServiceForm({
  action,
  values,
  error,
}: {
  action: (formData: FormData) => void;
  values: ServiceFormValues;
  error?: string;
}) {
  return (
    <form action={action} className="flex max-w-[760px] flex-col gap-6">
      {error ? (
        <p className="type-body-sm rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}

      <section className="flex flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase text-[var(--color-muted)]">Card & basics</p>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Name</label>
          <input
            name="name"
            defaultValue={values.name}
            required
            maxLength={80}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Description <span className="normal-case text-[11px]">(card + About section opening paragraph — max 300 characters)</span>
          </label>
          <textarea
            name="description"
            defaultValue={values.description}
            required
            maxLength={300}
            rows={3}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Stats line <span className="normal-case text-[11px]">(separate figures with &quot; · &quot;, e.g. &quot;273 Services · 25,277 Centres&quot;)</span>
          </label>
          <input
            name="stats"
            defaultValue={values.stats}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Photo</label>
          {values.imageUrl ? (
            <div className="relative mb-2 h-32 w-52 overflow-hidden rounded-lg border border-hairline">
              <Image src={values.imageUrl} alt="" fill className="object-cover" />
            </div>
          ) : null}
          <input type="file" name="image" accept="image/*" className="type-body-sm block" />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Access Portal link <span className="normal-case text-[11px]">(leave blank for a department-facing Service routed to Reach Us; fill in — even just &quot;#&quot; as a placeholder — for a citizen-facing Project with its own Access Portal button)</span>
          </label>
          <input
            name="accessPortalHref"
            defaultValue={values.accessPortalHref}
            placeholder="https:// or # as a placeholder"
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Shown under</label>
          <div className="flex flex-col gap-1.5">
            {SECTIONS.map((s) => (
              <label key={s.value} className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" name="sections" value={s.value} defaultChecked={values.sections.includes(s.value)} />
                {s.label}
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase text-[var(--color-muted)]">Detail page content (optional)</p>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Tagline</label>
          <input
            name="tagline"
            defaultValue={values.tagline}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">About — second paragraph</label>
          <textarea
            name="aboutSecondParagraph"
            defaultValue={values.aboutSecondParagraph}
            rows={3}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Callout line</label>
          <input
            name="calloutText"
            defaultValue={values.calloutText}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">Statistics</label>
          <RepeatableRows
            name="statistics"
            fields={[{ key: "value", label: "e.g. 273 Government services" }]}
            initialRows={values.statistics.map((value) => ({ value }))}
            addLabel="+ Add statistic"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">Key features</label>
          <RepeatableRows
            name="keyFeatures"
            fields={[{ key: "value", label: "Feature" }]}
            initialRows={values.keyFeatures.map((value) => ({ value }))}
            addLabel="+ Add feature"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">Eligibility — &quot;you can use this if...&quot;</label>
          <RepeatableRows
            name="eligibility"
            fields={[{ key: "value", label: "Eligibility point" }]}
            initialRows={values.eligibility.map((value) => ({ value }))}
            addLabel="+ Add point"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">What you&apos;ll need</label>
          <RepeatableRows
            name="whatYoullNeed"
            fields={[{ key: "value", label: "Requirement" }]}
            initialRows={values.whatYoullNeed.map((value) => ({ value }))}
            addLabel="+ Add requirement"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">FAQs</label>
          <RepeatableRows
            name="faqs"
            fields={[
              { key: "q", label: "Question" },
              { key: "a", label: "Answer", textarea: true },
            ]}
            initialRows={values.faqs}
            addLabel="+ Add FAQ"
          />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="comingSoon" defaultChecked={values.comingSoon} />
            Coming soon
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="gatedAccess" defaultChecked={values.gatedAccess} />
            Access-gated (staff login)
          </label>
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Badge label override <span className="normal-case text-[11px]">(optional — leave blank to use the automatic Project/Service label)</span>
          </label>
          <select
            name="typeLabel"
            defaultValue={values.typeLabel}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          >
            <option value="">Automatic</option>
            <option value="Project">Project</option>
            <option value="Service">Service</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Contact email override</label>
            <input
              name="contactEmail"
              defaultValue={values.contactEmail}
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Contact phone override</label>
            <input
              name="contactPhone"
              defaultValue={values.contactPhone}
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
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
            confirmMessage="Unpublish this service? It will disappear from the live site."
            className="type-button btn-outline"
          >
            Unpublish
          </ConfirmSubmitButton>
        ) : (
          <ConfirmSubmitButton
            name="intent"
            value="publish"
            confirmMessage="Publish this service? It will go live on the public site immediately."
            className="type-button btn-primary"
          >
            Publish
          </ConfirmSubmitButton>
        )}
      </div>
    </form>
  );
}
