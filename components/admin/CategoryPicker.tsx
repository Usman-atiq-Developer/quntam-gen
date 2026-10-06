"use client";

import { useState, useEffect, useRef } from "react";
import { Check, Plus, ChevronDown } from "lucide-react";

/**
 * A combobox for the blog category field: shows existing categories already
 * used across other posts (fetched once), lets the admin pick one, or type
 * a brand new category name that gets created just by using it — there's no
 * separate "manage categories" list, a category exists as soon as a post
 * uses it.
 */
export default function CategoryPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (category: string) => void;
}) {
  const [categories, setCategories] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    fetch("/api/admin/posts/categories")
      .then((res) => res.json())
      .then((json) => setCategories(json.categories ?? []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        // Commit whatever was typed, even if it doesn't match an existing option
        if (query.trim() && query !== value) onChange(query.trim());
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [query, value, onChange]);

  const filtered = categories.filter((c) => c.toLowerCase().includes(query.toLowerCase()));
  const isNew = query.trim() !== "" && !categories.some((c) => c.toLowerCase() === query.trim().toLowerCase());

  function choose(category: string) {
    onChange(category);
    setQuery(category);
    setOpen(false);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              choose(query.trim());
            }
          }}
          className="admin-input pr-9"
          placeholder="SEO, Web Development, AI Automation…"
        />
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
      </div>

      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border border-white/10 bg-[#0b0f1f] shadow-xl max-h-56 overflow-y-auto">
          {filtered.length === 0 && !isNew && (
            <p className="px-3 py-2.5 text-xs text-slate-500">No categories yet — type to create one.</p>
          )}
          {filtered.map((cat) => (
            <button
              key={cat}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                choose(cat);
              }}
              className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm text-slate-200 hover:bg-white/5 transition-colors"
            >
              {cat}
              {cat === value && <Check className="w-3.5 h-3.5 text-violet-300 shrink-0" />}
            </button>
          ))}
          {isNew && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                choose(query.trim());
              }}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-violet-300 hover:bg-white/5 transition-colors border-t border-white/5"
            >
              <Plus className="w-3.5 h-3.5" /> Create &ldquo;{query.trim()}&rdquo;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
