import { R2_BASE } from "./constants";

/**
 * Returns the full Cloudflare R2 URL for a given asset path.
 * Usage: r2("work/fidelity-strip.jpg")
 * Returns: "https://assets.motivo.studio/work/fidelity-strip.jpg"
 */
/** Placeholder when R2 is not configured (e.g. local dev without env) */
const FALLBACK_IMAGE = "/og-image.jpg";

export function r2(path: string): string {
  const cleanPath = path.replace(/^\/+/, "");
  if (R2_BASE) return `${R2_BASE}/${cleanPath}`;
  return FALLBACK_IMAGE;
}
