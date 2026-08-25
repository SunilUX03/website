import { LegalPageShell, LegalSection, LegalList } from "./LegalPageShell";
import type { CmsLegalPage } from "@/lib/cms/legal-pages";
import type { Locale } from "@/lib/locale";

/** Renders any of the CMS-backed legal pages (Privacy Policy, Terms &
 * Conditions, Terms of Use, Disclaimer, Help) from one shared component,
 * since they're all the same shape: an intro plus heading+body sections,
 * where a body paragraph written as "- " lines becomes a bullet list. */
export function LegalPageContent({
  page,
  breadcrumbLabel,
  locale = "en",
}: {
  page: CmsLegalPage;
  breadcrumbLabel: string;
  locale?: Locale;
}) {
  return (
    <LegalPageShell breadcrumbLabel={breadcrumbLabel} eyebrow={page.eyebrow} heading={page.title} intro={page.intro} locale={locale}>
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
