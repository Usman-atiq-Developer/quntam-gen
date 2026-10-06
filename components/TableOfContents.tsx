"use client";

import { useEffect, useState } from "react";

export default function TableOfContents({
  headings,
}: {
  headings: { depth: number; text: string; slug: string }[];
}) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-100px 0px -70% 0px" }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.slug);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <h6 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">On this page</h6>
      <ul className="space-y-2 border-l border-border">
        {headings.map((h) => (
          <li key={h.slug} style={{ paddingLeft: h.depth === 3 ? "2rem" : "1rem" }}>
            <a
              href={`#${h.slug}`}
              className={`block -ml-px border-l-2 pl-4 py-1 text-sm transition-colors duration-micro ${
                activeId === h.slug
                  ? "border-brand-end text-ink-heading font-medium"
                  : "border-transparent text-ink-muted hover:text-ink-heading"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
