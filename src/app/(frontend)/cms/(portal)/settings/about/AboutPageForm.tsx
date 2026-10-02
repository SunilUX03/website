"use client";

import { useRef, useState } from "react";
import { RepeatableRows } from "@/components/portal/RepeatableRows";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";

export type AboutPageFormValues = {
  heroEyebrow: string;
  heroHeadline: string;
  heroDescription: string;
  whoWeAreHeading: string;
  whoWeAreParagraph: string;
  hierarchy: { id?: string; label: string; emphasized: string }[];
  visionMission: { id?: string; label: string; title: string; description: string }[];
  connectEmail: string;
  connectSocial: { id?: string; label: string; href: string }[];
  orgChartEyebrow: string;
  orgChartHeading: string;
  leadershipEyebrow: string;
  leadershipHeading: string;
  boardEyebrow: string;
  boardHeading: string;
  awardsEyebrow: string;
  awardsHeading: string;
  rollOfHonourEyebrow: string;
  rollOfHonourHeading: string;
  status?: "draft" | "published";
  /** The document's `updatedAt` as of this page load — round-tripped
   * through a hidden field so the server action can detect a save based
   * on stale data (e.g. a locale tab left open since before someone
   * else's edit) and refuse it instead of silently overwriting. */
  updatedAt?: string;
};

function truncate(value: string, max = 60): string {
  const v = value.trim();
  return v.length > max ? `${v.slice(0, max)}…` : v;
}

function reconstructRows(fd: FormData, name: string, keys: string[]): Record<string, string>[] {
  const rows: Record<string, string>[] = [];
  for (let i = 0; ; i++) {
    const first = `${name}.${i}.${keys[0]}`;
    if (!fd.has(first)) break;
    const row: Record<string, string> = {};
    for (const k of keys) row[k] = String(fd.get(`${name}.${i}.${k}`) ?? "").trim();
    if (Object.values(row).some(Boolean)) rows.push(row);
  }
  return rows;
}

export function AboutPageForm({
  action,
  values,
  locale = "en",
}: {
  action: (formData: FormData) => void;
  values: AboutPageFormValues;
  /** Which locale this save writes to — set by the page from `?locale=`
   * and carried through as a hidden field the server action reads.
   * connectWithUs (email + social links) is non-localized, so its fields
   * are only rendered — and only submitted — on the English tab. */
  locale?: "en" | "ta";
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const intentRef = useRef<HTMLInputElement>(null);
  const [changes, setChanges] = useState<Change[] | null>(null);

  function submitWithIntent(intent: "draft" | "publish" | "unpublish") {
    if (intentRef.current) intentRef.current.value = intent;
    formRef.current?.requestSubmit();
  }

  function computeChanges(fd: FormData): Change[] {
    const list: Change[] = [];
    const text = (key: string, label: string, original: string, sectionId: string) => {
      const after = String(fd.get(key) ?? "").trim();
      if (after !== (original ?? "")) {
        list.push({ id: key, label, detail: `"${truncate(original) || "(empty)"}" → "${truncate(after) || "(empty)"}"`, sectionId });
      }
    };
    const rows = (name: string, keys: string[], label: string, original: unknown[], sectionId: string) => {
      const after = reconstructRows(fd, name, keys);
      if (JSON.stringify(after) !== JSON.stringify(original)) {
        list.push({ id: name, label, detail: `${original.length} → ${after.length} item${after.length === 1 ? "" : "s"}`, sectionId });
      }
    };

    text("heroEyebrow", "Hero eyebrow", values.heroEyebrow, "section-hero");
    text("heroHeadline", "Hero headline", values.heroHeadline, "section-hero");
    text("heroDescription", "Hero description", values.heroDescription, "section-hero");
    text("whoWeAreHeading", "Who We Are heading", values.whoWeAreHeading, "section-who");
    text("whoWeAreParagraph", "Who We Are paragraph", values.whoWeAreParagraph, "section-who");
    // A checked checkbox submits as "on", not the "true"/"false" string
    // `values.hierarchy` stores its initial state as — reconstructRows()
    // can't tell "emphasized" apart from a plain text field, so it's
    // normalized here before comparing, otherwise this would always
    // read as changed (and the review modal would show an incorrect
    // diff) regardless of whether the checkbox actually moved.
    const hierarchyAfter = reconstructRows(fd, "hierarchy", ["label", "emphasized"]).map((r) => ({
      label: r.label,
      emphasized: r.emphasized === "on" ? "true" : "false",
    }));
    const hierarchyBefore = values.hierarchy.map((r) => ({ label: r.label, emphasized: r.emphasized }));
    if (JSON.stringify(hierarchyAfter) !== JSON.stringify(hierarchyBefore)) {
      list.push({
        id: "hierarchy",
        label: "Reporting-line boxes",
        detail: `${hierarchyBefore.length} → ${hierarchyAfter.length} item${hierarchyAfter.length === 1 ? "" : "s"}`,
        sectionId: "section-hierarchy",
      });
    }
    rows("visionMission", ["label", "title", "description"], "Vision & Mission", values.visionMission.map((r) => ({ label: r.label, title: r.title, description: r.description })), "section-vision");
    if (locale === "en") {
      text("connectEmail", "Connect email", values.connectEmail, "section-connect");
      rows("connectSocial", ["label", "href"], "Social links", values.connectSocial.map((r) => ({ label: r.label, href: r.href })), "section-connect");
    }
    text("orgChartEyebrow", "Organisation Structure eyebrow", values.orgChartEyebrow, "section-headings");
    text("orgChartHeading", "Organisation Structure heading", values.orgChartHeading, "section-headings");
    text("leadershipEyebrow", "Leadership & Team eyebrow", values.leadershipEyebrow, "section-headings");
    text("leadershipHeading", "Leadership & Team heading", values.leadershipHeading, "section-headings");
    text("boardEyebrow", "Governing Board eyebrow", values.boardEyebrow, "section-headings");
    text("boardHeading", "Governing Board heading", values.boardHeading, "section-headings");
    text("awardsEyebrow", "Awards & Recognition eyebrow", values.awardsEyebrow, "section-headings");
    text("awardsHeading", "Awards & Recognition heading", values.awardsHeading, "section-headings");
    text("rollOfHonourEyebrow", "Roll of Honour eyebrow", values.rollOfHonourEyebrow, "section-headings");
    text("rollOfHonourHeading", "Roll of Honour heading", values.rollOfHonourHeading, "section-headings");
    return list;
  }

  function handleUpdateClick() {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const detected = computeChanges(fd);
    if (detected.length === 0) {
      submitWithIntent("publish");
      return;
    }
    setChanges(detected);
  }

  return (
    <form ref={formRef} action={action} className="flex max-w-[680px] flex-col gap-6">
      <input ref={intentRef} type="hidden" name="intent" defaultValue="draft" />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="_loadedUpdatedAt" value={values.updatedAt ?? ""} />

      <section id="section-hero" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase text-[var(--color-muted)]">Hero</p>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Eyebrow</label>
          <input
            name="heroEyebrow"
            defaultValue={values.heroEyebrow}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Headline</label>
          <input
            name="heroHeadline"
            defaultValue={values.heroHeadline}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Description</label>
          <textarea
            name="heroDescription"
            defaultValue={values.heroDescription}
            required
            rows={4}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
      </section>

      <section id="section-who" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase text-[var(--color-muted)]">Who We Are</p>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Heading</label>
          <input
            name="whoWeAreHeading"
            defaultValue={values.whoWeAreHeading}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Paragraph</label>
          <textarea
            name="whoWeAreParagraph"
            defaultValue={values.whoWeAreParagraph}
            required
            rows={4}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
      </section>

      <section id="section-hierarchy" className="scroll-mt-6 rounded-xl border border-hairline bg-surface-card p-5">
        <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">
          Reporting-line boxes <span className="normal-case text-[11px]">(top to bottom; check &quot;Emphasized&quot; to highlight TNeGA itself)</span>
        </label>
        <RepeatableRows
          name="hierarchy"
          fields={[
            { key: "label", label: "Label" },
            { key: "emphasized", label: "Emphasized", checkbox: true },
          ]}
          initialRows={values.hierarchy}
          addLabel="+ Add box"
        />
      </section>

      <section id="section-vision" className="scroll-mt-6 rounded-xl border border-hairline bg-surface-card p-5">
        <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">
          Vision &amp; Mission <span className="normal-case text-[11px]">(normally exactly two cards)</span>
        </label>
        <RepeatableRows
          name="visionMission"
          fields={[
            { key: "label", label: "Label (e.g. Vision)" },
            { key: "title", label: "Title" },
            { key: "description", label: "Description", textarea: true },
          ]}
          initialRows={values.visionMission}
          addLabel="+ Add card"
        />
      </section>

      {locale === "en" ? (
        <section id="section-connect" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
          <p className="type-caption-uppercase text-[var(--color-muted)]">Connect With Us</p>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Email</label>
            <input
              name="connectEmail"
              type="email"
              defaultValue={values.connectEmail}
              required
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-2 block text-[var(--color-muted)]">Social links</label>
            <RepeatableRows
              name="connectSocial"
              fields={[
                { key: "label", label: "Label (e.g. Facebook)" },
                { key: "href", label: "URL" },
              ]}
              initialRows={values.connectSocial}
              addLabel="+ Add social link"
            />
          </div>
        </section>
      ) : (
        <section id="section-connect" className="scroll-mt-6 rounded-xl border border-hairline bg-surface-card p-5">
          <p className="type-caption-uppercase text-[var(--color-muted)]">Connect With Us</p>
          <p className="type-caption mt-1 text-[var(--color-muted)]">
            Email and social links aren&apos;t translated — switch to the English tab to edit them.
          </p>
        </section>
      )}

      <section id="section-headings" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase text-[var(--color-muted)]">
          Other section headings <span className="normal-case text-[11px]">(the content in each section is edited elsewhere — see the sidebar)</span>
        </p>
        {[
          { label: "Organisation Structure", eyebrowKey: "orgChartEyebrow", headingKey: "orgChartHeading", eyebrow: values.orgChartEyebrow, heading: values.orgChartHeading },
          { label: "Leadership & Team", eyebrowKey: "leadershipEyebrow", headingKey: "leadershipHeading", eyebrow: values.leadershipEyebrow, heading: values.leadershipHeading },
          { label: "Governing Board", eyebrowKey: "boardEyebrow", headingKey: "boardHeading", eyebrow: values.boardEyebrow, heading: values.boardHeading },
          { label: "Awards & Recognition", eyebrowKey: "awardsEyebrow", headingKey: "awardsHeading", eyebrow: values.awardsEyebrow, heading: values.awardsHeading },
          { label: "Roll of Honour", eyebrowKey: "rollOfHonourEyebrow", headingKey: "rollOfHonourHeading", eyebrow: values.rollOfHonourEyebrow, heading: values.rollOfHonourHeading },
        ].map((s) => (
          <div key={s.eyebrowKey} className="grid grid-cols-2 gap-3 border-t border-hairline pt-4 first:border-t-0 first:pt-0">
            <div className="col-span-2">
              <p className="type-caption font-semibold text-ink">{s.label}</p>
            </div>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Eyebrow</label>
              <input
                name={s.eyebrowKey}
                defaultValue={s.eyebrow}
                required
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
              />
            </div>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Heading</label>
              <input
                name={s.headingKey}
                defaultValue={s.heading}
                required
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
              />
            </div>
          </div>
        ))}
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
          onEdit={() => setChanges(null)}
          onDiscard={(id) => setChanges((prev) => prev?.filter((c) => c.id !== id) ?? null)}
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
