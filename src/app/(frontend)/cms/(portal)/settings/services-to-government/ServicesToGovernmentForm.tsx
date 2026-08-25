"use client";

import { useRef, useState } from "react";
import { RepeatableRows } from "@/components/portal/RepeatableRows";
import { UpdateReviewModal, type Change } from "@/components/portal/UpdateReviewModal";

export type ServiceValue = { id?: string; name: string; description: string };
export type DepartmentContactValue = { id?: string; department: string; contact: string; email: string; phone: string };

export type ServicesToGovernmentFormValues = {
  heroEyebrow: string;
  heroHeading: string;
  heroBody: string;
  services: ServiceValue[];
  tableIntroEyebrow: string;
  tableIntroHeading: string;
  tableIntroBody: string;
  tableHeaderSerialNumber: string;
  tableHeaderDepartment: string;
  tableHeaderContact: string;
  tableHeaderEmail: string;
  tableHeaderPhone: string;
  raiseTicketLabel: string;
  raiseTicketHref: string;
  departmentContacts: DepartmentContactValue[];
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

export function ServicesToGovernmentForm({
  action,
  values,
  locale = "en",
}: {
  action: (formData: FormData) => void;
  values: ServicesToGovernmentFormValues;
  /** Which locale this save writes to — set by the page from `?locale=`
   * and carried through as a hidden field the server action reads. */
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
    text("heroEyebrow", "Hero eyebrow", values.heroEyebrow, "section-hero");
    text("heroHeading", "Hero heading", values.heroHeading, "section-hero");
    text("heroBody", "Hero body", values.heroBody, "section-hero");

    const servicesAfter = reconstructRows(fd, "services", ["name", "description"]);
    const servicesBefore = values.services.map((s) => ({ name: s.name, description: s.description }));
    if (JSON.stringify(servicesAfter) !== JSON.stringify(servicesBefore)) {
      list.push({
        id: "services",
        label: "Services",
        detail: `${values.services.length} → ${servicesAfter.length} service${servicesAfter.length === 1 ? "" : "s"}`,
        sectionId: "section-services",
      });
    }

    text("tableIntroEyebrow", "Table eyebrow", values.tableIntroEyebrow, "section-table");
    text("tableIntroHeading", "Table heading", values.tableIntroHeading, "section-table");
    text("tableIntroBody", "Table body", values.tableIntroBody, "section-table");
    text("tableHeaderSerialNumber", "Column heading — S.No", values.tableHeaderSerialNumber, "section-table");
    text("tableHeaderDepartment", "Column heading — Department", values.tableHeaderDepartment, "section-table");
    text("tableHeaderContact", "Column heading — Contact", values.tableHeaderContact, "section-table");
    text("tableHeaderEmail", "Column heading — Email", values.tableHeaderEmail, "section-table");
    text("tableHeaderPhone", "Column heading — Phone", values.tableHeaderPhone, "section-table");
    text("raiseTicketLabel", "Raise a Ticket label", values.raiseTicketLabel, "section-table");
    text("raiseTicketHref", "Raise a Ticket link", values.raiseTicketHref, "section-table");

    const contactsAfter = reconstructRows(fd, "departmentContacts", ["department", "contact", "email", "phone"]);
    const contactsBefore = values.departmentContacts.map((d) => ({
      department: d.department,
      contact: d.contact,
      email: d.email,
      phone: d.phone,
    }));
    if (JSON.stringify(contactsAfter) !== JSON.stringify(contactsBefore)) {
      list.push({
        id: "departmentContacts",
        label: "Department contacts",
        detail: `${values.departmentContacts.length} → ${contactsAfter.length} department${contactsAfter.length === 1 ? "" : "s"}`,
        sectionId: "section-department-contacts",
      });
    }

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

      <section id="section-hero" className="flex scroll-mt-6 flex-col gap-3 rounded-xl border border-hairline bg-surface-card p-5">
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
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Heading</label>
          <input
            name="heroHeading"
            defaultValue={values.heroHeading}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Body</label>
          <textarea
            name="heroBody"
            defaultValue={values.heroBody}
            required
            rows={3}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
      </section>

      <section id="section-services" className="scroll-mt-6 rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Services</p>
        <RepeatableRows
          name="services"
          fields={[
            { key: "name", label: "Name" },
            { key: "description", label: "Description", textarea: true },
          ]}
          initialRows={values.services}
          addLabel="+ Add service"
        />
      </section>

      <section id="section-table" className="flex scroll-mt-6 flex-col gap-3 rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase text-[var(--color-muted)]">Department contact table intro</p>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Eyebrow</label>
          <input
            name="tableIntroEyebrow"
            defaultValue={values.tableIntroEyebrow}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Heading</label>
          <input
            name="tableIntroHeading"
            defaultValue={values.tableIntroHeading}
            required
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
        <div>
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Body</label>
          <textarea
            name="tableIntroBody"
            defaultValue={values.tableIntroBody}
            required
            rows={3}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>
        <div className="rounded-lg border border-hairline p-3">
          <p className="type-caption-uppercase mb-2 text-[var(--color-muted)]">Table column headings</p>
          <div className="grid grid-cols-5 gap-2">
            <div>
              <label className="type-caption mb-1 block text-[var(--color-muted)]">S.No</label>
              <input
                name="tableHeaderSerialNumber"
                defaultValue={values.tableHeaderSerialNumber}
                required
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-2.5 py-1.5 text-sm outline-none focus:border-[var(--color-primary-blue)]"
              />
            </div>
            <div>
              <label className="type-caption mb-1 block text-[var(--color-muted)]">Department</label>
              <input
                name="tableHeaderDepartment"
                defaultValue={values.tableHeaderDepartment}
                required
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-2.5 py-1.5 text-sm outline-none focus:border-[var(--color-primary-blue)]"
              />
            </div>
            <div>
              <label className="type-caption mb-1 block text-[var(--color-muted)]">Contact</label>
              <input
                name="tableHeaderContact"
                defaultValue={values.tableHeaderContact}
                required
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-2.5 py-1.5 text-sm outline-none focus:border-[var(--color-primary-blue)]"
              />
            </div>
            <div>
              <label className="type-caption mb-1 block text-[var(--color-muted)]">Email</label>
              <input
                name="tableHeaderEmail"
                defaultValue={values.tableHeaderEmail}
                required
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-2.5 py-1.5 text-sm outline-none focus:border-[var(--color-primary-blue)]"
              />
            </div>
            <div>
              <label className="type-caption mb-1 block text-[var(--color-muted)]">Phone</label>
              <input
                name="tableHeaderPhone"
                defaultValue={values.tableHeaderPhone}
                required
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-2.5 py-1.5 text-sm outline-none focus:border-[var(--color-primary-blue)]"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
              &quot;Raise a Ticket&quot; label <span className="normal-case text-[11px]">(both buttons)</span>
            </label>
            <input
              name="raiseTicketLabel"
              defaultValue={values.raiseTicketLabel}
              required
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Link</label>
            <input
              name="raiseTicketHref"
              defaultValue={values.raiseTicketHref}
              required
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
        </div>
      </section>

      <section id="section-department-contacts" className="scroll-mt-6 rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase mb-1 text-[var(--color-muted)]">Department contacts</p>
        <p className="type-caption mb-2 text-[var(--color-muted)]">
          Which Government Department maps to which TNeGA Project Manager. Drag the handle to reorder — row order is the
          display order on the public page.
        </p>
        <RepeatableRows
          name="departmentContacts"
          fields={[
            { key: "department", label: "Department", width: 3 },
            { key: "contact", label: "Contact (e.g. PM I)" },
            { key: "email", label: "Email", width: 1.5 },
            { key: "phone", label: "Phone" },
          ]}
          initialRows={values.departmentContacts}
          addLabel="+ Add department"
          reorderable
        />
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
