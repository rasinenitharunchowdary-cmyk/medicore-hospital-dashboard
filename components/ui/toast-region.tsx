"use client";

import { useEffect } from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeToast } from "@/store/slices/appSlice";
import type { ToastMessage } from "@/types";

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: TriangleAlert,
  info: Info,
};

const colorMap = {
  success: "text-emerald-600 bg-emerald-50",
  error: "text-red-600 bg-red-50",
  warning: "text-amber-600 bg-amber-50",
  info: "text-sky-600 bg-sky-50",
};

function ToastItem({ toast }: { toast: ToastMessage }) {
  const dispatch = useAppDispatch();
  const Icon = iconMap[toast.type];
  useEffect(() => {
    const timer = window.setTimeout(() => dispatch(removeToast(toast.id)), toast.duration ?? 4000);
    return () => window.clearTimeout(timer);
  }, [dispatch, toast.duration, toast.id]);

  return (
    <div className="pointer-events-auto flex w-full items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5 text-[var(--foreground)] shadow-2xl" role="status">
      <div className={`grid size-9 shrink-0 place-items-center rounded-xl ${colorMap[toast.type]}`}><Icon size={18} aria-hidden="true" /></div>
      <div className="min-w-0 flex-1 pt-0.5">{toast.title ? <p className="text-sm font-semibold">{toast.title}</p> : null}<p className={`${toast.title ? "mt-0.5" : "mt-1"} text-xs leading-5 text-[var(--muted)]`}>{toast.message}</p></div>
      <button type="button" aria-label="Dismiss notification" onClick={() => dispatch(removeToast(toast.id))} className="grid size-8 shrink-0 place-items-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface-hover)]"><X size={15} /></button>
    </div>
  );
}

export function ToastRegion() {
  const toasts = useAppSelector((state) => state.app.toasts);
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[150] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2" aria-live="polite" aria-atomic="false">
      {toasts.slice(-4).map((toast) => <ToastItem key={toast.id} toast={toast} />)}
    </div>
  );
}
