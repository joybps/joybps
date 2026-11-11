import { ImageResponse } from 'next/og';
import { SITE } from '../lib/site';

export const alt = `${SITE.name}: ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Default share image for every page that does not set its own. */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          background: 'linear-gradient(135deg, #ffffff 0%, #e0f2fe 55%, #c7d2fe 100%)',
          color: '#0f172a',
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: -2, color: '#0ea5e9' }}>{SITE.name}</div>
        <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: -3, lineHeight: 1.05, marginTop: 24 }}>{SITE.tagline}</div>
        <div style={{ fontSize: 30, marginTop: 28, color: '#475569' }}>Products, websites, apps and custom software · www.joybps.com</div>
      </div>
    ),
    size,
  );
}
