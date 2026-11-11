'use client';

import { usePathname, useRouter } from 'next/navigation';

export type Route = '/' | '/features' | '/pricing' | '/faq' | '/contact';

export const routeHref = (route: Route): string => route;

/** The current route, for highlighting the active nav link. */
export function useRoute(): string {
  return usePathname();
}

/** Client-side navigation helper: `const navigate = useNavigate(); navigate('/contact')`. */
export function useNavigate() {
  const router = useRouter();
  return (route: Route) => router.push(route);
}
