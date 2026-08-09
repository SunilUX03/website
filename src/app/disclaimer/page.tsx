import type { Metadata } from "next";
import { LegalPageShell, LegalSection } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Disclaimer | TNeGA",
  description: "Disclaimer regarding the content and use of the Tamil Nadu e-Governance Agency website.",
};

export default function Disclaimer() {
  return (
    <LegalPageShell breadcrumbLabel="Disclaimer" eyebrow="Legal" heading="Disclaimer">
      <LegalSection heading="Content accuracy">
        <p>
          The information on this website is provided by TNeGA in good faith, with reasonable
          efforts made to keep it accurate and up to date. However, TNeGA makes no warranty,
          express or implied, about the completeness, accuracy, reliability or availability of any
          information on this site for any purpose.
        </p>
      </LegalSection>

      <LegalSection heading="Not a substitute for official records">
        <p>
          Content here is for general informational purposes only. In case of any discrepancy
          between this website and an official Government Order, notification, or other legal
          document, the official document takes precedence.
        </p>
      </LegalSection>

      <LegalSection heading="External links">
        <p>
          Links to external websites are provided for convenience. TNeGA does not endorse, and is
          not responsible for, the content or availability of any linked third-party site.
        </p>
      </LegalSection>

      <LegalSection heading="Technical issues">
        <p>
          TNeGA does not guarantee that this website, or any service linked from it, will be
          available uninterrupted or error-free. Access may occasionally be affected by maintenance
          or technical issues outside our control.
        </p>
      </LegalSection>

      <LegalSection heading="Liability">
        <p>
          Under no circumstances will TNeGA be liable for any loss or damage, including indirect or
          consequential loss, arising from the use of, or reliance on, this website.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
