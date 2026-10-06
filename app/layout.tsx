import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { loadContent, text } from "@/lib/content";
import { getServices } from "@/lib/siteData";
import { SITE_URL } from "@/lib/siteUrl";
import { INDEXING_ENABLED } from "@/lib/indexing";
import JsonLd from "@/components/JsonLd";
import { ORG_ID, WEBSITE_ID } from "@/lib/seo";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = SITE_URL;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#C81E2C",
};

export const metadata: Metadata = {
  applicationName: "Quntam Gen",
  authors: [{ name: "Quntam Gen", url: siteUrl }],
  creator: "Quntam Gen",
  publisher: "Quntam Gen",
  category: "technology",
  formatDetection: { telephone: false, email: false, address: false },
  metadataBase: new URL(siteUrl),
  // Site-wide indexing kill switch (see lib/indexing.ts). Every page that
  // doesn't set its own `robots` field inherits this default — which is
  // every page except app/admin/layout.tsx (always noindex, independent of
  // this switch) and app/blog/[slug]/page.tsx (combines this with the
  // per-post `robotsIndex` field). Flipping NEXT_PUBLIC_INDEXING_ENABLED
  // to "true" and redeploying is the one change needed to make the whole
  // site indexable again.
  robots: INDEXING_ENABLED
    ? { index: true, follow: true }
    : { index: false, follow: false },
  title: {
    default: "Quntam Gen | Web, SEO, Marketing & AI Automation",
    template: "%s | Quntam Gen",
  },
  description:
    "Quntam Gen builds digital growth engines — web development, SEO, digital marketing, Meta ads, social media, app development, and AI automation.",
  keywords: [
    "web development agency",
    "SEO agency",
    "digital marketing agency",
    "Meta ads management",
    "AI automation agency",
    "app development agency",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Quntam Gen",
    locale: "en_US",
    title: "Quntam Gen | Web, SEO, Marketing & AI Automation",
    description:
      "We build digital growth engines: web development, SEO, digital marketing, Meta ads, social media, app development, and AI automation.",
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630, alt: "Quntam Gen" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quntam Gen | Web, SEO, Marketing & AI Automation",
    description: "We build digital growth engines for ambitious businesses.",
    images: ["/images/og-default.jpg"],
  },
  // No site-wide `canonical` here on purpose: a canonical inherited from the
  // layout would point every page without its own canonical at the homepage.
  alternates: {
    types: { "application/rss+xml": [{ url: "/blog/feed.xml", title: "Quntam Gen Blog" }] },
  },
  // Previously documented in .env.local.example but never actually read
  // anywhere — setting the env var had zero effect. Google issues this as
  // a <meta name="google-site-verification"> tag to prove domain ownership
  // for Search Console; only added to the page when the env var is set, so
  // this is a no-op for anyone who hasn't configured it.
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } }
    : {}),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [content, services] = await Promise.all([loadContent(), getServices()]);

  const facebookUrl = text(content, "global.social.facebook", "https://www.facebook.com/profile.php?id=61594184384426");
  const instagramUrl = text(content, "global.social.instagram", "https://www.instagram.com/quntamgen/");
  const linkedinUrl = text(content, "global.social.linkedin", "https://www.linkedin.com/company/quntam-gen/");

  const email = text(content, "global.email", "support@quntamgen.com");

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": ORG_ID,
    name: "Quntam Gen",
    alternateName: "QuntamGen",
    url: siteUrl,
    logo: { "@type": "ImageObject", url: `${siteUrl}/images/logo.webp`, width: 512, height: 512 },
    image: `${siteUrl}/images/og-default.jpg`,
    description:
      "Quntam Gen is a digital growth agency: web development, SEO, digital marketing, Meta ads, social media, app development, AI automation, UI/UX design, and custom software.",
    slogan: "Innovate. Build. Transform.",
    foundingDate: "2022",
    email,
    contactPoint: [
      { "@type": "ContactPoint", contactType: "customer support", email, availableLanguage: ["English"] },
    ],
    areaServed: "Worldwide",
    knowsAbout: [
      "Web development",
      "Search engine optimization",
      "Digital marketing",
      "Meta ads management",
      "Social media marketing",
      "App development",
      "AI automation",
      "UI/UX design",
      "Custom software development",
    ],
    sameAs: [facebookUrl, instagramUrl, linkedinUrl],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: "Quntam Gen",
    url: siteUrl,
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
  };

  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="bg-base text-ink-body antialiased">
        <JsonLd data={[orgJsonLd, websiteJsonLd]} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-brand-gradient focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
        >
          Skip to content
        </a>
        <SiteChrome content={content} services={services}>{children}</SiteChrome>
      </body>
    </html>
  );
}
