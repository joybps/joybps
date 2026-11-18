'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { getConsent, onConsentChange } from '../lib/consent';

/**
 * Google Analytics 4. Needs NEXT_PUBLIC_GA_ID, and loads only after the visitor chooses "Accept all" in the cookie bar,
 * so nothing is sent to Google before consent. Choosing "Essential only" later switches it off and clears its cookies.
 * GA4 tracks client-side page changes itself (enhanced measurement).
 */
export const GoogleAnalytics: React.FC = () => {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!id) return;
    setAllowed(getConsent() === 'all');
    return onConsentChange((c) => {
      if (c === 'all') {
        (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = false;
        setAllowed(true);
      } else {
        (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = true;
        document.cookie.split('; ').forEach((kv) => {
          const name = kv.split('=')[0];
          if (name === '_ga' || name.startsWith('_ga_') || name === '_gid') document.cookie = `${name}=; Max-Age=0; Path=/`;
        });
        setAllowed(false);
      }
    });
  }, [id]);

  if (!id || !allowed) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="lazyOnload" />
      <Script id="ga4-init" strategy="lazyOnload">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true});`}
      </Script>
    </>
  );
};
