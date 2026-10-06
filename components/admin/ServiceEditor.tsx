"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Plus, X } from "lucide-react";
import { slugify } from "@/lib/slugify";
import ListEditor from "@/components/admin/ListEditor";

export type ServiceEditorData = {
  _id?: string;
  slug: string;
  name: string;
  shortName: string;
  icon: string;
  oneLiner: string;
  positioning: string;
  whatIs: string;
  theme: { from: string; to: string; tint: string; glow: string };
  accentIcons: string[];
  stats: { value: string; label: string }[];
  whoFor: string[];
  quote: { text: string; author: string; role: string };
  process: { title: string; description: string }[];
  included: string[];
  benefits: string[];
  tools: string[];
  packages: {
    name: string;
    price: string;
    cadence: string;
    description: string;
    features: string[];
    highlighted?: boolean;
  }[];
  customQuoteOnly: boolean;
  faqs: { q: string; a: string }[];
  category: string;
  published: boolean;
};

export const EMPTY_SERVICE: ServiceEditorData = {
  slug: "",
  name: "",
  shortName: "",
  icon: "Sparkles",
  oneLiner: "",
  positioning: "",
  whatIs: "",
  theme: { from: "#C81E2C", to: "#FF4B3E", tint: "#FFF1F0", glow: "200, 30, 44" },
  accentIcons: [],
  stats: [],
  whoFor: [],
  quote: { text: "", author: "", role: "" },
  process: [],
  included: [],
  benefits: [],
  tools: [],
  packages: [],
  customQuoteOnly: false,
  faqs: [],
  category: "",
  published: true,
};

export default function ServiceEditor({ initialData }: { initialData?: ServiceEditorData }) {
  const router = useRouter();
  const isEdit = Boolean(initialData?._id);
  const [data, setData] = useState<ServiceEditorData>(initialData ?? EMPTY_SERVICE);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof ServiceEditorData>(key: K, value: ServiceEditorData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function handleName(value: string) {
    set("name", value);
    if (!slugTouched) set("slug", slugify(value));
  }

  async function save() {
    setError("");
    if (!data.name.trim() || !data.oneLiner.trim() || !data.category.trim()) {
      setError("Name, one-liner, and category are required.");
      return;
    }

    setSaving(true);
    const payload = {
      ...data,
      slug: slugify(data.slug || data.name),
      whoFor: data.whoFor.filter((s) => s.trim()),
      included: data.included.filter((s) => s.trim()),
      benefits: data.benefits.filter((s) => s.trim()),
      tools: data.tools.filter((s) => s.trim()),
      accentIcons: data.accentIcons.filter((s) => s.trim()),
      stats: data.stats.filter((s) => s.value.trim() || s.label.trim()),
      process: data.process.filter((p) => p.title.trim()),
      faqs: data.faqs.filter((f) => f.q.trim() && f.a.trim()),
      packages: data.packages.filter((p) => p.name.trim()),
    };

    try {
      const url = isEdit ? `/api/admin/services/${initialData!._id}` : "/api/admin/services";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to save");
      router.push("/admin/services");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 pb-20">
      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</p>
      )}

      <Card title="Basics">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Service name">
            <input value={data.name} onChange={(e) => handleName(e.target.value)} className="admin-input" placeholder="Web Development" />
          </Field>
          <Field label="Short name" hint="Used in compact nav/menus">
            <input value={data.shortName} onChange={(e) => set("shortName", e.target.value)} className="admin-input" placeholder="Web Dev" />
          </Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Slug" hint="/services/your-slug">
            <input
              value={data.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", e.target.value);
              }}
              className="admin-input font-mono text-sm"
            />
          </Field>
          <Field label="Category" hint="Used to match related blog posts & case studies">
            <input value={data.category} onChange={(e) => set("category", e.target.value)} className="admin-input" placeholder="Web Development" />
          </Field>
        </div>
        <Field label="Icon name" hint="Any lucide-react icon name, e.g. Code2, Search, Megaphone, Bot">
          <input value={data.icon} onChange={(e) => set("icon", e.target.value)} className="admin-input font-mono text-sm" />
        </Field>
        <Field label="One-liner" hint="Short tagline shown on service cards">
          <input value={data.oneLiner} onChange={(e) => set("oneLiner", e.target.value)} className="admin-input" />
        </Field>
        <Field label="Positioning" hint="Longer intro paragraph on the service page">
          <textarea value={data.positioning} onChange={(e) => set("positioning", e.target.value)} rows={3} className="admin-input resize-none" />
        </Field>
        <Field label="What is this service?" hint="Plain-English explainer section">
          <textarea value={data.whatIs} onChange={(e) => set("whatIs", e.target.value)} rows={3} className="admin-input resize-none" />
        </Field>
      </Card>

      <Card title="Theme colours" hint="Controls the gradient and accent colours used across this service's page and card.">
        <div className="grid sm:grid-cols-2 gap-5">
          <ColorField label="Gradient start" value={data.theme.from} onChange={(v) => set("theme", { ...data.theme, from: v })} />
          <ColorField label="Gradient end" value={data.theme.to} onChange={(v) => set("theme", { ...data.theme, to: v })} />
          <ColorField label="Background tint" value={data.theme.tint} onChange={(v) => set("theme", { ...data.theme, tint: v })} />
          <Field label="Glow (RGB values)" hint="Comma-separated RGB, e.g. 200, 30, 44">
            <input value={data.theme.glow} onChange={(e) => set("theme", { ...data.theme, glow: e.target.value })} className="admin-input font-mono text-sm" />
          </Field>
        </div>
        <div
          className="h-12 rounded-lg border border-white/10"
          style={{ backgroundImage: `linear-gradient(135deg, ${data.theme.from}, ${data.theme.to})` }}
          aria-hidden="true"
        />
      </Card>

      <Card title="Stats">
        <div className="space-y-2">
          {data.stats.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={s.value}
                onChange={(e) => {
                  const next = [...data.stats];
                  next[i] = { ...next[i], value: e.target.value };
                  set("stats", next);
                }}
                className="admin-input sm:w-40"
                placeholder="50+"
              />
              <input
                value={s.label}
                onChange={(e) => {
                  const next = [...data.stats];
                  next[i] = { ...next[i], label: e.target.value };
                  set("stats", next);
                }}
                className="admin-input"
                placeholder="Sites shipped"
              />
              <button type="button" onClick={() => set("stats", data.stats.filter((_, idx) => idx !== i))} className="text-slate-500 hover:text-red-400 shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => set("stats", [...data.stats, { value: "", label: "" }])} className="flex items-center gap-1 text-xs text-violet-300 hover:text-violet-200">
          <Plus className="w-3.5 h-3.5" /> Add stat
        </button>
      </Card>

      <Card title="Content lists">
        <ListEditor label="Who this is for" items={data.whoFor} onChange={(v) => set("whoFor", v)} placeholder="Your current site is slow or outdated" multiline />
        <ListEditor label="What's included" items={data.included} onChange={(v) => set("included", v)} />
        <ListEditor label="Benefits" items={data.benefits} onChange={(v) => set("benefits", v)} />
        <ListEditor label="Tools used" items={data.tools} onChange={(v) => set("tools", v)} placeholder="Next.js" />
        <ListEditor label="Accent icons" items={data.accentIcons} onChange={(v) => set("accentIcons", v)} hint="lucide-react icon names used as decorative accents." placeholder="Code2" />
      </Card>

      <Card title="Process steps">
        <div className="space-y-4">
          {data.process.map((p, i) => (
            <div key={i} className="space-y-2 border-b border-white/5 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center gap-2">
                <input
                  value={p.title}
                  onChange={(e) => {
                    const next = [...data.process];
                    next[i] = { ...next[i], title: e.target.value };
                    set("process", next);
                  }}
                  className="admin-input"
                  placeholder="Discovery"
                />
                <button type="button" onClick={() => set("process", data.process.filter((_, idx) => idx !== i))} className="text-slate-500 hover:text-red-400 shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={p.description}
                onChange={(e) => {
                  const next = [...data.process];
                  next[i] = { ...next[i], description: e.target.value };
                  set("process", next);
                }}
                rows={2}
                className="admin-input resize-none"
                placeholder="What happens in this step"
              />
            </div>
          ))}
        </div>
        <button type="button" onClick={() => set("process", [...data.process, { title: "", description: "" }])} className="flex items-center gap-1 text-xs text-violet-300 hover:text-violet-200">
          <Plus className="w-3.5 h-3.5" /> Add step
        </button>
      </Card>

      <Card title="Packages & pricing">
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input type="checkbox" checked={data.customQuoteOnly} onChange={(e) => set("customQuoteOnly", e.target.checked)} className="accent-red-500 w-4 h-4" />
          Custom quote only (hide fixed package prices)
        </label>

        <div className="space-y-5">
          {data.packages.map((pkg, i) => (
            <div key={i} className="rounded-lg border border-white/10 bg-[#0b0f1f] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Package {i + 1}</span>
                <button type="button" onClick={() => set("packages", data.packages.filter((_, idx) => idx !== i))} className="text-slate-500 hover:text-red-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <input value={pkg.name} onChange={(e) => updatePkg(i, "name", e.target.value)} className="admin-input" placeholder="Starter" />
                <input value={pkg.price} onChange={(e) => updatePkg(i, "price", e.target.value)} className="admin-input" placeholder="$1,500" />
                <input value={pkg.cadence} onChange={(e) => updatePkg(i, "cadence", e.target.value)} className="admin-input" placeholder="one-time / per month" />
              </div>
              <textarea value={pkg.description} onChange={(e) => updatePkg(i, "description", e.target.value)} rows={2} className="admin-input resize-none" placeholder="Who this package suits" />
              <ListEditor
                label="Features"
                items={pkg.features}
                onChange={(v) => {
                  const next = [...data.packages];
                  next[i] = { ...next[i], features: v };
                  set("packages", next);
                }}
              />
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <input type="checkbox" checked={pkg.highlighted ?? false} onChange={(e) => updatePkg(i, "highlighted", e.target.checked)} className="accent-red-500 w-4 h-4" />
                Highlight this package (most popular)
              </label>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => set("packages", [...data.packages, { name: "", price: "", cadence: "", description: "", features: [], highlighted: false }])}
          className="flex items-center gap-1 text-xs text-violet-300 hover:text-violet-200"
        >
          <Plus className="w-3.5 h-3.5" /> Add package
        </button>
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

      <Card title="Service FAQs" hint="Shown on this service's page with FAQ schema markup.">
        <div className="space-y-4">
          {data.faqs.map((faq, i) => (
            <div key={i} className="space-y-2 border-b border-white/5 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center gap-2">
                <input
                  value={faq.q}
                  onChange={(e) => {
                    const next = [...data.faqs];
                    next[i] = { ...next[i], q: e.target.value };
                    set("faqs", next);
                  }}
                  className="admin-input"
                  placeholder="Question"
                />
                <button type="button" onClick={() => set("faqs", data.faqs.filter((_, idx) => idx !== i))} className="text-slate-500 hover:text-red-400 shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={faq.a}
                onChange={(e) => {
                  const next = [...data.faqs];
                  next[i] = { ...next[i], a: e.target.value };
                  set("faqs", next);
                }}
                rows={2}
                className="admin-input resize-none"
                placeholder="Answer"
              />
            </div>
          ))}
        </div>
        <button type="button" onClick={() => set("faqs", [...data.faqs, { q: "", a: "" }])} className="flex items-center gap-1 text-xs text-violet-300 hover:text-violet-200">
          <Plus className="w-3.5 h-3.5" /> Add FAQ
        </button>
      </Card>

      <div className="flex items-center gap-4">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-violet-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-70"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isEdit ? "Save changes" : "Create service"}
        </button>
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input type="checkbox" checked={data.published} onChange={(e) => set("published", e.target.checked)} className="accent-red-500 w-4 h-4" />
          Published (visible on the site)
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

  function updatePkg(index: number, field: string, value: string | boolean) {
    const next = [...data.packages];
    next[index] = { ...next[index], [field]: value };
    set("packages", next);
  }
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

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-300 mb-1.5">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 shrink-0 rounded-lg border border-white/10 bg-transparent cursor-pointer"
        />
        <input value={value} onChange={(e) => onChange(e.target.value)} className="admin-input font-mono text-sm" />
      </div>
    </label>
  );
}
