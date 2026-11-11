'use client';

import React, { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK, runWhileVisible } from '../animation';

/* GSAP-powered primitives. Names/props are kept from the previous Motion-based
   version so existing call sites keep working. */

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  /** Horizontal slide distance in px (negative = from the left). */
  x?: number;
}

/** Fades and lifts its content in once, when it scrolls into view. */
export const Reveal: React.FC<RevealProps> = ({ children, className = '', delay = 0, yOffset = 20, x = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(ref.current, {
          autoAlpha: 0,
          y: yOffset + 12,
          x,
          duration: 0.9,
          delay,
          clearProps: 'transform',
          scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

interface StaggerGroupProps {
  children: React.ReactNode;
  className?: string;
  /** Items to stagger, resolved inside the wrapper. */
  selector?: string;
  x?: number;
  y?: number;
  stagger?: number;
}

/** Staggers a set of descendants in when the wrapper scrolls into view. */
export const StaggerGroup: React.FC<StaggerGroupProps> = ({
  children,
  className = '',
  selector = ':scope > *',
  x = 0,
  y = 16,
  stagger = 0.05,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const items = ref.current?.querySelectorAll(selector);
        if (!items || !items.length) return;
        gsap.from(items, {
          autoAlpha: 0,
          x,
          y,
          duration: 0.6,
          stagger,
          ease: 'power2.out',
          clearProps: 'transform',
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

interface CountUpProps {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

/** Counts a number up from 0 when it scrolls into view. */
export const CountUp: React.FC<CountUpProps> = ({ to, prefix = '', suffix = '', duration = 1.4, className }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const el = ref.current;
        if (!el) return;
        const state = { v: 0 };
        el.textContent = `${prefix}0${suffix}`;
        gsap.to(state, {
          v: to,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${prefix}${Math.round(state.v)}${suffix}`;
          },
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      {prefix}
      {to}
      {suffix}
    </span>
  );
};

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  /** Seconds for one full loop. */
  duration?: number;
  /** false = right to left, true = left to right. */
  reverse?: boolean;
}

/** Endless auto-scrolling strip. Slows down while hovered. Children are repeated to fill the width. */
export const Marquee: React.FC<MarqueeProps> = ({ children, className = '', duration = 40, reverse = false }) => {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const track = trackRef.current;
        const wrap = ref.current;
        if (!track || !wrap) return;

        const tween = gsap.fromTo(
          track,
          { xPercent: reverse ? -50 : 0 },
          { xPercent: reverse ? 0 : -50, duration, ease: 'none', repeat: -1 },
        );
        const slow = () => gsap.to(tween, { timeScale: 0.15, duration: 0.6 });
        const normal = () => gsap.to(tween, { timeScale: 1, duration: 0.6 });
        wrap.addEventListener('mouseenter', slow);
        wrap.addEventListener('mouseleave', normal);
        const stopWatching = runWhileVisible(wrap, [tween]);
        return () => {
          stopWatching();
          wrap.removeEventListener('mouseenter', slow);
          wrap.removeEventListener('mouseleave', normal);
        };
      });
    },
    { scope: ref },
  );

  const half = (hidden: boolean) => (
    <div className="flex shrink-0 gap-4 pr-4" aria-hidden={hidden || undefined}>
      {children}
      {children}
    </div>
  );

  return (
    <div
      ref={ref}
      className={`overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)] ${className}`}
    >
      <div ref={trackRef} className="flex w-max">
        {half(false)}
        {half(true)}
      </div>
    </div>
  );
};

interface ParallaxLayerProps {
  children: React.ReactNode;
  className?: string;
  offset?: number;
}

/** Moves its content vertically as the page scrolls past it. */
export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({ children, className = '', offset = 30 }) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
        gsap.fromTo(
          ref.current,
          { y: offset },
          {
            y: -offset,
            ease: 'none',
            scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  distance?: number;
}

/** Gentle endless floating motion. */
export const FloatingCard: React.FC<FloatingCardProps> = ({
  children,
  className = '',
  duration = 5,
  delay = 0,
  distance = 6,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tween = gsap.fromTo(
          ref.current,
          { y: -distance / 2 },
          { y: distance / 2, duration, delay, repeat: -1, yoyo: true, ease: 'sine.inOut' },
        );
        return runWhileVisible(ref.current, [tween]);
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};
