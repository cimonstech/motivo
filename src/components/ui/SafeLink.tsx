"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { killAllScrollTriggers } from "@/lib/scrollTrigger";

interface SafeLinkProps extends React.ComponentProps<typeof Link> {
  /** When true, kills ScrollTrigger before navigating (for links away from home) */
  killScrollTrigger?: boolean;
}

/**
 * Link wrapper that kills ScrollTrigger before client-side navigation.
 * Use when linking away from the homepage to prevent removeChild DOM errors.
 */
export function SafeLink({
  href,
  killScrollTrigger,
  onClick,
  ...props
}: SafeLinkProps) {
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Kill ScrollTrigger when navigating away from homepage (prevents pin/unpin DOM conflicts)
    if (killScrollTrigger ?? (pathname === "/" && href !== "/")) {
      killAllScrollTriggers();
    }
    onClick?.(e);
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
