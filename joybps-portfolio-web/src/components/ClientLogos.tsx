import React from 'react';
import { Users } from 'lucide-react';
import { Marquee } from './MotionPrimitives';
import { SectionHeading } from './SectionHeading';

const LOGOS = [
  { src: '/pb.png', name: 'Pearlberry Cakes' },
  { src: '/urology_logo_white_transparent.png', name: 'Sanjith Urology' },
  { src: '/gypsos_logo_white_transparent.png', name: 'Gypsos' },
  { src: '/logo_white_transparent.png', name: 'SK Groups', tile: true },
  { src: '/tc.png', name: 'Topchoice Electronics' },
  { src: '/tr.png', name: 'Trusted Realty' },
  { src: '/trp.png', name: 'Trusted Property Management' },
  { src: '/good-sheppard.png', name: 'Good Sheppard Physiotherapy' },
  { src: '/gvc.png', name: 'GVC Reno' },
  { src: '/AandA.png', name: 'A & A Fashion' },
  { src: '/Anya.png', name: 'Anya Creations' },
  { src: '/pizza.png', name: 'Pizza Rock' },
  { src: '/zion.png', name: 'Zion Cabinetry' },
];

/** "Trusted by" strip: client logos in black on white, scrolling right to left. */
export const ClientLogos: React.FC = () => (
  <section id="clients" aria-label="Our clients" className="relative py-20 sm:py-28 bg-white border-b border-sky-100 overflow-hidden">
    <div className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading icon={<Users />} pill="Our clients" title="Trusted by growing businesses." text="Teams across retail, healthcare, real estate and services run their business on what we build." />
      </div>
      <div className="[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <Marquee duration={45}>
          {LOGOS.map((l) => (
            <div key={l.name} className="flex items-center justify-center h-20 w-[170px] sm:w-[200px] shrink-0 px-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={l.src} alt={l.name} loading="lazy" decoding="async" className={`max-h-full max-w-full object-contain opacity-80 hover:opacity-100 transition-opacity brightness-0 ${l.tile ? 'h-16 w-16' : ''}`} />
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  </section>
);
