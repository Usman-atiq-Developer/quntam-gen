"use client";

import { useState, useRef, useCallback } from "react";
import { Loader2, Upload, X, ImageIcon } from "lucide-react";

/**
 * Uploads an image to Cloudinary via /api/admin/upload and reports the
 * resulting hosted URL back to the parent. Also accepts a pasted URL, so
 * existing images already in /public keep working.
 */
export default function ImageUploader({
  value,
  onChange,
  label = "Image",
  hint,
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (file: File) => {
      setUploading(true);
      setError("");
      try {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Upload failed");
        onChange(json.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  }

  return (
    <div>
      <span className="block text-sm font-medium text-slate-300 mb-1.5">{label}</span>

      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-white/10 bg-[#0b0f1f]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="w-full h-44 object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-2 right-2 rounded-lg bg-black/70 px-3 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90"
          >
            {uploading ? "Uploading…" : "Replace"}
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 h-36 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
            dragging ? "border-red-400 bg-red-500/5" : "border-white/15 hover:border-white/30 bg-[#0b0f1f]"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin text-violet-300" />
              <span className="text-xs text-slate-400">Uploading to Cloudinary…</span>
            </>
          ) : (
            <>
              <Upload className="w-6 h-6 text-slate-500" />
              <span className="text-xs text-slate-400">
                Drag an image here, or <span className="text-violet-300">browse</span>
              </span>
              <span className="text-[10px] text-slate-600">JPG, PNG, WebP, AVIF, GIF or SVG · max 8 MB</span>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />

      <div className="mt-2 flex items-center gap-2">
        <ImageIcon className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="…or paste an image URL / path like /images/blog/post.webp"
          className="admin-input text-xs"
        />
      </div>

      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
