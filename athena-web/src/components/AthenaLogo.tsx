import React from 'react';

/** Wordmark only: just the word "Athena". */
export const AthenaLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span className={`inline-flex items-center text-[22px] font-bold tracking-[-0.04em] text-slate-950 leading-none ${className}`}>
    Athena
  </span>
);
