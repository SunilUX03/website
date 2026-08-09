/** Kept separate from footer.ts for the same reason as announcement-types.ts
 * — FooterClient.tsx is a client component and can't import the Payload
 * Local API module. */
export type FooterLink = { label: string; href: string };

export type CmsFooterContent = {
  description: string;
  address: string;
  mapsHref: string;
  phone: string;
  email: string;
  socialLinks: FooterLink[];
  quickLinks: FooterLink[];
  citizenServices: FooterLink[];
  helpSupport: FooterLink[];
};
