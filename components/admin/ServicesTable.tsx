"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, Loader2, Plus, Layers, ChevronUp, ChevronDown, ExternalLink } from "lucide-react";
import ConfirmButton from "@/components/admin/ConfirmButton";

type ServiceRow = {
  _id: string;
  slug: string;
  name: string;
  category: string;
  oneLiner: string;
  published: boolean;
  order: number;
  theme: { from: string; to: string };
};

export default function ServicesTable() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/services?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load services");
      setServices(json.services);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load services");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  async function patch(id: string, changes: Partial<ServiceRow>) {
    setServices((prev) => prev.map((s) => (s._id === id ? { ...s, ...changes } : s)));
    await fetch(`/api/admin/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    });
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    if (res.ok) setServices((prev) => prev.filter((s) => s._id !== id));
  }

  /** Swaps order with the neighbour so services can be reordered on the site. */
  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= services.length) return;
    const a = services[index];
    const b = services[target];
    const next = [...services];
    next[index] = b;
    next[target] = a;
    setServices(next);
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
            placeholder="Search services…"
            className="admin-input pl-9"
          />
        </div>
        <Link
          href="/admin/services/new"
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-red-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> New Service
        </Link>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <Layers className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No services found.</p>
          <p className="text-xs mt-1">
            Run <code className="text-violet-300">npm run seed:content</code> to import your existing 9 services.
          </p>
        </div>
      ) : (
        <div className="rounded-xl2 border border-white/10 bg-[#131a35] divide-y divide-white/5">
          {services.map((s, i) => (
            <div key={s._id} className="flex items-center gap-4 px-5 py-4">
              <div className="flex flex-col gap-0.5 shrink-0">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="text-slate-600 hover:text-white disabled:opacity-25" aria-label="Move up">
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button onClick={() => move(i, 1)} disabled={i === services.length - 1} className="text-slate-600 hover:text-white disabled:opacity-25" aria-label="Move down">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <span
                className="w-8 h-8 rounded-lg shrink-0"
                style={{ backgroundImage: `linear-gradient(135deg, ${s.theme?.from ?? "#C81E2C"}, ${s.theme?.to ?? "#FF4B3E"})` }}
                aria-hidden="true"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link href={`/admin/services/${s._id}`} className="text-sm font-medium text-white hover:text-violet-300 transition-colors">
                    {s.name}
                  </Link>
                  {!s.published && (
                    <span className="text-[10px] uppercase tracking-wide text-slate-500 border border-white/10 rounded px-1.5 py-0.5">hidden</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">/services/{s.slug} · {s.category}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => patch(s._id, { published: !s.published })}
                  className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  {s.published ? "Unpublish" : "Publish"}
                </button>
                {s.published && (
                  <a href={`/services/${s.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white/5 p-2 text-slate-300 hover:bg-white/10" aria-label="View live">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <Link href={`/admin/services/${s._id}`} className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors">
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
