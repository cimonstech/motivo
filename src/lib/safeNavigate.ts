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
  // 1. Kill all ScrollTriggers (removes pin spacers from DOM cleanly)
  ScrollTrigger.getAll().forEach((t) => t.kill(true));
  ScrollTrigger.clearScrollMemory();

  // 2. Kill all running GSAP tweens
  gsap.globalTimeline.clear();

  // 3. Small delay to let React process the cleanup
  //    before the new route starts mounting
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      router.push(url);
    });
  });
}
