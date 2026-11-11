'use client';

import React from 'react';

interface AffinaLogoProps {
  className?: string;
}

// Wordmark only — no icon.
export const AffinaLogo: React.FC<AffinaLogoProps> = ({ className = '' }) => (
  <span
    className={`inline-block select-none text-[22px] font-bold tracking-tight text-slate-950 leading-none ${className}`}
  >
    Affina
  </span>
);
