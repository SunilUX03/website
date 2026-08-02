"use client";

import { motion } from "framer-motion";
import { aboutHero } from "@/lib/about-content";
import { Container } from "@/components/ui/Container";
import { AboutHeroGraphic } from "@/components/about/AboutHeroGraphic";
import { useReducedMotion } from "@/lib/hooks";

function AnimatedHeadline({ text }: { text: string }) {
  const reducedMotion = useReducedMotion();
  const words = text.split(" ");

  if (reducedMotion) {
    return <h1 className="type-display-mega text-ink">{text}</h1>;
  }

  return (
    <h1 className="type-display-mega text-ink">
      <span className="inline">
        {words.map((word, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: "easeOut" }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        ))}
      </span>
    </h1>
  );
}

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-canvas" id="main-content">
      <div
        aria-hidden
        className="orb-drift-a pointer-events-none absolute -left-32 -top-20 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--color-gradient-sky) 0%, transparent 70%)",
          opacity: 0.5,
        }}
      />
      <div
        aria-hidden
        className="orb-drift-b pointer-events-none absolute -right-24 bottom-0 h-[360px] w-[360px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--color-gradient-lavender) 0%, transparent 70%)",
          opacity: 0.4,
        }}
      />

      <Container className="relative py-xxl md:py-section">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[54%_46%] lg:gap-8">
          <div>
            <p className="type-caption-uppercase mb-4 text-[var(--color-muted)]">
              {aboutHero.eyebrow}
            </p>
            <AnimatedHeadline text={aboutHero.headline} />
            <p className="type-body-md mt-6 max-w-[60ch] text-[var(--color-body)]">
              {aboutHero.description}
            </p>
          </div>
          <div className="hidden justify-center lg:flex">
            <AboutHeroGraphic />
          </div>
        </div>
      </Container>
    </section>
  );
}
