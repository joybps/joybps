import { Wrench, Briefcase } from 'lucide-react';
import { JoybpsHero } from './JoybpsHero';
import { ClientLogos } from './ClientLogos';
import { SectionHeading } from './SectionHeading';
import { PortfolioShowcase } from './PortfolioShowcase';
import { Band, ServicesGrid, StatsBand, TestimonialsSection, CTABand } from './Sections';

export const HomePage = () => (
  <>
    <JoybpsHero />
    <StatsBand />
    <Band id="services">
      <SectionHeading icon={<Wrench />} pill="What we build" title="Digital work, built to last." text="From a first website to a custom platform, we design, build and support what your business runs on." />
      <ServicesGrid />
    </Band>
    <Band id="portfolio" tone="dots">
      <SectionHeading icon={<Briefcase />} pill="Portfolio" title="Recent work for growing businesses." text="A selection of websites and digital products we have designed, built and launched." />
      <PortfolioShowcase />
    </Band>
    <ClientLogos />
    <TestimonialsSection />
    <CTABand />
  </>
);
