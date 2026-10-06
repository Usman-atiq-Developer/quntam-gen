"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmailSupportButton from "@/components/EmailSupportButton";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import ScrollToTop from "@/components/ScrollToTop";
import CookieConsent from "@/components/CookieConsent";
import Analytics from "@/components/Analytics";
import type { ContentMap } from "@/lib/content-client";
import { text } from "@/lib/content-client";
import type { Service } from "@/data/services";

/**
 * The admin dashboard (/admin/**) has its own layout and shouldn't show the
 * public marketing site's navbar, footer, or floating widgets. Since the
 * root layout owns the single <html>/<body> shell (Next.js only allows one),
 * this client component decides at render time whether to wrap `children`
 * with the public chrome or render them bare for the admin area.
 *
 * `content` and `services` are resolved once, server-side, in the root
 * layout and passed down here so Footer can read editable copy and the
 * live services list without needing to be an async Server Component
 * itself (which a Client Component can't render directly).
 */
export default function SiteChrome({
  children,
  content,
  services,
}: {
  children: React.ReactNode;
  content: ContentMap;
  services: Service[];
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main id="main-content">{children}</main>;
  }

  return (
    <>
      <Navbar services={services} />
      <main id="main-content">{children}</main>
      <Footer content={content} services={services} />
      <EmailSupportButton email={text(content, "global.email", "support@quntamgen.com")} />
      <StickyMobileCTA />
      <ScrollToTop />
      <CookieConsent />
      <Analytics />
    </>
  );
}
