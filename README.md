# Āwhina Tech

> Custom websites and apps for Aotearoa's charities — $200 NZD a month, all-in.

The marketing site for [awhinatech.nz](https://awhinatech.nz). Static, fast, intentionally small.

## 🛠 Stack

- **[Astro 5](https://astro.build)** — static-first, zero-JS by default
- **TypeScript** — for component props and the bits of client JS
- **Plain CSS** — no framework, no preprocessor, scoped per `.astro` file
- **Docker + nginx** — production runtime, served via Coolify

## 🌱 Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → ./dist
npm run preview  # serve the built site
```

Requires Node 22+.

## 📁 Project layout

```
src/
  components/        Astro components (Masthead, Hero, Capabilities, …)
    mocks/           Inline mock UI shown in case studies (no real data)
  data/              Case study content
  layouts/Base.astro Single layout — title, meta, global font/script
  pages/index.astro  Single-page site
  styles/global.css  CSS variables, resets, shared primitives
public/screenshots/  Real screenshots embedded in the case grid
```

There's no router, no CMS, no database. Adding a section means adding a component to `src/components/` and importing it in `src/pages/index.astro`.

## 🚀 Deployment (Coolify)

The site ships as a Docker image built from the included `Dockerfile`:

1. Node 22 alpine builds Astro → static `dist/`
2. nginx 1.27 alpine serves `dist/` on port 80, with cache headers tuned for fingerprinted Astro assets

In Coolify:

- **Application → Build pack:** Dockerfile
- **Ports Exposes:** `80`
- **Domains:** `https://awhinatech.nz`, `https://www.awhinatech.nz`

Push to `main` → Coolify rebuilds and redeploys. Cache headers in `nginx.conf` make `/_astro/*` immutable for a year and HTML uncached, so deploys propagate instantly.

### Cloudflare DNS

`awhinatech.nz` is on Cloudflare, A-record pointing to the Coolify host (DNS-only, grey cloud). TLS is terminated by Coolify/Traefik with Let's Encrypt.

## ✏️ Editorial conventions

A few things worth knowing if you're editing copy:

- **"Āwhina"** with a macron in display text. The email domain stays `awhinatech.nz` — DNS doesn't allow macrons.
- te reo Māori words are not italicised (Aotearoa, mahi, koha, whānau, kai)
- prices in `$NZD` are written as `$200` not `NZ$200`
- the brand voice is plainspoken, civic-modern — short sentences, no jargon, no startup-y flourishes

## 📬 Contact

[kiaora@awhinatech.nz](mailto:kiaora@awhinatech.nz) · Te Whanganui-a-Tara · Aotearoa
