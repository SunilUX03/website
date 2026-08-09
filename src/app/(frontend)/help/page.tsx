import type { Metadata } from "next";
import { LegalPageShell, LegalSection, LegalList } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Help | TNeGA",
  description: "Help with accessing and navigating the TNeGA website: file formats, accessibility options and where to get further support.",
};

export default function Help() {
  return (
    <LegalPageShell
      breadcrumbLabel="Help"
      eyebrow="Support"
      heading="Help"
      intro="Having trouble accessing or navigating this website? This page covers the most common questions."
    >
      <LegalSection heading="Viewing documents on this site">
        <p>
          Documents on this site are published as PDFs. To view them, your browser needs a PDF
          reader. Most modern browsers (Chrome, Edge, Firefox, Safari) can open PDFs directly with
          no extra software. If a document doesn&apos;t open, try downloading it and opening it with
          Adobe Acrobat Reader or another PDF viewer.
        </p>
      </LegalSection>

      <LegalSection heading="Accessibility options">
        <p>
          This site includes an accessibility toolbar for adjusting text size, contrast and other
          display options. Look for the &ldquo;Accessibility&rdquo; control in the top bar of every
          page, or the same link in the footer below.
        </p>
      </LegalSection>

      <LegalSection heading="Browsing on mobile">
        <p>
          The site is built to work on phones, tablets and desktops. If something looks broken on
          your device, try refreshing the page or updating your browser to its latest version.
        </p>
      </LegalSection>

      <LegalSection heading="Still need help?">
        <p>
          If you couldn&apos;t find what you were looking for, reach out through our{" "}
          <a href="/reach-us" className="text-[var(--color-primary-blue)] underline underline-offset-2">
            Contact Us
          </a>{" "}
          page, or use the{" "}
          <a href="/feedback" className="text-[var(--color-primary-blue)] underline underline-offset-2">
            Feedback
          </a>{" "}
          form to tell us what went wrong.
        </p>
        <LegalList
          items={[
            "General queries and support: tnega@tn.gov.in",
            "Helpline: 044-4016 4900",
          ]}
        />
      </LegalSection>
    </LegalPageShell>
  );
}
