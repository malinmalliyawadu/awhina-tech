import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://awhinatech.nz",
  trailingSlash: "ignore",
  // Client hub pages are unlisted: shared with the client by direct link and
  // kept out of search engines (see the `noindex` prop on Base.astro). Keep
  // them out of the sitemap too so they aren't discovered that way.
  integrations: [sitemap({ filter: (page) => !page.includes("/clients/") })],
});
