import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { FeedbackCard } from "./FeedbackCard";

export const dynamic = "force-dynamic";

export default async function FeedbackListPage() {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "feedback-submissions",
    sort: "-submittedAt",
    limit: 500,
    overrideAccess: true,
  });

  const unreadCount = docs.filter((d) => !d.read).length;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="type-display-sm text-ink">Feedback Received</h1>
        {unreadCount > 0 ? (
          <span className="badge-pill type-caption-uppercase !bg-[var(--color-primary-blue)]/10 !text-[var(--color-primary-blue)]">
            {unreadCount} unread
          </span>
        ) : null}
      </div>
      <p className="type-body-sm mb-6 max-w-[680px] text-[var(--color-muted)]">
        Submissions from the public /feedback form, newest first.
      </p>

      <div className="flex flex-col gap-3">
        {docs.map((doc) => (
          <FeedbackCard
            key={doc.id}
            canDelete={user.role === "admin"}
            row={{
              id: doc.id,
              name: doc.name,
              email: doc.email,
              subject: doc.subject,
              comments: doc.comments,
              locale: doc.locale ?? undefined,
              submittedAt: doc.submittedAt,
              read: doc.read ?? false,
            }}
          />
        ))}
        {docs.length === 0 ? (
          <p className="type-body-sm rounded-xl border border-dashed border-hairline-strong p-8 text-center text-[var(--color-muted)]">
            No feedback submitted yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}
