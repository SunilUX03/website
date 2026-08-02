import type { Metadata } from "next";
import { LegalPageShell, LegalSection, LegalList } from "@/components/legal/LegalPageShell";
import { footer } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy — TNeGA",
  description: "How the Tamil Nadu e-Governance Agency collects, uses and protects information on this website.",
};

export default function PrivacyPolicy() {
  return (
    <LegalPageShell
      breadcrumbLabel="Privacy Policy"
      eyebrow="Legal"
      heading="Privacy Policy"
      intro="This policy explains what information this website collects and how it is used."
    >
      <LegalSection heading="Information we collect">
        <p>This website may collect the following categories of information:</p>
        <LegalList
          items={[
            "Information you submit directly — for example through the Feedback or Careers application forms (name, email, and the content of your message).",
            "Standard technical information collected automatically by any website — such as browser type and pages visited — used only in aggregate to understand site usage.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="How we use it">
        <p>
          Information you submit is used only to respond to your query, application or feedback. It
          is not sold, rented or shared with third parties for marketing purposes.
        </p>
      </LegalSection>

      <LegalSection heading="Cookies">
        <p>
          This site may use essential cookies required for it to function correctly. It does not
          use cookies for third-party advertising.
        </p>
      </LegalSection>

      <LegalSection heading="External links">
        <p>
          This website links to external and social media sites for convenience. Those sites have
          their own privacy policies, which TNeGA does not control.
        </p>
      </LegalSection>

      <LegalSection heading="Data protection">
        <p>
          TNeGA handles personal information in line with the Information Technology Act, 2000 and
          the Digital Personal Data Protection Act, 2023, and applicable Government of Tamil Nadu
          guidelines.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about this policy can be sent to{" "}
          <a href={`mailto:${footer.email}`} className="text-[var(--color-primary-blue)] underline underline-offset-2">
            {footer.email}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
