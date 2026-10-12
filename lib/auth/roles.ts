import type { UserRole } from "@/types";

/** Landing route for each role after login. */
export const ROLE_HOME: Record<UserRole, string> = {
  patient: "/portal",
  receptionist: "/reception",
  doctor: "/doctor",
  admin: "/admin",
  superadmin: "/admin",
};

/** Route-prefix → roles allowed to access it. Enforced server-side (DAL). */
export const ROUTE_ROLES: { prefix: string; roles: UserRole[] }[] = [
  { prefix: "/portal", roles: ["patient"] },
  { prefix: "/reception", roles: ["receptionist", "admin", "superadmin"] },
  { prefix: "/doctor", roles: ["doctor", "admin", "superadmin"] },
  { prefix: "/admin", roles: ["admin", "superadmin"] },
];

export const STAFF_ROLES: UserRole[] = [
  "receptionist",
  "doctor",
  "admin",
  "superadmin",
];

export function isStaff(role: UserRole | undefined | null): boolean {
  return !!role && STAFF_ROLES.includes(role);
}

export function homeForRole(role: UserRole | undefined | null): string {
  return role ? ROLE_HOME[role] : "/login";
}

/**
 * Normalize and validate a redirect target so the app never issues an absolute
 * or scheme-relative redirect. Only internal app paths are allowed.
 */
export function safeInternalPath(
  value: string | null | undefined,
  fallback = "/portal"
): string {
  const candidate = typeof value === "string" ? value.trim() : "";

  if (!candidate || candidate.includes("\\")) return fallback;

  if (
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(candidate) ||
    candidate.includes("\u0000")
  ) {
    return fallback;
  }

  return candidate || fallback;
}

/** Which protected prefix (if any) a pathname falls under. */
export function matchedRouteRoles(pathname: string): UserRole[] | null {
  const match = ROUTE_ROLES.find(
    (r) => pathname === r.prefix || pathname.startsWith(r.prefix + "/")
  );
  return match ? match.roles : null;
}
