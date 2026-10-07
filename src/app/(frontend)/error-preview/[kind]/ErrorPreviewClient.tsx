"use client";

import PublicError from "../../error";
import { GlobalErrorView } from "@/components/errors/GlobalErrorView";

export function ErrorPreviewClient({ kind }: { kind: "500" | "crash" }) {
  if (kind === "crash") return <GlobalErrorView onRetry={() => {}} />;
  const error = Object.assign(new Error("preview"), { digest: "123456789" });
  return <PublicError error={error} unstable_retry={() => {}} />;
}
