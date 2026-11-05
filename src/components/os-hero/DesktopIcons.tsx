"use client";

import { ACCENT, DESKTOP_ICONS, TAG_IDLE, type WindowId } from "./os-hero.data";
import { FileGlyph, FolderGlyph } from "./icons";
import styles from "./os-hero.module.css";

export function DesktopIcons({
  openId,
  onOpen,
}: {
  openId: WindowId | null;
  onOpen: (id: WindowId) => void;
}) {
  return (
    <div className={`${styles.icons} ${styles.desktopOnly}`}>
      {DESKTOP_ICONS.map((icon) => {
        const open = openId === icon.id;
        const tag = open ? ACCENT : TAG_IDLE;
        return (
          <button
            key={icon.id}
            type="button"
            className={styles.iconButton}
            data-os-icon={icon.id}
            aria-label={`Open ${icon.name}`}
            aria-pressed={open}
            onClick={() => onOpen(icon.id)}
          >
            <span className={styles.iconSvg}>
              {icon.kind === "folder" ? <FolderGlyph tag={tag} large /> : <FileGlyph tag={tag} />}
            </span>
            <span className={`${styles.iconLabel} ${styles.glassSoft} ${open ? styles.iconLabelActive : ""}`}>
              {icon.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
