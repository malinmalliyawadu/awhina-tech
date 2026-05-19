// One-off captures of the systems each charity build replaced — used as the
// "before" in the case-study compare sliders. Output matches the existing
// screenshots in public/screenshots/ (2880x2160, 4:3, 2x retina).
//
//   node scripts/capture-before.mjs               # all targets
//   node scripts/capture-before.mjs compassion    # a single target
//
// Re-run if a charity's old/source page changes. Keep this script around —
// the befores are external pages and may need refreshing.
import { chromium } from "playwright";

/**
 * Each target says where to point the 1440x1080 frame on the source page.
 * `frame(page)` returns the scroll-Y that best frames the relevant region.
 */
const TARGETS = {
  "fair-food": {
    url: "https://www.signupgenius.com/go/10c0d4dabab29a7fdc61-fair#/",
    out: "public/screenshots/fair-food-before.png",
    // The SignUpGenius header: generic SaaS chrome on a stock template.
    frame: () => 0,
  },
  compassion: {
    url: "https://compassion.org.nz/support-us/volunteer/",
    out: "public/screenshots/compassion-before.png",
    // The volunteer sign-up form sitting partway down their main site.
    frame: () =>
      (() => {
        const forms = [...document.querySelectorAll("form")].filter(
          (f) =>
            f.querySelectorAll("input, select, textarea").length >= 3 &&
            f.offsetHeight > 200,
        );
        let el = forms.sort((a, b) => b.offsetHeight - a.offsetHeight)[0];
        if (!el) {
          el = [...document.querySelectorAll("iframe")].find((i) =>
            /form|jotform|gravity|wufoo|typeform|airtable|cognito|tfaforms|hsforms/i.test(
              `${i.src} ${i.title || ""}`,
            ),
          );
        }
        if (!el) {
          const h = [...document.querySelectorAll("h1, h2, h3")].find((n) =>
            /volunteer|sign ?up|register|express your interest|get involved|enquiry/i.test(
              n.textContent || "",
            ),
          );
          el = h ? h.closest("section, .elementor-section, div") : null;
        }
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        // Leave a little context above the form.
        return Math.max(0, window.scrollY + r.top - 64);
      })(),
  },
};

async function dismissBanners(page) {
  for (const re of [/accept/i, /agree/i, /got it/i, /allow/i, /^ok$/i]) {
    const b = page.getByRole("button", { name: re }).first();
    if (await b.count().catch(() => 0)) await b.click().catch(() => {});
  }
  await page
    .locator('[aria-label*="close" i], .cookie-close, #close-cookie')
    .first()
    .click({ timeout: 1000 })
    .catch(() => {});
}

async function capture(name, t, browser) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1080 },
    deviceScaleFactor: 2,
  });
  await page.goto(t.url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForSelector("h1", { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3500);
  await dismissBanners(page);
  await page.waitForTimeout(500);

  const y = await page.evaluate(t.frame);
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(600);

  await page.screenshot({
    path: t.out,
    clip: { x: 0, y: 0, width: 1440, height: 1080 },
  });
  await page.close();
  console.log("saved", t.out);
}

const which = process.argv[2];
const entries = which
  ? [[which, TARGETS[which]]]
  : Object.entries(TARGETS);

if (which && !TARGETS[which]) {
  console.error(
    `unknown target "${which}". options: ${Object.keys(TARGETS).join(", ")}`,
  );
  process.exit(1);
}

const browser = await chromium.launch({ channel: "chrome" });
for (const [name, t] of entries) await capture(name, t, browser);
await browser.close();
