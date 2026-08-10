// One-off, ALREADY RUN script: linked each pre-rework "projects-spotlight"
// row (back when it had its own name/description/image fields) to its
// matching "services" collection entry, as part of reworking Projects
// Spotlight to reference an existing service instead of duplicating its
// content. Kept only as a record of what was done — `name` no longer
// exists on this collection (dropped in the follow-up migration), so this
// can't usefully be re-run; the cast below just keeps it compiling.
//
import { getPayload } from "payload";
import config from "../src/payload.config";

const NAME_TO_SERVICE_SLUG: Record<string, string> = {
  "e-Sevai": "e-sevai-portal",
  "Namma Arasu": "namma-arasu",
  "TN GIS": "tngis-tamil-nilam",
  "UMIS": "umis",
  "TNSSO": "tnsso",
  "e-Office": "e-office",
};

async function main() {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({ collection: "projects-spotlight", limit: 100, overrideAccess: true });

  for (const doc of docs as unknown as { id: number; name?: string; _status?: string }[]) {
    const slug = NAME_TO_SERVICE_SLUG[doc.name ?? ""];
    if (!slug) {
      console.log(`No mapping for "${doc.name}", skipping.`);
      continue;
    }
    const { docs: services } = await payload.find({
      collection: "services",
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    });
    const service = services[0];
    if (!service) {
      console.log(`No service found for slug "${slug}" (from "${doc.name}"), skipping.`);
      continue;
    }
    await payload.update({
      collection: "projects-spotlight",
      id: doc.id,
      data: { service: service.id },
      overrideAccess: true,
      draft: doc._status === "draft" ? true : undefined,
    });
    console.log(`Linked "${doc.name}" -> service #${service.id} (${service.name})`);
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
