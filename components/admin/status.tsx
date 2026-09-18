"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CircleAlert, CircleCheck, Info, X } from "lucide-react";

export type StatusTone = "success" | "error" | "info";

type StatusMessage = { id: number; tone: StatusTone; text: string };

type StatusContextValue = {
  message: StatusMessage | null;
  notify: (tone: StatusTone, text: string) => void;
  dismiss: () => void;
};

const StatusContext = createContext<StatusContextValue>({
  message: null,
  notify: () => {},
  dismiss: () => {},
});

let nextId = 1;

/** Holds the single admin status message (success / error / info) shown in <StatusRegion>. */
export function AdminStatusProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<StatusMessage | null>(null);

  const notify = useCallback((tone: StatusTone, text: string) => {
    setMessage({ id: nextId++, tone, text });
  }, []);
  const dismiss = useCallback(() => setMessage(null), []);

  // Success and info messages clear themselves; errors stay until dismissed or replaced.
  useEffect(() => {
    if (!message || message.tone === "error") return;
    const timer = window.setTimeout(() => {
      setMessage((current) => (current?.id === message.id ? null : current));
    }, 9000);
    return () => window.clearTimeout(timer);
  }, [message]);

  const value = useMemo(() => ({ message, notify, dismiss }), [message, notify, dismiss]);
  return <StatusContext.Provider value={value}>{children}</StatusContext.Provider>;
}

export function useNotify() {
  return useContext(StatusContext).notify;
}

const toneIcon = { success: CircleCheck, error: CircleAlert, info: Info } as const;

/**
 * Live regions for admin feedback. Both regions are always in the DOM so screen readers pick up changes:
 * errors are announced assertively, everything else politely.
 */
export function StatusRegion() {
  const { message, dismiss } = useContext(StatusContext);
  const Icon = message ? toneIcon[message.tone] : null;

  const box = message && Icon ? (
    <div className={`adm-status__msg adm-status__msg--${message.tone}`} key={message.id}>
      <Icon size={18} aria-hidden="true" className="adm-status__icon" />
      <p>{message.text}</p>
      <button type="button" className="adm-icon-btn adm-icon-btn--bare" onClick={dismiss} aria-label="Dismiss message">
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  ) : null;

  return (
    <div className="adm-status">
      <div role="alert" aria-live="assertive" aria-atomic="true">
        {message?.tone === "error" ? box : null}
      </div>
      <div role="status" aria-live="polite" aria-atomic="true">
        {message && message.tone !== "error" ? box : null}
      </div>
    </div>
  );
}
