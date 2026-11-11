'use client';

import React, { useRef } from 'react';
import { MonitorSmartphone, Laptop, Smartphone, Monitor } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK } from '../animation';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './MotionPrimitives';

/** Abstract CRM screen used inside the device frames. */
const AppScreen: React.FC<{ compact?: boolean }> = ({ compact }) => (
  <div className="w-full h-full flex bg-slate-50">
    {!compact && (
      <div className="w-[18%] bg-slate-900 p-[6%] space-y-[10%]">
        <div className="h-[5%] w-2/3 rounded bg-sky-400" />
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[4%] w-full rounded bg-slate-700" />
        ))}
      </div>
    )}
    <div className="flex-1 p-[4%] space-y-[4%] min-w-0">
      <div className="flex items-center justify-between">
        <div className="h-2 w-1/4 rounded bg-slate-300" />
        <div className="h-2 w-8 rounded-full bg-sky-300" />
      </div>
      <div className={`grid gap-[3%] ${compact ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {(compact ? [0, 1] : [0, 1, 2]).map((i) => (
          <div key={i} className="rounded-md bg-white border border-slate-200 p-[8%] space-y-1.5">
            <div className="h-1.5 w-1/2 rounded bg-slate-200" />
            <div className="h-2.5 w-3/4 rounded bg-slate-800/80" />
          </div>
        ))}
      </div>
      <div className="rounded-md bg-white border border-slate-200 p-[4%] space-y-[5%]">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-sky-400 shrink-0" />
            <div className="h-1.5 flex-1 rounded bg-slate-200" />
            <div className="h-1.5 w-[18%] rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PLATFORMS = [
  { icon: Laptop, title: 'Web application', text: 'Open Affina in any browser. Nothing to install.' },
  { icon: Smartphone, title: 'Mobile app', text: 'Stay on top of leads and customers on the go with the Android app.' },
  { icon: Monitor, title: 'Desktop application', text: 'A dedicated native desktop app for everyday work.' },
];

export const PlatformsSection: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Entrance: each device arrives from a different direction.
        const tl = gsap.timeline({ scrollTrigger: { trigger: stageRef.current, start: 'top 75%', once: true } });
        tl.from('[data-glow]', { autoAlpha: 0, scale: 0.7, duration: 1.2 }, 0)
          .from('[data-device="monitor"]', { autoAlpha: 0, y: 70, duration: 1 }, 0.1)
          .from('[data-device="laptop"]', { autoAlpha: 0, x: -90, duration: 1 }, 0.35)
          .from('[data-device="phone"]', { autoAlpha: 0, x: 70, y: 50, duration: 1 }, 0.55);

        // Parallax: devices drift at different speeds while scrolling (desktop only).
        mm.add('(min-width: 768px)', () => {
          const scrollTrigger = { trigger: stageRef.current, start: 'top bottom', end: 'bottom top', scrub: true };
          gsap.fromTo('[data-device="monitor"]', { yPercent: 4 }, { yPercent: -4, ease: 'none', scrollTrigger });
          gsap.fromTo('[data-device="laptop"]', { yPercent: 14 }, { yPercent: -14, ease: 'none', scrollTrigger });
          gsap.fromTo('[data-device="phone"]', { yPercent: 22 }, { yPercent: -22, ease: 'none', scrollTrigger });
        });
      });
    },
    { scope: stageRef },
  );

  return (
  <section id="platforms" className="relative py-20 sm:py-28 bg-white border-b border-sky-100 overflow-hidden">
    <div aria-hidden="true" className="aurora aurora-indigo top-8 -right-40 w-[440px] h-[440px]" />
    <div aria-hidden="true" className="aurora aurora-sky bottom-0 -left-40 w-[400px] h-[400px]" />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading
        icon={MonitorSmartphone}
        pill="Available Everywhere"
        title="Work From Any Device"
        text="Affina is available as a web application, a mobile app and a native desktop application, so your team gets a consistent experience wherever they work."
      />

      {/* Device composition */}
      <div ref={stageRef} className="relative w-full max-w-4xl mx-auto aspect-[4/3.5] sm:aspect-[16/10] mb-14">
        <div data-glow aria-hidden="true" className="absolute inset-x-[8%] top-[10%] bottom-0 rounded-full bg-radial-blue-hero blur-2xl opacity-80" />

        {/* Desktop monitor */}
        <div data-device="monitor" className="absolute left-[4%] w-[92%] sm:left-[19%] sm:w-[62%] top-0 flex flex-col items-center">
          <div className="w-full aspect-[16/10] rounded-xl border-[7px] sm:border-[10px] border-slate-900 bg-white overflow-hidden shadow-float">
            <AppScreen />
          </div>
          <div className="w-[16%] h-[5%] min-h-3 bg-slate-300" />
          <div className="w-[34%] h-1.5 sm:h-2 rounded-full bg-slate-300" />
        </div>

        {/* Laptop */}
        <div data-device="laptop" className="absolute left-0 bottom-[3%] w-[60%] sm:w-[40%] sm:bottom-[4%] z-10">
          <div className="w-[88%] mx-auto aspect-[16/10] rounded-t-lg border-[5px] sm:border-[7px] border-b-0 border-slate-800 bg-white overflow-hidden shadow-float">
            <AppScreen />
          </div>
          <div className="h-2 sm:h-3 rounded-b-xl bg-gradient-to-b from-slate-300 to-slate-400" />
        </div>

        {/* Phone */}
        <div data-device="phone" className="absolute right-[2%] bottom-0 w-[28%] sm:right-[3%] sm:w-[17%] z-20">
          <div className="relative w-full aspect-[9/18.5] rounded-[14px] sm:rounded-[24px] border-[5px] sm:border-[7px] border-slate-900 bg-white overflow-hidden shadow-float">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[3%] rounded-b-md bg-slate-900 z-10" />
            <AppScreen compact />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PLATFORMS.map((p, idx) => {
          const Icon = p.icon;
          return (
            <Reveal
              key={p.title}
              delay={idx * 0.08}
              className="rounded-3xl border border-sky-100 bg-slate-50/50 p-6 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-[17px] font-bold text-slate-950 mb-1.5">{p.title}</h3>
              <p className="text-[14px] text-slate-600 leading-relaxed">{p.text}</p>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
  );
};
