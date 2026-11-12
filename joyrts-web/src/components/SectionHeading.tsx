'use client';

import React, { useRef } from 'react';
import { useHeadingReveal } from '../animation/useHeadingReveal';

interface SectionHeadingProps {
  icon?: React.ReactElement<{ className?: string }>;
  pill: string;
  title: string;
  text?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ icon, pill, title, text }) => {
  const ref = useRef<HTMLDivElement>(null);
  useHeadingReveal(ref);

  return (
    <div ref={ref} className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
      <div
        data-h-pill
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[12px] font-semibold mb-3"
      >
        {icon && React.cloneElement(icon, { className: "w-3.5 h-3.5 text-sky-600" })}
        <span>{pill}</span>
      </div>
      <h2
        data-h-title
        className="text-[32px] sm:text-[44px] font-bold tracking-tight text-slate-950 leading-tight mb-4"
      >
        {title}
      </h2>
      {text && (
        <p data-h-text className="text-[16px] sm:text-[17px] text-slate-600 leading-relaxed">
          {text}
        </p>
      )}
    </div>
  );
};

interface PageHeaderProps {
  pill: string;
  title: string;
  text: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ pill, title, text }) => {
  const ref = useRef<HTMLDivElement>(null);
  useHeadingReveal(ref);

  return (
    <section className="relative bg-white border-b border-sky-100 py-16 sm:py-20 overflow-hidden">
      <div ref={ref} className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          data-h-pill
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[12px] font-semibold mb-3"
        >
          {pill}
        </div>
        <h1
          data-h-title
          className="text-[36px] sm:text-[50px] font-bold tracking-[-0.03em] text-slate-950 leading-[1.08] mb-4"
        >
          {title}
        </h1>
        <p data-h-text className="text-[16px] sm:text-[17px] text-slate-600 leading-relaxed">
          {text}
        </p>
      </div>
    </section>
  );
};
