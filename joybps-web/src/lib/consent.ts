/** Cookie consent: one choice, stored in a first-party cookie (and localStorage as a fallback) for 12 months. */
export type Consent = 'all' | 'essential';

const KEY = 'joybps_consent';
const EVENT = 'joybps-consent';
const MAX_AGE = 60 * 60 * 24 * 365;

export function getConsent(): Consent | null {
  if (typeof document === 'undefined') return null;
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${KEY}=(all|essential)`));
    if (m) return m[1] as Consent;
  } catch {}
  try {
    const v = window.localStorage.getItem(KEY);
    if (v === 'all' || v === 'essential') return v;
  } catch {}
  return null;
}

export function setConsent(value: Consent) {
  try {
    document.cookie = `${KEY}=${value}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
  } catch {}
  try {
    window.localStorage.setItem(KEY, value);
  } catch {}
  window.dispatchEvent(new CustomEvent<Consent>(EVENT, { detail: value }));
}

/** Subscribe to consent changes. Returns an unsubscribe function. */
export function onConsentChange(fn: (c: Consent) => void) {
  const h = (e: Event) => fn((e as CustomEvent<Consent>).detail);
  window.addEventListener(EVENT, h);
  return () => window.removeEventListener(EVENT, h);
}

/** Re-open the cookie bar (used by the "Cookie settings" link in the footer). */
export const REOPEN_EVENT = 'joybps-consent-reopen';
export const reopenConsent = () => window.dispatchEvent(new Event(REOPEN_EVENT));
