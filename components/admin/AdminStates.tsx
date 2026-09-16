"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { KeyRound, Loader2, Lock, LogOut, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { TextField } from "./fields";
import { ConfigChecklist, ENV_TEMPLATE } from "./SetupGuide";

/** Centered single-card layout used for every state before the dashboard. */
export function AdminStateCard({
  kicker,
  kickerTone = "yellow",
  icon,
  title,
  children,
  wide,
}: {
  kicker: string;
  kickerTone?: "yellow" | "lilac" | "coral" | "sage";
  icon: ReactNode;
  title: string;
  children?: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="adm-center">
      <section className={cn("adm-card", wide && "adm-card--wide")} aria-labelledby="admin-state-title">
        <p className={`adm-chip adm-chip--${kickerTone}`}>
          {icon}
          {kicker}
        </p>
        <h1 id="admin-state-title" className="adm-card__heading">
          {title}
        </h1>
        {children}
      </section>
    </div>
  );
}

export function SetupNeededPanel() {
  return (
    <AdminStateCard kicker="Setup needed" kickerTone="lilac" icon={<KeyRound size={15} aria-hidden="true" />} title="Connect Firebase to use the admin" wide>
      <p className="adm-lead">
        This environment has no Firebase configuration, so sign-in and editing are off. The public site keeps working from the static content in src/data.
      </p>
      <ConfigChecklist />
      <ol className="adm-steps">
        <li>
          Add the Firebase web config and an admin allowlist to <code className="adm-code">.env.local</code>:
        </li>
      </ol>
      <pre className="adm-pre">{ENV_TEMPLATE}</pre>
      <ol className="adm-steps" start={2}>
        <li>Enable Email/Password sign-in in Firebase Authentication and create your admin user.</li>
        <li>
          Deploy the Firestore and Storage rules from <code className="adm-code">docs/firebase-admin-setup.md</code>.
        </li>
        <li>Restart the dev server (or redeploy) so the new variables are picked up.</li>
      </ol>
    </AdminStateCard>
  );
}

export function LockedPanel() {
  return (
    <AdminStateCard kicker="Admin locked" kickerTone="coral" icon={<Lock size={15} aria-hidden="true" />} title="No admin allowlist configured">
      <p className="adm-lead">
        Add <code className="adm-code">NEXT_PUBLIC_ADMIN_UID</code> or <code className="adm-code">NEXT_PUBLIC_ADMIN_EMAIL</code> (or the plural, comma-separated
        variants) to the environment, then restart.
      </p>
      <p className="adm-muted">
        The console locks everyone out until an explicit allowlist exists. The real protection is the Firestore and Storage rules in docs/firebase-admin-setup.md.
      </p>
    </AdminStateCard>
  );
}

export function LoadingPanel() {
  return (
    <AdminStateCard kicker="Admin" icon={<KeyRound size={15} aria-hidden="true" />} title="Checking your session">
      <p className="adm-lead adm-inline-status" role="status">
        <Loader2 size={18} className="adm-spin" aria-hidden="true" />
        Connecting to Firebase Authentication…
      </p>
    </AdminStateCard>
  );
}

export function SignInPanel({ onSignIn }: { onSignIn: (email: string, password: string) => Promise<string | null> }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setBusy(true);
    setError(null);
    const failure = await onSignIn(email.trim(), password);
    setBusy(false);
    if (failure) setError(failure);
  }

  return (
    <AdminStateCard kicker="Admin" icon={<KeyRound size={15} aria-hidden="true" />} title="Sign in">
      <p className="adm-lead">Private console for editing the portfolio. Only allowlisted Firebase accounts can continue.</p>
      <form className="adm-signin" onSubmit={handleSubmit} noValidate>
        <TextField id="admin-email" label="Email" type="email" autoComplete="username" value={email} onChange={setEmail} />
        <TextField id="admin-password" label="Password" type="password" autoComplete="current-password" value={password} onChange={setPassword} />
        <div role="alert" aria-live="assertive">
          {error ? <p className="state-note state-note--error adm-compact-note">{error}</p> : null}
        </div>
        <button type="submit" className="brutal-button adm-block-button" aria-disabled={busy || undefined}>
          {busy ? <Loader2 size={17} className="adm-spin" aria-hidden="true" /> : <KeyRound size={17} aria-hidden="true" />}
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AdminStateCard>
  );
}

export function NotAuthorizedPanel({ email, onSignOut }: { email?: string | null; onSignOut: () => void }) {
  return (
    <AdminStateCard kicker="Not authorized" kickerTone="coral" icon={<ShieldAlert size={15} aria-hidden="true" />} title="This account can’t edit the site">
      {email ? (
        <p className="adm-lead">
          Signed in as <strong>{email}</strong>.
        </p>
      ) : null}
      <p className="adm-muted">
        The account is not on the admin allowlist. Sign out and use the admin account, or add this account&apos;s UID to NEXT_PUBLIC_ADMIN_UID and to the Firebase rules.
      </p>
      <button type="button" className="brutal-button brutal-button--secondary adm-mt-4" onClick={onSignOut}>
        <LogOut size={17} aria-hidden="true" />
        Sign out
      </button>
    </AdminStateCard>
  );
}
