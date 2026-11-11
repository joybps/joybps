'use client';

import { useEffect, useRef, type RefObject } from 'react';

export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Types `text` into `setter` one character at a time. Returns false if the loop was stopped. */
export async function typeInto(setter: (s: string) => void, text: string, perChar: number, alive: () => boolean) {
  for (let i = 1; i <= text.length; i++) {
    if (!alive()) return false;
    setter(text.slice(0, i));
    await sleep(perChar + Math.random() * perChar * 0.6);
  }
  return true;
}

/**
 * Runs `run` in an endless loop while the element is on screen; stops when it leaves view.
 * Reduced-motion users get no loop (callers render a static state).
 */
export function useVisibleLoop(ref: RefObject<HTMLElement | null>, run: (alive: () => boolean) => Promise<void>, threshold = 0.3) {
  const runRef = useRef(run);
  runRef.current = run;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let token = 0;
    let running = false;

    const start = () => {
      if (running) return;
      running = true;
      const mine = ++token;
      const alive = () => token === mine;
      (async () => {
        while (alive()) await runRef.current(alive);
      })();
    };
    const stop = () => {
      running = false;
      token++;
    };

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { threshold });
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
  }, [ref, threshold]);
}
