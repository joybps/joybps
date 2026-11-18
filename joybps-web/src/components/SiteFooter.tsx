import React from 'react';
import Link from 'next/link';
import { JoybpsLogo } from './JoybpsLogo';
import { PRODUCTS } from '../data/products';
import { SERVICES } from '../data/services';
import { SITE } from '../lib/site';
import { CookieSettingsButton } from './CookieSettingsButton';

const COMPANY = [
  { label: 'About', href: '/about' },
  { label: 'Demos', href: '/demos' },
  { label: 'Reviews', href: '/testimonials' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];
const LEGAL = [
  { label: 'Privacy policy', href: '/privacy-policy' },
  { label: 'Terms and conditions', href: '/terms-and-conditions' },
  { label: 'Cookie policy', href: '/cookie-policy' },
];

const Col: React.FC<{ title: string; links: { label: string; href: string }[] }> = ({ title, links }) => (
  <nav aria-label={title}>
    <p className="text-[12px] font-bold uppercase tracking-wider text-slate-400 mb-3">{title}</p>
    <ul className="space-y-2">
      {links.map((l) => (
        <li key={l.href}>
          <Link href={l.href} className="text-[13.5px] text-slate-600 hover:text-slate-950 transition-colors">{l.label}</Link>
        </li>
      ))}
    </ul>
  </nav>
);

export const SiteFooter: React.FC = () => (
  <footer className="bg-white border-t border-sky-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <Link href="/" aria-label="Joybps home"><JoybpsLogo /></Link>
          <p className="mt-3 text-[13.5px] text-slate-600 leading-relaxed max-w-xs">{SITE.tagline}. We build AI-powered products and custom software for businesses.</p>
          <p className="mt-4 text-[13px] text-slate-500">
            <a href={`mailto:${SITE.email}`} className="hover:text-slate-950 transition-colors">{SITE.email}</a>
            {SITE.phone && <><br /><a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="hover:text-slate-950 transition-colors">{SITE.phone}</a></>}
            <br />{SITE.office}
          </p>
        </div>
        <Col title="Products" links={PRODUCTS.map((p) => ({ label: p.name, href: `/products/${p.slug}` }))} />
        <Col title="Services" links={SERVICES.map((s) => ({ label: s.name, href: `/services/${s.slug}` }))} />
        <Col title="Company" links={COMPANY} />
        <div>
          <Col title="Legal" links={LEGAL} />
          <div className="mt-2"><CookieSettingsButton /></div>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12.5px] text-slate-500">
        <p>© {new Date().getFullYear()} {SITE.legalName}. All rights reserved.</p>
        <p>Joybps is the brand of {SITE.legalName}.</p>
      </div>
    </div>
  </footer>
);
