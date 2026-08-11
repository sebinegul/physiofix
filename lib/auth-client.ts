/**
 * Client-side auth helpers.
 *
 * The JWT lives ONLY in an HttpOnly cookie set by the server (login/register/
 * logout routes). It is never stored in localStorage, so it cannot be stolen
 * by XSS. The client learns the current user via GET /api/auth/me.
 */

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string | null;
}

/**
 * Fetch the currently-authenticated user from the server.
 * Returns null when not logged in, the token is invalid/revoked, or the
 * request fails. The HttpOnly cookie is sent automatically.
 */
export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  try {
    const res = await fetch("/api/auth/me", { credentials: "same-origin" });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json?.user) return null;
    const u = json.user;
    return {
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      phone: u.phone ?? null,
    };
  } catch {
    return null;
  }
}

/** True when a valid session exists (server-verified). */
export async function isAuthenticated(): Promise<boolean> {
  return (await fetchCurrentUser()) !== null;
}

/**
 * Log out: ask the server to revoke the session (bumps tokenVersion, clearing
 * the HttpOnly cookie). Fire-and-forget — the caller redirects immediately.
 */
export function clearAuth() {
  fetch("/api/auth/logout", {
    method: "POST",
    credentials: "same-origin",
  }).catch(() => {});
  window.dispatchEvent(new Event("auth-changed"));
}
