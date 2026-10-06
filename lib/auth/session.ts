import { cookies } from "next/headers";
import { verifyAdminToken, type AdminSessionPayload } from "@/lib/auth/jwt";

export const SESSION_COOKIE_NAME = "qg_admin_session";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

/**
 * Reads and verifies the admin session from the httpOnly cookie. Safe to
 * call from Server Components, Route Handlers, and Server Actions.
 * Returns null if there's no cookie or the token is invalid/expired.
 */
export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  // Next.js 15+ made cookies() return a Promise (previously synchronous).
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}
