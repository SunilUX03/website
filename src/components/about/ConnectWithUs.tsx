"use client";

import { useState } from "react";
import { connectWithUs } from "@/lib/about-content";
import { Container } from "@/components/ui/Container";

function EnvelopeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ConnectWithUs() {
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-canvas-soft">
      <Container className="py-xxl md:py-section">
        <div className="mx-auto max-w-xl">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="card-feature flex w-full flex-col items-center gap-3 py-10 text-center transition-colors duration-200 hover:border-[var(--color-primary-blue)]"
          >
            <EnvelopeIcon className="h-10 w-10 text-[var(--color-primary-blue)]" />
            <p className="type-title-md text-ink">Connect With Us</p>
            {!open && <p className="type-body-sm text-[var(--color-muted)]">Click to open</p>}
          </button>

          <div
            className="grid transition-all duration-400 ease-out"
            style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
          >
            <div className="overflow-hidden">
              <div className="card-feature mt-4 flex flex-col gap-6 text-center">
                <div>
                  <p className="type-caption-uppercase mb-2 text-[var(--color-muted)]">
                    Write to Us
                  </p>
                  <a
                    href={`mailto:${connectWithUs.email}`}
                    className="type-title-sm text-[var(--color-primary-blue)] hover:underline"
                  >
                    {connectWithUs.email}
                  </a>
                </div>
                <div>
                  <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">
                    Follow Us
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {connectWithUs.social.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="badge-pill type-body-sm transition-colors hover:bg-[rgba(29,63,143,0.1)]"
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
