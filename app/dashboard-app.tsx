"use client";

import { useSyncExternalStore } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "@/components/ui/feedback";
import { AppShell } from "@/components/layout/app-shell";
import { ToastRegion } from "@/components/ui/toast-region";
import { LoginPage, ForgotPasswordPage, ResetPasswordPage } from "@/features/auth/auth-pages";
import { DashboardPage } from "@/features/dashboard/dashboard-page";
import {
  AppointmentsPage,
  BedsPage,
  BillingPage,
  DoctorsPage,
  NotificationsPage,
  PatientsPage,
  PharmacyPage,
} from "@/features/management/management-pages";
import { ProfilePage } from "@/features/profile/profile-page";
import { NotFoundPage } from "@/features/not-found-page";
import { ProtectedRoute, PublicOnlyRoute } from "@/features/auth/route-guards";
import { store } from "@/store";

export function HospitalApp() {
  const mounted = useSyncExternalStore(() => () => undefined, () => true, () => false);

  if (!mounted) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#103c33] text-white" aria-label="Loading MediCore">
        <div className="text-center">
          <div className="relative mx-auto grid size-14 place-items-center rounded-[18px] bg-white text-[#16866f] shadow-2xl"><span className="absolute h-7 w-2.5 rounded-sm bg-current" /><span className="absolute h-2.5 w-7 rounded-sm bg-current" /></div>
          <p className="mt-4 text-lg font-bold tracking-[-0.04em]">MediCore</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">Preparing hospital workspace</p>
        </div>
      </main>
    );
  }

  return (
    <Provider store={store}>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/patients" element={<PatientsPage />} />
                <Route path="/doctors" element={<DoctorsPage />} />
                <Route path="/appointments" element={<AppointmentsPage />} />
                <Route path="/beds" element={<BedsPage />} />
                <Route path="/pharmacy" element={<PharmacyPage />} />
                <Route path="/billing" element={<BillingPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <ToastRegion />
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  );
}
