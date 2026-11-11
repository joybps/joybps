import type { Metadata } from 'next';
import { pageMeta } from '../../lib/site';
import { PageHeader } from '../../components/SectionHeading';
import { ModulesSection } from '../../components/ModulesSection';
import { AIChatSection } from '../../components/AIChatSection';
import { RolesSection } from '../../components/RolesSection';
import { PlatformSection } from '../../components/PlatformSection';
import { InsightsSection } from '../../components/InsightsSection';
import { CTASection } from '../../components/CTASection';

export const metadata: Metadata = pageMeta('Features', 'Hestia HRMS features: attendance and shifts, leave, employees, documents, projects and tasks, performance, payroll, hiring and an AI chat assistant.', '/features');

export default function Page() {
  return (
    <>
      <PageHeader
        pill="Features"
        title="Everything your people team needs"
        text="Attendance, leave, tasks, payroll, hiring and more, with role-based access and an AI assistant, in one multi-tenant platform."
      />
      <ModulesSection showHeading={false} />
      <AIChatSection />
      <RolesSection />
      <PlatformSection />
      <InsightsSection />
      <CTASection />
    </>
  );
}
