import type { NextConfig } from "next";

/**
 * Security headers applied to every response. These are deliberately
 * conservative but compatible with the app:
 *  - HSTS (only meaningful over HTTPS in production)
 *  - clickjacking + MIME-sniffing protection
 *  - a Content-Security-Policy that allows the app's own assets and the
 *    configured Supabase origin for API/websocket calls.
 *
 * Note: 'unsafe-inline' for styles is required by Tailwind's injected styles;
 * script 'unsafe-inline' is kept for Next's runtime. For a stricter CSP, move to
 * nonce-based scripts via Proxy (see docs/security.md).
 */
const supabaseOrigin = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin
      : "";
  } catch {
    return "";
  }
})();

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' https://fonts.gstatic.com data:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  `connect-src 'self' ${supabaseOrigin} ${supabaseOrigin.replace("https://", "wss://")}`.trim(),
  "frame-src 'self' https://www.google.com https://maps.google.com",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
