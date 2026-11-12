import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { JsonLd } from './JsonLd';
import { breadcrumbLd } from '../lib/seo';

export interface Crumb {
  name: string;
  path: string;
}

/** Visible breadcrumb trail plus BreadcrumbList structured data. The last crumb is the current page. */
export const Breadcrumbs: React.FC<{ items: Crumb[] }> = ({ items }) => {
  const all = [{ name: 'Home', path: '/' }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbLd(all)} />
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        <ol className="flex flex-wrap items-center gap-1.5 text-[12.5px] text-slate-500">
          {all.map((c, i) => (
            <li key={c.path} className="flex items-center gap-1.5">
              {i < all.length - 1 ? (
                <>
                  <Link href={c.path} className="hover:text-slate-950 transition-colors">{c.name}</Link>
                  <ChevronRight className="w-3 h-3" aria-hidden="true" />
                </>
              ) : (
                <span aria-current="page" className="font-semibold text-slate-700">{c.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};
