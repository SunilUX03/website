import { LegalPageShell, LegalSection, LegalList } from "./LegalPageShell";
import type { CmsLegalPage } from "@/lib/cms/legal-pages";

/** Renders any of the CMS-backed legal pages (Privacy Policy, Terms &
 * Conditions, Terms of Use, Disclaimer, Help) from one shared component,
 * since they're all the same shape: an intro plus heading+body sections,
 * where a body paragraph written as "- " lines becomes a bullet list. */
export function LegalPageContent({ page, breadcrumbLabel }: { page: CmsLegalPage; breadcrumbLabel: string }) {
  return (
    <LegalPageShell breadcrumbLabel={breadcrumbLabel} eyebrow={page.eyebrow} heading={page.title} intro={page.intro}>
      {page.sections.map((section) => (
        <LegalSection key={section.heading} heading={section.heading}>
          {section.paragraphs.map((p, i) =>
            p.isList ? (
              <LegalList key={i} items={p.text.split("\n")} />
            ) : (
              <p key={i}>{p.text}</p>
            )
          )}
        </LegalSection>
      ))}
    </LegalPageShell>
  );
}
