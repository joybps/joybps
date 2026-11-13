'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Background for the closing call-to-action: the hero's silk. The same GPU strand field as the Living Mind hero
 * (OGL): bundles of fine light strands that twist and pinch as they flow, with sparks riding along them, leaning
 * toward the pointer. Paused when off screen; reduced motion gets one still frame.
 */

const COMMON = /* glsl */ `
precision highp float;
uniform float uTime, uAspect, uIntro;
uniform vec2 uMouse;
const float PI = 3.14159265;

vec2 flowPos(float s, float u, float t) {
  float g = floor(s * 3.0);
  float ls = fract(s * 3.0);
  float ph = g * 2.1;
  float x = (u - 0.5) * 2.0 * uAspect * 1.15;
  float c = sin(u * 2.4 + t * 0.17 + ph) * 0.30 + sin(u * 5.1 - t * 0.23 + ph * 1.7) * 0.10 + (g - 1.0) * 0.40;
  float th = 0.05 + 0.34 * abs(sin(u * 3.2 + t * 0.21 + ph * 1.3));
  float y = c + (ls - 0.5) * th * 2.0 + sin(u * 9.0 + ls * 6.0 + t * 0.6) * 0.012;
  return vec2(x, y);
}
vec2 place(float s, float u) {
  vec2 p = flowPos(s, u, uTime);
  vec2 d = p - uMouse;
  float fall = exp(-dot(d, d) / 0.08);
  p -= d * 0.22 * fall;
  return p;
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
  vec2 d = p - uMouse;
  float fall = exp(-dot(d, d) / 0.08);
  vA = pow(sin(aU * PI), 0.55) * (0.30 + 0.45 * fall) * uIntro;
  float m = fract(aSeed * 3.0);
  vec3 sky = vec3(0.16, 0.56, 0.98);
  vec3 ind = vec3(0.40, 0.38, 0.95);
  vec3 teal = vec3(0.10, 0.78, 0.90);
  vC = mix(mix(sky, ind, m), teal, step(0.82, fract(aSeed * 7.7)) * 0.8);
}`;
const LINE_F = /* glsl */ `
precision highp float;
varying float vA; varying vec3 vC;
void main() { gl_FragColor = vec4(vC * vA, vA); }`;

const NODE_V = /* glsl */ `
attribute vec3 position;
attribute float aSeed;
attribute float aOff;
uniform float uDpr;
varying float vA;
${COMMON}
void main() {
  float u = fract(aOff + uTime * (0.025 + aOff * 0.03));
  vec2 p = place(aSeed, u);
  gl_Position = vec4(p.x / uAspect, p.y, 0.0, 1.0);
  gl_PointSize = (2.6 + aOff * 3.6) * uDpr;
  vA = sin(u * PI) * 0.9 * uIntro;
}`;
const NODE_F = /* glsl */ `
precision highp float;
varying float vA;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  a = a * a * vA;
  gl_FragColor = vec4(vec3(0.12, 0.45, 0.95) * a, a);
}`;

const ease = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x));

export const AINetworkBg: React.FC<{ className?: string }> = ({ className = '' }) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let disposed = false;
    let cleanup = () => {};

    const boot = async () => {
      let ogl: typeof import('ogl');
      try {
        ogl = await import('ogl');
      } catch {
        return;
      }
      if (disposed) return;
      const { Renderer, Camera, Transform, Program, Mesh, Geometry } = ogl;
      let renderer: InstanceType<typeof Renderer>;
      try {
        renderer = new Renderer({ canvas, alpha: true, premultipliedAlpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 2), webgl: 1 });
      } catch {
        return;
      }
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      const camera = new Camera(gl);
      const scene = new Transform();
      let w = stage.clientWidth;
      let h = stage.clientHeight;
      const small = w < 700;
      const M = small ? 130 : 240;
      const S = small ? 60 : 96;
      const NODES = small ? 160 : 380;

      let seed = 5;
      const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

      const aSeed = new Float32Array(M * S);
      const aU = new Float32Array(M * S);
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
        uIntro: { value: 0 },
        uMouse: { value: [9, 9] },
        uDpr: { value: renderer.dpr },
      };
      const lines = new Mesh(gl, {
        mode: gl.LINES,
        geometry: new Geometry(gl, { aSeed: { size: 1, data: aSeed }, aU: { size: 1, data: aU }, index: { data: index } }),
        program: new Program(gl, { vertex: LINE_V, fragment: LINE_F, uniforms: shared, transparent: true, depthTest: false, depthWrite: false }),
      });
      lines.frustumCulled = false;
      lines.setParent(scene);

      const nSeed = new Float32Array(NODES);
      const nOff = new Float32Array(NODES);
      for (let i = 0; i < NODES; i++) {
        nSeed[i] = rnd();
        nOff[i] = rnd();
      }
      const nodes = new Mesh(gl, {
        mode: gl.POINTS,
        geometry: new Geometry(gl, { position: { size: 3, data: new Float32Array(NODES * 3) }, aSeed: { size: 1, data: nSeed }, aOff: { size: 1, data: nOff } }),
        program: new Program(gl, { vertex: NODE_V, fragment: NODE_F, uniforms: shared, transparent: true, depthTest: false, depthWrite: false }),
      });
      nodes.frustumCulled = false;
      nodes.setParent(scene);

      const layout = () => {
        w = stage.clientWidth;
        h = stage.clientHeight;
        renderer.setSize(w, h);
        shared.uAspect.value = w / h;
      };
      layout();
      const ro = new ResizeObserver(layout);
      ro.observe(stage);

      const mouse = { x: 9, y: 9, tx: 9, ty: 9, last: 0 };
      const onMove = (e: PointerEvent) => {
        const r = stage.getBoundingClientRect();
        const z = r.width / (stage.clientWidth || 1) || 1;
        mouse.tx = ((e.clientX - r.left) / z - w / 2) / (h / 2);
        mouse.ty = -((e.clientY - r.top) / z - h / 2) / (h / 2);
        mouse.last = performance.now();
      };
      window.addEventListener('pointermove', onMove, { passive: true });

      let clock = 0;
      let tAcc = 6;
      let raf = 0;
      let running = false;
      let last = performance.now();
      const frame = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        clock += dt;
        tAcc += dt * 0.9;
        if (now - mouse.last > 2500) {
          mouse.tx = Math.sin(clock * 0.3) * (w / h) * 0.7;
          mouse.ty = Math.cos(clock * 0.23) * 0.4;
        }
        mouse.x += (mouse.tx - mouse.x) * Math.min(1, dt * 4);
        mouse.y += (mouse.ty - mouse.y) * Math.min(1, dt * 4);
        shared.uMouse.value = [mouse.x, mouse.y];
        shared.uTime.value = tAcc;
        shared.uIntro.value = ease(clock / 1.2);
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
      const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: '80px' });
      io.observe(stage);
      cleanup = () => {
        stop();
        io.disconnect();
        ro.disconnect();
        window.removeEventListener('pointermove', onMove);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      };
    };

    void boot();
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div ref={stageRef} aria-hidden="true" className={`absolute inset-0 ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
