"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { slugify } from "@/lib/slugify";
import ListEditor from "@/components/admin/ListEditor";
import ImageUploader from "@/components/admin/ImageUploader";

export type CaseStudyEditorData = {
  _id?: string;
  slug: string;
  client: string;
  category: string;
  industry: string;
  timeline: string;
  serviceSlug: string;
  tools: string[];
  title: string;
  image: string;
  resultStat: string;
  resultLabel: string;
  problem: string;
  solution: string;
  results: string[];
  quote: { text: string; author: string; role: string };
  published: boolean;
};

export const EMPTY_CASE_STUDY: CaseStudyEditorData = {
  slug: "",
  client: "",
  category: "",
  industry: "",
  timeline: "",
  serviceSlug: "",
  tools: [],
  title: "",
  image: "",
  resultStat: "",
  resultLabel: "",
  problem: "",
  solution: "",
  results: [],
  quote: { text: "", author: "", role: "" },
  published: true,
};

export default function CaseStudyEditor({ initialData }: { initialData?: CaseStudyEditorData }) {
  const router = useRouter();
  const isEdit = Boolean(initialData?._id);
  const [data, setData] = useState<CaseStudyEditorData>(initialData ?? EMPTY_CASE_STUDY);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof CaseStudyEditorData>(key: K, value: CaseStudyEditorData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitle(value: string) {
    set("title", value);
    if (!slugTouched) set("slug", slugify(value));
  }

  async function save() {
    setError("");
    if (!data.client.trim() || !data.title.trim() || !data.category.trim() || !data.image.trim()) {
      setError("Client, title, category, and image are required.");
      return;
    }

    setSaving(true);
    const payload = {
      ...data,
      slug: slugify(data.slug || data.title),
      tools: data.tools.filter((t) => t.trim()),
      results: data.results.filter((r) => r.trim()),
    };

    try {
      const url = isEdit ? `/api/admin/case-studies/${initialData!._id}` : "/api/admin/case-studies";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to save");
      router.push("/admin/case-studies");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 pb-20 max-w-4xl">
      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</p>
      )}

      <Card title="Basics">
        <Field label="Headline / title">
          <input value={data.title} onChange={(e) => handleTitle(e.target.value)} className="admin-input" placeholder="A 3-second homepage becomes a 0.9-second one" />
        </Field>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Client name">
            <input value={data.client} onChange={(e) => set("client", e.target.value)} className="admin-input" placeholder="Lumen Skincare" />
          </Field>
          <Field label="Slug" hint="/portfolio/your-slug">
            <input
              value={data.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", e.target.value);
              }}
              className="admin-input font-mono text-sm"
            />
          </Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Category" hint="Should match a service name">
            <input value={data.category} onChange={(e) => set("category", e.target.value)} className="admin-input" placeholder="Web Development" />
          </Field>
          <Field label="Service slug" hint="Links this case study to a service page">
            <input value={data.serviceSlug} onChange={(e) => set("serviceSlug", e.target.value)} className="admin-input font-mono text-sm" placeholder="web-development" />
          </Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Industry">
            <input value={data.industry} onChange={(e) => set("industry", e.target.value)} className="admin-input" placeholder="Skincare & Beauty E-commerce" />
          </Field>
          <Field label="Timeline">
            <input value={data.timeline} onChange={(e) => set("timeline", e.target.value)} className="admin-input" placeholder="6 weeks" />
          </Field>
        </div>
      </Card>

      <Card title="Cover image">
        <ImageUploader label="" value={data.image} onChange={(url) => set("image", url)} />
      </Card>

      <Card title="Headline result" hint="The big number shown on the portfolio card.">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Result stat">
            <input value={data.resultStat} onChange={(e) => set("resultStat", e.target.value)} className="admin-input" placeholder="+62%" />
          </Field>
          <Field label="Result label">
            <input value={data.resultLabel} onChange={(e) => set("resultLabel", e.target.value)} className="admin-input" placeholder="conversion rate" />
          </Field>
        </div>
      </Card>

      <Card title="The story">
        <Field label="Problem">
          <textarea value={data.problem} onChange={(e) => set("problem", e.target.value)} rows={4} className="admin-input resize-none" />
        </Field>
        <Field label="Solution">
          <textarea value={data.solution} onChange={(e) => set("solution", e.target.value)} rows={4} className="admin-input resize-none" />
        </Field>
        <ListEditor label="Results" items={data.results} onChange={(v) => set("results", v)} multiline placeholder="Conversion rate increased 62% in 8 weeks" />
        <ListEditor label="Tools used" items={data.tools} onChange={(v) => set("tools", v)} placeholder="Next.js" />
      </Card>

      <Card title="Client quote">
        <Field label="Quote text">
          <textarea value={data.quote.text} onChange={(e) => set("quote", { ...data.quote, text: e.target.value })} rows={3} className="admin-input resize-none" />
        </Field>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Author">
            <input value={data.quote.author} onChange={(e) => set("quote", { ...data.quote, author: e.target.value })} className="admin-input" />
          </Field>
          <Field label="Role">
            <input value={data.quote.role} onChange={(e) => set("quote", { ...data.quote, role: e.target.value })} className="admin-input" />
          </Field>
        </div>
      </Card>

      <div className="flex items-center gap-4">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-violet-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-70"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isEdit ? "Save changes" : "Create case study"}
        </button>
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input type="checkbox" checked={data.published} onChange={(e) => set("published", e.target.checked)} className="accent-red-500 w-4 h-4" />
          Published
        </label>
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

function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl2 border border-white/10 bg-[#131a35] p-6 space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
      </div>
      {children}
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
