import type { Metadata } from "next";
import { LegalPageShell, LegalSection, LegalList } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Terms of Use — TNeGA",
  description: "Acceptable use, intellectual property and linking policy for the Tamil Nadu e-Governance Agency website.",
};

export default function TermsOfUse() {
  return (
    <LegalPageShell
      breadcrumbLabel="Terms of Use"
      eyebrow="Legal"
      heading="Terms of Use"
      intro="These terms cover how this website's content may be used, separately from the general Terms & Conditions above."
    >
      <LegalSection heading="Acceptable use">
        <p>You may browse and use this website for personal, non-commercial, and lawful purposes only. You must not:</p>
        <LegalList
          items={[
            "Use this website in any way that could damage, disable or impair it, or interfere with anyone else's use of it.",
            "Attempt to gain unauthorised access to any part of this website or its underlying systems.",
            "Use automated tools to scrape or systematically extract content from this website without prior permission.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="Intellectual property">
        <p>
          Unless otherwise noted, text, graphics and the TNeGA name and logo on this website belong
          to TNeGA or the Government of Tamil Nadu. You may view, download and print pages for your
          own personal, non-commercial use, provided you don&apos;t modify the content or remove
          any copyright notice.
        </p>
      </LegalSection>

      <LegalSection heading="Linking to this website">
        <p>
          You&apos;re welcome to link to this website, provided the link doesn&apos;t suggest false
          endorsement or association, and doesn&apos;t present TNeGA content in a misleading
          context (such as within a frame on another site).
        </p>
      </LegalSection>

      <LegalSection heading="Changes to this website">
        <p>
          TNeGA may update, suspend or discontinue any part of this website at any time, without
          prior notice.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
