import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function FormField({
  label,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-[var(--foreground)]">
      <span>{label}{required ? <span className="ml-0.5 text-[var(--danger)]" aria-hidden="true">*</span> : null}</span>
      <span className="mt-1.5 block">{children}</span>
      {error ? <span className="mt-1.5 block text-xs font-medium text-[var(--danger)]" role="alert">{error}</span> : hint ? <span className="mt-1.5 block text-xs text-[var(--muted)]">{hint}</span> : null}
    </label>
  );
}

export function TextInput({ error, ...props }: InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return <input className="field-input" aria-invalid={Boolean(error)} {...props} />;
}

export function SelectInput({ children, error, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode; error?: string }) {
  return <select className="field-input" aria-invalid={Boolean(error)} {...props}>{children}</select>;
}

export function TextArea({ error, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
  return <textarea className="field-input min-h-24 resize-y" aria-invalid={Boolean(error)} {...props} />;
}
