"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, Newspaper, Loader2, Plus, ExternalLink } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmButton from "@/components/admin/ConfirmButton";
import IndexToggle from "@/components/admin/IndexToggle";

type PostSummary = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  status: "draft" | "published";
  // Optional/undefined covers posts saved before this field existed —
  // treated as indexable everywhere it's read (see lib/posts.ts).
  robotsIndex?: boolean;
  publishedAt: string;
  coverImage: string;
  updatedAt: string;
};

const STATUS_OPTIONS = ["all", "draft", "published"] as const;

export default function PostsTable() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (status !== "all") params.set("status", status);
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/posts?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load posts");
      setPosts(json.posts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [status, search]);

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);

  async function deletePost(id: string) {
    const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p._id !== id));
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-colors ${
                status === s ? "bg-gradient-to-r from-red-500 to-violet-600 text-white" : "bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts…"
              className="admin-input pl-9"
            />
          </div>
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-red-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> New Post
          </Link>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <Newspaper className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No posts found.</p>
        </div>
      ) : (
        <div className="rounded-xl2 border border-white/10 bg-[#131a35] divide-y divide-white/5">
          {posts.map((p) => (
            <div key={p._id} className="flex items-center gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link href={`/admin/blog/${p._id}`} className="text-sm font-medium text-white hover:text-violet-300 transition-colors truncate">
                    {p.title}
                  </Link>
                  <StatusBadge status={p.status} />
                  <IndexToggle postId={p._id} initialValue={p.robotsIndex !== false} />
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  /blog/{p.slug} · {p.category} · Updated {new Date(p.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {p.status === "published" && (
                  <a
                    href={`/blog/${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-white/5 p-2 text-slate-300 hover:bg-white/10 transition-colors"
                    aria-label="View live"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <Link
                  href={`/admin/blog/${p._id}`}
                  className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors"
                >
                  Edit
                </Link>
                <ConfirmButton onConfirm={() => deletePost(p._id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
