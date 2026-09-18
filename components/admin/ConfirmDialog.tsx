"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export type ConfirmOptions = {
  title: string;
  body: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "default" | "danger";
};

type ConfirmDialogProps = ConfirmOptions & {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Modal confirmation built on the native <dialog>: focus is trapped, Escape cancels, focus starts on Cancel. */
export function ConfirmDialog({ open, title, body, confirmLabel, cancelLabel = "Cancel", tone = "default", onConfirm, onCancel }: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const bodyId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
      cancelRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
      const target = returnFocusRef.current;
      if (target?.isConnected) target.focus();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={cn("adm-dialog", tone === "danger" && "adm-dialog--danger")}
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
    >
      {open ? (
        <div className="adm-dialog__inner">
          <h2 id={titleId} className="adm-dialog__title">
            {tone === "danger" ? <TriangleAlert size={20} aria-hidden="true" /> : null}
            {title}
          </h2>
          <div id={bodyId} className="adm-dialog__body">
            {body}
          </div>
          <div className="adm-dialog__actions">
            <button ref={cancelRef} type="button" className="brutal-button brutal-button--secondary brutal-button--small" onClick={onCancel}>
              {cancelLabel}
            </button>
            <button
              type="button"
              className={cn("brutal-button brutal-button--small", tone === "danger" && "brutal-button--danger")}
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}

type PendingConfirm = { options: ConfirmOptions; resolve: (value: boolean) => void };

/** `const [confirm, dialog] = useConfirm()` → `if (await confirm({...})) …`; render `dialog` once. */
export function useConfirm(): [(options: ConfirmOptions) => Promise<boolean>, ReactNode] {
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  const confirm = useCallback(
    (options: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        setPending({ options, resolve });
      }),
    [],
  );

  const settle = (value: boolean) => {
    pending?.resolve(value);
    setPending(null);
  };

  const dialog = (
    <ConfirmDialog
      open={Boolean(pending)}
      title={pending?.options.title ?? ""}
      body={pending?.options.body ?? null}
      confirmLabel={pending?.options.confirmLabel ?? "Confirm"}
      cancelLabel={pending?.options.cancelLabel}
      tone={pending?.options.tone}
      onConfirm={() => settle(true)}
      onCancel={() => settle(false)}
    />
  );

  return [confirm, dialog];
}
