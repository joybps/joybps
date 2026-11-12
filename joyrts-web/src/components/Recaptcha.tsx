'use client';

import React, { useEffect, useRef } from 'react';

interface Grecaptcha {
  render: (el: HTMLElement, opts: Record<string, unknown>) => number;
  reset: (id?: number) => void;
}
declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
    __recaptchaReady?: (() => void)[];
    onRecaptchaLoad?: () => void;
  }
}

const SRC = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';

/** Google reCAPTCHA checkbox. Calls onToken with the token, or '' when it expires or fails. Changing resetKey clears it. */
export const Recaptcha: React.FC<{ onToken: (t: string) => void; resetKey?: number }> = ({ onToken, resetKey = 0 }) => {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<number | null>(null);
  const cb = useRef(onToken);
  cb.current = onToken;
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !box.current) return;
    const mount = () => {
      if (!box.current || widget.current !== null || !window.grecaptcha) return;
      widget.current = window.grecaptcha.render(box.current, {
        sitekey: siteKey,
        callback: (t: string) => cb.current(t),
        'expired-callback': () => cb.current(''),
        'error-callback': () => cb.current(''),
      });
    };
    if (window.grecaptcha?.render) {
      mount();
    } else {
      (window.__recaptchaReady ||= []).push(mount);
      window.onRecaptchaLoad = () => (window.__recaptchaReady || []).splice(0).forEach((f) => f());
      if (!document.querySelector('script[data-recaptcha]')) {
        const s = document.createElement('script');
        s.src = SRC;
        s.async = true;
        s.defer = true;
        s.dataset.recaptcha = '1';
        document.head.appendChild(s);
      }
    }
  }, [siteKey]);

  useEffect(() => {
    if (resetKey && widget.current !== null) window.grecaptcha?.reset(widget.current);
  }, [resetKey]);

  if (!siteKey) return <p className="text-[12px] text-indigo-600">reCAPTCHA is not configured (missing site key).</p>;
  return <div ref={box} />;
};
