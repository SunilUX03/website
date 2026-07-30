"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "@/lib/content";
import { Container } from "@/components/ui/Container";

type Category = (typeof categories)[number];

function CategoryDesktopRow({ items, offset }: { items: Category[]; offset: number }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex gap-4">
      {items.map((cat, i) => {
        const isHovered = hovered === i;
        const grow = hovered === null ? 1 : isHovered ? 2.4 : 0.65;
        return (
          <div
            key={cat.title}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{ flexGrow: grow, flexBasis: 0 }}
            className="card-feature h-64 min-w-0 overflow-hidden transition-[flex-grow] duration-[400ms] ease-out"
          >
            <p className="type-caption-uppercase mb-4 text-[var(--color-muted)]">
              {String(offset + i + 1).padStart(2, "0")}
            </p>
            <h3 className="type-title-md whitespace-nowrap text-ink">{cat.title}</h3>
            <p
              className="type-body-sm mt-2 max-w-[46ch] text-[var(--color-body)] transition-opacity duration-300"
              style={{ opacity: isHovered ? 1 : 0 }}
            >
              {cat.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function CategoryMobileItem({ cat }: { cat: Category }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card-feature overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left"
      >
        <h3 className="type-title-md text-ink">{cat.title}</h3>
        <span
          className={`ml-3 shrink-0 text-ink transition-transform duration-200 ${
            open ? "rotate-45" : ""
          }`}
          aria-hidden
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="type-body-sm pt-3 text-[var(--color-body)]">{cat.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CategoryCards() {
  const rowA = categories.slice(0, 3);
  const rowB = categories.slice(3, 6);

  return (
    <section className="bg-canvas">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">
          What We Bring to the Table
        </p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">Projects &amp; Services</h2>

        <div className="hidden flex-col gap-4 md:flex">
          <CategoryDesktopRow items={rowA} offset={0} />
          <CategoryDesktopRow items={rowB} offset={3} />
        </div>

        <div className="flex flex-col gap-4 md:hidden">
          {categories.map((cat) => (
            <CategoryMobileItem key={cat.title} cat={cat} />
          ))}
        </div>
      </Container>
    </section>
  );
}
