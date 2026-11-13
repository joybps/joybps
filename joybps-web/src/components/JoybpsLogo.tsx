import React from 'react';

/** The Joybps logo (dark on transparent; use on light backgrounds). */
export const JoybpsLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src="/joybps-logo.png" alt="Joybps" width={1331} height={171} className={`block h-[22px] w-auto ${className}`} />
);
