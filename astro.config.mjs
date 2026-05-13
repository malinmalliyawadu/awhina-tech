import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://awhinatech.nz",
  trailingSlash: "ignore",
  integrations: [sitemap()],
});
