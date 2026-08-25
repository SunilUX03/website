"use client";

import { useRef, useState } from "react";
import { RepeatableRows } from "@/components/portal/RepeatableRows";
import { ImageUploadField } from "@/components/portal/ImageUploadField";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";
import { ErrorPopupModal } from "@/components/portal/ErrorPopupModal";

export type ProductTourSlotValue = { id?: string; photoId: string; photoUrl?: string; alt: string };

export type ServiceFormValues = {
  typeLabel: string;
  name: string;
  description: string;
  stats: string;
  accessPortalHref: string;
  sections: string[];
  imageUrl?: string;
  ctaLabel: string;
  comingSoon: boolean;
  gatedAccess: boolean;
  aboutHeading: string;
  tagline: string;
  aboutEyebrow: string;
  calloutText: string;
  aboutSecondParagraph: string;
  hideAboutSecondParagraph: boolean;
  statistics: { id?: string; value: string }[];
  aboutLinkModalLabel: string;
  aboutLinkModalTitle: string;
  aboutLinkModalItems: { id?: string; value: string }[];
  featuresEyebrow: string;
  featuresHeading: string;
  hideFeaturesSection: boolean;
  // `descId` is the paired keyFeatureDescriptions row's own id — a
  // separate underlying Payload array from keyFeatures itself, even
  // though this form edits both as one combined row per feature. See
  // RepeatableRows.tsx's `hidden` field type.
  keyFeatures: { id?: string; descId?: string; value: string; description: string }[];
  productTourHeading: string;
  hideProductTourSection: boolean;
  productTour: ProductTourSlotValue[];
  eligibilityEyebrow: string;
  eligibilityHeading: string;
  eligibilityWhoHeading: string;
  eligibilityDocsHeading: string;
  hideEligibilitySection: boolean;
  eligibility: { id?: string; value: string }[];
  whatYoullNeed: { id?: string; value: string }[];
  getStartedEyebrow: string;
  getStartedHeading: string;
  hideGetStartedSection: boolean;
  getStartedIntro: string;
  getStartedSteps: { id?: string; title: string; description: string }[];
  suppressGetStartedSteps: boolean;
  getStartedOutro: string;
  directLinkLabel: string;
  directLinkPortalLabel: string;
  faqEyebrow: string;
  faqHeading: string;
  hideFaqSection: boolean;
  faqs: { id?: string; q: string; a: string }[];
  faqsMore: { id?: string; q: string; a: string }[];
  contactEmail: string;
  contactPhone: string;
  status?: "draft" | "published";
  /** The document's `updatedAt` as of this page load — round-tripped
   * through a hidden field so the server action can detect a save based
   * on stale data (e.g. a locale tab left open since before someone
   * else's edit) and refuse it instead of silently overwriting. */
  updatedAt?: string;
};

const PRODUCT_TOUR_SLOTS = [0, 1, 2, 3];
const KEY_FEATURE_DESCRIPTION_MAX = 150;

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
  locale = "en",
}: {
  action: (formData: FormData) => void;
  values: ServiceFormValues;
  error?: string;
  /** Which locale this save writes to — set by the page from `?locale=`
   * and carried through as a hidden field the server action reads.
   * English and Tamil are edited as two independent passes over the same
   * form, not side-by-side fields, so there's nothing else to thread
   * through per-field. */
  locale?: "en" | "ta";
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const intentRef = useRef<HTMLInputElement>(null);
  const [changes, setChanges] = useState<Change[] | null>(null);
  const [popupErrors, setPopupErrors] = useState<string[] | null>(error ? [error] : null);

  function submitWithIntent(intent: "draft" | "publish" | "unpublish") {
    if (!formRef.current) return;
    const totalBytes = totalFileBytes(new FormData(formRef.current));
    if (totalBytes > MAX_TOTAL_UPLOAD_BYTES) {
      setPopupErrors([
        `The selected photos add up to ${(totalBytes / (1024 * 1024)).toFixed(1)}MB, which is over the ${MAX_TOTAL_UPLOAD_BYTES / (1024 * 1024)}MB combined limit for one save. Use smaller photos, or update the hero photo and product tour photos in separate saves.`,
      ]);
      return;
    }
    if (intentRef.current) intentRef.current.value = intent;
    formRef.current.requestSubmit();
  }

  // Only gates the FIRST publish of a service — once it's live, an editor
  // touching up one field (e.g. swapping the card photo) shouldn't get
  // blocked by an unrelated field like Tagline being empty. Blank
  // required-content on an already-published service is a separate,
  // deliberate edit an admin can still make; this isn't meant to police
  // that on every save. Collects every problem at once, rather than
  // stopping at the first, so one popup shows the whole list.
  function validateForPublish(fd: FormData): string[] {
    if (values.status === "published") return [];
    const hasRows = (name: string) => fd.has(`${name}.0.value`) || fd.has(`${name}.0.q`) || fd.has(`${name}.0.title`);
    const problems: string[] = [];
    if (!String(fd.get("typeLabel") ?? "").trim()) problems.push("Choose Project or Initiative before publishing.");
    if (!String(fd.get("tagline") ?? "").trim()) problems.push("Add a Tagline before publishing — it's the first thing visitors read.");
    if (!fd.get("hideFeaturesSection") && !hasRows("keyFeatures")) problems.push("Add at least one Key feature before publishing, or turn on \"Don't show this section\".");
    if (!fd.get("hideEligibilitySection") && !hasRows("eligibility")) problems.push("Add at least one Eligibility point before publishing, or turn on \"Don't show this section\".");
    if (!fd.get("hideFaqSection") && !hasRows("faqs")) problems.push("Add at least one FAQ before publishing, or turn on \"Don't show this section\".");
    return problems;
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
        list.push({ id: key, label, detail: `"${original || "(none)"}" → "${after || "(none)"}"`, sectionId, revert: () => setFieldValue(key, original) });
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

    select("typeLabel", "Badge", "section-badge", values.typeLabel);

    text("name", "Name", "section-hero", values.name);
    text("description", "Description", "section-hero", values.description);
    text("stats", "Stats line", "section-hero", values.stats);
    image("image", "Photo", "section-hero");

    text("accessPortalHref", "Button link", "section-button", values.accessPortalHref);
    text("ctaLabel", "Button text", "section-button", values.ctaLabel);

    text("aboutHeading", "About — section heading", "section-about", values.aboutHeading);
    text("tagline", "Tagline", "section-about", values.tagline);
    text("aboutEyebrow", "About — sub heading", "section-about", values.aboutEyebrow);
    text("calloutText", "Callout line", "section-about", values.calloutText);
    text("aboutSecondParagraph", "About — second paragraph", "section-about", values.aboutSecondParagraph);
    checkbox("hideAboutSecondParagraph", "Hide second paragraph", "section-about", values.hideAboutSecondParagraph);
    list_("statistics", ["value"], "Statistics", "section-about", values.statistics.map((r) => ({ value: r.value })));
    text("aboutLinkModalLabel", "About link — label", "section-about", values.aboutLinkModalLabel);
    text("aboutLinkModalTitle", "About link — modal title", "section-about", values.aboutLinkModalTitle);
    list_("aboutLinkModalItems", ["value"], "About link — items", "section-about", values.aboutLinkModalItems.map((r) => ({ value: r.value })));

    text("featuresEyebrow", "Key Features — eyebrow", "section-features", values.featuresEyebrow);
    text("featuresHeading", "Key Features — heading", "section-features", values.featuresHeading);
    checkbox("hideFeaturesSection", "Don't show Key Features section", "section-features", values.hideFeaturesSection);
    list_("keyFeatures", ["value", "description"], "Key features", "section-features", values.keyFeatures.map((r) => ({ value: r.value, description: r.description })));

    text("productTourHeading", "Product Tour — heading", "section-producttour", values.productTourHeading);
    checkbox("hideProductTourSection", "Don't show Product Tour section", "section-producttour", values.hideProductTourSection);
    for (const i of PRODUCT_TOUR_SLOTS) image(`productTour.${i}.photo`, `Product tour photo ${i + 1}`, "section-producttour");

    text("eligibilityEyebrow", "Eligibility — eyebrow", "section-eligibility", values.eligibilityEyebrow);
    text("eligibilityHeading", "Eligibility — heading", "section-eligibility", values.eligibilityHeading);
    text("eligibilityWhoHeading", "Eligibility — \"you can use this if\" heading", "section-eligibility", values.eligibilityWhoHeading);
    text("eligibilityDocsHeading", "Eligibility — \"what you'll need\" heading", "section-eligibility", values.eligibilityDocsHeading);
    checkbox("hideEligibilitySection", "Don't show Eligibility section", "section-eligibility", values.hideEligibilitySection);
    list_("eligibility", ["value"], "Eligibility", "section-eligibility", values.eligibility.map((r) => ({ value: r.value })));
    list_("whatYoullNeed", ["value"], "What you'll need", "section-eligibility", values.whatYoullNeed.map((r) => ({ value: r.value })));

    text("getStartedEyebrow", "Get Started — eyebrow", "section-getstarted", values.getStartedEyebrow);
    text("getStartedHeading", "Get Started — heading", "section-getstarted", values.getStartedHeading);
    checkbox("hideGetStartedSection", "Don't show Get Started section", "section-getstarted", values.hideGetStartedSection);
    text("getStartedIntro", "Get Started — intro", "section-getstarted", values.getStartedIntro);
    list_("getStartedSteps", ["title", "description"], "Get Started steps", "section-getstarted", values.getStartedSteps.map((r) => ({ title: r.title, description: r.description })));
    checkbox("suppressGetStartedSteps", "Hide Get Started steps", "section-getstarted", values.suppressGetStartedSteps);
    text("getStartedOutro", "Get Started — outro", "section-getstarted", values.getStartedOutro);
    text("directLinkLabel", "Direct-link button label", "section-getstarted", values.directLinkLabel);
    text("directLinkPortalLabel", "Direct-link portal name", "section-getstarted", values.directLinkPortalLabel);

    text("faqEyebrow", "FAQs — eyebrow", "section-faqs", values.faqEyebrow);
    text("faqHeading", "FAQs — heading", "section-faqs", values.faqHeading);
    checkbox("hideFaqSection", "Don't show FAQs section", "section-faqs", values.hideFaqSection);
    list_("faqs", ["q", "a"], "FAQs", "section-faqs", values.faqs.map((r) => ({ q: r.q, a: r.a })));
    list_("faqsMore", ["q", "a"], "Additional FAQs", "section-faqs", values.faqsMore.map((r) => ({ q: r.q, a: r.a })));

    text("contactEmail", "Contact email override", "section-contact", values.contactEmail);
    text("contactPhone", "Contact phone override", "section-contact", values.contactPhone);

    return list;
  }

  function handleUpdateClick() {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const problems = validateForPublish(fd);
    if (problems.length > 0) {
      setPopupErrors(problems);
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
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="_loadedUpdatedAt" value={values.updatedAt ?? ""} />

      <section id="section-badge" className="flex scroll-mt-6 flex-col gap-2 rounded-xl border border-hairline bg-surface-card p-5">
        <label className="type-caption-uppercase block text-[var(--color-muted)]">Badge</label>
        <select
          name="typeLabel"
          defaultValue={values.typeLabel}
          required
          className="w-full max-w-[280px] rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
        >
          <option value="" disabled>
            Choose one…
          </option>
          <option value="Project">Project</option>
          <option value="Initiative">Initiative</option>
        </select>
        <p className="type-caption text-[var(--color-muted)]">
          The tag shown at the top of this item&apos;s page. Every item is either a Project (has its own self-service portal) or an Initiative.
        </p>
      </section>

      <section id="section-hero" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase text-[var(--color-muted)]">Hero section</p>

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
            Description <span className="normal-case text-[11px]">(max 300 characters)</span>
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
      </section>

      <section id="section-button" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase text-[var(--color-muted)]">Button</p>

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
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Button link <span className="normal-case text-[11px]">(leave blank for a department-facing item routed to Reach Us; fill in — even just &quot;#&quot; as a placeholder — for a citizen-facing item with its own button)</span>
          </label>
          <input
            name="accessPortalHref"
            defaultValue={values.accessPortalHref}
            placeholder="https:// or # as a placeholder"
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
        <p className="type-caption -mt-2 text-[var(--color-muted)]">
          Without a Button text override, the button automatically reads &quot;Access Portal&quot; (has a Button link) or &quot;Avail Service&quot; (no link).
        </p>

        {/* Coming soon / Access-gated are no longer admin-editable toggles
            (per feedback they aren't needed), but a hidden hard-coded value
            would silently wipe e-Gazette Portal's live "Coming Soon" state
            on its next save — carry the existing value through instead. */}
        <input type="hidden" name="comingSoon" value={values.comingSoon ? "on" : ""} />
        <input type="hidden" name="gatedAccess" value={values.gatedAccess ? "on" : ""} />
      </section>

      <section id="section-about" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase text-[var(--color-muted)]">About the project</p>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Section heading <span className="normal-case text-[11px]">(defaults to &quot;What {"{name}"} does&quot;)</span>
          </label>
          <input
            name="aboutHeading"
            defaultValue={values.aboutHeading}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Tagline <span className="normal-case text-[11px]">(the line under this service&apos;s name at the top of its own detail page)</span>
          </label>
          <input
            name="tagline"
            defaultValue={values.tagline}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Sub heading <span className="normal-case text-[11px]">(small label above the section heading — defaults to &quot;About the Project/Initiative&quot;)</span>
          </label>
          <input
            name="aboutEyebrow"
            defaultValue={values.aboutEyebrow}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Callout line <span className="normal-case text-[11px]">(highlighted box next to the About text — good for a closing &quot;standout&quot; line; the box grows to fit whatever you write)</span>
          </label>
          <textarea
            name="calloutText"
            defaultValue={values.calloutText}
            rows={2}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-hairline p-3">
          <p className="type-caption-uppercase text-[var(--color-muted)]">Additional About content</p>

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
            <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">Statistics</label>
            <RepeatableRows
              name="statistics"
              fields={[{ key: "value", label: "e.g. 273 Government services" }]}
              initialRows={values.statistics}
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
                initialRows={values.aboutLinkModalItems}
                addLabel="+ Add item"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="section-features" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <div className="flex items-center justify-between">
          <p className="type-caption-uppercase text-[var(--color-muted)]">Key features</p>
          <label className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
            <input type="checkbox" name="hideFeaturesSection" defaultChecked={values.hideFeaturesSection} />
            Don&apos;t show this section on the page
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
              Section eyebrow <span className="normal-case text-[11px]">(defaults to &quot;Capabilities&quot;)</span>
            </label>
            <input
              name="featuresEyebrow"
              defaultValue={values.featuresEyebrow}
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
              Section heading <span className="normal-case text-[11px]">(defaults to &quot;Key Features&quot;)</span>
            </label>
            <input
              name="featuresHeading"
              defaultValue={values.featuresHeading}
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
        </div>
        <RepeatableRows
          name="keyFeatures"
          fields={[
            { key: "value", label: "Feature side heading" },
            { key: "description", label: `One-line description (optional, max ${KEY_FEATURE_DESCRIPTION_MAX} characters)`, maxLength: KEY_FEATURE_DESCRIPTION_MAX },
            { key: "descId", label: "", hidden: true },
          ]}
          initialRows={values.keyFeatures}
          addLabel="+ Add feature"
        />
      </section>

      <section id="section-producttour" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="type-caption-uppercase text-[var(--color-muted)]">Product tour</p>
            <p className="type-caption mt-1 text-[var(--color-muted)]">
              Real screenshots for the gallery on the detail page. Photo 1 is required; Photos 2–4 are optional. Leave all four empty to show generic stock photos instead.
            </p>
          </div>
          <label className="flex shrink-0 items-center gap-1.5 text-xs text-[var(--color-muted)]">
            <input type="checkbox" name="hideProductTourSection" defaultChecked={values.hideProductTourSection} />
            Don&apos;t show this section
          </label>
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            Heading name <span className="normal-case text-[11px]">(defaults to &quot;A look at {"{name}"}&quot;)</span>
          </label>
          <input
            name="productTourHeading"
            defaultValue={values.productTourHeading}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
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
                <input type="hidden" name={`productTour.${i}.id`} defaultValue={slot?.id ?? ""} />
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
      </section>

      <section id="section-eligibility" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <div className="flex items-center justify-between">
          <p className="type-caption-uppercase text-[var(--color-muted)]">Eligibility</p>
          <label className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
            <input type="checkbox" name="hideEligibilitySection" defaultChecked={values.hideEligibilitySection} />
            Don&apos;t show this section
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
              Section eyebrow <span className="normal-case text-[11px]">(defaults to &quot;Eligibility&quot;)</span>
            </label>
            <input
              name="eligibilityEyebrow"
              defaultValue={values.eligibilityEyebrow}
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
              Section heading <span className="normal-case text-[11px]">(defaults to &quot;Who can use this&quot;)</span>
            </label>
            <input
              name="eligibilityHeading"
              defaultValue={values.eligibilityHeading}
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            &quot;You can use this if&quot; heading <span className="normal-case text-[11px]">(defaults to &quot;You can use this if&quot;)</span>
          </label>
          <input
            name="eligibilityWhoHeading"
            defaultValue={values.eligibilityWhoHeading}
            className="mb-2 w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
          <RepeatableRows
            name="eligibility"
            fields={[{ key: "value", label: "Eligibility point" }]}
            initialRows={values.eligibility}
            addLabel="+ Add point"
          />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
            &quot;What you&apos;ll need&quot; heading <span className="normal-case text-[11px]">(defaults to &quot;What you&apos;ll need&quot;)</span>
          </label>
          <input
            name="eligibilityDocsHeading"
            defaultValue={values.eligibilityDocsHeading}
            className="mb-2 w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
          <RepeatableRows
            name="whatYoullNeed"
            fields={[{ key: "value", label: "Requirement" }]}
            initialRows={values.whatYoullNeed}
            addLabel="+ Add requirement"
          />
        </div>
      </section>

      <section id="section-getstarted" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="type-caption-uppercase text-[var(--color-muted)]">Get started</p>
            <p className="type-caption mt-1 text-[var(--color-muted)]">
              The numbered &quot;how to access&quot; steps on the detail page. Leave the steps list empty and check &quot;Hide steps&quot; for an intro/outro-only section with no numbers (e.g. when there&apos;s no self-service walkthrough to show).
            </p>
          </div>
          <label className="flex shrink-0 items-center gap-1.5 text-xs text-[var(--color-muted)]">
            <input type="checkbox" name="hideGetStartedSection" defaultChecked={values.hideGetStartedSection} />
            Don&apos;t show this section
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
              Section eyebrow <span className="normal-case text-[11px]">(defaults to &quot;Get started&quot;)</span>
            </label>
            <input
              name="getStartedEyebrow"
              defaultValue={values.getStartedEyebrow}
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
              Section heading <span className="normal-case text-[11px]">(defaults to &quot;How to access {"{name}"}&quot;)</span>
            </label>
            <input
              name="getStartedHeading"
              defaultValue={values.getStartedHeading}
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
              Direct-link button text <span className="normal-case text-[11px]">(Projects only. Defaults to &quot;Open&quot;.)</span>
            </label>
            <input
              name="directLinkLabel"
              defaultValue={values.directLinkLabel}
              placeholder="Open"
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
              Direct-link portal name <span className="normal-case text-[11px]">(defaults to &quot;{"{name}"} Portal&quot;)</span>
            </label>
            <input
              name="directLinkPortalLabel"
              defaultValue={values.directLinkPortalLabel}
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
        </div>
      </section>

      <section id="section-faqs" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <div className="flex items-center justify-between">
          <p className="type-caption-uppercase text-[var(--color-muted)]">FAQs</p>
          <label className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
            <input type="checkbox" name="hideFaqSection" defaultChecked={values.hideFaqSection} />
            Don&apos;t show this section
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
              Section eyebrow <span className="normal-case text-[11px]">(defaults to &quot;Questions&quot;)</span>
            </label>
            <input
              name="faqEyebrow"
              defaultValue={values.faqEyebrow}
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
              Section heading <span className="normal-case text-[11px]">(defaults to &quot;Frequently asked questions&quot;)</span>
            </label>
            <input
              name="faqHeading"
              defaultValue={values.faqHeading}
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
        </div>
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

      <div className="fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8">
        <button
          type="button"
          onClick={handleUpdateClick}
          className="type-button btn-primary !h-12 !px-6 shadow-[0_8px_24px_rgba(15,23,42,0.28)]"
        >
          Update
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

      {popupErrors ? <ErrorPopupModal errors={popupErrors} onClose={() => setPopupErrors(null)} /> : null}
    </form>
  );
}
