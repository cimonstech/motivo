import { gsap }          from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Kills all GSAP animations and ScrollTriggers before navigating.
 * Prevents removeChild errors from Three.js / GSAP pin spacers.
 */
export function safeNavigate(
  url: string,
  router: { push: (url: string) => void }
) {
  try {
    ScrollTrigger.getAll().forEach((t) => t.kill(true));
    ScrollTrigger.clearScrollMemory();
    gsap.globalTimeline.clear();
  } catch {
    // pin spacer already removed — safe to ignore
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      router.push(url);
    });
  });
}
