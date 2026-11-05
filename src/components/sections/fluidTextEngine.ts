/**
 * WebGL2 fluid simulation that inks over a block of text.
 * Where the ink covers the text, the text flips to the background colour,
 * so moving the cursor carves through the words.
 */

export interface FluidTextOptions {
  text: string;
  fontFamily: string;
  fontWeight?: number | string;
  lineHeight?: number;
  letterSpacingEm?: number;
  background: string;
  foreground: string;
  ink: string;
  minFontPx?: number;
  maxFontPx?: number;
  sizeVw?: number;
  intro?: boolean;
  splatRadius?: number;
  splatForce?: number;
  curl?: number;
  dyeDissipation?: number;
  velocityDissipation?: number;
  inkEdge?: [number, number];
}

export interface FluidTextEngine {
  setColors(colors: { background?: string; foreground?: string; ink?: string }): void;
  setText(text: string): void;
  destroy(): void;
}

interface Program {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation | null>;
}

interface FBO {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  attach(id: number): number;
}

interface DoubleFBO {
  read: FBO;
  write: FBO;
  width: number;
  height: number;
  swap(): void;
}

const VERT = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aPosition;
uniform vec2 texelSize;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
void main () {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const HEAD = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 o;
`;

const SPLAT = `
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 point;
uniform float radius;
void main () {
  vec2 p = vUv - point;
  p.x *= aspectRatio;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  vec3 base = texture(uTarget, vUv).xyz;
  o = vec4(base + splat, 1.0);
}`;

const ADVECT = `
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float dissipation;
void main () {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
  vec4 result = texture(uSource, coord);
  float decay = 1.0 + dissipation * dt;
  o = result / decay;
}`;

const DIVERGENCE = `
uniform sampler2D uVelocity;
void main () {
  float L = texture(uVelocity, vL).x;
  float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y;
  float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) { L = -C.x; }
  if (vR.x > 1.0) { R = -C.x; }
  if (vT.y > 1.0) { T = -C.y; }
  if (vB.y < 0.0) { B = -C.y; }
  float div = 0.5 * (R - L + T - B);
  o = vec4(div, 0.0, 0.0, 1.0);
}`;

const CURL = `
uniform sampler2D uVelocity;
void main () {
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  float vorticity = R - L - T + B;
  o = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
}`;

const VORTICITY = `
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
void main () {
  float L = texture(uCurl, vL).x;
  float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x;
  float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  vec2 velocity = texture(uVelocity, vUv).xy;
  velocity += force * dt;
  velocity = min(max(velocity, -1000.0), 1000.0);
  o = vec4(velocity, 0.0, 1.0);
}`;

const PRESSURE = `
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main () {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float divergence = texture(uDivergence, vUv).x;
  float pressure = (L + R + B + T - divergence) * 0.25;
  o = vec4(pressure, 0.0, 0.0, 1.0);
}`;

const CLEAR = `
uniform sampler2D uTexture;
uniform float value;
void main () {
  o = value * texture(uTexture, vUv);
}`;

const GRADIENT = `
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main () {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  vec2 velocity = texture(uVelocity, vUv).xy;
  velocity.xy -= vec2(R - L, T - B);
  o = vec4(velocity, 0.0, 1.0);
}`;

const DISPLAY = `
uniform sampler2D uDye;
uniform sampler2D uText;
uniform vec3 uBg;
uniform vec3 uFg;
uniform vec3 uInk;
uniform vec2 uEdge;
void main () {
  float d = texture(uDye, vUv).r;
  float f = smoothstep(uEdge.x, uEdge.y, d);
  float t = texture(uText, vUv).a;
  vec3 c = uBg;
  c = mix(c, uInk, f * (1.0 - t));
  c = mix(c, uFg, t * (1.0 - f));
  o = vec4(c, 1.0);
}`;

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.trim().replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  if (Number.isNaN(n) || h.length !== 6) return [1, 1, 1];
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function createFluidText(canvas: HTMLCanvasElement, options: FluidTextOptions): FluidTextEngine | null {
  const opts = {
    fontWeight: 700,
    lineHeight: 1.02,
    letterSpacingEm: -0.03,
    minFontPx: 34,
    maxFontPx: 120,
    sizeVw: 0.1,
    intro: true,
    splatRadius: 0.28,
    splatForce: 6000,
    curl: 22,
    dyeDissipation: 0.9,
    velocityDissipation: 0.25,
    inkEdge: [0.1, 0.16] as [number, number],
    ...options,
  };

  const maybeGl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
    premultipliedAlpha: false,
  });
  if (!maybeGl) return null;
  const gl: WebGL2RenderingContext = maybeGl;
  if (!gl.getExtension("EXT_color_buffer_float")) return null;

  const SIM_RES = 128;
  const DYE_RES = 768;
  const PRESSURE_ITERATIONS = 20;
  const PRESSURE_DECAY = 0.8;

  let colors = {
    bg: hexToRgb(opts.background),
    fg: hexToRgb(opts.foreground),
    ink: hexToRgb(opts.ink),
  };
  let text = opts.text;

  function compile(type: number, source: string): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertexShader = compile(gl.VERTEX_SHADER, VERT);
  if (!vertexShader) return null;
  const vs: WebGLShader = vertexShader;

  function makeProgram(body: string): Program | null {
    const fs = compile(gl.FRAGMENT_SHADER, HEAD + body);
    const program = gl.createProgram();
    if (!fs || !program) return null;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return null;
    }
    const uniforms: Record<string, WebGLUniformLocation | null> = {};
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < count; i++) {
      const info = gl.getActiveUniform(program, i);
      if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name);
    }
    return { program, uniforms };
  }

  const built = {
    splat: makeProgram(SPLAT),
    advect: makeProgram(ADVECT),
    divergence: makeProgram(DIVERGENCE),
    curl: makeProgram(CURL),
    vorticity: makeProgram(VORTICITY),
    pressure: makeProgram(PRESSURE),
    clear: makeProgram(CLEAR),
    gradient: makeProgram(GRADIENT),
    display: makeProgram(DISPLAY),
  };
  for (const p of Object.values(built)) if (!p) return null;
  const P = built as Record<keyof typeof built, Program>;

  const u = (p: Program, name: string): WebGLUniformLocation | null => p.uniforms[name] ?? null;

  const quad = gl.createBuffer();
  const indices = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  function blit(target: FBO | null): void {
    if (target) {
      gl.viewport(0, 0, target.width, target.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    } else {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }

  const allTextures: WebGLTexture[] = [];
  const allFbos: WebGLFramebuffer[] = [];

  function createFBO(width: number, height: number): FBO {
    const texture = gl.createTexture() as WebGLTexture;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, width, height, 0, gl.RGBA, gl.HALF_FLOAT, null);
    const fbo = gl.createFramebuffer() as WebGLFramebuffer;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    allTextures.push(texture);
    allFbos.push(fbo);
    return {
      texture,
      fbo,
      width,
      height,
      attach(id: number) {
        gl.activeTexture(gl.TEXTURE0 + id);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        return id;
      },
    };
  }

  function createDouble(width: number, height: number): DoubleFBO {
    let a = createFBO(width, height);
    let b = createFBO(width, height);
    return {
      width,
      height,
      get read() {
        return a;
      },
      get write() {
        return b;
      },
      swap() {
        const t = a;
        a = b;
        b = t;
      },
    };
  }

  function getResolution(res: number): { w: number; h: number } {
    let aspect = gl.drawingBufferWidth / Math.max(1, gl.drawingBufferHeight);
    if (aspect < 1) aspect = 1 / aspect;
    const min = Math.round(res);
    const max = Math.round(res * aspect);
    return gl.drawingBufferWidth > gl.drawingBufferHeight ? { w: max, h: min } : { w: min, h: max };
  }

  let velocity: DoubleFBO;
  let dye: DoubleFBO;
  let pressure: DoubleFBO;
  let divergence: FBO;
  let curlFbo: FBO;

  function freeTargets(): void {
    allFbos.splice(0).forEach((f) => gl.deleteFramebuffer(f));
    allTextures.splice(0).forEach((t) => gl.deleteTexture(t));
  }

  function initTargets(): boolean {
    freeTargets();
    const sim = getResolution(SIM_RES);
    const dyeRes = getResolution(DYE_RES);
    velocity = createDouble(sim.w, sim.h);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) return false;
    dye = createDouble(dyeRes.w, dyeRes.h);
    pressure = createDouble(sim.w, sim.h);
    divergence = createFBO(sim.w, sim.h);
    curlFbo = createFBO(sim.w, sim.h);
    return true;
  }

  const textTexture = gl.createTexture() as WebGLTexture;
  const textCanvas = document.createElement("canvas");
  const tctx = textCanvas.getContext("2d") as CanvasRenderingContext2D & { letterSpacing?: string };

  function drawText(): void {
    const W = canvas.width;
    const H = canvas.height;
    const dpr = W / Math.max(1, canvas.clientWidth);
    textCanvas.width = W;
    textCanvas.height = H;
    tctx.clearRect(0, 0, W, H);
    const padX = Math.max(16 * dpr, W * 0.06);
    const maxW = W - padX * 2;
    let size = Math.min(opts.maxFontPx * dpr, Math.max(opts.minFontPx * dpr, W * opts.sizeVw));
    let lines: string[] = [];
    const words = text.trim().split(/\s+/);
    for (let attempt = 0; attempt < 24; attempt++) {
      tctx.font = `${opts.fontWeight} ${size}px ${opts.fontFamily}`;
      if ("letterSpacing" in tctx) tctx.letterSpacing = `${opts.letterSpacingEm * size}px`;
      lines = [];
      let line = "";
      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (line && tctx.measureText(test).width > maxW) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      }
      if (line) lines.push(line);
      const widest = Math.max(...lines.map((l) => tctx.measureText(l).width));
      if (lines.length * size * opts.lineHeight <= H * 0.82 && widest <= maxW) break;
      size *= 0.92;
    }
    const lineH = size * opts.lineHeight;
    const blockH = lines.length * lineH;
    const top = (H - blockH) / 2;
    tctx.fillStyle = "#ffffff";
    tctx.textBaseline = "alphabetic";
    lines.forEach((l, i) => {
      tctx.fillText(l, padX, top + i * lineH + size * 0.8);
    });
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  }

  function correctRadius(r: number): number {
    const aspect = canvas.width / Math.max(1, canvas.height);
    return aspect > 1 ? r * aspect : r;
  }

  function splat(x: number, y: number, dx: number, dy: number, amount: number): void {
    const p = P.splat;
    gl.useProgram(p.program);
    gl.uniform1i(u(p, "uTarget"), velocity.read.attach(0));
    gl.uniform1f(u(p, "aspectRatio"), canvas.width / Math.max(1, canvas.height));
    gl.uniform2f(u(p, "point"), x, y);
    gl.uniform3f(u(p, "color"), dx, dy, 0);
    gl.uniform1f(u(p, "radius"), correctRadius(opts.splatRadius / 100));
    blit(velocity.write);
    velocity.swap();
    gl.uniform1i(u(p, "uTarget"), dye.read.attach(0));
    gl.uniform3f(u(p, "color"), amount, 0, 0);
    blit(dye.write);
    dye.swap();
  }

  function step(dt: number): void {
    const tx = 1 / velocity.width;
    const ty = 1 / velocity.height;

    gl.useProgram(P.curl.program);
    gl.uniform2f(u(P.curl, "texelSize"), tx, ty);
    gl.uniform1i(u(P.curl, "uVelocity"), velocity.read.attach(0));
    blit(curlFbo);

    gl.useProgram(P.vorticity.program);
    gl.uniform2f(u(P.vorticity, "texelSize"), tx, ty);
    gl.uniform1i(u(P.vorticity, "uVelocity"), velocity.read.attach(0));
    gl.uniform1i(u(P.vorticity, "uCurl"), curlFbo.attach(1));
    gl.uniform1f(u(P.vorticity, "curl"), opts.curl);
    gl.uniform1f(u(P.vorticity, "dt"), dt);
    blit(velocity.write);
    velocity.swap();

    gl.useProgram(P.divergence.program);
    gl.uniform2f(u(P.divergence, "texelSize"), tx, ty);
    gl.uniform1i(u(P.divergence, "uVelocity"), velocity.read.attach(0));
    blit(divergence);

    gl.useProgram(P.clear.program);
    gl.uniform1i(u(P.clear, "uTexture"), pressure.read.attach(0));
    gl.uniform1f(u(P.clear, "value"), PRESSURE_DECAY);
    blit(pressure.write);
    pressure.swap();

    gl.useProgram(P.pressure.program);
    gl.uniform2f(u(P.pressure, "texelSize"), tx, ty);
    gl.uniform1i(u(P.pressure, "uDivergence"), divergence.attach(0));
    for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
      gl.uniform1i(u(P.pressure, "uPressure"), pressure.read.attach(1));
      blit(pressure.write);
      pressure.swap();
    }

    gl.useProgram(P.gradient.program);
    gl.uniform2f(u(P.gradient, "texelSize"), tx, ty);
    gl.uniform1i(u(P.gradient, "uPressure"), pressure.read.attach(0));
    gl.uniform1i(u(P.gradient, "uVelocity"), velocity.read.attach(1));
    blit(velocity.write);
    velocity.swap();

    gl.useProgram(P.advect.program);
    gl.uniform2f(u(P.advect, "texelSize"), tx, ty);
    const velId = velocity.read.attach(0);
    gl.uniform1i(u(P.advect, "uVelocity"), velId);
    gl.uniform1i(u(P.advect, "uSource"), velId);
    gl.uniform1f(u(P.advect, "dt"), dt);
    gl.uniform1f(u(P.advect, "dissipation"), opts.velocityDissipation);
    blit(velocity.write);
    velocity.swap();

    gl.uniform1i(u(P.advect, "uVelocity"), velocity.read.attach(0));
    gl.uniform1i(u(P.advect, "uSource"), dye.read.attach(1));
    gl.uniform1f(u(P.advect, "dissipation"), opts.dyeDissipation);
    blit(dye.write);
    dye.swap();
  }

  function render(): void {
    const p = P.display;
    gl.useProgram(p.program);
    gl.uniform1i(u(p, "uDye"), dye.read.attach(0));
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textTexture);
    gl.uniform1i(u(p, "uText"), 1);
    gl.uniform3f(u(p, "uBg"), colors.bg[0], colors.bg[1], colors.bg[2]);
    gl.uniform3f(u(p, "uFg"), colors.fg[0], colors.fg[1], colors.fg[2]);
    gl.uniform3f(u(p, "uInk"), colors.ink[0], colors.ink[1], colors.ink[2]);
    gl.uniform2f(u(p, "uEdge"), opts.inkEdge[0], opts.inkEdge[1]);
    blit(null);
  }

  function resize(): boolean {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (w === canvas.width && h === canvas.height && ready) return false;
    canvas.width = w;
    canvas.height = h;
    return true;
  }

  let ready = false;
  resize();
  if (!initTargets()) return null;
  ready = true;
  drawText();

  interface Move {
    x: number;
    y: number;
    dx: number;
    dy: number;
  }
  const queue: Move[] = [];
  let last: { x: number; y: number } | null = null;

  function pushMove(x: number, y: number): void {
    if (last) {
      let dx = x - last.x;
      let dy = y - last.y;
      const aspect = canvas.width / Math.max(1, canvas.height);
      if (aspect < 1) dx *= aspect;
      if (aspect > 1) dy /= aspect;
      if (Math.abs(dx) + Math.abs(dy) > 0.00001) queue.push({ x, y, dx, dy });
    }
    last = { x, y };
  }

  let lastInput = performance.now();
  function onPointerMove(e: PointerEvent): void {
    lastInput = performance.now();
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1 - (e.clientY - rect.top) / rect.height;
    pushMove(x, y);
    kick();
  }
  function onPointerLeave(): void {
    last = null;
  }
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerdown", onPointerMove);
  canvas.addEventListener("pointerleave", onPointerLeave);
  canvas.addEventListener("pointercancel", onPointerLeave);

  let introStart = opts.intro ? -1 : Infinity;
  const INTRO_MS = 1500;
  function introTick(now: number): void {
    if (introStart === Infinity) return;
    if (introStart < 0) {
      introStart = now;
      last = null;
    }
    const t = Math.min(1, (now - introStart) / INTRO_MS);
    pushMove(0.06 + 0.88 * t, 0.5 + 0.14 * Math.sin(t * Math.PI * 2.4));
    if (t >= 1) {
      introStart = Infinity;
      last = null;
    }
  }

  let raf = 0;
  let visible = true;
  let destroyed = false;
  let lastTime = performance.now();

  function frame(now: number): void {
    raf = 0;
    if (destroyed || !visible) return;
    const dt = Math.min((now - lastTime) / 1000, 1 / 60);
    lastTime = now;
    if (resize()) {
      initTargets();
      drawText();
    }
    introTick(now);
    while (queue.length) {
      const m = queue.shift() as Move;
      splat(m.x, m.y, m.dx * opts.splatForce, m.dy * opts.splatForce, 0.6);
    }
    step(dt);
    render();
    if (introStart === Infinity && now - lastInput > 7000) return;
    raf = requestAnimationFrame(frame);
  }
  function kick(): void {
    if (!raf && visible && !destroyed) {
      lastTime = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }

  const io = new IntersectionObserver((entries) => {
    visible = entries.some((en) => en.isIntersecting);
    if (visible) kick();
  });
  io.observe(canvas);

  const ro = new ResizeObserver(() => {
    if (resize()) {
      initTargets();
      drawText();
      render();
    }
  });
  ro.observe(canvas);

  if (document.fonts) {
    const weight = String(opts.fontWeight);
    const family = opts.fontFamily.split(",")[0].trim();
    document.fonts
      .load(`${weight} 64px ${family}`)
      .catch(() => undefined)
      .then(() => {
        if (!destroyed) {
          drawText();
          render();
        }
      });
  }

  render();
  kick();

  return {
    setColors(next) {
      colors = {
        bg: next.background ? hexToRgb(next.background) : colors.bg,
        fg: next.foreground ? hexToRgb(next.foreground) : colors.fg,
        ink: next.ink ? hexToRgb(next.ink) : colors.ink,
      };
      render();
    },
    setText(next) {
      text = next;
      drawText();
      render();
    },
    destroy() {
      destroyed = true;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointercancel", onPointerLeave);
      freeTargets();
      gl.deleteTexture(textTexture);
    },
  };
}
