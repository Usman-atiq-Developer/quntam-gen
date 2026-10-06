"use client";

import { useEffect, useState, useMemo } from "react";
import { Loader2, Save, Search, Check, RotateCcw } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

type ContentItem = {
  _id: string;
  key: string;
  value: string;
  items: string[];
  type: "text" | "textarea" | "image" | "url" | "list";
  group: string;
  label: string;
  hint?: string;
  order: number;
};

export default function ContentEditor() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [original, setOriginal] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState<string>("all");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/content");
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed to load content");
        setContent(json.content);
        setOriginal(
          Object.fromEntries((json.content as ContentItem[]).map((c) => [c.key, c.value]))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load content");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const groups = useMemo(() => {
    const set = new Set(content.map((c) => c.group));
    return ["all", ...Array.from(set)];
  }, [content]);

  const visible = useMemo(() => {
    return content.filter((c) => {
      if (activeGroup !== "all" && c.group !== activeGroup) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        c.label.toLowerCase().includes(q) ||
        c.value.toLowerCase().includes(q) ||
        c.key.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q)
      );
    });
  }, [content, activeGroup, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, ContentItem[]>();
    for (const item of visible) {
      if (!map.has(item.group)) map.set(item.group, []);
      map.get(item.group)!.push(item);
    }
    return Array.from(map.entries());
  }, [visible]);

  const dirtyKeys = useMemo(
    () => content.filter((c) => c.value !== original[c.key]).map((c) => c.key),
    [content, original]
  );

  function updateValue(key: string, value: string) {
    setContent((prev) => prev.map((c) => (c.key === key ? { ...c, value } : c)));
    setSaved(false);
  }

  function revert(key: string) {
    updateValue(key, original[key] ?? "");
  }

  async function handleSave() {
    if (dirtyKeys.length === 0) return;
    setSaving(true);
    setError("");
    try {
      const updates = content
        .filter((c) => dirtyKeys.includes(c.key))
        .map((c) => ({ key: c.key, value: c.value }));

      const res = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to save");

      setOriginal(Object.fromEntries(content.map((c) => [c.key, c.value])));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className="rounded-xl2 border border-white/10 bg-[#131a35] p-8 text-center">
        <p className="text-sm text-slate-300 mb-2">No editable content found yet.</p>
        <p className="text-xs text-slate-500">
          Run <code className="text-violet-300">npm run seed:content</code> once to import your
          existing site copy into the database.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between sticky top-[73px] z-10 bg-[#0b0f1f] py-3 -my-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search any text on your site…"
            className="admin-input pl-9"
          />
        </div>
        <div className="flex items-center gap-3">
          {dirtyKeys.length > 0 && (
            <span className="text-xs text-amber-300">{dirtyKeys.length} unsaved change{dirtyKeys.length > 1 ? "s" : ""}</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || dirtyKeys.length === 0}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40 transition-opacity whitespace-nowrap"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? "Saved" : "Save changes"}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {groups.map((g) => (
          <button
            key={g}
            onClick={() => setActiveGroup(g)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              activeGroup === g
                ? "bg-gradient-to-r from-red-500 to-violet-600 text-white"
                : "bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            {g === "all" ? "All sections" : g}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</p>
      )}

      {grouped.length === 0 ? (
        <p className="text-sm text-slate-500 py-10 text-center">No content matches your search.</p>
      ) : (
        <div className="space-y-6">
          {grouped.map(([groupName, items]) => (
            <div key={groupName} className="rounded-xl2 border border-white/10 bg-[#131a35] p-6">
              <h3 className="text-sm font-semibold text-white mb-5">{groupName}</h3>
              <div className="space-y-5">
                {items.map((item) => {
                  const isDirty = item.value !== original[item.key];
                  return (
                    <div key={item._id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-sm font-medium text-slate-300">
                          {item.label}
                          {isDirty && <span className="ml-2 text-xs text-amber-300">• edited</span>}
                        </label>
                        {isDirty && (
                          <button
                            onClick={() => revert(item.key)}
                            className="flex items-center gap-1 text-xs text-slate-500 hover:text-white transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" /> Undo
                          </button>
                        )}
                      </div>

                      {item.type === "image" ? (
                        <ImageUploader
                          label=""
                          value={item.value}
                          onChange={(url) => updateValue(item.key, url)}
                        />
                      ) : item.type === "textarea" ? (
                        <textarea
                          value={item.value}
                          onChange={(e) => updateValue(item.key, e.target.value)}
                          rows={3}
                          className={`admin-input resize-none ${isDirty ? "border-amber-400/50" : ""}`}
                        />
                      ) : (
                        <input
                          value={item.value}
                          onChange={(e) => updateValue(item.key, e.target.value)}
                          className={`admin-input ${isDirty ? "border-amber-400/50" : ""}`}
                        />
                      )}

                      {item.hint && <p className="text-xs text-slate-500 mt-1">{item.hint}</p>}
                    </div>
                  );
                })}
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
