import { Target, Users, ShieldCheck, Sparkles } from 'lucide-react';
import { PageHeader } from '../../components/SectionHeading';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Band, StatsBand, CTABand } from '../../components/Sections';
import { pageMeta } from '../../lib/seo';
import { SITE } from '../../lib/site';

export const metadata = pageMeta({ title: 'About Us', description: `Joybps is the brand of ${SITE.legalName}, an AI-focused technology company in Chennai building intelligent business products and custom software.`, path: '/about' });

const VALUES = [
  { icon: Target, title: 'Useful before clever', text: 'We add intelligence only where it removes real effort from your team.' },
  { icon: Users, title: 'People in control', text: 'Our AI assists and hands over. A person always has the final say.' },
  { icon: ShieldCheck, title: 'Secure by default', text: 'Role-based access, encryption and careful handling of your data.' },
  { icon: Sparkles, title: 'Craft and clarity', text: 'Clean design, clear code and honest communication on every project.' },
];

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ name: 'About', path: '/about' }]} />
      <PageHeader pill="About" title="An AI technology company, built around real work" text={`Joybps is the brand of ${SITE.legalName}, based in ${SITE.office}.`} />
      <Band tone="dots">
        <div className="max-w-3xl mx-auto space-y-4 text-[16px] text-slate-600 leading-relaxed">
          <h2 className="text-[26px] font-bold text-slate-950">Our story</h2>
          <p>We started by building software for businesses that needed more than an off-the-shelf tool. Along the way, patterns repeated: sales teams lost leads, calls went unanswered, HR ran on spreadsheets, invoices were chased by hand.</p>
          <p>So we turned those patterns into products. Affina, Iris, Hestia, Joybooks and Athena each solve one of them with AI at the core. We still build custom websites, applications and software for clients, and we support everything we ship.</p>
          <h2 className="pt-4 text-[26px] font-bold text-slate-950">What we believe</h2>
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <li key={v.title} className="rounded-3xl bg-white border border-sky-100 shadow-card p-5">
              <span className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3"><v.icon className="w-5 h-5" aria-hidden="true" /></span>
              <h3 className="text-[16px] font-bold text-slate-950 mb-1">{v.title}</h3>
              <p className="text-[13.5px] text-slate-600 leading-relaxed">{v.text}</p>
            </li>
          ))}
        </ul>
      </Band>
      <StatsBand />
      <CTABand />
    </>
  );
}
