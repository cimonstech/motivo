"use client";

import Image from "next/image";
import { WALLPAPERS } from "./os-hero.data";
import { PictureIcon, RefreshIcon } from "./icons";
import styles from "./os-hero.module.css";

export function SceneSwitcher({
  scene,
  wallsReady,
  placement,
  onNext,
  onPick,
}: {
  scene: number;
  wallsReady: boolean;
  placement: "desktop" | "mobile";
  onNext: () => void;
  onPick: (index: number) => void;
}) {
  const sceneNum = scene + 1;
  const mobile = placement === "mobile";

  return (
    <div className={`${styles.sceneRow} ${mobile ? `${styles.sceneRowMobile} ${styles.mobileOnly}` : `${styles.desktopScene} ${styles.desktopOnly}`}`}>
      {mobile ? null : (
        <button
          type="button"
          className={`${styles.sceneButton} ${styles.glass}`}
          aria-label={`Change scene, showing ${sceneNum} of 5`}
          onClick={onNext}
        >
          <PictureIcon />
          Change scene
          <span className={styles.sceneCount}>{sceneNum}/5</span>
        </button>
      )}
      <div className={`${styles.thumbs} ${styles.glassSoft}`} role="group" aria-label="Pick a scene">
        {WALLPAPERS.map((src, index) => {
          const showImage = index === 0 || wallsReady;
          return (
            <button
              key={src}
              type="button"
              className={`${styles.thumb} ${index === scene ? styles.thumbActive : ""}`}
              aria-label={`Scene ${index + 1}`}
              aria-pressed={index === scene}
              onClick={() => onPick(index)}
            >
              {showImage ? (
                <Image src={src} alt="" width={36} height={36} sizes="36px" />
              ) : null}
            </button>
          );
        })}
      </div>
      {mobile ? (
        <button
          type="button"
          className={`${styles.sceneButton} ${styles.glass}`}
          aria-label="Change scene"
          onClick={onNext}
        >
          <RefreshIcon />
          Change
        </button>
      ) : null}
    </div>
  );
}
