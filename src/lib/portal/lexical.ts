import "server-only";

/** Plain-text <-> Lexical JSON, for form fields that edit a richText
 * field as a simple multi-paragraph textarea instead of embedding a full
 * WYSIWYG editor — Phase 1 scope deliberately keeps this simple; blank
 * lines separate paragraphs, no bold/links/lists. Mirrors the shape used
 * by the original seed scripts (scripts/seed-announcements.ts). */
export function textToLexical(text: string) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return {
    root: {
      type: "root",
      direction: "ltr" as const,
      format: "" as const,
      indent: 0,
      version: 1,
      children: paragraphs.map((paragraph) => ({
        type: "paragraph",
        direction: "ltr" as const,
        format: "" as const,
        indent: 0,
        version: 1,
        children: [
          { type: "text", detail: 0, format: 0, mode: "normal", style: "", text: paragraph, version: 1 },
        ],
      })),
    },
  };
}

type LexicalNode = { type: string; text?: string; children?: LexicalNode[] };

export function lexicalToText(doc: unknown): string {
  if (!doc || typeof doc !== "object") return "";
  const root = (doc as { root?: LexicalNode }).root;
  if (!root?.children) return "";
  return root.children
    .map((node) => (node.children ?? []).map((child) => child.text ?? "").join(""))
    .filter(Boolean)
    .join("\n\n");
}
