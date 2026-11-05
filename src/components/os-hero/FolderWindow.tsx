"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { WINDOWS, type WindowId } from "./os-hero.data";
import { ArrowPill } from "@/components/ui/ArrowPill";
import { CloseIcon, PlayIcon } from "./icons";
import { useDrag } from "./useDrag";
import styles from "./os-hero.module.css";

function RoroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const pending = el.play();
    if (pending) pending.catch(() => undefined);
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        className={styles.mediaAsset}
        src="/os/projects/roro.mp4"
        muted
        loop
        playsInline
        preload="auto"
        aria-label="Roro Luxury Fittings website preview"
      />
      <button
        type="button"
        className={styles.play}
        data-started={started ? "true" : "false"}
        aria-label="Play Roro Luxury Fittings preview"
        onClick={() => {
          const el = videoRef.current;
          if (!el) return;
          el.muted = true;
          const pending = el.play();
          if (pending) pending.catch(() => undefined);
          setStarted(true);
        }}
      >
        <PlayIcon />
      </button>
    </>
  );
}

type Shift = { x: number; y: number; scale: number };

const FLOW_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

function folderShift(win: HTMLElement, id: WindowId): Shift | null {
  const icon = document.querySelector(`[data-os-icon="${id}"] .${styles.iconSvg}`);
  if (!icon) return null;
  const raw = getComputedStyle(win).transform;
  const matrix = raw && raw !== "none" ? new DOMMatrix(raw) : new DOMMatrix();
  const scaleX = matrix.a || 1;
  const scaleY = matrix.d || 1;
  const visual = win.getBoundingClientRect();
  const layoutW = visual.width / scaleX;
  const layoutH = visual.height / scaleY;
  const layoutLeft = visual.left - matrix.e - (layoutW - visual.width) / 2;
  const layoutTop = visual.top - matrix.f - (layoutH - visual.height) / 2;
  const iconRect = icon.getBoundingClientRect();
  if (layoutW < 8 || iconRect.width < 2) return null;
  return {
    x: iconRect.left + iconRect.width / 2 - (layoutLeft + layoutW / 2),
    y: iconRect.top + iconRect.height / 2 - (layoutTop + layoutH / 2),
    scale: Math.min(0.22, Math.max(0.08, iconRect.width / layoutW)),
  };
}

function shiftTransform(shift: Shift) {
  return `translate3d(${shift.x}px, ${shift.y}px, 0) scale(${shift.scale})`;
}

export function FolderWindow({
  id,
  heroRef,
  leaving,
  onClose,
  onLeft,
}: {
  id: WindowId;
  heroRef: RefObject<HTMLElement | null>;
  leaving: boolean;
  onClose: () => void;
  onLeft: () => void;
}) {
  const windowRef = useRef<HTMLElement>(null);
  const onLeftRef = useRef(onLeft);
  const reduceRef = useRef(false);
  const leavingRef = useRef(leaving);
  const animRef = useRef<Animation | null>(null);
  const { placed, offset, grabbing, onPointerDown } = useDrag(heroRef, windowRef);
  const [settled, setSettled] = useState(false);
  const win = WINDOWS[id];

  useEffect(() => {
    onLeftRef.current = onLeft;
    leavingRef.current = leaving;
  }, [onLeft, leaving]);

  useLayoutEffect(() => {
    const node = windowRef.current;
    reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!node || reduceRef.current) {
      const frame = window.requestAnimationFrame(() => setSettled(true));
      return () => window.cancelAnimationFrame(frame);
    }
    const next = folderShift(node, id);
    if (!next) {
      const frame = window.requestAnimationFrame(() => setSettled(true));
      return () => window.cancelAnimationFrame(frame);
    }
    const anim = node.animate(
      [
        { transform: shiftTransform(next), opacity: 1 },
        { transform: "translate3d(0px, 0px, 0px) scale(1)", opacity: 1 },
      ],
      { duration: 520, easing: FLOW_EASE, fill: "both" },
    );
    animRef.current = anim;
    anim.onfinish = () => {
      if (animRef.current === anim) animRef.current = null;
      anim.cancel();
      if (!leavingRef.current) setSettled(true);
    };
    return () => {
      anim.cancel();
      if (animRef.current === anim) animRef.current = null;
    };
  }, [id]);

  useEffect(() => {
    if (!leaving) return;
    const node = windowRef.current;
    if (!node || reduceRef.current) {
      onLeftRef.current();
      return;
    }
    const from = getComputedStyle(node).transform;
    const next = folderShift(node, id);
    animRef.current?.cancel();
    if (!next) {
      onLeftRef.current();
      return;
    }
    const anim = node.animate(
      [
        {
          transform: from && from !== "none" ? from : "translate3d(0px, 0px, 0px) scale(1)",
          opacity: 1,
        },
        { transform: shiftTransform(next), opacity: 1 },
      ],
      { duration: 480, easing: FLOW_EASE, fill: "forwards" },
    );
    animRef.current = anim;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      onLeftRef.current();
    };
    anim.onfinish = finish;
    const timer = window.setTimeout(finish, 560);
    return () => {
      done = true;
      window.clearTimeout(timer);
      anim.cancel();
      if (animRef.current === anim) animRef.current = null;
    };
  }, [leaving, id]);

  return (
    <section
      ref={windowRef}
      className={`${styles.window} ${styles.glass} ${styles.desktopOnly}`}
      aria-label={`${win.title} window`}
      style={{
        ...(placed ? { left: `${placed.x}px`, top: `${placed.y}px` } : {}),
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        pointerEvents: settled && !leaving ? undefined : "none",
      }}
    >
      <div
        className={`${styles.dragBar} ${grabbing ? styles.dragBarGrabbing : ""}`}
        onPointerDown={settled && !leaving ? onPointerDown : undefined}
        title="Drag to move"
      >
        <span className={styles.barLabel}>
          <span className={`${styles.mark} ${styles.markLarge}`} aria-hidden="true" />
          Motivo / {win.title}
        </span>
        <span className={styles.dragHint}>
          <svg width="10" height="16" viewBox="0 0 10 16" aria-hidden="true">
            <circle cx="2" cy="2.5" r="1.15" fill="currentColor" />
            <circle cx="8" cy="2.5" r="1.15" fill="currentColor" />
            <circle cx="2" cy="8" r="1.15" fill="currentColor" />
            <circle cx="8" cy="8" r="1.15" fill="currentColor" />
            <circle cx="2" cy="13.5" r="1.15" fill="currentColor" />
            <circle cx="8" cy="13.5" r="1.15" fill="currentColor" />
          </svg>
          Drag
        </span>
        <button type="button" className={`${styles.close} ${styles.closeSlot}`} aria-label="Close window" onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
      <div className={styles.windowBody}>
        <div className={styles.media}>
          {win.media.kind === "image" ? (
            <Image
              src={win.media.src}
              alt={win.media.alt}
              fill
              sizes="(min-width: 1024px) 348px, 100vw"
              className={styles.mediaAsset}
            />
          ) : null}
          {win.media.kind === "video" ? <RoroVideo /> : null}
          {win.media.kind === "placeholder" ? (
            <div className={styles.placeholder}>{win.media.label}</div>
          ) : null}
        </div>
        <div className={styles.copyBlock}>
          <h2 className={styles.windowTitle}>{win.title}</h2>
          <p className={styles.windowCopy}>{win.description}</p>
        </div>
        <ArrowPill href={win.href} filled>{win.cta}</ArrowPill>
      </div>
    </section>
  );
}
