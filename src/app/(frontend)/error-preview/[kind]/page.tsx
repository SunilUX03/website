import { notFound } from "next/navigation";
import { ErrorPreviewClient } from "./ErrorPreviewClient";

// Development-only previews of the two error pages that can't be reached by
// URL: the 500 page and the whole-layout crash page. 404 in production.
export default async function ErrorPreview({ params }: { params: Promise<{ kind: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { kind } = await params;
  if (kind !== "500" && kind !== "crash") notFound();
  return <ErrorPreviewClient kind={kind} />;
}
