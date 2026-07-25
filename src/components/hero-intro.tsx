"use client"

export function HeroIntro() {
  return <section className="home-hero" aria-label="Introduction">
    <div className="intro-sequence" aria-hidden="true"><span>Systems</span></div>
    <div className="hero-intro-copy">
      <div className="hero-small-words"><span>Clarity.</span><span>Structure.</span></div>
      <p>I design complex products and the systems behind them, turning ambiguous workflows into clear product decisions, scalable foundations and responsible AI.</p>
    </div>
    <div className="hero-reel"><video src="/media/ZOeDI7fC0g8dMMaYluHtSKEnHe0.mp4" autoPlay muted loop playsInline /></div>
    <div className="hero-ticker"><span>AI Workflows</span><span>Design Systems</span></div>
    <div className="hero-system-wrap"><span className="hero-system">Systems</span></div>
  </section>
}
