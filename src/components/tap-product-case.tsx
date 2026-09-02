import Image from "next/image"
import type { Project } from "@/data/projects"
import { CaseClosingReveal } from "@/components/case-premise-reveal"
import { CaseHero } from "@/components/case-hero"
import { CaseMoreWorks } from "@/components/case-more-works"
import { CaseStudyIndex } from "@/components/case-study-index"
import { CaseSectionLabel } from "@/components/case-section-label"
import { ArrowLink, ArrowRouteLink } from "@/components/ui-links"

const chapters = [
  ["01", "Read the product"],
  ["02", "Choose the structure"],
  ["03", "Build, test, correct"],
  ["04", "Make it hold"],
] as const

const principles = [
  ["01", "Clarity over density", "Make the next useful action obvious."],
  ["02", "Momentum before detail", "Earn personalisation after the first value."],
  ["03", "Structure by intent", "Organise around what each role is trying to do."],
  ["04", "Consistency at scale", "Reuse product decisions, not only components."],
] as const

const roles = [
  ["Mental coach", "Defines the method and follows progress over time."],
  ["Coach", "Turns the method into plans, groups and daily guidance."],
  ["Athlete", "Prepares, practises, reflects and comes back."],
] as const

export function TapProductCase({ project }: { project: Project }) {
  return <main className="tap-story">
    <CaseHero className="tap-story-hero" kickerClassName="tap-story-kicker" kicker={<>
        <span>[CASE STUDY / 03]</span><span>&gt; PRODUCT REDESIGN</span><i />
        <nav className="tap-story-store-links" aria-label="Download TAP Mindset">
          <ArrowLink variant="primary" tone="purple" href="https://apps.apple.com/il/app/tap-mindset/id6443626525" target="_blank" rel="noreferrer">App Store</ArrowLink>
          <ArrowLink variant="primary" tone="green" href="https://play.google.com/store/apps/details?id=com.tap_mindset&hl=es_419&pli=1" target="_blank" rel="noreferrer">Google Play</ArrowLink>
        </nav>
      </>} title={<>{project.shortTitle}<br />Product redesign /</>} premise="I led the redesign of a mental-training product that had grown one feature at a time. The work was not to make it cleaner. It was to decide what the product was, for whom, and how the team could keep building it." decision="Organise the experience around each role's intent, not the feature list the product had accumulated." meta={<div className="tap-story-meta case-hero-meta-unified">
        <div><small>ROLE</small><p>Lead Product Designer · Product direction</p></div>
        <div><small>TEAM</small><p>Product designers ×2 · Engineers ×2</p></div>
        <div><small>STACK</small><p>Figma · Notion · iOS-first product</p></div>
        <div className="tap-story-ownership"><small>MY OWNERSHIP</small><p>{project.ownership}</p></div>
      </div>} />

    <CaseStudyIndex introduction="From a fragmented product to a role-based structure the team could extend." chapters={chapters} hrefForChapter={number => `#tap-${number}`} />

    <section className="tap-story-chapter" id="tap-01">
      <header><CaseSectionLabel as="p" number="01.00" level="chapter">Read the product</CaseSectionLabel><h2>Before proposing a new product, I had to understand the one we had inherited.</h2></header>

      <article className="tap-story-opening">
        <CaseSectionLabel as="span" number="01.01">The starting point</CaseSectionLabel>
        <div><p className="tap-story-opening-lead">At first, it looked like a navigation problem.</p><p>People were getting lost, labels overlapped and equivalent actions behaved differently. The obvious response was to simplify the interface.</p><p>That reading was useful, but incomplete. When I mapped the recurring journeys, the same problem appeared underneath every screen: a single product was trying to serve three different jobs without making the boundaries visible.</p></div>
      </article>

      <article className="tap-story-map">
        <div className="tap-story-map-copy">
          <CaseSectionLabel as="span" number="01.02">Audit artifact</CaseSectionLabel>
          <h3>Home was carrying too much.</h3>
          <p>It was a starting point, a mode selector, a progress view, a communication surface and a shortcut to daily tools. Each new feature added another decision before an athlete could begin.</p>
          <ul><li>Shared capabilities had different names.</li><li>Role-specific actions lived inside common flows.</li><li>New work created exceptions instead of extending a pattern.</li></ul>
        </div>
        <figure><Image src="/media/tap-product/legacy-architecture.png" alt="Audit map of the inherited TAP Mindset application" width={2600} height={2502} sizes="94vw" /></figure>
      </article>

      <article className="tap-story-finding">
        <CaseSectionLabel as="span" number="01.03">Audit conclusion</CaseSectionLabel>
        <div><h3>This was not a navigation problem.</h3><p>Navigation was where the fragmentation became visible. Underneath it, one product was serving three jobs without a shared model. Every new feature added decisions for users and exceptions for Design and Engineering.</p></div>
        <small>UI symptom → product architecture</small>
      </article>

      <article className="tap-story-turn" aria-label="How the brief changed">
        <div><small>VISIBLE SYMPTOM</small><p>People were getting lost in navigation.</p></div>
        <i>→</i>
        <div><small>PRODUCT PROBLEM</small><p>Three roles were sharing one structure without sharing one job.</p></div>
      </article>

    </section>

    <section className="tap-story-chapter" id="tap-02">
      <header><CaseSectionLabel as="p" number="02.00" level="chapter">Choose the structure</CaseSectionLabel><h2>The redesign needed rules the whole team could use when I was not in the room.</h2></header>

      <article className="tap-story-principles">
        <div className="tap-story-section-intro"><CaseSectionLabel as="span" number="02.01">Four working principles</CaseSectionLabel><p>At that point, I decided the team needed something more useful than a new set of screens. I turned the diagnosis into four working principles we could use in critiques to decide what stayed, what moved and what we deliberately did not build.</p></div>
        <ol>{principles.map(([number,title,body]) => <li key={number}><small>{number}</small><strong>{title}</strong><p>{body}</p></li>)}</ol>
      </article>

      <article className="tap-story-roles">
        <div className="tap-story-section-intro"><CaseSectionLabel as="span" number="02.02">Role architecture</CaseSectionLabel><p>Then I changed the organising idea. The shared system stayed underneath, but the experience above it changed according to the job each person came to do.</p></div>
        <div className="tap-story-role-source">ONE PRODUCT</div>
        <div className="tap-story-role-list">{roles.map(([title,body],index) => <div key={title}><small>0{index+1}</small><h3>{title}</h3><p>{body}</p></div>)}</div>
      </article>

      <article className="tap-story-bet">
        <div className="tap-story-bet-copy"><CaseSectionLabel as="span" number="02.03">The first bet</CaseSectionLabel><h3>Let athletes do something useful before asking us to know them.</h3><p>I started with activation because it exposed the product logic quickly. The old onboarding front-loaded personalisation, so we shortened the entry and moved profile questions into a staged sequence after the first meaningful session.</p></div>
        <div className="tap-story-tradeoff"><small>TRADE-OFF</small><p>Less tailored on day one.</p><i>↔</i><p>More chance of reaching value while motivation was still high.</p></div>
        <figure>
          <Image src="/media/tap-product/onboarding-flow.png" alt="The redesigned TAP Mindset onboarding sequence" width={1600} height={1012} sizes="(min-width: 801px) 48vw, 100vw" />
          <figcaption>ONBOARDING / A STAGED ENTRY INTO THE PRODUCT</figcaption>
        </figure>
      </article>
    </section>

    <section className="tap-story-chapter" id="tap-03">
      <header><CaseSectionLabel as="p" number="03.00" level="chapter">Build, test, correct</CaseSectionLabel><h2>The useful version did not arrive in one pass. We made it, found where it broke and changed course.</h2></header>

      <article className="tap-story-process">
        <div className="tap-story-process-copy"><CaseSectionLabel as="span" number="03.01">Delivery, not a big reveal</CaseSectionLabel><h3>I split the redesign into decisions the team could ship.</h3><p>Then I got the work out of the presentation and into delivery. Foundations came first, then the inherited flows, then role architecture and activation. I ran critiques with two product designers, brought engineering constraints in early and kept final decisions tied to the four principles.</p><p className="tap-story-note">The plan moved. A coach flow exposed assumptions in the athlete experience; an implementation constraint changed how progressive disclosure worked. We updated the sequence instead of protecting the original deck.</p></div>
        <figure><Image src="/media/tap-product/delivery-plan.png" alt="TAP Mindset delivery plan organised by sprint" width={3024} height={1964} sizes="56vw" /></figure>
      </article>

      <article className="tap-story-failure">
        <div><small>EARLY VERSION</small><h3>We simplified too far.</h3><p>The primary route was clearer, but exploratory users lost context and experienced the product as restrictive.</p></div>
        <div><small>WHAT CHANGED</small><h3>We put depth back — later.</h3><p>The next action stayed obvious. Secondary information and tools returned through progressive disclosure, available when the moment called for them.</p></div>
      </article>

      <article className="tap-story-system">
        <div className="tap-story-system-copy"><CaseSectionLabel as="span" number="03.03">From screens to a system</CaseSectionLabel><h3>The interface had to preserve the product logic.</h3><p>We separated daily action from long-term progress, made state and hierarchy explicit, and moved repeated decisions into shared foundations. This was where the product redesign and design-system work met.</p><ArrowRouteLink variant="secondary" tone="purple" href="/projects/tap-mindset-ds">Read the design system case</ArrowRouteLink></div>
        <figure><Image src="/media/tap-product/before-after-foundations.png" alt="Before and after comparison of TAP Mindset product foundations" width={1800} height={1037} sizes="60vw" unoptimized /></figure>
        <div className="tap-story-before-after"><span><b>BEFORE</b> Separate destinations competing for attention.</span><i>→</i><span><b>AFTER</b> Daily practice, progress and reflection connected.</span></div>
      </article>

      <article className="tap-story-identity">
        <div className="tap-story-section-intro"><CaseSectionLabel as="span" number="03.04">Visual identity</CaseSectionLabel><div><h3>The product needed to feel like one thing, too.</h3><p>I translated the same principles into a visual language for product and communication: a recognisable wordmark, restrained iconography, an energetic but controlled palette, and photography centred on athletes rather than abstract wellness.</p></div></div>
        <figure><Image src="/media/tap-product/visual-identity.png" alt="TAP Mindset visual identity system showing wordmark, iconography, colour, typography and photography" width={1740} height={1200} sizes="94vw" /></figure>
      </article>

      <article className="tap-story-market">
        <div className="tap-story-section-intro"><CaseSectionLabel as="span" number="03.05">Product to market</CaseSectionLabel><div><h3>The system had to explain the product before anyone opened the app.</h3><p>I carried the product language into the promotional site: the same hierarchy, tone and visual cues now introduce the value, show the experience and lead athletes towards download.</p></div></div>
        <figure className="tap-story-market-demo">
          <div className="tap-story-laptop">
            <div className="tap-story-laptop-camera" aria-hidden="true" />
            <div className="tap-story-laptop-screen"><Image src="/media/tap-product/landing-page-full.png" alt="TAP Mindset promotional website, from hero through product benefits and download" width={1440} height={6918} sizes="82vw" /></div>
          </div>
          <div className="tap-story-laptop-base" aria-hidden="true"><i /></div>
          <figcaption>MARKETING SITE / PRODUCT STORY IN MOTION</figcaption>
        </figure>
      </article>
    </section>

    <section className="tap-story-chapter" id="tap-04">
      <header><CaseSectionLabel as="p" number="04.00" level="chapter">Make it hold</CaseSectionLabel><h2>The outcome was not one perfect flow. It was a product whose logic survived across the experience.</h2></header>

      <article className="tap-story-product-proof">
        <div className="tap-story-section-intro"><CaseSectionLabel as="span" number="04.01">The athlete experience</CaseSectionLabel><p>One system now connects the athlete&apos;s daily practice, preparation, training plan and conversation with a coach.</p></div>
        <figure className="tap-story-final-reveal">
          <Image src="/media/tap-product/final-product-reveal.png" alt="TAP Mindset final product across daily practice, preparation, planning, assessment, statistics and calendar flows" width={2093} height={1023} sizes="94vw" />
          <figcaption>FINAL PRODUCT / ONE SYSTEM, MULTIPLE JOBS</figcaption>
        </figure>
        <div className="tap-story-phone-showcase" aria-label="Four parts of the athlete experience">
          <figure><div><Image src="/media/tap-product/athlete-daily.png" alt="Athlete daily practice screen" width={900} height={1800} sizes="22vw" /></div><figcaption>01 / DAILY PRACTICE</figcaption></figure>
          <figure><div><Image src="/media/tap-product/athlete-plan.png" alt="Athlete training plan screen" width={900} height={1800} sizes="22vw" /></div><figcaption>02 / PLAN</figcaption></figure>
          <figure><div><Image src="/media/tap-product/athlete-messages.png" alt="Athlete and coach messages screen" width={900} height={1800} sizes="22vw" /></div><figcaption>03 / COACHING</figcaption></figure>
          <figure><div><Image src="/media/tap-product/routine-feedback.jpeg" alt="Athlete routine feedback screen" width={900} height={1800} sizes="22vw" /></div><figcaption>04 / REFLECTION</figcaption></figure>
        </div>
      </article>

      <article className="tap-story-outcomes">
        <div className="tap-story-outcome-lead"><CaseSectionLabel as="span" number="04.02">Early evidence</CaseSectionLabel><h3>Clearer in testing. Ready to be proved in product.</h3><p>I did not treat prototype validation as business impact. It gave us confidence in the direction and a concrete measurement plan for beta.</p></div>
        <div className="tap-story-outcome-stats">
          <div><strong>5/6</strong><p>athletes chose the intended starting path without prompting</p></div>
          <div><strong>−38%</strong><p>fewer decisions before reaching a first session in the redesigned flow</p></div>
          <div><strong>3 roles</strong><p>aligned with product and domain leads in one architecture</p></div>
          <div><strong>4 signals</strong><p>defined for beta: comprehension, activation, completion and return</p></div>
        </div>
      </article>

      <article className="tap-story-leadership">
        <CaseSectionLabel as="span" number="04.03">What I owned</CaseSectionLabel>
        <h3>Direction without becoming the bottleneck.</h3>
        <div><p>I set the architecture and principles, divided the work into role, activation and system workstreams, and gave each designer a clear decision space.</p><p>I used critique to connect local choices back to the product model, partnered with Engineering before flows hardened, and made the call when user needs, scope and buildability pulled in different directions.</p><p>The most important leadership decision was not defending the first solution. It was making the reasoning visible enough for the team to challenge it and continue the work.</p></div>
      </article>

      <CaseClosingReveal>The redesign became credible when the product stopped needing us to explain how its pieces fitted together.</CaseClosingReveal>
    </section>

    <CaseMoreWorks previous={{href:"/projects/tap-mindset-ds",title:"TAP Design System",description:"Building the system that keeps product, design and code in sync."}} next={{href:"/projects/fluxy",title:"Fluxy",description:"Designing an agent that earns autonomy through legibility and consent."}} />
  </main>
}
