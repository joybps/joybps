'use client';

import React from 'react';
import { useNavigate } from '../router';
import { IrisHero } from './IrisHero';
import { AgentsSection } from './AgentsSection';
import { WidgetSection } from './WidgetSection';
import { VoiceSection } from './VoiceSection';
import { HandoffSection } from './HandoffSection';
import { DashboardSection } from './DashboardSection';
import { TenantsSection } from './TenantsSection';
import { HowItWorksSection } from './HowItWorksSection';
import { IntegrationsSection } from './IntegrationsSection';
import { IndustriesSection } from './IndustriesSection';
import { FeaturesSection } from './FeaturesSection';
import { PricingSection } from './PricingSection';
import { CTASection } from './CTASection';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <IrisHero onOpenDemo={() => navigate('/contact')} />
      <AgentsSection />
      <WidgetSection />
      <VoiceSection />
      <HandoffSection />
      <DashboardSection />
      <TenantsSection />
      <HowItWorksSection />
      <IntegrationsSection />
      <IndustriesSection />
      <FeaturesSection />
      <PricingSection />
      <CTASection />
    </>
  );
};
