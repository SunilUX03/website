"use client";

import { useState } from "react";
import { GeneratedFaq } from "@/lib/service-detail-generator";

function FaqRow({ faq, open, onToggle }: { faq: GeneratedFaq; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-hairline first:border-t">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="type-body-strong flex w-full items-center justify-between gap-4 py-4 text-left text-ink"
      >
        {faq.q}
        <span
          aria-hidden
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-hairline-strong text-[var(--color-primary-blue)] transition-transform duration-200 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      {open && <p className="type-body-sm max-w-[70ch] pb-4 text-[var(--color-body)]">{faq.a}</p>}
    </div>
  );
}

/** `moreFaqs`, when present, renders behind a "View more questions"
 * toggle rather than all at once — for items whose real-content
 * submission distinguishes a primary set from a longer additional list. */
export function FaqAccordion({ faqs, moreFaqs }: { faqs: GeneratedFaq[]; moreFaqs?: GeneratedFaq[] }) {
  const [showMore, setShowMore] = useState(false);
  // Keyed by question text, not array index — an index would collide
  // between `faqs` and `moreFaqs` once both are rendered.
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="flex flex-col">
      {faqs.map((faq) => (
        <FaqRow key={faq.q} faq={faq} open={openKey === faq.q} onToggle={() => setOpenKey((k) => (k === faq.q ? null : faq.q))} />
      ))}

      {moreFaqs && moreFaqs.length > 0 && (
        <>
          {showMore &&
            moreFaqs.map((faq) => (
              <FaqRow
                key={faq.q}
                faq={faq}
                open={openKey === faq.q}
                onToggle={() => setOpenKey((k) => (k === faq.q ? null : faq.q))}
              />
            ))}
          <button
            type="button"
            onClick={() => setShowMore((v) => !v)}
            className="type-body-strong self-start py-4 text-[var(--color-primary-blue)] hover:underline"
          >
            {showMore ? "View fewer questions" : "View more questions"}
          </button>
        </>
      )}
    </div>
  );
}
