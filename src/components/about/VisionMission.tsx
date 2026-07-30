import { visionMission } from "@/lib/about-content";
import { Container } from "@/components/ui/Container";

function VisionMissionCard({ item }: { item: (typeof visionMission)[number] }) {
  return (
    <div className="vision-mission-card group card-feature h-full">
      <p className="type-caption-uppercase mb-4 text-[var(--color-muted)] transition-colors duration-250 group-hover:text-[var(--color-primary-blue)]">
        {item.label}
      </p>
      <h3 className="type-display-sm mb-4 text-ink">{item.title}</h3>
      <p className="type-body-md text-[var(--color-body)]">{item.description}</p>
    </div>
  );
}

export function VisionMission() {
  return (
    <section className="bg-canvas-soft">
      <Container className="py-xxl md:py-section">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {visionMission.map((item) => (
            <VisionMissionCard key={item.label} item={item} />
          ))}
        </div>
      </Container>

      <style>{`
        .vision-mission-card {
          transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease,
            background-color 220ms ease;
        }
        .vision-mission-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-primary-blue);
          background-color: rgba(29, 63, 143, 0.04);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </section>
  );
}
