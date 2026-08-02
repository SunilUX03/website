"use client";

import { useState } from "react";
import { GeneratedFaq } from "@/lib/service-detail-generator";

export function FaqAccordion({ faqs }: { faqs: GeneratedFaq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col">
      {faqs.map((faq, i) => {
        const open = openIndex === i;
        return (
          <div key={faq.q} className="border-b border-hairline first:border-t">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
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
      })}
    </div>
  );
}
