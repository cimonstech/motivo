"use client";

import type { ReactNode } from "react";
import { SafeLink } from "./SafeLink";
import styles from "./arrow-pill.module.css";

function ArrowMark() {
  return (
    <span className={styles.arrow} aria-hidden="true">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 12 12 4M6 4h6v6" />
      </svg>
    </span>
  );
}

type Tone = "brand" | "light";

type Common = {
  children: ReactNode;
  tone?: Tone;
  block?: boolean;
  fill?: boolean;
  grow?: boolean;
  compact?: boolean;
  filled?: boolean;
  className?: string;
  disabled?: boolean;
};

type LinkPill = Common & {
  href: string;
  onClick?: never;
};

type ButtonPill = Common & {
  href?: undefined;
  onClick: () => void;
};

export function ArrowPill({
  children,
  tone = "brand",
  block = false,
  fill = false,
  grow = false,
  compact = false,
  filled = false,
  className,
  disabled = false,
  ...rest
}: LinkPill | ButtonPill) {
  const classes = [
    styles.pill,
    tone === "light" ? styles.light : "",
    block ? styles.block : "",
    fill ? styles.fill : "",
    grow ? styles.grow : "",
    compact ? styles.compact : "",
    filled ? styles.filled : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      {children}
      <ArrowMark />
    </>
  );

  if ("href" in rest && rest.href) {
    return (
      <SafeLink href={rest.href} className={classes} aria-disabled={disabled || undefined}>
        {inner}
      </SafeLink>
    );
  }

  return (
    <button type="button" className={classes} onClick={rest.onClick} disabled={disabled}>
      {inner}
    </button>
  );
}
