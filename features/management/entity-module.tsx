"use client";

import { useMemo, useState, type ReactNode } from "react";
import { AlertTriangle, Plus, RotateCcw } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DataTable, type TableColumn } from "@/components/ui/data-table";
import { ErrorState, PageSkeleton, usePageReady } from "@/components/ui/feedback";
import { FormField, SelectInput, TextArea, TextInput } from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";

export type FormValues = Record<string, string>;

export interface EntityField {
  key: string;
  label: string;
  type?: "text" | "email" | "tel" | "number" | "date" | "time" | "datetime-local" | "select" | "textarea";
  options?: string[];
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  span?: 1 | 2;
  validate?: (value: string, values: FormValues) => string | undefined;
}

export interface ModuleMetric {
  label: string;
  value: string;
  note: string;
  icon: ReactNode;
  tone: string;
}

interface EntityModuleProps<T extends { id: string }> {
  eyebrow: string;
  title: string;
  description: string;
  singular: string;
  rows: T[];
  columns: TableColumn<T>[];
  fields: EntityField[];
  defaults: FormValues;
  metrics?: ModuleMetric[];
  searchPlaceholder: string;
  searchText: (row: T) => string;
  filterLabel: string;
  filterOptions: string[];
  filterValue: (row: T) => string;
  displayName: (row: T) => string;
  toFormValues: (row: T) => FormValues;
  buildRecord: (values: FormValues, current?: T) => Omit<T, "id">;
  onAdd: (record: Omit<T, "id">) => void;
  onUpdate: (id: string, record: Omit<T, "id">) => void;
  onDelete: (id: string) => void;
  onNotify: (kind: "success" | "error", message: string) => void;
  validateForm?: (values: FormValues) => Record<string, string>;
}

function validateFields(fields: EntityField[], values: FormValues, validateForm?: EntityModuleProps<{ id: string }>["validateForm"]) {
  const errors: Record<string, string> = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[+\d][\d\s()-]{7,18}$/;
  for (const field of fields) {
    const value = values[field.key]?.trim() ?? "";
    if (field.required && !value) errors[field.key] = `${field.label} is required`;
    else if (value && field.type === "email" && !emailPattern.test(value)) errors[field.key] = "Enter a valid email address";
    else if (value && field.type === "tel" && !phonePattern.test(value)) errors[field.key] = "Enter a valid phone number";
    else if (value && field.type === "number" && Number.isNaN(Number(value))) errors[field.key] = "Enter a valid number";
    else if (value && field.type === "number" && field.min !== undefined && Number(value) < field.min) errors[field.key] = `Must be at least ${field.min}`;
    else if (value && field.type === "number" && field.max !== undefined && Number(value) > field.max) errors[field.key] = `Must be ${field.max} or less`;
    const custom = field.validate?.(value, values);
    if (!errors[field.key] && custom) errors[field.key] = custom;
  }
  return { ...errors, ...(validateForm?.(values) ?? {}) };
}

function MetricStrip({ metrics }: { metrics: ModuleMetric[] }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Module summary">
      {metrics.map((metric) => (
        <article key={metric.label} className="surface-card flex items-center gap-4 p-4">
          <div className={`grid size-11 shrink-0 place-items-center rounded-2xl ${metric.tone}`}>{metric.icon}</div>
          <div className="min-w-0"><p className="text-xs font-medium text-[var(--muted)]">{metric.label}</p><p className="mt-0.5 text-xl font-bold tracking-[-0.035em]">{metric.value}</p><p className="mt-0.5 truncate text-[10px] text-[var(--subtle)]">{metric.note}</p></div>
        </article>
      ))}
    </section>
  );
}

export function EntityModule<T extends { id: string }>(props: EntityModuleProps<T>) {
  const ready = usePageReady(260);
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<"add" | "edit" | "view" | "delete" | null>(searchParams.get("new") === "1" ? "add" : null);
  const [current, setCurrent] = useState<T | null>(null);
  const [values, setValues] = useState<FormValues>(props.defaults);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const searchQuery = searchParams.get("search") ?? "";
  const simulatedError = searchParams.get("state") === "error";

  const detailFields = useMemo(() => props.fields.filter((field) => values[field.key] !== undefined), [props.fields, values]);

  function openAdd() {
    setCurrent(null);
    setValues({ ...props.defaults });
    setErrors({});
    setMode("add");
  }
  function openEdit(row: T) {
    setCurrent(row);
    setValues(props.toFormValues(row));
    setErrors({});
    setMode("edit");
  }
  function openView(row: T) {
    setCurrent(row);
    setValues(props.toFormValues(row));
    setMode("view");
  }
  function openDelete(row: T) {
    setCurrent(row);
    setMode("delete");
  }
  function close() {
    if (saving) return;
    setMode(null);
    setCurrent(null);
    setErrors({});
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = validateFields(props.fields, values, props.validateForm as never);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      props.onNotify("error", "Please correct the highlighted fields.");
      return;
    }
    setSaving(true);
    await new Promise((resolve) => window.setTimeout(resolve, 420));
    try {
      const record = props.buildRecord(values, current ?? undefined);
      if (mode === "edit" && current) props.onUpdate(current.id, record);
      else props.onAdd(record);
      props.onNotify("success", `${props.singular} ${mode === "edit" ? "updated" : "added"} successfully.`);
      setSaving(false);
      close();
    } catch {
      setSaving(false);
      props.onNotify("error", `Unable to save this ${props.singular.toLowerCase()}.`);
    }
  }

  function confirmDelete() {
    if (!current) return;
    props.onDelete(current.id);
    props.onNotify("success", `${props.singular} removed from the demo records.`);
    close();
  }

  if (!ready) return <PageSkeleton />;
  if (simulatedError) {
    return <div className="flex min-h-[65vh] items-center justify-center"><ErrorState description="The demo data source was intentionally set to an error state. Retry to restore the live module." onRetry={() => { const next = new URLSearchParams(searchParams); next.delete("state"); setSearchParams(next, { replace: true }); }} /></div>;
  }

  return (
    <div className="space-y-5">
      <PageHeader eyebrow={props.eyebrow} title={props.title} description={props.description} actions={<Button onClick={openAdd}><Plus size={16} />Add {props.singular.toLowerCase()}</Button>} />
      {props.metrics?.length ? <MetricStrip metrics={props.metrics} /> : null}
      <DataTable
        rows={props.rows}
        columns={props.columns}
        getId={(row) => row.id}
        searchPlaceholder={props.searchPlaceholder}
        initialQuery={searchQuery}
        searchText={props.searchText}
        filterLabel={props.filterLabel}
        filterOptions={props.filterOptions}
        filterValue={props.filterValue}
        onView={openView}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <Modal open={mode === "add" || mode === "edit"} title={`${mode === "edit" ? "Edit" : "Add"} ${props.singular.toLowerCase()}`} description={`${mode === "edit" ? "Update" : "Enter"} the details below. Required fields are marked with an asterisk.`} onClose={close} size="lg">
        <form onSubmit={submit} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            {props.fields.map((field) => {
              const shared = { value: values[field.key] ?? "", onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setValues((currentValues) => ({ ...currentValues, [field.key]: event.target.value })) };
              return (
                <div key={field.key} className={field.span === 2 ? "sm:col-span-2" : ""}>
                  <FormField label={field.label} required={field.required} error={errors[field.key]} hint={field.hint}>
                    {field.type === "select" ? (
                      <SelectInput error={errors[field.key]} {...shared}><option value="">Select {field.label.toLowerCase()}</option>{field.options?.map((option) => <option key={option} value={option}>{option}</option>)}</SelectInput>
                    ) : field.type === "textarea" ? (
                      <TextArea error={errors[field.key]} placeholder={field.placeholder} {...shared} />
                    ) : (
                      <TextInput error={errors[field.key]} type={field.type ?? "text"} placeholder={field.placeholder} min={field.min} max={field.max} step={field.step} {...shared} />
                    )}
                  </FormField>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex flex-col-reverse gap-2 border-t border-[var(--border)] pt-5 sm:flex-row sm:justify-end"><Button type="button" variant="secondary" onClick={close}>Cancel</Button><Button type="submit" loading={saving}>{mode === "edit" ? "Save changes" : `Add ${props.singular.toLowerCase()}`}</Button></div>
        </form>
      </Modal>

      <Modal open={mode === "view" && Boolean(current)} title={`${props.singular} details`} description={current ? `${props.displayName(current)} · ${current.id}` : undefined} onClose={close} size="lg">
        {current ? <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">{detailFields.map((field) => <div key={field.key} className={field.span === 2 ? "sm:col-span-2" : ""}><dt className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">{field.label}</dt><dd className="mt-1.5 break-words text-sm font-medium">{values[field.key] || "—"}</dd></div>)}</dl> : null}
        <div className="mt-7 flex justify-end border-t border-[var(--border)] pt-5"><Button variant="secondary" onClick={close}>Close</Button></div>
      </Modal>

      <Modal open={mode === "delete" && Boolean(current)} title={`Remove ${props.singular.toLowerCase()}?`} description="This action changes the local assessment data and can be restored from Profile settings." onClose={close} size="sm">
        <div className="flex gap-3 rounded-2xl bg-red-50 p-4 text-red-800"><AlertTriangle size={20} className="mt-0.5 shrink-0" /><p className="text-sm leading-6">You are about to remove <strong>{current ? props.displayName(current) : "this record"}</strong>. This cannot be undone without resetting demo data.</p></div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button variant="secondary" onClick={close}>Keep record</Button><Button variant="danger" onClick={confirmDelete}><RotateCcw className="hidden" size={15} />Remove</Button></div>
      </Modal>
    </div>
  );
}
