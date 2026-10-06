import type { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  sublabel?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-xl2 border border-white/10 bg-[#131a35] p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-slate-400">{label}</span>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-violet-600/20 flex items-center justify-center">
          <Icon className="w-4 h-4 text-violet-300" />
        </div>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      {sublabel && <p className="text-xs text-slate-500 mt-1">{sublabel}</p>}
    </div>
  );
}
