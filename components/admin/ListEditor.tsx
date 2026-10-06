"use client";

import { Plus, X } from "lucide-react";

/** Editable list of plain strings — used for bullet points, tools, benefits, etc. */
export default function ListEditor({
  label,
  hint,
  items,
  onChange,
  placeholder,
  multiline = false,
}: {
  label: string;
  hint?: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  function update(index: number, value: string) {
    const next = [...items];
    next[index] = value;
    onChange(next);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="flex items-center gap-1 text-xs text-violet-300 hover:text-violet-200"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      {items.length === 0 && (
        <p className="text-xs text-slate-500 mb-2">{hint || "No items yet — click Add."}</p>
      )}

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            {multiline ? (
              <textarea
                value={item}
                onChange={(e) => update(i, e.target.value)}
                rows={2}
                className="admin-input resize-none"
                placeholder={placeholder}
              />
            ) : (
              <input
                value={item}
                onChange={(e) => update(i, e.target.value)}
                className="admin-input"
                placeholder={placeholder}
              />
            )}
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="text-slate-500 hover:text-red-400 shrink-0 mt-2.5"
              aria-label="Remove item"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {items.length > 0 && hint && <p className="text-xs text-slate-500 mt-1.5">{hint}</p>}
    </div>
  );
}
