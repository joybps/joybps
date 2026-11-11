'use client';

import React from 'react';
import { Check, ArrowRight, Tag } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal, CountUp } from './MotionPrimitives';
import { useNavigate } from '../router';

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    unit: 'forever',
    blurb: 'For small teams exploring Affina. Full CRM with essential features.',
    features: [
      'Unlimited users & groups',
      'Core CRM (leads, businesses, contacts)',
      'Custom pipeline stages',
      'Basic AI copilot (3 queries/day)',
      'Mobile app (Android)',
      'Community support',
    ],
    cta: 'Start Free Trial',
    featured: false,
  },
  {
    name: 'Professional',
    price: '$49',
    priceNumber: 49,
    unit: '/user/month',
    blurb: 'For growing teams that need AI-powered automation and multi-channel outreach.',
    features: [
      'Everything in Starter',
      'Unlimited AI copilot queries',
      '11 specialized AI agents',
      'WhatsApp & CTI integration',
      'Multi-account Meta Ads',
      'Workflow automation (12 triggers)',
      'Quotation & invoice builder',
      '12+ reports with XLSX export',
      'Priority support',
    ],
    cta: 'Book a Demo',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    unit: '',
    blurb: 'For organizations with industry-specific needs and compliance requirements.',
    features: [
      'Everything in Professional',
      'FinTech / Property / Healthcare verticals',
      'PHI-safe AI with field-level encryption',
      'SSO & SAML authentication',
      'Custom integrations & webhooks',
      'Kubernetes deployment option',
      'Dedicated success manager',
      'SLA guarantee & on-premise option',
    ],
    cta: 'Contact Sales',
    featured: false,
  },
];

interface PricingSectionProps {
  showHeading?: boolean;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ showHeading = true }) => {
  const navigate = useNavigate();
  return (
  <section id="pricing" className="relative py-20 sm:py-28 bg-dot-grid-light border-b border-sky-100 overflow-hidden">
    <div aria-hidden="true" className="aurora aurora-sky top-8 -left-40 w-[440px] h-[440px]" />
    <div aria-hidden="true" className="aurora aurora-indigo bottom-0 -right-40 w-[400px] h-[400px]" />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {showHeading && (
        <SectionHeading
          icon={Tag}
          pill="Pricing"
          title="Simple, Transparent Pricing"
          text="Start free with unlimited users. Scale to AI-powered automation and industry verticals as you grow."
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch max-w-6xl mx-auto">
        {PLANS.map((plan, idx) => (
          <Reveal
            key={plan.name}
            delay={idx * 0.08}
            className={`relative rounded-3xl p-7 sm:p-8 flex flex-col border bg-white ${
              plan.featured
                ? 'border-sky-500 ring-2 ring-sky-200 shadow-float'
                : 'border-sky-100 shadow-card hover:border-sky-300 transition-colors'
            }`}
          >
            {plan.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-bold text-white bg-slate-950 px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}

            <h3 className="text-[20px] font-bold text-slate-950 mb-3">{plan.name}</h3>
            <div className="flex items-baseline gap-1.5 mb-3">
              <span className="text-[40px] font-bold tracking-tight text-slate-950 leading-none tabular-nums">
                {'priceNumber' in plan && plan.priceNumber ? <CountUp to={plan.priceNumber} prefix="$" /> : plan.price}
              </span>
              {plan.unit && <span className="text-[14px] text-slate-500">{plan.unit}</span>}
            </div>
            <p className="text-[14px] text-slate-600 leading-relaxed mb-6 min-h-[63px]">{plan.blurb}</p>

            <ul className="space-y-3 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-slate-700">
                  <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => navigate('/contact')}
              className={`mt-auto w-full py-3.5 px-4 rounded-xl text-[14px] font-semibold transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 ${
                plan.featured
                  ? 'bg-slate-950 text-white hover:bg-slate-800 shadow-sm'
                  : 'bg-sky-50 text-slate-950 border border-sky-200 hover:bg-sky-100/70'
              }`}
            >
              <span>{plan.cta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
  );
};
