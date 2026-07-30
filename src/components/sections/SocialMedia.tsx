import { socialMedia } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

export function SocialMedia() {
  return (
    <section className="bg-canvas">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Updates</p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">From our social channels</h2>

        <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible">
          {socialMedia.map((post) => (
            <div
              key={post.platform}
              className="card-feature w-[82vw] shrink-0 snap-start overflow-hidden !p-0 md:w-auto"
            >
              <ImagePlaceholder
                label={`${post.platform} post image`}
                gradient={post.gradient}
                aspect="aspect-[16/9]"
              />
              <div className="p-6">
                <span className="badge-pill mb-3">{post.platform}</span>
                <p className="type-body-sm mb-3 text-ink">{post.text}</p>
                <div className="flex items-center justify-between">
                  <span className="type-caption text-[var(--color-muted)]">{post.date}</span>
                  <a
                    href={post.href}
                    className="type-body-sm font-medium text-[var(--color-primary-blue)] hover:underline"
                  >
                    Read more
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
          {socialMedia.map((post) => (
            <a
              key={post.platform}
              href={post.href}
              className="type-body-strong text-ink hover:text-[var(--color-primary-blue)]"
            >
              {post.followLabel}
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
