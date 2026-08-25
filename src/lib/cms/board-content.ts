import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/payload-client";
import type { Locale } from "@/lib/locale";

export type BoardSeat = { role: string; name: string; title: string };
export type BoardMember = { id?: string; name: string; title: string; isPlaceholder: boolean };

export type CmsBoardContent = {
  chairman: BoardSeat;
  memberSecretary: BoardSeat;
  members: BoardMember[];
};

const EMPTY_SEAT: BoardSeat = { role: "", name: "", title: "" };
const EMPTY: CmsBoardContent = { chairman: EMPTY_SEAT, memberSecretary: EMPTY_SEAT, members: [] };

/** BoardOfDirectors.tsx is rendered on /about only, but this still uses
 * unstable_cache (not a page-level `revalidate` export) for the same
 * reason as nav-content: consistent, low-effort self-revalidation
 * regardless of which page ends up rendering it. */
export const getBoardContent = unstable_cache(
  async (locale: Locale = "en"): Promise<CmsBoardContent> => {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({ slug: "board-content", locale, depth: 0, overrideAccess: false });
    if (!doc) return EMPTY;
    return {
      chairman: { role: doc.chairman?.role ?? "", name: doc.chairman?.name ?? "", title: doc.chairman?.title ?? "" },
      memberSecretary: {
        role: doc.memberSecretary?.role ?? "",
        name: doc.memberSecretary?.name ?? "",
        title: doc.memberSecretary?.title ?? "",
      },
      members: doc.members?.map((m) => ({ id: m.id ?? undefined, name: m.name, title: m.title ?? "", isPlaceholder: m.isPlaceholder ?? false })) ?? [],
    };
  },
  ["board-content"],
  { revalidate: 60, tags: ["board-content"] }
);
