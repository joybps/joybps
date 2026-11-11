import type { Metadata } from 'next';
import { pageMeta, faqLd, breadcrumbLd } from '../../lib/site';
import { PageHeader } from '../../components/SectionHeading';
import { FAQSection } from '../../components/FAQSection';
import { FAQS } from '../../data/faqs';
import { JsonLd } from '../../components/JsonLd';

export const metadata: Metadata = pageMeta('FAQs', 'Answers to common questions about Joybooks: invoicing, GST, bank feeds, approvals, multi-currency and data security.', '/faq');

export default function Page() {
  return (
    <>
      <JsonLd data={[faqLd(FAQS), breadcrumbLd([{ name: 'FAQs', path: '/faq' }])]} />
      <PageHeader
        pill="FAQs"
        title="Frequently asked questions"
        text="Everything you need to know about Joybooks. Can’t find what you’re looking for? Reach out to our team."
      />
      <FAQSection />
    </>
  );
}
