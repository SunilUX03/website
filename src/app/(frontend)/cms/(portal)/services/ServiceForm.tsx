"use client";

import { useRef, useState } from "react";
import { RepeatableRows } from "@/components/portal/RepeatableRows";
import { ImageUploadField } from "@/components/portal/ImageUploadField";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";

export type ProductTourSlotValue = { photoId: string; photoUrl?: string; alt: string };

export type ServiceFormValues = {
  name: string;
  description: string;
  stats: string;
  accessPortalHref: string;
  sections: string[];
  imageUrl?: string;
  tagline: string;
  aboutSecondParagraph: string;
  hideAboutSecondParagraph: boolean;
  calloutText: string;
  statistics: string[];
  keyFeatures: { value: string; description: string }[];
  hideStatFeatureCards: boolean;
  aboutLinkModalLabel: string;
  aboutLinkModalTitle: string;
  aboutLinkModalItems: string[];
  productTour: ProductTourSlotValue[];
  productTourCaption: string;
  eligibility: string[];
  whatYoullNeed: string[];
  getStartedIntro: string;
  getStartedSteps: { title: string; description: string }[];
  suppressGetStartedSteps: boolean;
  getStartedOutro: string;
  directLinkLabel: string;
  faqs: { q: string; a: string }[];
  faqsMore: { q: string; a: string }[];
  comingSoon: boolean;
  gatedAccess: boolean;
  ctaLabel: string;
  ctaHref: string;
  relatedCardStats: string;
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

const PRODUCT_TOUR_SLOTS = [0, 1, 2, 3];

// Vercel Functions hard-reject any request body over 4.5MB at the
// platform level — before this request even reaches the app — and this
// form can submit the hero photo plus up to 4 product-tour photos in one
// go, so per-field size limits alone aren't enough. Leave headroom under
// the 4.5MB ceiling for the rest of the form's text fields.
const MAX_TOTAL_UPLOAD_BYTES = 4 * 1024 * 1024;

function totalFileBytes(fd: FormData): number {
  let total = 0;
  for (const value of fd.values()) {
    if (value instanceof File) total += value.size;
  }
  return total;
}

function truncate(value: string, max = 60): string {
  const v = value.trim();
  return v.length > max ? `${v.slice(0, max)}…` : v;
}

function arraysEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function ServiceForm({
  action,
  values,
  error,
}: {
  action: (formData: FormData) => void;
  values: ServiceFormValues;
  error?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const intentRef = useRef<HTMLInputElement>(null);
  const [changes, setChanges] = useState<Change[] | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  function submitWithIntent(intent: "draft" | "publish" | "unpublish") {
    setValidationError(null);
    if (!formRef.current) return;
    const totalBytes = totalFileBytes(new FormData(formRef.current));
    if (totalBytes > MAX_TOTAL_UPLOAD_BYTES) {
      setValidationError(
        `The selected photos add up to ${(totalBytes / (1024 * 1024)).toFixed(1)}MB, which is over the ${MAX_TOTAL_UPLOAD_BYTES / (1024 * 1024)}MB combined limit for one save. Use smaller photos, or update the hero photo and product tour photos in separate saves.`
      );
      return;
    }
    if (intentRef.current) intentRef.current.value = intent;
    formRef.current.requestSubmit();
  }

  function validateForPublish(fd: FormData): string | null {
    const hasRows = (name: string) => fd.has(`${name}.0.value`) || fd.has(`${name}.0.q`) || fd.has(`${name}.0.title`);
    if (!String(fd.get("tagline") ?? "").trim()) return "Add a Tagline before publishing — it's the first thing visitors read.";
    if (!hasRows("keyFeatures")) return "Add at least one Key feature before publishing.";
    if (!hasRows("eligibility")) return "Add at least one Eligibility point before publishing.";
    if (!hasRows("faqs")) return "Add at least one FAQ before publishing.";
    return null;
  }

  function computeChanges(fd: FormData): Change[] {
    const list: Change[] = [];

    const text = (key: string, label: string, sectionId: string, original: string) => {
      const after = String(fd.get(key) ?? "").trim();
      if (after !== (original ?? "")) {
        list.push({ id: key, label, detail: `"${truncate(original) || "(empty)"}" → "${truncate(after) || "(empty)"}"`, sectionId, revert: () => setFieldValue(key, original) });
      }
    };
    const checkbox = (key: string, label: string, sectionId: string, original: boolean) => {
      const after = fd.get(key) === "on";
      if (after !== original) {
        list.push({ id: key, label, detail: after ? "Turned on" : "Turned off", sectionId, revert: () => setCheckboxValue(key, original) });
      }
    };
    const select = (key: string, label: string, sectionId: string, original: string) => {
      const after = String(fd.get(key) ?? "");
      if (after !== (original ?? "")) {
        list.push({ id: key, label, detail: `"${original || "Automatic"}" → "${after || "Automatic"}"`, sectionId, revert: () => setFieldValue(key, original) });
      }
    };
    const setFieldValue = (key: string, value: string) => {
      const el = formRef.current?.elements.namedItem(key);
      if (el && "value" in el) (el as unknown as HTMLInputElement).value = value;
    };
    const setCheckboxValue = (key: string, value: boolean) => {
      const el = formRef.current?.elements.namedItem(key);
      if (el && "checked" in el) (el as unknown as HTMLInputElement).checked = value;
    };
    const reconstructRows = (name: string, keys: string[]) => {
      const rows: Record<string, string>[] = [];
      for (let i = 0; ; i++) {
        const first = `${name}.${i}.${keys[0]}`;
        if (!fd.has(first)) break;
        const row: Record<string, string> = {};
        for (const k of keys) row[k] = String(fd.get(`${name}.${i}.${k}`) ?? "").trim();
        if (Object.values(row).some(Boolean)) rows.push(row);
      }
      return rows;
    };
    const list_ = (name: string, keys: string[], label: string, sectionId: string, original: unknown) => {
      const after = reconstructRows(name, keys);
      if (!arraysEqual(after, original)) {
        list.push({ id: name, label, detail: `${(original as unknown[]).length} → ${after.length} item${after.length === 1 ? "" : "s"}`, sectionId });
      }
    };
    const image = (name: string, label: string, sectionId: string) => {
      const file = fd.get(name) as File | null;
      if (file && file.size > 0) {
        list.push({ id: name, label, detail: `New photo selected (${file.name})`, sectionId });
      }
    };

    text("name", "Name", "section-basics", values.name);
    text("description", "Description", "section-basics", values.description);
    text("stats", "Stats line", "section-basics", values.stats);
    text("accessPortalHref", "Access Portal link", "section-basics", values.accessPortalHref);
    image("image", "Photo", "section-basics");
    const sectionsAfter = fd.getAll("sections").map(String).sort();
    const sectionsBefore = [...values.sections].sort();
    if (!arraysEqual(sectionsAfter, sectionsBefore)) {
      list.push({ id: "sections", label: "Shown under", detail: `${sectionsAfter.length} section${sectionsAfter.length === 1 ? "" : "s"} selected`, sectionId: "section-basics" });
    }

    text("tagline", "Tagline", "section-about", values.tagline);
    text("aboutSecondParagraph", "About — second paragraph", "section-about", values.aboutSecondParagraph);
    checkbox("hideAboutSecondParagraph", "Hide second paragraph", "section-about", values.hideAboutSecondParagraph);
    text("calloutText", "Callout line", "section-about", values.calloutText);
    list_("statistics", ["value"], "Statistics", "section-about", values.statistics.map((value) => ({ value })));
    text("aboutLinkModalLabel", "About link — label", "section-about", values.aboutLinkModalLabel);
    text("aboutLinkModalTitle", "About link — modal title", "section-about", values.aboutLinkModalTitle);
    list_("aboutLinkModalItems", ["value"], "About link — items", "section-about", values.aboutLinkModalItems.map((value) => ({ value })));

    list_("keyFeatures", ["value", "description"], "Key features", "section-features", values.keyFeatures);
    checkbox("hideStatFeatureCards", "Hide statistic cards", "section-features", values.hideStatFeatureCards);

    for (const i of PRODUCT_TOUR_SLOTS) image(`productTour.${i}.photo`, `Product tour photo ${i + 1}`, "section-producttour");
    text("productTourCaption", "Product tour caption", "section-producttour", values.productTourCaption);

    list_("eligibility", ["value"], "Eligibility", "section-eligibility", values.eligibility.map((value) => ({ value })));
    list_("whatYoullNeed", ["value"], "What you'll need", "section-eligibility", values.whatYoullNeed.map((value) => ({ value })));

    text("getStartedIntro", "Get Started — intro", "section-getstarted", values.getStartedIntro);
    list_("getStartedSteps", ["title", "description"], "Get Started steps", "section-getstarted", values.getStartedSteps);
    checkbox("suppressGetStartedSteps", "Hide Get Started steps", "section-getstarted", values.suppressGetStartedSteps);
    text("getStartedOutro", "Get Started — outro", "section-getstarted", values.getStartedOutro);
    text("directLinkLabel", "Direct-link button label", "section-getstarted", values.directLinkLabel);

    list_("faqs", ["q", "a"], "FAQs", "section-faqs", values.faqs);
    list_("faqsMore", ["q", "a"], "Additional FAQs", "section-faqs", values.faqsMore);

    checkbox("comingSoon", "Coming soon", "section-cta", values.comingSoon);
    checkbox("gatedAccess", "Access-gated", "section-cta", values.gatedAccess);
    text("ctaLabel", "Button text", "section-cta", values.ctaLabel);
    text("ctaHref", "Button link", "section-cta", values.ctaHref);
    text("relatedCardStats", "Related-card stats override", "section-cta", values.relatedCardStats);
    select("typeLabel", "Badge label", "section-cta", values.typeLabel);

    text("contactEmail", "Contact email override", "section-contact", values.contactEmail);
    text("contactPhone", "Contact phone override", "section-contact", values.contactPhone);

    return list;
  }

  function handleUpdateClick() {
    setValidationError(null);
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const problem = validateForPublish(fd);
    if (problem) {
      setValidationError(problem);
      return;
    }
    const detected = computeChanges(fd);
    if (detected.length === 0) {
      submitWithIntent("publish");
      return;
    }
    setChanges(detected);
  }

  function scrollToSection(sectionId: string) {
    setChanges(null);
    requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <form ref={formRef} action={action} className="flex max-w-[760px] flex-col gap-6">
      <input ref={intentRef} type="hidden" name="intent" defaultValue="draft" />

      {error ? (
        <p className="type-body-sm rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}
      {validationError ? (
        <p className="type-body-sm rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {validationError}
        </p>
      ) : null}

      <section id="section-basics" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
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
          <ImageUploadField name="image" currentUrl={values.imageUrl} idealSize="1200 × 800px" required />
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

      <section id="section-about" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <div>
          <p className="type-caption-uppercase text-[var(--color-muted)]">About & hero</p>
          <p className="type-caption mt-1 text-[var(--color-muted)]">
            This is the real detail-page content — fill it in with the actual submitted copy before publishing.
          </p>
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Tagline</label>
          <input
            name="tagline"
            defaultValue={values.tagline}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="type-caption-uppercase block text-[var(--color-muted)]">About — second paragraph</label>
            <label className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
              <input type="checkbox" name="hideAboutSecondParagraph" defaultChecked={values.hideAboutSecondParagraph} />
              Hide this paragraph
            </label>
          </div>
          <textarea
            name="aboutSecondParagraph"
            defaultValue={values.aboutSecondParagraph}
            rows={3}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Callout line <span className="normal-case text-[11px]">(highlighted box next to the About text — good for a closing &quot;standout&quot; line)</span>
          </label>
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

        <div className="rounded-lg border border-hairline p-3">
          <p className="type-caption-uppercase mb-2 text-[var(--color-muted)]">
            About link (optional) <span className="normal-case text-[11px]">— a text link in the About section that opens a popup listing items, e.g. a schemes list</span>
          </p>
          <div className="grid grid-cols-2 gap-3">
            <input
              name="aboutLinkModalLabel"
              defaultValue={values.aboutLinkModalLabel}
              placeholder="Link text, e.g. 50+ schemes covered"
              className="rounded-lg border border-hairline-strong bg-canvas px-3 py-2 text-sm outline-none focus:border-[var(--color-primary-blue)]"
            />
            <input
              name="aboutLinkModalTitle"
              defaultValue={values.aboutLinkModalTitle}
              placeholder="Popup title"
              className="rounded-lg border border-hairline-strong bg-canvas px-3 py-2 text-sm outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div className="mt-3">
            <RepeatableRows
              name="aboutLinkModalItems"
              fields={[{ key: "value", label: "List item" }]}
              initialRows={values.aboutLinkModalItems.map((value) => ({ value }))}
              addLabel="+ Add item"
            />
          </div>
        </div>
      </section>

      <section id="section-features" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <div className="flex items-center justify-between">
          <p className="type-caption-uppercase text-[var(--color-muted)]">Key features</p>
          <label className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
            <input type="checkbox" name="hideStatFeatureCards" defaultChecked={values.hideStatFeatureCards} />
            Don&apos;t also show Statistics as feature cards
          </label>
        </div>
        <RepeatableRows
          name="keyFeatures"
          fields={[
            { key: "value", label: "Feature title" },
            { key: "description", label: "One-line description (optional)" },
          ]}
          initialRows={values.keyFeatures}
          addLabel="+ Add feature"
        />
      </section>

      <section id="section-producttour" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <div>
          <p className="type-caption-uppercase text-[var(--color-muted)]">Product tour</p>
          <p className="type-caption mt-1 text-[var(--color-muted)]">
            Real screenshots for the gallery on the detail page. Photo 1 is required; Photos 2–4 are optional. Leave all four empty to show generic stock photos instead.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PRODUCT_TOUR_SLOTS.map((i) => {
            const slot = values.productTour[i];
            return (
              <div key={i} className="flex flex-col gap-2 rounded-lg border border-hairline p-3">
                <p className="type-caption font-semibold text-ink">
                  Photo {i + 1} {i === 0 ? <span className="text-[var(--color-error)]">*</span> : <span className="font-normal text-[var(--color-muted)]">(optional)</span>}
                </p>
                <ImageUploadField
                  name={`productTour.${i}.photo`}
                  currentUrl={slot?.photoUrl}
                  idealSize="1600 × 800px"
                  required={i === 0}
                  aspect="h-28 w-full"
                />
                <input type="hidden" name={`productTour.${i}.photoId`} defaultValue={slot?.photoId ?? ""} />
                <input
                  name={`productTour.${i}.alt`}
                  defaultValue={slot?.alt ?? ""}
                  placeholder="Describe this photo (for accessibility)"
                  className="rounded-md border border-hairline-strong bg-canvas px-2.5 py-1.5 text-sm outline-none focus:border-[var(--color-primary-blue)]"
                />
              </div>
            );
          })}
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Caption shown under the gallery</label>
          <input
            name="productTourCaption"
            defaultValue={values.productTourCaption}
            placeholder="e.g. See how citizens start a request"
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
      </section>

      <section id="section-eligibility" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase text-[var(--color-muted)]">Eligibility</p>
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
      </section>

      <section id="section-getstarted" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <div>
          <p className="type-caption-uppercase text-[var(--color-muted)]">Get started</p>
          <p className="type-caption mt-1 text-[var(--color-muted)]">
            The numbered &quot;how to access&quot; steps on the detail page. Leave the steps list empty and check &quot;Hide steps&quot; for an intro/outro-only section with no numbers (e.g. when there&apos;s no self-service walkthrough to show).
          </p>
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Intro line (optional, shown above the steps)</label>
          <textarea
            name="getStartedIntro"
            defaultValue={values.getStartedIntro}
            rows={2}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="type-caption-uppercase block text-[var(--color-muted)]">Steps</label>
            <label className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
              <input type="checkbox" name="suppressGetStartedSteps" defaultChecked={values.suppressGetStartedSteps} />
              Hide steps (intro/outro only)
            </label>
          </div>
          <RepeatableRows
            name="getStartedSteps"
            fields={[
              { key: "title", label: "Step title" },
              { key: "description", label: "Step description", textarea: true },
            ]}
            initialRows={values.getStartedSteps}
            addLabel="+ Add step"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Outro line (optional, shown below the steps)</label>
          <textarea
            name="getStartedOutro"
            defaultValue={values.getStartedOutro}
            rows={2}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Direct-link button label <span className="normal-case text-[11px]">(Projects only — the small button next to the portal name in the Get Started card. Defaults to &quot;Open&quot;.)</span>
          </label>
          <input
            name="directLinkLabel"
            defaultValue={values.directLinkLabel}
            placeholder="Open"
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
      </section>

      <section id="section-faqs" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase text-[var(--color-muted)]">FAQs</p>
        <div>
          <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">Shown by default</label>
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
        <div>
          <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">
            Additional FAQs <span className="normal-case text-[11px]">(hidden behind a &quot;View more&quot; toggle)</span>
          </label>
          <RepeatableRows
            name="faqsMore"
            fields={[
              { key: "q", label: "Question" },
              { key: "a", label: "Answer", textarea: true },
            ]}
            initialRows={values.faqsMore}
            addLabel="+ Add FAQ"
          />
        </div>
      </section>

      <section id="section-cta" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase text-[var(--color-muted)]">Button & badge</p>

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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
              Button text <span className="normal-case text-[11px]">(optional override, e.g. &quot;Register Now&quot;)</span>
            </label>
            <input
              name="ctaLabel"
              defaultValue={values.ctaLabel}
              placeholder="Leave blank for the automatic label"
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Button link</label>
            <input
              name="ctaHref"
              defaultValue={values.ctaHref}
              placeholder="Leave blank to reuse Access Portal link"
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
        </div>
        <p className="type-caption -mt-2 text-[var(--color-muted)]">
          Without a Button text override, the button automatically reads &quot;Access Portal&quot; (has an Access Portal link), &quot;Avail Service&quot; (no link, or Access-gated is checked), or &quot;Coming Soon&quot; (Coming soon is checked).
        </p>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Related-card stats override <span className="normal-case text-[11px]">(optional — the short line shown on cards for this item elsewhere on the site, if it should read differently from the Stats line above)</span>
          </label>
          <input
            name="relatedCardStats"
            defaultValue={values.relatedCardStats}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Badge label</label>
          <select
            name="typeLabel"
            defaultValue={values.typeLabel}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          >
            <option value="">Automatic (based on Access Portal link)</option>
            <option value="Project">Always show &quot;Project&quot;</option>
            <option value="Service">Always show &quot;Service&quot;</option>
          </select>
          <p className="type-caption mt-1.5 text-[var(--color-muted)]">
            This is the small tag shown at the top of the page (e.g. &quot;Project&quot; or &quot;Service&quot;) so visitors know what kind of listing it is. It&apos;s set automatically from whether Access Portal link is filled in above —
            only choose a value here if you want the badge to say something different from that automatic behavior (e.g. a page with a real portal link that should still say &quot;Service&quot;).
          </p>
        </div>
      </section>

      <section id="section-contact" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase text-[var(--color-muted)]">Contact overrides</p>
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
        <button type="button" onClick={() => submitWithIntent("draft")} className="type-button btn-outline">
          Save draft
        </button>
        {values.status === "published" ? (
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Unpublish this service? It will disappear from the live site.")) submitWithIntent("unpublish");
            }}
            className="type-button btn-outline"
          >
            Unpublish
          </button>
        ) : null}
        <button type="button" onClick={handleUpdateClick} className="type-button btn-primary">
          {values.status === "published" ? "Update" : "Publish"}
        </button>
      </div>

      {changes ? (
        <UpdateReviewModal
          changes={changes}
          onEdit={scrollToSection}
          onDiscard={(id) => {
            const change = changes.find((c) => c.id === id);
            change?.revert?.();
            setChanges((prev) => prev?.filter((c) => c.id !== id) ?? null);
          }}
          onCancel={() => setChanges(null)}
          onConfirm={() => {
            setChanges(null);
            submitWithIntent("publish");
          }}
        />
      ) : null}
    </form>
  );
}
