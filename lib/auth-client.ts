/**
 * Client-side auth helpers.
 * Middleware reads the cookie for route protection;
 * JWT token in localStorage is the single source of truth for user info.
 */

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
  exp?: number;
  iat?: number;
}

const COOKIE_NAME = "auth-token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days, matches JWT expiry

export function setAuthCookie(token: string) {
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function clearAuthCookie() {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}

/**
 * Decode a JWT's payload without verifying the signature.
 * Safe for reading non-sensitive claims (userId, email, role, name);
 * the server always verifies the signature on API calls.
 * Returns null if the token is expired, malformed, or missing.
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonStr = atob(base64);
    const decoded = JSON.parse(jsonStr) as JWTPayload;
    // Reject expired tokens client-side
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Read the token from localStorage and decode it.
 * Returns null if no token is stored or it's expired.
 */
export function getUserFromToken(): JWTPayload | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;
  return decodeToken(token);
}

/**
 * Clear all auth state (token + cookie).
 */
export function clearAuth() {
  localStorage.removeItem("token");
  clearAuthCookie();
  window.dispatchEvent(new Event("auth-changed"));
}
