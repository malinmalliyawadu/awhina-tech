import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://awhinatech.nz",
  trailingSlash: "ignore",
  // Per-client hubs under /clients/ are unlisted — keep them out of the sitemap.
  integrations: [sitemap({ filter: (page) => !page.includes("/clients/") })],
});
