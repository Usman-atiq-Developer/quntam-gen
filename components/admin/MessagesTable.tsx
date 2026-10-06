"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Mail, Loader2 } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmButton from "@/components/admin/ConfirmButton";

type Message = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  budget: string;
  message: string;
  status: "new" | "read" | "archived";
  createdAt: string;
};

const STATUS_OPTIONS = ["all", "new", "read", "archived"] as const;

export default function MessagesTable() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (status !== "all") params.set("status", status);
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/messages?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load messages");
      setMessages(json.messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [status, search]);

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);

  async function updateStatus(id: string, newStatus: Message["status"]) {
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, status: newStatus } : m)));
    }
  }

  async function deleteMessage(id: string) {
    const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMessages((prev) => prev.filter((m) => m._id !== id));
    }
  }

  function toggleExpand(id: string, currentStatus: Message["status"]) {
    setExpanded((prev) => (prev === id ? null : id));
    if (currentStatus === "new") {
      updateStatus(id, "read");
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
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages…"
            className="admin-input pl-9"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <Mail className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No messages found.</p>
        </div>
      ) : (
        <div className="rounded-xl2 border border-white/10 bg-[#131a35] divide-y divide-white/5">
          {messages.map((m) => (
            <div key={m._id}>
              <button
                onClick={() => toggleExpand(m._id, m.status)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
              >
                <StatusBadge status={m.status} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">{m.name}</p>
                  <p className="text-xs text-slate-500 truncate">{m.email} · {m.service}</p>
                </div>
                <span className="text-xs text-slate-500 shrink-0">
                  {new Date(m.createdAt).toLocaleDateString()}
                </span>
              </button>

              {expanded === m._id && (
                <div className="px-5 pb-5 space-y-3 border-t border-white/5 pt-4">
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <p><span className="text-slate-500">Phone:</span> <span className="text-slate-200">{m.phone || "—"}</span></p>
                    <p><span className="text-slate-500">Budget:</span> <span className="text-slate-200">{m.budget}</span></p>
                  </div>
                  <p className="text-sm text-slate-200 whitespace-pre-wrap bg-black/20 rounded-lg p-4">{m.message}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={`mailto:${m.email}`}
                      className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors"
                    >
                      Reply by email
                    </a>
                    {m.status !== "archived" ? (
                      <button
                        onClick={() => updateStatus(m._id, "archived")}
                        className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors"
                      >
                        Archive
                      </button>
                    ) : (
                      <button
                        onClick={() => updateStatus(m._id, "read")}
                        className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors"
                      >
                        Unarchive
                      </button>
                    )}
                    <ConfirmButton onConfirm={() => deleteMessage(m._id)} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx global>{`
        .admin-input {
          width: 100%;
          background: #0b0f1f;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          padding: 0.6rem 0.9rem;
          color: white;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 200ms ease;
        }
        .admin-input:focus {
          border-color: #ff4b3e;
        }
        .admin-input::placeholder {
          color: #64748b;
        }
      `}</style>
    </div>
  );
}
