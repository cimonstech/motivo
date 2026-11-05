"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SCRIMS, WALLPAPERS, type WindowId } from "./os-hero.data";
import { DesktopIcons } from "./DesktopIcons";
import { Dock } from "./Dock";
import { FolderWindow } from "./FolderWindow";
import { MenuBar } from "./MenuBar";
import { MobileOsHero } from "./MobileOsHero";
import { OsNavGate } from "./OsNavGate";
import { ReadmeWindow } from "./ReadmeWindow";
import { SceneSwitcher } from "./SceneSwitcher";
import styles from "./os-hero.module.css";

const SCENE_KEY = "motivo-os-scene";

type IdleHost = Window & {
  requestIdleCallback?: (callback: () => void) => number;
  cancelIdleCallback?: (id: number) => void;
};

function rememberScene(index: number) {
  try {
    sessionStorage.setItem(SCENE_KEY, String(index));
  } catch {
    /* private mode */
  }
}

function chooseScene(): number {
  const count = WALLPAPERS.length;
  let last = -1;
  try {
    const raw = sessionStorage.getItem(SCENE_KEY);
    if (raw !== null) {
      const parsed = Number(raw);
      if (Number.isInteger(parsed) && parsed >= 0 && parsed < count) last = parsed;
    }
  } catch {
    last = -1;
  }
  const pool = Array.from({ length: count }, (_, index) => index).filter((index) => index !== last);
  const next = pool[Math.floor(Math.random() * pool.length)] ?? 0;
  rememberScene(next);
  return next;
}

export function OsHero() {
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState(0);
  const [sceneReady, setSceneReady] = useState(false);
  const [openId, setOpenId] = useState<WindowId | null>("branding");
  const [leaving, setLeaving] = useState(false);
  const nextId = useRef<WindowId | null>("branding");

  function chooseWindow(id: WindowId | null) {
    if (leaving) {
      nextId.current = id;
      return;
    }
    if (openId === id) return;
    if (openId) {
      nextId.current = id;
      setLeaving(true);
      return;
    }
    nextId.current = id;
    setOpenId(id);
  }

  function finishWindow() {
    setLeaving(false);
    setOpenId(nextId.current);
  }
  const [wallsReady, setWallsReady] = useState(false);

  useEffect(() => {
    const next = chooseScene();
    const timer = window.setTimeout(() => {
      setScene(next);
      setSceneReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const host = window as IdleHost;
    if (typeof host.requestIdleCallback === "function") {
      const id = host.requestIdleCallback(() => setWallsReady(true));
      return () => host.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setWallsReady(true), 400);
    return () => window.clearTimeout(id);
  }, []);

  const pickScene = (index: number) => {
    setWallsReady(true);
    setScene(index);
    setSceneReady(true);
    rememberScene(index);
  };

  return (
    <section ref={heroRef} className={styles.hero} data-os-hero-frame aria-label="Motivo OS">
      <OsNavGate />
      <div aria-hidden="true">
        {sceneReady
          ? WALLPAPERS.map((src, index) => {
              if (index !== scene && !wallsReady) return null;
              return (
                <div
                  key={src}
                  className={styles.wallpaper}
                  style={{ opacity: scene === index ? 1 : 0 }}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    priority={index === scene}
                    sizes="100vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              );
            })
          : null}
        <div
          className={styles.scrim}
          style={{ background: `rgba(8, 8, 8, ${sceneReady ? SCRIMS[scene] : 0.35})` }}
        />
      </div>
      <div ref={stageRef} className={styles.stage}>
        <MenuBar />
        <MobileOsHero
          scene={scene}
          wallsReady={wallsReady}
          onNext={() => pickScene((scene + 1) % WALLPAPERS.length)}
          onPick={pickScene}
        >
          <ReadmeWindow />
        </MobileOsHero>
        <DesktopIcons
          openId={openId}
          onOpen={(id) => chooseWindow(openId === id ? null : id)}
        />
        {openId ? (
          <FolderWindow
            key={openId}
            id={openId}
            heroRef={stageRef}
            leaving={leaving}
            onClose={() => chooseWindow(null)}
            onLeft={finishWindow}
          />
        ) : null}
        <SceneSwitcher
          scene={scene}
          wallsReady={wallsReady}
          placement="desktop"
          onNext={() => pickScene((scene + 1) % WALLPAPERS.length)}
          onPick={pickScene}
        />
        <Dock onOpenWork={() => chooseWindow("work")} />
      </div>
    </section>
  );
}
