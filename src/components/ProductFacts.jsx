import { brandPromises, safetyNote } from '@/data/claims';
import { skinTypes } from '@/lib/skin';

// The row of badges under a product's description: organic %, cruelty-free, vegan, minimum age.
export function ProductBadges({ product: p }) {
  return (
    <ul className="badges" aria-label="Product promises">
      <li>{p.organic}% organic ingredients</li>
      <li>{brandPromises.find((b) => b.key === 'cruelty').label}</li>
      <li>{brandPromises.find((b) => b.key === 'vegan').label}</li>
      <li>Ages {p.minAge}+</li>
    </ul>
  );
}

const ageText = (age) => (age >= 18
  ? 'Recommended for ages 18 and over. This formula contains active ingredients that are not intended for younger skin.'
  : 'Suitable for ages 16 and over. Not intended for children.');

// Which skin types the product suits, its essential-oil blend, and the age and safety guidance.
export function ProductFacts({ product: p }) {
  const all = p.skin.includes('all');
  const types = all ? [] : p.skin.map((k) => skinTypes.find((t) => t.key === k)).filter(Boolean);
  return (
    <div className="facts">
      <h2 className="eyebrow">Best for</h2>
      <ul className="chipline">
        {all ? <li>All skin types</li> : types.map((t) => <li key={t.key}>{t.label} skin</li>)}
      </ul>
      {!all && <p className="muted small">{types.map((t) => t.blurb).join(' ')}</p>}

      <h2 className="eyebrow">Essential oil blend</h2>
      <ul className="oils">
        {p.oils.map((o) => <li key={o.name}><b>{o.name}</b><span>{o.note}</span></li>)}
      </ul>

      <h2 className="eyebrow">Good to know</h2>
      <p className="muted">{ageText(p.minAge)}</p>
      <p className="muted small">{safetyNote}</p>
    </div>
  );
}
