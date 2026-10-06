"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Plus, Search, Save, X, HelpCircle, ChevronUp, ChevronDown } from "lucide-react";
import ConfirmButton from "@/components/admin/ConfirmButton";

type FAQItem = {
  _id: string;
  question: string;
  answer: string;
  category: string;
  showOnHome: boolean;
  published: boolean;
  order: number;
};

type Draft = { question: string; answer: string; category: string; showOnHome: boolean; published: boolean };

const EMPTY_DRAFT: Draft = {
  question: "",
  answer: "",
  category: "General",
  showOnHome: false,
  published: true,
};

export default function FAQsManager() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/faqs?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load FAQs");
      setFaqs(json.faqs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  function startEdit(faq: FAQItem) {
    setCreating(false);
    setEditingId(faq._id);
    setDraft({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      showOnHome: faq.showOnHome,
      published: faq.published,
    });
  }

  function startCreate() {
    setEditingId(null);
    setCreating(true);
    setDraft(EMPTY_DRAFT);
  }

  function cancel() {
    setEditingId(null);
    setCreating(false);
    setDraft(EMPTY_DRAFT);
    setError("");
  }

  async function save() {
    if (!draft.question.trim() || !draft.answer.trim()) {
      setError("Both question and answer are required.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const url = creating ? "/api/admin/faqs" : `/api/admin/faqs/${editingId}`;
      const method = creating ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to save");
      cancel();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setBusy(false);
    }
  }

  async function patch(id: string, changes: Partial<FAQItem>) {
    setFaqs((prev) => prev.map((f) => (f._id === id ? { ...f, ...changes } : f)));
    await fetch(`/api/admin/faqs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    });
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
    if (res.ok) setFaqs((prev) => prev.filter((f) => f._id !== id));
  }

  /** Swaps this FAQ's order with its neighbour so admins can reorder the list. */
  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= faqs.length) return;
    const a = faqs[index];
    const b = faqs[target];
    const next = [...faqs];
    next[index] = b;
    next[target] = a;
    setFaqs(next);
    await Promise.all([
      patch(a._id, { order: b.order }),
      patch(b._id, { order: a.order }),
    ]);
  }

  const editorOpen = creating || editingId !== null;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQs…"
            className="admin-input pl-9"
          />
        </div>
        <button
          onClick={startCreate}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-red-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> New FAQ
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</p>
      )}

      {editorOpen && (
        <div className="rounded-xl2 border border-violet-500/30 bg-[#131a35] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">{creating ? "New FAQ" : "Edit FAQ"}</h3>
            <button onClick={cancel} className="text-slate-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Question</label>
            <input
              value={draft.question}
              onChange={(e) => setDraft({ ...draft, question: e.target.value })}
              className="admin-input"
              placeholder="How much does a website cost?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Answer</label>
            <textarea
              value={draft.answer}
              onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
              rows={4}
              className="admin-input resize-none"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
              <input
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                className="admin-input"
                placeholder="General"
              />
            </div>
            <div className="flex items-end gap-5 pb-2">
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.showOnHome}
                  onChange={(e) => setDraft({ ...draft, showOnHome: e.target.checked })}
                  className="accent-red-500 w-4 h-4"
                />
                Show on home page
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.published}
                  onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
                  className="accent-red-500 w-4 h-4"
                />
                Published
              </label>
            </div>
          </div>

          <button
            onClick={save}
            disabled={busy}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-70"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {creating ? "Create FAQ" : "Save changes"}
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : faqs.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <HelpCircle className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No FAQs yet.</p>
          <p className="text-xs mt-1">
            Run <code className="text-violet-300">npm run seed:content</code> to import your existing ones.
          </p>
        </div>
      ) : (
        <div className="rounded-xl2 border border-white/10 bg-[#131a35] divide-y divide-white/5">
          {faqs.map((faq, i) => (
            <div key={faq._id} className="flex items-start gap-4 px-5 py-4">
              <div className="flex flex-col gap-0.5 pt-1 shrink-0">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="text-slate-600 hover:text-white disabled:opacity-25 disabled:hover:text-slate-600"
                  aria-label="Move up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === faqs.length - 1}
                  className="text-slate-600 hover:text-white disabled:opacity-25 disabled:hover:text-slate-600"
                  aria-label="Move down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-white">{faq.question}</p>
                  {faq.showOnHome && (
                    <span className="text-[10px] uppercase tracking-wide text-violet-300 border border-violet-500/30 bg-violet-500/10 rounded px-1.5 py-0.5">
                      home
                    </span>
                  )}
                  {!faq.published && (
                    <span className="text-[10px] uppercase tracking-wide text-slate-500 border border-white/10 rounded px-1.5 py-0.5">
                      hidden
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{faq.answer}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => patch(faq._id, { showOnHome: !faq.showOnHome })}
                  className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  {faq.showOnHome ? "Remove from home" : "Add to home"}
                </button>
                <button
                  onClick={() => startEdit(faq)}
                  className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors"
                >
                  Edit
                </button>
                <ConfirmButton onConfirm={() => remove(faq._id)} />
              </div>
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
