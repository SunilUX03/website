import type { CmsRollOfHonourEntry } from "@/lib/cms/about-types";
import { Container } from "@/components/ui/Container";

export function RollOfHonour({ entries }: { entries: CmsRollOfHonourEntry[] }) {
  return (
    <section className="bg-canvas">
      <Container className="py-xxl md:py-section">
        <p className="type-caption-uppercase mb-3 text-[var(--color-muted)]">Roll of Honour</p>
        <h2 className="type-display-lg mb-10 max-w-2xl text-ink">Leading TNeGA since 2006</h2>

        {/* Plain static table — no carousel/scroll behavior. Desktop gets
            a real table; below md it becomes a stacked card list (same
            pattern as ServicesToGovernmentContent's department table) so
            there's nothing to scroll sideways on a phone. */}
        <div className="hidden overflow-hidden rounded-xl border border-hairline md:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-hairline bg-canvas-soft">
                <th scope="col" className="type-caption-uppercase px-5 py-3 text-[var(--color-muted)]">Name</th>
                <th scope="col" className="type-caption-uppercase px-5 py-3 text-[var(--color-muted)]">Designation</th>
                <th scope="col" className="type-caption-uppercase px-5 py-3 text-[var(--color-muted)]">Tenure</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr key={entry.id ?? i} className="border-b border-hairline last:border-0 hover:bg-canvas-soft">
                  <td className="type-body-sm px-5 py-3 text-ink">{entry.name ?? "—"}</td>
                  <td className="type-body-sm px-5 py-3 text-[var(--color-body)]">{entry.designation}</td>
                  <td className="type-body-sm px-5 py-3 text-[var(--color-body)]">{entry.range ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 md:hidden">
          {entries.map((entry, i) => (
            <div key={entry.id ?? i} className="rounded-xl border border-hairline p-4">
              <p className="type-body-strong text-ink">{entry.name ?? entry.designation}</p>
              {entry.name && (
                <p className="type-caption text-[var(--color-muted)]">{entry.designation}</p>
              )}
              {entry.range && (
                <p className="type-caption-uppercase mt-1 text-[var(--color-primary-blue)]">
                  {entry.range}
                </p>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
