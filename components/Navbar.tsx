"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X, ArrowRight, Sparkles } from "lucide-react";
import type { Service } from "@/data/services";
import { services as fallbackServices } from "@/data/services";
import { ServiceIcon } from "@/components/IconMap";
import { getCategoryStyle } from "@/lib/categoryStyle";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services", hasMega: true },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar({ services: dbServices }: { services?: Service[] }) {
  // Falls back to the original hard-coded list only if the DB-backed list
  // wasn't passed down — keeps the nav's Services menu (and its /services/
  // links) in sync with whatever's actually published in the admin
  // dashboard, instead of a static snapshot that can drift from real URLs.
  const services = dbServices ?? fallbackServices;
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-3 sm:top-5 inset-x-3 sm:inset-x-6 z-50 mx-auto max-w-6xl"
      >
        <div className="relative">
          <div
            className={`relative flex items-center justify-between rounded-full border bg-white/85 backdrop-blur-xl px-4 sm:px-5 py-2.5 transition-all duration-300 ease-out-expo ${
              scrolled
                ? "border-border shadow-[0_12px_32px_rgba(10,10,12,0.10)]"
                : "border-border/70 shadow-[0_6px_20px_rgba(10,10,12,0.06)]"
            }`}
          >
            <Link href="/" className="group flex items-center gap-2.5 shrink-0">
              <span className="relative block">
                <span className="absolute -inset-1.5 rounded-full bg-brand-gradient opacity-0 blur-md transition-opacity duration-micro ease-out-expo group-hover:opacity-40" />
                <Image
                  src="/images/logo.webp"
                  alt="Quntam Gen"
                  width={38}
                  height={38}
                  className="relative rounded-full transition-transform duration-[400ms] ease-out-expo group-hover:rotate-[8deg] group-hover:scale-105"
                  priority
                />
              </span>
              <span className="hidden sm:flex flex-col leading-none">
                <span className="font-display font-semibold text-ink-heading text-sm tracking-tight">
                  QUNTAM
                </span>
                <span className="text-[10px] tracking-[0.2em] text-brand-end">GEN</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1" onMouseLeave={() => setMegaOpen(false)}>
              {navLinks.map((link) => {
                const active = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
                return (
                  <div key={link.href} className="relative" onMouseEnter={() => link.hasMega && setMegaOpen(true)}>
                    <Link
                      href={link.href}
                      className={`group relative px-3.5 py-2 text-sm font-medium transition-colors duration-micro flex items-center gap-1 rounded-full ${
                        active ? "text-brand-start font-semibold" : "text-ink-body hover:text-ink-heading"
                      }`}
                    >
                      {link.label}
                      {link.hasMega && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-300 ease-out-expo ${megaOpen ? "rotate-180" : ""}`}
                        />
                      )}
                      {active && (
                        <motion.span
                          layoutId="nav-active-pill"
                          className="absolute inset-0 -z-10 rounded-full bg-red-50"
                          transition={{ type: "spring", stiffness: 380, damping: 28 }}
                        />
                      )}
                      {!active && (
                        <span className="pointer-events-none absolute inset-0 -z-10 scale-90 rounded-full bg-surface2 opacity-0 transition-all duration-300 ease-out-expo group-hover:scale-100 group-hover:opacity-100" />
                      )}
                    </Link>
                  </div>
                );
              })}
            </nav>

            <div className="hidden lg:block shrink-0">
              <Link
                href="/contact"
                className="group btn-gradient relative inline-flex items-center gap-1.5 overflow-hidden rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(200,30,44,0.28)] transition-transform duration-300 ease-out-expo hover:scale-105"
              >
                <span className="absolute inset-0 -translate-x-full bg-white/20 skew-x-12 transition-transform duration-500 ease-out-expo group-hover:translate-x-full" />
                <span className="relative">Get a Free Quote</span>
                <ArrowRight className="relative w-4 h-4 transition-transform duration-micro ease-out-expo group-hover:translate-x-1" />
              </Link>
            </div>

            <button
              className="lg:hidden rounded-full p-2.5 text-ink-heading transition-colors duration-micro hover:bg-surface2"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Mega menu — its own detached floating panel below the pill */}
          <AnimatePresence>
            {megaOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
                className="hidden lg:block absolute left-0 right-0 top-full mt-3 rounded-2xl border border-border bg-white shadow-[0_24px_60px_rgba(10,10,12,0.14)] overflow-hidden"
              >
                <div className="px-8 py-8 grid grid-cols-[1fr_280px] gap-8">
                  <div className="grid grid-cols-3 gap-2">
                    {services.map((service, i) => {
                      const style = getCategoryStyle(service.category);
                      return (
                        <motion.div
                          key={service.slug}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.035, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <Link
                            href={`/services/${service.slug}`}
                            className="group/item relative flex items-start gap-3 rounded-xl p-3 overflow-hidden"
                          >
                            <span className="absolute inset-0 scale-95 rounded-xl bg-surface2 opacity-0 transition-all duration-300 ease-out-expo group-hover/item:scale-100 group-hover/item:opacity-100" />
                            <span
                              className={`relative mt-0.5 rounded-lg ${style.bg} p-2.5 ${style.text} transition-transform duration-300 ease-out-expo group-hover/item:scale-110 group-hover/item:-rotate-6`}
                            >
                              <ServiceIcon name={service.icon} className="w-5 h-5" />
                            </span>
                            <span className="relative">
                              <span className="flex items-center gap-1.5 text-sm font-semibold text-ink-heading">
                                {service.name}
                                <ArrowRight className="w-3.5 h-3.5 -translate-x-1 opacity-0 transition-all duration-300 ease-out-expo group-hover/item:translate-x-0 group-hover/item:opacity-100 text-brand-end" />
                              </span>
                              <span className="block text-xs text-ink-muted mt-0.5 leading-snug">{service.oneLiner}</span>
                            </span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="relative overflow-hidden rounded-xl2 bg-brand-gradient-diag p-6 flex flex-col justify-between"
                  >
                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-brand-gradient opacity-20 blur-2xl" aria-hidden="true" />
                    <div className="relative">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white">
                        <Sparkles className="w-3.5 h-3.5" /> Not Sure?
                      </span>
                      <p className="mt-3 text-white font-semibold leading-snug">
                        Tell us your goal — we'll recommend the right service, free.
                      </p>
                    </div>
                    <Link
                      href="/contact"
                      className="relative mt-6 inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-brand-start transition-transform duration-micro ease-out-expo hover:scale-105"
                    >
                      Get a Free Quote <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                </div>
                <div className="border-t border-border">
                  <Link
                    href="/services"
                    className="group flex items-center justify-center gap-1.5 py-3.5 text-sm font-semibold text-brand-end hover:text-brand-start transition-colors duration-micro"
                  >
                    View all services
                    <ArrowRight className="w-4 h-4 transition-transform duration-micro ease-out-expo group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white lg:hidden flex flex-col"
          >
            <div className="flex items-center justify-between h-20 px-6">
              <Image src="/images/logo.webp" alt="Quntam Gen" width={40} height={40} className="rounded-full" />
              <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="text-ink-heading p-2 rounded-full hover:bg-surface2 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 flex flex-col gap-1 px-6 py-4 overflow-y-auto">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  {link.hasMega ? (
                    <div>
                      <button
                        className="w-full flex items-center justify-between py-4 text-lg font-medium text-ink-heading border-b border-border"
                        onClick={() => setMobileServicesOpen((v) => !v)}
                      >
                        Services
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-micro ${mobileServicesOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileServicesOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            {services.map((s) => {
                              const style = getCategoryStyle(s.category);
                              return (
                                <Link
                                  key={s.slug}
                                  href={`/services/${s.slug}`}
                                  className="flex items-center gap-3 py-3 pl-2 text-ink-muted hover:text-ink-heading transition-colors"
                                >
                                  <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                                  {s.name}
                                </Link>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link href={link.href} className="block py-4 text-lg font-medium text-ink-heading border-b border-border">
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
              <Link
                href="/contact"
                className="btn-gradient mt-6 inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-3 text-sm font-semibold text-white"
              >
                Get a Free Quote <ArrowRight className="w-4 h-4" />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
