import React from 'react';
import Link from 'next/link';
import { JoybpsLogo } from './JoybpsLogo';
import { SERVICES } from '../data/services';
import { PROJECTS } from '../data/portfolio';
import { SITE } from '../lib/site';

const COMPANY = [
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Clients', href: '#clients' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
];

const Col: React.FC<{ title: string; links: { label: string; href: string; external?: boolean }[] }> = ({ title, links }) => (
  <nav aria-label={title}>
    <p className="text-[12px] font-bold uppercase tracking-wider text-slate-400 mb-3">{title}</p>
    <ul className="space-y-2">
      {links.map((l) => (
        <li key={l.label}>
          {l.external ? (
            <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-[13.5px] text-slate-600 hover:text-slate-950 transition-colors">{l.label}<span className="sr-only"> (opens in a new tab)</span></a>
          ) : (
            <Link href={l.href} className="text-[13.5px] text-slate-600 hover:text-slate-950 transition-colors">{l.label}</Link>
          )}
        </li>
      ))}
    </ul>
  </nav>
);

export const SiteFooter: React.FC = () => (
  <footer className="bg-white border-t border-sky-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link href="/" aria-label="Joybps home"><JoybpsLogo /></Link>
          <p className="mt-3 text-[13.5px] text-slate-600 leading-relaxed max-w-xs">{SITE.tagline}. We design and build websites, applications and custom software for businesses.</p>
          <p className="mt-4 text-[13px] text-slate-500">
            <a href={`mailto:${SITE.email}`} className="hover:text-slate-950 transition-colors">{SITE.email}</a>
            {SITE.phone && <><br /><a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="hover:text-slate-950 transition-colors">{SITE.phone}</a></>}
            <br />{SITE.office}
          </p>
        </div>
        <Col title="Services" links={SERVICES.map((s) => ({ label: s.name, href: '#services' }))} />
        <Col title="Portfolio" links={PROJECTS.slice(0, 5).map((p) => ({ label: p.name, href: p.url, external: true }))} />
        <Col title="Company" links={COMPANY} />
      </div>
      <div className="mt-10 pt-6 border-t border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12.5px] text-slate-500">
        <p>© {new Date().getFullYear()} {SITE.legalName}. All rights reserved.</p>
        <p>Joybps is the brand of {SITE.legalName}.</p>
      </div>
    </div>
  </footer>
);
