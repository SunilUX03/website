// One-off script: migrates the 5 legal pages (Privacy Policy, Terms &
// Conditions, Terms of Use, Disclaimer, Help) plus Feedback's intro copy
// — previously hardcoded JSX — into the new "legal-pages" collection.
// Transcribed by hand (not import-and-map, unlike the GO/Policy seed)
// since this is short, simple prose, not a large structured dataset.
//
//   node --env-file=.env.local ./node_modules/.bin/tsx scripts/seed-legal-pages.ts
//
import { getPayload } from "payload";
import config from "../src/payload.config";
import type { LegalPage } from "../src/payload-types";

const PAGES: (Pick<LegalPage, "slug" | "title" | "eyebrow"> & { intro?: string; sections: { heading: string; body: string }[] })[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    eyebrow: "Legal",
    intro: "This policy explains what information this website collects and how it is used.",
    sections: [
      {
        heading: "Information we collect",
        body: "This website may collect the following categories of information:\n\n- Information you submit directly, for example through the Feedback or Careers application forms (name, email, and the content of your message).\n- Standard technical information collected automatically by any website, such as browser type and pages visited, used only in aggregate to understand site usage.",
      },
      {
        heading: "How we use it",
        body: "Information you submit is used only to respond to your query, application or feedback. It is not sold, rented or shared with third parties for marketing purposes.",
      },
      {
        heading: "Cookies",
        body: "This site may use essential cookies required for it to function correctly. It does not use cookies for third-party advertising.",
      },
      {
        heading: "External links",
        body: "This website links to external and social media sites for convenience. Those sites have their own privacy policies, which TNeGA does not control.",
      },
      {
        heading: "Data protection",
        body: "TNeGA handles personal information in line with the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023, and applicable Government of Tamil Nadu guidelines.",
      },
      {
        heading: "Contact",
        body: "Questions about this policy can be sent to tnega@tn.gov.in.",
      },
    ],
  },
  {
    slug: "terms-conditions",
    title: "Terms & Conditions",
    eyebrow: "Legal",
    intro: "These terms govern your use of this website. By using this site, you agree to them.",
    sections: [
      {
        heading: "1. General information",
        body: "This website is designed, developed and maintained by the Tamil Nadu e-Governance Agency (TNeGA), the State Nodal Agency for e-Governance under the Government of Tamil Nadu.\n\nWhile every effort is made to keep the content on this website accurate and current, it should not be relied upon as a substitute for official Government Orders, notifications or legal advice.",
      },
      {
        heading: "2. Liability",
        body: "TNeGA will not be liable for any loss or damage, including indirect or consequential loss or damage, arising from the use of, or inability to use, this website or its content.\n\nThese terms are governed by the laws of India, and any dispute is subject to the jurisdiction of the courts of Tamil Nadu.",
      },
      {
        heading: "3. External links",
        body: "This website may link to third-party websites for reference and convenience. TNeGA does not control and is not responsible for the content, availability or policies of those external sites. Visiting a linked site is at your own discretion and risk.",
      },
      {
        heading: "4. Copyright and trademarks",
        body: "Content on this website, including text, graphics and the TNeGA name and logo, is the property of TNeGA or the Government of Tamil Nadu unless otherwise stated, and may not be reproduced without prior written permission, except for personal or non-commercial use.",
      },
      {
        heading: "5. Unauthorised access",
        body: "You must not attempt to gain unauthorised access to this website, the servers it runs on, or any connected database or system, nor attempt to disrupt the site through any malicious means. Any such attempt may be reported to the relevant law enforcement authorities under applicable Indian law.",
      },
      {
        heading: "6. Changes to these terms",
        body: "TNeGA may update these terms from time to time without prior notice. Continued use of this website after a change constitutes acceptance of the revised terms.",
      },
    ],
  },
  {
    slug: "terms-of-use",
    title: "Terms of Use",
    eyebrow: "Legal",
    intro: "These terms cover how this website's content may be used, separately from the general Terms & Conditions above.",
    sections: [
      {
        heading: "Acceptable use",
        body: "You may browse and use this website for personal, non-commercial, and lawful purposes only. You must not:\n\n- Use this website in any way that could damage, disable or impair it, or interfere with anyone else's use of it.\n- Attempt to gain unauthorised access to any part of this website or its underlying systems.\n- Use automated tools to scrape or systematically extract content from this website without prior permission.",
      },
      {
        heading: "Intellectual property",
        body: "Unless otherwise noted, text, graphics and the TNeGA name and logo on this website belong to TNeGA or the Government of Tamil Nadu. You may view, download and print pages for your own personal, non-commercial use, provided you don't modify the content or remove any copyright notice.",
      },
      {
        heading: "Linking to this website",
        body: "You're welcome to link to this website, provided the link doesn't suggest false endorsement or association, and doesn't present TNeGA content in a misleading context (such as within a frame on another site).",
      },
      {
        heading: "Changes to this website",
        body: "TNeGA may update, suspend or discontinue any part of this website at any time, without prior notice.",
      },
    ],
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    eyebrow: "Legal",
    intro: undefined,
    sections: [
      {
        heading: "Content accuracy",
        body: "The information on this website is provided by TNeGA in good faith, with reasonable efforts made to keep it accurate and up to date. However, TNeGA makes no warranty, express or implied, about the completeness, accuracy, reliability or availability of any information on this site for any purpose.",
      },
      {
        heading: "Not a substitute for official records",
        body: "Content here is for general informational purposes only. In case of any discrepancy between this website and an official Government Order, notification, or other legal document, the official document takes precedence.",
      },
      {
        heading: "External links",
        body: "Links to external websites are provided for convenience. TNeGA does not endorse, and is not responsible for, the content or availability of any linked third-party site.",
      },
      {
        heading: "Technical issues",
        body: "TNeGA does not guarantee that this website, or any service linked from it, will be available uninterrupted or error-free. Access may occasionally be affected by maintenance or technical issues outside our control.",
      },
      {
        heading: "Liability",
        body: "Under no circumstances will TNeGA be liable for any loss or damage, including indirect or consequential loss, arising from the use of, or reliance on, this website.",
      },
    ],
  },
  {
    slug: "help",
    title: "Help",
    eyebrow: "Support",
    intro: "Having trouble accessing or navigating this website? This page covers the most common questions.",
    sections: [
      {
        heading: "Viewing documents on this site",
        body: "Documents on this site are published as PDFs. To view them, your browser needs a PDF reader. Most modern browsers (Chrome, Edge, Firefox, Safari) can open PDFs directly with no extra software. If a document doesn't open, try downloading it and opening it with Adobe Acrobat Reader or another PDF viewer.",
      },
      {
        heading: "Accessibility options",
        body: 'This site includes an accessibility toolbar for adjusting text size, contrast and other display options. Look for the "Accessibility" control in the top bar of every page, or the same link in the footer below.',
      },
      {
        heading: "Browsing on mobile",
        body: "The site is built to work on phones, tablets and desktops. If something looks broken on your device, try refreshing the page or updating your browser to its latest version.",
      },
      {
        heading: "Still need help?",
        body: "If you couldn't find what you were looking for, reach out through our Contact Us page (/reach-us), or use the Feedback form (/feedback) to tell us what went wrong.\n\n- General queries and support: tnega@tn.gov.in\n- Helpline: 044-4016 4900",
      },
    ],
  },
  {
    slug: "feedback",
    title: "We'd like to hear from you",
    eyebrow: "Support",
    intro: "Have a question, suggestion or issue with this website? Share it below.",
    sections: [],
  },
];

async function main() {
  const payload = await getPayload({ config });

  for (const page of PAGES) {
    const existing = await payload.find({
      collection: "legal-pages",
      where: { slug: { equals: page.slug } },
      limit: 1,
      overrideAccess: true,
    });

    const data = { ...page, _status: "published" as const };

    if (existing.docs[0]) {
      await payload.update({ collection: "legal-pages", id: existing.docs[0].id, data, overrideAccess: true });
      console.log(`Updated: ${page.slug}`);
    } else {
      await payload.create({ collection: "legal-pages", data, overrideAccess: true });
      console.log(`Created: ${page.slug}`);
    }
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
