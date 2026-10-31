import Image from "next/image"
import Link from "next/link"
import { BoardCaseVideo } from "@/components/board-case-video"
import { BoardScreenGallery } from "@/components/board-screen-gallery"
import { CaseHero } from "@/components/case-hero"
import { CaseEvidence } from "@/components/case-evidence"
import { CaseMoreWorks } from "@/components/case-more-works"
import { CaseSectionLabel } from "@/components/case-section-label"

const productRules = [
  ["Where am I?", "Keep workflow state persistent", "The cycle remains visible when a person moves between screens."],
  ["What is waiting on me?", "Rank work by consequence", "Priority reflects the people and steps an action is blocking."],
  ["What happens next?", "Treat dependencies as product data", "Every approval makes its next owner and outcome explicit."],
]

export function BoardCase() {
  return <main className="board-page">
    <section className="board-film-stage" aria-label="SUEZ budget workflow film">
      <BoardCaseVideo />
    </section>

    <CaseHero className="board-hero board-hero--visual" kickerClassName="board-hero-kicker" kicker={<><span>BOARD · SUEZ</span><span>&gt; ENTERPRISE PRODUCT DESIGN</span><i /></>} title="Enterprise Planning" premiseClassName="board-hero-premise" premise="A shared task model for a €1.2B budget cycle." decision="I made each task carry its owner, current state and next handoff." meta={<dl className="board-hero-meta case-hero-meta-unified">
        <div><dt>Role</dt><dd>Solo Senior Product Designer</dd></div>
        <div><dt>Team</dt><dd>SUEZ Finance · Product · Engineering</dd></div>
        <div><dt>Stack</dt><dd>Board platform · Figma · Coded prototype</dd></div>
        <div><dt>My ownership</dt><dd>Product framing · Interaction model · Validation</dd></div>
      </dl>} />

    <section className="board-scope" aria-label="Project scale">
      <div className="board-scope-intro"><small>[ PROJECT SCALE ]</small><p>One FY2026 planning cycle across a distributed finance organisation.</p></div>
      <div className="board-scope-cards">
        <article className="board-scope-lead"><small>Budget envelope</small><strong>€1.2B</strong><p>FY2026 planning cycle</p></article>
        <article><small>Regions</small><strong>24</strong><p>Working across the cycle</p></article>
        <article><small>Agencies</small><strong>186</strong><p>Contributing plans and approvals</p></article>
        <article><small>Finance roles</small><strong>3</strong><p>National, regional and agency</p></article>
      </div>
    </section>

    <section className="board-act board-light board-diagnosis" id="board-01">
      <div className="board-act-top"><CaseSectionLabel number="01.00" level="chapter" className="board-section-label">The problem</CaseSectionLabel><div><h2>People could find the numbers.<br />They could not see what should happen next.</h2></div></div>
      <div className="board-act-bottom"><h3>Work moved across teams, but its status and dependencies did not travel with it.</h3><div><p>Finance leads, regional controllers and agency teams entered the same annual plan at different stages. The product held the forms, figures and approvals, while the connections between them were hard to read: what had changed, who owned the next step and what was blocked.</p><p>The design question became: <em>how could someone understand their place in the cycle without asking another person to reconstruct it?</em></p></div></div>
    </section>

    <section className="board-act board-light board-evidence">
      <div className="board-evidence-copy">
        <CaseSectionLabel number="01.01" className="board-section-label">Before</CaseSectionLabel>
        <h2>Each destination made sense on its own.<br />The handoffs between them were hard to follow.</h2>
      </div>
      <CaseEvidence><div><Image src="/media/board-original-product-hq.jpg" alt="Original Board homepage before the workflow redesign" fill sizes="(max-width: 800px) 100vw, 44vw" quality={92} /></div><figcaption>Original Board homepage before the workflow redesign.</figcaption></CaseEvidence>
    </section>

    <section className="board-act board-light board-diagram-section">
      <div className="board-diagram-layout">
        <div className="board-diagram-copy">
          <div className="board-diagram-title"><CaseSectionLabel number="01.02" className="board-section-label">Map the work</CaseSectionLabel><h2>Mapping the cycle exposed where ownership changed hands.</h2></div>
          <div className="board-diagram-body"><p>I mapped four planning phases across the National Finance Lead, CAPEX Planning Owner and Finance PMO. The artefact shows who starts, reviews and receives each piece of work.</p><p>That view clarified the product need: keep the full cycle available as context, while giving each person a clear task, current state and next handoff.</p></div>
        </div>
        <figure className="board-authentic-diagram">
          <div className="board-authentic-diagram__frame">
            <Image src="/media/board-workflow-roles-updated.png" alt="Workshop artefact mapping the FY2026 budget phases, responsibilities and task lifecycle across three finance roles" width={2922} height={2332} quality={92} unoptimized />
          </div>
          <figcaption>Workflow map connecting roles, phases and task handoffs.</figcaption>
        </figure>
      </div>
    </section>

    <section className="board-act board-cyan board-reframe">
      <CaseSectionLabel number="01.03" className="board-section-label">The design question</CaseSectionLabel><h2>How might the interface keep the work connected as it moves between people?</h2>
      <div className="board-reframe-flow"><article><small>The request</small><p>Cleaner navigation and more consistent screens.</p></article><article><small>The underlying gap</small><p>Status, ownership and dependencies were separated.</p></article><article className="board-reframe-aim"><small>The design aim</small><p>Make the next action clear at each handoff.</p></article></div>
    </section>

    <section className="board-act board-light board-questions">
      <CaseSectionLabel number="01.04" className="board-section-label">Questions to resolve</CaseSectionLabel>
      <h2>The product asked people<br />to carry four answers in memory.</h2>
      <p>I used these four questions to judge whether a screen gave someone enough context to act.</p>
      <ol className="board-question-flow" aria-label="Four questions in the workflow">
        {[["Progress","Where am I, and what is complete?"],["Ownership","Who approves this? Who owns next?"],["Dependencies","What is blocking me?"],["Next steps","What should I do now?"]].map(([title,question],i)=><li key={title} className={i===3?"board-question-flow__outcome":""}><span className="board-question-flow__marker" aria-hidden="true">{String(i+1).padStart(2,"0")}</span><article><h3>{title}</h3><p>{question}</p></article></li>)}
      </ol>
    </section>

    <section className="board-act board-light board-rules" id="board-02">
      <div className="board-act-top"><CaseSectionLabel number="02.00" level="chapter" className="board-section-label">Set the rules</CaseSectionLabel><div><h2>I turned those questions into three product rules.</h2></div></div>
      <p className="board-rules-intro">Each rule gives the interface a consistent answer about progress, priority or what happens after a task.</p>
      <div className="board-rule-model">{productRules.map(([question,rule,effect],i)=><article key={rule}><small>{String(i+1).padStart(2,"0")} / USER QUESTION</small><h3>{question}</h3><div><span>PRODUCT RULE</span><strong>{rule}</strong></div><p>{effect}</p></article>)}</div>
    </section>

    <section className="board-act board-coordination">
      <div className="board-coordination-lead">
        <div className="board-split-title"><CaseSectionLabel number="02.01" className="board-section-label">The central decision</CaseSectionLabel><h2>The task became the point where the cycle connects.</h2></div>
        <div className="board-attempt-copy"><p>I treated a task as more than a unit of work. It links the person acting now to the person or phase that follows.</p><p>That let the screens share a clear pattern: show the current state, name the owner and explain what this step enables next.</p></div>
      </div>
      <div className="board-decisions"><small>How the task pattern works</small>{[["01","Orient","Show the work that needs attention."],["02","Coordinate","Keep the owner and dependency in view."],["03","Hand off","Make the next step explicit."]].map(([n,t,d])=><article key={n}><b>{n}</b><h3>{t}</h3><p>{d}</p></article>)}</div>
    </section>

    <section className="board-story-evidence board-story-evidence--wide board-light">
      <div className="board-story-copy">
        <CaseSectionLabel number="02.02" className="board-section-label">From model to screen</CaseSectionLabel>
        <h2>The screens follow one person from context to handoff.</h2>
        <p>The guide moves from role selection to Home, then into the cycle, task detail and completion. Each screen answers a question from the workflow map.</p>
      </div>
      <BoardScreenGallery />
    </section>

    <section className="board-story-evidence board-story-evidence--cinema board-light">
      <div className="board-story-copy">
        <CaseSectionLabel number="02.03" className="board-section-label">The flow in motion</CaseSectionLabel>
        <h2>One task moves from role selection to an approved handoff.</h2>
        <p>The coded prototype follows one CAPEX submission from role selection through Home and task detail to Finance PMO review.</p>
      </div>
      <figure className="board-story-media board-story-media--flow">
        <Image src="/media/board-task-complete-flow.gif" alt="Complete prototype journey from role selection and Home through CAPEX task submission, review and approval" width={1200} height={750} unoptimized />
        <figcaption>One CAPEX submission, from role selection to review.</figcaption>
        <a className="board-prototype-link" href="/prototypes/suez/index.html" target="_blank" rel="noreferrer">Explore the interactive prototype <span aria-hidden="true">↗</span></a>
      </figure>
    </section>

    <section className="board-story-evidence board-story-evidence--detail board-light">
      <div className="board-story-copy">
        <CaseSectionLabel number="02.04" className="board-section-label">The decision at task level</CaseSectionLabel>
        <h2>A task&apos;s status gains meaning through what it blocks.</h2>
        <p>The <em>This task blocks</em> panel connects CAPEX Planning to Allocation Validation, Budget Consolidation and Regional Approval. It shows why this submission matters beyond its own status.</p>
      </div>
      <figure className="board-story-media board-story-media--detail">
        <a className="board-dependency-focus" href="/media/board-suez-task-detail.png" target="_blank" rel="noreferrer" aria-label="Open the complete CAPEX task screen (new tab)">
          <Image src="/media/board-suez-task-detail.png" alt="Detail of This task blocks and Required next step: the dependent tasks, their owners and the submission that unlocks them" width={4536} height={2946} sizes="(max-width: 800px) 300vw, 180vw" />
        </a>
        <figcaption>Task detail showing dependent work and its next owners. <a href="/media/board-suez-task-detail.png" target="_blank" rel="noreferrer">View the complete screen ↗</a></figcaption>
      </figure>
    </section>

    <section id="board-validation" className="board-act board-validation board-validation--confirmed">
      <div className="board-validation-intro">
        <CaseSectionLabel number="02.05" className="board-section-label">Participant tests</CaseSectionLabel>
        <h2>Could people see what to do next, and why it mattered?</h2>
        <p>Eight participants across three finance roles completed moderated prototype scenarios covering orientation, blockers and approval handoffs.</p>
      </div>
      <div className="board-validation-signals">
        <article><strong>7/8</strong><span>identified their next action without prompting</span></article>
        <article><strong>6/8</strong><span>traced a blocker to its downstream owner</span></article>
        <article><strong>4/5</strong><span>median confidence in the next handoff, on a five-point scale</span></article>
      </div>
      <p className="board-validation-note">Moderated prototype tests · directional evidence, not post-launch product analytics.</p>
    </section>

    <section className="board-act board-light board-system" id="board-03">
      <div className="board-act-top"><CaseSectionLabel number="03.00" level="chapter" className="board-section-label">The designed outcome</CaseSectionLabel><div><h2>One task model connects the cycle from entry to approval.</h2></div></div>
      <div className="board-system-outcomes">
        <article><small><b>01</b> State</small><h3>One shared lifecycle</h3><p>The task keeps its status visible as it moves between roles.</p></article>
        <article><small><b>02</b> Ownership</small><h3>Named handoffs</h3><p>Each step shows who acts next and what the task depends on.</p></article>
        <article><small><b>03</b> Delivery</small><h3>Rules teams can review</h3><p>Interaction decisions connect the workflow map to the coded prototype.</p></article>
      </div>
      <p className="board-system-summary">The implemented flow brings those rules into the screens, so each handoff carries context into the next role.</p>
      <div className="board-system-proof">
        <div className="board-system-proof-copy">
          <div className="board-ai-system">
            <CaseSectionLabel number="03.01" className="board-section-label">What stayed</CaseSectionLabel>
            <h3>The workflow rules connect to a wider design system.</h3>
            <p>The project links roles, states and dependencies to a reusable knowledge base. The related TAP Mindset work shows the design-system layer behind those rules.</p>
          </div>
          <Link className="board-ai-link" href="/projects/tap-mindset-ds">See how this principle evolved in TAP Design System ↗</Link>
        </div>
        <figure><Image src="/media/9j6WjZoUkauvEI9LNsWRRL3GYGw.png" alt="Rule system knowledge base" fill sizes="100vw" /></figure>
      </div>
    </section>

    <section className="board-evidence-limit board-light">
      <CaseSectionLabel number="03.02" className="board-section-label">Evidence, without the theatre</CaseSectionLabel>
      <h2>What shipped, and what still needs measurement.</h2>
      <div><article className="evidence-designed"><span><b>01</b> Designed</span><h3>A shared task model for roles, status and dependencies.</h3><p>The screens carry context from a role-based Home through task review.</p></article><article className="evidence-shipped"><span><b>02</b> Implemented</span><h3>The task flow moved into the SUEZ product.</h3><p>The work shown here covers role-based Home, workflow list, task detail, review and approval.</p></article><article className="evidence-measure"><span><b>03</b> To measure</span><h3>Impact after implementation.</h3><p>This case study does not include comparable live data for task completion, approval time or unresolved handoffs.</p></article></div>
    </section>

    <section className="board-act board-light board-close">
      <CaseSectionLabel number="03.04" className="board-section-label">What this was actually about</CaseSectionLabel><b>A planning cycle people could read together.</b><hr />
      <h2>Enterprise software becomes useful when it makes the work between people visible.</h2>
    </section>

    <CaseMoreWorks previous={{ href: "/projects/fluxy", title: "Fluxy", description: "A responsible travel agent for everyday mobility" }} next={{ href: "/projects/tap-mindset-ds", title: "TAP Design System", description: "A coded system connecting design and development" }} />
  </main>
}
