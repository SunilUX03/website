import { TopNav } from "@/components/nav/TopNav";
import { Hero } from "@/components/hero/Hero";
import { Scroller } from "@/components/sections/Scroller";
import { AboutLeadership } from "@/components/sections/AboutLeadership";
import { Metrics } from "@/components/sections/Metrics";
import { PillarCards } from "@/components/sections/PillarCards";
import { ProjectsSpotlight } from "@/components/sections/ProjectsSpotlight";
import { CommunityFeed } from "@/components/sections/CommunityFeed";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { getAnnouncements, getTickerAnnouncements } from "@/lib/cms/announcements";
import { getHeroContent } from "@/lib/cms/hero-content";
import { getLeadershipBand } from "@/lib/cms/leadership-band";
import { getAllServiceItems, getServiceItemsBySlugs } from "@/lib/cms/services";
import { getMetrics } from "@/lib/cms/metrics";
import { getPillarsContent } from "@/lib/cms/pillars-content";
import { getProjectsSpotlight } from "@/lib/cms/projects-spotlight";
import { pillars, type PillarLinkItem } from "@/lib/content";
import { getLocale } from "@/lib/locale";

// Announcements now come from the CMS (a live DB query, not a static
// import Next can see through), so this page would otherwise be
// prerendered once at build and never reflect a newly published
// announcement. Revalidating every 60s is simple, predictable ISR —
// good enough for content that doesn't need to appear instantly:
// revisit with on-publish revalidation (a Payload afterChange hook
// calling revalidatePath) if that ever becomes necessary.
export const revalidate = 60;

// The curated pillars[0]/[1] item lists (Citizen Services, Services to
// Government) are static English data in lib/content.ts — matched by
// English name key before display, same display-only-override pattern
// used on /citizen-services (see CITIZEN_SERVICE_TA there).
const PILLAR_ITEM_TA: Record<string, { name: string; description: string }> = {
  "e-Sevai": { name: "இ-சேவை", description: "குடிமக்கள் தொடர்பான அரசு சேவைகளை ஆன்லைனில் அணுகவும்." },
  UMIS: { name: "UMIS", description: "மாணவர் நலன் மற்றும் கல்வி பதிவுகளைக் கண்காணிக்கவும்." },
  "Software Development / Procurement": {
    name: "மென்பொருள் மேம்பாடு / கொள்முதல்",
    description: "அரசுத் துறைகளுக்கு மென்பொருள் மேம்பாடு மற்றும் தகவல் தொழில்நுட்ப வன்பொருள்/மென்பொருள் கொள்முதல் ஆதரவு.",
  },
  "Security Audit": {
    name: "பாதுகாப்பு தணிக்கை",
    description: "அரசு இணையதளங்கள், செயலிகள், APIகள் மற்றும் கிளவுட் பயன்பாடுகளுக்கான கட்டாய தகவல் தொழில்நுட்ப பாதுகாப்பு தணிக்கைகள்.",
  },
  "SMS / WhatsApp Gateway": {
    name: "SMS / WhatsApp நுழைவாயில்",
    description: "அரசு-குடிமக்கள் தொடர்புக்கான மையப்படுத்தப்பட்ட SMS மற்றும் WhatsApp நுழைவாயில் சேவைகள்.",
  },
  "Aadhaar Services": {
    name: "ஆதார் சேவைகள்",
    description: "அரசுத் துறைகளுக்கான ஆதார் அடிப்படையிலான அங்கீகாரம் மற்றும் மின்-KYC சேவைகள்.",
  },
};

export default async function Home() {
  const locale = await getLocale();
  const [announcements, tickerAnnouncements, hero, leadershipBand, allServiceItems, metrics, pillarsChrome, projectsSpotlight] =
    await Promise.all([
      getAnnouncements(locale),
      getTickerAnnouncements(locale),
      getHeroContent(locale),
      getLeadershipBand(locale),
      getAllServiceItems(locale),
      getMetrics(locale),
      getPillarsContent(locale),
      getProjectsSpotlight(locale),
    ]);
  // Citizen Services and Services to Government carry a fixed, curated
  // `items` list already in the shape the cards need; the third pillar
  // (Initiatives & Projects) still resolves live from the Services
  // collection by slug, so its items are mapped into the same shape here.
  const isTa = locale === "ta";
  const pillarItems: PillarLinkItem[][] = pillars.map((p) =>
    "items" in p
      ? p.items.map((item) => {
          const ta = PILLAR_ITEM_TA[item.name];
          return isTa && ta ? { ...item, name: ta.name, description: ta.description } : item;
        })
      : getServiceItemsBySlugs(allServiceItems, p.itemSlugs).map((item) => ({
          name: item.name,
          description: item.description,
          href: item.knowMoreHref,
        }))
  );
  // Citizen Services (index 0) has no "See all" button — chrome.linkLabel
  // exists for it too, but only pillars 1 and 2 actually show one.
  const mergedPillars = pillarsChrome.pillars.map((chrome, i) => ({
    ...chrome,
    href: pillars[i].href,
    seeAllLabel: i === 0 ? undefined : chrome.linkLabel,
  }));

  return (
    <>
      <TopNav />
      <main className="flex-1">
        {/* Hero fills the rest of the first viewport (nav height
            subtracted via --header-height) and the ticker sits pinned
            at the very bottom of that block, flush against it — rather
            than the two just being stacked with whatever height each
            happens to want. */}
        <div className="flex flex-col" style={{ minHeight: "calc(100dvh - var(--header-height, 130px))" }}>
          <Hero hero={hero} locale={locale} />
          <Scroller items={tickerAnnouncements} locale={locale} />
        </div>
        <AboutLeadership band={leadershipBand} />
        <Metrics heading={metrics.heading} metrics={metrics.metrics} />
        <PillarCards eyebrow={pillarsChrome.eyebrow} heading={pillarsChrome.heading} pillars={mergedPillars} pillarItems={pillarItems} />
        <ProjectsSpotlight projects={projectsSpotlight} locale={locale} />
        <CommunityFeed announcements={announcements} locale={locale} />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
