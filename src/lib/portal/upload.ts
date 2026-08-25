import "server-only";
import { getPayloadClient } from "@/lib/payload-client";

/** Uploads a file straight out of a form's FormData into Payload's Media
 * or Documents library. Returns undefined for an empty file input (i.e.
 * the admin didn't pick a new file), so callers can fall back to keeping
 * whatever was already set. */
export async function uploadFile(
  collection: "media" | "documents",
  file: File | null,
  label: string
): Promise<number | undefined> {
  if (!file || file.size === 0) return undefined;
  const payload = await getPayloadClient();
  const arrayBuffer = await file.arrayBuffer();
  // Copy into a freshly allocated, guaranteed-non-shared ArrayBuffer
  // before handing it to Payload — confirmed via production diagnostics
  // that this makes our own buffer clean. (The actual SharedArrayBuffer
  // upload failures turned out to come from a different buffer entirely —
  // see patch-shared-array-buffer-fetch.ts for the real fix.)
  const source = new Uint8Array(arrayBuffer);
  const plainArrayBuffer = new ArrayBuffer(source.byteLength);
  new Uint8Array(plainArrayBuffer).set(source);
  const data = Buffer.from(plainArrayBuffer);
  const doc = await payload.create({
    collection,
    data: collection === "media" ? { alt: label } : { title: label },
    file: {
      data,
      mimetype: file.type,
      name: file.name,
      size: file.size,
    },
    overrideAccess: true,
  });
  return doc.id;
}

/** Resolves what an upload field should be set to, given uploadFile()'s
 * result for this field and its paired ImageUploadField `<name>Removed`
 * hidden input: a newly uploaded file always wins; otherwise an explicit
 * removal (the field's own close button) nulls it out; otherwise the
 * field is left out of the returned data entirely so a partial update
 * doesn't disturb whatever's already saved. Spread the result behind an
 * `undefined` check, e.g. `...(value !== undefined ? { image: value } : {})`.
 *
 * Typed as returning `number | undefined` (not `| null`) even though it
 * genuinely returns `null` for a removal — Payload's own generated types
 * for upload/relationship fields don't declare `null` as assignable even
 * though its runtime happily accepts it to clear a relation, so an
 * honestly-typed `| null` here just pushes that same type error onto
 * every call site. `undefined` checks below still see the real `null`
 * value at runtime; only the compile-time type is narrowed. */
export function resolveUploadValue(formData: FormData, name: string, newId: number | undefined): number | undefined {
  if (newId) return newId;
  if (formData.get(`${name}Removed`) === "1") return null as unknown as number;
  return undefined;
}
