'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { gsap, useGSAP, MOTION_OK } from '../animation';

/** A link that leans toward the cursor and springs back. Fine pointers only; static for touch and reduced motion. */
export const MagneticLink: React.FC<React.ComponentProps<typeof Link> & { strength?: number }> = ({ children, strength = 0.28, ...rest }) => {
  const ref = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (hover: hover) and (pointer: fine)`, () => {
        const el = ref.current;
        if (!el) return;
        const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
        const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          x((e.clientX - (r.left + r.width / 2)) * strength);
          y((e.clientY - (r.top + r.height / 2)) * strength);
        };
        const leave = () => {
          x(0);
          y(0);
        };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        return () => {
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerleave', leave);
        };
      });
    },
    { scope: ref },
  );

  return (
    <Link ref={ref} {...rest}>
      {children}
    </Link>
  );
};
