// Centralized copy for the /about page. hero/whoWeAre/hierarchy/
// visionMission/orgChart/awards/rollOfHonour/connectWithUs have all moved
// to the CMS (see src/lib/cms/about-page.ts, org-chart.ts, awards.ts,
// roll-of-honour.ts) — what remains here is content for components that
// aren't rendered anywhere on the live site (WhatWeDo, EcosystemGrowthRings)
// and is kept only because those components still import it.

import { pexelsPhoto, STOCK } from "./stock-photos";

export const whatWeDo = [
  {
    title: "Technology Backbone",
    description:
      "Lead technology planning, implementation and innovation for every Government institution in Tamil Nadu.",
    image: pexelsPhoto(STOCK.serverRacks, 300, 300),
  },
  {
    title: "Paperless Governance",
    description:
      "Transform every government institution to be hassle-free, transparent and free of physical touchpoints, from the Secretariat to the last mile.",
    image: pexelsPhoto(STOCK.officeBuilding, 300, 300),
  },
  {
    title: "Force Multiplier",
    description:
      "Build shared digital infrastructure that departments can plug into, reducing cost, time and duplication across government.",
    image: pexelsPhoto(STOCK.networkRack, 300, 300),
  },
  {
    title: "Innovation Ecosystem",
    description:
      "Engage academic institutions, startups, NGOs and international organisations to co-create solutions for real governance challenges.",
    image: pexelsPhoto(STOCK.workshopGroup, 300, 300),
  },
  {
    title: "Capacity Building",
    description:
      "Train government employees in ICT, conduct workshops and seminars, and publish research at national and international forums.",
    image: pexelsPhoto(STOCK.presentation, 300, 300),
  },
  {
    title: "Data-Driven Governance",
    description:
      "Build systems that ensure correct benefits reach the correct person, through clean, integrated and secure data across departments.",
    image: pexelsPhoto(STOCK.itTechnician, 300, 300),
  },
];

// Positioned on concentric rings by founding year — earliest (innermost)
// to most recent (outermost) — around the parent department at the center.
export const ecosystemRings = [
  {
    name: "ELCOT",
    year: 1977,
    description:
      "Electronics Corporation of Tamil Nadu, the state's pioneering IT infrastructure and hardware/software procurement agency.",
  },
  {
    name: "Tamil Virtual Academy",
    year: 2001,
    description:
      "Delivers Tamil language and culture education online to the global Tamil diaspora.",
  },
  {
    name: "TNeGA",
    year: 2007,
    description:
      "The State Nodal Agency for e-Governance, coordinating digital transformation across every department.",
  },
  {
    name: "ICT Academy",
    year: 2009,
    description:
      "A not-for-profit skilling initiative building industry-ready ICT talent across Tamil Nadu's colleges.",
  },
  {
    name: "TACTV",
    year: 2011,
    description:
      "Tamil Nadu Arasu Cable TV Corporation, delivering digital cable television access statewide.",
  },
  {
    name: "TANFINET",
    year: 2018,
    description:
      "Tamil Nadu Fibernet Corporation, the state's optical fibre backbone connecting every village.",
  },
  {
    name: "iTNT Hub",
    year: 2023,
    description:
      "Tamil Nadu's innovation and startup hub, incubating deep-tech and emerging-technology ventures.",
  },
];

export const ecosystemCenter = "IT & Digital Services Department";
