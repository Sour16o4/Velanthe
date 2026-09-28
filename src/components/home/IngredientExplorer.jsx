'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ingredients, photos } from '@/data/home';

// The list of ingredients with a large photo that opens up behind the one you hover, click or focus.
export function IngredientExplorer() {
  const [active, setActive] = useState(0);
  const first = useRef(true);
  const x = ingredients[active];

  // Fade the description in each time the ingredient changes (not on the first render).
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.from('#idesc > *', { y: 26, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out', delay: 0.2 });
  }, [active]);

  const hoverCapable = () => window.matchMedia('(hover:hover)').matches;
  return (
    <div className="igrid">
      <div className="ilist" id="ilist">
        {ingredients.map((g, i) => (
          <button key={g.name} type="button" className={i === active ? 'on' : ''} onClick={() => setActive(i)} onFocus={() => setActive(i)}
            onMouseEnter={() => { if (hoverCapable()) setActive(i); }}>{g.name}</button>
        ))}
      </div>
      <div className="iview" id="iview">
        {ingredients.map((g, i) => {
          const focus = photos[g.photo].focus;
          return (
            <div key={g.name} className={`iph${i === active ? ' on' : ''}`} aria-hidden="true">
              <div className="ph" style={{ backgroundImage: `url(${photos[g.photo].src})`, ...(focus ? { backgroundSize: focus.size, backgroundPosition: focus.position } : {}) }} />
            </div>
          );
        })}
        <div className="idesc" id="idesc">
          <h3>{x.name}</h3><p>{x.text}</p><p className="fi">Found in {x.found}</p>
        </div>
      </div>
    </div>
  );
}
