import { gsap } from './gsap';

type Anim = gsap.core.Animation;

/**
 * Plays the given endless animations only while `el` is near the viewport and pauses them otherwise,
 * so ambient loops cost nothing once their section has scrolled away.
 * Returns a cleanup function (safe to return from a gsap.matchMedia callback).
 */
export function runWhileVisible(el: Element | null, anims: Anim[], margin = '120px'): () => void {
  if (!el || typeof IntersectionObserver === 'undefined') return () => {};
  const io = new IntersectionObserver(
    ([entry]) => {
      const paused = !entry.isIntersecting;
      anims.forEach((a) => a.paused(paused));
    },
    { rootMargin: margin },
  );
  io.observe(el);
  return () => io.disconnect();
}

/** Runs `onChange(true|false)` as `el` enters / leaves the viewport. Used for per-frame tickers. */
export function onVisibility(el: Element | null, onChange: (visible: boolean) => void, margin = '120px'): () => void {
  if (!el || typeof IntersectionObserver === 'undefined') return () => {};
  const io = new IntersectionObserver(([entry]) => onChange(entry.isIntersecting), { rootMargin: margin });
  io.observe(el);
  return () => {
    io.disconnect();
    onChange(false);
  };
}

/**
 * Switches off CSS animations (bounce, ping, pulse...) inside any <section>/<footer> that is scrolled out
 * of view, by marking it `data-offscreen` (see index.css). Re-run it whenever the page content changes.
 */
export function watchOffscreenSections(root: ParentNode = document): () => void {
  if (typeof IntersectionObserver === 'undefined') return () => {};
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.removeAttribute('data-offscreen');
        else e.target.setAttribute('data-offscreen', '');
      }),
    { rootMargin: '120px' },
  );
  root.querySelectorAll('section, footer').forEach((el) => io.observe(el));
  return () => {
    io.disconnect();
    root.querySelectorAll('[data-offscreen]').forEach((el) => el.removeAttribute('data-offscreen'));
  };
}
