"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, Loader2, Plus, Briefcase, ChevronUp, ChevronDown, ExternalLink } from "lucide-react";
import ConfirmButton from "@/components/admin/ConfirmButton";

type Row = {
  _id: string;
  slug: string;
  client: string;
  title: string;
  category: string;
  image: string;
  resultStat: string;
  published: boolean;
  order: number;
};

export default function CaseStudiesTable() {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/case-studies?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load case studies");
      setItems(json.caseStudies);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load case studies");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  async function patch(id: string, changes: Partial<Row>) {
    setItems((prev) => prev.map((s) => (s._id === id ? { ...s, ...changes } : s)));
    await fetch(`/api/admin/case-studies/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    });
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/case-studies/${id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((s) => s._id !== id));
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const a = items[index];
    const b = items[target];
    const next = [...items];
    next[index] = b;
    next[target] = a;
    setItems(next);
    await Promise.all([patch(a._id, { order: b.order }), patch(b._id, { order: a.order })]);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search case studies…"
            className="admin-input pl-9"
          />
        </div>
        <Link
          href="/admin/case-studies/new"
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-red-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> New Case Study
        </Link>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <Briefcase className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No case studies found.</p>
          <p className="text-xs mt-1">
            Run <code className="text-violet-300">npm run seed:content</code> to import your existing 8.
          </p>
        </div>
      ) : (
        <div className="rounded-xl2 border border-white/10 bg-[#131a35] divide-y divide-white/5">
          {items.map((s, i) => (
            <div key={s._id} className="flex items-center gap-4 px-5 py-4">
              <div className="flex flex-col gap-0.5 shrink-0">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="text-slate-600 hover:text-white disabled:opacity-25" aria-label="Move up">
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="text-slate-600 hover:text-white disabled:opacity-25" aria-label="Move down">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {s.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0 border border-white/10" />
              ) : (
                <span className="w-12 h-12 rounded-lg bg-white/5 shrink-0" aria-hidden="true" />
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link href={`/admin/case-studies/${s._id}`} className="text-sm font-medium text-white hover:text-violet-300 transition-colors">
                    {s.client}
                  </Link>
                  {s.resultStat && <span className="text-xs text-emerald-300">{s.resultStat}</span>}
                  {!s.published && (
                    <span className="text-[10px] uppercase tracking-wide text-slate-500 border border-white/10 rounded px-1.5 py-0.5">hidden</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">{s.title}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => patch(s._id, { published: !s.published })}
                  className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  {s.published ? "Unpublish" : "Publish"}
                </button>
                {s.published && (
                  <a href={`/portfolio/${s.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white/5 p-2 text-slate-300 hover:bg-white/10" aria-label="View live">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <Link href={`/admin/case-studies/${s._id}`} className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors">
                  Edit
                </Link>
                <ConfirmButton onConfirm={() => remove(s._id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
