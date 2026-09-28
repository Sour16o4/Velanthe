'use client';
import { useState } from 'react';

// Key ingredients as a spotlight: one at a time with a big numeral, prev/next arrows and a progress bar.
export function IngredientList({ ingredients }) {
  const [i, setI] = useState(0);
  const n = ingredients.length;
  const cur = ingredients[i];
  const step = (d) => setI((i + d + n) % n);
  return (
    <div className="ingspot" role="group" aria-roledescription="carousel" aria-label="Key ingredients">
      <div className="ingspot-main">
        <span className="ingspot-n serif" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
        <div key={i} className="ingspot-txt" aria-live="polite">
          <span className="eyebrow">{i + 1} of {n}</span>
          <h3 className="serif">{cur.name}</h3>
          <p>{cur.role}</p>
        </div>
      </div>
      <div className="ingspot-nav">
        <button type="button" aria-label="Previous ingredient" onClick={() => step(-1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <button type="button" className="fill" aria-label="Next ingredient" onClick={() => step(1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
        </button>
        <div className="ingspot-bar" aria-hidden="true">
          {ingredients.map((x, k) => <span key={x.name} className={k <= i ? 'on' : ''} />)}
        </div>
      </div>
    </div>
  );
}
