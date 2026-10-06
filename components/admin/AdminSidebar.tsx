"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Mail,
  Newspaper,
  Link2,
  FileText,
  HelpCircle,
  Layers,
  Briefcase,
  ExternalLink,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Messages", href: "/admin/messages", icon: Mail },
  { label: "Site Content", href: "/admin/content", icon: FileText },
  { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { label: "Services", href: "/admin/services", icon: Layers },
  { label: "Case Studies", href: "/admin/case-studies", icon: Briefcase },
  { label: "Blog", href: "/admin/blog", icon: Newspaper },
  { label: "Link Insertions", href: "/admin/link-insertions", icon: Link2 },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-white/10 bg-[#0e1330] min-h-screen flex flex-col">
      <div className="px-6 py-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-violet-600" />
          <span className="font-display font-semibold text-white text-sm">QUNTAM GEN</span>
        </Link>
        <p className="text-xs text-slate-500 mt-1">Admin Dashboard</p>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-gradient-to-r from-red-500/20 to-violet-600/20 text-white border border-white/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View site
        </Link>
      </div>
    </aside>
  );
}
