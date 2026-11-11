import type { RefObject } from 'react';
import { gsap, SplitText, useGSAP, MOTION_OK } from './gsap';

/**
 * Section heading reveal: pill fades in, the title is split into lines that rise out of a mask,
 * and the paragraph follows. Looks for [data-h-pill], [data-h-title], [data-h-text] inside `scope`.
 */
export function useHeadingReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // fresh object per tween (a shared one gets mutated by ScrollTrigger). No `once`: it deletes the trigger mid-refresh and can crash GSAP.
        const st = () => ({ trigger: root, start: 'top 85%', toggleActions: 'play none none none' });
        const pill = root.querySelector('[data-h-pill]');
        const title = root.querySelector<HTMLElement>('[data-h-title]');
        const text = root.querySelector('[data-h-text]');

        if (pill) gsap.from(pill, { autoAlpha: 0, y: 14, duration: 0.5, scrollTrigger: st() });

        if (title) {
          SplitText.create(title, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, { yPercent: 110, duration: 0.9, stagger: 0.1, delay: 0.1, scrollTrigger: st() }),
          });
        }

        if (text) gsap.from(text, { autoAlpha: 0, y: 16, duration: 0.7, delay: 0.3, scrollTrigger: st() });
      });
    },
    { scope },
  );
}
