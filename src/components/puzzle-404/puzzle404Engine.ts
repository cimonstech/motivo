/**
 * puzzle404Engine.ts
 * A 404 page puzzle: a printed "404" board with one piece missing.
 * Drag the loose piece into the gap (or press Enter on it) to solve it.
 * Framework-free. Builds its own DOM and injects its own styles.
 */

export interface Puzzle404Options {
  /** Called once the piece clicks into place, after `completeDelay` ms. */
  onComplete?: () => void;
  completeDelay?: number; // default 1100
  reducedMotion?: boolean; // default: read from prefers-reduced-motion
  /** Fired immediately when solved, before the delay. */
  onSolved?: () => void;
}

export interface Puzzle404 {
  reset(): void;
  solve(): void;
  destroy(): void;
}

const COLS = 6;
const ROWS = 4;
const CELL = 100;
const W = COLS * CELL;
const H = ROWS * CELL;
const HOLE = { c: 2, r: 1 };
const PAD = 32; // room for tabs around a piece
const P = 'mv404';

const PAPER = '#ECEAE3';
const INK = '#121212';
const RED = '#ED1C24';

/* ---------- geometry ---------- */

// Deterministic random so the board is the same on every visit.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// hEdge[r][c]: edge between row r and r+1 in column c. +1 = tab points down.
// vEdge[r][c]: edge between col c and c+1 in row r. +1 = tab points right.
function makeEdges(): { h: number[][]; v: number[][] } {
  const rand = mulberry32(404);
  const h: number[][] = [];
  const v: number[][] = [];
  for (let r = 0; r < ROWS - 1; r++) h.push(Array.from({ length: COLS }, () => (rand() < 0.5 ? 1 : -1)));
  for (let r = 0; r < ROWS; r++) v.push(Array.from({ length: COLS - 1 }, () => (rand() < 0.5 ? 1 : -1)));
  // Give the missing piece a classic shape: tabs top, left and right, a blank at the bottom.
  const { c, r } = HOLE;
  h[r - 1][c] = -1; // top: tab points up out of the hole piece
  h[r][c] = -1; // bottom: blank
  v[r][c - 1] = -1; // left: tab points left
  v[r][c] = 1; // right: tab points right
  return { h, v };
}

const EDGES = makeEdges();

// Tab outline on a unit edge, v > 0 points out of the piece.
const TAB: Array<[number, number][]> = [
  [[0.35, 0]],
  [[0.42, 0], [0.44, 0.05], [0.4, 0.1]],
  [[0.34, 0.18], [0.37, 0.3], [0.5, 0.3]],
  [[0.63, 0.3], [0.66, 0.18], [0.6, 0.1]],
  [[0.56, 0.05], [0.58, 0], [0.65, 0]],
  [[1, 0]],
];

function edgePath(ax: number, ay: number, bx: number, by: number, sign: number): string {
  if (sign === 0) return `L${bx} ${by}`;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy);
  const nx = (dy / len) * len; // outward normal for a clockwise walk, scaled by edge length
  const ny = (-dx / len) * len;
  const map = ([u, v]: [number, number]): string => {
    const x = ax + u * dx + v * sign * nx;
    const y = ay + u * dy + v * sign * ny;
    return `${x.toFixed(2)} ${y.toFixed(2)}`;
  };
  return TAB.map((seg) => (seg.length === 1 ? `L${map(seg[0])}` : `C${seg.map(map).join(' ')}`)).join('');
}

function piecePath(c: number, r: number): string {
  const x0 = c * CELL;
  const y0 = r * CELL;
  const x1 = x0 + CELL;
  const y1 = y0 + CELL;
  const top = r === 0 ? 0 : -EDGES.h[r - 1][c];
  const bottom = r === ROWS - 1 ? 0 : EDGES.h[r][c];
  const left = c === 0 ? 0 : -EDGES.v[r][c - 1];
  const right = c === COLS - 1 ? 0 : EDGES.v[r][c];
  return (
    `M${x0} ${y0}` +
    edgePath(x0, y0, x1, y0, top) +
    edgePath(x1, y0, x1, y1, right) +
    edgePath(x1, y1, x0, y1, bottom) +
    edgePath(x0, y1, x0, y0, left) +
    'Z'
  );
}

/* ---------- markup ---------- */

const LOGO = `
<circle fill="${RED}" cx="72.08" cy="5.41" r="3.4"/>
<g fill="${INK}">
<path d="M41,4.62A11.84,11.84,0,1,0,52.86,16.46,11.84,11.84,0,0,0,41,4.62ZM41,21.7a5.25,5.25,0,1,1,5.24-5.24A5.24,5.24,0,0,1,41,21.7Z"/>
<polygon points="79.73 6.35 90.83 6.35 85.28 20.09 79.73 6.35"/>
<path d="M102.71,6.29a11.66,11.66,0,0,0-5.55,1.4L91.39,21A11.72,11.72,0,1,0,102.71,6.29Zm0,16.83A5.12,5.12,0,1,1,107.83,18,5.12,5.12,0,0,1,102.71,23.12Z"/>
<path d="M65.91,6.29H49.84a13.78,13.78,0,0,1,4.38,6.37H65.91Z"/>
<path d="M55.93,2.76h0a6.37,6.37,0,0,1,6.37,6.37V20.3a0,0,0,0,1,0,0H55.93a0,0,0,0,1,0,0V2.76A0,0,0,0,1,55.93,2.76Z"/>
<path d="M62,11.13a9.64,9.64,0,1,0,13.23,9H68.85a3.28,3.28,0,0,1-6.55-.06Z"/>
<path d="M68.84,9.07V20.3h6.38V9.24a4.46,4.46,0,0,1-6.38-.17Z"/>
<polygon points="16.05 23.13 13.54 15.19 20.23 5.5 28.02 5.54 16.05 23.13"/>
<path d="M28,28.81h0l0-23.31H21.55l0,16.94A6.38,6.38,0,0,0,28,28.81Z"/>
<polygon points="15.98 23.13 18.49 15.19 11.8 5.5 4.02 5.54 15.98 23.13"/>
<path d="M4.07,28.81h0l0-23.31h6.37l0,16.94A6.38,6.38,0,0,1,4.07,28.81Z"/>
</g>`;

function cssFont(variable: string): string {
  const value =
    typeof document !== "undefined"
      ? getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
      : "";
  return value
    ? `${value}, ui-sans-serif, system-ui, sans-serif`
    : "ui-sans-serif, system-ui, sans-serif";
}

function artwork(): string {
  const sans = cssFont("--font-sans");
  const display = cssFont("--font-display");
  const label = `style="font-family:${sans};font-weight:600;font-size:10.5px;letter-spacing:2.2px;fill:${INK}"`;
  const giant = `style="font-family:${display};font-weight:700;font-size:236px;letter-spacing:-10px;fill:${INK}"`;
  return `
<g id="${P}-art">
  <rect width="${W}" height="${H}" fill="${PAPER}"/>
  <g transform="translate(26 24) scale(0.62)">${LOGO}</g>
  <text x="${W - 26}" y="38" text-anchor="end" ${label}>ERR. 404</text>
  <line x1="26" y1="58" x2="${W - 26}" y2="58" stroke="${INK}" stroke-opacity="0.22" stroke-width="1"/>
  <text x="${W / 2}" y="300" text-anchor="middle" ${giant}>404</text>
  <line x1="26" y1="344" x2="${W - 26}" y2="344" stroke="${INK}" stroke-opacity="0.22" stroke-width="1"/>
  <text x="26" y="374" ${label}>PAGE NOT FOUND</text>
  <text x="${W - 26}" y="374" text-anchor="end" ${label}>THISISMOTIVO.COM</text>
</g>`;
}

function seams(d: string): string {
  return `<path d="${d}" fill="none" stroke="#ffffff" stroke-opacity="0.6" stroke-width="1" transform="translate(0.9 0.9)" vector-effect="non-scaling-stroke"/>
<path d="${d}" fill="none" stroke="${INK}" stroke-opacity="0.42" stroke-width="1.1" vector-effect="non-scaling-stroke"/>`;
}

function buildBoard(holeD: string): string {
  let allSeams = '';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (c === HOLE.c && r === HOLE.r) continue;
      allSeams += seams(piecePath(c, r));
    }
  }
  const hx = HOLE.c * CELL - PAD;
  const hy = HOLE.r * CELL - PAD;
  const hs = CELL + PAD * 2;
  return `
<svg class="${P}-board" viewBox="0 0 ${W} ${H}" role="img" aria-label="A puzzle printed with 404, with one piece missing">
  <defs>
    ${artwork()}
    <filter id="${P}-grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.08 0" result="a"/>
      <feComposite in="a" in2="SourceGraphic" operator="in" result="g"/>
      <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="g"/></feMerge>
    </filter>
    <filter id="${P}-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
    <clipPath id="${P}-holeclip"><path d="${holeD}"/></clipPath>
    <clipPath id="${P}-frame"><rect width="${W}" height="${H}" rx="4"/></clipPath>
  </defs>
  <g clip-path="url(#${P}-frame)">
    <use href="#${P}-art" filter="url(#${P}-grain)"/>
    <g clip-path="url(#${P}-holeclip)">
      <rect x="${hx}" y="${hy}" width="${hs}" height="${hs}" fill="${RED}" filter="url(#${P}-grain)"/>
      <path d="${holeD}" fill="none" stroke="#000" stroke-opacity="0.55" stroke-width="16" filter="url(#${P}-soft)"/>
    </g>
    ${allSeams}
    <path class="${P}-holeline" d="${holeD}" fill="none" stroke="${INK}" stroke-opacity="0.7" stroke-width="1.2" vector-effect="non-scaling-stroke"/>
    <path class="${P}-glow" d="${holeD}" fill="none" stroke="#ffffff" stroke-width="2.5" vector-effect="non-scaling-stroke"/>
  </g>
</svg>`;
}

function buildPiece(holeD: string): string {
  const x = HOLE.c * CELL - PAD;
  const y = HOLE.r * CELL - PAD;
  const s = CELL + PAD * 2;
  return `
<svg class="${P}-piece-svg" viewBox="${x} ${y} ${s} ${s}" aria-hidden="true" focusable="false">
  <defs><clipPath id="${P}-pclip"><path d="${holeD}"/></clipPath></defs>
  <g clip-path="url(#${P}-pclip)"><use href="#${P}-art" filter="url(#${P}-grain)"/></g>
  <g class="${P}-piece-edge">${seams(holeD)}</g>
  <path class="${P}-piece-ring" d="${holeD}" fill="none" stroke="${RED}" stroke-width="2" vector-effect="non-scaling-stroke"/>
</svg>`;
}

const CSS = `
.${P}-stage{position:relative;display:grid;grid-template-columns:minmax(0,1fr) 240px;grid-template-areas:"intro intro" "board tray";gap:28px 28px;align-items:center;user-select:none;-webkit-user-select:none}
.${P}-intro{grid-area:intro;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:16px 40px;align-items:end;color:#F5F5F0}
.${P}-kicker{margin:0 0 12px;font-family:var(--font-sans),ui-sans-serif,system-ui,sans-serif;font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:${RED}}
.${P}-title{margin:0;font-family:var(--font-display),ui-sans-serif,system-ui,sans-serif;font-weight:700;font-size:clamp(36px,5.4vw,68px);line-height:1;letter-spacing:-.02em}
.${P}-lede{margin:0;font-family:var(--font-sans),ui-sans-serif,system-ui,sans-serif;font-size:17px;line-height:1.55;color:rgba(245,245,240,.74);max-width:44ch}
.${P}-boardwrap{grid-area:board;position:relative;min-width:0}
.${P}-boardwrap::after{content:'';position:absolute;inset:0;border-radius:4px;box-shadow:0 0 0 2px ${RED},0 0 60px rgba(237,28,36,.45);opacity:0;pointer-events:none}
.${P}-board{display:block;width:100%;height:auto;border-radius:4px;box-shadow:0 30px 70px rgba(0,0,0,.55),0 2px 0 rgba(255,255,255,.04);transition:transform .5s cubic-bezier(.2,.8,.2,1)}
.${P}-tray{grid-area:tray;position:relative;align-self:stretch;min-height:180px;border:1px dashed rgba(245,245,240,.2);border-radius:18px;display:flex;align-items:flex-end;justify-content:center;padding:12px 10px 14px;font:500 12px/1.3 var(--font-sans),ui-sans-serif,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:rgba(245,245,240,.6);text-align:center;transition:opacity .4s ease}
.${P}-board .${P}-label{font-family:var(--font-sans),ui-sans-serif,system-ui,sans-serif;font-weight:600;font-size:10.5px;letter-spacing:2.2px;fill:${INK}}
.${P}-board .${P}-giant{font-family:var(--font-display),ui-sans-serif,system-ui,sans-serif;font-weight:700;font-size:236px;letter-spacing:-10px;fill:${INK}}
.${P}-piece{position:absolute;left:0;top:0;padding:0;margin:0;border:0;background:none;cursor:grab;touch-action:none;will-change:transform;z-index:3;filter:drop-shadow(0 16px 18px rgba(0,0,0,.55));transform-origin:50% 50%;-webkit-tap-highlight-color:transparent}
.${P}-piece:focus-visible{outline:none}
.${P}-piece:focus-visible .${P}-piece-ring{opacity:1}
.${P}-piece-svg{display:block;width:100%;height:100%;overflow:visible;animation:${P}-bob 3.2s ease-in-out infinite}
.${P}-piece-ring{opacity:0;transition:opacity .2s ease}
.${P}-piece:hover .${P}-piece-ring{opacity:.9}
.${P}-dragging .${P}-piece{cursor:grabbing;filter:drop-shadow(0 28px 26px rgba(0,0,0,.6))}
.${P}-dragging .${P}-piece-svg,.${P}-solved .${P}-piece-svg{animation:none}
.${P}-snapping .${P}-piece{transition:transform .38s cubic-bezier(.2,.9,.25,1.15),filter .38s ease}
.${P}-glow{opacity:0;transition:opacity .25s ease}
.${P}-dragging .${P}-glow{opacity:.35;animation:${P}-pulse 1.1s ease-in-out infinite}
.${P}-near .${P}-glow{opacity:.95;animation:none}
.${P}-solved .${P}-piece{filter:none;cursor:default}
.${P}-solved .${P}-piece .${P}-piece-ring{opacity:0}
.${P}-solved .${P}-glow{opacity:0;animation:none}
.${P}-solved .${P}-boardwrap::after{animation:${P}-flash .9s ease-out}
.${P}-solved .${P}-tray{opacity:.25}
@keyframes ${P}-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes ${P}-flash{0%{opacity:0}20%{opacity:1}100%{opacity:0}}
@keyframes ${P}-pulse{0%,100%{opacity:.15}50%{opacity:.6}}
@media (max-width:760px){
  .${P}-stage{grid-template-columns:minmax(0,1fr) minmax(104px,32vw);grid-template-areas:"intro tray" "board board";gap:18px 14px;align-items:start}
  .${P}-intro{display:flex;flex-direction:column;gap:12px;align-items:stretch}
  .${P}-title{font-size:clamp(28px,8vw,40px)}
  .${P}-lede{font-size:15px}
  .${P}-tray{min-height:124px;align-self:start;align-items:center;justify-content:center;padding:8px 0;border:0;font-size:0;color:transparent}
}

.${P}-reduced .${P}-piece-svg{animation:none}
.${P}-reduced.${P}-snapping .${P}-piece{transition:none}
.${P}-reduced .${P}-boardwrap::after{animation:none}
`;

/* ---------- engine ---------- */

export function createPuzzle404(root: HTMLElement, options: Puzzle404Options = {}): Puzzle404 {
  const reduce =
    options.reducedMotion ?? (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const completeDelay = options.completeDelay ?? 1100;

  let style = document.getElementById(`${P}-style`) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = `${P}-style`;
    document.head.appendChild(style);
  }
  style.textContent = CSS;

  const holeD = piecePath(HOLE.c, HOLE.r);
  root.innerHTML = `
<div class="${P}-stage${reduce ? ` ${P}-reduced` : ""}">
  <header class="${P}-intro">
    <div>
      <p class="${P}-kicker">Error 404</p>
      <h1 class="${P}-title">This page is missing a piece.</h1>
    </div>
    <p class="${P}-lede">The link you followed doesn't lead anywhere. Drag the loose piece into the gap to finish the puzzle, and we'll take you back to the homepage.</p>
  </header>
  <div class="${P}-boardwrap">${buildBoard(holeD)}</div>
  <div class="${P}-tray" aria-hidden="true">Drag me into the gap</div>
  <button type="button" class="${P}-piece" aria-label="Missing puzzle piece. Drag it into the gap, or press Enter to place it and go to the homepage.">${buildPiece(holeD)}</button>
</div>`;

  const stage = root.querySelector(`.${P}-stage`) as HTMLDivElement;
  const board = root.querySelector(`.${P}-board`) as SVGSVGElement;
  const tray = root.querySelector(`.${P}-tray`) as HTMLDivElement;
  const piece = root.querySelector(`.${P}-piece`) as HTMLButtonElement;

  const state = {
    x: 0,
    y: 0,
    rot: -9,
    size: 0,
    target: { x: 0, y: 0 },
    home: { x: 0, y: 0 },
    moved: false,
    solved: false,
    dragging: false,
    pointerId: -1,
    grabX: 0,
    grabY: 0,
    lastX: 0,
    snap: 40,
  };
  let completeTimer = 0;
  let snapTimer = 0;

  function apply(): void {
    piece.style.width = `${state.size}px`;
    piece.style.height = `${state.size}px`;
    piece.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) rotate(${state.rot}deg)`;
  }

  function layout(): void {
    const s = stage.getBoundingClientRect();
    const b = board.getBoundingClientRect();
    const t = tray.getBoundingClientRect();
    const scale = b.width / W;
    state.size = (CELL + PAD * 2) * scale;
    state.snap = CELL * 0.42 * scale;
    state.target = {
      x: b.left - s.left + (HOLE.c * CELL - PAD) * scale,
      y: b.top - s.top + (HOLE.r * CELL - PAD) * scale,
    };
    state.home = {
      x: t.left - s.left + (t.width - state.size) / 2,
      y: t.top - s.top + (t.height - state.size) / 2 - 12,
    };
    if (state.solved) {
      state.x = state.target.x;
      state.y = state.target.y;
      state.rot = 0;
    } else if (!state.moved) {
      state.x = state.home.x;
      state.y = state.home.y;
    } else {
      clampToStage();
    }
    apply();
  }

  function clampToStage(): void {
    const s = stage.getBoundingClientRect();
    const half = state.size / 2;
    state.x = Math.min(Math.max(state.x, -half), s.width - half);
    state.y = Math.min(Math.max(state.y, -half), s.height - half);
  }

  function distToTarget(): number {
    return Math.hypot(state.x - state.target.x, state.y - state.target.y);
  }

  function solve(): void {
    if (state.solved) return;
    state.solved = true;
    state.dragging = false;
    stage.classList.remove(`${P}-dragging`, `${P}-near`);
    stage.classList.add(`${P}-snapping`);
    state.x = state.target.x;
    state.y = state.target.y;
    state.rot = 0;
    apply();
    piece.setAttribute('aria-disabled', 'true');
    piece.tabIndex = -1;
    snapTimer = window.setTimeout(() => {
      stage.classList.remove(`${P}-snapping`);
      stage.classList.add(`${P}-solved`);
      options.onSolved?.();
      completeTimer = window.setTimeout(() => options.onComplete?.(), completeDelay);
    }, reduce ? 0 : 380);
  }

  function onPointerDown(e: PointerEvent): void {
    if (state.solved || (e.button !== undefined && e.button !== 0)) return;
    e.preventDefault();
    piece.setPointerCapture(e.pointerId);
    state.pointerId = e.pointerId;
    state.dragging = true;
    const s = stage.getBoundingClientRect();
    state.grabX = e.clientX - s.left - state.x;
    state.grabY = e.clientY - s.top - state.y;
    state.lastX = e.clientX;
    stage.classList.remove(`${P}-snapping`);
    stage.classList.add(`${P}-dragging`);
  }

  function onPointerMove(e: PointerEvent): void {
    if (!state.dragging || e.pointerId !== state.pointerId) return;
    const s = stage.getBoundingClientRect();
    state.x = e.clientX - s.left - state.grabX;
    state.y = e.clientY - s.top - state.grabY;
    clampToStage();
    state.moved = true;
    // Tilt with horizontal speed, settle toward upright.
    const vx = e.clientX - state.lastX;
    state.lastX = e.clientX;
    const tilt = Math.max(-14, Math.min(14, vx * 0.9));
    state.rot += (tilt - state.rot) * (reduce ? 1 : 0.25);
    stage.classList.toggle(`${P}-near`, distToTarget() < state.snap * 1.8);
    apply();
  }

  function onPointerUp(e: PointerEvent): void {
    if (!state.dragging || e.pointerId !== state.pointerId) return;
    state.dragging = false;
    stage.classList.remove(`${P}-dragging`, `${P}-near`);
    if (distToTarget() < state.snap * 1.8) {
      solve();
    } else {
      stage.classList.add(`${P}-snapping`);
      state.rot = -6;
      apply();
    }
  }

  function onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      solve();
    }
  }

  piece.addEventListener('pointerdown', onPointerDown);
  piece.addEventListener('pointermove', onPointerMove);
  piece.addEventListener('pointerup', onPointerUp);
  piece.addEventListener('pointercancel', onPointerUp);
  piece.addEventListener('keydown', onKeyDown);

  const ro = new ResizeObserver(() => layout());
  ro.observe(stage);
  layout();

  return {
    reset() {
      window.clearTimeout(completeTimer);
      window.clearTimeout(snapTimer);
      state.solved = false;
      state.moved = false;
      state.rot = -9;
      piece.removeAttribute('aria-disabled');
      piece.tabIndex = 0;
      stage.classList.remove(`${P}-solved`, `${P}-near`, `${P}-dragging`);
      stage.classList.add(`${P}-snapping`);
      layout();
    },
    solve,
    destroy() {
      window.clearTimeout(completeTimer);
      window.clearTimeout(snapTimer);
      ro.disconnect();
      piece.removeEventListener('pointerdown', onPointerDown);
      piece.removeEventListener('pointermove', onPointerMove);
      piece.removeEventListener('pointerup', onPointerUp);
      piece.removeEventListener('pointercancel', onPointerUp);
      piece.removeEventListener('keydown', onKeyDown);
      root.innerHTML = '';
    },
  };
}
