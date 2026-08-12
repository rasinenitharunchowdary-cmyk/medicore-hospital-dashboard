"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsUpDown, Eye, Pencil, Search, Trash2 } from "lucide-react";
import { EmptyState } from "./feedback";

export interface TableColumn<T> {
  key: string;
  label: string;
  value: (row: T) => string | number;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  rows: T[];
  columns: TableColumn<T>[];
  getId: (row: T) => string;
  searchPlaceholder?: string;
  initialQuery?: string;
  searchText: (row: T) => string;
  filterLabel?: string;
  filterOptions?: string[];
  filterValue?: (row: T) => string;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  pageSize?: number;
  emptyTitle?: string;
}

export function DataTable<T>({
  rows,
  columns,
  getId,
  searchPlaceholder = "Search records...",
  initialQuery = "",
  searchText,
  filterLabel = "All statuses",
  filterOptions = [],
  filterValue,
  onView,
  onEdit,
  onDelete,
  pageSize = 5,
  emptyTitle,
}: DataTableProps<T>) {
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState("all");
  const [sortKey, setSortKey] = useState(columns.find((column) => column.sortable)?.key ?? columns[0]?.key);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const result = rows.filter((row) => {
      const matchesQuery = !needle || searchText(row).toLowerCase().includes(needle);
      const matchesFilter = filter === "all" || !filterValue || filterValue(row).toLowerCase() === filter.toLowerCase();
      return matchesQuery && matchesFilter;
    });
    const column = columns.find((item) => item.key === sortKey);
    if (!column) return result;
    return [...result].sort((a, b) => {
      const left = column.value(a);
      const right = column.value(b);
      const comparison = typeof left === "number" && typeof right === "number"
        ? left - right
        : String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: "base" });
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [columns, filter, filterValue, query, rows, searchText, sortDirection, sortKey]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const hasActions = Boolean(onView || onEdit || onDelete);

  function sort(column: TableColumn<T>) {
    if (!column.sortable) return;
    if (sortKey === column.key) setSortDirection((direction) => direction === "asc" ? "desc" : "asc");
    else {
      setSortKey(column.key);
      setSortDirection("asc");
    }
  }

  return (
    <section className="surface-card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-[var(--border)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-sm">
          <span className="sr-only">Search table</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--subtle)]" size={17} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => { setQuery(event.target.value); setPage(1); }}
            className="field-input pl-10"
            placeholder={searchPlaceholder}
          />
        </label>
        {filterOptions.length ? (
          <label className="block w-full sm:w-48">
            <span className="sr-only">Filter table</span>
            <select className="field-input" value={filter} onChange={(event) => { setFilter(event.target.value); setPage(1); }}>
              <option value="all">{filterLabel}</option>
              {filterOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
        ) : null}
      </div>

      {visibleRows.length ? (
        <div className="max-w-full overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-[var(--surface-soft)] text-xs uppercase tracking-[0.06em] text-[var(--muted)]">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={sortKey === column.key && column.sortable ? (sortDirection === "asc" ? "ascending" : "descending") : column.sortable ? "none" : undefined}
                    className={`whitespace-nowrap px-5 py-3.5 font-semibold ${column.className ?? ""}`}
                  >
                    <button
                      type="button"
                      disabled={!column.sortable}
                      onClick={() => sort(column)}
                      className={`inline-flex items-center gap-1.5 ${column.sortable ? "hover:text-[var(--foreground)]" : "cursor-default"}`}
                    >
                      {column.label}
                      {column.sortable ? sortKey === column.key ? sortDirection === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} /> : <ChevronsUpDown size={13} /> : null}
                    </button>
                  </th>
                ))}
                {hasActions ? <th scope="col" className="px-5 py-3.5 text-right font-semibold">Actions</th> : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {visibleRows.map((row) => (
                <tr key={getId(row)} className="transition hover:bg-[var(--surface-hover)]">
                  {columns.map((column) => (
                    <td key={column.key} className={`px-5 py-4 ${column.className ?? ""}`}>
                      {column.render ? column.render(row) : column.value(row)}
                    </td>
                  ))}
                  {hasActions ? (
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        {onView ? <button type="button" aria-label={`View ${getId(row)}`} title="View" onClick={() => onView(row)} className="grid size-9 place-items-center rounded-lg text-[var(--muted)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"><Eye size={16} /></button> : null}
                        {onEdit ? <button type="button" aria-label={`Edit ${getId(row)}`} title="Edit" onClick={() => onEdit(row)} className="grid size-9 place-items-center rounded-lg text-[var(--muted)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"><Pencil size={16} /></button> : null}
                        {onDelete ? <button type="button" aria-label={`Delete ${getId(row)}`} title="Delete" onClick={() => onDelete(row)} className="grid size-9 place-items-center rounded-lg text-[var(--muted)] hover:bg-red-50 hover:text-[var(--danger)]"><Trash2 size={16} /></button> : null}
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <EmptyState title={emptyTitle ?? (rows.length ? "No matching records" : "No records yet")} />}

      <footer className="flex flex-col gap-3 border-t border-[var(--border)] px-4 py-3.5 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p>
          {filtered.length ? `Showing ${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filtered.length)} of ${filtered.length}` : "0 records"}
        </p>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="grid size-9 place-items-center rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] disabled:opacity-40"><ChevronLeft size={16} /></button>
          <span className="min-w-20 text-center text-xs font-semibold text-[var(--foreground)]">Page {currentPage} of {pageCount}</span>
          <button type="button" aria-label="Next page" disabled={currentPage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} className="grid size-9 place-items-center rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] disabled:opacity-40"><ChevronRight size={16} /></button>
        </div>
      </footer>
    </section>
  );
}
