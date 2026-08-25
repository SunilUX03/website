import type { CollectionConfig } from "payload";

// Stores what visitors submit through the public /feedback form — this
// collection is never displayed on the public site itself, only in the
// CMS ("Feedback Received"). No versions/drafts: a submission either
// exists or it doesn't, there's nothing to draft. `read` lets an admin
// track what they've already looked at.
export const FeedbackSubmissions: CollectionConfig = {
  slug: "feedback-submissions",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "subject", "submittedAt", "read"],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "email", type: "text", required: true },
    { name: "subject", type: "text", required: true },
    { name: "comments", type: "textarea", required: true },
    { name: "locale", type: "text", admin: { description: "Which language the visitor was viewing the site in." } },
    {
      name: "submittedAt",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { date: { pickerAppearance: "dayAndTime" } },
    },
    { name: "read", type: "checkbox", defaultValue: false, admin: { description: "Marked once an admin has reviewed it." } },
  ],
};
