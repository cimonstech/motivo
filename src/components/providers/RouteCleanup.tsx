"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap }          from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Kills GSAP on every route change.
 * Mounted once in the root layout.
 */
export function RouteCleanup() {
  const pathname = usePathname();

  useEffect(() => {
    // On every route change, clean up previous page's GSAP state
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill(true));
      ScrollTrigger.clearScrollMemory();
      gsap.globalTimeline.clear();
    };
  }, [pathname]);

  return null;
}
