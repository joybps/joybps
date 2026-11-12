'use client';

import React, { useRef } from 'react';

/** A card whose surface glows softly under the cursor (sets --mx / --my for .spotlight). */
export const SpotlightCard: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...rest }) => {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const z = r.width / (el.offsetWidth || 1) || 1;
    el.style.setProperty('--mx', `${(e.clientX - r.left) / z}px`);
    el.style.setProperty('--my', `${(e.clientY - r.top) / z}px`);
  };

  return (
    <div ref={ref} onMouseMove={onMove} className={`spotlight ${className}`} {...rest}>
      {children}
    </div>
  );
};

/** Small status chip with a blinking live dot. */
export const LiveChip: React.FC<{ label: string; tone?: 'sky' | 'green' | 'amber' }> = ({ label, tone = 'sky' }) => {
  const dot = tone === 'green' ? 'bg-emerald-500' : tone === 'amber' ? 'bg-indigo-500' : 'bg-sky-500';
  const wrap =
    tone === 'green'
      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
      : tone === 'amber'
        ? 'bg-indigo-50 border-indigo-200 text-indigo-800'
        : 'bg-sky-50 border-sky-200 text-sky-800';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${wrap}`}>
      <span className={`anim-blink w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
};
