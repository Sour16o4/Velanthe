import { CollectionExplorer } from '@/components/home/CollectionExplorer';

export const metadata = { title: 'Collection' };

export default function Collection() {
  return (
    <main id="main" className="pg">
      <span className="eyebrow">Velanthe</span>
      <h1 className="serif pgh">The complete <em>collection</em></h1>
      <CollectionExplorer />
    </main>
  );
}
