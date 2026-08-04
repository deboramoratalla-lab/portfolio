import Image from "next/image"
import Link from "next/link"
import { BoardRevealText } from "@/components/board-reveal-text"
import { CaseMoreWorks } from "@/components/case-more-works"

const rules = [
  "Visibility before navigation.",
  "Context must survive execution.",
  "Dependencies are product.",
  "Workflow state is never optional.",
  "Actionable before informational.",
  "Roles coordinate. Interfaces should too.",
]

export function BoardCase() {
  return <main className="board-page">
    <section className="board-hero" id="top">
      <div className="board-title"><div><h1>Enterprise Planning /</h1><span>Enterprise Planning /</span><span>Enterprise Planning /</span></div></div>
      <div className="board-hero-grid">
        <dl>
          <div><dt>Role:</dt><dd>Solo Senior Product Designer</dd></div>
          <div><dt>Scope:</dt><dd>Problem framing → Interaction design → Rule system.</dd></div>
          <div><dt>Timeline:</dt><dd>6 months</dd></div>
          <div><dt>Context:</dt><dd>Suez × Board</dd></div>
        </dl>
        <div className="board-hero-story">
          <BoardRevealText>How a homepage redesign became a coordination system for finance teams, and a reusable foundation for the work that followed.</BoardRevealText>
          <div className="board-budget"><small>Annual budget coordinated</small><strong>€1.2B</strong><span>24 regions · 186 agencies · one dependency chain</span></div>
        </div>
      </div>
    </section>

    <nav className="board-index">
      <span>Case study index</span>
      <div><Link href="#board-01"><small>01</small><strong>The diagnosis</strong></Link><Link href="#board-02"><small>02</small><strong>The system</strong></Link><Link href="#board-03"><small>03</small><strong>From product to system</strong></Link></div>
    </nav>

    <section className="board-act board-light board-diagnosis" id="board-01">
      <div className="board-act-top"><b>01</b><div><small>The diagnosis</small><h2>The brief described a UI problem.<br />The work exposed a coordination problem.</h2></div></div>
      <div className="board-act-bottom"><h3>Every calculation existed. Every approval existed. Every workflow existed.</h3><div><p>And yet the finance teams responsible for keeping the cycle moving still coordinated it through email. One task stalled upstream held twenty-four regional leads downstream. The only mechanism for detecting that stall was somebody asking.</p><p>The data was all there.<br />What was missing was any way to act on it.</p></div></div>
    </section>

    <section className="board-act board-dark board-evidence">
      <h2>A menu, not a coordination tool.</h2>
      <figure><div><Image src="/media/board-original-product-hq.jpg" alt="Original Board homepage shown inside its editorial frame" fill sizes="100vw" quality={92} /></div></figure>
      <div className="board-evidence-label"><small>Evidence 01 / Existing experience</small><h3>Everything was available. Nothing was prioritised.</h3></div>
    </section>

    <section className="board-act board-light board-attempt">
      <div className="board-split-title"><small>First attempt</small><h2>My first answer was the one they asked for.</h2></div>
      <figure><div><Image src="/media/board-budget-workflow.png" alt="Budget and forecast workflow map shown inside its editorial frame" fill sizes="100vw" quality={92} /></div></figure>
      <div className="board-attempt-copy"><p>The brief said make it more visual, show the workflow. So I did. I mapped the whole budget process into a single visual flow — every phase, every step, in sequence. It was clearer than what they had.</p><p>When I walked the flow through with the people responsible for the process, the same gap kept surfacing. It showed where the stops were, but not where each user was. They could trace the process end to end and still struggled to answer the questions that mattered in the moment: where am I right now, and what is waiting on me?</p><p>The problem was never that the process was hard to see. It was that a user’s own state inside it was invisible. That reframed everything.</p></div>
    </section>

    <section className="board-act board-cyan board-reframe">
      <small>The reframe</small><h2>This was not a UI problem.<br />It was a workflow architecture problem.</h2>
      <div><p><b>Brief</b>Improve consistency and navigation.</p><p><b>Insight</b>UI inconsistency was a symptom.</p><p><b>Challenge</b>Make workflow state visible.</p></div>
    </section>

    <section className="board-act board-dark board-questions">
      <h2>Four questions the<br />system never answered.</h2>
      <p>Users held the operating model in memory. Mapping made the gap concrete.</p>
      <div>{[["Progress","Where am I, and what is complete?"],["Ownership","Who approves this? Who owns next?"],["Dependencies","What is blocking me?"],["Next steps","What should I do now?"]].map(([a,b],i)=><article key={a} className={a==="Dependencies"?"active":""}><small>{String(i+1).padStart(2,"0")}</small><h3>{a}</h3><p>{b}</p></article>)}</div>
    </section>

    <section className="board-act board-lime board-rules" id="board-02">
      <div className="board-act-top"><b>02</b><div><small>The system</small><h2>Rules first. Screens second.</h2></div></div>
      <ol>{rules.map((rule,i)=><li key={rule}><span>{String(i+1).padStart(2,"0")}</span>{rule}</li>)}</ol>
    </section>

    <section className="board-act board-coordination">
      <div className="board-split-title"><small>Primary craft evidence</small><h2>The coordination layer<br />that was missing.</h2></div>
      <figure><video src="/media/hi5RUlder0uFb2zoYYPHJlwIt3E.mov" autoPlay muted loop playsInline /><figcaption className="board-caption">The persistent status bar survives every screen — the coordination layer that was missing.</figcaption></figure>
      <div className="board-decisions"><small>What shaped the new workflow experience</small>{[["01","Persistent workflow status","A coordination layer you can dismiss is one nobody sees. It stays at the top of every screen."],["02","Priorities ordered by consequence, not date","Urgency in a dependency chain is not proximity in a calendar. We ranked by downstream consequence."],["03","Dependencies as a first-class column","Showing what work unlocks turns ownership from an item to tick into a position in a chain."]].map(([n,t,d])=><article key={n}><b>{n}</b><h3>{t}</h3><p>{d}</p></article>)}</div>
    </section>

    <section className="board-act board-light board-rejected">
      <small>What I considered and didn’t build</small><h2>The senior decision is often the thing you choose not to ship.</h2>
      {[["Status inside existing screens","Faster and cheaper, but it distributed state across screens instead of showing the whole cycle."],["A breadcrumb instead of dependencies","It answered where am I, but not what am I blocking — the question that changed behaviour."],["A configurable dashboard","Requested by stakeholders, but configurability would make workflow state optional. I traded flexibility for a guarantee."]].map(([t,d],i)=><article key={t}><b>{String(i+1).padStart(2,"0")}</b><h3>{t}</h3><p>{d}</p></article>)}
    </section>

    <section className="board-act board-cyan board-validation">
      <div><small>Roles tested</small><h2>They read the state<br />off the screen —<br />without prompting.</h2><p>National Finance Leads, Regional Controllers and Finance PMO could identify stage, blockers, next steps and complete a task without losing workflow context.</p></div><strong>3 roles</strong>
      <div className="board-validation-bottom"><small>Leadership &amp; alignment</small><h3>I turned three local perspectives into one operating model.</h3><p>I facilitated working sessions with National Finance, regional controllers, agency users, Product and Engineering. A shared decision log separated policy from preference, surfaced conflicts early and made ownership explicit. When flexibility threatened a reliable workflow state, I made the call to standardise the critical path.</p></div>
    </section>

    <section className="board-act board-dark board-system" id="board-03">
      <div className="board-act-top"><b>03</b><div><small>From product to system</small><h2>The most durable<br />output wasn’t a screen.</h2></div></div>
      <div className="board-metrics"><article className="rules"><strong>24</strong><span>Design rules</span></article><article className="roles"><strong>3</strong><span>Roles modelled</span></article><article className="patterns"><strong>06</strong><span>Reusable patterns</span></article></div>
      <p className="board-system-summary">The rule library connected workflow principles, screen behaviour and acceptance criteria — giving future projects proven patterns instead of a blank page.</p>
      <div className="board-ai-system">
        <small>AI as a consumer of the system</small>
        <h3>The 24 rules became more valuable than the screens they produced.</h3>
        <p>Once decisions were expressed as roles, states, dependencies and exceptions, they could constrain AI-assisted exploration instead of relying on prompts alone. I later applied the same principle in TAP Mindset: stable rules provide the context that makes generated work reviewable, repeatable and safer to ship.</p>
      </div>
      <Link className="board-ai-link" href="/projects/tap-mindset-ds">See how this principle evolved in TAP Design System ↗</Link>
      <figure><Image src="/media/9j6WjZoUkauvEI9LNsWRRL3GYGw.png" alt="Rule system knowledge base" fill sizes="100vw" /></figure>
    </section>

    <section className="board-act board-light board-workflow-test">
      <small>Validation</small><h2>Tested in the context of the real workflow.</h2>
      <div><article><strong>Role-based walkthroughs</strong><p>Three role-based walkthroughs used real responsibilities and scenarios from the budgeting cycle. Observing where participants hesitated helped refine the labels, information hierarchy and decision rules before adoption.</p></article><article><strong>A platform ceiling.</strong><p>55+ known front-end limitations shaped what was buildable. Documenting them stopped the team rediscovering the same constraints.</p></article></div>
    </section>

    <section className="board-act board-lime board-close">
      <small>What this was actually about</small><b>Adopted by SUEZ for the FY2026 budgeting cycle</b><hr />
      <h2>People don’t coordinate work through screens.<br /><br />They coordinate through shared understanding.<br /><br />The product’s job is to make that understanding visible.</h2>
    </section>

    <CaseMoreWorks previous={{ href: "/projects/fluxy", title: "Fluxy", description: "A responsible travel agent for everyday mobility" }} next={{ href: "/projects/tap-mindset-ds", title: "TAP Design System", description: "A coded system connecting design and development" }} />
  </main>
}
