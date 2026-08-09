import type { GlobalConfig } from "payload";

// Backs the homepage Hero (src/components/hero/Hero.tsx) — the agency
// name's English/Tamil cycle, the headline with its one animated word,
// and the tagline underneath.
//
// The old static data (lib/content.ts's `hero.headline` +
// `headlineCycleWords`) made Hero.tsx find the animated word by an exact
// string match against a word inside the headline — silent breakage if
// an editor rephrased the headline without preserving that exact word.
// `headlineTemplate` replaces that with an explicit `{word}` placeholder
// (validated below) so there's nothing implicit for an editor to break.
export const HeroContent: GlobalConfig = {
  slug: "hero-content",
  admin: {
    description: "The homepage Hero — agency name, headline and tagline.",
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "agencyLabelCycle",
      type: "array",
      required: true,
      minRows: 1,
      admin: {
        description: "The bold masthead line the hero cycles through, e.g. the English and Tamil agency name.",
      },
      fields: [{ name: "text", type: "text", required: true }],
    },
    {
      name: "headlineTemplate",
      type: "text",
      required: true,
      admin: {
        description:
          'The headline, with {word} marking where the animated cycling word goes — e.g. "Powering Digital {word} in Tamil Nadu".',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return "Headline is required.";
        const count = value.split("{word}").length - 1;
        if (count === 0) return 'The headline must contain the placeholder "{word}" exactly once.';
        if (count > 1) return 'The headline must contain "{word}" only once.';
        return true;
      },
    },
    {
      name: "headlineCycleWords",
      type: "array",
      required: true,
      minRows: 1,
      admin: {
        description: 'Words that cycle through the {word} placeholder above, e.g. "Governance", "Services".',
      },
      fields: [{ name: "word", type: "text", required: true }],
    },
    {
      name: "tagline",
      type: "textarea",
      required: true,
    },
  ],
};
