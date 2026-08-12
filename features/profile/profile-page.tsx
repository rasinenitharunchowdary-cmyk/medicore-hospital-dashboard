"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BellRing, DatabaseBackup, LogOut, Mail, Moon, Phone, ShieldCheck, Sun, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FormField, SelectInput, TextArea, TextInput } from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { PageSkeleton, usePageReady } from "@/components/ui/feedback";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToast, logout, resetDemoData, toggleTheme, updateProfile } from "@/store/slices/appSlice";
import type { UserRole } from "@/types";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().regex(/^[+\d][\d\s()-]{7,18}$/, "Enter a valid phone number"),
  role: z.enum(["Administrator", "Doctor", "Nurse", "Receptionist", "Pharmacist", "Accountant"]),
  department: z.string().trim().min(2, "Department is required"),
  address: z.string().trim().max(160, "Keep the address under 160 characters"),
});
type ProfileValues = z.infer<typeof profileSchema>;

export function ProfilePage() {
  const ready = usePageReady(220);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const profile = useAppSelector((state) => state.app.authUser)!;
  const theme = useAppSelector((state) => state.app.theme);
  const [saving, setSaving] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileValues>({ resolver: zodResolver(profileSchema), values: { name: profile.name, email: profile.email, phone: profile.phone, role: profile.role, department: profile.department, address: profile.address ?? "" } });

  async function save(values: ProfileValues) {
    setSaving(true);
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    dispatch(updateProfile({ ...values, role: values.role as UserRole }));
    dispatch(addToast({ type: "success", title: "Profile saved", message: "Your account details have been updated." }));
    setSaving(false);
  }
  function signOut() {
    dispatch(logout());
    navigate("/login", { replace: true });
  }
  function resetData() {
    dispatch(resetDemoData());
    dispatch(addToast({ type: "success", message: "All assessment data was restored to its original demo state." }));
    setResetOpen(false);
  }

  if (!ready) return <PageSkeleton />;
  const initials = profile.name.split(" ").map((part) => part[0]).slice(0, 2).join("");

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Account settings" title="My profile" description="Manage your identity, work details, display preference, and local assessment data." />
      <section className="grid gap-5 xl:grid-cols-[310px_1fr]">
        <aside className="space-y-5">
          <article className="surface-card overflow-hidden">
            <div className="h-24 bg-[linear-gradient(120deg,#0f6f5c,#1b9d83)]" />
            <div className="px-5 pb-5 text-center">
              <div className="mx-auto -mt-10 grid size-20 place-items-center rounded-[24px] border-4 border-[var(--surface)] bg-[#d8f0e8] text-xl font-bold text-[#146d5b] shadow-md">{initials || <UserRound />}</div>
              <h2 className="mt-3 font-bold">{profile.name}</h2>
              <p className="mt-1 text-xs text-[var(--muted)]">{profile.role} · {profile.employeeId}</p>
              <div className="mt-5 space-y-2.5 border-t border-[var(--border)] pt-4 text-left text-xs text-[var(--muted)]"><p className="flex items-center gap-2.5"><Mail size={14} className="text-[var(--primary)]" /><span className="truncate">{profile.email}</span></p><p className="flex items-center gap-2.5"><Phone size={14} className="text-[var(--primary)]" />{profile.phone}</p><p className="flex items-center gap-2.5"><ShieldCheck size={14} className="text-[var(--primary)]" />Access verified</p></div>
            </div>
          </article>
          <article className="surface-card p-4">
            <p className="mb-3 text-xs font-semibold">Display preference</p>
            <button type="button" onClick={() => dispatch(toggleTheme())} className="flex w-full items-center gap-3 rounded-xl bg-[var(--surface-soft)] p-3 text-left hover:bg-[var(--surface-hover)]"><div className="grid size-9 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">{theme === "light" ? <Moon size={17} /> : <Sun size={17} />}</div><div className="flex-1"><p className="text-xs font-semibold">{theme === "light" ? "Dark" : "Light"} mode</p><p className="mt-0.5 text-[10px] text-[var(--muted)]">Switch dashboard appearance</p></div></button>
          </article>
        </aside>

        <div className="space-y-5">
          <article className="surface-card p-5 sm:p-6">
            <div className="mb-5"><h2 className="font-semibold">Personal & work details</h2><p className="mt-1 text-xs text-[var(--muted)]">These details appear across your hospital workspace.</p></div>
            <form onSubmit={handleSubmit(save)} noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Full name" required error={errors.name?.message}><TextInput error={errors.name?.message} {...register("name")} /></FormField>
                <FormField label="Work email" required error={errors.email?.message}><TextInput type="email" error={errors.email?.message} {...register("email")} /></FormField>
                <FormField label="Phone" required error={errors.phone?.message}><TextInput type="tel" error={errors.phone?.message} {...register("phone")} /></FormField>
                <FormField label="Role" required error={errors.role?.message}><SelectInput error={errors.role?.message} {...register("role")}>{["Administrator", "Doctor", "Nurse", "Receptionist", "Pharmacist", "Accountant"].map((role) => <option key={role}>{role}</option>)}</SelectInput></FormField>
                <FormField label="Department" required error={errors.department?.message}><TextInput error={errors.department?.message} {...register("department")} /></FormField>
                <FormField label="Employee ID" hint="Managed by hospital administration"><TextInput value={profile.employeeId} disabled className="field-input cursor-not-allowed opacity-65" /></FormField>
                <div className="sm:col-span-2"><FormField label="Address" error={errors.address?.message}><TextArea error={errors.address?.message} {...register("address")} /></FormField></div>
              </div>
              <div className="mt-6 flex justify-end border-t border-[var(--border)] pt-5"><Button type="submit" loading={saving}>Save profile</Button></div>
            </form>
          </article>

          <article className="surface-card p-5 sm:p-6">
            <div className="mb-4"><h2 className="font-semibold">Workspace controls</h2><p className="mt-1 text-xs text-[var(--muted)]">Manage local demo state and account access.</p></div>
            <div className="divide-y divide-[var(--border)]">
              <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center"><div className="grid size-10 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-700"><BellRing size={18} /></div><div className="flex-1"><p className="text-sm font-semibold">Notification preferences</p><p className="mt-0.5 text-xs text-[var(--muted)]">Operational alerts are enabled for this UI assessment.</p></div><span className="w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">Enabled</span></div>
              <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center"><div className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700"><DatabaseBackup size={18} /></div><div className="flex-1"><p className="text-sm font-semibold">Reset assessment data</p><p className="mt-0.5 text-xs text-[var(--muted)]">Restore all patients, doctors, appointments, beds, medicines, invoices, and alerts.</p></div><Button variant="secondary" onClick={() => setResetOpen(true)}>Reset data</Button></div>
              <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center"><div className="grid size-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-600"><LogOut size={18} /></div><div className="flex-1"><p className="text-sm font-semibold">Sign out</p><p className="mt-0.5 text-xs text-[var(--muted)]">End your current dashboard session.</p></div><Button variant="danger" onClick={signOut}>Sign out</Button></div>
            </div>
          </article>
        </div>
      </section>

      <Modal open={resetOpen} onClose={() => setResetOpen(false)} title="Reset all demo data?" description="This restores the assessment to its original seeded records." size="sm">
        <p className="text-sm leading-6 text-[var(--muted)]">Any records you added, edited, or deleted on this device will be replaced. Your sign-in and theme preference will stay unchanged.</p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button variant="secondary" onClick={() => setResetOpen(false)}>Cancel</Button><Button variant="danger" onClick={resetData}>Reset demo data</Button></div>
      </Modal>
    </div>
  );
}
