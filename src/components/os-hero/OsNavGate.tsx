"use client";

import { useEffect } from "react";

function setHeroActive(active: boolean) {
  if (active) document.body.setAttribute("data-os-hero", "active");
  else document.body.removeAttribute("data-os-hero");
}

export function OsNavGate() {
  useEffect(() => {
    const el = document.querySelector("[data-os-hero-frame]");
    if (!(el instanceof HTMLElement)) return;

    const sync = () => {
      const rect = el.getBoundingClientRect();
      setHeroActive(rect.bottom > 0 && rect.top < window.innerHeight);
    };

    sync();
    const observer = new IntersectionObserver(([entry]) => {
      setHeroActive(entry?.isIntersecting ?? false);
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      document.body.removeAttribute("data-os-hero");
    };
  }, []);

  return null;
}
