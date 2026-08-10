#!/usr/bin/env node
// One-off migration script for the self-hosted cutover: downloads every
// file currently stored in Vercel Blob into public/media/ (images) and
// public/documents/ (everything else), preserving filenames so they
// match the existing Media/Documents records already in the database.
//
// Run once, then this script (and BLOB_READ_WRITE_TOKEN) can be
// discarded — it isn't part of the app.
//
// Usage:
//   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_... node scripts/download-blob-files.mjs

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error("Set BLOB_READ_WRITE_TOKEN before running this script.");
  process.exit(1);
}

// Matches @vercel/blob's own token parsing: vercel_blob_rw_<storeId>_<random>
const storeId = token.split("_")[3];
if (!storeId) {
  console.error("Could not parse a store ID out of BLOB_READ_WRITE_TOKEN — check the token is correct.");
  process.exit(1);
}

const API_BASE = "https://vercel.com/api/blob";
const API_VERSION = "12";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"]);

const MEDIA_DIR = path.resolve("public/media");
const DOCUMENTS_DIR = path.resolve("public/documents");

function apiHeaders() {
  return {
    authorization: `Bearer ${token}`,
    "x-vercel-blob-store-id": storeId,
    "x-api-version": API_VERSION,
  };
}

async function listAllBlobs() {
  const blobs = [];
  let cursor;
  do {
    const url = new URL(API_BASE);
    url.searchParams.set("limit", "1000");
    if (cursor) url.searchParams.set("cursor", cursor);

    const res = await fetch(url, { headers: apiHeaders() });
    if (!res.ok) {
      throw new Error(`List request failed: ${res.status} ${await res.text()}`);
    }
    const data = await res.json();
    blobs.push(...data.blobs);
    cursor = data.hasMore ? data.cursor : undefined;
  } while (cursor);
  return blobs;
}

async function downloadBlob(blob) {
  const filename = path.basename(blob.pathname);
  const ext = path.extname(filename).toLowerCase();
  const destDir = IMAGE_EXTENSIONS.has(ext) ? MEDIA_DIR : DOCUMENTS_DIR;
  const destPath = path.join(destDir, filename);

  const res = await fetch(blob.url);
  if (!res.ok) {
    console.error(`  FAILED (${res.status}): ${filename}`);
    return false;
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(destPath, buffer);
  return true;
}

async function main() {
  await mkdir(MEDIA_DIR, { recursive: true });
  await mkdir(DOCUMENTS_DIR, { recursive: true });

  console.log("Listing files in Vercel Blob...");
  const blobs = await listAllBlobs();
  console.log(`Found ${blobs.length} files. Downloading...`);

  let ok = 0;
  for (const blob of blobs) {
    const success = await downloadBlob(blob);
    if (success) ok++;
    console.log(`  ${success ? "OK  " : "FAIL"}  ${blob.pathname}`);
  }

  console.log(`\nDone: ${ok}/${blobs.length} files downloaded.`);
  console.log(`Images -> ${MEDIA_DIR}`);
  console.log(`Everything else -> ${DOCUMENTS_DIR}`);
  if (ok < blobs.length) {
    console.log("\nSome files failed — re-run the script, it's safe to run again (files just get overwritten).");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
