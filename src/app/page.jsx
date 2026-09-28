import Image from 'next/image';
import Link from 'next/link';
import { BRAND } from '@/data/brand';
import { makingCaptions, makingStages, photos, trustInside, trustNever } from '@/data/home';
import { HomeExperience } from '@/components/home/HomeExperience';
import { IngredientExplorer } from '@/components/home/IngredientExplorer';
import { CollectionGrid } from '@/components/home/CollectionGrid';
import { JoinSection } from '@/components/home/JoinSection';

const tick = (
  <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10.5l4.5 4.5L17 5" /></svg>
);
const bg = (key) => ({ backgroundImage: `url(${photos[key].src})` });

export default function Home() {
  return (
    <>
      {/* Intro: the logo draws itself, then the curtain lifts. It only plays on the first visit of a session. */}
      <div id="ld" aria-hidden="true">
        <div className="in">
          <svg viewBox="0 0 100 120"><path id="ldp" d="M10 10 L50 112 L90 10 M30 10 L50 62 L70 10" /></svg>
          <span className="nm">{BRAND.name}</span>
        </div>
      </div>

      <main id="main">
        <div id="top" />
        <section className="hero" id="hero">
          <i className="orb o1" /><i className="orb o2" />
          <div className="bgph ph" id="hbg" style={bg('chamomile')} />
          <div className="veil" /><div className="spot" />
          <h1 className="serif" aria-label="Made honestly. Glowing naturally.">
            <span className="ln"><span className="in">Made honestly.</span></span>
            <span className="ln"><span className="in"><em>Glowing</em> naturally.</span></span>
          </h1>
          <canvas id="cv" aria-hidden="true" />
          <Image className="gl-fallback hero-fallback" src="/products/dew.png" alt="" width={700} height={900} priority />
          <div className="low">
            <p>Rose, lavender, calendula and cold-pressed oils, blended slowly into skincare you can trust on your skin.</p>
            <div>
              <a className="btn p" href="#making" data-go="#making"><span>See how it is made</span></a>
              <Link className="btn" href="/collection"><span>Shop {BRAND.name}</span></Link>
            </div>
          </div>
        </section>

        <section className="trust pad" id="trust">
          <i className="orb o1" />
          <div className="wrap tgrid">
            <div>
              <h2 className="serif rv">Nothing to <em>hide</em>.</h2>
              <p className="lead">If we would not put it on our own skin, it does not go in the jar.</p>
              <div className="cols">
                <div className="yes">
                  <h3 className="eyebrow">Inside</h3>
                  <ul id="yes">{trustInside.map((t) => <li key={t}>{tick}{t}</li>)}</ul>
                </div>
                <div className="no">
                  <h3 className="eyebrow">Never inside</h3>
                  <ul id="no">{trustNever.map((t) => <li key={t}><span>{t}</span></li>)}</ul>
                </div>
              </div>
            </div>
            <div className="archwrap">
              <div className="arch"><div className="ph" id="arch" style={bg('lavender')} /><small>Lavender, grown for oil</small></div>
            </div>
          </div>
        </section>

        <section className="making" id="making" aria-label="How Velanthe lotion is made">
          <i className="orb o1" /><i className="orb o2" />
          <canvas id="cv3" aria-hidden="true" />
          <Image className="gl-fallback making-fallback" src="/products/lot.png" alt="" width={700} height={900} />
          <div className="mk" id="mk">
            {makingCaptions.map((c, i) => (
              <div className="cap" data-i={i} key={c.eyebrow + i}>
                <span className="eyebrow">{c.eyebrow}</span>
                <h2 className="serif" dangerouslySetInnerHTML={{ __html: c.title }} />
                <p>{c.text}</p>
              </div>
            ))}
          </div>
          <div className="portal" id="portal" aria-hidden="true">
            {['rose', 'marigold', 'lavender', 'argan', 'chamomile'].map((k) => (
              <div key={k} className="ph" data-k={k}
                style={{ ...bg(k), ...(photos[k].focus ? { backgroundSize: photos[k].focus.size, backgroundPosition: photos[k].focus.position } : {}) }} />
            ))}
            <span id="plabel" />
          </div>
          <div className="mfoot">
            <div className="stg" id="stg">{makingStages.map((s) => <div key={s[0]}><span>{s[0]}</span><i /></div>)}</div>
            <div className="mctl">
              <button type="button" id="mplay" aria-label="Pause animation" />
              <button type="button" id="mrep" aria-label="Replay animation"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" /></svg></button>
            </div>
          </div>
        </section>

        <section className="ing-s pad" id="ing">
          <i className="orb o2" />
          <div className="wrap">
            <h2 className="serif rv">Grown, not <em>manufactured</em>.</h2>
            <IngredientExplorer />
          </div>
        </section>

        <section className="shop-s pad" id="shop">
          <div className="wrap">
            <h2 className="serif rv">A few <em>favourites</em></h2>
            <CollectionGrid limit={5} />
            <Link className="btn viewall" href="/collection"><span>View the full collection</span></Link>
          </div>
        </section>

        <JoinSection />
      </main>
      <HomeExperience />
    </>
  );
}
