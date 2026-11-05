"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";

type Point = { x: number; y: number };

const MENU_HEIGHT = 40;
const DOCK_CLEARANCE = 132;

type DragSession = {
  pointerId: number;
  startX: number;
  startY: number;
  origX: number;
  origY: number;
};

export function useDrag(
  heroRef: RefObject<HTMLElement | null>,
  windowRef: RefObject<HTMLElement | null>,
) {
  const [placed, setPlaced] = useState<Point | null>(null);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [grabbing, setGrabbing] = useState(false);
  const drag = useRef<DragSession | null>(null);
  const frame = useRef(0);

  useEffect(() => {
    return () => {
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  useEffect(() => {
    if (!grabbing) return;

    const clamp = (clientX: number, clientY: number): Point | null => {
      const current = drag.current;
      const hero = heroRef.current;
      const win = windowRef.current;
      if (!current || !hero || !win) return null;
      const maxX = Math.max(0, hero.clientWidth - win.offsetWidth);
      const maxY = Math.max(MENU_HEIGHT, hero.clientHeight - DOCK_CLEARANCE);
      return {
        x: Math.min(Math.max(current.origX + (clientX - current.startX), 0), maxX),
        y: Math.min(Math.max(current.origY + (clientY - current.startY), MENU_HEIGHT), maxY),
      };
    };

    const onMove = (event: PointerEvent) => {
      const current = drag.current;
      if (!current || event.pointerId !== current.pointerId) return;
      const next = clamp(event.clientX, event.clientY);
      if (!next) return;
      const dx = next.x - current.origX;
      const dy = next.y - current.origY;
      if (frame.current) window.cancelAnimationFrame(frame.current);
      frame.current = window.requestAnimationFrame(() => {
        setOffset({ x: dx, y: dy });
      });
    };

    const finish = (event: PointerEvent) => {
      const current = drag.current;
      if (!current || event.pointerId !== current.pointerId) return;
      const next = clamp(event.clientX, event.clientY);
      drag.current = null;
      if (frame.current) window.cancelAnimationFrame(frame.current);
      if (next) setPlaced(next);
      setOffset({ x: 0, y: 0 });
      setGrabbing(false);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
    };
  }, [grabbing, heroRef, windowRef]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    if (event.target instanceof Element && event.target.closest("button")) return;
    const hero = heroRef.current;
    const win = windowRef.current;
    if (!hero || !win) return;
    const heroRect = hero.getBoundingClientRect();
    const winRect = win.getBoundingClientRect();
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origX: winRect.left - heroRect.left,
      origY: winRect.top - heroRect.top,
    };
    setGrabbing(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  return { placed, offset, grabbing, onPointerDown };
}
