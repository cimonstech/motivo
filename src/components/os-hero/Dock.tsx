"use client";

import { ArrowPill } from "@/components/ui/ArrowPill";
import { MAIL_HREF, WHATSAPP_HREF } from "./os-hero.data";
import { AboutIcon, HomeIcon, MailIcon, WhatsAppIcon, WorksIcon } from "./icons";
import { OsAnchor } from "./OsAnchor";
import styles from "./os-hero.module.css";

export function Dock({ onOpenWork }: { onOpenWork: () => void }) {
  return (
    <nav className={`${styles.dock} ${styles.glass} ${styles.desktopOnly}`} aria-label="Dock">
      <OsAnchor href="/" className={styles.dockItem} ariaLabel="Home" title="Home">
        <HomeIcon />
      </OsAnchor>
      <button
        type="button"
        className={styles.dockItem}
        aria-label="Our works"
        title="Our works"
        onClick={onOpenWork}
      >
        <WorksIcon />
      </button>
      <OsAnchor href="/about" className={styles.dockItem} ariaLabel="About" title="About">
        <AboutIcon />
      </OsAnchor>
      <OsAnchor href={MAIL_HREF} className={styles.dockItem} ariaLabel="Contact by email" title="Email">
        <MailIcon />
      </OsAnchor>
      <OsAnchor href={WHATSAPP_HREF} className={styles.dockItem} ariaLabel="Chat on WhatsApp" title="WhatsApp">
        <WhatsAppIcon />
      </OsAnchor>
      <span className={styles.dockDivider} aria-hidden="true" />
      <ArrowPill href="/contact" filled>Start a project</ArrowPill>
    </nav>
  );
}
