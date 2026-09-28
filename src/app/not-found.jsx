import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main" className="pg empty">
      <span className="eyebrow">404</span>
      <h1 className="serif pgh">Nothing here but <em>beauty</em> awaits</h1>
      <Link href="/collection" className="btn"><span>Explore the collection</span></Link>
    </main>
  );
}
