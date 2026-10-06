import type { Metadata } from "next";
import { SITE_URL } from "@/lib/siteUrl";

const SITE_NAME = "Quntam Gen";
const DEFAULT_OG_IMAGE = "/images/og-default.jpg";

/**
 * Builds a complete, self-contained Metadata object for a page: a title,
 * an explicit canonical URL, and a fully-specified OpenGraph + Twitter
 * card — all derived from the same title/description so they can't drift
 * out of sync with each other.
 *
 * Why this exists: Next.js does NOT deep-merge nested metadata objects
 * (`openGraph`, `twitter`) between a layout and a page — if a page defines
 * its own `openGraph`, that object *replaces* the parent layout's `openGraph`
 * entirely rather than filling in the missing pieces. So a page that only
 * sets `title`/`description` (the previous pattern on most pages in this
 * app) either inherits the *homepage's* OG data verbatim, or — if it sets
 * a partial `openGraph` — ends up with a broken/incomplete social preview.
 * Building the full object here, once, avoids both problems and avoids
 * hand-duplicating the same OG/Twitter boilerplate on every page.
 *
 * `path` must be the page's root-relative canonical path (e.g. "/about").
 * `metadataBase` is set once in the root layout, so relative image/url
 * values resolve to absolute URLs automatically.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
      types: { "application/rss+xml": [{ url: "/blog/feed.xml", title: "Quntam Gen Blog" }] },
    },
    openGraph: {
      type,
      url: path,
      siteName: SITE_NAME,
      locale: "en_US",
      title: fullTitle,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

/** Turns a root-relative path or an already-absolute URL into an absolute URL. */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/** Stable @id values so every schema block can reference the same entities. */
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** BreadcrumbList JSON-LD. The last crumb is the current page (no `item`). */
export function breadcrumbJsonLd(crumbs: { name: string; path?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.path !== undefined ? { item: c.path === "" ? SITE_URL : absoluteUrl(c.path) } : {}),
    })),
  };
}

/** Generic WebPage-family JSON-LD (AboutPage, ContactPage, CollectionPage...). */
export function webPageJsonLd({
  type = "WebPage",
  name,
  description,
  path,
}: {
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "FAQPage";
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    inLanguage: "en",
  };
}
