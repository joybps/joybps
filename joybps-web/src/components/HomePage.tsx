import Link from 'next/link';
import { Boxes, Wrench, PlayCircle, ArrowRight } from 'lucide-react';
import { JoybpsHero } from './JoybpsHero';
import { ClientLogos } from './ClientLogos';
import { SectionHeading } from './SectionHeading';
import { ProductDemos } from './ProductDemo';
import { Band, ProductsGrid, ServicesGrid, AICapabilities, ProcessTimeline, StatsBand, TestimonialsSection, CTABand } from './Sections';

export const HomePage = () => (
  <>
    <JoybpsHero />
    <StatsBand />
    <Band id="products" tone="dots">
      <SectionHeading icon={<Boxes />} pill="Our products" title="Five AI-powered platforms, ready to use." text="Each product solves one part of running a business, and each is built with intelligence at its core." />
      <ProductsGrid />
    </Band>
    <AICapabilities />
    <Band id="services">
      <SectionHeading icon={<Wrench />} pill="What we build" title="Digital work, built to last." text="From a first website to a custom platform, we design, build and support what your business runs on." />
      <ServicesGrid />
    </Band>
    <Band id="demos" tone="grid">
      <SectionHeading icon={<PlayCircle />} pill="Product demos" title="See each product at work." text="Watch a guided walkthrough of the core workflow in every Joybps product." />
      <ProductDemos />
      <p className="mt-6 text-center"><Link href="/demos" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-700 hover:text-sky-900">All demos <ArrowRight className="w-4 h-4" aria-hidden="true" /></Link></p>
    </Band>
    <ClientLogos />
    <ProcessTimeline />
    <TestimonialsSection />
    <CTABand />
  </>
);
