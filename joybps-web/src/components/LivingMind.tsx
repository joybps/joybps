'use client';

import React, { useEffect, useRef } from 'react';

/**
 * The Joybps "Living Mind": a real-time WebGL field (OGL) that behaves like an AI at work.
 *  - Perceives: the strands lean toward the pointer (or a slow wandering "attention" on touch screens).
 *  - Thinks: every few seconds the strands converge from flowing silk into a form (signal, orbits, structure, burst).
 *  - Speaks: on load, the headline condenses out of the field letter by letter, then hands over to the real HTML text.
 *  - Adapts: scroll and pointer speed raise the field's energy.
 * The real headline stays in the DOM (SEO, screen readers). If WebGL fails or the visitor prefers reduced motion, the
 * headline is shown immediately and a soft static poster remains.
 */

interface Props {
  /** The hero section: receives data-mind-ready when the headline has condensed. */
  rootRef: React.RefObject<HTMLElement | null>;
  /** The h1 whose words (elements with data-w) are sampled into points. */
  headlineRef: React.RefObject<HTMLElement | null>;
  /** 0..1 scroll progress through the hero. */
  diveRef?: React.MutableRefObject<number>;
  /** Fired at the start of each thought with the shape index 0..3. */
  onThought?: (index: number) => void;
  className?: string;
}

const COMMON = /* glsl */ `
precision highp float;
uniform float uTime, uAspect, uForm, uFlash, uDive, uR, uIntro;
uniform vec4 uW;
uniform vec2 uCenter, uMouse, uVel;
const float PI = 3.14159265;

vec2 flowPos(float s, float u, float t) {
  float g = floor(s * 3.0);
  float ls = fract(s * 3.0);
  float ph = g * 2.1;
  float x = (u - 0.5) * 2.0 * uAspect * 1.2;
  float c = sin(u * 2.4 + t * 0.17 + ph) * 0.30 + sin(u * 5.1 - t * 0.23 + ph * 1.7) * 0.10 + (g - 1.0) * 0.46;
  float th = 0.04 + 0.40 * abs(sin(u * 3.2 + t * 0.21 + ph * 1.3));
  float y = c + (ls - 0.5) * th * 2.0 + sin(u * 9.0 + ls * 6.0 + t * 0.6) * 0.012;
  return vec2(x, y);
}
vec2 shapePos(float s, float u, float t) {
  vec2 p0, p1, p2, p3;
  // 0 signal: a living waveform ribbon
  p0 = vec2((u - 0.5) * 2.7 * uR, (fract(s * 3.0) - 0.5) * uR * 0.9 + sin(u * 7.0 + s * 5.0 - t * 1.1) * uR * 0.30 * sin(u * PI));
  // 1 orbits: tilted rings of attention
  float r = uR * (0.18 + 0.82 * fract(s * 5.37));
  float a = u * 2.0 * PI + s * 40.0 + t * 0.25 * (0.4 + fract(s * 3.1));
  float tilt = s * PI;
  vec2 o = vec2(cos(a) * r, sin(a) * r * 0.42);
  p1 = vec2(o.x * cos(tilt) - o.y * sin(tilt), o.x * sin(tilt) + o.y * cos(tilt));
  // 2 structure: a precise lattice
  float h = step(0.5, s);
  float k = floor(fract(s * 2.0) * 12.0) / 11.0;
  float len = (u - 0.5) * 2.0 * uR * 1.15;
  float off = (k - 0.5) * 2.0 * uR * 0.85;
  p2 = mix(vec2(off, len * 0.8), vec2(len, off * 0.8), h);
  p2 += vec2(sin(t * 0.6 + off * 3.0), cos(t * 0.5 + len * 2.0)) * 0.012;
  // 3 burst: an idea radiating outward
  float ang = s * 2.0 * PI + u * 1.3 + t * 0.12;
  float rr = uR * 1.15 * pow(u, 0.9) * (0.5 + 0.5 * fract(s * 13.7));
  p3 = vec2(cos(ang), sin(ang)) * rr;
  return uW.x * p0 + uW.y * p1 + uW.z * p2 + uW.w * p3;
}
vec2 place(float s, float u) {
  vec2 f = flowPos(s, u, uTime);
  vec2 sh = uCenter + shapePos(s, u, uTime);
  float k = smoothstep(s * 0.32, s * 0.32 + 0.68, uForm);
  vec2 p = mix(f, sh, k);
  vec2 d = p - uMouse;
  float fall = exp(-dot(d, d) / 0.07);
  p -= d * 0.20 * fall;
  p += vec2(-uVel.y, uVel.x) * 0.55 * fall;
  p.y += uDive * (s - 0.5) * 1.2 + uDive * 0.25;
  return p;
}
float focus(float s, float u) {
  vec2 d = place(s, u) - uMouse;
  return exp(-dot(d, d) / 0.07);
}
`;

const LINE_V = /* glsl */ `
attribute float aSeed;
attribute float aU;
varying float vA;
varying vec3 vC;
${COMMON}
void main() {
  vec2 p = place(aSeed, aU);
  gl_Position = vec4(p.x / uAspect, p.y, 0.0, 1.0);
  float k = smoothstep(aSeed * 0.32, aSeed * 0.32 + 0.68, uForm);
  float fall = focus(aSeed, aU);
  vA = pow(sin(aU * PI), 0.55) * (0.26 + 0.32 * k + 0.4 * fall) * (1.0 - uDive) * uIntro;
  float m = fract(aSeed * 3.0);
  vec3 sky = vec3(0.16, 0.56, 0.98);
  vec3 ind = vec3(0.40, 0.38, 0.95);
  vec3 teal = vec3(0.10, 0.78, 0.90);
  vC = mix(mix(sky, ind, m), teal, step(0.82, fract(aSeed * 7.7)) * 0.8);
  vC = mix(vC, vec3(0.98, 0.62, 0.12), uFlash * 0.85 * sin(aU * PI));
}`;
const LINE_F = /* glsl */ `
precision highp float;
varying float vA; varying vec3 vC;
void main() { gl_FragColor = vec4(vC * vA, vA); }`;

const NODE_V = /* glsl */ `
attribute float aSeed;
attribute float aOff;
uniform float uDpr;
varying float vA; varying vec3 vC;
${COMMON}
void main() {
  float u = fract(aOff + uTime * (0.025 + aOff * 0.03));
  vec2 p = place(aSeed, u);
  gl_Position = vec4(p.x / uAspect, p.y, 0.0, 1.0);
  float fall = focus(aSeed, u);
  gl_PointSize = (2.4 + aOff * 3.6 + fall * 3.0) * uDpr * (1.0 + uFlash * 0.7);
  vA = sin(u * PI) * (0.55 + 0.4 * fall) * (1.0 - uDive) * uIntro;
  vC = mix(vec3(0.12, 0.45, 0.95), vec3(0.98, 0.62, 0.12), uFlash * 0.9);
}`;
const NODE_F = /* glsl */ `
precision highp float;
varying float vA; varying vec3 vC;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  a = a * a * vA;
  gl_FragColor = vec4(vC * a, a);
}`;

const TEXT_V = /* glsl */ `
precision highp float;
attribute vec2 aTarget;
attribute vec2 aStart;
attribute float aDelay;
attribute float aR;
uniform float uTime, uAspect, uTextMix, uTextAlpha, uDpr;
varying float vA; varying vec3 vC;
void main() {
  float l = clamp((uTextMix - aDelay * 0.5) / 0.5, 0.0, 1.0);
  float e = l * l * (3.0 - 2.0 * l);
  vec2 sw = vec2(sin(aR * 31.0 + uTime * 1.3), cos(aR * 17.0 + uTime * 1.1)) * (1.0 - e) * 0.18;
  vec2 p = mix(aStart, aTarget, e) + sw;
  gl_Position = vec4(p.x / uAspect, p.y, 0.0, 1.0);
  gl_PointSize = (2.6 + aR * 2.0) * uDpr;
  vA = uTextAlpha * (0.4 + 0.6 * e);
  vC = mix(vec3(0.16, 0.56, 0.98), vec3(0.05, 0.08, 0.16), e);
}`;
const TEXT_F = /* glsl */ `
precision highp float;
varying float vA; varying vec3 vC;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.15, d) * vA;
  gl_FragColor = vec4(vC * a, a);
}`;

// stage -> form: Think = orbits (attention loops), Process = lattice (structure), Execute = signal (action in motion), Deliver = burst (outward to the world)
const SHAPE_ORDER = [1, 2, 0, 3];
const ease = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x));

export const LivingMind: React.FC<Props> = ({ rootRef, headlineRef, diveRef, onThought, className = '' }) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const thoughtRef = useRef(onThought);
  thoughtRef.current = onThought;

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!stage || !canvas || !root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let disposed = false;
    let cleanup = () => {};

    const ready = () => {
      root.dataset.mindReady = '1';
    };
    if (reduced) ready();

    const boot = async () => {
      let ogl: typeof import('ogl');
      try {
        ogl = await import('ogl');
      } catch {
        ready();
        return;
      }
      if (disposed) return;
      const { Renderer, Camera, Transform, Program, Mesh, Geometry } = ogl;
      let renderer: InstanceType<typeof Renderer>;
      try {
        renderer = new Renderer({ canvas, alpha: true, premultipliedAlpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 2), webgl: 1, powerPreference: 'high-performance' });
      } catch {
        ready(); // no WebGL: show the real headline
        return;
      }
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      const dpr = renderer.dpr;
      const camera = new Camera(gl);
      const scene = new Transform();

      let w = stage.clientWidth;
      let h = stage.clientHeight;
      const small = w < 768;
      const M = small ? 150 : 250; // strands
      const S = small ? 64 : 96; // segments per strand
      const NODES = small ? 320 : 760;

      let seed = 11;
      const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

      // --- strands
      const vCount = M * S;
      const aSeed = new Float32Array(vCount);
      const aU = new Float32Array(vCount);
      const index = new Uint16Array(M * (S - 1) * 2);
      let ii = 0;
      for (let j = 0; j < M; j++) {
        const s = (j + 0.2 + rnd() * 0.6) / M;
        for (let k = 0; k < S; k++) {
          aSeed[j * S + k] = s;
          aU[j * S + k] = k / (S - 1);
          if (k < S - 1) {
            index[ii++] = j * S + k;
            index[ii++] = j * S + k + 1;
          }
        }
      }
      const shared = {
        uTime: { value: 0 },
        uAspect: { value: w / h },
        uForm: { value: 0 },
        uFlash: { value: 0 },
        uDive: { value: 0 },
        uR: { value: 0.8 },
        uIntro: { value: 0 },
        uW: { value: [1, 0, 0, 0] },
        uCenter: { value: [0.6, 0] },
        uMouse: { value: [9, 9] },
        uVel: { value: [0, 0] },
        uDpr: { value: dpr },
      };
      const lineMesh = new Mesh(gl, {
        mode: gl.LINES,
        geometry: new Geometry(gl, { aSeed: { size: 1, data: aSeed }, aU: { size: 1, data: aU }, index: { data: index } }),
        program: new Program(gl, { vertex: LINE_V, fragment: LINE_F, uniforms: shared, transparent: true, depthTest: false, depthWrite: false }),
      });
      lineMesh.frustumCulled = false;
      lineMesh.setParent(scene);

      // --- travelling nodes (synapse sparks riding the strands)
      const nSeed = new Float32Array(NODES);
      const nOff = new Float32Array(NODES);
      const nPos = new Float32Array(NODES * 3);
      for (let i = 0; i < NODES; i++) {
        nSeed[i] = rnd();
        nOff[i] = rnd();
      }
      const nodeMesh = new Mesh(gl, {
        mode: gl.POINTS,
        geometry: new Geometry(gl, { position: { size: 3, data: nPos }, aSeed: { size: 1, data: nSeed }, aOff: { size: 1, data: nOff } }),
        program: new Program(gl, { vertex: NODE_V.replace('attribute float aSeed;', 'attribute vec3 position;\nattribute float aSeed;'), fragment: NODE_F, uniforms: shared, transparent: true, depthTest: false, depthWrite: false }),
      });
      nodeMesh.frustumCulled = false;
      nodeMesh.setParent(scene);

      // --- headline particles
      const textU = { uTime: shared.uTime, uAspect: shared.uAspect, uDpr: shared.uDpr, uTextMix: { value: 0 }, uTextAlpha: { value: 1 } };
      let textMesh: InstanceType<typeof Mesh> | null = null;
      const buildText = () => {
        const el = headlineRef.current;
        if (!el || w < 10 || h < 10) return false;
        const words = el.querySelectorAll<HTMLElement>('[data-w]');
        if (!words.length) return false;
        const cv = document.createElement('canvas');
        cv.width = w;
        cv.height = h;
        const ctx = cv.getContext('2d');
        if (!ctx) return false;
        const sr = stage.getBoundingClientRect();
        const z = sr.width / (stage.clientWidth || 1) || 1; // page zoom (rects are visual px, canvas is CSS px)
        words.forEach((sp) => {
          const r = sp.getBoundingClientRect();
          const cs = getComputedStyle(sp);
          ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
          if ('letterSpacing' in ctx) (ctx as unknown as { letterSpacing: string }).letterSpacing = cs.letterSpacing;
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#000';
          ctx.fillText(sp.textContent || '', (r.left - sr.left) / z, (r.top - sr.top) / z + r.height / (2 * z) + parseFloat(cs.fontSize) * 0.04);
        });
        const data = ctx.getImageData(0, 0, w, h).data;
        const step = 2;
        const pts: number[][] = [];
        for (let y = 0; y < h; y += step)
          for (let x = 0; x < w; x += step) if (data[(y * w + x) * 4 + 3] > 140) pts.push([x + rnd() * step, y + rnd() * step]);
        const cap = small ? 4200 : 8200;
        const keep = pts.length > cap ? cap / pts.length : 1;
        const arr = pts.filter(() => rnd() < keep);
        const n = arr.length;
        if (!n) return false;
        const half = h / 2;
        const aT = new Float32Array(n * 2);
        const aS = new Float32Array(n * 2);
        const aD = new Float32Array(n);
        const aRr = new Float32Array(n);
        const aspect = w / h;
        for (let i = 0; i < n; i++) {
          const [px, py] = arr[i];
          aT[i * 2] = (px - w / 2) / half;
          aT[i * 2 + 1] = -(py - half) / half;
          aS[i * 2] = (rnd() * 2 - 1) * aspect * 1.1;
          aS[i * 2 + 1] = (rnd() * 2 - 1) * 0.95;
          aD[i] = rnd();
          aRr[i] = rnd();
        }
        textMesh = new Mesh(gl, {
          mode: gl.POINTS,
          geometry: new Geometry(gl, { position: { size: 3, data: new Float32Array(n * 3) }, aTarget: { size: 2, data: aT }, aStart: { size: 2, data: aS }, aDelay: { size: 1, data: aD }, aR: { size: 1, data: aRr } }),
          program: new Program(gl, { vertex: TEXT_V.replace('attribute vec2 aTarget;', 'attribute vec3 position;\nattribute vec2 aTarget;'), fragment: TEXT_F, uniforms: textU, transparent: true, depthTest: false, depthWrite: false }),
        });
        textMesh.frustumCulled = false;
        textMesh.setParent(scene);
        return true;
      };

      const layout = () => {
        w = stage.clientWidth;
        h = stage.clientHeight;
        renderer.setSize(w, h);
        const aspect = w / h;
        shared.uAspect.value = aspect;
        if (w > 900) {
          shared.uCenter.value = [aspect * 0.44, 0.02];
          shared.uR.value = 0.74;
        } else {
          shared.uCenter.value = [0, -0.42];
          shared.uR.value = Math.min(0.62, aspect * 0.95);
        }
      };
      layout();

      try {
        await document.fonts.ready;
      } catch {
        /* ignore */
      }
      if (disposed) return;
      layout();
      const hasText = !reduced && buildText();
      if (!hasText) ready();

      // --- pointer ("attention")
      const mouse = { x: 9, y: 9, tx: 9, ty: 9, vx: 0, vy: 0, last: 0, active: false };
      const onMove = (e: PointerEvent) => {
        const r = stage.getBoundingClientRect();
        const z = r.width / (stage.clientWidth || 1) || 1;
        mouse.tx = ((e.clientX - r.left) / z - w / 2) / (h / 2);
        mouse.ty = -((e.clientY - r.top) / z - h / 2) / (h / 2);
        mouse.last = performance.now();
        mouse.active = true;
      };
      window.addEventListener('pointermove', onMove, { passive: true });
      let energy = 0;
      let lastY = window.scrollY;
      const onScroll = () => {
        energy = Math.min(1, energy + Math.abs(window.scrollY - lastY) * 0.01);
        lastY = window.scrollY;
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      const ro = new ResizeObserver(layout);
      ro.observe(stage);

      // --- timeline
      const CYCLE = 6.6;
      let clock = 0; // seconds since first frame
      let tAcc = 0; // energy-warped time for the field
      let lastIdx = -1;
      let readied = reduced || !hasText;
      let raf = 0;
      let running = false;
      let last = performance.now();

      const frame = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        clock += dt;

        // energy: scroll + pointer speed, decaying
        energy *= Math.exp(-dt * 1.6);
        const idle = now - mouse.last > 2600 || !mouse.active;
        if (idle) {
          // slow wandering attention, so touch screens and idle desktops still feel alive
          mouse.tx = Math.sin(clock * 0.35) * (w / h) * 0.55 + (w > 900 ? (w / h) * 0.3 : 0);
          mouse.ty = Math.cos(clock * 0.27) * 0.45;
        }
        const px = mouse.x;
        const py = mouse.y;
        mouse.x += (mouse.tx - mouse.x) * Math.min(1, dt * 5);
        mouse.y += (mouse.ty - mouse.y) * Math.min(1, dt * 5);
        if (mouse.x > 8) {
          mouse.x = mouse.tx;
          mouse.y = mouse.ty;
        }
        const sp = Math.hypot(mouse.x - px, mouse.y - py) / Math.max(dt, 0.001);
        mouse.vx += ((mouse.x - px) * 0.9 - mouse.vx) * Math.min(1, dt * 8);
        mouse.vy += ((mouse.y - py) * 0.9 - mouse.vy) * Math.min(1, dt * 8);
        if (!idle) energy = Math.min(1, energy + sp * 0.004);
        tAcc += dt * (0.7 + energy * 1.3);

        // headline condenses out of the field, then hands over to the real text
        const cT = clock - 0.35;
        textU.uTextMix.value = Math.min(1, Math.max(0, cT / 2.2));
        if (cT > 2.3 && !readied) {
          readied = true;
          ready();
        }
        const fade = ease((cT - 2.45) / 0.7);
        textU.uTextAlpha.value = 1 - fade;
        if (textMesh && fade >= 1) textMesh.visible = false;

        // thoughts: flow -> form -> flow
        let form = 0;
        const tt = clock - (hasText ? 3.2 : 0.8);
        if (tt >= 0) {
          const idx = Math.floor(tt / CYCLE) % 4;
          const p = tt % CYCLE;
          form = p < 1.7 ? ease(p / 1.7) : p < 4.3 ? 1 : p < 5.9 ? 1 - ease((p - 4.3) / 1.6) : 0;
          if (idx !== lastIdx) {
            lastIdx = idx;
            const wv = [0, 0, 0, 0];
            wv[SHAPE_ORDER[idx]] = 1;
            shared.uW.value = wv;
            thoughtRef.current?.(idx);
          }
          if (p > 1.6 && p < 1.6 + dt * 1.5) shared.uFlash.value = 1;
        }
        shared.uFlash.value *= Math.exp(-dt * 2.4);
        shared.uForm.value = form;
        shared.uIntro.value = ease(clock / 1.4);
        shared.uDive.value = diveRef?.current ?? 0;
        shared.uTime.value = tAcc;
        shared.uMouse.value = [mouse.x, mouse.y];
        shared.uVel.value = [mouse.vx, mouse.vy];

        renderer.render({ scene, camera });
        if (running) raf = requestAnimationFrame(frame);
      };
      const start = () => {
        if (running || reduced) return;
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      };
      const stop = () => {
        running = false;
        cancelAnimationFrame(raf);
      };

      if (reduced) {
        shared.uIntro.value = 1;
        shared.uTime.value = 6;
        renderer.render({ scene, camera });
      } else {
        frame(performance.now());
      }
      stage.dataset.live = '1';
      const io = new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? start() : stop()), { rootMargin: '80px' });
      io.observe(stage);
      const onVis = () => (document.hidden ? stop() : start());
      document.addEventListener('visibilitychange', onVis);

      cleanup = () => {
        stop();
        io.disconnect();
        ro.disconnect();
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('scroll', onScroll);
        document.removeEventListener('visibilitychange', onVis);
        delete stage.dataset.live;
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      };
    };

    void boot();
    return () => {
      disposed = true;
      cleanup();
    };
  }, [rootRef, headlineRef, diveRef]);

  return (
    <div ref={stageRef} aria-hidden="true" className={`absolute inset-0 overflow-hidden group/stage ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_44%_50%_at_70%_50%,rgba(125,211,252,0.32),transparent_70%),radial-gradient(ellipse_30%_34%_at_82%_36%,rgba(165,180,252,0.26),transparent_70%)] group-data-[live]/stage:opacity-0 transition-opacity duration-1000" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
