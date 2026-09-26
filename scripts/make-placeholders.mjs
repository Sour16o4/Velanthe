import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const src = readFileSync('src/data/products.js', 'utf8');
const slugs = [...src.matchAll(/slug: '([^']+)'/g)].map((m) => m[1]);
mkdirSync('public/img', { recursive: true });

const svg = (w, h, a, b, label) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>
<rect x="${w * 0.4}" y="${h * 0.3}" width="${w * 0.2}" height="${h * 0.4}" rx="${w * 0.03}" fill="#FAF7F2" opacity=".85"/>
<rect x="${w * 0.44}" y="${h * 0.25}" width="${w * 0.12}" height="${h * 0.06}" rx="4" fill="#B08D57"/>
<text x="50%" y="${h * 0.88}" text-anchor="middle" font-family="Georgia,serif" font-size="${w * 0.045}" fill="#1A1815" opacity=".55">${label}</text></svg>`;

slugs.forEach((s, i) => {
  const hue = 30 + ((i * 7) % 20);
  writeFileSync(`public/img/${s}-1.svg`, svg(800, 1000, `hsl(${hue} 30% 88%)`, `hsl(${hue} 25% 78%)`, s.replace(/-/g, ' ')));
  writeFileSync(`public/img/${s}-2.svg`, svg(800, 1000, `hsl(${hue} 20% 92%)`, `hsl(${hue + 10} 30% 82%)`, s.replace(/-/g, ' ')));
});
writeFileSync('public/img/hero.svg', svg(1600, 1000, '#EFE6D8', '#D9C7A6', ''));
console.log(`wrote ${slugs.length * 2 + 1} images`);
