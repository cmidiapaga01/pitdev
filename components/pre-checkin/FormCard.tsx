"use client";

import React from "react";
import { motion } from "framer-motion";

interface FormCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function FormCard({
  title,
  subtitle,
  icon,
  children,
  className = "",
}: FormCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`rounded-2xl bg-white shadow-sm border border-[#ffd4d4] overflow-hidden ${className}`}
    >
      <div className="px-6 py-5 border-b border-[#ffeaea] bg-gradient-to-r from-[#fff5f4] to-white">
        <div className="flex items-center gap-3">
          {icon && (
            <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#f07070]/10 flex items-center justify-center text-[#f07070] text-xl">
              {icon}
            </span>
          )}
          <div>
            <h3 className="font-semibold text-[#2c1810] text-base leading-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-[#8a6050] mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </motion.div>
  );
}

// ---- Field wrapper ----
interface FieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}

export function Field({
  label,
  error,
  required,
  children,
  hint,
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#2c1810]">
        {label}
        {required && <span className="text-[#f07070] ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-[#8a6050]">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

// ---- Text input ----
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#2c1810] bg-white
        placeholder:text-[#c09080] outline-none transition-all
        focus:ring-2 focus:ring-[#f07070]/30 focus:border-[#f07070]
        ${error ? "border-red-400 bg-red-50" : "border-[#ffd4d4] hover:border-[#f07070]/50"}
        ${className}`}
      {...props}
    />
  )
);
Input.displayName = "Input";

// ---- Select ----
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, className = "", children, ...props }, ref) => (
    <select
      ref={ref}
      className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#2c1810] bg-white
        outline-none transition-all cursor-pointer
        focus:ring-2 focus:ring-[#f07070]/30 focus:border-[#f07070]
        ${error ? "border-red-400 bg-red-50" : "border-[#ffd4d4] hover:border-[#f07070]/50"}
        ${className}`}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

// ---- Toggle checkbox ----
interface ToggleFieldProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  variant?: "default" | "warning" | "success";
}

export function ToggleField({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  variant = "default",
}: ToggleFieldProps) {
  const colors = {
    default: "bg-[#f07070]",
    warning: "bg-amber-500",
    success: "bg-emerald-500",
  };

  return (
    <div
      role="group"
      onClick={() => !disabled && onChange(!checked)}
      className={`flex items-start gap-3 cursor-pointer select-none ${disabled ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      {/* Toggle pill — explicit block display so Tailwind w/h apply correctly */}
      <div
        role="switch"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if ((e.key === " " || e.key === "Enter") && !disabled) {
            e.preventDefault();
            onChange(!checked);
          }
        }}
        style={{ width: "2.75rem", height: "1.5rem" }}
        className={`relative mt-0.5 flex-shrink-0 rounded-full transition-colors duration-200
          ${checked ? colors[variant] : "bg-[#ffd4d4]"}
          focus:outline-none focus:ring-2 focus:ring-[#f07070]/40`}
      >
        <span
          style={{
            position: "absolute",
            top: "0.125rem",
            left: "0.125rem",
            width: "1.25rem",
            height: "1.25rem",
            transform: checked ? "translateX(1.25rem)" : "translateX(0)",
            transition: "transform 200ms",
          }}
          className="rounded-full bg-white shadow-sm"
        />
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <span className="block text-sm font-medium text-[#2c1810]">
          {label}
        </span>
        {description && (
          <span className="block text-xs text-[#8a6050] mt-0.5">
            {description}
          </span>
        )}
      </div>
    </div>
  );
}

// ---- Alert box ----
interface AlertBoxProps {
  type: "error" | "warning" | "info" | "success";
  title?: string;
  children: React.ReactNode;
}

const alertStyles = {
  error: "bg-red-50 border-red-300 text-red-800",
  warning: "bg-amber-50 border-amber-300 text-amber-800",
  info: "bg-blue-50 border-blue-300 text-blue-800",
  success: "bg-emerald-50 border-emerald-300 text-emerald-800",
};

const alertIcons = {
  error: "🚫",
  warning: "⚠️",
  info: "ℹ️",
  success: "✅",
};

export function AlertBox({ type, title, children }: AlertBoxProps) {
  return (
    <div
      className={`flex gap-3 rounded-xl border p-4 text-sm ${alertStyles[type]}`}
    >
      <span className="text-base flex-shrink-0 mt-0.5">{alertIcons[type]}</span>
      <div>
        {title && <p className="font-semibold mb-1">{title}</p>}
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

// ---- Service card ----
interface ServiceCardProps {
  title: string;
  description: string;
  price?: number;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  mandatory?: boolean;
  included?: boolean;
  icon?: string;
}

export function ServiceCard({
  title,
  description,
  price,
  checked,
  onChange,
  disabled,
  mandatory,
  included,
  icon,
}: ServiceCardProps) {
  return (
    <label
      className={`block rounded-2xl border-2 p-4 cursor-pointer transition-all duration-200
        ${checked ? "border-[#f07070] bg-[#fff5f4]" : "border-[#ffd4d4] bg-white hover:border-[#f07070]/50"}
        ${disabled || mandatory ? "cursor-default" : "cursor-pointer"}
      `}
      onClick={() => !disabled && !mandatory && onChange?.(!checked)}
    >
      <div className="flex items-start gap-3">
        {icon && <span className="text-2xl flex-shrink-0 mt-0.5">{icon}</span>}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-[#2c1810]">{title}</span>
            {mandatory && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
                Obrigatório
              </span>
            )}
            {included && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                Incluído
              </span>
            )}
          </div>
          <p className="text-xs text-[#8a6050] mt-1 leading-relaxed">
            {description}
          </p>
          {price !== undefined && (
            <p className={`text-sm font-semibold mt-2 ${included ? "text-emerald-600" : "text-[#f07070]"}`}>
              {included ? "✓ Incluso no pacote" : `+ R$ ${price.toFixed(2)}`}
            </p>
          )}
        </div>
        <div
          className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
            ${checked ? "border-[#f07070] bg-[#f07070]" : "border-[#ffd4d4] bg-white"}`}
        >
          {checked && (
            <svg viewBox="0 0 10 8" className="w-3 h-3 fill-white">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>
    </label>
  );
}
