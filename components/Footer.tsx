import Link from "next/link";
import Image from "next/image";
import { Linkedin, Instagram, Facebook, Mail, MapPin } from "lucide-react";
import type { Service } from "@/data/services";
import { services as fallbackServices } from "@/data/services";
import NewsletterForm from "@/components/NewsletterForm";
import type { ContentMap } from "@/lib/content-client";
import { text } from "@/lib/content-client";

export default function Footer({ content, services }: { content?: ContentMap; services?: Service[] }) {
  const c = content ?? {};
  const svcList = services ?? fallbackServices;

  const email = text(c, "global.email", "support@quntamgen.com");
  const location = text(c, "global.location", "Remote-first, worldwide");
  const tagline = text(
    c,
    "global.footer.tagline",
    "We build digital growth engines — websites, marketing systems, and AI automations for businesses ready to scale."
  );

  const socials = [
    { icon: Facebook, href: text(c, "global.social.facebook", "https://www.facebook.com/profile.php?id=61594184384426"), label: "Facebook" },
    { icon: Linkedin, href: text(c, "global.social.linkedin", "https://www.linkedin.com/company/quntam-gen/"), label: "LinkedIn" },
    { icon: Instagram, href: text(c, "global.social.instagram", "https://www.instagram.com/quntamgen/"), label: "Instagram" },
  ];

  return (
    <footer className="border-t border-border bg-surface2">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <Link href="/" className="flex items-center gap-3 mb-4">
            <Image src="/images/logo.webp" alt="Quntam Gen" width={40} height={40} className="rounded-md" />
            <span className="font-display font-semibold text-ink-heading">QUNTAM GEN</span>
          </Link>
          <p className="text-sm text-ink-muted mb-1">Innovate • Build • Transform</p>
          <p className="text-sm text-ink-body max-w-xs mt-3">
            {tagline}
          </p>
          <div className="flex items-center gap-3 mt-6">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border bg-white p-2.5 text-ink-muted hover:text-white hover:border-transparent hover:bg-brand-gradient transition-all duration-micro ease-out-expo"
              >
                <s.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h6 className="text-sm font-semibold text-ink-heading mb-4">Services</h6>
          <ul className="space-y-2.5">
            {svcList.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="text-sm text-ink-muted hover:text-brand-start transition-colors">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h6 className="text-sm font-semibold text-ink-heading mb-4">Company</h6>
          <ul className="space-y-2.5">
            {[
              { label: "About Us", href: "/about" },
              { label: "Portfolio", href: "/portfolio" },
              { label: "Pricing", href: "/pricing" },
              { label: "Blog", href: "/blog" },
              { label: "Contact", href: "/contact" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-ink-muted hover:text-brand-start transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h6 className="text-sm font-semibold text-ink-heading mb-4">Resources</h6>
          <ul className="space-y-2.5">
            {[
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms of Service", href: "/terms-of-service" },
              { label: "FAQs", href: "/faq" },
              { label: "Link Insertion", href: "/link-insertion" },
              { label: "Sitemap", href: "/sitemap.xml" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-ink-muted hover:text-brand-start transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-2 text-sm text-ink-muted">
            <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-brand-start transition-colors">
              <Mail className="w-4 h-4" /> {email}
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {location}
            </span>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h6 className="text-sm font-semibold text-ink-heading mb-4">Stay Updated</h6>
          <p className="text-sm text-ink-muted mb-3">Growth tips, monthly. No spam.</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-muted">
          <span>© {new Date().getFullYear()} Quntam Gen. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-brand-start transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-brand-start transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
