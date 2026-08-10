import Link from "next/link";
import { getPayloadClient } from "@/lib/payload-client";
import { addServicesToSpotlight } from "../actions";

export const dynamic = "force-dynamic";

export default async function AddToSpotlightPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const payload = await getPayloadClient();

  const [{ docs: services }, { docs: spotlighted }] = await Promise.all([
    payload.find({ collection: "services", limit: 200, sort: "name", draft: true, overrideAccess: true }),
    payload.find({ collection: "projects-spotlight", limit: 200, draft: true, overrideAccess: true }),
  ]);

  const spotlightedIds = new Set(
    spotlighted.map((d) => (typeof d.service === "object" ? d.service?.id : d.service)).filter(Boolean)
  );
  const available = services.filter((s) => !spotlightedIds.has(s.id));

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <h1 className="type-display-sm text-ink">Add to Spotlight</h1>
        <Link href="/cms/projects-spotlight" className="type-caption font-semibold text-[var(--color-primary-blue)] hover:underline">
          Back to list
        </Link>
      </div>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">
        Pick one or more services/projects to feature in the homepage carousel. Each is added as a draft — set its
        stats and buttons, then publish it from its own edit screen.
      </p>

      {error ? (
        <p className="type-body-sm mb-4 max-w-[680px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}

      {available.length === 0 ? (
        <p className="type-body-sm max-w-[680px] text-[var(--color-muted)]">
          Every service is already in the spotlight. Remove one from the list first if you want to swap it out.
        </p>
      ) : (
        <form action={addServicesToSpotlight} className="flex max-w-[680px] flex-col gap-4">
          <div className="flex flex-col divide-y divide-hairline rounded-xl border border-hairline bg-surface-card">
            {available.map((service) => (
              <label key={service.id} className="flex cursor-pointer items-start gap-3 p-4 hover:bg-surface-strong">
                <input type="checkbox" name="serviceId" value={service.id} className="mt-1" />
                <span>
                  <span className="type-body-strong block text-ink">{service.name}</span>
                  <span className="type-caption line-clamp-1 text-[var(--color-muted)]">{service.description}</span>
                </span>
              </label>
            ))}
          </div>
          <button type="submit" className="type-button btn-primary self-start">
            Add selected to spotlight
          </button>
        </form>
      )}
    </div>
  );
}
