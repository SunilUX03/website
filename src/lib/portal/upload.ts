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
  // On Vercel's runtime, file.arrayBuffer() here can hand back a view
  // whose underlying memory is still flagged shared even after routing it
  // through Buffer.from(new Uint8Array(...)) — Buffer.allocUnsafe's own
  // pooled memory isn't guaranteed non-shared on that runtime, so the
  // "shared" flag survives the copy and Vercel Blob's underlying fetch()
  // rejects the upload with "ArrayBuffer: SharedArrayBuffer is not
  // allowed." The ArrayBuffer constructor is spec-guaranteed to always
  // produce a plain, non-shared buffer, so allocate one explicitly and
  // copy the bytes in by hand rather than trusting an intermediate
  // Buffer/TypedArray allocation to do it.
  const source = new Uint8Array(arrayBuffer);
  const plainArrayBuffer = new ArrayBuffer(source.byteLength);
  new Uint8Array(plainArrayBuffer).set(source);
  const data = Buffer.from(plainArrayBuffer);
  // TEMPORARY diagnostic — the SharedArrayBuffer upload error is
  // recurring in production despite this function explicitly allocating
  // via `new ArrayBuffer()`, which should be impossible per spec. Log
  // exactly what we're handing to Payload so we can see whether the
  // "shared" flag is somehow present on our own buffer, or whether the
  // failure is happening downstream of this function instead. Remove
  // once the real cause is confirmed.
  console.error("[upload-diagnostic]", {
    arrayBufferCtor: arrayBuffer.constructor.name,
    arrayBufferIsShared: typeof SharedArrayBuffer !== "undefined" && arrayBuffer instanceof SharedArrayBuffer,
    plainArrayBufferCtor: plainArrayBuffer.constructor.name,
    plainArrayBufferIsShared: typeof SharedArrayBuffer !== "undefined" && plainArrayBuffer instanceof SharedArrayBuffer,
    dataBufferCtor: data.buffer.constructor.name,
    dataBufferIsShared: typeof SharedArrayBuffer !== "undefined" && data.buffer instanceof SharedArrayBuffer,
    isBuffer: Buffer.isBuffer(data),
  });
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
