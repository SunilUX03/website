import type { Metadata } from "next";
import { LegalPageShell, LegalSection } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Terms & Conditions — TNeGA",
  description: "Terms and conditions governing the use of the Tamil Nadu e-Governance Agency website.",
};

export default function TermsConditions() {
  return (
    <LegalPageShell
      breadcrumbLabel="Terms & Conditions"
      eyebrow="Legal"
      heading="Terms &amp; Conditions"
      intro="These terms govern your use of this website. By using this site, you agree to them."
    >
      <LegalSection heading="1. General information">
        <p>
          This website is designed, developed and maintained by the Tamil Nadu e-Governance Agency
          (TNeGA), the State Nodal Agency for e-Governance under the Government of Tamil Nadu.
        </p>
        <p>
          While every effort is made to keep the content on this website accurate and current, it
          should not be relied upon as a substitute for official Government Orders, notifications
          or legal advice.
        </p>
      </LegalSection>

      <LegalSection heading="2. Liability">
        <p>
          TNeGA will not be liable for any loss or damage, including indirect or consequential loss
          or damage, arising from the use of, or inability to use, this website or its content.
        </p>
        <p>These terms are governed by the laws of India, and any dispute is subject to the jurisdiction of the courts of Tamil Nadu.</p>
      </LegalSection>

      <LegalSection heading="3. External links">
        <p>
          This website may link to third-party websites for reference and convenience. TNeGA does
          not control and is not responsible for the content, availability or policies of those
          external sites. Visiting a linked site is at your own discretion and risk.
        </p>
      </LegalSection>

      <LegalSection heading="4. Copyright and trademarks">
        <p>
          Content on this website — including text, graphics and the TNeGA name and logo — is the
          property of TNeGA or the Government of Tamil Nadu unless otherwise stated, and may not be
          reproduced without prior written permission, except for personal or non-commercial use.
        </p>
      </LegalSection>

      <LegalSection heading="5. Unauthorised access">
        <p>
          You must not attempt to gain unauthorised access to this website, the servers it runs on,
          or any connected database or system, nor attempt to disrupt the site through any
          malicious means. Any such attempt may be reported to the relevant law enforcement
          authorities under applicable Indian law.
        </p>
      </LegalSection>

      <LegalSection heading="6. Changes to these terms">
        <p>
          TNeGA may update these terms from time to time without prior notice. Continued use of
          this website after a change constitutes acceptance of the revised terms.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
