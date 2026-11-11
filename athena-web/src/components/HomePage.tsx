'use client';

import React from 'react';
import { useNavigate } from '../router';
import { AthenaHero } from './AthenaHero';
import { FeatureCardsScroller } from './FeatureCardsScroller';
import { ProjectTimeline } from './ProjectTimeline';
import { EstimateDemoSection } from './EstimateDemoSection';
import { CrewBillingShowcase } from './CrewBillingShowcase';
import { IndustriesSection } from './IndustriesSection';
import { QuoteSection } from './QuoteSection';
import { PricingSection } from './PricingSection';
import { ContactSection } from './ContactSection';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <AthenaHero onOpenDemo={() => navigate('/contact')} />
      <FeatureCardsScroller />
      <ProjectTimeline />
      <EstimateDemoSection />
      <CrewBillingShowcase />
      <IndustriesSection />
      <PricingSection />
      <ContactSection />
      <QuoteSection />
    </>
  );
};
