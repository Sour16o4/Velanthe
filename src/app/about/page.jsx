import { BRAND } from '@/data/brand';

export const metadata = { title: 'About us' };

export default function About() {
  return (
    <main id="main" className="pg narrow legal">
      <span className="eyebrow">{BRAND.name}</span>
      <h1 className="serif pgh">About <em>us</em></h1>
      <p className="muted lede">Small batches, honest lists, nothing put on your skin that we would not put on our own.</p>

      <h2 className="serif">Where it started</h2>
      <p>{BRAND.name} began as a simple frustration: ingredient lists that needed a chemistry degree to read, for products that promised the earth and delivered very little. We wanted skincare built from things we could name and pronounce — rose water, calendula, cold-pressed argan oil — blended slowly instead of mass-produced overnight.</p>

      <h2 className="serif">What we believe</h2>
      <p>A short list, on purpose: formulate with a purpose for every ingredient, never pad a bottle to make it look fuller, publish exactly what goes into every product, and price it fairly rather than at whatever the market will bear.</p>

      <h2 className="serif">Cruelty-free and vegan</h2>
      <p>Every {BRAND.name} product is cruelty-free and vegan, across the whole catalog, not as a marketing line on a few bottles. No animal-derived ingredients, no animal testing, at any stage.</p>

      <h2 className="serif">A note on this site</h2>
      <p>{BRAND.name} is a portfolio project built to explore modern e-commerce design and engineering. The products, ingredient stories and photography are real work, thoughtfully made — but the storefront is a demo: no orders are fulfilled and no payments are taken.</p>

      <div className="note">Questions about the project itself? This site does not take real orders — see our <a href="/returns">Return Policy</a> and <a href="/privacy">Privacy Policy</a> for how the demo storefront behaves.</div>
    </main>
  );
}
