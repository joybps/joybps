export type Block = { type: 'h2' | 'h3' | 'p'; text: string } | { type: 'ul'; items: string[] };

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  readMinutes: number;
  category: string;
  body: Block[];
}

export const POSTS: Post[] = [
  {
    slug: 'ai-in-business-software',
    title: 'How AI is changing business software in 2026',
    description: 'From AI assistants inside the CRM to voice agents that answer calls, here is where AI is genuinely useful in business software today and where it is not.',
    date: '2026-10-14',
    readMinutes: 6,
    category: 'AI',
    body: [
      { type: 'p', text: 'Every software vendor now claims to be AI-powered. For a business buying or building software, the useful question is simpler: which tasks does AI actually do better, faster or cheaper than the old way?' },
      { type: 'h2', text: 'Where AI is already paying off' },
      { type: 'ul', items: ['Answering routine questions in chat and over the phone, with a clean handover to a human', 'Summarising calls, meetings and long documents so nobody has to re-read them', 'Searching company data in plain language instead of building a report', 'Drafting first versions of emails, quotes and follow-ups for a person to approve'] },
      { type: 'h2', text: 'AI inside the workflow, not next to it' },
      { type: 'p', text: 'The biggest gains come when AI sits inside the system people already use. A CRM that can answer "which deals are likely to close this month?" saves more time than a separate chatbot tab. That is the idea behind the AI assistants in our own products: they work on your data, in the screen where the work happens.' },
      { type: 'h2', text: 'Where to be careful' },
      { type: 'p', text: 'AI can be confidently wrong. Anything involving money, legal commitments or customer promises needs a person in the loop, an audit trail and clear limits on what the AI may do on its own.' },
      { type: 'h3', text: 'A simple rule for adopting AI' },
      { type: 'p', text: 'Start with one repetitive, low-risk task, measure the time saved, then expand. Teams that begin with a small, well-chosen use case usually see results in weeks, not quarters.' },
    ],
  },
  {
    slug: 'choosing-a-custom-software-partner',
    title: 'Custom software or off-the-shelf? A practical way to decide',
    description: 'Not every business needs custom software. This guide explains when ready-made tools are enough, when custom development pays off and how to choose a development partner.',
    date: '2026-09-22',
    readMinutes: 7,
    category: 'Custom software',
    body: [
      { type: 'p', text: 'Off-the-shelf software is faster to start and cheaper in year one. Custom software costs more up front but can fit your process exactly. The right choice depends on how unusual your process is and how much it matters.' },
      { type: 'h2', text: 'When ready-made tools are enough' },
      { type: 'ul', items: ['Your process looks like most companies in your industry', 'You can live with the way the tool works', 'You have no need to integrate deeply with other systems'] },
      { type: 'h2', text: 'When custom software pays off' },
      { type: 'ul', items: ['Your workflow is a competitive advantage and generic tools force compromises', 'Staff spend hours moving data between spreadsheets and apps', 'You are paying for many tools that almost, but not quite, fit together', 'You want to own the system and its data, not rent it'] },
      { type: 'h2', text: 'How to choose a development partner' },
      { type: 'p', text: 'Look for a partner who starts with your process, not their technology. Ask to see shipped products, ask who will work on your project, and insist on clear milestones, documentation and ownership of the source code.' },
      { type: 'h3', text: 'Questions to ask before you sign' },
      { type: 'ul', items: ['Who owns the code and the data?', 'How are changes in scope handled and priced?', 'What happens after launch: support, hosting, updates?', 'Can we see live products you have built and speak to a client?'] },
    ],
  },
  {
    slug: 'website-seo-checklist',
    title: 'The technical SEO checklist for a new business website',
    description: 'A practical technical SEO checklist for launching a business website: headings, metadata, structured data, sitemaps, speed and internal linking.',
    date: '2026-08-30',
    readMinutes: 8,
    category: 'Web development',
    body: [
      { type: 'p', text: 'Great content cannot rank if search engines struggle to read or load your site. This checklist covers the technical basics we build into every website before launch.' },
      { type: 'h2', text: '1. Structure and headings' },
      { type: 'ul', items: ['One clear H1 per page that says what the page is about', 'H2 for main sections and H3 for details, without skipping levels', 'Real paragraph and list tags, not text drawn inside images'] },
      { type: 'h2', text: '2. Metadata and sharing' },
      { type: 'ul', items: ['A unique title and meta description for every page', 'A canonical URL to avoid duplicate-content confusion', 'Open Graph and Twitter tags so links look good when shared'] },
      { type: 'h2', text: '3. Crawling and indexing' },
      { type: 'ul', items: ['An XML sitemap listing every public page', 'A robots.txt file that points to the sitemap', 'Clean, readable URLs and a branded 404 page'] },
      { type: 'h2', text: '4. Structured data' },
      { type: 'p', text: 'Structured data (JSON-LD) tells search engines who you are and what each page is: an organization, a service, a product, a FAQ. It can unlock richer results, but only mark up what is actually visible on the page.' },
      { type: 'h2', text: '5. Speed and images' },
      { type: 'ul', items: ['Compress and correctly size images, and write descriptive alt text', 'Load heavy scripts after the main content', 'Keep Largest Contentful Paint under 2.5 seconds on mobile'] },
      { type: 'h2', text: '6. Internal linking' },
      { type: 'p', text: 'Link related pages to each other with descriptive anchor text. A service page should link to relevant case studies, and every page should be reachable within a few clicks of the home page.' },
    ],
  },
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);
