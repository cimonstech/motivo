"use client";

import { useRef, useState } from "react";
import { type WindowId } from "./os-hero.data";
import { DesktopIcons } from "./DesktopIcons";
import { Dock } from "./Dock";
import { FlowBackground } from "./FlowBackground";
import { FolderWindow } from "./FolderWindow";
import { MenuBar } from "./MenuBar";
import { MobileOsHero } from "./MobileOsHero";
import { OsNavGate } from "./OsNavGate";
import { ReadmeWindow } from "./ReadmeWindow";
import styles from "./os-hero.module.css";

export function OsHero() {
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
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

  return (
    <section ref={heroRef} className={styles.hero} data-os-hero-frame aria-label="Motivo OS">
      <OsNavGate />
      <FlowBackground />
      <div ref={stageRef} className={styles.stage}>
        <MenuBar />
        <MobileOsHero>
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
        <Dock onOpenWork={() => chooseWindow("work")} />
      </div>
    </section>
  );
}
