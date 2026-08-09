// One-off script: migrates the 4 announcements that used to live in
// lib/content.ts + lib/announcement-details.ts into the new Payload
// `announcements` collection, so the site isn't left empty once the
// frontend switches to reading from the CMS. Safe to re-run — it
// upserts by slug rather than inserting duplicates.
//
//   node --env-file=.env.local ./node_modules/.bin/tsx scripts/seed-announcements.ts
//
import { getPayload } from "payload";
import config from "../src/payload.config";
import type { Announcement } from "../src/payload-types";

type Paragraphs = string[];

function toLexical(paragraphs: Paragraphs) {
  return {
    root: {
      type: "root",
      direction: "ltr" as const,
      format: "" as const,
      indent: 0,
      version: 1,
      children: paragraphs.map((text) => ({
        type: "paragraph",
        direction: "ltr" as const,
        format: "" as const,
        indent: 0,
        version: 1,
        children: [
          {
            type: "text",
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text,
            version: 1,
          },
        ],
      })),
    },
  };
}

type Seed = {
  slug: string;
  heading: string;
  description: string;
  date: string;
  category: string;
  imageUrl?: string;
  facts?: { label: string; value: string }[];
  links?: { label: string; href: string }[];
  paragraphs: string[];
};

const SEEDS: Seed[] = [
  {
    slug: "simplegov-launch",
    heading: "SimpleGov launched by Hon'ble Chief Minister",
    description:
      "10 government services made paperless, online and instant under the new SimpleGov initiative.",
    date: "2025-05-29",
    category: "Service Launch",
    imageUrl:
      "https://images.pexels.com/photos/8847169/pexels-photo-8847169.jpeg?auto=compress&cs=tinysrgb&w=1200",
    facts: [
      { label: "Services live", value: "10" },
      { label: "Launched", value: "29 May 2025" },
    ],
    links: [
      { label: "Government Orders", href: "/notifications/government-orders" },
      { label: "Citizen Services", href: "/services#citizen-services" },
    ],
    paragraphs: [
      "The SimpleGov initiative was launched by the Hon'ble Chief Minister on 29 May 2025, bringing the first ten government services onto a single paperless, online and instant delivery model.",
      "Under SimpleGov, services that previously required in-person visits and physical paperwork are issued digitally. The initial set spans multiple departments, including sanitation certificate digitization, registration of old age homes, verification of characters and antecedents, no-objection certificates for dryland non-agricultural purposes, registration of working women hostels, lift and escalator licensing, and fire licensing.",
      "Each service was notified through a Government Order issued by the concerned department. The full set of orders is published on the Government Orders page.",
    ],
  },
  {
    slug: "namma-arasu-live",
    heading: "Namma Arasu WhatsApp governance goes live",
    description:
      "51 government services now accessible on WhatsApp at 7845252525 across 16 departments.",
    date: "2026-01-08",
    category: "Service Launch",
    imageUrl:
      "https://images.pexels.com/photos/6146657/pexels-photo-6146657.jpeg?auto=compress&cs=tinysrgb&w=1200",
    facts: [
      { label: "Services", value: "51" },
      { label: "Departments", value: "16" },
      { label: "WhatsApp", value: "7845252525" },
    ],
    links: [
      { label: "Namma Arasu", href: "/services/citizen/namma-arasu" },
      { label: "Citizen Services", href: "/services#citizen-services" },
    ],
    paragraphs: [
      "Namma Arasu WhatsApp governance is now live, making 51 government services accessible directly through WhatsApp on 7845252525.",
      "The services span 16 departments, allowing citizens to complete requests from their own phone without visiting a service centre or navigating a separate portal.",
    ],
  },
  {
    slug: "cm-award",
    heading: "CM Award for e-Governance Students",
    description:
      "Applications now open for the annual CM Award recognising student innovation in e-governance.",
    date: "2025-06-12",
    category: "Awards",
    imageUrl:
      "https://images.pexels.com/photos/3321791/pexels-photo-3321791.jpeg?auto=compress&cs=tinysrgb&w=1200",
    facts: [{ label: "Status", value: "Applications open" }],
    links: [{ label: "All announcements", href: "/notifications/announcements" }],
    paragraphs: [
      "Applications are now open for the annual Chief Minister's Award for e-Governance Students, which recognises student innovation in e-governance.",
      "The award is presented annually. Details on eligibility, the application process and closing dates are issued with the call for applications.",
    ],
  },
  {
    slug: "e-sevai-helpline",
    heading: "e-Sevai helpline expands support hours",
    description:
      "1800-42-56000 now available with extended hours to assist citizens across the state.",
    date: "2026-02-02",
    category: "Service Update",
    // No image, deliberately — matches the original text-only card.
    facts: [
      { label: "Helpline", value: "1800-42-56000" },
      { label: "Centres", value: "34,843" },
    ],
    links: [
      { label: "e-Sevai", href: "/services/citizen/e-sevai" },
      { label: "Citizen Services", href: "/services#citizen-services" },
    ],
    paragraphs: [
      "The e-Sevai helpline on 1800-42-56000 now operates with extended hours to assist citizens across the state.",
      "e-Sevai is Tamil Nadu's unified digital service delivery platform, offering 410 services online and through 34,843 assisted centres statewide. The helpline supports citizens using either channel.",
    ],
  },
];

async function uploadImage(payload: Awaited<ReturnType<typeof getPayload>>, url: string, alt: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  const filename = url.split("/").pop()?.split("?")[0] ?? "image.jpg";
  const doc = await payload.create({
    collection: "media",
    data: { alt },
    file: {
      data: Buffer.from(arrayBuffer),
      mimetype: "image/jpeg",
      name: filename,
      size: arrayBuffer.byteLength,
    },
  });
  return doc.id;
}

async function main() {
  const payload = await getPayload({ config });

  for (const seed of SEEDS) {
    const existing = await payload.find({
      collection: "announcements",
      where: { slug: { equals: seed.slug } },
      limit: 1,
      overrideAccess: true,
    });

    const imageId = seed.imageUrl ? await uploadImage(payload, seed.imageUrl, seed.heading) : undefined;

    const data: Partial<Announcement> = {
      heading: seed.heading,
      slug: seed.slug,
      date: seed.date,
      description: seed.description,
      category: seed.category,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body: toLexical(seed.paragraphs) as any,
      facts: seed.facts,
      links: seed.links,
      ...(imageId ? { image: imageId } : {}),
      _status: "published",
    };

    if (existing.docs[0]) {
      await payload.update({
        collection: "announcements",
        id: existing.docs[0].id,
        data,
        overrideAccess: true,
      });
      console.log(`Updated: ${seed.slug}`);
    } else {
      await payload.create({
        collection: "announcements",
        data: data as Omit<Announcement, "id" | "createdAt" | "updatedAt">,
        overrideAccess: true,
      });
      console.log(`Created: ${seed.slug}`);
    }
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
