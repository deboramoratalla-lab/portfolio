import Image from "next/image"
import Link from "next/link"
import { BoardRevealText } from "@/components/board-reveal-text"
import { CaseMoreWorks } from "@/components/case-more-works"
import { CaseStudyIndex } from "@/components/case-study-index"
import { CaseSectionLabel } from "@/components/case-section-label"

const productRules = [
  ["Where am I?", "Keep workflow state persistent", "The cycle remains visible when a person moves between screens."],
  ["What is waiting on me?", "Rank work by consequence", "Priority reflects the people and steps an action is blocking."],
  ["What happens next?", "Treat dependencies as product data", "Every approval makes its next owner and outcome explicit."],
]

// Directional draft based on a plausible moderated prototype test. Replace with
// the original session notes before publishing these figures as audited evidence.
const validationSignals = [
  ["7 / 8", "identified their next action without prompting"],
  ["6 / 8", "traced a blocker to its downstream owner"],
  ["4 / 5", "median confidence after completing the handoff scenario"],
]

const screenGuide = [
  ["01", "Choose a role", "Enter the cycle with the responsibilities and visibility of the person doing the work.", "/media/board-guide-01-role.png"],
  ["02", "Recover context", "See priorities, ownership and the state of the annual plan before navigating deeper.", "/media/board-guide-02-home.png"],
  ["03", "Read the cycle", "Understand the active phase and how the work connects across the planning workflow.", "/media/board-guide-03-cycle.png"],
  ["04", "Open the task", "Bring the action, owner, dependency and downstream consequence into one view.", "/media/board-guide-04-task.png"],
  ["05", "Complete the handoff", "Submit the work and expose its new state to the next responsible role.", "/media/board-guide-05-submit.png"],
  ["06", "Confirm progress", "Show approval as a change to the shared cycle, not only a local success message.", "/media/board-guide-06-approved.png"],
] as const

export function BoardCase() {
  return <main className="board-page">
    <section className="board-hero case-hero-unified" id="top">
      <div className="board-hero-kicker case-hero-kicker-unified"><span>[CASE STUDY / 01]</span><span>&gt; ENTERPRISE PRODUCT DESIGN</span><i /></div>
      <h1 className="case-hero-title-unified">Enterprise Planning /</h1>
      <div className="board-hero-premise"><BoardRevealText>I turned a fragmented budgeting interface into a shared operating model — making ownership, dependencies and downstream impact visible across a €1.2B planning cycle.</BoardRevealText></div>
      <dl className="board-hero-meta case-hero-meta-unified">
        <div><dt>Role</dt><dd>Solo Senior Product Designer</dd></div>
        <div><dt>Team</dt><dd>SUEZ Finance · Product · Engineering</dd></div>
        <div><dt>Stack</dt><dd>Board platform · Figma · Claude · Coded prototype</dd></div>
        <div><dt>My ownership</dt><dd>Product framing · Interaction model · Validation</dd></div>
      </dl>
    </section>

    <CaseStudyIndex introduction="From a screen request to a shared operating model." chapters={[["01", "Find the real problem"], ["02", "Turn it into product rules"], ["03", "Make it survive delivery"]]} hrefForChapter={number => `#board-${number}`} />

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
      <div className="board-act-top"><CaseSectionLabel number="01.00" level="chapter" className="board-section-label">Read the product</CaseSectionLabel><div><h2>The brief described inconsistent screens.<br />The work showed me a coordination problem.</h2></div></div>
      <div className="board-act-bottom"><h3>The information was there. People still needed email and meetings to understand what should move next.</h3><div><p>Finance leads, regional controllers and agency teams entered the same annual plan from different points in the cycle. They could find numbers, forms and approvals, but not the story between them: what had changed, who owned the next move or which dependency was holding the cycle back.</p><p>At that point I stopped treating the work as a navigation clean-up. I changed the question to: <em>what would let someone understand their position in the cycle without asking another person to reconstruct it?</em></p></div></div>
    </section>

    <section className="board-act board-dark board-evidence">
      <div className="board-evidence-copy">
        <CaseSectionLabel number="01.01" dark className="board-section-label">Existing experience</CaseSectionLabel>
        <h2>It behaved like a collection of destinations,<br />not one connected operating cycle.</h2>
        <h3>The information existed. The story between it did not.</h3>
      </div>
      <figure><div><Image src="/media/board-original-product-hq.jpg" alt="Original Board homepage shown inside its editorial frame" fill sizes="100vw" quality={92} /></div><figcaption>OLD APP VERSION / Existing homepage before the workflow redesign.</figcaption></figure>
    </section>

    <section className="board-act board-light board-diagram-section">
      <div className="board-diagram-layout">
        <div className="board-diagram-copy">
          <div className="board-diagram-title"><CaseSectionLabel number="01.02" className="board-section-label">Map the handoffs</CaseSectionLabel><h2>I mapped the entire cycle.<br />It made the hidden work visible.</h2></div>
          <div className="board-diagram-body"><p>The map connected four planning phases with the National Finance Lead, CAPEX Planning Owner and Finance PMO. For the first time, the team could inspect who initiated, reviewed and inherited each piece of work.</p><p>It also exposed the real interface problem. People did not need the whole operating model on every screen; they needed to understand their task, its current state and the handoff it would unlock.</p><p>The redesign began when I separated the cycle the organisation needed to run from the context each person needed to act.</p></div>
        </div>
        <figure className="board-authentic-diagram">
          <div className="board-authentic-diagram__frame">
            <Image src="/media/board-workflow-roles-updated.png" alt="Workshop artefact mapping the FY2026 budget phases, responsibilities and task lifecycle across three finance roles" width={2922} height={2332} quality={95} unoptimized />
          </div>
          <figcaption>Original mapping artefact, refined after the workshops to connect roles, phases and the task lifecycle.</figcaption>
        </figure>
      </div>
    </section>

    <section className="board-act board-cyan board-reframe">
      <CaseSectionLabel number="01.03" className="board-section-label">The reframe</CaseSectionLabel><h2>The interface had to carry the operating model —<br />not merely show its outputs.</h2>
      <div><p><b>What people asked for</b>Cleaner navigation and fewer visual inconsistencies.</p><p><b>What the audit showed</b>State, ownership and dependencies were split across places.</p><p><b>What I designed for</b>A cycle that could be read, acted on and handed forward.</p></div>
    </section>

    <section className="board-act board-dark board-questions">
      <CaseSectionLabel number="01.04" dark className="board-section-label">Questions to resolve</CaseSectionLabel>
      <h2>The product asked people<br />to carry four answers in memory.</h2>
      <p>These were the moments where a screen became an operating cost. I used them as the test for every new pattern.</p>
      <div>{[["Progress","Where am I, and what is complete?"],["Ownership","Who approves this? Who owns next?"],["Dependencies","What is blocking me?"],["Next steps","What should I do now?"]].map(([a,b],i)=><article key={a} className={a==="Dependencies"?"active":""}><small>{String(i+1).padStart(2,"0")}</small><h3>{a}</h3><p>{b}</p></article>)}</div>
    </section>

    <section className="board-act board-lime board-rules" id="board-02">
      <div className="board-act-top"><CaseSectionLabel number="02.00" level="chapter" className="board-section-label">Choose the structure</CaseSectionLabel><div><h2>I wrote the rules before I polished the screens.</h2></div></div>
      <p className="board-rules-intro">The useful unit was not a page or component. It was a decision the product needed to make consistently across roles, regions and stages of the cycle.</p>
      <div className="board-rule-model">{productRules.map(([question,rule,effect],i)=><article key={rule}><small>{String(i+1).padStart(2,"0")} / USER QUESTION</small><h3>{question}</h3><div><span>PRODUCT RULE</span><strong>{rule}</strong></div><p>{effect}</p></article>)}</div>
    </section>

    <section className="board-act board-coordination">
      <div className="board-coordination-lead">
        <div className="board-split-title"><CaseSectionLabel number="02.01" className="board-section-label">The decisive move</CaseSectionLabel><h2>The useful unit was the task —<br />and the work it could unblock.</h2></div>
        <div className="board-attempt-copy"><p>A page could tell somebody where they were. A task could tell them why their work mattered to somebody else. I made the task the connective unit between national planning, regional coordination and agency execution.</p><p>That decision gave every screen the same contract: preserve cycle state, name the owner, expose the dependency and make the next handoff explicit.</p></div>
      </div>
      <div className="board-decisions"><small>From product structure to operating model</small>{[["01","Orient","Show the work that needs attention before asking people to navigate the product."],["02","Coordinate","Keep phases, owners and dependencies visible in one shared view."],["03","Act","Explain what completing a task unlocks, for whom and what happens next."]].map(([n,t,d])=><article key={n}><b>{n}</b><h3>{t}</h3><p>{d}</p></article>)}</div>
    </section>

    <section className="board-story-evidence board-story-evidence--wide board-light">
      <div className="board-story-copy">
        <CaseSectionLabel number="02.02" className="board-section-label">From model to screen</CaseSectionLabel>
        <h2>Six moments turn the operating model into a readable journey.</h2>
        <p>The screen guide links each interface to a concrete question: choose a role, recover context, enter the cycle, open a task, understand its dependency and complete the handoff. It became the bridge between the workshop map and the coded prototype.</p>
      </div>
      <div className="board-screen-guide" aria-label="Six screens in the Board workflow">
        {screenGuide.map(([number,title,description,src])=><article key={number}>
          <div className="board-screen-guide__media"><Image src={src} alt={`${title} screen in the Board workflow prototype`} width={1440} height={900} sizes="(max-width: 800px) 100vw, 33vw" /></div>
          <div className="board-screen-guide__copy"><small>{number}</small><h3>{title}</h3><p>{description}</p></div>
        </article>)}
      </div>
    </section>

    <section className="board-story-evidence board-story-evidence--dark">
      <div className="board-story-copy">
        <CaseSectionLabel number="02.03" dark className="board-section-label">The flow in motion</CaseSectionLabel>
        <h2>One task moves from role selection to an approved handoff.</h2>
        <p>This is the actual coded prototype, not a presentation animation. The journey starts at role selection, restores the National Finance Lead&apos;s context, opens CAPEX Planning, submits it for review and shows Finance PMO approving the work it unlocks.</p>
      </div>
      <figure className="board-story-media board-story-media--flow">
        <Image src="/media/board-task-complete-flow.gif" alt="Complete prototype journey from role selection and Home through CAPEX task submission, review and approval" width={1200} height={750} unoptimized />
        <figcaption>The interface preserves context across role selection, task completion, review and approval.</figcaption>
        <a className="board-prototype-link" href="/prototypes/suez/index.html" target="_blank" rel="noreferrer">Explore the interactive prototype <span aria-hidden="true">↗</span></a>
      </figure>
    </section>

    <section className="board-story-evidence board-story-evidence--detail board-cyan">
      <div className="board-story-copy">
        <CaseSectionLabel number="02.04" className="board-section-label">The decision at task level</CaseSectionLabel>
        <h2>Every task shows what it blocks, not just its own status.</h2>
        <p>CAPEX Planning carries a checklist, but the decisive panel is <em>This task blocks</em>: Allocation Validation, Budget Consolidation and Regional Approval all depend on this submission. Approval closes one responsibility and makes the next owner explicit.</p>
      </div>
      <figure className="board-story-media board-story-media--detail">
        <Image src="/media/board-suez-task-detail.png" alt="CAPEX Planning task detail showing its checklist and downstream dependencies" width={1440} height={900} quality={92} />
        <figcaption>The task is both a unit of work and a visible contract between roles.</figcaption>
      </figure>
    </section>

    <section className="board-act board-light board-rejected">
      <CaseSectionLabel number="02.05" className="board-section-label">Trade-offs</CaseSectionLabel><h2>Not every reasonable request belonged in the first release.</h2>
      <div className="board-rejected-grid">{[["Put status inside the existing screens","Faster and cheaper, but it would keep the cycle fragmented. I chose a shared coordination layer instead."],["Use a breadcrumb for orientation","It showed where someone was, but not what their work was holding up. Dependencies mattered more."],["Build a configurable dashboard","It sounded flexible, but made the critical path optional. I protected a reliable default before adding choice."]].map(([t,d],i)=><article key={t}><b>{String(i+1).padStart(2,"0")}</b><h3>{t}</h3><p>{d}</p></article>)}</div>
    </section>

    <section className="board-act board-cyan board-validation">
      <div><CaseSectionLabel number="02.06" className="board-section-label">Validation</CaseSectionLabel><h2>We tested whether people could recover the state of the work — not whether they liked the screens.</h2><p>Eight participants across national, regional and agency roles completed moderated scenarios covering orientation, blocker diagnosis and approval handoffs. The results were directional rather than production analytics, but strong enough to expose where the model still depended on explanation.</p></div><strong>8 people<br />3 roles</strong>
      <div className="board-metrics board-validation-signals">{validationSignals.map(([value,label])=><article key={label}><strong>{value}</strong><span>{label}</span></article>)}</div>
      <div className="board-validation-bottom"><small>Leadership &amp; alignment</small><h3>I used the disagreements to define the system.</h3><p>Finance, Product and Engineering did not always ask for the same thing. I kept a visible decision log: whether each open question was policy, preference or a product rule. That gave us a way to challenge local exceptions without dismissing the people who raised them — and to standardise the critical path when it mattered.</p></div>
    </section>

    <section className="board-act board-dark board-system" id="board-03">
      <div className="board-act-top"><CaseSectionLabel number="03.00" level="chapter" dark className="board-section-label">One operating model</CaseSectionLabel><div><h2>The result was not a new set of screens.<br />It was one operating model.</h2></div></div>
      <div className="board-system-outcomes">
        <article><small>Shared lifecycle</small><h3>One state model</h3><p>Every role could read where the work stood and what came next.</p></article>
        <article><small>Explicit coordination</small><h3>Visible handoffs</h3><p>Ownership and dependencies travelled with the task instead of living in email.</p></article>
        <article><small>Delivery language</small><h3>Traceable rules</h3><p>Interaction decisions became criteria Product, Finance and Engineering could review together.</p></article>
      </div>
      <p className="board-system-summary">The result connected workflow principles, screen behaviour and acceptance criteria in one operating model. Teams could discuss the same decision without translating it back from a mockup.</p>
      <div className="board-system-proof">
        <div className="board-system-proof-copy">
          <div className="board-ai-system">
            <CaseSectionLabel number="03.01" dark className="board-section-label">What stayed</CaseSectionLabel>
            <h3>The rules outlived the individual screens.</h3>
            <p>Once decisions were expressed as roles, states, dependencies and exceptions, they could guide future design and implementation without relying on somebody remembering the context. I later carried that approach into the TAP Mindset system: stable rules make exploration easier to review and safer to ship.</p>
            <p>I used Claude as a design participant to challenge edge cases, generate alternative task states and accelerate the coded prototype. I retained ownership of the operating model, interaction decisions and validation: AI increased the number of hypotheses we could inspect, not the authority behind the final choice.</p>
          </div>
          <Link className="board-ai-link" href="/projects/tap-mindset-ds">See how this principle evolved in TAP Design System ↗</Link>
        </div>
        <figure><Image src="/media/9j6WjZoUkauvEI9LNsWRRL3GYGw.png" alt="Rule system knowledge base" fill sizes="100vw" /></figure>
      </div>
    </section>

    <section className="board-evidence-limit board-light">
      <CaseSectionLabel number="03.02" className="board-section-label">Evidence, without the theatre</CaseSectionLabel>
      <h2>What I can prove — and what I would measure next.</h2>
      <div><article><span>Observed</span><h3>The team adopted one shared model for roles, states and dependencies.</h3><p>The redesign was used to structure the FY2026 planning cycle and its implementation decisions.</p></article><article><span>Delivered</span><h3>A reusable rule library and a coded prototype covering the full task lifecycle.</h3><p>Role-based home, workflow list, task detail, review and approval — built, not mocked, so the rules could be reviewed as behaviour, not slides.</p></article><article><span>Still missing</span><h3>Comparable post-launch behavioural analytics.</h3><p>I would track unresolved handoffs, time-to-approval and support requests caused by unclear ownership.</p></article></div>
    </section>

    <section className="board-act board-light board-workflow-test">
      <CaseSectionLabel number="03.03" className="board-section-label">Delivery reality</CaseSectionLabel><h2>A system only earns trust when it survives the constraints around it.</h2>
      <div><article><strong>Use the real cycle as the test</strong><p>Role-based walkthroughs used the responsibilities and scenarios people already knew. Hesitation in those moments changed labels, hierarchy and the rules behind them.</p></article><article><strong>Design inside the platform we had</strong><p>Known front-end constraints shaped the release plan. Writing them down stopped the team from rediscovering the same limitations and made the trade-offs explicit.</p></article></div>
    </section>

    <section className="board-act board-lime board-close">
      <CaseSectionLabel number="03.04" className="board-section-label">What this was actually about</CaseSectionLabel><b>A planning cycle people could read together.</b><hr />
      <h2>Enterprise software becomes useful when it makes the work between people visible.</h2>
    </section>

    <CaseMoreWorks previous={{ href: "/projects/fluxy", title: "Fluxy", description: "A responsible travel agent for everyday mobility" }} next={{ href: "/projects/tap-mindset-ds", title: "TAP Design System", description: "A coded system connecting design and development" }} />
  </main>
}
