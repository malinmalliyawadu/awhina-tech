// One-time interactive login for the Everybody Eats volunteer portal.
//
// The portal is a client-rendered app and we don't capture credentials in the
// repo, so instead of scripting the login form we open a real browser, let you
// sign in by hand, then save the authenticated session. capture-screenshots.mjs
// reuses that saved session to grab the dashboard with no browser chrome.
//
//   npm run screenshots:auth   ← run this once (re-run when the session expires)
//
// Sign in with a presentable DEMO account, not your personal one — the
// dashboard shows the logged-in name ("Kia ora, …") in the captured shot.

import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const authDir = path.resolve(__dirname, ".auth");
const statePath = path.join(authDir, "everybody-eats.json");

const URL = "https://volunteers.everybodyeats.nz/";
// The dashboard greets the volunteer by name; that's our "logged in" marker.
const LOGGED_IN = /kia ora/i;
const LOGIN_TIMEOUT_MS = 5 * 60 * 1000;

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1080 },
  deviceScaleFactor: 2,
  colorScheme: "light",
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
});
const page = await context.newPage();

console.log(`\n→ Opening ${URL}`);
console.log("  Sign in with the DEMO account (not your personal one).");
console.log("  Waiting for the dashboard to appear…\n");

await page.goto(URL, { waitUntil: "load", timeout: 45000 });

try {
  await page.getByText(LOGGED_IN).first().waitFor({ timeout: LOGIN_TIMEOUT_MS });
} catch {
  console.error(
    "\n✗ Didn't reach the dashboard within 5 minutes. Nothing saved — re-run when ready.",
  );
  await browser.close();
  process.exit(1);
}

await mkdir(authDir, { recursive: true });
await context.storageState({ path: statePath });
console.log(`\n✓ Session saved to ${path.relative(process.cwd(), statePath)}`);
console.log("  Now run: npm run screenshots\n");

await browser.close();
