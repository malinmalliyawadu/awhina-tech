# Āwhina Tech — project notes

Marketing site for an agency that builds custom websites and apps for Aotearoa's charities. Single-page, static, intentionally small. See `README.md` for the public-facing overview.

## Stack and shape

- Astro 5, static output (`output: "static"` is the default — no SSR, no adapter)
- TypeScript for component props and client scripts
- Plain CSS, scoped inside `.astro` `<style>` blocks; shared tokens live in `src/styles/global.css`
- No CSS framework, no UI library, no CMS, no DB
- Single page: `src/pages/index.astro` imports a sequence of section components

## Common commands

```bash
npm run dev      # astro dev — http://localhost:4321
npm run build    # astro build — outputs to ./dist
npm run preview  # serve ./dist locally
```

There are no tests, no linter config, and no typecheck script. `astro build` is the de facto check — if it builds, it ships.

## File layout

```
src/components/         section components (Masthead, Hero, Capabilities, Testimonials, Contact, …)
src/components/mocks/   inline UI mocks rendered inside case-study cards
src/data/               structured content for case studies
src/layouts/Base.astro  the only layout — meta, global script
src/pages/index.astro   the only page
src/styles/global.css   CSS variables, resets, shared primitives
public/screenshots/     real screenshots referenced from case-study components
```

When adding a section, create a new component in `src/components/`, then import and place it in `src/pages/index.astro`. Don't introduce routing or layouts beyond `Base.astro` without a clear reason — this is deliberately a one-page site.

## Editorial conventions (important — easy to get wrong)

- **"Āwhina"** with a macron in all display copy. The email domain stays `awhinatech.nz` (DNS doesn't allow macrons), and the npm package name stays `awhina-tech`.
- te reo Māori words are not italicised: Aotearoa, mahi, koha, whānau, kai, kia ora, etc.
- Use macrons consistently: whānau, Māori, Aotearoa, Te Whanganui-a-Tara, tātou.
- Prices: `$200` not `NZ$200` or `$200 NZD` (in body copy — the README/sell copy can use `$200 NZD` for clarity to overseas readers).
- Tone is plainspoken, civic-modern. Short sentences. No startup-y flourishes ("game-changing", "revolutionary", "10x"), no marketing fluff. Specific over abstract.

## Hosting

Production runs on **Coolify** via the included `Dockerfile` + `nginx.conf`:

1. Multi-stage build: Node 22 alpine builds Astro → nginx 1.27 alpine serves `dist/` on port 80
2. `nginx.conf` sets `Cache-Control: public, max-age=31536000, immutable` for `/_astro/*` and `no-cache` for HTML
3. In Coolify: build pack = Dockerfile, ports exposes = `80`, domains = `awhinatech.nz` + `www.awhinatech.nz`

DNS is on Cloudflare, grey-clouded A record pointing to the Coolify host. TLS is handled by Coolify/Traefik via Let's Encrypt — **don't switch to "Flexible" SSL on Cloudflare**, it'll loop.

A `.github/workflows/deploy.yml` for GitHub Pages still exists but is **stale** — the project has moved to Coolify. The Astro config no longer has the `base: "/awhina-tech"` path that GH Pages needs, so that workflow's output would 404 on assets. Safe to delete when convenient.

## Things not to do

- Don't add a CSS framework (Tailwind, etc.) — the design language is hand-tuned and brittle in the way good editorial design tends to be
- Don't introduce client-side routing or React/Vue islands unless there's a real need — the whole point is no JS by default
- Don't refactor the single-page structure into multiple pages without asking
- Don't change `awhina-tech` (package name) or `awhinatech.nz` (domain) to add a macron — those are technical identifiers, not display copy
- Don't add backwards-compat shims when removing components or sections; this is a marketing site, not a library

## Brand colour and tone tokens

Defined in `src/styles/global.css` as CSS custom properties. Names use Māori/te reo where it fits (`--pounamu`, `--kowhai`, `--clay`). When adding a new accent, prefer extending the existing palette over inventing a parallel naming scheme.
