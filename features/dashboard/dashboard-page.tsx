"use client";

import { useMemo } from "react";
import {
  Activity,
  ArrowRight,
  BedDouble,
  CalendarCheck2,
  Clock3,
  IndianRupee,
  PackageSearch,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAppSelector } from "@/store/hooks";
import { PageHeader } from "@/components/ui/page-header";
import { PageSkeleton, usePageReady } from "@/components/ui/feedback";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";

const admissionData = [
  { day: "Mon", admissions: 18, discharges: 10 },
  { day: "Tue", admissions: 24, discharges: 16 },
  { day: "Wed", admissions: 20, discharges: 14 },
  { day: "Thu", admissions: 31, discharges: 18 },
  { day: "Fri", admissions: 27, discharges: 21 },
  { day: "Sat", admissions: 22, discharges: 17 },
  { day: "Sun", admissions: 26, discharges: 15 },
];

const revenueData = [
  { month: "Mar", revenue: 18.2 },
  { month: "Apr", revenue: 21.7 },
  { month: "May", revenue: 20.1 },
  { month: "Jun", revenue: 25.6 },
  { month: "Jul", revenue: 28.4 },
  { month: "Aug", revenue: 31.2 },
];

const chartTooltipStyle = {
  border: "1px solid var(--border)",
  borderRadius: 12,
  background: "var(--surface)",
  color: "var(--foreground)",
  boxShadow: "var(--shadow)",
  fontSize: 12,
};

function MetricCard({
  label,
  value,
  helper,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  helper: string;
  icon: typeof UsersRound;
  tone: string;
}) {
  return (
    <article className="surface-card relative overflow-hidden p-5">
      <div className={`absolute -right-8 -top-8 size-24 rounded-full opacity-50 ${tone}`} aria-hidden="true" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[13px] font-medium text-[var(--muted)]">{label}</p>
          <p className="mt-2 text-[28px] font-bold tracking-[-0.045em]">{value}</p>
          <p className="mt-1 flex items-center gap-1 text-[11px] text-[var(--muted)]"><TrendingUp size={13} className="text-emerald-500" />{helper}</p>
        </div>
        <div className={`grid size-11 place-items-center rounded-2xl ${tone}`}><Icon size={21} aria-hidden="true" /></div>
      </div>
    </article>
  );
}

export function DashboardPage() {
  const ready = usePageReady();
  const navigate = useNavigate();
  const { patients, doctors, appointments, beds, medicines, invoices } = useAppSelector((state) => state.app);

  const occupiedBeds = beds.filter((bed) => bed.status === "Occupied").length;
  const bedRate = beds.length ? Math.round((occupiedBeds / beds.length) * 100) : 0;
  const activeDoctors = doctors.filter((doctor) => doctor.status !== "Off duty" && doctor.status !== "On leave").length;
  const upcoming = appointments.filter((appointment) => !["Completed", "Cancelled"].includes(appointment.status));
  const lowStock = medicines.filter((medicine) => medicine.stock <= medicine.reorderLevel).length;
  const collected = invoices.reduce((sum, invoice) => sum + invoice.paidAmount, 0);

  const bedData = useMemo(() => {
    const occupied = beds.filter((bed) => bed.status === "Occupied").length;
    const reserved = beds.filter((bed) => bed.status === "Reserved").length;
    const maintenance = beds.filter((bed) => bed.status === "Maintenance").length;
    const available = beds.filter((bed) => bed.status === "Available").length;
    return [
      { name: "Occupied", value: occupied, color: "#16866f" },
      { name: "Available", value: available, color: "#82c9b7" },
      { name: "Reserved", value: reserved, color: "#f0b45c" },
      { name: "Maintenance", value: maintenance, color: "#83938d" },
    ].filter((item) => item.value > 0);
  }, [beds]);

  if (!ready) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Live operations"
        title="Good morning, Aarav"
        description="Here is today’s hospital activity, capacity, and care delivery snapshot."
        actions={<Button onClick={() => navigate("/appointments?new=1")}><CalendarCheck2 size={16} />New appointment</Button>}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Hospital summary">
        <MetricCard label="Active patients" value={String(patients.filter((p) => p.status !== "Discharged").length)} helper={`${patients.length} total records`} icon={UsersRound} tone="bg-emerald-50 text-emerald-700" />
        <MetricCard label="Doctors on duty" value={`${activeDoctors}/${doctors.length}`} helper="Across all departments" icon={Activity} tone="bg-sky-50 text-sky-700" />
        <MetricCard label="Bed occupancy" value={`${bedRate}%`} helper={`${beds.length - occupiedBeds} beds available`} icon={BedDouble} tone="bg-violet-50 text-violet-700" />
        <MetricCard label="Collected revenue" value={`₹${(collected / 100000).toFixed(1)}L`} helper="Current billing cycle" icon={IndianRupee} tone="bg-amber-50 text-amber-700" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <article className="surface-card min-w-0 p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div><h2 className="font-semibold">Patient flow</h2><p className="mt-1 text-xs text-[var(--muted)]">Admissions versus discharges this week</p></div>
            <span className="rounded-lg bg-[var(--primary-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--primary)]">Last 7 days</span>
          </div>
          <div className="h-[280px] w-full" role="img" aria-label="Bar chart of patient admissions and discharges for the last seven days">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={admissionData} barGap={5}>
                <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 5" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "var(--muted)", fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} width={30} tick={{ fill: "var(--muted)", fontSize: 11 }} />
                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: "var(--surface-hover)" }} />
                <Bar dataKey="admissions" fill="#16866f" radius={[6, 6, 0, 0]} maxBarSize={24} />
                <Bar dataKey="discharges" fill="#a9d8cc" radius={[6, 6, 0, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 flex flex-wrap gap-5 text-xs text-[var(--muted)]"><span className="flex items-center gap-2"><i className="size-2.5 rounded-full bg-[#16866f]" />Admissions</span><span className="flex items-center gap-2"><i className="size-2.5 rounded-full bg-[#a9d8cc]" />Discharges</span></div>
        </article>

        <article className="surface-card p-5 sm:p-6">
          <div><h2 className="font-semibold">Bed capacity</h2><p className="mt-1 text-xs text-[var(--muted)]">Live distribution across wards</p></div>
          <div className="relative mx-auto mt-3 h-[190px] max-w-[270px]" role="img" aria-label={`Donut chart showing ${bedRate}% bed occupancy`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={bedData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={78} paddingAngle={3} stroke="none">
                  {bedData.map((item) => <Cell key={item.name} fill={item.color} />)}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center"><div><p className="text-2xl font-bold">{bedRate}%</p><p className="text-[10px] text-[var(--muted)]">occupied</p></div></div>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
            {bedData.map((item) => <div key={item.name} className="flex items-center gap-2 text-xs text-[var(--muted)]"><span className="size-2 rounded-full" style={{ background: item.color }} /><span className="flex-1">{item.name}</span><strong className="text-[var(--foreground)]">{item.value}</strong></div>)}
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        <article className="surface-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4 sm:px-6">
            <div><h2 className="font-semibold">Upcoming appointments</h2><p className="mt-1 text-xs text-[var(--muted)]">Next consultations and procedures</p></div>
            <button type="button" onClick={() => navigate("/appointments")} className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:underline">View all <ArrowRight size={14} /></button>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {upcoming.slice(0, 4).map((appointment) => (
              <div key={appointment.id} className="flex items-center gap-3 px-5 py-3.5 sm:px-6">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--primary-soft)] text-xs font-bold text-[var(--primary)]">{appointment.patientName.split(" ").map((part) => part[0]).slice(0, 2).join("")}</div>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{appointment.patientName}</p><p className="truncate text-xs text-[var(--muted)]">{appointment.doctorName} · {appointment.department}</p></div>
                <div className="hidden text-right sm:block"><p className="flex items-center justify-end gap-1 text-xs font-medium"><Clock3 size={12} />{appointment.time}</p><p className="mt-1 text-[11px] text-[var(--muted)]">{appointment.date}</p></div>
                <StatusBadge status={appointment.status} />
              </div>
            ))}
          </div>
        </article>

        <article className="surface-card p-5 sm:p-6">
          <div className="flex items-start justify-between"><div><h2 className="font-semibold">Revenue trend</h2><p className="mt-1 text-xs text-[var(--muted)]">Collections in lakhs</p></div><IndianRupee size={18} className="text-[var(--primary)]" /></div>
          <div className="mt-4 h-[190px] w-full" role="img" aria-label="Area chart of monthly hospital revenue for six months">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs><linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#16866f" stopOpacity={0.28} /><stop offset="100%" stopColor="#16866f" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 5" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "var(--muted)", fontSize: 10 }} />
                <YAxis hide domain={[0, "dataMax + 5"]} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [`₹${value}L`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#16866f" strokeWidth={2.5} fill="url(#revenue-fill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 border-t border-[var(--border)] pt-4">
            <div><p className="text-[11px] text-[var(--muted)]">Pending invoices</p><p className="mt-1 text-lg font-bold">{invoices.filter((invoice) => invoice.status !== "Paid").length}</p></div>
            <div><p className="text-[11px] text-[var(--muted)]">Low-stock items</p><button type="button" onClick={() => navigate("/pharmacy")} className="mt-1 flex items-center gap-1.5 text-lg font-bold hover:text-[var(--primary)]"><PackageSearch size={17} />{lowStock}</button></div>
          </div>
        </article>
      </section>
    </div>
  );
}
