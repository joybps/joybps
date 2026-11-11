import React from 'react';
import Link from 'next/link';
import { IrisLogo } from './IrisLogo';
import { routeHref, type Route } from '../router';

const LINKS: { label: string; route: Route }[] = [
  { label: 'Home', route: '/' },
  { label: 'Features', route: '/features' },
  { label: 'Industries', route: '/industries' },
  { label: 'Pricing', route: '/pricing' },
  { label: 'FAQ', route: '/faq' },
  { label: 'Contact', route: '/contact' },
];

export const SiteFooter: React.FC = () => (
  <footer className="bg-white border-t border-sky-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
      <Link href={routeHref('/')} aria-label="Iris home">
        <IrisLogo />
      </Link>

      <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
        {LINKS.map((l) => (
          <Link key={l.route} href={routeHref(l.route)} className="text-[13.5px] text-slate-600 hover:text-slate-950 transition-colors">
            {l.label}
          </Link>
        ))}
      </nav>

      <p className="text-[12.5px] text-slate-500">© {new Date().getFullYear()} Iris. All rights reserved.</p>
    </div>
  </footer>
);
