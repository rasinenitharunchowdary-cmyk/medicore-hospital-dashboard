const palettes: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  available: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  confirmed: "bg-sky-50 text-sky-700 ring-sky-600/15",
  scheduled: "bg-sky-50 text-sky-700 ring-sky-600/15",
  stable: "bg-sky-50 text-sky-700 ring-sky-600/15",
  occupied: "bg-violet-50 text-violet-700 ring-violet-600/15",
  admitted: "bg-violet-50 text-violet-700 ring-violet-600/15",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/15",
  low: "bg-amber-50 text-amber-700 ring-amber-600/15",
  "low stock": "bg-amber-50 text-amber-700 ring-amber-600/15",
  critical: "bg-red-50 text-red-700 ring-red-600/15",
  overdue: "bg-red-50 text-red-700 ring-red-600/15",
  cancelled: "bg-red-50 text-red-700 ring-red-600/15",
  maintenance: "bg-slate-100 text-slate-700 ring-slate-600/15",
  inactive: "bg-slate-100 text-slate-700 ring-slate-600/15",
  discharged: "bg-slate-100 text-slate-700 ring-slate-600/15",
  draft: "bg-slate-100 text-slate-700 ring-slate-600/15",
  expired: "bg-red-50 text-red-700 ring-red-600/15",
};

export function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase();
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${palettes[key] ?? "bg-[var(--surface-soft)] text-[var(--muted)] ring-[var(--border)]"}`}>
      {status}
    </span>
  );
}
