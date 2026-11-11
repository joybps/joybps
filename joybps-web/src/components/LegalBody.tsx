import React from 'react';
import type { LegalSection } from '../data/legal';
import { SITE } from '../lib/site';

export const LegalBody: React.FC<{ sections: LegalSection[] }> = ({ sections }) => (
  <section className="bg-white border-b border-sky-100 py-14">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8 text-[15.5px] text-slate-700 leading-[1.75]">
      <p className="text-[13px] text-slate-500">Last updated: {SITE.updated}</p>
      {sections.map((s) => (
        <div key={s.h}>
          <h2 className="text-[22px] font-bold text-slate-950 mb-2">{s.h}</h2>
          {s.p?.map((t) => <p key={t} className="mb-3">{t}</p>)}
          {s.ul && <ul className="list-disc pl-6 space-y-1.5">{s.ul.map((t) => <li key={t}>{t}</li>)}</ul>}
        </div>
      ))}
    </div>
  </section>
);
