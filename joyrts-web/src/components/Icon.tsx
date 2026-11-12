import React from 'react';
import { Target, Headset, Users, BookOpen, Globe, LayoutDashboard, Smartphone, Cpu, LifeBuoy, Megaphone, type LucideProps } from 'lucide-react';

/** A tower crane, drawn in the same 24px stroke style as the lucide icons: construction sites and the crews on them. */
const Crane: React.FC<LucideProps> = ({ size = 24, strokeWidth = 2, className, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...(rest as React.SVGProps<SVGSVGElement>)}>
    <path d="M7 22V4" />
    <path d="M4 22h6" />
    <path d="M7 4l-4 2h18" />
    <path d="M7 4l9 2" />
    <path d="M4 6v3" />
    <path d="M17 6v6" />
    <path d="M15 12h4v4h-4z" />
    <path d="M7 10h3M7 14h3M7 18h3" />
  </svg>
);

const MAP: Record<string, React.ComponentType<LucideProps>> = {
  target: Target,
  headset: Headset,
  users: Users,
  bookopen: BookOpen,
  crane: Crane,
  globe: Globe,
  layout: LayoutDashboard,
  smartphone: Smartphone,
  cpu: Cpu,
  lifebuoy: LifeBuoy,
  megaphone: Megaphone,
};

/** Resolves a string icon key from the data files to an icon (keeps the data files serialisable). */
export const Icon: React.FC<{ name: string } & LucideProps> = ({ name, ...rest }) => {
  const C = MAP[name] ?? Globe;
  return <C aria-hidden="true" {...rest} />;
};
