"use client";

import { ComponentType, ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue } from "framer-motion";
import { announcements, socialMedia } from "@/lib/content";
import type { SocialPost } from "@/lib/social-seed-data";
import { Container } from "@/components/ui/Container";
import { useReducedMotion } from "@/lib/hooks";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/ui/SocialIcons";

const SOCIAL_ICON: Record<string, ComponentType<{ className?: string }>> = {
  Facebook: FacebookIcon,
  X: XIcon,
  Instagram: InstagramIcon,
  LinkedIn: LinkedInIcon,
  YouTube: YouTubeIcon,
};

type FeedPost = SocialPost & { platform: string; href: string };

const DRIFT_SPEED = 22; // px/sec
const VIEWPORT_H = 680;

/** Continuous vertical auto-scroll viewport — same drift technique as the
 * old horizontal filmstrips, rotated to Y so both feed columns read as a
 * live ticker rather than a static list. Hover pauses; no drag (a vertical
 * drag inside a column would fight the page's own vertical scroll). */
function VerticalDrift<T>({
  items,
  getKey,
  renderItem,
}: {
  items: T[];
  getKey: (item: T, i: number) => string;
  renderItem: (item: T) => ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const y = useMotionValue(0);
  const paused = useRef(false);
  const loopHeight = useRef(0);
  const loop = [...items, ...items];

  useLayoutEffect(() => {
    if (trackRef.current) loopHeight.current = trackRef.current.scrollHeight / 2;
  }, [items]);

  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;
    let last = performance.now();
    const step = (time: number) => {
      const dt = (time - last) / 1000;
      last = time;
      if (!paused.current && loopHeight.current > 0) {
        let next = y.get() - DRIFT_SPEED * dt;
        if (next <= -loopHeight.current) next += loopHeight.current;
        y.set(next);
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <div className="space-y-3 overflow-y-auto pr-1" style={{ maxHeight: VIEWPORT_H }}>
        {items.map((item, i) => (
          <div key={getKey(item, i)}>{renderItem(item)}</div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: VIEWPORT_H }}
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
    >
      <motion.div ref={trackRef} style={{ y }} className="flex flex-col gap-3">
        {loop.map((item, i) => (
          <div key={getKey(item, i)}>{renderItem(item)}</div>
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[var(--color-canvas)] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[var(--color-canvas)] to-transparent" />
    </div>
  );
}

/** Merges every platform's posts into one unlabelled, interleaved stream
 * (round-robin across platforms) rather than grouping by source — fetched
 * client-side from the same per-platform routes SocialMedia used, so the
 * server-side real-API swap-in point (see social-seed-data.ts) is
 * untouched. */
function useMergedSocialFeed(): FeedPost[] | null {
  const [posts, setPosts] = useState<FeedPost[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      socialMedia.map((platform) =>
        fetch(platform.apiPath)
          .then((res) => res.json())
          .then((data: { posts: SocialPost[] }) =>
            data.posts.map((post) => ({ ...post, platform: platform.platform, href: platform.href }))
          )
          .catch(() => [] as FeedPost[])
      )
    ).then((groups) => {
      if (cancelled) return;
      const maxLen = Math.max(0, ...groups.map((g) => g.length));
      const merged: FeedPost[] = [];
      for (let i = 0; i < maxLen; i++) {
        for (const group of groups) if (group[i]) merged.push(group[i]);
      }
      setPosts(merged);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return posts;
}

export function CommunityFeed() {
  const posts = useMergedSocialFeed();

  return (
    <section className="bg-canvas">
      <Container className="py-xxl md:py-section">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
          <div>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="type-caption-uppercase mb-2 text-[var(--color-muted)]">Announcements</p>
                <h2 className="type-display-md text-ink">Latest from TNeGA</h2>
              </div>
              <Link
                href="/notifications/announcements"
                className="type-caption shrink-0 font-semibold text-[var(--color-primary-blue)] hover:underline"
              >
                View all
                <span aria-hidden>{" →"}</span>
              </Link>
            </div>

            <VerticalDrift
              items={announcements}
              getKey={(item, i) => `${item.href}-${i}`}
              renderItem={(item) => (
                <a
                  href={item.href}
                  className="block overflow-hidden rounded-xl border border-hairline bg-surface-card transition-colors hover:border-hairline-strong"
                >
                  {/* Plain <img>, not PhotoTile's fill+object-cover box —
                      real announcement photos won't all share one aspect
                      ratio, and force-cropping every one to the same fixed
                      height is exactly what mangled the TNSSO poster
                      earlier. This sizes to each photo's own real
                      proportions instead, so a portrait or square photo
                      just makes that one card taller rather than getting
                      cropped to match its neighbours. */}
                  <img src={item.image} alt="" loading="lazy" className="block w-full" />
                  <div className="p-3">
                    <span className="type-caption text-[var(--color-muted)]">{item.timestamp}</span>
                    <p className="type-body-strong mt-0.5 text-ink">{item.heading}</p>
                    <p className="type-body-sm mt-0.5 line-clamp-2 text-[var(--color-body)]">{item.description}</p>
                  </div>
                </a>
              )}
            />
          </div>

          <div>
            <div className="mb-6">
              <p className="type-caption-uppercase mb-2 text-[var(--color-muted)]">Updates</p>
              <h2 className="type-display-md text-ink">From our social channels</h2>
            </div>

            {posts === null ? (
              <div className="space-y-3" style={{ height: VIEWPORT_H }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-24 animate-pulse rounded-xl bg-[var(--color-surface-strong)]" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <p className="type-body-sm text-[var(--color-muted)]">Updates will appear here shortly.</p>
            ) : (
              <VerticalDrift
                items={posts}
                getKey={(post, i) => `${post.platform}-${post.date}-${i}`}
                renderItem={(post) => {
                  const Icon = SOCIAL_ICON[post.platform];
                  return (
                    <a
                      href={post.href}
                      className="block overflow-hidden rounded-xl border border-hairline bg-surface-card transition-colors hover:border-hairline-strong"
                    >
                      <span className="relative block">
                        <img src={post.image} alt="" loading="lazy" className="block w-full" />
                        <span className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-ink shadow-[0_2px_6px_rgba(12,10,9,0.2)]">
                          {Icon && <Icon className="h-3 w-3" />}
                        </span>
                      </span>
                      <div className="p-3">
                        <p className="type-body-sm line-clamp-2 text-ink">{post.text}</p>
                        <span className="type-caption mt-1 block text-[var(--color-muted)]">{post.date}</span>
                      </div>
                    </a>
                  );
                }}
              />
            )}

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {socialMedia.map((platform) => (
                <a
                  key={platform.platform}
                  href={platform.href}
                  className="type-caption font-semibold text-ink hover:text-[var(--color-primary-blue)]"
                >
                  {platform.followLabel}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
