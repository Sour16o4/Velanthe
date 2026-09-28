'use client';
import { useEffect } from 'react';

// Starts the home page's 3D scenes and scroll animations after the page has loaded.
// The code (three.js, gsap, lenis) is loaded on demand, so other pages never download it.
export function HomeExperience() {
  useEffect(() => {
    let stop = null;
    let cancelled = false;
    import('@/lib/home-experience')
      .then((m) => { if (!cancelled) stop = m.startHomeExperience(); })
      .catch((e) => {
        console.error(e);
        // Without the animation code the page still works: just make sure the loader is out of the way.
        const ld = document.getElementById('ld');
        if (ld) ld.style.display = 'none';
        document.documentElement.classList.add('no-gl');
      });
    return () => { cancelled = true; if (stop) stop(); };
  }, []);
  return null;
}
