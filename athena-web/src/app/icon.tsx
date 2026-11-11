import { ImageResponse } from 'next/og';
import { SITE } from '../lib/site';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #38bdf8, #4f46e5)', color: '#ffffff', fontSize: 40, fontWeight: 800, borderRadius: 14 }}>
        {SITE.name[0]}
      </div>
    ),
    size,
  );
}
