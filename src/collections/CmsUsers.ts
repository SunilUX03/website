import type { CollectionConfig } from "payload";

// The CMS's own login — deliberately separate from the Careers HR login
// (NextAuth + Prisma, at /admin/login). Two unrelated systems reusing the
// same word "admin" would be confusing; this one lives at /cms.
export const CmsUsers: CollectionConfig = {
  slug: "cms-users",
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  access: {
    // Only a logged-in CMS user can see the user list at all — nobody
    // browsing the public site ever hits this collection.
    read: ({ req: { user } }) => Boolean(user),
    // Only an admin can create/edit/delete other CMS accounts — an editor
    // can't grant themselves more access or add new logins.
    create: ({ req: { user } }) => user?.role === "admin",
    update: ({ req: { user } }) => user?.role === "admin",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  // Payload's own "create first user" screen only ever collects
  // email + password, regardless of what other fields a collection
  // defines — so every other field here has to tolerate being absent on
  // that very first save.
  fields: [
    {
      name: "name",
      type: "text",
      // Not required: the create-first-user screen can't collect it, and
      // failing that save with a "name is required" error would leave
      // literally no way to log in. Editable afterwards from Account.
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Editor — can edit and save drafts", value: "editor" },
        { label: "Admin — can also publish and manage logins", value: "admin" },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ operation, data, req }) => {
        // The very first CMS account has nobody else around who could
        // promote it to admin later (update access requires an existing
        // admin) — force it to admin rather than create a permanently
        // stuck editor-only login.
        if (operation === "create") {
          const { totalDocs } = await req.payload.count({ collection: "cms-users" });
          if (totalDocs === 0) return { ...data, role: "admin" };
        }
        return data;
      },
    ],
  },
};
