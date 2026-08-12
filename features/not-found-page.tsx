"use client";

import { ArrowLeft, HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] p-6">
      <section className="surface-card max-w-lg p-8 text-center sm:p-10">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]"><HeartPulse size={25} /></div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)]">404 · Route not found</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.045em]">This page is off the ward</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">The address may be incorrect or the page may have moved. Your hospital data is unchanged.</p>
        <Link to="/dashboard" className="mt-7 inline-block"><Button><ArrowLeft size={16} />Return to dashboard</Button></Link>
      </section>
    </main>
  );
}
