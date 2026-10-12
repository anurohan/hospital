/**
 * Cookie names + options shared between the auth route handlers, server actions,
 * and the server Supabase client. The access/refresh tokens are stored in
 * httpOnly cookies that are set ONLY from server code (route handlers / server
 * actions), so client-side JS can never read them (XSS token theft mitigation).
 */
import type { SerializeOptions } from "./types-cookies";

export const ACCESS_COOKIE = "sb-access-token";
export const REFRESH_COOKIE = "sb-refresh-token";

/** 7 days — refresh tokens are long-lived; access token is refreshed as needed. */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export function sessionCookieOptions(maxAge: number = SESSION_MAX_AGE): SerializeOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  };
}
