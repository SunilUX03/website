"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { socialMedia } from "@/lib/content";
import type { SocialPost } from "@/lib/social-seed-data";
import { Container } from "@/components/ui/Container";
import { PhotoTile } from "@/components/ui/PhotoTile";
import { useReducedMotion, useAutoScroll } from "@/lib/hooks";

const ROTATE_MS = 4500;

function SocialCard({ platform }: { platform: (typeof socialMedia)[number] }) {
  const reducedMotion = useReducedMotion();
  const [posts, setPosts] = useState<SocialPost[] | null>(null);
  const [active, setActive] = useState(0);
  const paused = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetched from our own API route (currently seed data — see
  // src/lib/social-seed-data.ts) rather than imported directly, so wiring
  // up the real Graph/X/YouTube APIs later is a server-side change only.
  useEffect(() => {
    let cancelled = false;
    fetch(platform.apiPath)
      .then((res) => res.json())
      .then((data: { posts: SocialPost[] }) => {
        if (!cancelled) setPosts(data.posts);
      })
      .catch(() => {
        if (!cancelled) setPosts([]);
      });
    return () => {
      cancelled = true;
    };
  }, [platform.apiPath]);

  useEffect(() => {
    if (reducedMotion || !posts || posts.length === 0) return;
    timerRef.current = setInterval(() => {
      if (!paused.current) {
        setActive((a) => (a + 1) % posts.length);
      }
    }, ROTATE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [reducedMotion, posts]);

  if (!posts || posts.length === 0) {
    return (
      <div className="card-feature w-[82vw] shrink-0 snap-start overflow-hidden !p-0 md:w-auto">
        <div className="aspect-[16/9] animate-pulse bg-[var(--color-surface-strong)]" />
        <div className="space-y-2 p-6">
          <div className="h-4 w-2/3 animate-pulse rounded bg-[var(--color-surface-strong)]" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-[var(--color-surface-strong)]" />
        </div>
      </div>
    );
  }

  const post = posts[active];

  return (
    <div
      className="card-feature w-[82vw] shrink-0 snap-start overflow-hidden !p-0 md:w-auto"
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={active}
            className="absolute inset-0"
            initial={{ opacity: reducedMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.5, ease: "easeInOut" }}
          >
            <PhotoTile src={post.image} alt={`${platform.platform} post`} aspect="aspect-auto" className="h-full w-full" />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="p-6">
        <span className="badge-pill mb-3">{platform.platform}</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={active}
            initial={{ opacity: reducedMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.3 }}
            className="type-body-sm mb-3 min-h-[4.4em] text-ink"
          >
            {post.text}
          </motion.p>
        </AnimatePresence>
        <div className="flex items-center justify-between">
          <span className="type-caption text-[var(--color-muted)]">{post.date}</span>
          <a
            href={platform.href}
            className="type-body-sm font-medium text-[var(--color-primary-blue)] hover:underline"
          >
            Read more
          </a>
        </div>
        <div className="mt-3 flex gap-1.5">
          {posts.map((p, i) => (
            <span
              key={p.date}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === active ? "w-5 bg-[var(--color-primary-blue)]" : "w-1.5 bg-hairline-strong"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SocialMedia() {
  const carouselRef = useAutoScroll<HTMLDivElement>();
  return (
    <section className="relative overflow-hidden bg-canvas-soft">
      <div
        aria-hidden
        className="orb-drift-a pointer-events-none absolute -left-20 top-0 h-[360px] w-[360px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--color-gradient-rose) 0%, transparent 70%)",
          opacity: 0.4,
        }}
      />
      <div
        aria-hidden
        className="orb-drift-b pointer-events-none absolute -right-24 bottom-0 h-[320px] w-[320px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--color-gradient-sky) 0%, transparent 70%)",
          opacity: 0.4,
        }}
      />
      <Container className="relative py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Updates</p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">From our social channels</h2>

        <div
          ref={carouselRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible"
        >
          {socialMedia.map((platform) => (
            <SocialCard key={platform.platform} platform={platform} />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
          {socialMedia.map((platform) => (
            <a
              key={platform.platform}
              href={platform.href}
              className="type-body-strong text-ink hover:text-[var(--color-primary-blue)]"
            >
              {platform.followLabel}
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
