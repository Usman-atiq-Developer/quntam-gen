"use client";

import { useState } from "react";
import { Loader2, Check, AlertCircle } from "lucide-react";

/**
 * Quick INDEX / NOINDEX toggle for a single blog post. Saves immediately
 * via PATCH /api/admin/posts/:id (protected by middleware — admin session
 * required), independent of the post's draft/published status and
 * independent of the full PostEditor save flow. Used in the posts list for
 * one-click control, and mirrors the same field surfaced in PostEditor.
 */
export default function IndexToggle({
  postId,
  initialValue,
  onChanged,
}: {
  postId: string;
  initialValue: boolean;
  /** Optional callback so a parent list can keep its own state in sync. */
  onChanged?: (value: boolean) => void;
}) {
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [error, setError] = useState("");

  async function toggle() {
    const next = !value;
    setError("");
    setJustSaved(false);
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ robotsIndex: next }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to update indexing");

      setValue(next);
      onChanged?.(next);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update indexing");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={value ? "Indexed by search engines — click to set noindex" : "Noindex — click to make indexable"}
        onClick={toggle}
        disabled={saving}
        title={
          value
            ? "INDEX — eligible to appear in search results and the sitemap"
            : "NOINDEX — stays live, but hidden from search results and the sitemap"
        }
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors disabled:cursor-wait disabled:opacity-70 ${
          value
            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25"
            : "bg-red-500/15 text-red-300 border-red-500/30 hover:bg-red-500/25"
        }`}
      >
        {saving ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <span className={`h-1.5 w-1.5 rounded-full ${value ? "bg-emerald-400" : "bg-red-400"}`} />
        )}
        {value ? "Index" : "Noindex"}
      </button>
      {justSaved && <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />}
      {error && (
        <span className="flex items-center gap-1 text-[11px] text-red-400">
          <AlertCircle className="w-3 h-3 shrink-0" /> {error}
        </span>
      )}
    </div>
  );
}
