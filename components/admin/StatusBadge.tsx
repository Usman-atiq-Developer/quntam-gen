const COLOR_MAP: Record<string, string> = {
  // Contact messages
  new: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  read: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  archived: "bg-slate-700/30 text-slate-500 border-slate-600/30",
  // Blog posts
  draft: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  published: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  // Link insertions
  pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  approved: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  rejected: "bg-red-500/15 text-red-300 border-red-500/30",
  live: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  completed: "bg-blue-500/15 text-blue-300 border-blue-500/30",
};

export default function StatusBadge({ status }: { status: string }) {
  const classes = COLOR_MAP[status] || "bg-slate-500/15 text-slate-300 border-slate-500/30";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${classes}`}>
      {status}
    </span>
  );
}
