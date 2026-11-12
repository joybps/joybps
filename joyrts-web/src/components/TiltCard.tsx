'use client';

import React, { useRef } from 'react';

/** A card that tilts toward the pointer in 3D and carries a moving light (the .spotlight CSS vars). Touch and reduced motion: static. */
export const TiltCard: React.FC<React.HTMLAttributes<HTMLDivElement> & { accent?: string }> = ({ className = '', children, accent, style, ...rest }) => {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.transition = 'transform 0.2s ease-out';
      const z = r.width / (el.offsetWidth || 1) || 1;
      el.style.setProperty('--mx', `${(e.clientX - r.left) / z}px`);
      el.style.setProperty('--my', `${(e.clientY - r.top) / z}px`);
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.style.transform = `perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg) translateY(-6px)`;
      }
    });
  };
  const leave = () => {
    cancelAnimationFrame(raf.current);
    const el = ref.current;
    if (!el) return;
    el.style.transition = 'transform 0.4s ease-out';
    el.style.transform = '';
    window.setTimeout(() => (el.style.transition = ''), 420);
  };

  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      className={`spotlight ${className}`}
      style={{ ...style, ['--c' as string]: accent }}
      {...rest}
    >
      <span aria-hidden="true" className="pc-border" />
      {children}
    </div>
  );
};
