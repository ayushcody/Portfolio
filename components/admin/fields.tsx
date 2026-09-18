"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { fromCsv, fromLines, plural } from "./format";

/** Validation errors keyed by field key (e.g. "title", "links.github"). */
export type FieldErrors = Record<string, string>;

export type FieldErrorApi = {
  /** The error to display for a field: only after the field was left or a save was attempted. */
  errorFor: (key: string) => string | undefined;
  touch: (key: string) => void;
  revealAll: () => void;
  reset: () => void;
  /** All current validation errors. */
  count: number;
  /** Errors currently shown to the admin. */
  visibleCount: number;
};

/** Tracks which validation errors are visible, so fields are not flagged while the admin is still typing. */
export function useFieldErrors(errors: FieldErrors): FieldErrorApi {
  const [touched, setTouched] = useState<ReadonlySet<string>>(() => new Set());
  const [revealed, setRevealed] = useState(false);

  const touch = useCallback((key: string) => {
    setTouched((current) => (current.has(key) ? current : new Set(current).add(key)));
  }, []);
  const revealAll = useCallback(() => setRevealed(true), []);
  const reset = useCallback(() => {
    setTouched(new Set());
    setRevealed(false);
  }, []);

  return useMemo(
    () => ({
      errorFor: (key: string) => (revealed || touched.has(key) ? errors[key] : undefined),
      touch,
      revealAll,
      reset,
      count: Object.keys(errors).length,
      visibleCount: Object.keys(errors).filter((key) => revealed || touched.has(key)).length,
    }),
    [errors, revealed, touched, touch, revealAll, reset],
  );
}

/** Focuses the first invalid control in `container` and scrolls it to the middle of the viewport (clear of the fixed nav and status). */
export function focusFirstInvalid(container: HTMLElement | null) {
  const target = container?.querySelector<HTMLElement>('[aria-invalid="true"]');
  if (!target) return;
  target.focus({ preventScroll: true });
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
}

export function describedBy(id: string, hint?: ReactNode, error?: string) {
  return [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
}

type FieldShellProps = {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
  /** Extra control rendered on the label row (e.g. a counter). */
  aside?: ReactNode;
  children: ReactNode;
};

export function FieldShell({ id, label, hint, error, required, className, aside, children }: FieldShellProps) {
  return (
    <div className={cn("adm-field", error && "adm-field--invalid", className)}>
      <div className="adm-field__label-row">
        <label htmlFor={id} className="adm-field__label">
          {label}
          {required ? <span className="adm-field__req"> (required)</span> : null}
        </label>
        {aside ? <span className="adm-field__aside">{aside}</span> : null}
      </div>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="adm-field__hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="adm-field__error">
          <CircleAlert size={14} aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  type?: "text" | "email" | "password" | "date" | "number" | "url" | "search";
  placeholder?: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "decimal" | "url" | "email";
  list?: string;
  min?: number;
  step?: number;
  className?: string;
  mono?: boolean;
};

export function TextField({
  id,
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  hint,
  error,
  required,
  className,
  mono,
  ...inputProps
}: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn("adm-input", mono && "adm-input--mono")}
        {...inputProps}
      />
    </FieldShell>
  );
}

type TextAreaFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  rows?: number;
  placeholder?: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  mono?: boolean;
  aside?: ReactNode;
};

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  onBlur,
  rows = 4,
  hint,
  error,
  required,
  className,
  mono,
  aside,
  ...rest
}: TextAreaFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required} className={className} aside={aside}>
      <textarea
        id={id}
        name={id}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn("adm-input adm-textarea", mono && "adm-input--mono")}
        {...rest}
      />
    </FieldShell>
  );
}

type ListFieldProps = Omit<TextAreaFieldProps, "aside" | "mono"> & {
  /** "lines": one item per line. "comma": comma separated, rendered as a single-line input. */
  separator: "lines" | "comma";
};

/** Edits a string list as raw text so typing commas and new lines feels natural; parsed on save. */
export function ListField({ separator, hint, rows = 4, ...props }: ListFieldProps) {
  const count = separator === "lines" ? fromLines(props.value).length : fromCsv(props.value).length;
  const defaultHint = separator === "lines" ? "One item per line." : "Separate items with commas.";
  const aside = <span aria-hidden="true">{plural(count, "item")}</span>;

  if (separator === "comma") {
    return (
      <FieldShell
        id={props.id}
        label={props.label}
        hint={hint ?? defaultHint}
        error={props.error}
        required={props.required}
        className={props.className}
        aside={aside}
      >
        <input
          id={props.id}
          name={props.id}
          type="text"
          value={props.value}
          placeholder={props.placeholder}
          disabled={props.disabled}
          onChange={(event) => props.onChange(event.target.value)}
          onBlur={props.onBlur}
          aria-invalid={props.error ? true : undefined}
          aria-describedby={describedBy(props.id, hint ?? defaultHint, props.error)}
          className="adm-input"
        />
      </FieldShell>
    );
  }

  return <TextAreaField {...props} rows={rows} hint={hint ?? defaultHint} aside={aside} />;
}

type CheckboxFieldProps = {
  id: string;
  label: string;
  description?: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
};

export function CheckboxField({ id, label, description, checked, onChange, disabled, className }: CheckboxFieldProps) {
  return (
    <div className={cn("adm-check", className)}>
      <input
        id={id}
        name={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        aria-describedby={description ? `${id}-hint` : undefined}
        className="adm-check__box"
      />
      <div>
        <label htmlFor={id} className="adm-check__label">
          {label}
        </label>
        {description ? (
          <p id={`${id}-hint`} className="adm-field__hint">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

type SelectFieldProps<T extends string> = {
  id: string;
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
};

export function SelectField<T extends string>({ id, label, value, options, onChange, hint, error, required, className }: SelectFieldProps<T>) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className="adm-input adm-select"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

/** A titled group of fields. Two columns on wide screens unless `columns={1}`. */
export function FormSection({
  title,
  description,
  columns = 2,
  children,
}: {
  title: string;
  description?: ReactNode;
  columns?: 1 | 2;
  children: ReactNode;
}) {
  return (
    <fieldset className="adm-section">
      <legend className="adm-section__title">{title}</legend>
      {description ? <p className="adm-section__desc">{description}</p> : null}
      <div className={cn("adm-grid", columns === 1 && "adm-grid--single")}>{children}</div>
    </fieldset>
  );
}
