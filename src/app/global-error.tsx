"use client";

import { GlobalErrorView } from "@/components/errors/GlobalErrorView";

// Last-resort page for when the root layout itself fails. It replaces the
// whole document, so it needs its own <html>/<body>; the content is
// self-contained (see GlobalErrorView) so nothing here can fail in turn.
export default function GlobalError({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  return (
    <html lang="en">
      <head>
        <title>Something went wrong | TNeGA</title>
        <meta name="robots" content="noindex" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0 }}>
        <GlobalErrorView onRetry={unstable_retry} />
      </body>
    </html>
  );
}
