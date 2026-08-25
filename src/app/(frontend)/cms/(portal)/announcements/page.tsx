import Link from "next/link";
import { getPayloadClient } from "@/lib/payload-client";
import { AnnouncementsTable } from "./AnnouncementsTable";
import { HomepageAnnouncements } from "./HomepageAnnouncements";

export const dynamic = "force-dynamic";

function dateOnly(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : "";
}

export default async function AnnouncementsListPage() {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "announcements",
    sort: "order",
    limit: 200,
    draft: true,
    overrideAccess: true,
  });

  const featured = docs
    .filter((d) => d.tickerFeatured)
    .sort((a, b) => (a.tickerOrder ?? 0) - (b.tickerOrder ?? 0))
    .map((d) => ({ id: d.id, heading: d.heading, date: dateOnly(d.date) }));
  const candidates = docs
    .filter((d) => !d.tickerFeatured && d._status === "published")
    .map((d) => ({ id: d.id, heading: d.heading, date: dateOnly(d.date) }));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="type-display-sm text-ink">Announcements</h1>
        <Link href="/cms/announcements/new" className="type-button btn-primary">
          + Add announcement
        </Link>
      </div>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">
        Looking for the /notifications/announcements page&apos;s own eyebrow/heading/description copy? That&apos;s edited under{" "}
        <Link href="/cms/settings/site-copy" className="font-semibold text-[var(--color-primary-blue)] hover:underline">
          Site Settings → Other Page Copy
        </Link>
        {" "}(&quot;Announcements page hero&quot;) — it&apos;s shared page chrome, not one specific announcement.
      </p>

      <HomepageAnnouncements
        key={featured.map((f) => f.id).join(",")}
        initialFeatured={featured}
        candidates={candidates}
      />

      <p className="type-caption-uppercase mb-2 text-[var(--color-muted)]">All announcements</p>
      <p className="type-body-sm mb-4 max-w-[680px] text-[var(--color-muted)]">
        Drag a row by its handle to control the order they appear in on the /notifications/announcements page.
      </p>
      <AnnouncementsTable
        docs={docs.map((d) => ({ id: d.id, heading: d.heading, date: dateOnly(d.date), _status: d._status as "draft" | "published", tickerFeatured: d.tickerFeatured ?? false }))}
      />
    </div>
  );
}
