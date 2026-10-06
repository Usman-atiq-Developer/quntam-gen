import { Sparkles } from "lucide-react";

export default function KeyTakeaways({ items }: { items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="rounded-xl2 border border-border bg-surface2 p-6 sm:p-8 mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-brand-end" />
        <span className="text-xs font-bold uppercase tracking-widest text-brand-end">Key Takeaways</span>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-ink-heading leading-relaxed">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gradient" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
