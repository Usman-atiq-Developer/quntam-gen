"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";

export type LinkInsertionEditorInitialData = {
  _id?: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  targetUrl: string;
  anchorText: string;
  relatedArticle?: string;
  relatedPost?: string | { _id: string; title: string; slug: string } | null;
  message?: string;
  price?: number | null;
  status: "pending" | "approved" | "rejected" | "live" | "completed";
  notes?: string;
  source?: "public_form" | "admin";
};

const EMPTY: LinkInsertionEditorInitialData = {
  clientName: "",
  clientEmail: "",
  clientCompany: "",
  targetUrl: "",
  anchorText: "",
  relatedArticle: "",
  relatedPost: "",
  message: "",
  price: null,
  status: "pending",
  notes: "",
};

const STATUS_OPTIONS = ["pending", "approved", "rejected", "live", "completed"] as const;

export default function LinkInsertionEditor({ initialData }: { initialData?: LinkInsertionEditorInitialData }) {
  const router = useRouter();
  const isEditMode = Boolean(initialData?._id);

  const relatedPostId =
    typeof initialData?.relatedPost === "object" && initialData?.relatedPost
      ? initialData.relatedPost._id
      : (initialData?.relatedPost as string) || "";

  const [data, setData] = useState<LinkInsertionEditorInitialData>({
    ...(initialData ?? EMPTY),
    relatedPost: relatedPostId,
  });
  const [posts, setPosts] = useState<{ _id: string; title: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/posts?status=published")
      .then((res) => res.json())
      .then((json) => setPosts(json.posts ?? []))
      .catch(() => setPosts([]));
  }, []);

  function set<K extends keyof LinkInsertionEditorInitialData>(key: K, value: LinkInsertionEditorInitialData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setError("");

    if (!data.clientName.trim() || !data.clientEmail.trim() || !data.targetUrl.trim() || !data.anchorText.trim()) {
      setError("Client name, email, target URL, and anchor text are required.");
      return;
    }

    setSaving(true);

    const payload = {
      ...data,
      price: data.price === null || data.price === undefined || (data.price as unknown as string) === "" ? undefined : Number(data.price),
      relatedPost: data.relatedPost || undefined,
    };

    try {
      const url = isEditMode ? `/api/admin/link-insertions/${initialData!._id}` : "/api/admin/link-insertions";
      const method = isEditMode ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to save");

      router.push("/admin/link-insertions");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 pb-16 max-w-3xl">
      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</p>
      )}

      <div className="rounded-xl2 border border-white/10 bg-[#131a35] p-6 space-y-5">
        <h3 className="text-sm font-semibold text-white">Client Details</h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Client name">
            <input value={data.clientName} onChange={(e) => set("clientName", e.target.value)} className="admin-input" />
          </Field>
          <Field label="Client email">
            <input value={data.clientEmail} onChange={(e) => set("clientEmail", e.target.value)} className="admin-input" type="email" />
          </Field>
        </div>
        <Field label="Company (optional)">
          <input value={data.clientCompany} onChange={(e) => set("clientCompany", e.target.value)} className="admin-input" />
        </Field>
      </div>

      <div className="rounded-xl2 border border-white/10 bg-[#131a35] p-6 space-y-5">
        <h3 className="text-sm font-semibold text-white">Link Details</h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Target URL">
            <input value={data.targetUrl} onChange={(e) => set("targetUrl", e.target.value)} className="admin-input" placeholder="https://example.com" />
          </Field>
          <Field label="Anchor text">
            <input value={data.anchorText} onChange={(e) => set("anchorText", e.target.value)} className="admin-input" />
          </Field>
        </div>
        <Field label="Related article (free text reference)">
          <input value={data.relatedArticle} onChange={(e) => set("relatedArticle", e.target.value)} className="admin-input" placeholder="URL or title the client mentioned" />
        </Field>
        <Field label="Related blog post (internal)" hint="Link this request to one of your published posts">
          <select value={(data.relatedPost as string) || ""} onChange={(e) => set("relatedPost", e.target.value)} className="admin-input">
            <option value="">— None selected —</option>
            {posts.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title}
              </option>
            ))}
          </select>
        </Field>
        {data.message && (
          <Field label="Client message">
            <p className="text-sm text-slate-300 bg-black/20 rounded-lg p-4 whitespace-pre-wrap">{data.message}</p>
          </Field>
        )}
      </div>

      <div className="rounded-xl2 border border-white/10 bg-[#131a35] p-6 space-y-5">
        <h3 className="text-sm font-semibold text-white">Management</h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Status">
            <select value={data.status} onChange={(e) => set("status", e.target.value as LinkInsertionEditorInitialData["status"])} className="admin-input capitalize">
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Price (USD)">
            <input
              type="number"
              min={0}
              value={data.price ?? ""}
              onChange={(e) => set("price", e.target.value === "" ? null : Number(e.target.value))}
              className="admin-input"
              placeholder="150"
            />
          </Field>
        </div>
        <Field label="Internal notes" hint="Not visible to the client">
          <textarea value={data.notes} onChange={(e) => set("notes", e.target.value)} rows={4} className="admin-input resize-none" />
        </Field>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-violet-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-70 transition-opacity"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {isEditMode ? "Save Changes" : "Create Link Insertion"}
      </button>

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

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-300 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-slate-500 mt-1">{hint}</span>}
    </label>
  );
}
