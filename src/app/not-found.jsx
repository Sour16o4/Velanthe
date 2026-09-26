import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main" className="mx-auto max-w-xl px-4 pb-32 pt-32 text-center">
      <p className="label text-mute">404</p>
      <h1 className="display mt-4 text-5xl">Nothing here but beauty awaits</h1>
      <Link href="/collection" className="label mt-8 inline-block border border-ink px-6 py-3 hover:bg-gold hover:text-ink">Explore the collection</Link>
    </main>
  );
}
