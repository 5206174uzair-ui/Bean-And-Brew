import { ArrowDownRight, ArrowUpRight, Clock3, Instagram, MapPin, Phone, ShoppingBag, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const heroImage = "/manus-storage/copper-kettle-hero_67f4ae9a.jpg";

const highlights = [
  { number: "01", title: "House roasted", text: "Single-origin beans, roasted in small batches just down the road." },
  { number: "02", title: "Baked this morning", text: "Buttery pastries and naturally leavened loaves, out before 7am." },
  { number: "03", title: "Good company", text: "A corner table, a long lunch, a place to land for a while." },
];

function QuickAction({ icon, label, sublabel, href, external = false }: { icon: React.ReactNode; label: string; sublabel: string; href: string; external?: boolean }) {
  const content = <><span className="quick-action__icon">{icon}</span><span className="quick-action__copy"><strong>{label}</strong><small>{sublabel}</small></span><ArrowUpRight className="quick-action__arrow" size={17} /></>;
  return external ? <a href={href} aria-label={label} title={label} className="quick-action">{content}</a> : <Link href={href} aria-label={label} title={label} className="quick-action">{content}</Link>;
}

export default function Home() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const sceneStyle = { "--scene-x": `${pointer.x}px`, "--scene-y": `${pointer.y}px` } as React.CSSProperties;

  return (
    <main>
      <section className="hero hero--3d" style={{ backgroundImage: `url(${heroImage})` }} onPointerMove={(event) => { if (event.pointerType === "touch") return; const rect = event.currentTarget.getBoundingClientRect(); setPointer({ x: (event.clientX - rect.left - rect.width / 2) / 18, y: (event.clientY - rect.top - rect.height / 2) / 22 }); }} onPointerLeave={() => setPointer({ x: 0, y: 0 })}>
        <div className="hero__veil" />
        <div className="hero__grain" />
        <div className="hero-3d" aria-label="A stylized three-dimensional coffee cup and saucer" style={sceneStyle}>
          <div className="hero-3d__orb hero-3d__orb--one" />
          <div className="hero-3d__orb hero-3d__orb--two" />
          <div className="hero-3d__halo" />
          <div className="hero-3d__steam hero-3d__steam--one" />
          <div className="hero-3d__steam hero-3d__steam--two" />
          <div className="hero-3d__saucer"><div className="hero-3d__saucer-rim" /></div>
          <div className="hero-3d__cup"><div className="hero-3d__cup-rim"><span /></div><div className="hero-3d__cup-body" /><div className="hero-3d__handle" /></div>
          <div className="hero-3d__bean hero-3d__bean--one" /><div className="hero-3d__bean hero-3d__bean--two" /><div className="hero-3d__bean hero-3d__bean--three" />
          <span className="hero-3d__caption">Single origin · slow pour</span>
        </div>
        <div className="hero__content">
          <p className="eyebrow eyebrow--light"><span className="eyebrow__line" /> Est. 2016 · Mercer Lane</p>
          <h1>A little more<br /><em>slow</em> in your day.</h1>
          <p className="hero__lede">Coffee, food, and a warm place to pause.<br />Come in as you are.</p>
          <Link href="/menu" className="button button--copper">See what's brewing <ArrowUpRight size={16} /></Link>
        </div>
        <div className="hero__side-note"><span>Scroll to savour</span><ArrowDownRight size={18} /></div>
        <div className="quick-actions" aria-label="Cafe shortcuts">
          <QuickAction icon={<MapPin size={19} />} label="Find us" sublabel="18 Mercer Lane" href="#visit" external />
          <QuickAction icon={<ShoppingBag size={19} />} label="Order now" sublabel="Take it with you" href="/menu" />
          <QuickAction icon={<Phone size={19} />} label="Call now" sublabel="+1 555 014 2765" href="tel:+15550142765" external />
        </div>
        <div className="hero__stamp"><Sparkles size={14} /><span>Freshly made<br />every morning</span></div>
      </section>

      <section className="intro section-shell">
        <div className="intro__label"><span className="eyebrow__line eyebrow__line--dark" /> The everyday ritual</div>
        <div className="intro__copy"><h2>Good coffee is<br /><em>always</em> a good idea.</h2><p>We believe the best parts of the day happen in the in-between: the first sip, the corner table, the friend who stays for one more. Bean &amp; Brew is your neighborhood pause button.</p><Link href="/menu" className="text-link">Meet the menu <ArrowUpRight size={16} /></Link></div>
      </section>

      <section className="story-strip">
        <div className="story-strip__image" />
        <div className="story-strip__copy"><p className="eyebrow">From the kettle</p><h3>Roasted with curiosity.<br />Served with care.</h3><p>Our menu follows the seasons and our mood — a little familiar, a little unexpected, always worth lingering over.</p><Link href="/menu" className="text-link text-link--light">Explore everything <ArrowUpRight size={16} /></Link></div>
      </section>

      <section className="highlights section-shell">
        <div className="section-heading"><div><p className="eyebrow">Why Bean &amp; Brew</p><h2>Made for the<br /><em>long way round.</em></h2></div><p className="section-heading__aside">No rush. No fuss.<br />Just really good things.</p></div>
        <div className="highlight-grid">{highlights.map((item) => <article className="highlight-card" key={item.number}><span className="highlight-card__number">{item.number}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
      </section>

      <section className="visit" id="visit">
        <div className="visit__map"><div className="map-grid" /><div className="map-pin"><MapPin size={22} fill="currentColor" /></div><span className="map-label">Bean &amp; Brew<br /><small>18 Mercer Lane</small></span></div>
        <div className="visit__details"><p className="eyebrow">Come by sometime</p><h2>Your table is<br /><em>waiting.</em></h2><p className="visit__body">Tucked between the bookshop and the flower stall, we’re easy to find and hard to leave.</p><div className="visit__meta"><div><Clock3 size={17} /><span><strong>Open daily</strong>7:00 — 17:00</span></div><div><MapPin size={17} /><span><strong>18 Mercer Lane</strong>Brooklyn, NY 11211</span></div></div><a href="https://maps.google.com/?q=18+Mercer+Lane+Brooklyn+NY" className="button button--outline" target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={16} /></a></div>
      </section>

      <section className="newsletter section-shell"><div><p className="eyebrow">A note from the kettle</p><h2>Good things,<br /><em>occasionally.</em></h2></div><div className="newsletter__form"><p>Seasonal specials, fresh bakes, and the occasional excuse to stop by. No noise, promise.</p><div className="email-row"><input aria-label="Email address" placeholder="Your email address" type="email" /><button type="button">Join us <ArrowUpRight size={15} /></button></div><small>By subscribing, you agree to receive the occasional cafe note.</small></div></section>
    </main>
  );
}
