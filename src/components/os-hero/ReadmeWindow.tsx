"use client";

import { ArrowPill } from "@/components/ui/ArrowPill";
import styles from "./os-hero.module.css";

export function ReadmeWindow() {
  return (
    <section className={`${styles.readme} ${styles.glass}`} aria-labelledby="os-hero-title">
      <div className={styles.titleBar}>
        <span className={styles.barLabel}>
          <span className={styles.mark} aria-hidden="true" />
          readme.txt
        </span>
        <span className={styles.desktopOnly}>Motivo Studio · Accra, Ghana</span>
      </div>
      <div className={styles.body}>
        <h1 id="os-hero-title" className={styles.headline}>
          We build brands that look expensive and perform like assets.
        </h1>
        <p className={`${styles.lede} ${styles.desktopOnly}`}>
          A design and production studio turning ideas into brands, digital platforms and physical experiences that command attention.
        </p>
        <p className={`${styles.lede} ${styles.mobileOnly}`}>
          Brands, digital platforms and physical experiences that command attention.
        </p>
        <div className={styles.actions}>
          <ArrowPill href="/contact" block filled>
            Book a Project Slot
          </ArrowPill>
          <span className={styles.desktopOnly}>
            <ArrowPill href="/work" tone="light" filled>
              View Selected Work
            </ArrowPill>
          </span>
        </div>
        <div className={styles.stats}>
          <span className={styles.stat}>
            <strong>40+</strong> brands built
          </span>
          <span className={styles.stat}>
            <strong>4</strong> disciplines, one studio
          </span>
        </div>
      </div>
    </section>
  );
}
