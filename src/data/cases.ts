export type CharityScheme = "warm" | "forest" | "sea";

export interface CaseStudy {
  name: string;
  kicker: string;
  blurb: string;
  metrics: { v: string; l: string }[];
  scheme: CharityScheme;
  image: string;
  imageAlt: string;
  /** Optional "before" screenshot — renders the hero as a before/after slider. */
  beforeImage?: string;
  beforeImageAlt?: string;
  phoneImage?: string;
  phoneImageAlt?: string;
}

export const CASES: CaseStudy[] = [
  {
    name: "Everybody Eats",
    kicker: "Pay-as-you-feel restaurants",
    blurb:
      "A booking system, volunteer roster, and donation flow built around their three-course pay-what-feels-right dining model — plus native iOS and Android apps for volunteers to pick up shifts on the move.",
    metrics: [
      { v: "9k+", l: "volunteers" },
      { v: "1.2k", l: "weekly active users" },
      { v: "3+", l: "restaurants and pop-ups" },
    ],
    scheme: "warm",
    image: "screenshots/everybody-eats-hero.png",
    imageAlt:
      "Everybody Eats volunteer dashboard — shifts completed, hours contributed, and suggested volunteers",
    beforeImage: "screenshots/everybody-eats-before.png",
    beforeImageAlt:
      "The volunteer site Everybody Eats had before the rebuild — a plain events list with little of their own identity",
    phoneImage: "screenshots/everybody-eats-app.png",
    phoneImageAlt:
      "Everybody Eats volunteer app — open shifts and 'What's happening' feed",
  },
  {
    name: "Fair Food NZ",
    kicker: "Food rescue for Tāmaki Makaurau",
    blurb:
      "A volunteer site and shift booking system for the crew who sort, cook, and share rescued kai in Avondale every day — browse open shifts solo, or sign up a whole team at once.",
    metrics: [
      { v: "300+", l: "volunteers" },
      { v: "2,400 kg", l: "rescued kai a day" },
      { v: "Est. 2011", l: "feeding Avondale" },
    ],
    scheme: "forest",
    image: "screenshots/fair-food.png",
    imageAlt:
      "Fair Food volunteer site — 'Help turn leftovers into lifelines for whānau', with open shifts and team sign-up",
  },
  {
    name: "Compassion Soup Kitchen",
    kicker: "Hot meals in Te Whanganui-a-Tara",
    blurb:
      "A volunteer signup system and a mobile-first menu board, built with care for the dignity of the people who walk through the door.",
    metrics: [],
    scheme: "sea",
    image: "screenshots/compassion.png",
    imageAlt:
      "Compassion Soup Kitchen volunteer site, 'Every meal is an act of aroha'",
  },
];
