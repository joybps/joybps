'use client';

import React from 'react';
import { useNavigate } from '../router';
import { AIEcosystemHero } from './AIEcosystemHero';
import { AIAgentsSection } from './AIAgentsSection';
import { PipelineRevenueSection } from './PipelineRevenueSection';
import { WorkflowAutomationSection } from './WorkflowAutomationSection';
import { TryAffinaSection } from './TryAffinaSection';
import { IntegrationsSection } from './IntegrationsSection';
import { FeaturesSection } from './FeaturesSection';
import { PlatformsSection } from './PlatformsSection';
import { IndustriesSection } from './IndustriesSection';
import { PricingSection } from './PricingSection';
import { ContactSection } from './ContactSection';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <AIEcosystemHero onOpenDemo={() => navigate('/contact')} />
      <AIAgentsSection />
      <PipelineRevenueSection />
      <WorkflowAutomationSection />
      <TryAffinaSection />
      <IntegrationsSection />
      <FeaturesSection />
      <PlatformsSection />
      <IndustriesSection />
      <PricingSection />
      <ContactSection />
    </>
  );
};
