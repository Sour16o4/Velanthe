import { ImageResponse } from 'next/og';
import { BRAND } from '@/data/brand';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OG() {
  return new ImageResponse(
    (<div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FAF7F2', color: '#1A1815' }}>
      <div style={{ fontSize: 110, fontFamily: 'serif' }}>{BRAND.name}</div>
      <div style={{ fontSize: 34, marginTop: 16, color: '#6F6A62' }}>{BRAND.tagline}</div>
    </div>), size);
}
