export interface Product {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  short: string;
  long: string;
  /** Icon key, resolved in components/Icon.tsx */
  icon: string;
  /** Accent colour used for the orb, chips and glow. */
  accent: string;
  /** Tailwind classes for the icon tile. */
  tone: string;
  features: { title: string; text: string }[];
  audience: string[];
  keywords: string[];
  faqs: { q: string; a: string }[];
  /** Deployed website of the product. Empty until it is live: the button then points to the contact page. */
  url: string;
}

export const PRODUCTS: Product[] = [
  {
    slug: 'affina',
    name: 'Affina',
    category: 'AI-powered CRM',
    tagline: 'One intelligent CRM. Infinite possibilities.',
    short: 'Capture leads from Meta Ads, Google Ads and your website, manage custom pipelines and revenue forecasts, and call customers from one place with an AI Copilot.',
    long: 'Affina is a CRM built around how sales teams really work. Leads from your ad campaigns and website land in one place, move through pipelines you design yourself, and turn into forecasts you can trust. Calling, follow-up automation and an AI Copilot for chat and voice sit inside the same workspace.',
    icon: 'target',
    accent: '#f43f5e',
    tone: 'bg-rose-100 text-rose-700',
    features: [
      { title: 'Lead capture', text: 'Meta Ads, Google Ads and website forms flow in automatically, with no copy and paste.' },
      { title: 'Custom pipelines', text: 'Design the stages of your own sales process and move deals across a visual board.' },
      { title: 'Revenue forecasts', text: 'See expected revenue by stage, owner and month, updated as deals move.' },
      { title: 'Calling from the CRM', text: 'Call customers and keep every conversation logged on their record.' },
      { title: 'Workflow automation', text: 'Trigger follow-ups, reminders and assignments when something changes.' },
      { title: 'AI Copilot', text: 'Ask questions in chat or by voice and get answers from your own CRM data.' },
    ],
    audience: ['Sales teams', 'Agencies', 'Real estate', 'Education', 'Healthcare', 'Services businesses'],
    keywords: ['crm', 'sales', 'leads', 'pipeline', 'customers', 'forecast', 'marketing'],
    faqs: [
      { q: 'Which lead sources can Affina connect to?', a: 'Affina captures leads from Meta Ads, Google Ads and website forms, and can import existing data from Excel, databases, Zoho CRM and HubSpot.' },
      { q: 'Can we design our own sales pipeline?', a: 'Yes. You define the stages, fields and rules, so the CRM follows your process instead of forcing a fixed one.' },
      { q: 'What does the AI Copilot do?', a: 'It answers questions about your leads, deals and forecasts in chat or by voice, so your team spends less time searching through screens.' },
    ],
    url: '',
  },
  {
    slug: 'iris',
    name: 'Iris',
    category: 'AI contact center',
    tagline: 'Every call. Every chat. Answered by AI.',
    short: 'Voice and chat AI agents that talk to customers around the clock and hand over to your team the moment a human is needed, with every call and chat kept on record.',
    long: 'Iris is an AI contact center. Voice agents answer calls on their own virtual numbers and chat agents live on your website widget. They resolve what they can, transfer to a human agent when it matters, and keep a log, transcript and AI summary of every conversation.',
    icon: 'headset',
    accent: '#06b6d4',
    tone: 'bg-cyan-100 text-cyan-700',
    features: [
      { title: 'Voice agents', text: 'Each agent gets its own virtual number and talks naturally with callers.' },
      { title: 'Chat agents', text: 'A website widget answers visitors instantly, day and night.' },
      { title: 'Live human handover', text: 'Transfer the conversation to your team with full context when needed.' },
      { title: 'Transcripts and summaries', text: 'Every call and chat is logged, transcribed and summarised by AI.' },
      { title: 'Dashboard and history', text: 'Monitor conversations and see which agent handled each customer.' },
      { title: 'Multi-tenant', text: 'Run separate organisations with their own agents, numbers and widgets.' },
    ],
    audience: ['Support teams', 'Clinics', 'Hotels', 'Banks and insurers', 'E-commerce', 'Contact centers'],
    keywords: ['call', 'calls', 'chat', 'support', 'voice', 'agent', 'contact center', 'customer service'],
    faqs: [
      { q: 'Can Iris answer phone calls?', a: 'Yes. Each voice agent has its own virtual phone number, answers callers with AI and can transfer to a human when required.' },
      { q: 'Do we keep a record of conversations?', a: 'Every call and chat is logged with a full transcript and an AI summary, searchable from the dashboard.' },
      { q: 'Can several companies use one Iris account?', a: 'Iris is multi-tenant, so each organisation gets its own agents, numbers, widgets and data.' },
    ],
    url: '',
  },
  {
    slug: 'hestia',
    name: 'Hestia',
    category: 'AI-powered HRMS',
    tagline: 'Your people. Connected. In one place.',
    short: 'An AI-powered HR platform where every role gets its own workspace: employees, managers and HR handle leave, attendance, payroll and hiring with an AI chat assistant.',
    long: 'Hestia brings people management into one connected workspace. Employees check in and request leave, managers approve and track their teams, and HR runs payroll and hiring, all with role-based access. An AI chat assistant answers everyday HR questions for everyone.',
    icon: 'users',
    accent: '#c026d3',
    tone: 'bg-fuchsia-100 text-fuchsia-700',
    features: [
      { title: 'Roles and workspaces', text: 'Employee, manager and HR each see exactly what they need.' },
      { title: 'Attendance and leave', text: 'Check-ins, leave requests and approvals in a few taps.' },
      { title: 'Payroll', text: 'Run payroll from attendance and leave data, without re-entering anything.' },
      { title: 'Hiring', text: 'Track openings, candidates and offers in one pipeline.' },
      { title: 'AI chat assistant', text: 'Instant answers to policy, leave and payslip questions.' },
      { title: 'Multi-tenant and secure', text: 'Separate organisations, role-based permissions and an audit trail.' },
    ],
    audience: ['HR teams', 'Growing companies', 'Staffing firms', 'Manufacturing', 'Retail', 'Multi-branch businesses'],
    keywords: ['hr', 'hrms', 'payroll', 'leave', 'attendance', 'employees', 'hiring', 'people'],
    faqs: [
      { q: 'Does Hestia support different roles?', a: 'Yes. Employees, managers and HR each get a workspace with the actions and data that match their role.' },
      { q: 'Can Hestia run payroll?', a: 'Payroll is calculated from the attendance and leave already recorded, so there is no double entry.' },
      { q: 'What can the AI assistant answer?', a: 'Everyday HR questions such as leave balance, holidays, policies and payslips, in a simple chat.' },
    ],
    url: '',
  },
  {
    slug: 'joybooks',
    name: 'Joybooks',
    category: 'Finance and accounting',
    tagline: 'Every invoice. Every payment. Watch it all add up.',
    short: 'A complete finance and accounting platform: invoices, bills, expenses, banking, inventory, taxes and reports that work together so you always know where your money stands.',
    long: 'Joybooks keeps sales, purchases, banking and taxes in one connected place. Send tax-ready invoices, record bills and expenses, reconcile the bank in minutes and see profit, cash flow and receivables at any time, with roles and approvals to keep control.',
    icon: 'bookopen',
    accent: '#10b981',
    tone: 'bg-emerald-100 text-emerald-700',
    features: [
      { title: 'Invoicing and quotes', text: 'Professional invoices you can send in seconds and track until paid.' },
      { title: 'Bills and expenses', text: 'Capture supplier bills and expenses and pay them on time.' },
      { title: 'Banking and reconciliation', text: 'Match bank lines to invoices and bills and close the month with confidence.' },
      { title: 'Inventory', text: 'Track stock levels and cost as you buy and sell.' },
      { title: 'Taxes', text: 'Tax worked out on every line, with summaries ready to file.' },
      { title: 'Reports', text: 'Profit and loss, cash flow, receivables and payables, always current.' },
    ],
    audience: ['Small businesses', 'Accountants', 'Traders', 'Agencies', 'Distributors', 'Finance teams'],
    keywords: ['accounting', 'finance', 'invoice', 'invoicing', 'tax', 'gst', 'bank', 'expenses', 'books'],
    faqs: [
      { q: 'Can Joybooks handle taxes like GST?', a: 'Tax is applied on every invoice and bill line automatically, and summaries are ready when it is time to file.' },
      { q: 'Does it support bank reconciliation?', a: 'Yes. Bank lines are matched against invoices and bills so you can reconcile and close each month quickly.' },
      { q: 'Can we control who approves payments?', a: 'Roles and approvals decide who can create, approve and pay, with a clear audit trail.' },
    ],
    url: '',
  },
  {
    slug: 'athena',
    name: 'Athena',
    category: 'Field billing app',
    tagline: 'Every site. Every crew. Built to bill.',
    short: 'A field billing app: survey a site, turn measurements into estimates, schedule crews, mark daily attendance, add expenses and bill the customer, then close the project.',
    long: 'Athena follows a field job from the first site visit to the final invoice. Record the survey and measurements in any unit, turn them into an estimate, schedule a crew, mark attendance for each day, add project expenses and invoice everything together, with nothing retyped between steps.',
    icon: 'crane',
    accent: '#f59e0b',
    tone: 'bg-amber-100 text-amber-700',
    features: [
      { title: 'Sites and surveys', text: 'Every customer site in one place, with the survey recorded as you walk it.' },
      { title: 'Any unit of measure', text: 'Square feet, feet, numbers, units or your own custom unit.' },
      { title: 'Instant estimates', text: 'Quantity times rate for every line, with the total worked out for you.' },
      { title: 'Crews and attendance', text: 'Schedule crews with a daily charge per labourer and mark attendance daily.' },
      { title: 'Project expenses', text: 'Log materials and transport, and choose which to bill to the customer.' },
      { title: 'Invoice and close', text: 'Bill work, labour and expenses together, then close the project.' },
    ],
    audience: ['Painters', 'Flooring and tiling', 'Interiors', 'Electrical and plumbing', 'Contractors', 'Installers'],
    keywords: ['field', 'billing', 'estimate', 'site', 'crew', 'contractor', 'measurement', 'labour'],
    faqs: [
      { q: 'Can we measure in our own units?', a: 'Yes. Use square feet, feet, numbers and units, or add a custom unit that fits your trade.' },
      { q: 'How is labour billed?', a: 'A crew is a group of labourers with a daily charge each. Attendance marked for each day adds up to the labour cost on the invoice.' },
      { q: 'Can expenses go on the customer invoice?', a: 'Yes. Log expenses as they happen and choose which ones to bill when you create the invoice.' },
    ],
    url: '',
  },
];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
