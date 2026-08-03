"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { pillars } from "@/lib/content";
import { getServiceItemsByNames } from "@/lib/services-content";
import { Container } from "@/components/ui/Container";
import { FocusCarousel } from "@/components/ui/FocusCarousel";

type Pillar = (typeof pillars)[number];

/**
 * One "Enabling Digital Governance" band: a standing left panel naming the
 * theme, and a centred focus-pull carousel of the projects under it. Stacks
 * to a single column below md, where the panel sits above the carousel.
 */
function PillarBand({ pillar }: { pillar: Pillar }) {
  const items = getServiceItemsByNames(pillar.itemNames);

  return (
    <div className="card-feature flex flex-col overflow-hidden !p-0 md:flex-row">
      <div className="flex flex-col justify-center border-b border-hairline p-6 md:w-[28%] md:shrink-0 md:border-b-0 md:border-r md:p-8">
        <h3 className="type-title-md text-ink">{pillar.title}</h3>
        {/* Same short primary-blue rule used as a heading accent elsewhere
            on the page, so these bands read as part of the same system. */}
        <span
          aria-hidden
          className="mt-2 block h-[3px] w-10 rounded-full bg-[var(--color-primary-blue)]"
        />
        <p className="type-body-sm mt-3 text-[var(--color-body)]">{pillar.description}</p>
        {/* The arrow is joined to the last word with a non-breaking space —
            the longer labels wrap in this narrow panel and would otherwise
            orphan it onto a line of its own. aria-label keeps the arrow out
            of the link's accessible name. */}
        <Link
          href={pillar.href}
          aria-label={pillar.linkLabel}
          className="type-caption mt-4 font-semibold text-[var(--color-primary-blue)] underline-offset-4 hover:underline"
        >
          {pillar.linkLabel}
          <span aria-hidden>{"\u00A0\u2192"}</span>
        </Link>
      </div>

      <FocusCarousel items={items} label={pillar.title} />
    </div>
  );
}

export function PillarCards() {
  return (
    <section className="bg-canvas-soft">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">
          Enabling Digital Governance
        </p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">
          How TNeGA powers governance across Tamil Nadu
        </h2>

        <div className="flex flex-col gap-6">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: i * 0.09, ease: "easeOut" }}
            >
              <PillarBand pillar={pillar} />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
