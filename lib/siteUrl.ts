/**
 * The site's canonical absolute URL — no trailing slash.
 *
 * Previously this exact string was hardcoded independently in ~8 different
 * files (app/layout.tsx, app/sitemap.ts, app/robots.ts,
 * app/blog/[slug]/page.tsx, app/blog/feed.xml/route.ts,
 * app/services/page.tsx, app/services/[slug]/page.tsx,
 * app/portfolio/page.tsx, app/portfolio/[slug]/page.tsx). They all happened
 * to agree, but nothing enforced that — one missed spot on a future domain
 * change (or a staging/preview deploy) would silently create mismatched
 * canonical URLs, sitemap entries, and JSON-LD. Reading it from
 * `NEXT_PUBLIC_SITE_URL` (with this file's constant as the fallback) means
 * it only has to be correct in one place, and can still be overridden per
 * environment without a code change.
 *
 * Canonical production domain is https://quntamgen.com (no "www").
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://quntamgen.com").replace(/\/+$/, "");
