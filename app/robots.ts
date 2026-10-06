import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

/**
 * Deliberately does NOT change based on the site-wide indexing switch
 * (lib/indexing.ts). Public pages stay crawlable ("allow: /") whether
 * indexing is globally on or off — a robots.txt `disallow` would stop
 * Google from fetching the page at all, which means it would never see
 * the <meta name="robots" content="noindex"> tag or X-Robots-Tag header
 * that are the actual enforcement mechanism (see app/layout.tsx and
 * next.config.mjs). Blocking crawling here would work against, not with,
 * the noindex strategy. /admin stays disallowed either way, purely to
 * keep well-behaved crawlers from wasting time on it — it's already
 * independently protected by middleware.ts (auth) and noindex (always,
 * regardless of this switch — see app/admin/layout.tsx).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
