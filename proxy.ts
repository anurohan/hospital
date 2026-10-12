import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy (formerly Middleware in Next < 16). This performs ONLY optimistic,
 * cookie-presence redirects — it never hits the database. Authoritative
 * authorization (role checks, data access) happens server-side in each
 * protected layout via lib/auth/session (requireRole) and is backed by RLS.
 *
 * We only check whether a session cookie EXISTS to bounce obviously-anonymous
 * requests to /login early. A present-but-invalid cookie is still fully
 * re-validated by the DAL on the page itself.
 */
const PROTECTED_PREFIXES = ["/portal", "/reception", "/doctor", "/admin"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get("sb-access-token")?.value);

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (isProtected && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/reception/:path*", "/doctor/:path*", "/admin/:path*"],
};
