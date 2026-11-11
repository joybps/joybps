'use client';

import React from 'react';
import { useNavigate } from '../router';
import { HestiaHero } from './HestiaHero';
import { ModulesSection } from './ModulesSection';
import { StorySection } from './StorySection';
import { TaskDemoSection } from './TaskDemoSection';
import { AIChatSection } from './AIChatSection';
import { RolesSection } from './RolesSection';
import { PlatformSection } from './PlatformSection';
import { InsightsSection } from './InsightsSection';
import { PricingSection } from './PricingSection';
import { CTASection } from './CTASection';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <HestiaHero onOpenDemo={() => navigate('/contact')} />
      <ModulesSection />
      <StorySection />
      <TaskDemoSection />
      <AIChatSection />
      <RolesSection />
      <PlatformSection />
      <InsightsSection />
      <PricingSection />
      <CTASection />
    </>
  );
};
