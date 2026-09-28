import { ImageResponse } from 'next/og';
import { BRAND } from '@/data/brand';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// The image shown when a link to the site is shared: the brand on the dark wine backdrop.
export default function OG() {
  return new ImageResponse(
    (<div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f0709', color: '#e8d3a0' }}>
      <div style={{ fontSize: 120, fontFamily: 'serif', letterSpacing: 24 }}>{BRAND.name.toUpperCase()}</div>
      <div style={{ fontSize: 36, marginTop: 20, color: '#c9a86a' }}>{BRAND.tagline}</div>
    </div>), size);
}
