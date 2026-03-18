/**
 * Security utilities for API routes.
 */

/** Escape HTML to prevent XSS when interpolating into HTML/attributes */
export function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Basic email validation - format and length */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LEN = 254;

export function isValidEmail(email: unknown): email is string {
  if (typeof email !== "string") return false;
  const trimmed = email.trim();
  return trimmed.length <= MAX_EMAIL_LEN && EMAIL_REGEX.test(trimmed);
}

/** Sanitize string for safe display - max length, trim */
export function sanitizeString(s: unknown, maxLen: number): string {
  if (typeof s !== "string") return "";
  return String(s).trim().slice(0, maxLen);
}

/** Check request Origin/Referer against allowed origins */
const ALLOWED_ORIGINS = [
  "https://thisismotivo.com",
  "https://www.thisismotivo.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

export function isAllowedOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const url = origin ?? referer ?? "";
  try {
    const host = new URL(url).origin;
    return ALLOWED_ORIGINS.some((o) => host === o);
  } catch {
    return false;
  }
}
