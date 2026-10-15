// Checks every local link in the built site points at something real: href,
// src and srcset paths resolve to a file in dist/ (the way nginx's try_files
// does), and #fragments match an id on the target page. Links to our own
// domain count as local. Other external URLs are skipped, so this runs offline
// and never flakes on someone else's server.
//
//   pnpm run build && pnpm run check:links

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = "https://awhinatech.nz";
const root = fileURLToPath(new URL("../dist/", import.meta.url));

if (!existsSync(root)) {
  console.error("dist/ not found. Run `pnpm run build` first.");
  process.exit(1);
}

const pages = readdirSync(root, { recursive: true })
  .map(String)
  .filter((f) => f.endsWith(".html"));

// Keep <script src>, drop inline script bodies so strings inside JS don't
// read as links.
const stripScripts = (html) =>
  html.replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/gi, "$1</script>");

const decodeEntities = (s) =>
  s.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"');

const html = new Map(
  pages.map((p) => [p, stripScripts(readFileSync(join(root, p), "utf8"))]),
);
const ids = new Map(
  pages.map((p) => [
    p,
    new Set([...html.get(p).matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])),
  ]),
);

// The URL a page is served at: about/index.html → /about/
const urlFor = (page) =>
  `${SITE}/${page.replace(/\\/g, "/").replace(/(^|\/)index\.html$/, "$1")}`;

// Mirrors nginx.conf: try_files $uri $uri/ $uri.html
function fileFor(pathname) {
  const p = join(root, decodeURIComponent(pathname));
  for (const candidate of [p, join(p, "index.html"), `${p}.html`]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) {
      return relative(root, candidate);
    }
  }
  return null;
}

function refsIn(source) {
  const refs = [];
  for (const m of source.matchAll(/\s(?:href|src)="([^"]*)"/g)) {
    refs.push(m[1]);
  }
  for (const m of source.matchAll(/\ssrcset="([^"]*)"/g)) {
    for (const candidate of m[1].split(",")) {
      const url = candidate.trim().split(/\s+/)[0];
      if (url) refs.push(url);
    }
  }
  return refs.map(decodeEntities);
}

const SKIP = /^(?:mailto:|tel:|sms:|data:|javascript:|blob:)/i;
const problems = [];

for (const page of pages) {
  const base = urlFor(page);
  for (const ref of refsIn(html.get(page))) {
    if (ref === "" || ref === "#" || SKIP.test(ref)) continue;

    const url = new URL(ref, base);
    if (url.origin !== SITE) continue;

    const target = fileFor(url.pathname);
    if (!target) {
      problems.push(`${page}: ${ref} (no such file)`);
      continue;
    }

    const fragment = decodeURIComponent(url.hash.slice(1));
    if (fragment && target.endsWith(".html") && !ids.get(target)?.has(fragment)) {
      problems.push(`${page}: ${ref} (no id="${fragment}" on ${target})`);
    }
  }
}

if (problems.length > 0) {
  console.error(`Found ${problems.length} broken link(s):\n`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}

console.log(`Checked local links on ${pages.length} page(s). All good.`);
