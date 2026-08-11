/**
 * Name of the HttpOnly session cookie set by the auth routes and verified
 * by middleware. Kept in its own module so middleware can import it without
 * pulling in prisma/bcrypt (Edge Runtime constraints).
 */
export const AUTH_COOKIE_NAME = "auth-token";
