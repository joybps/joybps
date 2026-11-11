'use client';

import React from 'react';
import { Plug, Globe, FileSpreadsheet, PhoneCall, Mail, Database, Webhook } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Marquee } from './MotionPrimitives';

const MetaIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <circle cx="24" cy="24" r="22" fill="#0081FB" />
    <path
      d="M34.8 24C34.8 18 30 13.2 24 13.2C18 13.2 13.2 18 13.2 24C13.2 29.4 17.2 33.9 22.4 34.7V27.1H19.6V24H22.4V21.6C22.4 18.8 24 17.3 26.5 17.3C27.7 17.3 29 17.5 29 17.5V20.2H27.6C26.2 20.2 25.8 21.1 25.8 22V24H28.8L28.3 27.1H25.8V34.7C30.9 33.9 34.8 29.4 34.8 24Z"
      fill="#FFFFFF"
    />
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
    <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
  </svg>
);

const lucide = (Icon: React.ElementType) => () => <Icon className="w-6 h-6 text-sky-700" />;

const INTEGRATIONS: { name: string; text: string; icon: React.FC }[] = [
  { name: 'Facebook & Instagram', text: 'Meta Ads lead forms sync straight into your CRM.', icon: MetaIcon },
  { name: 'Google Ads', text: 'Capture the leads your Google campaigns generate.', icon: GoogleIcon },
  { name: 'Website', text: 'Collect enquiries from your website forms automatically.', icon: lucide(Globe) },
  { name: 'Excel', text: 'Import and export your data with spreadsheets.', icon: lucide(FileSpreadsheet) },
  { name: 'Phone calls', text: 'Make and track customer calls from inside Affina.', icon: lucide(PhoneCall) },
  { name: 'Email', text: 'Keep customer emails connected to their records.', icon: lucide(Mail) },
  { name: 'Database', text: 'Connect your existing databases to keep data in sync.', icon: lucide(Database) },
];

const OTHER_TOOLS = ['Zoho', 'HubSpot', 'Other CRMs', 'Business software'];

const cardCls =
  'w-[270px] sm:w-[300px] shrink-0 rounded-3xl border p-6 transition-colors duration-200';

export const IntegrationsSection: React.FC = () => (
  <section id="integrations" className="relative py-20 sm:py-28 bg-white border-b border-sky-100 overflow-hidden">
    <div aria-hidden="true" className="aurora aurora-indigo top-8 -right-40 w-[440px] h-[440px]" />
    <div aria-hidden="true" className="aurora aurora-sky bottom-0 -left-40 w-[400px] h-[400px]" />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading
        icon={Plug}
        pill="Seamless Connectivity"
        title="Connect Every Lead Source and Tool"
        text="Bring leads and data into Affina from the places you already work, and keep everything in one CRM."
      />
    </div>

    {/* Auto-scrolling strip, right to left. Pauses (slows) on hover. */}
    <Marquee duration={55} className="py-3">
      {INTEGRATIONS.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.name} className={`${cardCls} border-sky-100 bg-slate-50/60 hover:bg-white hover:border-sky-300 hover:shadow-card`}>
            <div className="w-12 h-12 rounded-2xl bg-white border border-sky-200 shadow-2xs flex items-center justify-center mb-4">
              <Icon />
            </div>
            <h3 className="text-[16px] font-bold text-slate-950 mb-1.5">{item.name}</h3>
            <p className="text-[13.5px] text-slate-600 leading-relaxed">{item.text}</p>
          </div>
        );
      })}

      <div className={`${cardCls} border-sky-300 bg-sky-50/60 ring-1 ring-sky-100`}>
        <div className="w-12 h-12 rounded-2xl bg-white border border-sky-200 shadow-2xs flex items-center justify-center mb-4">
          <Webhook className="w-6 h-6 text-sky-700" />
        </div>
        <h3 className="text-[16px] font-bold text-slate-950 mb-1.5">Other CRMs & tools</h3>
        <p className="text-[13.5px] text-slate-600 leading-relaxed mb-3">
          Integrate with external CRMs and software through APIs and webhooks.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {OTHER_TOOLS.map((t) => (
            <span key={t} className="px-2.5 py-1 rounded-md bg-white border border-sky-200 text-[12px] font-semibold text-sky-800">
              {t}
            </span>
          ))}
        </div>
      </div>
    </Marquee>
  </section>
);
