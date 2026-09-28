'use client';
import { useState } from 'react';
import Link from 'next/link';
import { BRAND } from '@/data/brand';
import { photoCredits } from '@/data/credits';
import { FooterGreeting } from '@/components/FooterGreeting';

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// "Join the list" form, the giant wordmark, footer and the photo credits (required by the photos' licences).
// Demo only: the address is checked but not stored or sent anywhere.
export function JoinSection() {
  const [msg, setMsg] = useState({ text: '', error: false });

  function submit(e) {
    e.preventDefault();
    const value = String(new FormData(e.currentTarget).get('email') ?? '').trim();
    if (!EMAIL.test(value)) return setMsg({ text: 'Enter a valid email address, like you@example.com.', error: true });
    setMsg({ text: "You're on the list. We will write when something new arrives.", error: false });
  }

  return (
    <section className="cta pad" id="join">
      <i className="orb o1" />
      <div className="wrap">
        <h2 className="serif rv">A glow that is <em>yours</em>.</h2>
        <form className="form" onSubmit={submit} noValidate>
          <label htmlFor="em">Email address</label>
          <div className="frow">
            <input id="em" name="email" type="email" placeholder="you@example.com" autoComplete="email" spellCheck={false} />
            <button className="btn p" type="submit"><span>Join the list</span></button>
          </div>
          <p className={`msg${msg.error ? ' err' : ''}`} role="status">{msg.text}</p>
        </form>
        <div className="word" id="word" aria-hidden="true">{BRAND.name}</div>
        <nav className="footlinks" aria-label="Legal">
          <Link href="/about">About us</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/returns">Return Policy</Link>
        </nav>
        <div className="foot"><span>© 2026 {BRAND.name}. Portfolio project, products are not for sale.</span><FooterGreeting /></div>
        <p className="credits">
          Botanical photography via Wikimedia Commons:{' '}
          {['rose', 'marigold', 'lavender', 'chamomile', 'argan'].map((k, i, all) => {
            const m = photoCredits[k];
            return (
              <span key={k}>
                <a href={m.page} target="_blank" rel="noopener noreferrer">{m.title.replace(/\.(jpe?g)$/i, '')}</a> by {m.artist} ({m.lic}){i < all.length - 1 ? '; ' : '.'}
              </span>
            );
          })}{' '}
          Product images and videos are 3D renders made for this project.
        </p>
      </div>
    </section>
  );
}
