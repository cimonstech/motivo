"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap }          from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function RouteCleanup() {
  const pathname = usePathname();

  // Patch removeChild once to suppress GSAP pin-spacer errors
  useEffect(() => {
    if (typeof window === "undefined") return;
    const original = Node.prototype.removeChild;
    Node.prototype.removeChild = function <T extends Node>(child: T): T {
      if (child.parentNode !== this) {
        return child;
      }
      return original.call(this, child) as T;
    };
    return () => {
      Node.prototype.removeChild = original;
    };
  }, []);

  useEffect(() => {
    return () => {
      try {
        ScrollTrigger.getAll().forEach((t) => t.kill(true));
        ScrollTrigger.clearScrollMemory();
        gsap.globalTimeline.clear();
      } catch {
        // pin spacer already removed
      }
    };
  }, [pathname]);

  return null;
}
