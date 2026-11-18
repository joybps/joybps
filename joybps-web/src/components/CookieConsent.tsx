'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';
import { getConsent, setConsent, REOPEN_EVENT } from '../lib/consent';

/**
 * Cookie bar pinned to the bottom of the screen. "Accept all" turns on analytics; "Essential only" keeps only the
 * cookies the site needs. The choice is remembered for 12 months and can be changed from the footer.
 */
export const CookieConsent: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!getConsent()) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(REOPEN_EVENT, reopen);
    return () => window.removeEventListener(REOPEN_EVENT, reopen);
  }, []);

  if (!open) return null;

  const choose = (c: 'all' | 'essential') => {
    setConsent(c);
    setOpen(false);
  };

  return (
    <div role="region" aria-label="Cookie consent" className="cookie-bar fixed inset-x-3 bottom-3 sm:inset-x-6 sm:bottom-5 z-[60] mx-auto max-w-4xl rounded-2xl border border-sky-200 bg-white/95 backdrop-blur-md shadow-float p-4 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <span aria-hidden="true" className="shrink-0 w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center"><Cookie className="w-[18px] h-[18px]" /></span>
        <p className="text-[13px] sm:text-[13.5px] leading-relaxed text-slate-600">
          We use cookies to keep the site working and, with your permission, to understand how it is used.{' '}
          <Link href="/cookie-policy" className="font-semibold text-sky-700 hover:text-sky-900 underline underline-offset-2">Cookie policy</Link>
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button type="button" onClick={() => choose('essential')} className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-white border border-sky-200 text-slate-800 text-[13px] font-semibold hover:bg-sky-50 hover:border-sky-300 active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
          Essential only
        </button>
        <button type="button" onClick={() => choose('all')} className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-slate-950 text-white text-[13px] font-semibold hover:bg-slate-800 active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2">
          Accept all
        </button>
      </div>
    </div>
  );
};
