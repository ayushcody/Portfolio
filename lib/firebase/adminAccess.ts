export type AdminAccessResult = {
  configured: boolean;
  allowed: boolean;
  reason: "allowed" | "no-user" | "not-configured" | "not-allowed";
};

function splitEnvList(value: string | undefined, normalize: (item: string) => string = (item) => item) {
  return (value || "")
    .split(",")
    .map((item) => normalize(item.trim()))
    .filter(Boolean);
}

export function getAdminAllowlist(): {
  uids: string[];
  emails: string[];
  configured: boolean;
} {
  const uids = [
    ...splitEnvList(process.env.NEXT_PUBLIC_ADMIN_UID),
    ...splitEnvList(process.env.NEXT_PUBLIC_ADMIN_UIDS),
  ];
  const emails = [
    ...splitEnvList(process.env.NEXT_PUBLIC_ADMIN_EMAIL, (item) => item.toLowerCase()),
    ...splitEnvList(process.env.NEXT_PUBLIC_ADMIN_EMAILS, (item) => item.toLowerCase()),
  ];

  return {
    uids,
    emails,
    configured: uids.length > 0 || emails.length > 0,
  };
}

export function checkAdminAccess(user: { uid?: string | null; email?: string | null } | null): AdminAccessResult {
  const allowlist = getAdminAllowlist();

  if (!allowlist.configured) {
    return {
      configured: false,
      allowed: false,
      reason: "not-configured",
    };
  }

  if (!user) {
    return {
      configured: true,
      allowed: false,
      reason: "no-user",
    };
  }

  const uid = user.uid || "";
  const email = (user.email || "").toLowerCase();
  const allowed = (uid.length > 0 && allowlist.uids.includes(uid)) || (email.length > 0 && allowlist.emails.includes(email));

  return {
    configured: true,
    allowed,
    reason: allowed ? "allowed" : "not-allowed",
  };
}
