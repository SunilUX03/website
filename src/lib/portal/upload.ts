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
