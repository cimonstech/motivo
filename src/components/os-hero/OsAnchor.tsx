"use client";

import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { safeNavigate } from "@/lib/safeNavigate";

type OsAnchorProps = {
  href: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
  title?: string;
};

export function OsAnchor({
  href,
  className,
  children,
  ariaLabel,
  title,
}: OsAnchorProps) {
  const router = useRouter();
  const external = href.startsWith("http");

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("#")) {
      event.preventDefault();
      const target = document.getElementById(href.slice(1));
      if (!target) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      return;
    }
    if (href.startsWith("/")) {
      event.preventDefault();
      safeNavigate(href, router);
    }
  };

  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      title={title}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
