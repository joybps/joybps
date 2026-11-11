'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  gsap,
  ScrollTrigger,
  SmoothScroll,
  useGSAP,
  MOTION_OK,
  watchOffscreenSections,
  scrollToTop,
} from '../animation';
import { Navbar } from './Navbar';
import { SiteFooter } from './SiteFooter';

/** Page chrome shared by every route: smooth scroll, navbar, animated page area, footer. */
export const SiteShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const route = usePathname();
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  // Switch off CSS animations in sections that are scrolled out of view (performance only).
  useEffect(() => watchOffscreenSections(), [route]);

  // Page transition on route change + re-measure ScrollTrigger for the new page.
  useGSAP(
    () => {
      const isFirst = firstRender.current;
      firstRender.current = false;
      if (!isFirst) scrollToTop();

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        if (!isFirst) {
          gsap.fromTo(
            mainRef.current,
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.55, clearProps: 'transform' },
          );
        }
      });

      const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => cancelAnimationFrame(raf);
    },
    { dependencies: [route], revertOnUpdate: true },
  );

  return (
    <>
      <SmoothScroll />
      <div className="min-h-screen bg-white text-slate-950 flex flex-col antialiased selection:bg-sky-100 selection:text-slate-900">
        <Navbar />
        <main ref={mainRef} className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </div>
    </>
  );
};
