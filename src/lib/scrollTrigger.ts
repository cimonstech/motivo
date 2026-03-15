/**
 * Kills all ScrollTrigger instances. Call before client-side navigation
 * away from the homepage to prevent "removeChild" DOM errors when
 * pinned sections (Hero, Services) unmount.
 */
export function killAllScrollTriggers(): void {
  if (typeof window === "undefined") return;
  try {
    const { ScrollTrigger } = require("gsap/ScrollTrigger");
    ScrollTrigger.killAll();
  } catch {
    // GSAP may not be loaded
  }
}
