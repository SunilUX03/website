// The 17 services/projects that used to live here are now the "services"
// Payload collection (see lib/cms/services.ts and
// lib/cms/service-types.ts, which mirrors the old ServiceItem/RealContent
// shape field-for-field). This file now only keeps the static /services
// page hero copy — everything else (item data, slugify, statsToBullets,
// getServiceItemBySlug, getServiceItemsByNames) moved to the CMS layer.

export const heroOrbs = [
  { color: "sky", className: "-left-32 -top-20 h-[420px] w-[420px]" },
  { color: "lavender", className: "-right-24 bottom-0 h-[360px] w-[360px]" },
] as const;
