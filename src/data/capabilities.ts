export type Capability = {
  id: "rostering" | "bookings" | "donors" | "insights" | "site";
  label: string;
  iconKey: "users" | "calendar" | "heart" | "chart" | "globe";
  headline: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
  ctaPrefill: string;
};

export const CAPABILITIES: Capability[] = [
  {
    id: "rostering",
    label: "Volunteers & rostering",
    iconKey: "users",
    headline: "Shifts that fit your crew, not a product roadmap.",
    body: "Custom rosters for the volunteers who fill them — recurring slots, recognition, and reminders shaped around how your team actually works. No rigid SaaS workflow forcing your coordinators to translate every shift into someone else's idea of one.",
    ctaHref: "#contact",
    ctaLabel: "Talk about a roster build",
    ctaPrefill:
      "A volunteer roster that fits how we actually run shifts — recurring slots, reminders, the works. Not a generic SaaS workflow.",
  },
  {
    id: "bookings",
    label: "Bookings & events",
    iconKey: "calendar",
    headline: "Booking flows as simple — or specific — as your service needs.",
    body: "Whether it's a weekly community dinner or a hundred different programmes, the booking experience is yours. Configurable rules, custom confirmations, and an interface your supporters can use without reading a help article.",
    ctaHref: "#contact",
    ctaLabel: "Talk about a booking flow",
    ctaPrefill:
      "A booking flow our supporters can use without reading a help article — shaped around how our service actually runs.",
  },
  {
    id: "donors",
    label: "Donors & supporters",
    iconKey: "heart",
    headline: "A supporter view that knows your people by name.",
    body: "One source of truth for the people backing your kaupapa. Track giving, communications, and consent in a place that fits your team — not a generic CRM with three hundred fields you'll never use.",
    ctaHref: "#contact",
    ctaLabel: "Talk about a supporter database",
    ctaPrefill:
      "A supporter database built around our kaupapa, not a generic CRM with three hundred fields we'll never use.",
  },
  {
    id: "insights",
    label: "Insights & reporting",
    iconKey: "chart",
    headline: "The numbers your funders want, in one place you trust.",
    body: "Reporting built around your funding agreements and impact stories — not bolted-on dashboards. Pull the figures you actually need to send, in the shape your reviewers expect, without exporting to four spreadsheets first.",
    ctaHref: "#contact",
    ctaLabel: "Talk about a reporting build",
    ctaPrefill:
      "Reporting shaped around our funding agreements — not bolted-on dashboards. Funder season eats too much of our week.",
  },
  {
    id: "site",
    label: "Public site & content",
    iconKey: "globe",
    headline: "A site that loads fast, reads clearly, and stays cheap.",
    body: "Your public face, hosted on the same stack as the rest of your tools. Fast on slow connections, accessible by default, and editable by humans who don't write code.",
    ctaHref: "#contact",
    ctaLabel: "Talk about a public site",
    ctaPrefill:
      "A public site that loads fast, reads clearly, and stays cheap to run — editable by people who don't write code.",
  },
];
