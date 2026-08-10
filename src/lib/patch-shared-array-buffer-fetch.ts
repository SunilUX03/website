import "server-only";

/**
 * Vercel's Node runtime can hand back binary data (from Payload's Media
 * uploads — the original file, and the thumbnail/card sizes sharp
 * generates internally) whose underlying ArrayBuffer is flagged shared,
 * even after copying it into a fresh Buffer at the point where our own
 * code reads it (confirmed via production diagnostics — our own upload
 * buffer measured non-shared, yet the same request still failed further
 * downstream, inside @vercel/blob's fetch() call, on a buffer we never
 * touch — most likely one of Payload's own sharp-generated image sizes).
 * fetch() unconditionally rejects any body backed by a SharedArrayBuffer
 * ("ArrayBuffer: SharedArrayBuffer is not allowed"), and there's no
 * hook into Payload's or sharp's internals to fix it at the source.
 *
 * This patches the one choke point every one of those uploads passes
 * through: the global fetch() call itself. Any binary body gets copied
 * into a freshly allocated, guaranteed-non-shared ArrayBuffer (the same
 * technique already verified safe for our own buffers) immediately
 * before the real fetch() runs. Import this once, for its side effect,
 * before anything that might upload to Vercel Blob.
 */
let patched = false;

export function patchFetchToStripSharedArrayBuffers(): void {
  if (patched) return;
  patched = true;

  const originalFetch = globalThis.fetch;

  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    if (init?.body && ArrayBuffer.isView(init.body)) {
      const view = init.body as Uint8Array;
      const copy = new Uint8Array(new ArrayBuffer(view.byteLength));
      copy.set(view);
      init = { ...init, body: copy };
    }
    return originalFetch(input, init);
  }) as typeof fetch;
}

patchFetchToStripSharedArrayBuffers();
