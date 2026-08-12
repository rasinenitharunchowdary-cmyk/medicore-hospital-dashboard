"use client";

import { Component, type ErrorInfo, type ReactNode, useEffect, useState } from "react";
import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("MediCore interface error", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[var(--background)] p-6">
          <ErrorState
            title="Something did not load correctly"
            description="Your data is safe. Refresh the dashboard to try again."
            onRetry={() => window.location.reload()}
          />
        </main>
      );
    }
    return this.props.children;
  }
}

export function usePageReady(delay = 320) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);
  return ready;
}

export function PageSkeleton() {
  return (
    <div className="space-y-5" aria-label="Loading page" role="status">
      <div className="skeleton h-9 w-52 rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="skeleton h-32 rounded-[18px]" />
        ))}
      </div>
      <div className="skeleton h-80 rounded-[18px]" />
      <span className="sr-only">Loading hospital information</span>
    </div>
  );
}

export function EmptyState({
  title = "No records found",
  description = "Try changing your search or filters.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center px-6 py-10 text-center">
      <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
        <Inbox size={22} aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-[var(--muted)]">{description}</p>
    </div>
  );
}

export function ErrorState({
  title = "Unable to load data",
  description = "Please check your connection and try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <section className="surface-card w-full max-w-lg p-8 text-center" role="alert">
      <div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-red-50 text-[var(--danger)]">
        <AlertTriangle size={22} aria-hidden="true" />
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--muted)]">{description}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white hover:bg-[var(--primary-dark)]"
        >
          <RefreshCw size={16} aria-hidden="true" /> Try again
        </button>
      ) : null}
    </section>
  );
}
