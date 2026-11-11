'use client';

import React from 'react';
import { useNavigate } from '../router';
import { JoybooksHero } from './JoybooksHero';
import { FeatureCardsScroller } from './FeatureCardsScroller';
import { FinanceTimeline } from './FinanceTimeline';
import { InvoiceDemoSection } from './InvoiceDemoSection';
import { StatsSection } from './StatsSection';
import { PricingSection } from './PricingSection';
import { ContactSection } from './ContactSection';
import { CTASection } from './CTASection';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <JoybooksHero onOpenDemo={() => navigate('/contact')} />
      <FeatureCardsScroller />
      <FinanceTimeline />
      <InvoiceDemoSection />
      <StatsSection />
      <PricingSection />
      <ContactSection />
      <CTASection />
    </>
  );
};
