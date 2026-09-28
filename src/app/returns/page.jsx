import { BRAND } from '@/data/brand';

export const metadata = { title: 'Return Policy' };

export default function Returns() {
  return (
    <main id="main" className="pg narrow legal">
      <span className="eyebrow">{BRAND.name}</span>
      <h1 className="serif pgh">Return <em>Policy</em></h1>
      <p className="muted lede">The policy we would run if this were a real store, written out in full.</p>

      <div className="note">{BRAND.name} is a portfolio project: checkout does not take real payment and no physical products are shipped. The policy below is real, complete copy — written the way it would work for an actual order — kept here so the storefront reads honestly rather than leaving this page blank.</div>

      <h2 className="serif">30-day returns</h2>
      <p>Unopened, unused products can be returned within 30 days of delivery for a full refund to the original payment method. Because these are skincare products, an opened item can only be returned if it arrived damaged or otherwise not as described.</p>

      <h2 className="serif">How a return would work</h2>
      <ul>
        <li>Start the return from your account's order history within 30 days of delivery.</li>
        <li>Pack the item in its original box where possible, with any seal intact.</li>
        <li>We would email a prepaid return label; no return ships at your cost.</li>
        <li>Refunds are issued once the return is received, typically within 5–7 business days.</li>
      </ul>

      <h2 className="serif">Damaged or incorrect items</h2>
      <p>If an order arrived damaged, or the wrong item was sent, we would replace it or refund it in full, no return of the original item required in most cases.</p>

      <h2 className="serif">Exchanges</h2>
      <p>We would not offer direct exchanges; the fastest path is a return for a refund and a new order for the item you want instead, so it ships without waiting for the original to arrive back with us.</p>

      <h2 className="serif">Gifts</h2>
      <p>An item marked as a gift at checkout would be returnable for store credit, even without the original order confirmation.</p>
    </main>
  );
}
