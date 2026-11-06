/**
 * flowLinesEngine.ts
 * A bundle of thin lines that flow like a ribbon of silk and bend toward the pointer.
 * Canvas 2D, no dependencies. Works in plain pages and inside a React/Next.js client component.
 *
 * The canvas is meant to sit BEHIND content (pointer-events: none), so the pointer
 * is read from the window and mapped onto the canvas.
 */

export interface FlowLinesOptions {
  color?: string; // line colour, hex. Default #ED1C24
  background?: string | null; // fill colour, hex, or null for transparent. Default null
  lineCount?: number; // default 18
  amplitude?: number; // wave height as a fraction of canvas height. Default 0.14
  centerY?: number; // vertical centre of the bundle, 0 (top) to 1 (bottom). Default 0.52
  speed?: number; // flow speed multiplier. Default 1
  lineWidth?: number; // CSS px. Default 1
  flatStart?: number; // 0 to 1: how far from the left the lines stay flat. Default 0.12
  pointerRadius?: number; // CSS px of pointer influence. Default 260
  pointerPull?: number; // 0 to 1: how strongly lines bend toward the pointer. Default 0.55
  interactive?: boolean; // default true
  staticFrame?: boolean; // draw one frame and stop (use for reduced motion). Default false
}

export interface FlowLinesEngine {
  setColor(color: string): void;
  setOptions(next: Partial<FlowLinesOptions>): void;
  destroy(): void;
}

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.trim().replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  if (Number.isNaN(n) || h.length !== 6) return [237, 28, 36];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function smoothstep(a: number, b: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function createFlowLines(
  canvas: HTMLCanvasElement,
  options: FlowLinesOptions = {},
): FlowLinesEngine | null {
  const maybeCtx = canvas.getContext("2d");
  if (!maybeCtx) return null;
  const ctx: CanvasRenderingContext2D = maybeCtx;

  const opts: Required<Omit<FlowLinesOptions, "background">> & { background: string | null } = {
    color: "#ED1C24",
    background: null,
    lineCount: 18,
    amplitude: 0.14,
    centerY: 0.52,
    speed: 1,
    lineWidth: 1,
    flatStart: 0.12,
    pointerRadius: 260,
    pointerPull: 0.55,
    interactive: true,
    staticFrame: false,
    ...options,
  };
  let rgb = hexToRgb(opts.color);

  let W = 0;
  let H = 0;
  let dpr = 1;
  function resize(): void {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, canvas.clientWidth);
    H = Math.max(1, canvas.clientHeight);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
  }
  resize();

  const pointer = { x: -9999, y: 0, sx: -9999, sy: 0, strength: 0, energy: 0, inside: false };
  let lastMove = { x: 0, y: 0, t: 0 };

  function onPointerMove(e: PointerEvent): void {
    if (!opts.interactive) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const inside = x >= -40 && y >= -40 && x <= rect.width + 40 && y <= rect.height + 40;
    pointer.inside = inside;
    if (!inside) return;
    const now = performance.now();
    if (pointer.sx < -1000) {
      pointer.sx = x;
      pointer.sy = y;
    }
    const dt = Math.max(16, now - lastMove.t);
    const v = Math.hypot(x - lastMove.x, y - lastMove.y) / dt;
    pointer.energy = Math.min(1.6, pointer.energy + v * 0.35);
    lastMove = { x, y, t: now };
    pointer.x = x;
    pointer.y = y;
    kick();
  }
  function onPointerLeave(): void {
    pointer.inside = false;
  }
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("pointerleave", onPointerLeave);
  window.addEventListener("blur", onPointerLeave);

  const STEP = 6;
  let time = 0;

  function draw(): void {
    const { lineCount, amplitude, centerY, flatStart, pointerRadius, pointerPull } = opts;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (opts.background) {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = opts.background;
      ctx.fillRect(0, 0, W, H);
    } else {
      ctx.clearRect(0, 0, W, H);
    }
    ctx.globalCompositeOperation = "lighter";
    ctx.lineWidth = opts.lineWidth;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    const cy = H * centerY;
    const amp = H * amplitude;
    const sigma2 = 2 * pointerRadius * pointerRadius;
    const pull = pointer.strength * pointerPull;
    const wobble = pointer.energy;
    const n = Math.max(2, lineCount);

    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const spread = 0.35 + 0.65 * t;
      const phase = t * 1.35;
      const lead = i === 0 || i === Math.round(n * 0.55);
      const alpha = lead ? 0.9 : 0.12 + 0.22 * (1 - Math.abs(t - 0.5) * 1.4);

      ctx.beginPath();
      let prevX = 0;
      let prevY = cy;
      for (let x = 0; x <= W + STEP; x += STEP) {
        const u = x / W;
        const env = smoothstep(flatStart, flatStart + 0.45, u);
        const wave =
          Math.sin(u * 6.2 - time * 0.55 + phase) * 0.62 +
          Math.sin(u * 2.6 + time * 0.33 - phase * 0.7) * 0.38 +
          Math.sin(u * 11.0 - time * 0.9 + phase * 2.1) * 0.08;
        let y = cy + env * amp * spread * wave;

        if (pull > 0.001 || wobble > 0.001) {
          const dx = x - pointer.sx;
          const g = Math.exp(-(dx * dx) / sigma2);
          if (g > 0.002) {
            const towards = (pointer.sy - y) * pull * g * (0.55 + 0.45 * (1 - t));
            const ripple = Math.sin(dx * 0.022 - time * 5 + phase * 2) * wobble * 18 * g * spread;
            y += towards + ripple;
          }
        }

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          const mx = (prevX + x) / 2;
          const my = (prevY + y) / 2;
          ctx.quadraticCurveTo(prevX, prevY, mx, my);
        }
        prevX = x;
        prevY = y;
      }
      ctx.lineTo(prevX, prevY);
      ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha.toFixed(3)})`;
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
  }

  let raf = 0;
  let visible = true;
  let destroyed = false;
  let last = performance.now();

  function frame(now: number): void {
    raf = 0;
    if (destroyed || !visible) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt * opts.speed;

    const follow = 1 - Math.pow(0.0008, dt);
    if (pointer.sx > -1000) {
      pointer.sx += (pointer.x - pointer.sx) * follow;
      pointer.sy += (pointer.y - pointer.sy) * follow;
    }
    const target = pointer.inside ? 1 : 0;
    pointer.strength += (target - pointer.strength) * (1 - Math.pow(0.02, dt));
    pointer.energy *= Math.pow(0.08, dt);

    draw();
    raf = requestAnimationFrame(frame);
  }
  function kick(): void {
    if (opts.staticFrame) {
      draw();
      return;
    }
    if (!raf && visible && !destroyed) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }

  const io = new IntersectionObserver((entries) => {
    visible = entries.some((en) => en.isIntersecting);
    if (visible) kick();
  });
  io.observe(canvas);

  const ro = new ResizeObserver(() => {
    resize();
    draw();
  });
  ro.observe(canvas);

  draw();
  kick();

  return {
    setColor(color: string) {
      opts.color = color;
      rgb = hexToRgb(color);
      draw();
    },
    setOptions(next) {
      Object.assign(opts, next);
      if (next.color) rgb = hexToRgb(next.color);
      draw();
      kick();
    },
    destroy() {
      destroyed = true;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
    },
  };
}
