"use client";

import React from "react";
import { cn } from "@/lib/utils";

// ─── Button ───────────────────────────────────────────────────────────────────

type ButtonVariant = "primary" | "teal" | "outline" | "ghost" | "danger";
type ButtonSize    = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  teal:    "btn-teal",
  outline: "btn-outline",
  ghost:   "btn-ghost",
  danger:  "bg-red-600 text-white hover:bg-red-700",
};
const sizeClass: Record<ButtonSize, string> = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
  xl: "btn-xl",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn("btn", variantClass[variant], sizeClass[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Spinner size={16} />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

// ─── Spinner ──────────────────────────────────────────────────────────────────

interface SpinnerProps { size?: number; className?: string }

export function Spinner({ size = 20, className }: SpinnerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("animate-spin", className)}
      aria-label="Loading"
    >
      <circle
        cx="12" cy="12" r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="31.416"
        strokeDashoffset="10"
      />
    </svg>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────

type BadgeVariant = "blue" | "teal" | "success" | "warning" | "danger" | "gray";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "gray", children, className }: BadgeProps) {
  return (
    <span className={cn("badge", `badge-${variant}`, className)}>
      {children}
    </span>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg" | "none";
}

const paddingClass = { sm: "card-body-sm", md: "card-body", lg: "card-body-lg", none: "" };

export function Card({ children, className, hover = false, padding = "md" }: CardProps) {
  return (
    <div className={cn("card", hover && "card-hover", paddingClass[padding], className)}>
      {children}
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

interface SectionHeaderProps {
  tag?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export function SectionHeader({
  tag,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeaderProps) {
  const alignClass = {
    left:   "text-left  items-start",
    center: "text-center items-center",
    right:  "text-right items-end",
  }[align];

  return (
    <div className={cn("flex flex-col gap-3 mb-12", alignClass, className)}>
      {tag && (
        <span
          className="pill"
          style={{
            background: "var(--color-primary-50)",
            color: "var(--color-primary-700)",
            border: "1px solid var(--color-primary-200)",
          }}
        >
          {tag}
        </span>
      )}
      <h2 style={{ maxWidth: "600px" }}>{title}</h2>
      {subtitle && (
        <p style={{ maxWidth: "560px", color: "var(--text-secondary)" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

export function Divider({ className }: { className?: string }) {
  return <hr className={cn("divider", className)} />;
}

// ─── Input ────────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftAddon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftAddon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
          </label>
        )}
        <div className="relative">
          {leftAddon && (
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
            >
              {leftAddon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn("input", !!leftAddon && "pl-10", !!error && "border-red-500", className)}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm" style={{ color: "var(--color-danger)" }}>
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
