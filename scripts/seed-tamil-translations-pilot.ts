// One-off script: writes Tamil (ta) translations for the pilot localized
// fields (nav, footer, hero, site-copy). Run after
// 20260820_210000_add_localization_pilot has been applied and the
// existing English content has been confirmed intact.
//
//   node --env-file=.env.local ./node_modules/.bin/tsx scripts/seed-tamil-translations-pilot.ts
//
// IMPORTANT: array rows (nav links, footer links, hero cycle words,
// reachUsPanels) share one `id` across locales. Writing a locale update
// with row objects that omit `id` makes Payload treat every row as brand
// new, silently deleting the OTHER locale's data that lived on the old
// row — this is exactly what corrupted the English nav/footer/hero data
// the first time this script ran. Every array row below is matched to
// its current EN-side id (fetched first) before being written.
import { getPayload } from "payload";
import config from "../src/payload.config";

function withIds<T extends { href?: string }>(enRows: { id?: string | null; href?: string | null }[], rows: T[]): (T & { id?: string })[] {
  return rows.map((row) => {
    const match = enRows.find((r) => r.href === row.href);
    return match?.id ? { ...row, id: match.id } : row;
  });
}

async function main() {
  const payload = await getPayload({ config });

  const navEn = await payload.findGlobal({ slug: "nav-content", locale: "en", overrideAccess: true });
  await payload.updateGlobal({
    slug: "nav-content",
    locale: "ta",
    data: {
      govLabel: "தமிழ்நாடு அரசு",
      about: withIds(navEn.about ?? [], [
        { label: "கண்ணோட்டம்", href: "/about" },
        { label: "தலைமை", href: "/about#leadership" },
        { label: "நிறுவன கட்டமைப்பு", href: "/about#organisation-structure" },
        { label: "வேலைவாய்ப்புகள்", href: "/about/careers" },
      ]),
      services: withIds(navEn.services ?? [], [
        { label: "குடிமக்கள் சேவைகள்", href: "/services#citizen-services" },
        { label: "மின்-ஆளுமை திட்டங்கள்", href: "/services#e-governance-projects" },
        { label: "சேவைகள்", href: "/services#services" },
      ]),
      notificationsUpdates: withIds(navEn.notificationsUpdates ?? [], [
        { label: "அறிவிப்புகள்", href: "/notifications/announcements" },
        { label: "ஊடகம் & பத்திரிகை", href: "/notifications/media-press" },
      ]),
      notificationsDocuments: withIds(navEn.notificationsDocuments ?? [], [
        { label: "தகவல் அறியும் உரிமை", href: "/notifications/rti" },
        { label: "டெண்டர்கள்", href: "/notifications/tenders" },
        { label: "அரசு ஆணைகள்", href: "/notifications/government-orders" },
        { label: "கொள்கைகள் & வழிகாட்டுதல்கள்", href: "/notifications/policies-guidelines" },
      ]),
    },
    overrideAccess: true,
  });
  console.log("nav-content (ta) seeded.");

  const footerEn = await payload.findGlobal({ slug: "footer-content", locale: "en", overrideAccess: true });
  await payload.updateGlobal({
    slug: "footer-content",
    locale: "ta",
    data: {
      description: "தமிழ்நாட்டில் மின் ஆளுமையை முன்னெடுத்தல்",
      address:
        "தமிழ்நாடு மின்-ஆளுமை முகமை\nஇரண்டாம் & ஏழாம் தளம், பி.டி.லீ. செங்கல்வராய நாயக்கர் கட்டிடம்,\nஅண்ணா சாலை, சென்னை - 600 002. எல்.ஐ.சி. கட்டிடத்திற்கு எதிரில்",
      quickLinks: withIds(footerEn.quickLinks ?? [], [
        { label: "முகப்பு", href: "/" },
        { label: "எங்களைப் பற்றி", href: "/about" },
        { label: "சேவைகள்", href: "/services" },
        { label: "வேலைவாய்ப்புகள்", href: "/about/careers" },
        { label: "தகவல் அறியும் உரிமை", href: "/notifications/rti" },
      ]),
      citizenServices: withIds(footerEn.citizenServices ?? [], [
        { label: "இ-சேவை", href: "/services/citizen/e-sevai" },
        { label: "நம்ம அரசு", href: "/services/citizen/namma-arasu" },
        { label: "TN GIS", href: "/projects/tn-gis" },
        { label: "UMIS", href: "/projects/umis" },
      ]),
      helpSupport: withIds(footerEn.helpSupport ?? [], [
        { label: "உதவி", href: "/help" },
        { label: "கருத்து தெரிவிப்பு", href: "/feedback" },
        { label: "விதிமுறைகள் & நிபந்தனைகள்", href: "/terms-conditions" },
        { label: "எங்களை தொடர்பு கொள்ள", href: "/reach-us" },
        { label: "தள வரைபடம்", href: "/sitemap" },
      ]),
    },
    overrideAccess: true,
  });
  console.log("footer-content (ta) seeded.");

  const heroEn = await payload.findGlobal({ slug: "hero-content", locale: "en", overrideAccess: true });
  const heroWords = ["ஆளுமை", "கட்டமைப்பு", "சேவைகள்"];
  await payload.updateGlobal({
    slug: "hero-content",
    locale: "ta",
    data: {
      // agencyLabelCycle intentionally left untranslated — it already
      // cycles between the English and Tamil agency names as two array
      // entries, regardless of site locale (a design choice that
      // predates localization). Falls back to the "en" locale's value,
      // which already contains the Tamil string as its second entry.
      headlineTemplate: "தமிழ்நாட்டில் மின்னணு {word} மேம்பாடு",
      headlineCycleWords: (heroEn.headlineCycleWords ?? []).map((row, i) =>
        row.id ? { id: row.id, word: heroWords[i] } : { word: heroWords[i] }
      ),
      tagline: "தமிழ்நாடு முழுவதும் பாதுகாப்பான, குடிமக்கள்-முதன்மையான மின்னணு பொது உள்கட்டமைப்பை உருவாக்குதல்.",
    },
    overrideAccess: true,
  });
  console.log("hero-content (ta) seeded.");

  const siteCopyEn = await payload.findGlobal({ slug: "site-copy-content", locale: "en", overrideAccess: true });
  const reachUsPanelsTa = [
    {
      eyebrow: "ஆதரவு",
      title: "எங்களை தொடர்பு கொள்ள",
      description:
        "அதிகாரப்பூர்வ TNeGA டிக்கெட் தளத்தின் மூலம் எங்கள் ஆதரவு குழுவிடம் ஒரு டிக்கெட்டைத் தெரிவிக்கவும். உங்கள் கோரிக்கையைக் கண்காணிக்க உள்நுழைவு தேவை.",
      ctaLabel: "ஒரு டிக்கெட்டைத் தெரிவிக்கவும்",
    },
    {
      eyebrow: "வேலைவாய்ப்புகள்",
      title: "தற்போதைய காலியிடங்கள்",
      description: "TNeGA-வில் இணைந்து, தமிழ்நாடு முழுவதும் ஆளுமையை முன்னெடுக்கும் மின்னணு உள்கட்டமைப்பை உருவாக்க உதவுங்கள்.",
      ctaLabel: "காலியிடங்களைக் காண்க",
    },
  ];
  await payload.updateGlobal({
    slug: "site-copy-content",
    locale: "ta",
    data: {
      announcementsHero: {
        eyebrow: "புதுப்பிப்புகள்",
        heading: "அறிவிப்புகள்",
        body: "தமிழ்நாடு மின்-ஆளுமை முகமையின் தொடக்கங்கள், மைல்கற்கள் மற்றும் சேவை புதுப்பிப்புகள், மாநிலம் முழுவதும் அரசு சேவைகளை வழங்கும் தளங்கள் குறித்த சமீபத்திய செய்திகள்.",
      },
      governmentOrdersHero: {
        eyebrow: "அதிகாரப்பூர்வ ஆணைகள்",
        heading: "அரசு ஆணைகள்",
        body: "தகவல் தொழில்நுட்பம் & மின்னணு சேவைகள் துறை மற்றும் தமிழ்நாடு மின்-ஆளுமை முகமையால் வெளியிடப்பட்ட அதிகாரப்பூர்வ அரசு ஆணைகள்.",
      },
      policiesHero: {
        eyebrow: "தரநிலைகள்",
        heading: "கொள்கைகள் & வழிகாட்டுதல்கள்",
        body: "தமிழ்நாட்டிற்கான தொழில்நுட்பக் கொள்கைகள், தரவு தரநிலைகள், இணைய பாதுகாப்பு வழிகாட்டுதல்கள் மற்றும் மின்-ஆளுமை கட்டமைப்புகள்.",
      },
      mediaHero: {
        eyebrow: "சமீபத்திய புதுப்பிப்புகள்",
        heading: "TNeGA-விலிருந்து செய்திகள், நிகழ்வுகள் & ஊடகம்",
        body: "தமிழ்நாடு மின்-ஆளுமை முகமையின் சமீபத்திய புகைப்படங்கள், வீடியோக்கள் மற்றும் பத்திரிகை செய்திகளுடன் புதுப்பித்த நிலையில் இருங்கள்.",
      },
      servicesHero: {
        eyebrow: "நாங்கள் உருவாக்குவது",
        heading: "தமிழ்நாட்டின் மின்னணு எதிர்காலத்தை முன்னெடுக்கும் முயற்சிகள்",
        body: "குடிமக்களுக்கான வலைதளங்கள் முதல் துறை தளங்கள் மற்றும் புதிய தொழில்நுட்பங்கள் வரை, TNeGA தமிழ்நாடு முழுவதும் மின்-ஆளுமையை உருவாக்கி, இயக்கி, விரிவுபடுத்துகிறது.",
      },
      reachUsPanels: (siteCopyEn.reachUsPanels ?? []).map((row, i) =>
        row.id ? { id: row.id, ...reachUsPanelsTa[i] } : reachUsPanelsTa[i]
      ),
    },
    overrideAccess: true,
  });
  console.log("site-copy-content (ta) seeded.");

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
