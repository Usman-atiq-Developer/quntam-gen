"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X, Save, Send } from "lucide-react";
import { slugify } from "@/lib/slugify";
import ImageUploader from "@/components/admin/ImageUploader";
import CategoryPicker from "@/components/admin/CategoryPicker";
import MarkdownEditor from "@/components/admin/MarkdownEditor";

export type PostEditorInitialData = {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  coverImage: string;
  author: string;
  authorRole: string;
  authorPhoto?: string;
  status: "draft" | "published";
  seoTitle?: string;
  metaDescription?: string;
  primaryKeyword?: string;
  secondaryKeywords: string[];
  searchIntent?: "" | "informational" | "commercial" | "transactional" | "navigational";
  takeaways: string[];
  faqs: { q: string; a: string }[];
  /**
   * Search-engine indexing, independent of `status`. `true` (the default)
   * preserves current behavior for every existing post. Rendered on the
   * public page as `index, follow` vs. `noindex, follow`, and controls
   * inclusion in the sitemap — completely separate from draft/publish.
   */
  robotsIndex: boolean;
};

const EMPTY: PostEditorInitialData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  tags: [],
  coverImage: "",
  author: "Quntam Gen Team",
  authorRole: "Editorial",
  authorPhoto: "",
  status: "draft",
  seoTitle: "",
  metaDescription: "",
  primaryKeyword: "",
  secondaryKeywords: [],
  searchIntent: "",
  takeaways: [],
  faqs: [],
  robotsIndex: true,
};

export default function PostEditor({ initialData }: { initialData?: PostEditorInitialData }) {
  const router = useRouter();
  const isEditMode = Boolean(initialData?._id);
  const [data, setData] = useState<PostEditorInitialData>(initialData ?? EMPTY);
  const [tagsInput, setTagsInput] = useState((initialData?.tags ?? []).join(", "));
  const [secondaryKeywordsInput, setSecondaryKeywordsInput] = useState(
    (initialData?.secondaryKeywords ?? []).join(", ")
  );
  const [slugTouched, setSlugTouched] = useState(isEditMode);
  const [saving, setSaving] = useState<"draft" | "published" | null>(null);
  const [error, setError] = useState("");

  function set<K extends keyof PostEditorInitialData>(key: K, value: PostEditorInitialData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  /** Uploads a file to Cloudinary and returns its hosted URL — passed to MarkdownEditor's image button. */
  async function uploadImage(file: File): Promise<string> {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || "Upload failed");
    return json.url as string;
  }

  function handleTitleChange(value: string) {
    set("title", value);
    if (!slugTouched) {
      set("slug", slugify(value));
    }
  }

  function updateTakeaway(index: number, value: string) {
    const next = [...data.takeaways];
    next[index] = value;
    set("takeaways", next);
  }

  function updateFaq(index: number, field: "q" | "a", value: string) {
    const next = [...data.faqs];
    next[index] = { ...next[index], [field]: value };
    set("faqs", next);
  }

  async function handleSave(status: "draft" | "published") {
    setError("");

    if (!data.title.trim() || !data.excerpt.trim() || !data.content.trim() || !data.category.trim() || !data.coverImage.trim()) {
      setError("Title, excerpt, content, category, and cover image are required.");
      return;
    }

    setSaving(status);

    const payload = {
      ...data,
      slug: slugify(data.slug || data.title),
      status,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      secondaryKeywords: secondaryKeywordsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      searchIntent: data.searchIntent || undefined,
      takeaways: data.takeaways.filter((t) => t.trim()),
      faqs: data.faqs.filter((f) => f.q.trim() && f.a.trim()),
    };

    try {
      const url = isEditMode ? `/api/admin/posts/${initialData!._id}` : "/api/admin/posts";
      const method = isEditMode ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to save post");

      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save post");
      setSaving(null);
    }
  }

  return (
    <div className="space-y-6 pb-16">
      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</p>
      )}

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5">
          <Field label="Title">
            <input
              value={data.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="admin-input text-lg"
              placeholder="How SEO Actually Works in 2026"
            />
          </Field>

          <Field label="Slug" hint="/blog/your-slug">
            <input
              value={data.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", e.target.value);
              }}
              className="admin-input font-mono text-sm"
              placeholder="how-seo-actually-works-in-2026"
            />
          </Field>

          <Field label="Excerpt" hint="Shown on the blog listing and used as a fallback meta description">
            <textarea
              value={data.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              rows={3}
              className="admin-input resize-none"
              placeholder="A one or two sentence summary of the article."
            />
          </Field>

          <MarkdownEditor
            value={data.content}
            onChange={(v) => set("content", v)}
            onUploadImage={uploadImage}
          />

          <div className="rounded-xl2 border border-white/10 bg-[#131a35] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Key Takeaways</h3>
              <button
                type="button"
                onClick={() => set("takeaways", [...data.takeaways, ""])}
                className="flex items-center gap-1 text-xs text-violet-300 hover:text-violet-200"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            {data.takeaways.length === 0 && <p className="text-xs text-slate-500">Optional. Shown as a highlighted list at the top of the article.</p>}
            {data.takeaways.map((t, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={t}
                  onChange={(e) => updateTakeaway(i, e.target.value)}
                  className="admin-input"
                  placeholder="A key point readers should remember"
                />
                <button
                  type="button"
                  onClick={() => set("takeaways", data.takeaways.filter((_, idx) => idx !== i))}
                  className="text-slate-500 hover:text-red-400 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-xl2 border border-white/10 bg-[#131a35] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">FAQs</h3>
              <button
                type="button"
                onClick={() => set("faqs", [...data.faqs, { q: "", a: "" }])}
                className="flex items-center gap-1 text-xs text-violet-300 hover:text-violet-200"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            {data.faqs.length === 0 && <p className="text-xs text-slate-500">Optional. Rendered as an FAQ accordion with schema markup.</p>}
            {data.faqs.map((faq, i) => (
              <div key={i} className="space-y-2 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <input
                    value={faq.q}
                    onChange={(e) => updateFaq(i, "q", e.target.value)}
                    className="admin-input"
                    placeholder="Question"
                  />
                  <button
                    type="button"
                    onClick={() => set("faqs", data.faqs.filter((_, idx) => idx !== i))}
                    className="text-slate-500 hover:text-red-400 shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={faq.a}
                  onChange={(e) => updateFaq(i, "a", e.target.value)}
                  rows={2}
                  className="admin-input resize-none"
                  placeholder="Answer"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-xl2 border border-white/10 bg-[#131a35] p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">Publish</h3>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleSave("draft")}
                disabled={saving !== null}
                className="flex items-center justify-center gap-2 rounded-lg bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10 disabled:opacity-60 transition-colors"
              >
                {saving === "draft" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSave("published")}
                disabled={saving !== null}
                className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-70 transition-opacity"
              >
                {saving === "published" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Publish
              </button>
            </div>
            {data.status && (
              <p className="text-xs text-slate-500">
                Current status: <span className="capitalize text-slate-300">{data.status}</span>
              </p>
            )}
          </div>

          <div className="rounded-xl2 border border-white/10 bg-[#131a35] p-5 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-white">Search Engine Indexing</h3>
              <button
                type="button"
                role="switch"
                aria-checked={data.robotsIndex}
                aria-label={data.robotsIndex ? "Indexable — click to set noindex" : "Noindex — click to make indexable"}
                onClick={() => set("robotsIndex", !data.robotsIndex)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  data.robotsIndex ? "bg-emerald-500" : "bg-red-500/80"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    data.robotsIndex ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${
                data.robotsIndex
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  : "bg-red-500/15 text-red-300 border-red-500/30"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${data.robotsIndex ? "bg-emerald-400" : "bg-red-400"}`} />
              {data.robotsIndex ? "Index" : "Noindex"}
            </span>
            <p className="text-xs text-slate-500">
              {data.robotsIndex
                ? "Search engines may index and list this page in results. Independent of draft/publish — this saves along with your next Save/Publish."
                : "Page stays live and publicly reachable, but search engines are told not to index it (noindex, follow) and it's excluded from the sitemap."}
            </p>
          </div>

          <div className="rounded-xl2 border border-white/10 bg-[#131a35] p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">Details</h3>
            <Field label="Category">
              <CategoryPicker value={data.category} onChange={(cat) => set("category", cat)} />
            </Field>
            <Field label="Tags" hint="Comma-separated">
              <input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="admin-input"
                placeholder="seo, growth, content"
              />
            </Field>
            <ImageUploader
              label="Cover Image"
              value={data.coverImage}
              onChange={(url) => set("coverImage", url)}
            />
          </div>

          <div className="rounded-xl2 border border-white/10 bg-[#131a35] p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">Author</h3>
            <Field label="Author name">
              <input
                value={data.author}
                onChange={(e) => set("author", e.target.value)}
                className="admin-input"
              />
            </Field>
            <Field label="Author role">
              <input
                value={data.authorRole}
                onChange={(e) => set("authorRole", e.target.value)}
                className="admin-input"
              />
            </Field>
          </div>

          <div className="rounded-xl2 border border-white/10 bg-[#131a35] p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">SEO</h3>
            <Field label="Search intent" hint="What is the reader trying to do when they search for this?">
              <select
                value={data.searchIntent || ""}
                onChange={(e) => set("searchIntent", e.target.value as PostEditorInitialData["searchIntent"])}
                className="admin-input"
              >
                <option value="">— Not set —</option>
                <option value="informational">Informational (learning something)</option>
                <option value="commercial">Commercial (comparing options)</option>
                <option value="transactional">Transactional (ready to buy/act)</option>
                <option value="navigational">Navigational (looking for a specific page)</option>
              </select>
            </Field>
            <Field label="Primary keyword" hint="The main term this article should rank for">
              <input
                value={data.primaryKeyword}
                onChange={(e) => set("primaryKeyword", e.target.value)}
                className="admin-input"
                placeholder="ai automation for small business"
              />
            </Field>
            <Field label="Secondary keywords" hint="Comma-separated — related terms this article also targets">
              <input
                value={secondaryKeywordsInput}
                onChange={(e) => setSecondaryKeywordsInput(e.target.value)}
                className="admin-input"
                placeholder="workflow automation, business process automation"
              />
            </Field>
            <Field label="SEO title" hint="Falls back to the post title">
              <input
                value={data.seoTitle}
                onChange={(e) => set("seoTitle", e.target.value)}
                className="admin-input"
                maxLength={70}
              />
            </Field>
            <Field label="Meta description" hint="Falls back to the excerpt">
              <textarea
                value={data.metaDescription}
                onChange={(e) => set("metaDescription", e.target.value)}
                rows={3}
                maxLength={160}
                className="admin-input resize-none"
              />
            </Field>
          </div>
        </div>
      </div>

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
