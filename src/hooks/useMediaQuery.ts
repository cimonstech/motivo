"use client";
import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  // Use actual value on client (avoids wrong layout on desktop refresh).
  // SSR: assume desktop to avoid hydration mismatch with client.
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
