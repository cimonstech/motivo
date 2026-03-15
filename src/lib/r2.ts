import { R2_BASE } from "./constants";

/**
 * Returns the full Cloudflare R2 URL for a given asset path.
 * Usage: r2("work/fidelity-strip.jpg")
 * Returns: "https://assets.motivo.studio/work/fidelity-strip.jpg"
 */
export function r2(path: string): string {
  const cleanPath = path.replace(/^\/+/, "");
  return R2_BASE ? `${R2_BASE}/${cleanPath}` : `/${cleanPath}`;
}
