/** Guards every edit-page save in the portal against silently overwriting
 * a newer change with stale form data — the exact bug class that bit the
 * Footer's "Initiatives & Projects" column: an admin has a locale tab (or
 * just a browser tab) sitting open from before someone else's edit, and
 * saving it resubmits the WHOLE form, including array rows the page
 * loaded with. Without this check, that silently un-deletes a row that
 * was removed elsewhere in the meantime — usually with only one locale's
 * text, since the stale save never had the other locale's edit.
 *
 * Every edit page threads the document's `updatedAt` (as it was AT PAGE
 * LOAD) through a hidden `_loadedUpdatedAt` field. Every update action
 * calls `isStale()` with that value and the document's CURRENT
 * `updatedAt` (fetched right before writing) — if they differ, something
 * changed this doc since the page was loaded, so the save is rejected
 * with a clear message instead of proceeding.
 *
 * Plain boolean check, not a thrown/caught error: an `instanceof` check
 * on an error class crossing a Server Action boundary is fragile under
 * Next.js dev bundling (multiple module instances of the same file), and
 * a boolean is simpler to reason about anyway for what's just a business
 * rule, not an exceptional condition. */
export const STALE_CONTENT_MESSAGE =
  "This was changed elsewhere since you opened this page. Reload the page and redo your edit.";

export function isStale(currentUpdatedAt: string | null | undefined, loadedUpdatedAt: string | null | undefined): boolean {
  // A brand-new document (no loadedUpdatedAt captured, e.g. a "new" page
  // that has no doc yet) or a collection that doesn't track updatedAt
  // has nothing to compare — only enforce the check when both sides are
  // present.
  if (!loadedUpdatedAt || !currentUpdatedAt) return false;
  return loadedUpdatedAt !== currentUpdatedAt;
}
