/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  async redirects() {
    // The canonical production domain is https://quntamgen.com (no "www").
    // This only matches requests whose Host header is literally
    // "www.quntamgen.com" — it's a no-op for localhost, a Hostinger temp
    // domain, or the apex domain itself, so it's safe to ship even before
    // DNS for the www subdomain is pointed anywhere. If www ever is pointed
    // at this same app, this keeps both hostnames from being crawled/
    // indexed as separate, duplicate copies of the site.
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.quntamgen.com" }],
        destination: "https://quntamgen.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    // In development, skip the custom CSP entirely. Next.js's dev-mode Fast
    // Refresh / HMR runtime needs eval and other allowances that shift
    // between versions, and dev builds are never public-facing anyway — so
    // there's no security reason to restrict them. The full strict CSP
    // (no 'unsafe-eval', ever) only applies to the production build.
    if (process.env.NODE_ENV === "development") {
      return [];
    }

    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com",
      "frame-src https://www.google.com",
      "object-src 'none'",
      "base-uri 'self'",
    ].join("; ");

    const baseHeaders = [
      { key: "Content-Security-Policy", value: csp },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      // Force HTTPS for a year (incl. subdomains) once a visitor has hit the site over HTTPS.
      { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
    ];

    const headerRules = [
      {
        source: "/:path*",
        headers: baseHeaders,
      },
      // Static images in /public have stable file names, so cache them hard
      // (browser + CDN) but let them revalidate in the background — faster
      // repeat visits and better LCP / PageSpeed scores.
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
      // Belt-and-suspenders on top of app/admin/layout.tsx's own `robots`
      // metadata: the admin dashboard is never indexable, independent of
      // the site-wide NEXT_PUBLIC_INDEXING_ENABLED switch below.
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];

    // Site-wide pre-launch kill switch (see lib/indexing.ts for the full
    // rationale). The <meta name="robots"> tag in app/layout.tsx is the
    // primary mechanism; this header is a second, independent signal some
    // crawlers/tools read even before fetching HTML — intentionally NOT a
    // substitute for robots.txt blocking, which would stop Google from
    // crawling the page and seeing this directive at all.
    if (process.env.NEXT_PUBLIC_INDEXING_ENABLED !== "true") {
      headerRules.push({
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      });
    }

    return headerRules;
  },
};

export default nextConfig;
