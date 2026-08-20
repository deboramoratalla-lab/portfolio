import Image from "next/image"
import Link from "next/link"
import { BoardRevealText } from "@/components/board-reveal-text"
import { CaseMoreWorks } from "@/components/case-more-works"
import { CaseStudyIndex } from "@/components/case-study-index"

const productRules = [
  ["Where am I?", "Keep workflow state persistent", "The cycle remains visible when a person moves between screens."],
  ["What is waiting on me?", "Rank work by consequence", "Priority reflects the people and steps an action is blocking."],
  ["What happens next?", "Treat dependencies as product data", "Every approval makes its next owner and outcome explicit."],
]

export function BoardCase() {
  return <main className="board-page">
    <section className="board-hero case-hero-unified" id="top">
      <div className="board-hero-kicker case-hero-kicker-unified"><span>[CASE STUDY / 01]</span><span>&gt; ENTERPRISE PRODUCT DESIGN</span><i /></div>
      <h1 className="case-hero-title-unified">Enterprise Planning /</h1>
      <div className="board-hero-premise"><BoardRevealText>I was asked to make an enterprise planning product clearer. Across a €1.2B annual cycle, the real job was to help people see the work that depended on them — before the budget cycle did.</BoardRevealText></div>
      <dl className="board-hero-meta case-hero-meta-unified">
        <div><dt>Role</dt><dd>Solo Senior Product Designer</dd></div>
        <div><dt>Team</dt><dd>SUEZ Finance · Product · Engineering</dd></div>
        <div><dt>Stack</dt><dd>Board platform · Figma · Enterprise workflows</dd></div>
        <div><dt>My ownership</dt><dd>Problem framing · Interaction design · Rule system</dd></div>
      </dl>
    </section>

    <CaseStudyIndex className="board-index" chapters={[["01", "Find the real problem"], ["02", "Turn it into product rules"], ["03", "Make it survive delivery"]]} hrefForChapter={number => `#board-${number}`} />

    <section className="board-scope" aria-label="Project scale">
      <div className="board-scope-intro"><small>[ PROJECT SCALE ]</small><p>One annual planning cycle, coordinated across four layers of complexity.</p></div>
      <div className="board-scope-cards">
        <article><small>Annual planning cycle</small><strong>€1.2B</strong><p>The financial context the product had to make legible.</p></article>
        <article><small>Operating footprint</small><strong>24</strong><p>Regions moving through the same cycle at different moments.</p></article>
        <article><small>Local execution</small><strong>186</strong><p>Agencies contributing work, evidence and approvals.</p></article>
        <article><small>Coordination model</small><strong>3 roles</strong><p>National, regional and agency responsibilities made explicit.</p></article>
      </div>
    </section>

    <section className="board-act board-light board-diagnosis" id="board-01">
      <div className="board-act-top"><small className="board-section-label">[01.01] &gt; READ THE PRODUCT</small><div><h2>The brief described inconsistent screens.<br />The work showed me a coordination problem.</h2></div></div>
      <div className="board-act-bottom"><h3>The information was there. People still needed email and meetings to understand what should move next.</h3><div><p>Finance leads, regional controllers and agency teams entered the same annual plan from different points in the cycle. They could find numbers, forms and approvals, but not the story between them: what had changed, who owned the next move or which dependency was holding the cycle back.</p><p>At that point I stopped treating the work as a navigation clean-up. I changed the question to: <em>what would let someone understand their position in the cycle without asking another person to reconstruct it?</em></p></div></div>
    </section>

    <section className="board-act board-dark board-evidence">
      <div className="board-evidence-copy">
        <small className="board-section-label">[01.02] &gt; EXISTING EXPERIENCE</small>
        <h2>It behaved like a collection of destinations,<br />not one connected operating cycle.</h2>
        <h3>The information existed. The story between it did not.</h3>
      </div>
      <figure><div><Image src="/media/board-original-product-hq.jpg" alt="Original Board homepage shown inside its editorial frame" fill sizes="100vw" quality={92} /></div></figure>
    </section>

    <section className="board-act board-light board-attempt">
      <div className="board-attempt-layout">
        <figure><div><Image src="/media/board-budget-workflow.png" alt="Budget and forecast workflow map shown inside its editorial frame" fill sizes="100vw" quality={92} /></div></figure>
        <div className="board-attempt-copy-column">
          <div className="board-split-title"><small className="board-section-label">[01.03] &gt; FIRST ATTEMPT</small><h2>I mapped the entire cycle.<br />It made the gap easier to see.</h2></div>
          <div className="board-attempt-copy"><p>My first instinct was to make the process visible end to end: phases, gates, inputs and handovers in one comprehensive flow. It was a useful artefact for the team — and a poor interface for someone trying to finish today’s task.</p><p>In reviews, people could explain the diagram but still asked the same operational questions: <em>what is mine, what is blocked, and what happens if I do nothing?</em> The map was not the answer. It was the evidence that we needed a different one.</p><p>The redesign began when I separated the cycle the organisation needed to run from the context each person needed to act.</p></div>
        </div>
      </div>
    </section>

    <section className="board-act board-cyan board-reframe">
      <small className="board-section-label">[01.04] &gt; THE REFRAME</small><h2>The interface had to carry the operating model —<br />not merely show its outputs.</h2>
      <div><p><b>What people asked for</b>Cleaner navigation and fewer visual inconsistencies.</p><p><b>What the audit showed</b>State, ownership and dependencies were split across places.</p><p><b>What I designed for</b>A cycle that could be read, acted on and handed forward.</p></div>
    </section>

    <section className="board-act board-dark board-questions">
      <small className="board-section-label">[01.05] &gt; QUESTIONS TO RESOLVE</small>
      <h2>The product asked people<br />to carry four answers in memory.</h2>
      <p>These were the moments where a screen became an operating cost. I used them as the test for every new pattern.</p>
      <div>{[["Progress","Where am I, and what is complete?"],["Ownership","Who approves this? Who owns next?"],["Dependencies","What is blocking me?"],["Next steps","What should I do now?"]].map(([a,b],i)=><article key={a} className={a==="Dependencies"?"active":""}><small>{String(i+1).padStart(2,"0")}</small><h3>{a}</h3><p>{b}</p></article>)}</div>
    </section>

    <section className="board-act board-lime board-rules" id="board-02">
      <div className="board-act-top"><small className="board-section-label">[02.01] &gt; CHOOSE THE STRUCTURE</small><div><h2>I wrote the rules before I polished the screens.</h2></div></div>
      <p className="board-rules-intro">The useful unit was not a page or component. It was a decision the product needed to make consistently across roles, regions and stages of the cycle.</p>
      <div className="board-rule-model">{productRules.map(([question,rule,effect],i)=><article key={rule}><small>{String(i+1).padStart(2,"0")} / USER QUESTION</small><h3>{question}</h3><div><span>PRODUCT RULE</span><strong>{rule}</strong></div><p>{effect}</p></article>)}</div>
    </section>

    <section className="board-act board-coordination">
      <div className="board-coordination-lead">
        <div className="board-split-title"><small className="board-section-label">[02.02] &gt; PRIMARY CRAFT EVIDENCE</small><h2>The workflow could not disappear<br />when the screen changed.</h2></div>
        <div className="board-coordination-media"><figure><video src="/media/hi5RUlder0uFb2zoYYPHJlwIt3E.mov" autoPlay muted loop playsInline /><figcaption className="board-caption">The persistent status bar survives every screen — the coordination layer that was missing.</figcaption></figure></div>
      </div>
      <div className="board-decisions"><small>Decisions that changed the product</small>{[["01","Make state persistent","The cycle stays legible at the top of every screen, so a task never loses its surrounding context."],["02","Rank work by consequence","A task is urgent when it holds another person back — not just because its date is near."],["03","Show dependencies as product data","Seeing what an action unlocks turns approval from a box to tick into a handover people can understand."]].map(([n,t,d])=><article key={n}><b>{n}</b><h3>{t}</h3><p>{d}</p></article>)}</div>
    </section>

    <section className="board-act board-light board-rejected">
      <small className="board-section-label">[02.03] &gt; TRADE-OFFS</small><h2>Not every reasonable request belonged in the first release.</h2>
      <div className="board-rejected-grid">{[["Put status inside the existing screens","Faster and cheaper, but it would keep the cycle fragmented. I chose a shared coordination layer instead."],["Use a breadcrumb for orientation","It showed where someone was, but not what their work was holding up. Dependencies mattered more."],["Build a configurable dashboard","It sounded flexible, but made the critical path optional. I protected a reliable default before adding choice."]].map(([t,d],i)=><article key={t}><b>{String(i+1).padStart(2,"0")}</b><h3>{t}</h3><p>{d}</p></article>)}</div>
    </section>

    <section className="board-act board-cyan board-validation">
      <div><small className="board-section-label">[02.04] &gt; VALIDATION</small><h2>We tested whether people could recover the state of the work — not whether they liked the new screens.</h2><p>I walked key scenarios with people working at national, regional and agency level. The useful feedback came at handovers: what they assumed was next, what they expected to be able to change, and what they needed explained.</p></div><strong>3 roles</strong>
      <div className="board-validation-bottom"><small>Leadership &amp; alignment</small><h3>I used the disagreements to define the system.</h3><p>Finance, Product and Engineering did not always ask for the same thing. I kept a visible decision log: whether each open question was policy, preference or a product rule. That gave us a way to challenge local exceptions without dismissing the people who raised them — and to standardise the critical path when it mattered.</p></div>
    </section>

    <section className="board-act board-dark board-system" id="board-03">
      <div className="board-act-top"><small className="board-section-label">[03.01] &gt; MAKE IT HOLD</small><div><h2>The result was not a new set of screens.<br />It was one operating model.</h2></div></div>
      <div className="board-metrics"><article className="rules"><strong>24</strong><span>Regions using one workflow model</span></article><article className="roles"><strong>186</strong><span>Agencies represented in the cycle</span></article><article className="patterns"><strong>3</strong><span>Roles with explicit ownership</span></article></div>
      <p className="board-system-summary">The rule library connected workflow principles, screen behaviour and acceptance criteria. Product, Finance and Engineering could discuss the same decision without translating it back from a mockup.</p>
      <div className="board-system-proof">
        <div className="board-system-proof-copy">
          <div className="board-ai-system">
            <small className="board-section-label">[03.02] &gt; WHAT STAYED</small>
            <h3>The rules outlived the individual screens.</h3>
            <p>Once decisions were expressed as roles, states, dependencies and exceptions, they could guide future design and implementation without relying on somebody remembering the context. I later carried that approach into the TAP Mindset system: stable rules make exploration easier to review and safer to ship.</p>
          </div>
          <Link className="board-ai-link" href="/projects/tap-mindset-ds">See how this principle evolved in TAP Design System ↗</Link>
        </div>
        <figure><Image src="/media/9j6WjZoUkauvEI9LNsWRRL3GYGw.png" alt="Rule system knowledge base" fill sizes="100vw" /></figure>
      </div>
    </section>

    <section className="board-evidence-limit board-light">
      <small className="board-section-label">[03.03] &gt; EVIDENCE, WITHOUT THE THEATRE</small>
      <h2>What I can prove — and what I would measure next.</h2>
      <div><article><span>Observed</span><h3>The team adopted one shared model for roles, states and dependencies.</h3><p>The redesign was used to structure the FY2026 planning cycle and its implementation decisions.</p></article><article><span>Delivered</span><h3>A reusable rule library, six interface patterns and acceptance criteria.</h3><p>The work could be reviewed as product behaviour, not only as finished screens.</p></article><article><span>Still missing</span><h3>Comparable post-launch behavioural analytics.</h3><p>I would track unresolved handoffs, time-to-approval and support requests caused by unclear ownership.</p></article></div>
    </section>

    <section className="board-act board-light board-workflow-test">
      <small className="board-section-label">[03.04] &gt; DELIVERY REALITY</small><h2>A system only earns trust when it survives the constraints around it.</h2>
      <div><article><strong>Use the real cycle as the test</strong><p>Role-based walkthroughs used the responsibilities and scenarios people already knew. Hesitation in those moments changed labels, hierarchy and the rules behind them.</p></article><article><strong>Design inside the platform we had</strong><p>Known front-end constraints shaped the release plan. Writing them down stopped the team from rediscovering the same limitations and made the trade-offs explicit.</p></article></div>
    </section>

    <section className="board-act board-lime board-close">
      <small className="board-section-label">[03.05] &gt; WHAT THIS WAS ACTUALLY ABOUT</small><b>A planning cycle people could read together.</b><hr />
      <h2>Enterprise software becomes useful when it makes the work between people visible.</h2>
    </section>

    <CaseMoreWorks previous={{ href: "/projects/fluxy", title: "Fluxy", description: "A responsible travel agent for everyday mobility" }} next={{ href: "/projects/tap-mindset-ds", title: "TAP Design System", description: "A coded system connecting design and development" }} />
  </main>
}
