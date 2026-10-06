"use client";

import { useRef, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  Table as TableIcon,
  Minus,
  ImagePlus,
  Loader2,
  Eye,
  Pencil,
} from "lucide-react";

marked.setOptions({ gfm: true, breaks: false });

/**
 * A Write/Preview Markdown editor with a formatting toolbar, built so
 * writing a blog post doesn't require knowing Markdown syntax by heart.
 * Every button operates on the current text selection (wrapping it, or
 * inserting a sensible placeholder when nothing is selected), the way a
 * normal rich-text editor's toolbar behaves — the underlying content stays
 * plain Markdown, which is what the blog rendering pipeline expects.
 */
export default function MarkdownEditor({
  value,
  onChange,
  onUploadImage,
  rows = 22,
}: {
  value: string;
  onChange: (value: string) => void;
  /** Uploads a file and returns its hosted URL (Cloudinary). */
  onUploadImage: (file: File) => Promise<string>;
  rows?: number;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState(false);

  /** Wraps the current selection with prefix/suffix, or inserts a placeholder if nothing is selected. */
  function wrapSelection(prefix: string, suffix: string, placeholder: string) {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || placeholder;
    const next = value.slice(0, start) + prefix + selected + suffix + value.slice(end);
    onChange(next);

    requestAnimationFrame(() => {
      el.focus();
      const selStart = start + prefix.length;
      const selEnd = selStart + selected.length;
      el.setSelectionRange(selStart, selEnd);
    });
  }

  /** Adds a prefix to the start of the current line(s) — for headings, quotes, lists. */
  function prefixLines(prefix: string) {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;

    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    let lineEnd = value.indexOf("\n", end);
    if (lineEnd === -1) lineEnd = value.length;

    const block = value.slice(lineStart, lineEnd);
    const prefixed = block
      .split("\n")
      .map((line) => (line.startsWith(prefix) ? line : prefix + line))
      .join("\n");

    const next = value.slice(0, lineStart) + prefixed + value.slice(lineEnd);
    onChange(next);

    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(lineStart, lineStart + prefixed.length);
    });
  }

  function insertAtCursor(text: string) {
    const el = textareaRef.current;
    const caret = el ? el.selectionStart : value.length;
    const next = value.slice(0, caret) + text + value.slice(caret);
    onChange(next);
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      const pos = caret + text.length;
      el.setSelectionRange(pos, pos);
    });
  }

  function handleLink() {
    const el = textareaRef.current;
    const hasSelection = el && el.selectionStart !== el.selectionEnd;
    const url = window.prompt("Link URL:", "https://");
    if (!url) return;
    if (hasSelection) {
      wrapSelection("[", `](${url})`, "link text");
    } else {
      insertAtCursor(`[link text](${url})`);
    }
  }

  function handleTable() {
    insertAtCursor(
      "\n\n| Column 1 | Column 2 | Column 3 |\n| --- | --- | --- |\n| Row 1 | Row 1 | Row 1 |\n| Row 2 | Row 2 | Row 2 |\n\n"
    );
  }

  async function handleImageFile(file: File) {
    setUploading(true);
    try {
      const url = await onUploadImage(file);
      insertAtCursor(`\n\n![${file.name.replace(/\.[^.]+$/, "")}](${url})\n\n`);
    } finally {
      setUploading(false);
    }
  }

  const buttons: { icon: typeof Bold; label: string; action: () => void }[] = [
    { icon: Bold, label: "Bold", action: () => wrapSelection("**", "**", "bold text") },
    { icon: Italic, label: "Italic", action: () => wrapSelection("*", "*", "italic text") },
    { icon: Heading2, label: "Heading", action: () => prefixLines("## ") },
    { icon: Heading3, label: "Subheading", action: () => prefixLines("### ") },
    { icon: List, label: "Bullet list", action: () => prefixLines("- ") },
    { icon: ListOrdered, label: "Numbered list", action: () => prefixLines("1. ") },
    { icon: Quote, label: "Quote", action: () => prefixLines("> ") },
    { icon: Code, label: "Inline code", action: () => wrapSelection("`", "`", "code") },
    { icon: Link2, label: "Link", action: handleLink },
    { icon: TableIcon, label: "Table", action: handleTable },
    { icon: Minus, label: "Divider", action: () => insertAtCursor("\n\n---\n\n") },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="block text-sm font-medium text-slate-300">Content</span>
        <div className="flex items-center rounded-lg bg-white/5 p-0.5">
          <button
            type="button"
            onClick={() => setMode("write")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              mode === "write" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <Pencil className="w-3 h-3" /> Write
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              mode === "preview" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <Eye className="w-3 h-3" /> Preview
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 overflow-hidden">
        {mode === "write" && (
          <div className="flex items-center gap-0.5 flex-wrap bg-[#0b0f1f] border-b border-white/10 px-2 py-1.5">
            {buttons.map(({ icon: Icon, label, action }) => (
              <button
                key={label}
                type="button"
                onClick={action}
                title={label}
                aria-label={label}
                className="rounded-md p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
            <span className="w-px h-4 bg-white/10 mx-1" aria-hidden="true" />
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={uploading}
              title="Insert image"
              aria-label="Insert image"
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-60 transition-colors"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
              Image
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageFile(file);
                e.target.value = "";
              }}
            />
          </div>
        )}

        {mode === "write" ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            className="w-full bg-[#0b0f1f] px-3.5 py-3 text-sm font-mono text-white outline-none resize-y placeholder:text-slate-600"
            placeholder="Start writing — use the toolbar above, or type Markdown directly (## heading, **bold**, - list item)…"
          />
        ) : (
          <div
            className="prose prose-invert prose-sm max-w-none bg-[#0b0f1f] px-4 py-4 min-h-[200px] prose-headings:text-white prose-a:text-violet-300 prose-strong:text-white prose-code:text-amber-300 prose-blockquote:border-l-red-400 prose-blockquote:text-slate-300 prose-th:text-slate-200 prose-td:text-slate-300"
            style={{ minHeight: `${rows * 1.5}rem` }}
            dangerouslySetInnerHTML={{
              // Sanitize before injecting — this preview pane previously
              // rendered marked.parse()'s output completely unsanitized,
              // so a pasted <script>/onerror= payload in the Markdown
              // source would execute immediately in the admin's own
              // authenticated session the moment they opened Preview.
              __html: value.trim()
                ? DOMPurify.sanitize(marked.parse(value) as string)
                : "<p class='text-slate-600'>Nothing to preview yet.</p>",
            }}
          />
        )}
      </div>

      <p className="text-xs text-slate-500 mt-1">
        Use the toolbar for formatting, or write Markdown directly. Switch to Preview to see how it will look.
      </p>
    </div>
  );
}
