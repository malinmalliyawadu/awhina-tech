import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(__dirname, "../public/og.png");

const html = `<!doctype html>
<html lang="en-NZ">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />
<style>
  :root {
    --surface: #fafaf7;
    --ink: #0e1413;
    --ink-2: #2a2f2d;
    --muted: #6b716e;
    --line: #e5e4dd;
    --pounamu: #2f5d3a;
    --pounamu-soft: #e9efe6;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    width: 1200px;
    height: 630px;
    background: var(--surface);
    color: var(--ink);
    font-family: "Inter Tight", -apple-system, system-ui, sans-serif;
    letter-spacing: -0.005em;
    -webkit-font-smoothing: antialiased;
    position: relative;
    overflow: hidden;
  }
  .card {
    position: absolute;
    inset: 0;
    padding: 72px 80px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .brand {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    font-weight: 600;
    font-size: 24px;
    letter-spacing: -0.018em;
    color: var(--ink);
  }
  .brand-mark {
    width: 38px;
    height: 38px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--pounamu);
  }
  .brand-mark svg { width: 32px; height: 32px; }
  .headline {
    font-weight: 600;
    font-size: 84px;
    line-height: 1.04;
    letter-spacing: -0.028em;
    color: var(--ink);
    max-width: 980px;
    margin: 0;
  }
  .headline em {
    font-style: normal;
    color: var(--pounamu);
  }
  .meta {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
  }
  .price {
    font-size: 22px;
    color: var(--ink-2);
    font-weight: 500;
    line-height: 1.4;
    max-width: 540px;
  }
  .price .muted { color: var(--muted); font-weight: 400; }
  .url {
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted);
  }
  .grain {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(1200px 600px at 90% -10%, rgba(47, 93, 58, 0.06), transparent 60%),
      radial-gradient(900px 500px at -10% 110%, rgba(184, 136, 27, 0.05), transparent 60%);
  }
  .accent {
    position: absolute;
    right: 80px;
    top: 72px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-weight: 500;
    color: var(--pounamu);
  }
  .accent .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--pounamu);
    box-shadow: 0 0 0 5px rgba(47, 93, 58, 0.16);
  }
</style>
</head>
<body>
  <div class="grain"></div>
  <div class="card">
    <div class="brand">
      <span class="brand-mark">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/>
          <path d="m18 15-2-2"/>
          <path d="m15 18-2-2"/>
        </svg>
      </span>
      Āwhina Tech
    </div>

    <span class="accent">
      <span class="dot"></span>
      Wellington · Aotearoa
    </span>

    <h1 class="headline">
      Custom websites &amp; apps for <em>Aotearoa's charities</em>.
    </h1>

    <div class="meta">
      <p class="price">
        $200 NZD a month, all-in.<br />
        <span class="muted">Hosting and ongoing support included.</span>
      </p>
      <span class="url">awhinatech.nz</span>
    </div>
  </div>
</body>
</html>`;

const browser = await chromium.launch();
try {
  const context = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  // Make sure web fonts have settled before snapshotting.
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(300);
  await page.screenshot({ path: out, type: "png", omitBackground: false });
  console.log(`saved ${out}`);
} finally {
  await browser.close();
}
