"use client";

import { MENU_LINKS, NEXT_SLOT } from "./os-hero.data";
import { MotivoMark } from "./icons";
import { OsAnchor } from "./OsAnchor";
import { useAccraClock } from "./useAccraClock";
import styles from "./os-hero.module.css";

export function MenuBar() {
  const clock = useAccraClock();

  return (
    <header className={`${styles.menu} ${styles.desktopOnly}`}>
      <nav className={styles.menuNav} aria-label="Main">
        <OsAnchor href="/" className={styles.brand} ariaLabel="Motivo home">
          <MotivoMark width={76} height={20} />
        </OsAnchor>
        {MENU_LINKS.map((link) => (
          <OsAnchor
            key={link.label}
            href={link.href}
            className={link.emphasis ? styles.menuLinkStrong : styles.menuLink}
          >
            {link.label}
          </OsAnchor>
        ))}
      </nav>
      <div className={styles.menuMeta}>
        <span className={styles.booking}>
          <span className={styles.dot} aria-hidden="true" />
          Booking: {NEXT_SLOT}
        </span>
        <span>Accra</span>
        {clock ? (
          <span className={styles.clock}>
            {clock.dateLabel}&nbsp;&nbsp;{clock.timeLabel}
          </span>
        ) : (
          <span className={styles.clock} aria-hidden="true">
            &nbsp;
          </span>
        )}
      </div>
    </header>
  );
}
