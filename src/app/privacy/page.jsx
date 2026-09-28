import { BRAND } from '@/data/brand';

export const metadata = { title: 'Privacy Policy' };

export default function Privacy() {
  return (
    <main id="main" className="pg narrow legal">
      <span className="eyebrow">{BRAND.name}</span>
      <h1 className="serif pgh">Privacy <em>Policy</em></h1>
      <p className="muted lede">What we collect, why, and how you can ask us to delete it.</p>

      <h2 className="serif">What we collect</h2>
      <ul>
        <li>If you create an account: your email address and password (the password is never visible to us — it is stored and checked by our authentication provider, Supabase).</li>
        <li>Your bag and wishlist contents, so they are there when you sign back in.</li>
        <li>If you join our mailing list: the email address you enter. This site is a demo, so that address is only validated in your browser, never actually stored or sent anywhere.</li>
      </ul>
      <p>We do not collect payment details, government IDs, or precise location. We do not sell, rent, or share your data with advertisers.</p>

      <h2 className="serif">How we use it</h2>
      <p>Solely to run the site: signing you in, remembering your bag and wishlist between visits, and showing your name back to you as a signed-in visitor. Nothing here is used for advertising or profiling.</p>

      <h2 className="serif">Who processes it</h2>
      <p>Account, bag and wishlist data is stored with Supabase, our backend and authentication provider, protected by row-level security so only you can read your own rows. We do not use third-party analytics or advertising trackers on this site.</p>

      <h2 className="serif">Cookies and local storage</h2>
      <p>We use your browser's local storage only for things like keeping your bag ready as you shop and remembering that you have signed in — never for tracking you across other sites.</p>

      <h2 className="serif">Your choices</h2>
      <p>You can edit or delete your account data at any time from your account page, or ask us to delete your account and everything tied to it entirely. Because this is a portfolio project rather than a company, that request is handled by removing the corresponding rows directly rather than through a support desk.</p>

      <div className="note">{BRAND.name} is a portfolio project. No real orders are placed or fulfilled through this site — see our <a href="/returns">Return Policy</a> for what that means for checkout.</div>
    </main>
  );
}
