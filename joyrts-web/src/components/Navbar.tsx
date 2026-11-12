'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '../animation';
import { JoyrtsLogo } from './JoyrtsLogo';
import { useRoute } from '../router';

export const NAV_LINKS = [  { label: 'Services', href: '/services' },  { label: 'Products', href: '/products' },  { label: 'Demos', href: '/demos' },  { label: 'Reviews', href: '/testimonials' },  { label: 'About', href: '/about' },  { label: 'Contact', href: '/contact' },];

/** Same structure as the product sites' navbar: wordmark left, plain text links, one dark button, simple dropdown on mobile. */
export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const current = useRoute();
  const headerRef = useRef<HTMLElement>(null);
  const isActive = (href: string) => current === href || current.startsWith(href + '/');

  useGSAP(
    () => {
      ScrollTrigger.create({ start: 40, end: 'max', onToggle: (self) => setScrolled(self.isActive) });
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(headerRef.current, { yPercent: -100, autoAlpha: 0, duration: 0.9, delay: 0.1, clearProps: 'transform' });
      });
    },
    { scope: headerRef },
  );

  // close the menu when the route changes
  useEffect(() => setMobileOpen(false), [current]);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-40 w-full backdrop-blur-md border-b transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled ? 'bg-white/95 border-sky-200 shadow-card' : 'bg-white/75 border-sky-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded-lg" aria-label="Joyrts Home">
          <JoyrtsLogo />
        </Link>

        <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-6 text-[14px] font-medium text-slate-600">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={`hover:text-slate-950 transition-colors duration-150 whitespace-nowrap shrink-0 py-1 ${isActive(link.href) ? 'text-slate-950' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-[13px] font-semibold text-white bg-slate-950 rounded-lg hover:bg-slate-800 active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
          >
            Start a project
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-sky-100 bg-white px-4 py-4 space-y-1 shadow-card">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center min-h-[44px] px-3 rounded-lg text-[15px] font-medium text-slate-700 hover:bg-sky-50 hover:text-slate-950 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="w-full min-h-[44px] inline-flex items-center justify-center px-4 py-2.5 text-[14px] font-semibold text-white bg-slate-950 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Start a project
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
