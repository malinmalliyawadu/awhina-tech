import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "../public/screenshots");
const eeAuth = path.resolve(__dirname, ".auth/everybody-eats.json");

const targets = [
  {
    // Authenticated volunteer dashboard. Needs a saved session — run
    // `pnpm run screenshots:auth` once first (see scripts/auth-everybody-eats.mjs).
    name: "everybody-eats-hero",
    url: "https://volunteers.everybodyeats.nz/dashboard",
    storageState: eeAuth,
    colorScheme: "light",
    waitForText: /kia ora/i,
  },
  {
    name: "fair-food",
    url: "https://volunteer.fairfood.org.nz/",
  },
  {
    name: "compassion",
    url: "https://compassion.awhinatech.nz/",
  },
];

const cookieSelectors = [
  'button:has-text("Accept all")',
  'button:has-text("Accept")',
  'button:has-text("I agree")',
  'button:has-text("Got it")',
  'button:has-text("OK")',
  'button:has-text("Allow all")',
  '[aria-label="Accept cookies"]',
  '[aria-label="Close"]',
  "#onetrust-accept-btn-handler",
  ".cookie-accept",
];

async function dismissCookies(page) {
  for (const sel of cookieSelectors) {
    try {
      const el = await page.$(sel);
      if (el && (await el.isVisible())) {
        await el.click({ timeout: 1000 }).catch(() => {});
        await page.waitForTimeout(300);
        break;
      }
    } catch {}
  }
}

async function capture(
  browser,
  { name, url, storageState, colorScheme, waitForText }
) {
  if (storageState && !existsSync(storageState)) {
    throw new Error(
      `${name}: no saved session at ${path.relative(
        process.cwd(),
        storageState
      )}.\n` +
        `  Run \`pnpm run screenshots:auth\` once to sign in, then re-run.`
    );
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1080 },
    deviceScaleFactor: 2,
    ...(colorScheme ? { colorScheme } : {}),
    ...(storageState ? { storageState } : {}),
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();
  console.log(`→ ${name}: ${url}`);
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  } catch (err) {
    console.warn(`  networkidle timed out for ${url}, falling back to load`);
    await page.goto(url, { waitUntil: "load", timeout: 45000 });
  }
  await dismissCookies(page);

  if (waitForText) {
    try {
      await page.getByText(waitForText).first().waitFor({ timeout: 15000 });
    } catch {
      await context.close();
      throw new Error(
        `${name}: signed-out or expired session (never saw ${waitForText}).\n` +
          `  Re-run \`pnpm run screenshots:auth\` to refresh the session, then retry.`
      );
    }
  }

  // give animations / lazy images a moment
  await page.waitForTimeout(1500);
  // scroll a touch and back to trigger lazy loads, then settle at top
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);

  const out = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: out, fullPage: false, type: "png" });
  console.log(`  saved ${out}`);
  await context.close();
}

const browser = await chromium.launch();
let failed = false;
try {
  for (const t of targets) {
    try {
      await capture(browser, t);
    } catch (err) {
      failed = true;
      console.error(`✗ ${err.message}`);
    }
  }
} finally {
  await browser.close();
}
process.exit(failed ? 1 : 0);
