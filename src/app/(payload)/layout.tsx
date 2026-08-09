import type { ServerFunctionClient } from "payload";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import "@payloadcms/next/css";
import config from "@/payload.config";
import { importMap } from "./cms/importMap";

type Args = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

// A completely separate <html>/<body> shell from the site's own root
// layout in (frontend) — Payload's admin UI ships its own styling and
// providers, and the two must never be nested inside each other. Next.js
// supports exactly this ("multiple root layouts") as long as each lives
// in its own top-level route group with nothing shared above it.
export default function Layout({ children }: Args) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
