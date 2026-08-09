import { Container } from "@/components/ui/Container";

type VisionMissionItem = { label: string; title: string; description: string };

function VisionMissionCard({ item }: { item: VisionMissionItem }) {
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

export function VisionMission({ visionMission }: { visionMission: VisionMissionItem[] }) {
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
          transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
        }
        .vision-mission-card:hover {
          transform: translateY(-6px);
          border-color: var(--color-primary-blue);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.12);
        }
        @media (prefers-reduced-motion: reduce) {
          .vision-mission-card { transition: none; }
          .vision-mission-card:hover { transform: none; }
        }
      `}</style>
    </section>
  );
}
