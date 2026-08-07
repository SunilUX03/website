"use client";

import { ComponentType, ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { announcements, socialMedia } from "@/lib/content";
import type { SocialPost } from "@/lib/social-seed-data";
import { Container } from "@/components/ui/Container";
import { PhotoTile } from "@/components/ui/PhotoTile";
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
const VIEWPORT_H = 480;
const WHEEL_RESUME_MS = 1200;
const TOUCH_RESUME_MS = 1600;

/** Vertical auto-scroll viewport — drives a real `scrollTop` on a native
 * `overflow-y-auto` container (not a CSS transform behind `overflow-hidden`)
 * specifically so wheel, trackpad and touch scrolling keep working: a user
 * can scroll back up to re-read something that already drifted past, not
 * just pause it in place. Auto-drift pauses immediately on hover, wheel or
 * touch, and resumes shortly after the interaction ends. */
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
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const paused = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loopHeight = useRef(0);
  const loop = [...items, ...items];

  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (el) loopHeight.current = el.scrollHeight / 2;
  }, [items]);

  // Kept even though thumbnails are fixed-size again (so this shouldn't
  // strictly be needed): a ResizeObserver on the actual content track
  // keeps loopHeight correct if content height ever changes after mount
  // for any reason. Cheap insurance against a repeat of the bug this once
  // caused — a plain, unsized <img> locked in a loop height measured
  // before it loaded, so the wrap-around check below fired almost
  // immediately and the feed looked frozen instead of drifting.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const ro = new ResizeObserver(() => {
      loopHeight.current = track.scrollHeight / 2;
    });
    ro.observe(track);
    return () => ro.disconnect();
  }, [items]);

  // reducedMotion is read from a ref inside the frame loop rather than
  // being an effect dependency — accessibility prefs load from
  // localStorage asynchronously (a tick after mount), so `reducedMotion`
  // can flip from false to true shortly after the loop already started.
  // With it in the dependency array, that flip tore the effect down and
  // never restarted it — this way the loop is created exactly once and
  // simply checks the current value every frame, which also means a user
  // toggling "Pause animations" back off in our own accessibility panel
  // makes the drift resume immediately instead of needing a refresh.
  const reducedMotionRef = useRef(reducedMotion);
  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    let last = performance.now();
    const step = (time: number) => {
      const dt = (time - last) / 1000;
      last = time;
      if (!paused.current && !reducedMotionRef.current && loopHeight.current > 0) {
        let next = el.scrollTop + DRIFT_SPEED * dt;
        if (next >= loopHeight.current) next -= loopHeight.current;
        el.scrollTop = next;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (reducedMotion) {
    // Same scrollbar treatment as the animated viewport below — this
    // branch previously left the browser's default (often thick) scrollbar
    // unstyled, which visibly overlapped the cards' rounded right edge.
    return (
      <div
        className="space-y-3 overflow-y-auto pr-2 [scrollbar-width:thin]"
        style={{ maxHeight: VIEWPORT_H }}
      >
        {items.map((item, i) => (
          <div key={getKey(item, i)}>{renderItem(item)}</div>
        ))}
      </div>
    );
  }

  const scheduleResume = (delay: number) => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      paused.current = false;
    }, delay);
  };
  const pauseNow = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    paused.current = true;
  };

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="overflow-y-auto [scrollbar-width:thin]"
        style={{ height: VIEWPORT_H }}
        // Deliberately no onMouseEnter/onMouseLeave pause: that paused the
        // instant the cursor merely rested anywhere over this fairly large
        // block, with nothing to resume it until the mouse physically left
        // — on desktop, a cursor idling here while someone reads froze the
        // drift indefinitely, while touch devices (no hover state at all)
        // never hit this, which is exactly the "works on mobile, not on
        // desktop" split reported. Pausing now only on an actual wheel
        // turn or touch — real scroll intent, not passive presence.
        onWheel={() => {
          pauseNow();
          scheduleResume(WHEEL_RESUME_MS);
        }}
        onTouchStart={pauseNow}
        onTouchEnd={() => scheduleResume(TOUCH_RESUME_MS)}
      >
        <div ref={trackRef} className="flex flex-col gap-3">
          {loop.map((item, i) => (
            <div key={getKey(item, i)}>{renderItem(item)}</div>
          ))}
        </div>
      </div>
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
                  className="flex items-center gap-3 rounded-xl border border-hairline bg-surface-card p-3 transition-colors hover:border-hairline-strong"
                >
                  {/* items-center on the row (above) + a bigger thumbnail
                      here fixes two things at once: the image no longer
                      sits pinned to the top of a taller text block, and it
                      now uses more of that vertical space instead of
                      floating small inside it. Still a fixed-size
                      rectangle, not a full-width banner — most of these
                      source photos are low-resolution stock images that
                      look fine at this size but rough blown up full-width.
                      Optional: a text-only update (no photo) renders as a
                      plain full-width row instead of leaving a gap. */}
                  {item.image && (
                    <span className="relative h-24 w-36 shrink-0 overflow-hidden rounded-lg">
                      <PhotoTile src={item.image} alt="" aspect="aspect-[3/2]" className="h-full w-full" sizes="144px" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="type-caption text-[var(--color-muted)]">{item.timestamp}</span>
                    <p className="type-body-strong mt-0.5 truncate text-ink">{item.heading}</p>
                    <p className="type-caption mt-0.5 line-clamp-2 text-[var(--color-body)]">{item.description}</p>
                  </span>
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
                      className="flex items-center gap-3 rounded-xl border border-hairline bg-surface-card p-3 transition-colors hover:border-hairline-strong"
                    >
                      {post.image && (
                        <span className="relative h-24 w-36 shrink-0 overflow-hidden rounded-lg">
                          <PhotoTile src={post.image} alt="" aspect="aspect-[3/2]" className="h-full w-full" sizes="144px" />
                          <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-ink shadow-[0_2px_6px_rgba(12,10,9,0.2)]">
                            {Icon && <Icon className="h-3 w-3" />}
                          </span>
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <p className="type-caption line-clamp-2 text-ink">{post.text}</p>
                        <span className="type-caption mt-0.5 block text-[var(--color-muted)]">{post.date}</span>
                      </span>
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
