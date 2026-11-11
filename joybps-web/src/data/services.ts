export interface Service {
  slug: string;
  name: string;
  short: string;
  long: string;
  icon: string;
  tone: string;
  deliverables: string[];
  stack: string[];
  steps: { title: string; text: string }[];
  faqs: { q: string; a: string }[];
}

const STEPS = [
  { title: 'Discover', text: 'We learn your business, users and goals, and agree on what success looks like.' },
  { title: 'Design', text: 'Wireframes and a visual design you approve before any code is written.' },
  { title: 'Build', text: 'Weekly builds you can see and test, with clean, documented code.' },
  { title: 'Launch', text: 'Testing, performance tuning and a smooth go-live on your own domain or cloud.' },
  { title: 'Support', text: 'Monitoring, fixes and improvements after launch, so it keeps working.' },
];

export const SERVICES: Service[] = [
  {
    slug: 'website-development',
    name: 'Website Development',
    short: 'Fast, search-friendly business websites and landing pages with a premium, modern design.',
    long: 'We design and build websites that load quickly, rank well and convert visitors into enquiries. Every site is responsive, accessible and built with clean semantic HTML, proper metadata and structured data, so search engines understand it from day one.',
    icon: 'globe',
    tone: 'bg-sky-100 text-sky-700',
    deliverables: ['Responsive design for phone, tablet and desktop', 'Technical SEO: metadata, sitemap, structured data', 'Speed and Core Web Vitals tuning', 'Contact forms with spam protection', 'Content management if you need to edit it yourself', 'Analytics and Search Console setup'],
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
    steps: STEPS,
    faqs: [
      { q: 'How long does a business website take?', a: 'A typical company website takes three to six weeks from approved design to launch, depending on the number of pages and integrations.' },
      { q: 'Will the website be optimised for search engines?', a: 'Yes. We build in proper headings, metadata, image alt text, a sitemap, structured data and fast loading from the start.' },
      { q: 'Can we update the content ourselves?', a: 'Yes. We can add a simple content management system so your team can edit pages, blogs and images without a developer.' },
    ],
  },
  {
    slug: 'web-application-development',
    name: 'Web Application Development',
    short: 'Secure, scalable web applications and dashboards, from internal tools to customer portals.',
    long: 'We build web applications that run your operations: dashboards, portals, workflow tools and SaaS products. We design the data model, the roles and the interface together, and deliver a system that stays fast as your users and data grow.',
    icon: 'layout',
    tone: 'bg-indigo-100 text-indigo-700',
    deliverables: ['Role-based access and secure authentication', 'Dashboards, reports and data exports', 'REST and real-time APIs', 'Integrations with the tools you already use', 'Cloud deployment with backups and monitoring', 'Automated tests for the critical flows'],
    stack: ['Next.js', 'React', 'Node.js', 'PostgreSQL', 'Cloud hosting'],
    steps: STEPS,
    faqs: [
      { q: 'Can you build on top of our existing system?', a: 'Yes. We can extend or replace parts of an existing system step by step, so your business keeps running during the change.' },
      { q: 'Is the application secure?', a: 'We apply role-based access, input validation, encrypted connections and regular dependency updates as standard.' },
      { q: 'Can it scale as we grow?', a: 'We design for growth from the start, with a database and hosting set-up that can handle more users and data.' },
    ],
  },
  {
    slug: 'mobile-app-development',
    name: 'Mobile App Development',
    short: 'Android and iOS apps that feel native, work reliably and stay in sync with your web platform.',
    long: 'We build mobile apps for customers and field teams that are quick, simple and dependable, including in poor connectivity. One team handles design, the app and the backend, so the mobile experience and your web system always agree.',
    icon: 'smartphone',
    tone: 'bg-violet-100 text-violet-700',
    deliverables: ['Android and iOS apps from one codebase', 'Offline-first sync for field use', 'Push notifications', 'Camera, location and file upload features', 'App store submission and release support', 'Analytics and crash reporting'],
    stack: ['React Native', 'TypeScript', 'Node.js', 'Firebase', 'REST APIs'],
    steps: STEPS,
    faqs: [
      { q: 'Do you build for both Android and iOS?', a: 'Yes. We build both from one codebase, which keeps cost and maintenance lower without losing quality.' },
      { q: 'Can the app work offline?', a: 'Yes. Field apps can store data on the phone and sync it safely when the connection returns.' },
      { q: 'Do you help with publishing to the app stores?', a: 'We prepare the listing, builds and submissions, and handle review feedback until the app is live.' },
    ],
  },
  {
    slug: 'custom-software-development',
    name: 'Custom Software Development',
    short: 'Software shaped around your process, from workflow automation to AI-powered business systems.',
    long: 'When off-the-shelf tools do not fit, we build software that matches how you work. That includes workflow automation, AI features such as assistants and document processing, and full business systems of the kind we ship ourselves in Affina, Iris, Hestia, Joybooks and Athena.',
    icon: 'cpu',
    tone: 'bg-emerald-100 text-emerald-700',
    deliverables: ['Discovery and a clear technical specification', 'Workflow automation and integrations', 'AI assistants, voice and document processing', 'Reporting and analytics', 'Documentation and handover training', 'Source code ownership for you'],
    stack: ['Next.js', 'Node.js', 'Python', 'PostgreSQL', 'LLM and speech APIs'],
    steps: STEPS,
    faqs: [
      { q: 'Do we own the source code?', a: 'Yes. The code and documentation are handed over to you, so you are never locked in.' },
      { q: 'Can you add AI features to our software?', a: 'Yes. We build AI assistants, voice agents, summarisation and document processing, connected to your own data.' },
      { q: 'How do you price custom projects?', a: 'After discovery we give a fixed scope and estimate, split into milestones so you can see progress and cost at each stage.' },
    ],
  },
  {
    slug: 'technical-support',
    name: 'Technical Support',
    short: 'Monitoring, maintenance and fast fixes so your websites and applications keep running.',
    long: 'Launch is only the start. Our support plans cover monitoring, security updates, backups, bug fixes and small improvements, with a named contact who knows your system and responds quickly when something needs attention.',
    icon: 'lifebuoy',
    tone: 'bg-amber-100 text-amber-700',
    deliverables: ['Uptime and performance monitoring', 'Security patches and dependency updates', 'Regular backups and restore checks', 'Bug fixes with response-time commitments', 'Monthly improvement hours', 'Hosting and domain management'],
    stack: ['Monitoring', 'CI and CD', 'Cloud hosting', 'Backups', 'Security updates'],
    steps: STEPS,
    faqs: [
      { q: 'Do you support systems you did not build?', a: 'Often yes. We review the code and hosting first, then agree a plan that fits the state of the system.' },
      { q: 'How fast do you respond to issues?', a: 'Response targets depend on the plan, with the fastest plans covering urgent issues within hours.' },
      { q: 'Can we add improvements within a support plan?', a: 'Yes. Plans include monthly hours that can be used for small improvements as well as fixes.' },
    ],
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);
