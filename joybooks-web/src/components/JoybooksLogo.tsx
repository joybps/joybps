import React from 'react';

/** Wordmark only: just the word "Joybooks". */
export const JoybooksLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span className={`inline-flex items-center text-[22px] font-bold tracking-[-0.04em] text-slate-950 leading-none ${className}`}>
    Joybooks
  </span>
);
