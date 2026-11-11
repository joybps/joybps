import type Lenis from 'lenis';

let instance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis;
};

/** Jump to the top (used on route change). */
export const scrollToTop = () => {
  if (instance) instance.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo({ top: 0 });
};

/** Smoothly scroll to an element id, below the sticky navbar. */
export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (instance) instance.scrollTo(el, { offset: -72, duration: 1.3 });
  else el.scrollIntoView({ behavior: 'smooth' });
};
