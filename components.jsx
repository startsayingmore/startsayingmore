// SSM Website — Revamp components

const { useState, useEffect, useRef } = React;

// ============================================================
// Small icon helper (inline SVGs — Lucide-style)
// ============================================================
function Icon({ name, size = 18, stroke = "currentColor", strokeWidth = 1.75 }) {
  const paths = {
    arrow: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
    check: <polyline points="20 6 9 17 4 12" />,
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
    sparkle: <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z" />,
    instagram: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></>,
    tiktok: <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />,
    mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>);

}

// ============================================================
// Header
// ============================================================
function Header({ active, onNavigate, ctaUrl }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { id: "home",  label: "Home" },
    { id: "about", label: "About" },
    { id: "match", label: "Get matched" },
  ];

  const go = (id) => { setMenuOpen(false); onNavigate(id); };

  return (
    <header className="site-header" data-screen-label="Header">
      <div className="site-header__inner">
        <a className="site-header__brand" onClick={(e) => { e.preventDefault(); go("home"); }} href="#">
          <img src="assets/logos/primary-logo-standard.png" alt="Start Saying More" />
        </a>
        <nav className="site-header__nav">
          {links.map((l) =>
            <a key={l.id} href="#"
              onClick={(e) => { e.preventDefault(); go(l.id); }}
              className={active === l.id ? "active" : ""}>
              {l.label}
            </a>
          )}
        </nav>
        <button className="btn btn--primary btn--sm site-header__cta-desktop" onClick={() => go("match")}>
          Find your match <Icon name="arrow" size={16} />
        </button>
        <button className="site-header__burger" aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>
      {menuOpen && (
        <div className="site-header__mobile-menu">
          {links.map((l) =>
            <a key={l.id} href="#"
              onClick={(e) => { e.preventDefault(); go(l.id); }}
              className={active === l.id ? "active" : ""}>
              {l.label}
            </a>
          )}
          <button className="btn btn--primary" onClick={() => go("match")}>
            Find your match <Icon name="arrow" size={16} />
          </button>
        </div>
      )}
    </header>
  );
}

// ============================================================
// Footer
// ============================================================
function Footer({ onNavigate, ctaUrl }) {
  return (
    <footer className="site-footer" data-screen-label="Footer">
      <div className="site-footer__pattern"></div>
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <img src="assets/logos/secondary-logo-purple.png" alt="Start Saying More" data-comment-anchor="a86185949f-img-72-11" />
          <p className="site-footer__tag" style={{ fontFamily: "Poppins" }}></p>
          <a className="site-footer__cta" href="#" onClick={(e) => {e.preventDefault();onNavigate("form");}}>
            Get matched today <Icon name="arrow" size={14} stroke="currentColor" />
          </a>
        </div>
        <div className="site-footer__cols">
          <div className="site-footer__col">
            <h4>Explore</h4>
            <a href="#" onClick={(e) => {e.preventDefault();onNavigate("home");}}>Home</a>
            <a href="#" onClick={(e) => {e.preventDefault();onNavigate("about");}}>About / Our story</a>
            <a href="#" onClick={(e) => {e.preventDefault();onNavigate("match");}}>Get matched</a>
          </div>
          <div className="site-footer__col">
            <h4>Contact</h4>
            <a href="mailto:info@startsayingmore.com">info@startsayingmore.com</a>
            <a href="#">For therapists</a>
            <a href="#">Press inquiries</a>
          </div>
          <div className="site-footer__col">
            <h4>Follow</h4>
            <div className="site-footer__socials">
              <a href="#" aria-label="Instagram"><Icon name="instagram" size={16} stroke="white" /></a>
              <a href="#" aria-label="TikTok"><Icon name="tiktok" size={16} stroke="white" /></a>
              <a href="#" aria-label="Email"><Icon name="mail" size={16} stroke="white" /></a>
            </div>
          </div>
        </div>
      </div>
      <div className="site-footer__bottom">
        <span>© 2026 Start Saying More, LLC</span>
        <span>Founded 2020</span>
      </div>
    </footer>);

}

// ============================================================
// HOME — hero variants
// ============================================================
function HomeHero({ variant, onMatch, onAbout }) {
  const Copy =
  <div className="hero__copy">
      <p className="eyebrow">BRIDGING THE GAP, BECAUSE</p>
      <h1 className="hero__h1">
        You shouldn't have to go through 10 therapists to find <em>one</em>.
      </h1>
      <p className="hero__lead">
        Start Saying More connects Black and minority people to therapists who get them — through plain-spoken intake and matching that finally accounts for who you are.
      </p>
      <div className="hero__ctas">
        <button className="btn btn--primary btn--lg" onClick={onMatch}>
          Find your match <Icon name="arrow" size={16} />
        </button>
        <button className="btn btn--secondary btn--lg" onClick={onAbout}>Read our story</button>
      </div>
      <p className="hero__fine">
        <span><Icon name="check" size={14} /> Affordable</span>
        <span><Icon name="lock" size={14} /> Confidential</span>
        <span><Icon name="heart" size={14} /> Built for you</span>
      </p>
    </div>;


  if (variant === "bleed") {
    return (
      <section className="hero hero--bleed" data-screen-label="Home / Hero (full-bleed)">
        <div className="hero__photo">
          <BrandIllo name="home-hero-bleed" />
        </div>
        {Copy}
      </section>);

  }
  if (variant === "type") {
    return (
      <section className="hero hero--type" data-screen-label="Home / Hero (type-led)">
        <p className="eyebrow">Start Saying More</p>
        <h1 className="hero__h1">
          Bridging<br />the gap<br /><em>between you</em><br />& a therapist.
        </h1>
        <div className="hero__lead-row">
          <p className="hero__lead">
            We connect Black and minority people to therapists who get them — through plain-spoken intake and matching that finally accounts for who you are.
          </p>
          <div className="hero__ctas">
            <button className="btn btn--secondary btn--lg" onClick={onAbout}>Read our story</button>
            <button className="btn btn--primary btn--lg" onClick={onMatch}>
              Find your match <Icon name="arrow" size={16} />
            </button>
          </div>
        </div>
      </section>);

  }
  // Split (default)
  return (
    <section className="hero hero--split" data-screen-label="Home / Hero (split)">
      {Copy}
      <div className="hero__photo">
        <BrandIllo name="home-hero-split" />
      </div>
    </section>);

}

// ============================================================
// HOME — stats strip
// ============================================================
function StatsStrip() {
  return (
    <section className="stats-strip" data-screen-label="Home / Stats">
      <div className="stats-strip__inner">
        <div className="stat">
          <div className="stat__num">56<sup>%</sup></div>
          <p className="stat__label">of African Americans with major depression don't seek treatment.</p>
          <p className="stat__source">Source — APA</p>
        </div>
        <div className="stat">
          <div className="stat__num">51<sup>%</sup></div>
          <p className="stat__label">drop out of therapy after fewer than four visits.</p>
          <p className="stat__source">Source — Mental Health America</p>
        </div>
        <div className="stat">
          <div className="stat__num">31<sup>%</sup></div>
          <p className="stat__label">treatment rate vs. 49% for non-Hispanic White adults.</p>
          <p className="stat__source">Source — SAMHSA</p>
        </div>
      </div>
    </section>);

}

// ============================================================
// HOME — mission
// ============================================================
function MissionBlock({ onAbout }) {
  return (
    <section className="mission" data-screen-label="Home / Mission">
      <div className="mission__inner">
        <div>
          <p className="eyebrow">Our mission</p>
          <h2 className="mission__h2">We exist to <em>eliminate the search</em>.</h2>
          <p className="mission__body">Minority groups aren't starting or staying in therapy — and the reason isn't only stigma. It's the search itself: too many directories, not enough information, and no real way to know if someone will get you before you sit in a session.

          </p>
          <p className="mission__body">We're changing that. One short intake. One match that takes identity and experience seriously.

          </p>
          <button className="btn btn--secondary" onClick={onAbout}>
            Read our full story <Icon name="arrow" size={16} />
          </button>
        </div>
        <div className="mission__photo">
          <BrandIllo name="home-mission" />
          <span className="mission__photo-cap">Founded 2020</span>
        </div>
      </div>
    </section>);

}

// ============================================================
// HOME — bottom CTA
// ============================================================
function CtaStrip({ onMatch }) {
  return (
    <section className="cta-strip" data-screen-label="Home / CTA strip">
      <div className="cta-strip__pattern" data-comment-anchor="87df51c90d-div-240-7"></div>
      <div className="cta-strip__inner">
        <div>
          <h2 style={{ fontFamily: "Poppins" }}>Start saying more about what you're going through.</h2>
          <p>The form takes about 5 minutes. We'll come back with a therapist who actually fits.</p>
        </div>
        <div className="cta-strip__actions">
          <button className="btn btn--accent btn--lg" onClick={onMatch}>
            Find your match <Icon name="arrow" size={16} />
          </button>
          <span style={{ fontSize: 13, color: "var(--fg-muted)", letterSpacing: "0.04em" }}>

          </span>
        </div>
      </div>
    </section>);

}

// ============================================================
// HOME page
// ============================================================
function HomePage({ heroVariant, onNavigate, ctaUrl }) {
  const onMatch = () => onNavigate("match");
  return (
    <main data-screen-label="01 Home">
      <HomeHero variant={heroVariant} onMatch={onMatch} onAbout={() => onNavigate("about")} />
      <StatsStrip />
      <MissionBlock onAbout={() => onNavigate("about")} />
      <CtaStrip onMatch={onMatch} />
    </main>);

}

// ============================================================
// ABOUT page
// ============================================================
function AboutPage({ onNavigate, ctaUrl }) {
  return (
    <main data-screen-label="02 About">
      <section className="about-hero" data-screen-label="About / Hero">
        <p className="eyebrow">Our story</p>
        <h1 className="about-hero__h1">
          Built by someone who's seen the process <em>discourage people .</em>
        </h1>
        <p className="about-hero__lead">Start Saying More was founded after watching too many friends and family members give up on therapy after one bad match.

        </p>
      </section>

      <section className="about-section" data-screen-label="About / Problem">
        <div className="about-section__copy">
          <p className="eyebrow">The problem</p>
          <h2>Therapy doesn't fail people. The search does.</h2>
          <p>Most platforms treat "find a therapist" like a real-estate listing: sortable filters, headshots, copy that all reads the same. For Black and minority people, that's where it stops working. The questions you actually need answered — does this person understand my family, my faith, my identity, the specific weight I'm carrying — never get asked.

          </p>
          <p className="about-section__pull" style={{ fontFamily: "Poppins" }}>
            We don't help you browse therapists. We help you stop browsing.
          </p>
          <p>A short, plain-spoken intake. A match that accounts for who you are, not just what you say is wrong.

          </p>
        </div>
        <div className="about-section__media">
          <BrandIllo name="about-problem" />
        </div>
      </section>

      <section className="values" data-screen-label="About / Values">
        <div className="values__inner">
          <div className="values__head">
            <h2>What we hold steady.</h2>
            <p>Three principles that show up in every match, every email, every conversation.</p>
          </div>
          <div className="values__grid">
            <div className="value-card">
              <span className="value-card__num" style={{ fontFamily: "Poppins" }}>01</span>
              <h3>You-first, always.</h3>
              <p>We build for the person searching, not the therapist's calendar. Your fit, your terms, your timing.</p>
            </div>
            <div className="value-card">
              <span className="value-card__num" style={{ fontFamily: "Poppins" }}>02</span>
              <h3>Plain-spoken, never clinical.</h3>
              <p>No jargon. No diagnosis-as-greeting. The whole brand is built around starting to say what's actually going on.</p>
            </div>
            <div className="value-card">
              <span className="value-card__num" style={{ fontFamily: "Poppins" }}>03</span>
              <h3>Identity is information.</h3>
              <p>Race, faith, gender, language, family — these aren't optional filters. They're how a real match gets made.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="founder" data-screen-label="About / Founder" style={{ fontFamily: "Poppins" }}>
        <div className="founder__photo">
          <img src="assets/founder-lamide.jpg" alt="Olamide 'Lamide' Afolabi, Founder of Start Saying More"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 5%" }} />
        </div>
        <div>
          <p className="eyebrow" style={{ textTransform: "none", fontFamily: "Poppins" }}>FROM THE FOUNDER</p>
          <p className="founder__quote" style={{ fontFamily: "Poppins" }}>I built the thing I wished I'd had at 22 — a way to skip the bad fits and start with one that actually feels safe.

          </p>
          <div className="founder__byline">
            <span className="founder__byline-avatar">
</span>
            <div>
              <p className="founder__byline-name">Olamide "Lamide" Afolabi</p>
              <p className="founder__byline-title">Founder, Start Saying More</p>
            </div>
          </div>
        </div>
      </section>

      <CtaStrip onMatch={() => onNavigate("match")} />
    </main>);
}

// ============================================================
// MATCH page
// ============================================================
function MatchPage({ ctaUrl, onNavigate }) {
  const [openFaq, setOpenFaq] = useState(0);
  const faqs = [
  { q: "How long does the intake form take?",
    a: "About 5 minutes. It's plain-spoken — no clinical jargon, no trick questions. We ask what you'd want a friend to know before recommending someone." },
  { q: "What happens after I submit?",
    a: "Our matching system reviews your responses against available therapist directories and emails you a short list of fits — usually within 1–2 business days. You book directly. No middlemen." },
  { q: "Is this free?",
    a: "No. The matching itself is $5. The therapist you book with sets their own rates, and we'll surface that, along with sliding scale and insurance info, in your matches." },
  { q: "What if the first match isn't a fit?",
    a: "Tell us. We re-match. There's no cap and no awkward conversation required — we'd rather get it right on attempt two than have you give up." },
  { q: "Who is this built for?",
    a: "Anyone who has felt like the standard 'find a therapist' flow wasn't built with them in mind — Black and minority adults especially. But the door is open." }];


  return (
    <main data-screen-label="03 Match">
      <section className="match-hero" data-screen-label="Match / Hero">
        <div>
          <p className="eyebrow">Get matched</p>
          <h1 className="match-hero__h1">
            One short form. <em>One real match.</em>
          </h1>
          <p className="match-hero__lead">
            Tell us what you're looking for and a little about who you are. We'll come back with therapists who fit — usually within a couple of days.
          </p>
          <div className="match-hero__stat">
            <Icon name="clock" size={18} />
            <span><strong>~5 minutes</strong> · 1–2 day turnaround · Only $5</span>
          </div>
          <div className="hero__ctas">
            <a className="btn btn--primary btn--lg" href="#" onClick={(e) => {e.preventDefault(); onNavigate && onNavigate("form");}}>
              Start the form <Icon name="arrow" size={16} />
            </a>
            <a className="btn btn--ghost btn--lg" href="#expect"
              onClick={(e) => { e.preventDefault(); document.getElementById("expect")?.scrollIntoView({ behavior: "smooth" }); }}>
              See what to expect ↓
            </a>
          </div>
        </div>
        <div className="match-hero__photo">
          <BrandIllo name="match-hero" />
        </div>
      </section>

      <section className="expect" id="expect" data-screen-label="Match / What to expect">
        <div className="expect__head">
          <p className="eyebrow eyebrow--bare">What to expect</p>
          <h2>Three steps. No 60-minute session to find out it isn't a fit.</h2>
        </div>
        <div className="expect__grid">
          <div className="expect__card">
            <img src="assets/icons/step2-survey.png" alt="" />
            <span className="expect__card__num" style={{ fontFamily: "Poppins" }}>01</span>
            <h3>What's on your plate</h3>
            <p>Tell us your experiences, areas of concern, and what you want from a therapist.</p>
          </div>
          <div className="expect__card">
            <img src="assets/icons/step3-algorithm.png" alt="" />
            <span className="expect__card__num" style={{ fontFamily: "Poppins" }}>02</span>
            <h3>We do the matching</h3>
            <p>Our system pairs you on identity, experience, and concern — not just availability.</p>
          </div>
          <div className="expect__card" data-comment-anchor="1ed86d7248-div-409-11">
            <img src="assets/icons/step4-match.png" alt="" />
            <span className="expect__card__num" style={{ fontFamily: "Poppins" }}>03</span>
            <h3>Your shortlist arrives</h3>
            <p>You receive a shortlist of therapists who fit. Book directly. Switch any time.</p>
          </div>
        </div>
      </section>

      <section className="checklist" data-screen-label="Match / Checklist">
        <div className="checklist__inner">
          <div className="checklist__head">
            <p className="eyebrow">Before you start</p>
            <h2>A few things worth knowing.</h2>
            <p>None of this is a barrier — just a heads-up so the form goes faster and the match comes back sharper.</p>
          </div>
          <div className="checklist__items">
            {[
            { h: "You don't need a diagnosis.", p: "If you can describe what you're going through in your own words, you're ready." },
            { h: "Insurance, sliding scale, or out-of-pocket — all welcome.", p: "Tell us your situation and we'll match accordingly. " },
            { h: "You can specify exactly who you want to talk to.", p: "Black therapist, woman, LGBTQ+, faith-friendly, language preference — none of it is taboo. It's the whole point." },
            { h: "Telehealth or in-person.", p: "We'll filter by your state and your preference. Most matches offer both." },
            { h: "It's confidential.", p: "Your responses go to our matching team and to you. Nowhere else." }].
            map((it, i) =>
            <div className="checklist__item" key={i}>
                <span className="checklist__item__check"><Icon name="check" size={14} stroke="white" strokeWidth={2.5} /></span>
                <div className="checklist__item__copy">
                  <h4>{it.h}</h4>
                  <p>{it.p}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="match-cta" data-screen-label="Match / CTA card">
        <div className="match-cta__card">
          <p className="eyebrow">Ready when you are</p>
          <h2 style={{ fontFamily: "Poppins" }}>Start saying more about <em style={{ fontFamily: "Poppins" }}>what you're going through</em>.</h2>
          <p>The form is short. The match is real. The next step is yours.</p>
          <a className="btn btn--accent btn--lg" href="#" onClick={(e) => {e.preventDefault(); onNavigate && onNavigate("form");}}>
            Open the matching form <Icon name="arrow" size={16} />
          </a>
          <div className="match-cta__meta">
            <span className="match-cta__meta-item"><Icon name="clock" size={14} /> ~5 min</span>
            <span className="match-cta__meta-item"><Icon name="lock" size={14} /> Confidential</span>
            <span className="match-cta__meta-item"><Icon name="sparkle" size={14} /> Only $5</span>
          </div>
        </div>
      </section>

      <section className="faq" data-screen-label="Match / FAQ">
        <div className="faq__head">
          <p className="eyebrow eyebrow--bare">Common questions</p>
          <h2>Quick answers, plainly said.</h2>
        </div>
        <div className="faq__list">
          {faqs.map((f, i) =>
          <div key={i} className={`faq__item ${openFaq === i ? "is-open" : ""}`}>
              <button className="faq__q" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                <span>{f.q}</span>
                <span className="faq__q__icon"><Icon name="plus" size={14} stroke="currentColor" /></span>
              </button>
              <div className="faq__a"><div className="faq__a-inner">{f.a}</div></div>
            </div>
          )}
        </div>
      </section>
    </main>);

}

Object.assign(window, {
  Icon, Header, Footer,
  HomePage, AboutPage, MatchPage,
  HomeHero, StatsStrip, MissionBlock, CtaStrip
});