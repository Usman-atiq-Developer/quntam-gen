"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import BlogCard from "@/components/BlogCard";
import FeaturedPostCard from "@/components/FeaturedPostCard";
import type { PostSummary } from "@/lib/posts";

const PAGE_SIZE = 6;

export default function BlogListing({ posts }: { posts: PostSummary[] }) {
  const categories = useMemo(() => ["All", ...Array.from(new Set(posts.map((p) => p.category)))], [posts]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      const matchesQuery =
        query.trim() === "" ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [posts, activeCategory, query]);

  const visible = filtered.slice(0, visibleCount);
  const showFeatured = activeCategory === "All" && query.trim() === "" && visible.length > 0;
  const featured = showFeatured ? visible[0] : undefined;
  const rest = showFeatured ? visible.slice(1) : visible;

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div className="flex flex-wrap justify-center gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setVisibleCount(PAGE_SIZE);
              }}
              className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-300 ease-out-expo ${
                activeCategory === cat
                  ? "border-transparent bg-brand-gradient text-white shadow-[0_8px_20px_rgba(200,30,44,0.32)] scale-[1.04]"
                  : "border-border bg-white text-ink-muted hover:-translate-y-0.5 hover:border-brand-end/50 hover:text-ink-heading hover:shadow-sm"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder="Search articles…"
            className="w-full rounded-full bg-surface2 border border-border pl-11 pr-4 py-2.5 text-sm text-ink-heading placeholder:text-ink-muted outline-none focus-visible:border-brand-end"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeCategory + query} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          {visible.length === 0 ? (
            <p className="text-center text-ink-muted py-20">No articles match your search yet.</p>
          ) : (
            <>
              {featured && (
                <div className="mb-12">
                  <FeaturedPostCard post={featured} />
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((post, i) => (
                  <BlogCard key={post.slug} post={post} index={i + 1} />
                ))}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {visibleCount < filtered.length && (
        <div className="flex justify-center mt-14">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-ink-heading hover:bg-basedark hover:text-white hover:border-transparent hover:shadow-glow transition-all duration-micro ease-out-expo"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
