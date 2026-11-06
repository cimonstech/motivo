"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPuzzle404, type Puzzle404 as PuzzleHandle } from "./puzzle404Engine";

/**
 * The interactive part of the 404 page: the puzzle board, the loose piece and the status line.
 * Solving it sends the visitor to `homeHref`.
 */
export default function Puzzle404({ homeHref = "/" }: { homeHref?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const puzzleRef = useRef<PuzzleHandle | null>(null);
  const [solved, setSolved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    router.prefetch(homeHref);
    const puzzle = createPuzzle404(root, {
      completeDelay: 1100,
      onSolved: () => setSolved(true),
      onComplete: () => router.push(homeHref),
    });
    puzzleRef.current = puzzle;
    return () => {
      puzzle.destroy();
      puzzleRef.current = null;
    };
  }, [homeHref, router]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div ref={rootRef} />
      <div
        aria-live="polite"
        style={{ minHeight: 52, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}
      >
        {solved ? (
          <>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
                fontSize: 15,
                color: "rgba(245,245,240,0.74)",
              }}
            >
              <strong style={{ color: "#F5F5F0" }}>Perfect fit.</strong> Taking you home.
            </p>
            <span
              aria-hidden="true"
              style={{
                width: 140,
                height: 3,
                borderRadius: 3,
                background: "rgba(245,245,240,0.14)",
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  display: "block",
                  height: "100%",
                  background: "#ED1C24",
                  animation: "mv404-progress 1.1s linear forwards",
                }}
              />
            </span>
            <style>{`@keyframes mv404-progress{from{width:0}to{width:100%}}`}</style>
          </>
        ) : (
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
              fontSize: 15,
              color: "rgba(245,245,240,0.74)",
            }}
          >
            Tip: you can also focus the piece with Tab and press Enter.{" "}
            <Link href={homeHref} style={{ color: "#F5F5F0" }}>
              Or skip the puzzle.
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
