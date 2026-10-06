"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, Link2, Loader2, Plus } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmButton from "@/components/admin/ConfirmButton";

type LinkInsertion = {
  _id: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  targetUrl: string;
  anchorText: string;
  price?: number;
  status: "pending" | "approved" | "rejected" | "live" | "completed";
  source: "public_form" | "admin";
  createdAt: string;
};

const STATUS_OPTIONS = ["all", "pending", "approved", "rejected", "live", "completed"] as const;

export default function LinkInsertionsTable() {
  const [items, setItems] = useState<LinkInsertion[]>([]);
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
      const res = await fetch(`/api/admin/link-insertions?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load link insertions");
      setItems(json.linkInsertions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load link insertions");
    } finally {
      setLoading(false);
    }
  }, [status, search]);

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);

  async function deleteItem(id: string) {
    const res = await fetch(`/api/admin/link-insertions/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i._id !== id));
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
              placeholder="Search client, URL, anchor…"
              className="admin-input pl-9"
            />
          </div>
          <Link
            href="/admin/link-insertions/new"
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-red-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> New
          </Link>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <Link2 className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No link insertions found.</p>
        </div>
      ) : (
        <div className="rounded-xl2 border border-white/10 bg-[#131a35] divide-y divide-white/5">
          {items.map((item) => (
            <div key={item._id} className="flex items-center gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/admin/link-insertions/${item._id}`}
                    className="text-sm font-medium text-white hover:text-violet-300 transition-colors"
                  >
                    {item.clientName}
                  </Link>
                  <StatusBadge status={item.status} />
                  {item.source === "public_form" && (
                    <span className="text-[10px] uppercase tracking-wide text-slate-500 border border-white/10 rounded px-1.5 py-0.5">
                      form
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {item.clientEmail} → {item.targetUrl} ({item.anchorText})
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {typeof item.price === "number" && (
                  <span className="text-sm text-slate-300 font-medium">${item.price}</span>
                )}
                <Link
                  href={`/admin/link-insertions/${item._id}`}
                  className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors"
                >
                  Edit
                </Link>
                <ConfirmButton onConfirm={() => deleteItem(item._id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
