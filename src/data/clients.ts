// Per-client project hubs — one Client entry per charity we build for, with
// one Project entry per product we run for that charity. Pages live at
// /clients/<client>/<project>, are unlisted (no nav/footer link) and shared
// with the client by direct link. Add a new project = a new key under the
// client's `projects` map and a matching page under src/pages/clients/.
//
// `icon` is a key into the ICONS map in the project-hub page (Lucide outline
// paths). Keep the two in sync; an unknown key just renders no icon.

/** A fenced command / env block, rendered monospace with an optional label. */
export interface CodeBlock {
  code: string[];
  caption?: string;
}

/**
 * A unit of doc content: a paragraph (string — may contain `backtick`
 * inline-code spans) or a CodeBlock. `howItWorks` only uses plain strings;
 * `technical` mixes prose and code.
 */
export type Block = string | CodeBlock;

export interface LinkItem {
  label: string;
  /** Omit for a "where it lives" fact that isn't a clickable destination. */
  href?: string;
  detail: string;
  /** External destinations open in a new tab. */
  external?: boolean;
  icon: string;
}

export interface DocSection {
  title: string;
  body: Block[];
  icon: string;
}

/** Official documentation link for a piece of the stack. */
export interface TechRef {
  name: string;
  url: string;
  note: string;
}

/** One product Āwhina runs for a client (e.g. their volunteer portal). */
export interface Project {
  slug: string;
  /** Display name of the project, e.g. "Fair Food Volunteer". */
  name: string;
  /** One-paragraph "what this is" at the top of the page. */
  intro: string;
  /** The primary thing the client opens day to day. */
  primary: LinkItem;
  /** Charity-facing quick links. */
  services: LinkItem[];
  /** Plain-language "how it works", for the charity team. */
  howItWorks: DocSection[];
  /** Where the moving parts live — for Āwhina and any developer. */
  infra: LinkItem[];
  /** Official docs for the stack — for Āwhina and any developer. */
  techRefs: TechRef[];
  /** Technical handover notes — for Āwhina and any developer. */
  technical: DocSection[];
}

export interface Client {
  slug: string;
  name: string;
  /** Products / projects Āwhina runs for this client, keyed by slug. */
  projects: Record<string, Project>;
  /** The Āwhina contact shown in "Need a hand?" — shared across projects. */
  support: { org: string; email: string; phone: string; location: string };
}

const fairFoodVolunteer: Project = {
  slug: "volunteer",
  name: "Fair Food Volunteer",
  intro:
    "The volunteer site — where people sign up for shifts across your programmes, and where coordinators manage who's coming in. This page is the map for this project: what's where, how the everyday things work, and the technical detail underneath.",
  primary: {
    label: "Open the volunteer site",
    href: "https://volunteer.fairfood.org.nz",
    detail: "volunteer.fairfood.org.nz",
    external: true,
    icon: "globe",
  },
  services: [
    {
      label: "Volunteer site",
      href: "https://volunteer.fairfood.org.nz",
      detail:
        "The live site your volunteers and coordinators use — sign in, programmes, shifts and bookings.",
      external: true,
      icon: "globe",
    },
    {
      label: "Service status",
      href: "https://awhina.instatus.com/",
      detail:
        "Live uptime and any maintenance notices for the sites Āwhina runs for you.",
      external: true,
      icon: "activity",
    },
  ],
  howItWorks: [
    {
      title: "Signing in",
      icon: "lock",
      body: [
        "A volunteer signs in with the email and password they set when they signed up. They can also use a Google account or a passkey (Face ID or a fingerprint), and reset a forgotten password by email. Coordinators sign in the same way.",
      ],
    },
    {
      title: "Programmes and shifts",
      icon: "calendar",
      body: [
        "Work is organised into programmes. The site ships with Kai Sorting and Conscious Kitchen, and coordinators can add more.",
        "Each programme has shifts — a date, a time, and how many volunteers are needed. Coordinators create and edit shifts from the admin area.",
      ],
    },
    {
      title: "Bookings",
      icon: "check",
      body: [
        "A volunteer picks a shift and books a spot. The site stops a shift being double-booked by the same person or filled past its limit.",
        "Inclusive Volunteering works differently — it's by arrangement with a pre-registered group, so it never takes self-serve bookings. Those enquiries go to volunteering@fairfood.org.nz instead.",
      ],
    },
    {
      title: "Resources",
      icon: "file",
      body: [
        "Coordinators upload documents — the volunteer handbook, health & safety, how to get there, and forms — and volunteers read them on the Resources page. They're grouped by category so people can find the right one quickly.",
      ],
    },
    {
      title: "Emails the site sends",
      icon: "mail",
      body: [
        "Password resets, email verification and a welcome message all go out automatically. They come from volunteering@fairfood.org.nz.",
      ],
    },
    {
      title: "Who can do what",
      icon: "users",
      body: [
        "Volunteers see programmes, book shifts and read resources. Coordinators also get the admin area: creating programmes and shifts, managing documents, and seeing who's booked. The two sides are kept clearly separate.",
      ],
    },
  ],
  infra: [
    {
      label: "Source code",
      href: "https://github.com/fairfoodnz/fairfood-volunteer",
      detail:
        "GitHub — fairfoodnz/fairfood-volunteer. Every pull request gets an automated review.",
      external: true,
      icon: "code",
    },
    {
      label: "Design system",
      href: "https://volunteer.fairfood.org.nz/design-system",
      detail:
        "Live component and design-token reference, served from the app itself.",
      external: true,
      icon: "palette",
    },
    {
      label: "PostHog",
      href: "https://us.posthog.com/project/431006/home",
      detail:
        "Product analytics dashboard — PostHog Cloud (US), project 431006.",
      external: true,
      icon: "activity",
    },
    {
      label: "Hosting",
      icon: "server",
      detail:
        "Coolify (self-hosted). Multi-stage Dockerfile; the container runs database migrations on startup. Not Vercel.",
    },
    {
      label: "Database",
      icon: "database",
      detail: "PostgreSQL, via Prisma 7.8 with the @prisma/adapter-pg adapter.",
    },
    {
      label: "Object storage",
      icon: "box",
      detail:
        "Garage S3 (S3-compatible, path-style). Holds uploaded programme images and the Resources-page documents — handbook, health & safety, getting-here info and forms.",
    },
    {
      label: "Email delivery",
      icon: "mail",
      detail:
        "Resend, sending react-email templates from volunteering@fairfood.org.nz.",
    },
    {
      label: "Domain",
      icon: "globe",
      detail:
        "volunteer.fairfood.org.nz — DNS on Crazy Domains, an A record pointing at the Coolify host.",
    },
  ],
  techRefs: [
    { name: "Next.js 16", url: "https://nextjs.org/docs", note: "App Router framework" },
    { name: "React 19", url: "https://react.dev", note: "UI library" },
    { name: "Prisma 7", url: "https://www.prisma.io/docs", note: "ORM & migrations" },
    {
      name: "PostgreSQL",
      url: "https://www.postgresql.org/docs/",
      note: "Database",
    },
    {
      name: "Tailwind CSS v4",
      url: "https://tailwindcss.com/docs",
      note: "Styling",
    },
    { name: "shadcn/ui", url: "https://ui.shadcn.com", note: "UI primitives" },
    { name: "Zod", url: "https://zod.dev", note: "Schema validation" },
    { name: "Arctic", url: "https://arcticjs.dev", note: "Google OAuth" },
    {
      name: "SimpleWebAuthn",
      url: "https://simplewebauthn.dev",
      note: "Passkeys / WebAuthn",
    },
    { name: "Resend", url: "https://resend.com/docs", note: "Transactional email" },
    {
      name: "React Email",
      url: "https://react.email/docs",
      note: "Email templates",
    },
    { name: "Coolify", url: "https://coolify.io/docs", note: "Self-hosted PaaS" },
    {
      name: "Garage",
      url: "https://garagehq.deuxfleurs.fr/documentation/",
      note: "S3-compatible storage",
    },
    { name: "Vitest", url: "https://vitest.dev", note: "Unit tests" },
    {
      name: "Playwright",
      url: "https://playwright.dev/docs/intro",
      note: "End-to-end tests",
    },
  ],
  technical: [
    {
      title: "Stack",
      icon: "layers",
      body: [
        "Next.js 16 (App Router) + React 19. Prisma 7.8 over Postgres — import the generated client from `@/generated/prisma`, never `@prisma/client`.",
        "Tailwind CSS v4 (config-in-CSS) with shadcn/ui (base-nova). Mutations are Server Actions validated with Zod, then `revalidatePath` the affected routes.",
      ],
    },
    {
      title: "Auth",
      icon: "shield",
      body: [
        "Email + password (bcrypt), not NextAuth or Clerk. Google sign-in (arctic — auth-code + PKCE) and discoverable passkeys (`@simplewebauthn`) terminate in the same session.",
        "Forgot-password and email-verification use single-use, hashed, 24-hour tokens. Guard server work with `requireUser()` / `requireAdmin()`.",
      ],
    },
    {
      title: "Deploy",
      icon: "upload",
      body: [
        "Push to `main` → Coolify builds the Dockerfile → `prisma migrate deploy` runs at container start.",
        "`NEXT_PUBLIC_APP_URL` is build-time-inlined by Next.js (OAuth redirect URI, WebAuthn rpID, email links). For any non-production image, pass it as a Docker build arg — not a runtime env var:",
        {
          caption: "non-production image",
          code: [
            "docker build \\",
            "  --build-arg NEXT_PUBLIC_APP_URL=https://staging.example \\",
            "  -t fairfood-volunteer .",
          ],
        },
      ],
    },
    {
      title: "Environment",
      icon: "sliders",
      body: [
        "Set these in Coolify (and in `.env` locally):",
        {
          caption: ".env",
          code: [
            "# required",
            "DATABASE_URL=",
            "AUTH_SECRET=",
            "NEXT_PUBLIC_APP_URL=https://volunteer.fairfood.org.nz",
            "",
            "# email",
            "RESEND_API_KEY=          # optional in dev, required in prod",
            'EMAIL_FROM="Fair Food <volunteering@fairfood.org.nz>"',
            "",
            "# optional — Google sign-in",
            "GOOGLE_CLIENT_ID=",
            "GOOGLE_CLIENT_SECRET=",
          ],
        },
        "Passkeys derive their rpID and origin from `NEXT_PUBLIC_APP_URL` — no extra vars.",
      ],
    },
    {
      title: "Analytics & tracking",
      icon: "activity",
      body: [
        "Google Search Console is verified with the HTML-file method — `public/google1d3ca6546dc984ba.html` is served at the site root. It tracks indexing and search coverage for the public pages; leave that file in place.",
        "PostHog (Cloud, US region — project 431006) captures product analytics: page views and key actions like sign-in and bookings. It runs client-side, keyed by env vars in Coolify, so it stays off in local dev unless those are set. The dashboard is linked under Where things live.",
      ],
    },
    {
      title: "Security",
      icon: "scan",
      body: [
        "Dependabot opens grouped weekly pull requests for npm and GitHub Actions every Monday 9am NZ — grouped by Next, React, Prisma, Radix, plus a catch-all minor-and-patch group, capped at ten open at a time (`.github/dependabot.yaml`). Dependabot security updates are on too, so vulnerable-dependency PRs land the moment a patch is published. CodeQL is on via GitHub's default setup — JavaScript/TypeScript + Actions, default query suite, weekly. GitHub secret scanning is on. Every non-draft pull request also gets an automated Claude Code review.",
      ],
    },
    {
      title: "Running it locally",
      icon: "terminal",
      body: [
        {
          caption: "local setup",
          code: [
            "docker compose up -d db       # Postgres on :5434",
            "docker compose up -d garage   # Garage S3 on :3900",
            "./scripts/garage-init.sh      # first run only",
            "",
            "npx prisma migrate dev",
            "npx prisma db seed",
            "npm run dev                   # http://localhost:3000",
            "npm run email:dev             # email preview on :3001",
          ],
        },
        "In dev, with no Resend key set, outgoing emails (verification, password reset) are printed to the server console instead of sent.",
      ],
    },
    {
      title: "Tests & CI",
      icon: "beaker",
      body: [
        {
          caption: "tests",
          code: [
            "npm test           # Vitest unit — no server needed",
            "npm run test:e2e   # Playwright e2e — needs the seeded dev DB",
          ],
        },
        "CI runs both. Every non-draft pull request also gets an automated Claude Code review.",
      ],
    },
  ],
};

const fairFood: Client = {
  slug: "fair-food",
  name: "Fair Food",
  projects: {
    volunteer: fairFoodVolunteer,
  },
  support: {
    org: "Āwhina Tech",
    email: "kiaora@awhinatech.nz",
    phone: "021 209 5657",
    location: "Te Whanganui-a-Tara · Aotearoa",
  },
};

export const clients: Record<string, Client> = {
  "fair-food": fairFood,
};
