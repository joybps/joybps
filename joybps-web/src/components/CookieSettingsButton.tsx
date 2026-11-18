'use client';

import React from 'react';
import { reopenConsent } from '../lib/consent';

/** Footer link that re-opens the cookie bar so visitors can change their choice. */
export const CookieSettingsButton: React.FC = () => (
  <button type="button" onClick={reopenConsent} className="text-[13.5px] text-slate-600 hover:text-slate-950 transition-colors cursor-pointer">
    Cookie settings
  </button>
);
