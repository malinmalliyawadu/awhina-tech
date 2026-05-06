export type CharityScheme = "warm" | "forest" | "sea";

export interface CaseStudy {
  name: string;
  kicker: string;
  blurb: string;
  metrics: { v: string; l: string }[];
  scheme: CharityScheme;
  image: string;
  imageAlt: string;
}

export const CASES: CaseStudy[] = [
  {
    name: "Everybody Eats",
    kicker: "Pay-as-you-feel restaurant",
    blurb:
      "A booking system, volunteer roster, and donation flow built around their three-course pay-what-feels-right dining model. Replaced four separate tools.",
    metrics: [
      { v: "37%", l: "fewer no-shows" },
      { v: "4 → 1", l: "tools consolidated" },
      { v: "$0", l: "transaction fees absorbed" },
    ],
    scheme: "warm",
    image: "screenshots/everybody-eats-hero.png",
    imageAlt: "Everybody Eats homepage — 'Making a difference one plate at a time'",
  },
  {
    name: "Fair Food NZ",
    kicker: "Food rescue for Auckland",
    blurb:
      "A logistics dashboard for 30+ donor partners, automated rescue scheduling, and a public impact ticker. Built to handle 60 tonnes of rescued kai a month.",
    metrics: [
      { v: "60 t", l: "kai routed monthly" },
      { v: "12 hrs", l: "ops time saved / week" },
      { v: "30+", l: "partner orgs onboarded" },
    ],
    scheme: "forest",
    image: "screenshots/fair-food.png",
    imageAlt: "Fair Food NZ homepage with programmes and impact statistics",
  },
  {
    name: "Compassion Soup Kitchen",
    kicker: "Hot meals in Te Whanganui-a-Tara",
    blurb:
      "A volunteer signup system, mobile-first menu board, and a quiet donation page that respects the dignity of the people who walk through the door.",
    metrics: [
      { v: "112", l: "active volunteers" },
      { v: "2 min", l: "to sign up for a shift" },
      { v: "92%", l: "shifts filled in advance" },
    ],
    scheme: "sea",
    image: "screenshots/compassion.png",
    imageAlt: "Compassion Soup Kitchen volunteer site, 'Every meal is an act of aroha'",
  },
];
