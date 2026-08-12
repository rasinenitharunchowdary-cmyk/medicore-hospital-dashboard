"use client";

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

export function ProtectedRoute() {
  const isAuthenticated = useAppSelector((state) => state.app.isAuthenticated);
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  return <Outlet />;
}

export function PublicOnlyRoute() {
  const isAuthenticated = useAppSelector((state) => state.app.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
