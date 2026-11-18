import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The GSAP / Lenis setup manages its own effects, so keep React's dev double-invoke off (same as the old Vite app).
  reactStrictMode: false,
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [
      {
        source: '/:all*(png|jpg|jpeg|svg|webp|avif|ico|woff2)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
