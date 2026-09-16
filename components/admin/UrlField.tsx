"use client";

import { useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { checkExternalUrl, type UrlKind } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { describedBy, FieldShell } from "./fields";

type UrlFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  kind?: UrlKind;
  placeholder?: string;
  /** Visible validation error (the parent decides when to reveal it). */
  error?: string;
  hint?: ReactNode;
  className?: string;
  disabled?: boolean;
  /** Label for the clear button; defaults to "Remove". */
  removeLabel?: string;
  /** Show the clear button (default true). */
  removable?: boolean;
};

/**
 * URL input validated with lib/urls `checkExternalUrl`, the same function the save path uses.
 * Shows how the value will be normalized (bare domains become https) and a Remove button that
 * clears the link (an empty value removes a static link on save).
 */
export function UrlField({
  id,
  label,
  value,
  onChange,
  onBlur,
  kind = "any",
  placeholder,
  error,
  hint,
  className,
  disabled,
  removeLabel = "Remove",
  removable = true,
}: UrlFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const check = checkExternalUrl(value, kind);
  const trimmed = value.trim();
  const normalized = check.ok ? check.value : undefined;
  const normalizedHint =
    !error && normalized && normalized !== trimmed ? (
      <>
        Will be saved as <code className="adm-code">{normalized}</code>
      </>
    ) : null;
  const shownHint = normalizedHint ?? hint;

  return (
    <FieldShell id={id} label={label} hint={shownHint} error={error} className={cn("adm-url", className)}>
      <div className="adm-input-row">
        <input
          ref={inputRef}
          id={id}
          name={id}
          type="text"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          onBlur={() => {
            // Apply the normalization on blur so what you see is what gets saved.
            if (normalized && normalized !== value) onChange(normalized);
            onBlur?.();
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, shownHint, error)}
          className="adm-input adm-input--mono"
        />
        {removable && trimmed ? (
          <button
            type="button"
            className="adm-btn adm-btn--ghost"
            disabled={disabled}
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            aria-label={`${removeLabel}: ${label}`}
          >
            <X size={15} aria-hidden="true" />
            <span className="adm-hide-sm">{removeLabel}</span>
          </button>
        ) : null}
      </div>
    </FieldShell>
  );
}
