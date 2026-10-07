import { readFile } from "node:fs/promises";
import path from "node:path";

// Serves CMS uploads (public/media, public/documents) by reading from disk
// on every request. `next start` only serves public/ files that existed
// when the server booted, so an image uploaded through the CMS while the
// site is running 404s until the app is restarted. next.config.ts routes
// /media/* and /documents/* here as a *fallback* rewrite, which only
// kicks in when no static file matched, so files present at boot are
// still served statically and only newly uploaded ones come through here.

const FOLDERS = new Set(["media", "documents"]);

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
};

export async function GET(_request: Request, { params }: { params: Promise<{ folder: string; filename: string }> }) {
  const { folder, filename } = await params;

  if (!FOLDERS.has(folder) || filename !== path.basename(filename) || filename.startsWith(".")) {
    return new Response("Not found", { status: 404 });
  }

  const contentType = CONTENT_TYPES[path.extname(filename).toLowerCase()];
  if (!contentType) return new Response("Not found", { status: 404 });

  try {
    const file = await readFile(path.join(process.cwd(), "public", folder, filename));
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(file.length),
        "X-Content-Type-Options": "nosniff",
        // Uploads are never overwritten in place (Payload suffixes a
        // duplicate filename), so a long cache is safe.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
