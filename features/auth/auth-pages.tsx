"use client";

import { useState, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, ArrowRight, BedDouble, Check, Eye, EyeOff, HeartPulse, LockKeyhole, Mail, ShieldCheck, Stethoscope, UsersRound } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FormField, TextInput } from "@/components/ui/form-field";
import { useAppDispatch } from "@/store/hooks";
import { addToast, login } from "@/store/slices/appSlice";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean(),
});
type LoginValues = z.infer<typeof loginSchema>;

const emailSchema = z.object({ email: z.string().trim().min(1, "Email is required").email("Enter a valid email address") });
type EmailValues = z.infer<typeof emailSchema>;

const resetSchema = z.object({
  password: z.string().min(8, "Use at least 8 characters").regex(/[A-Z]/, "Add one uppercase letter").regex(/[0-9]/, "Add one number"),
  confirmPassword: z.string().min(1, "Confirm your new password"),
}).refine((data) => data.password === data.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });
type ResetValues = z.infer<typeof resetSchema>;

function AuthLogo() {
  return (
    <Link to="/login" className="inline-flex items-center gap-3">
      <div className="relative grid size-10 place-items-center rounded-[13px] bg-white text-[#16866f] shadow-xl shadow-black/10"><span className="absolute h-5 w-2 rounded-sm bg-current" /><span className="absolute h-2 w-5 rounded-sm bg-current" /></div>
      <div><p className="text-lg font-bold tracking-[-0.04em] text-white">MediCore</p><p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/50">Health system</p></div>
    </Link>
  );
}

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen bg-[var(--surface)] lg:grid-cols-[1.05fr_1fr]">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#103c33] p-10 text-white lg:flex lg:flex-col xl:p-14">
        <div className="absolute -left-20 top-1/3 size-80 rounded-full border border-white/10" /><div className="absolute -left-2 top-[42%] size-52 rounded-full border border-white/10" /><div className="absolute -right-32 -top-32 size-96 rounded-full bg-[#227b68]/30 blur-2xl" />
        <div className="relative z-10"><AuthLogo /></div>
        <div className="relative z-10 my-auto max-w-xl py-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/7 px-3 py-1.5 text-[11px] font-semibold text-emerald-100"><ShieldCheck size={14} />Secure hospital operations</span>
          <h1 className="mt-6 text-[44px] font-bold leading-[1.08] tracking-[-0.055em] xl:text-[52px]">Connected care.<br /><span className="text-[#8fe0ca]">Clearer decisions.</span></h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-white/62">One calm workspace for patient flow, clinical teams, bed capacity, medicine inventory, and hospital finances.</p>
          <div className="mt-9 grid max-w-md grid-cols-3 gap-3">
            {[{ icon: UsersRound, value: "2.8k", label: "patients" }, { icon: Stethoscope, value: "86", label: "clinicians" }, { icon: BedDouble, value: "94%", label: "uptime" }].map(({ icon: Icon, value, label }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/7 p-3.5 backdrop-blur-sm"><Icon size={17} className="text-[#8fe0ca]" /><p className="mt-4 text-lg font-bold">{value}</p><p className="mt-0.5 text-[10px] uppercase tracking-wider text-white/45">{label}</p></div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-[11px] text-white/35">© {new Date().getFullYear()} MediCore Health Systems · Assessment demo</p>
      </section>
      <section className="flex min-h-screen flex-col bg-[var(--surface)] px-5 py-6 sm:px-10 lg:px-14 xl:px-20">
        <div className="flex items-center justify-between lg:hidden"><div className="rounded-xl bg-[#103c33] p-2"><AuthLogo /></div><HeartPulse className="text-[var(--primary)]" size={22} /></div>
        <div className="mx-auto flex w-full max-w-[440px] flex-1 items-center py-10">{children}</div>
        <p className="text-center text-[11px] text-[var(--subtle)] lg:hidden">MediCore Health Systems · Assessment demo</p>
      </section>
    </main>
  );
}

function PasswordInput({ error, registration, placeholder = "Enter your password" }: { error?: string; registration: ReturnType<ReturnType<typeof useForm>["register"]>; placeholder?: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <LockKeyhole size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--subtle)]" />
      <TextInput type={visible ? "text" : "password"} error={error} placeholder={placeholder} className="field-input pl-10 pr-11" {...registration} />
      <button type="button" aria-label={visible ? "Hide password" : "Show password"} onClick={() => setVisible((value) => !value)} className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface-hover)]">{visible ? <EyeOff size={16} /> : <Eye size={16} />}</button>
    </div>
  );
}

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: "admin@medicore.com", password: "admin123", remember: true } });

  async function submit(values: LoginValues) {
    setSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    if (values.email.toLowerCase() !== "admin@medicore.com" || values.password !== "admin123") {
      setError("root", { message: "The email or password is incorrect. Try the demo credentials below." });
      dispatch(addToast({ type: "error", title: "Sign-in failed", message: "Please check your credentials and try again." }));
      setSubmitting(false);
      return;
    }
    dispatch(login());
    dispatch(addToast({ type: "success", title: "Welcome back", message: "You are signed in to the hospital workspace." }));
    const destination = (location.state as { from?: string } | null)?.from ?? "/dashboard";
    navigate(destination, { replace: true });
  }

  return (
    <AuthLayout>
      <div className="w-full">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary)]">Welcome back</p>
        <h2 className="mt-2 text-3xl font-bold tracking-[-0.045em]">Sign in to MediCore</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Manage today’s care operations from one secure workspace.</p>

        <form onSubmit={handleSubmit(submit)} className="mt-8 space-y-5" noValidate>
          <FormField label="Work email" required error={errors.email?.message}>
            <div className="relative"><Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--subtle)]" /><TextInput type="email" autoComplete="username" error={errors.email?.message} className="field-input pl-10" placeholder="name@hospital.com" {...register("email")} /></div>
          </FormField>
          <FormField label="Password" required error={errors.password?.message}><PasswordInput error={errors.password?.message} registration={register("password")} /></FormField>
          <div className="flex items-center justify-between gap-3 text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-[var(--muted)]"><input type="checkbox" className="size-4 accent-[var(--primary)]" {...register("remember")} />Remember me</label>
            <Link to="/forgot-password" className="font-semibold text-[var(--primary)] hover:underline">Forgot password?</Link>
          </div>
          {errors.root?.message ? <p className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-medium leading-5 text-red-700" role="alert">{errors.root.message}</p> : null}
          <Button type="submit" loading={submitting} className="w-full py-3">Sign in <ArrowRight size={16} /></Button>
        </form>
        <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <p className="text-xs font-semibold">Reviewer demo access</p><p className="mt-1.5 text-xs leading-5 text-[var(--muted)]"><strong>admin@medicore.com</strong><br />Password: <strong>admin123</strong></p>
        </div>
      </div>
    </AuthLayout>
  );
}

export function ForgotPasswordPage() {
  const dispatch = useAppDispatch();
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<EmailValues>({ resolver: zodResolver(emailSchema) });
  async function submit(values: EmailValues) {
    setSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 600));
    setEmail(values.email);
    setSent(true);
    setSubmitting(false);
    dispatch(addToast({ type: "success", message: "Password reset instructions are ready for this demo." }));
  }
  return (
    <AuthLayout>
      <div className="w-full">
        <Link to="/login" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--primary)]"><ArrowLeft size={16} />Back to sign in</Link>
        {sent ? (
          <div className="text-center sm:text-left"><div className="mb-5 grid size-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600"><Check size={25} /></div><h2 className="text-3xl font-bold tracking-[-0.045em]">Check your inbox</h2><p className="mt-3 text-sm leading-6 text-[var(--muted)]">If an account exists for <strong className="text-[var(--foreground)]">{email}</strong>, reset instructions have been sent. This demo lets you continue directly.</p><Button className="mt-7 w-full sm:w-auto" onClick={() => window.location.assign("/reset-password")}>Open reset page <ArrowRight size={16} /></Button><button type="button" onClick={() => setSent(false)} className="mt-5 block text-sm font-semibold text-[var(--primary)] hover:underline">Use another email</button></div>
        ) : (
          <><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary)]">Account recovery</p><h2 className="mt-2 text-3xl font-bold tracking-[-0.045em]">Forgot your password?</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Enter your work email and we’ll prepare secure reset instructions.</p><form onSubmit={handleSubmit(submit)} className="mt-8 space-y-5" noValidate><FormField label="Work email" required error={errors.email?.message}><div className="relative"><Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--subtle)]" /><TextInput type="email" autoComplete="email" error={errors.email?.message} className="field-input pl-10" placeholder="name@hospital.com" {...register("email")} /></div></FormField><Button type="submit" loading={submitting} className="w-full">Send reset instructions <ArrowRight size={16} /></Button></form></>
        )}
      </div>
    </AuthLayout>
  );
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ResetValues>({ resolver: zodResolver(resetSchema) });
  async function submit() {
    setSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    setSubmitting(false);
    setComplete(true);
    dispatch(addToast({ type: "success", message: "Your demo password has been updated." }));
  }
  return (
    <AuthLayout>
      <div className="w-full">
        {complete ? (
          <div><div className="mb-5 grid size-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600"><Check size={25} /></div><h2 className="text-3xl font-bold tracking-[-0.045em]">Password updated</h2><p className="mt-3 text-sm leading-6 text-[var(--muted)]">Your password was reset successfully. Sign in with the reviewer demo credentials to continue.</p><Button className="mt-7 w-full sm:w-auto" onClick={() => navigate("/login", { replace: true })}>Return to sign in <ArrowRight size={16} /></Button></div>
        ) : (
          <><Link to="/login" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--primary)]"><ArrowLeft size={16} />Back to sign in</Link><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary)]">Secure reset</p><h2 className="mt-2 text-3xl font-bold tracking-[-0.045em]">Create a new password</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Use at least 8 characters with one uppercase letter and one number.</p><form onSubmit={handleSubmit(submit)} className="mt-8 space-y-5" noValidate><FormField label="New password" required error={errors.password?.message}><PasswordInput error={errors.password?.message} registration={register("password")} placeholder="Create a strong password" /></FormField><FormField label="Confirm password" required error={errors.confirmPassword?.message}><PasswordInput error={errors.confirmPassword?.message} registration={register("confirmPassword")} placeholder="Repeat your new password" /></FormField><Button type="submit" loading={submitting} className="w-full">Update password <ArrowRight size={16} /></Button></form></>
        )}
      </div>
    </AuthLayout>
  );
}
