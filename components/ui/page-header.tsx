import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-[var(--primary)]">{eyebrow}</p> : null}
        <h1 className="text-2xl font-bold tracking-[-0.035em] sm:text-[28px]">{title}</h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[var(--muted)]">{description}</p>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}
