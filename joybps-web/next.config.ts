import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The GSAP / Lenis setup manages its own effects, so keep React's dev double-invoke off (same as the old Vite app).
  reactStrictMode: false,
};

export default nextConfig;
