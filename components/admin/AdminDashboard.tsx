"use client";

import "./admin.css";
import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { checkAdminAccess } from "@/lib/firebase/adminAccess";
import { auth, isFirebaseConfigured } from "@/lib/firebase/client";
import { AdminConsole } from "./AdminConsole";
import { LoadingPanel, LockedPanel, NotAuthorizedPanel, SetupNeededPanel, SignInPanel } from "./AdminStates";
import { signInError } from "./format";
import { AdminStatusProvider } from "./status";

/**
 * Entry point for /admin. Walks through the gate states (Firebase missing → allowlist missing →
 * session check → sign-in → allowlist check) before showing the console.
 * The allowlist is a UX gate only; Firestore and Storage rules are the security boundary.
 */
export function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const access = useMemo(() => checkAdminAccess(user), [user]);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
    });
  }, []);

  async function handleSignIn(email: string, password: string) {
    if (!auth) return "Firebase is not configured.";
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return null;
    } catch (error) {
      return signInError(error);
    }
  }

  function handleSignOut() {
    if (auth) void signOut(auth);
  }

  let content;
  if (!isFirebaseConfigured) content = <SetupNeededPanel />;
  else if (!access.configured) content = <LockedPanel />;
  else if (!authReady) content = <LoadingPanel />;
  else if (!user) content = <SignInPanel onSignIn={handleSignIn} />;
  else if (!access.allowed) content = <NotAuthorizedPanel email={user.email} onSignOut={handleSignOut} />;
  else
    content = (
      <AdminStatusProvider>
        <AdminConsole account={{ email: user.email, uid: user.uid }} onSignOut={handleSignOut} />
      </AdminStatusProvider>
    );

  return <div className="adm">{content}</div>;
}
