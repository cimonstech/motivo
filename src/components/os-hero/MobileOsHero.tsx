"use client";

import type { ReactNode } from "react";
import { ArrowPill } from "@/components/ui/ArrowPill";
import { MOBILE_TILES, NEXT_SLOT, WHATSAPP_HREF } from "./os-hero.data";
import { AboutIcon, FolderGlyph, MotivoMark, WhatsAppIcon, WorksIcon } from "./icons";
import { OsAnchor } from "./OsAnchor";
import { SceneSwitcher } from "./SceneSwitcher";
import styles from "./os-hero.module.css";

export function MobileOsHero({
  scene,
  wallsReady,
  onNext,
  onPick,
  children,
}: {
  scene: number;
  wallsReady: boolean;
  onNext: () => void;
  onPick: (index: number) => void;
  children: ReactNode;
}) {
  return (
    <>
      <header className={`${styles.mobileHeader} ${styles.mobileOnly}`}>
        <OsAnchor href="/" ariaLabel="Motivo home">
          <MotivoMark width={84} height={22} />
        </OsAnchor>
        <span className={styles.mobileBooking}>
          <span className={styles.dot} aria-hidden="true" />
          Booking: {NEXT_SLOT}
        </span>
      </header>
      {children}
      <SceneSwitcher
        scene={scene}
        wallsReady={wallsReady}
        placement="mobile"
        onNext={onNext}
        onPick={onPick}
      />
      <div className={`${styles.tiles} ${styles.mobileOnly}`}>
        {MOBILE_TILES.map((tile) => (
          <OsAnchor key={tile.name} href={tile.href} className={styles.tile}>
            <FolderGlyph tag="#8A877E" />
            <span className={styles.tileLabel}>{tile.name}</span>
          </OsAnchor>
        ))}
      </div>
      <nav className={`${styles.mobileDock} ${styles.glass} ${styles.mobileOnly}`} aria-label="Dock">
        <OsAnchor href="/work" className={styles.dockItem} ariaLabel="Our works">
          <WorksIcon small />
        </OsAnchor>
        <OsAnchor href="/about" className={styles.dockItem} ariaLabel="About">
          <AboutIcon small />
        </OsAnchor>
        <OsAnchor href={WHATSAPP_HREF} className={styles.dockItem} ariaLabel="Chat on WhatsApp">
          <WhatsAppIcon small />
        </OsAnchor>
        <ArrowPill href="/contact" grow filled>
          Start a project
        </ArrowPill>
      </nav>
    </>
  );
}
