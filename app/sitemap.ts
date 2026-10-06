import type { MetadataRoute } from "next";
import { getServices, getCaseStudies } from "@/lib/siteData";
import { getIndexablePostsForSitemap } from "@/lib/posts";
import { SITE_URL } from "@/lib/siteUrl";
import { INDEXING_ENABLED } from "@/lib/indexing";

const siteUrl = SITE_URL;

export const revalidate = 60;

// lastModified is only emitted where it is a real date (blog posts). Stamping
// every URL with `new Date()` on each request tells Google everything changed
// "just now", every time — which makes it distrust and ignore the field.
// Note: /admin and its subpages are intentionally never included here — see
// app/robots.ts, which also disallows crawling them.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // While the site-wide indexing switch (lib/indexing.ts) is off, nothing
  // should be submitted for indexing — an empty sitemap is the cleanest,
  // most technically correct way to express that. This is NOT the
  // mechanism doing the actual noindex enforcement (that's the <meta
  // name="robots"> tag in app/layout.tsx and the X-Robots-Tag header in
  // next.config.mjs, both of which work whether or not a URL is listed
  // here) — it just avoids submitting URLs to Search Console that are
  // simultaneously marked noindex, which otherwise shows up there as a
  // confusing "Submitted URL marked 'noindex'" warning.
  if (!INDEXING_ENABLED) {
    return [];
  }

  // Published-only, DB-backed (falls back to the seed file only if the DB
  // is empty/unreachable) — so a service or case study added, edited, or
  // unpublished from the admin dashboard is reflected here immediately,
  // instead of the sitemap being stuck on the original seed content.
  const [services, caseStudies, posts] = await Promise.all([
    getServices(),
    getCaseStudies(),
    getIndexablePostsForSitemap(),
  ]);

  const staticRoutes = [
    "",
    "/services",
    "/about",
    "/portfolio",
    "/pricing",
    "/blog",
    "/faq",
    "/contact",
    "/link-insertion",
    "/privacy-policy",
    "/terms-of-service",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const serviceRoutes = services.map((s) => ({
    url: `${siteUrl}/services/${s.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const caseStudyRoutes = caseStudies.map((c) => ({
    url: `${siteUrl}/portfolio/${c.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Published AND indexable only — noindex posts stay live/crawlable but
  // are deliberately left out of the sitemap (see app/blog/[slug]/page.tsx
  // for the matching `robots` meta tag, and lib/posts.ts for the query).
  const blogRoutes = posts.map(({ slug, lastModified }) => ({
    url: `${siteUrl}/blog/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes, ...caseStudyRoutes, ...blogRoutes];
}
