export interface Project {
  name: string;
  url: string;
  host: string;
  category: string;
  summary: string;
  tags: string[];
  /** Tailwind gradient classes for the preview tile. */
  tone: string;
  /** Logo in /public, shown in black on the preview tile (optional). */
  logo?: string;
}

/** PLACEHOLDER COPY: categories and one-line summaries are written from the site names. Replace with the real project details. */
export const PROJECTS: Project[] = [
  { name: 'Pearlberry Cakes', url: 'https://www.pearlberrycakes.com/', host: 'pearlberrycakes.com', category: 'Website and online ordering', summary: 'A bakery website that shows the cakes beautifully and sends orders straight to the team.', tags: ['Website', 'Ordering'], tone: 'from-rose-50 via-white to-sky-50', logo: '/pb.png' },
  { name: 'Sanjith Urology', url: 'https://www.sanjithurology.com/', host: 'sanjithurology.com', category: 'Healthcare website', summary: 'A clear, professional practice website that patients find easy to use and book from.', tags: ['Website', 'Healthcare'], tone: 'from-sky-50 via-white to-indigo-50', logo: '/urology_logo_white_transparent.png' },
  { name: 'Gypsos', url: 'https://www.gypsos.in', host: 'gypsos.in', category: 'Brand website', summary: 'A modern brand site that reflects the product range, delivered on time and built to grow.', tags: ['Website', 'Branding'], tone: 'from-indigo-50 via-white to-sky-50', logo: '/gypsos_logo_white_transparent.png' },
  { name: 'Aeroliftlimo', url: 'https://www.aeroliftlimo.com/', host: 'aeroliftlimo.com', category: 'Booking website', summary: 'A sharp, fast booking experience for airport and city transfers, on every device.', tags: ['Website', 'Booking'], tone: 'from-slate-100 via-white to-sky-50' },
  { name: 'Tamil Church of Christ', url: 'https://www.tamilchurchofchrist.com/', host: 'tamilchurchofchrist.com', category: 'Community website', summary: 'A welcoming site where the community finds services, events and updates easily.', tags: ['Website', 'Community'], tone: 'from-amber-50 via-white to-sky-50' },
  { name: 'HG Imports', url: 'https://www.hgimports.ca/contact', host: 'hgimports.ca', category: 'Business website', summary: 'A clean, professional website that makes it easy for customers to reach the business.', tags: ['Website', 'Lead capture'], tone: 'from-emerald-50 via-white to-sky-50' },
  { name: 'SK Groups', url: 'https://www.skgroupz.com/', host: 'skgroupz.com', category: 'Corporate website', summary: 'A quick-to-launch corporate site that presents the group and its businesses with confidence.', tags: ['Website', 'Corporate'], tone: 'from-violet-50 via-white to-sky-50', logo: '/logo_white_transparent.png' },
];
