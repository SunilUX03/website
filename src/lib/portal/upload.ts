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
  // Buffer.from(arrayBuffer) is a zero-copy VIEW over that same memory —
  // on Vercel's runtime the ArrayBuffer handed back here can be backed by
  // a SharedArrayBuffer, and that "shared" flag carries straight through
  // into the view. Vercel Blob's underlying fetch() then rejects the
  // upload with "ArrayBuffer: SharedArrayBuffer is not allowed." Routing
  // through a Uint8Array first forces an actual copy into fresh, ordinary
  // memory (Buffer.from(typedArray) always copies).
  const doc = await payload.create({
    collection,
    data: collection === "media" ? { alt: label } : { title: label },
    file: {
      data: Buffer.from(new Uint8Array(arrayBuffer)),
      mimetype: file.type,
      name: file.name,
      size: file.size,
    },
    overrideAccess: true,
  });
  return doc.id;
}
