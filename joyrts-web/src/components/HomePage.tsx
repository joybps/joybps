import Link from 'next/link';
import { Boxes, Wrench, PlayCircle, ArrowRight } from 'lucide-react';
import { JoyrtsHero } from './JoyrtsHero';
import { ClientLogos } from './ClientLogos';
import { SectionHeading } from './SectionHeading';
import { ProductDemos } from './ProductDemo';
import { Band, ProductsGrid, ServicesGrid, AICapabilities, StatsBand, TestimonialsSection, CTABand } from './Sections';

export const HomePage = () => (
  <>
    <JoyrtsHero />
    <StatsBand />
    <AICapabilities />
    <Band id="services">
      <SectionHeading icon={<Wrench />} pill="What we do" title="Digital work and AI, built to last." text="From a first website to a contact center, we design, build and run what your business needs to grow." />
      <ServicesGrid />
    </Band>
    <Band id="products" tone="dots">
      <SectionHeading icon={<Boxes />} pill="Our products" title="Five AI-powered platforms, ready to use." text="Each product solves one part of running a business, and each is built with intelligence at its core." />
      <ProductsGrid />
    </Band>
    <Band id="demos" tone="grid">
      <SectionHeading icon={<PlayCircle />} pill="Product demos" title="See each product at work." text="Watch a guided walkthrough of the core workflow in every product." />
      <ProductDemos />
      <p className="mt-6 text-center"><Link href="/demos" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-700 hover:text-sky-900">All demos <ArrowRight className="w-4 h-4" aria-hidden="true" /></Link></p>
    </Band>
    <ClientLogos />
    <TestimonialsSection />
    <CTABand />
  </>
);
