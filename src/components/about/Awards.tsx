import { awards } from "@/lib/about-content";
import { Container } from "@/components/ui/Container";
import { PhotoTile } from "@/components/ui/PhotoTile";

export function Awards() {
  return (
    <section className="bg-canvas-soft">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">
          Awards &amp; Recognition
        </p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">
          Recognised for governance impact
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {awards.map((award) => (
            <div key={award.title} className="card-feature group overflow-hidden !p-0">
              <div className="overflow-hidden">
                <PhotoTile
                  src={award.image}
                  alt={award.title}
                  aspect="aspect-[4/3]"
                  className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-6">
                <p className="type-caption-uppercase mb-2 text-[var(--color-muted)]">
                  {award.year}
                </p>
                <h3 className="type-title-md mb-2 text-ink">{award.title}</h3>
                <p className="type-body-sm text-[var(--color-body)]">{award.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
