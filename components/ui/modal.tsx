"use client";

import { useEffect, useId, type ReactNode } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

export function Modal({
  open,
  title,
  description,
  children,
  onClose,
  size = "md",
}: {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  size?: "sm" | "md" | "lg";
}) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;
  const maxWidth = size === "lg" ? "max-w-3xl" : size === "sm" ? "max-w-md" : "max-w-xl";

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-[#071a15]/55 p-0 backdrop-blur-sm sm:items-center sm:p-5">
      <button type="button" aria-label="Close dialog" className="absolute inset-0 cursor-default" onClick={onClose} />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={`max-h-[92vh] w-full ${maxWidth} overflow-y-auto rounded-t-[22px] border border-[var(--border)] bg-[var(--surface)] shadow-2xl sm:rounded-[22px]`}
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[var(--border)] bg-[var(--surface)] px-5 py-4 sm:px-6">
          <div>
            <h2 id={titleId} className="text-lg font-semibold tracking-tight">{title}</h2>
            {description ? <p id={descriptionId} className="mt-1 text-sm text-[var(--muted)]">{description}</p> : null}
          </div>
          <button type="button" aria-label="Close dialog" onClick={onClose} className="grid size-9 shrink-0 place-items-center rounded-xl text-[var(--muted)] hover:bg-[var(--surface-hover)]">
            <X size={19} aria-hidden="true" />
          </button>
        </header>
        <div className="p-5 sm:p-6">{children}</div>
      </section>
    </div>,
    document.body,
  );
}
