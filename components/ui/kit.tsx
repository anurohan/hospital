"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./index";
import type { AppointmentStatus } from "@/types";

// ─── Select ─────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
}
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, className, id, children, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1">
        {label && <label htmlFor={selectId} className="label">{label}</label>}
        <select
          ref={ref}
          id={selectId}
          className={cn("input", !!error && "border-red-500", className)}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {hint && !error && <p className="text-sm text-gray-500">{hint}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

// ─── Textarea ───────────────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const taId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1">
        {label && <label htmlFor={taId} className="label">{label}</label>}
        <textarea ref={ref} id={taId} className={cn("input min-h-24", !!error && "border-red-500", className)} {...props} />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

// ─── Status badge ─────────────────────────────────────────────────────────────
const STATUS_META: Record<AppointmentStatus, { variant: "blue" | "teal" | "success" | "warning" | "danger" | "gray"; label: string }> = {
  pending: { variant: "warning", label: "Pending" },
  confirmed: { variant: "blue", label: "Confirmed" },
  waiting: { variant: "teal", label: "Waiting" },
  in_consultation: { variant: "blue", label: "In consultation" },
  completed: { variant: "success", label: "Completed" },
  cancelled: { variant: "gray", label: "Cancelled" },
  no_show: { variant: "danger", label: "No-show" },
};
export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const meta = STATUS_META[status] ?? { variant: "gray" as const, label: status };
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}

// ─── Empty state ──────────────────────────────────────────────────────────────
export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
      {icon && <div className="text-gray-400">{icon}</div>}
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      {description && <p className="max-w-sm text-sm text-gray-500">{description}</p>}
      {action}
    </div>
  );
}

// ─── Page header ────────────────────────────────────────────────────────────
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
export function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  tone?: "default" | "primary" | "teal" | "warning" | "danger" | "success";
}) {
  const toneClass: Record<string, string> = {
    default: "text-gray-900",
    primary: "text-sky-700",
    teal: "text-teal-600",
    warning: "text-amber-600",
    danger: "text-red-600",
    success: "text-green-600",
  };
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className={cn("mt-1 text-2xl font-bold", toneClass[tone])}>{value}</p>
    </div>
  );
}

// ─── Alert / form message ─────────────────────────────────────────────────────
export function Alert({
  tone = "info",
  children,
}: {
  tone?: "info" | "success" | "error" | "warning";
  children: React.ReactNode;
}) {
  const toneClass: Record<string, string> = {
    info: "bg-sky-50 text-sky-800 border-sky-200",
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
  };
  return (
    <div role="alert" className={cn("rounded-lg border px-4 py-3 text-sm", toneClass[tone])}>
      {children}
    </div>
  );
}
