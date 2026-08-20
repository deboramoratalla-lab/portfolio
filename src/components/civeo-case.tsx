import Image from "next/image"
import Link from "next/link"
import { CaseHero } from "@/components/case-hero"
import { CaseEvidence } from "@/components/case-evidence"
import { CaseMoreWorks } from "@/components/case-more-works"
import { CaseStudyIndex } from "@/components/case-study-index"
import { CaseSectionLabel } from "@/components/case-section-label"

const hierarchy = [
  ["01", "Province", "Start with the geography the team is responsible for."],
  ["02", "Category", "Move into a service such as irrigation, mobility or air quality."],
  ["03", "Section", "Choose the operational slice that needs attention."],
  ["04", "Panel", "Read metrics, alerts and actions in one working view."],
] as const

const widgetActions = [
  ["Add / remove", "Choose the useful widgets and clear what the task does not need."],
  ["Arrange", "Drag cards into the order the current shift requires."],
  ["Resize", "Give more space to a chart, table or operational KPI."],
  ["Persist / reset", "Keep the view locally or return to the shared default."],
] as const

export function CiveoCase() {
  return <main className="civeo-page">
    <CaseHero className="civeo-hero" kickerClassName="civeo-hero-kicker" kicker={<><span>[CASE STUDY / 05]</span><span>&gt; MUNICIPAL OPERATIONS</span><i /><Link href="/civeo/index.html" target="_blank">Open prototype ↗</Link></>} title="Civeo /" premiseClassName="civeo-hero-premise" premise="I turned an Excel-led service process into one readable operating surface for internal teams working with municipal diputaciones." meta={<dl className="civeo-hero-meta case-hero-meta-unified">
        <div><dt>Role</dt><dd>POC Product Designer</dd></div>
        <div><dt>Users</dt><dd>15 internal workers as users and testers</dd></div>
        <div><dt>Stack</dt><dd>HTML · CSS · JavaScript · Leaflet · Open-Meteo</dd></div>
        <div><dt>My ownership</dt><dd>Product framing · Information architecture · Prototype</dd></div>
      </dl>} />

    <CaseStudyIndex introduction="From fragmented service views to a shared operational model." chapters={[["01", "Find the lost context"], ["02", "Turn the hierarchy into a product"], ["03", "Make live data trustworthy"], ["04", "Keep the agent grounded"]]} hrefForChapter={number => `#civeo-${number}`} />

    <section className="civeo-scale" aria-label="Project scale">
      <div className="civeo-scale-intro"><small>[ PROJECT SCOPE ]</small><p>A focused POC, tested with the people who would need to read the operation.</p></div>
      <div className="civeo-scale-grid">
        <article><small>Users and testers</small><strong>15</strong><p>Internal workers involved in operational workflows.</p></article>
        <article><small>Information model</small><strong>4 levels</strong><p>Province, category, section and operational panel.</p></article>
        <article><small>Evidence</small><strong>Working POC</strong><p>A coded product with live states, editable widgets and an embedded assistant.</p></article>
      </div>
    </section>

    <section className="civeo-section civeo-opening" id="civeo-01">
      <div className="civeo-opening-media">
        <CaseSectionLabel number="01.00" level="chapter" className="civeo-label">Read the operation</CaseSectionLabel>
        <Image src="/media/civeo-mockup.png" alt="Civeo municipal operations dashboard" width={1600} height={916} priority />
        <p>One surface keeps the active context, live signals and next actions together.</p>
      </div>
      <div className="civeo-opening-copy">
        <h2>The data existed. The operating context had to be rebuilt every time.</h2>
        <p>Teams relied on Excel and separate service views. A worker could find an individual number, but understanding its province, service and next action required memory and repeated explanation.</p>
        <p>I treated the brief as an information architecture problem. The POC had to preserve the question a person was answering while they moved from a provincial overview into operational detail.</p>
        <div className="civeo-context-table"><div><span>Starting point</span><b>Excel and disconnected views</b></div><div><span>Design question</span><b>How can context survive the route?</b></div><div><span>Constraint</span><b>Stay useful when live data fails</b></div></div>
      </div>
    </section>

    <section className="civeo-section civeo-workshop">
      <div className="civeo-section-head"><CaseSectionLabel number="01.01" dark className="civeo-label">Workshop evidence</CaseSectionLabel><h2>I listened for the moments where people lost the thread.</h2><p>The workshop and walkthrough material helped separate a navigation symptom from the deeper continuity problem.</p></div>
      <div className="civeo-workshop-grid">
        <CaseEvidence><Image src="/media/civeo-workshop-research.png" alt="Civeo workshop research and synthesis" width={1376} height={768} /><figcaption>Research synthesis: context, questions and operational signals.</figcaption></CaseEvidence>
      </div>
    </section>

    <section className="civeo-section civeo-model" id="civeo-02">
      <div className="civeo-section-head"><CaseSectionLabel number="02.00" level="chapter" className="civeo-label">Product model</CaseSectionLabel><h2>Navigation became the operating model.</h2><p>Every transition had to answer three things: where am I, what changed and what can I open next?</p></div>
      <div className="civeo-hierarchy">{hierarchy.map(([number, title, copy]) => <article key={number}><small>{number}</small><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </section>

    <section className="civeo-section civeo-widgets">
      <div className="civeo-widget-copy"><CaseSectionLabel number="02.01" className="civeo-label">Widget model</CaseSectionLabel><h2>The useful unit is the widget, not the page.</h2><p>Operators can shape the dashboard around the current task without changing the shared meaning of the system. A short catalogue protects consistency while edit mode gives the working surface enough flexibility.</p><p className="civeo-decision">Product boundary: personalise the surface, keep the meaning shared.</p></div>
      <div className="civeo-widget-grid">{widgetActions.map(([title, copy], index) => <article key={title}><small>0{index + 1}</small><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </section>

    <section className="civeo-section civeo-demo">
      <div className="civeo-section-head"><CaseSectionLabel number="02.02" dark className="civeo-label">Working prototype</CaseSectionLabel><h2>The interaction is evidence.</h2><p>The sequence shows the model at a glance. The embedded version underneath lets you change province, edit the dashboard and open the assistant yourself.</p></div>
      <figure className="civeo-gif"><Image src="/media/civeo-flow.gif" alt="Civeo dashboard workflow" width={1280} height={720} unoptimized /><figcaption>Dashboard context, widget editing and the contextual assistant in one short flow.</figcaption></figure>
      <div className="civeo-prototype-head"><span>INTERACTIVE PROTOTYPE</span><Link href="/civeo/index.html" target="_blank">Open in a new tab ↗</Link></div>
      <p className="civeo-prototype-mobile-note">The complete operating surface is available in a dedicated tab on smaller screens.</p>
      <iframe className="civeo-prototype" src="/civeo/index.html?embed=1" title="Interactive Civeo municipal operations prototype" loading="lazy" />
    </section>

    <section className="civeo-section civeo-live" id="civeo-03">
      <div className="civeo-section-head"><CaseSectionLabel number="03.00" level="chapter" className="civeo-label">Live context</CaseSectionLabel><h2>Live data is useful when its state is visible.</h2><p>The weather card reads Open-Meteo for the selected province. Loading, live, timeout and offline states are part of the interface, so an unavailable reading never masquerades as a valid one.</p></div>
      <div className="civeo-state-grid"><article><small>01</small><h3>Loading</h3><p>Reserve the card while the request is in flight.</p></article><article><small>02</small><h3>Live</h3><p>Confirm that the reading and source are current.</p></article><article><small>03</small><h3>Timeout</h3><p>Abort the request without blocking the dashboard.</p></article><article><small>04</small><h3>Offline</h3><p>Explain what is unavailable and preserve the rest.</p></article></div>
    </section>

    <section className="civeo-section civeo-agent" id="civeo-04">
      <div className="civeo-agent-copy"><CaseSectionLabel number="04.00" level="chapter" className="civeo-label">Contextual agent</CaseSectionLabel><h2>The assistant can interpret the interface. It cannot invent its data.</h2><p>The agent sits inside the panel rather than in a separate chat. It reads the selected province, KPI and notification state, then offers explicit actions tied to the visible product.</p><p>Civeo uses a local rule engine instead of a remote generative model. That made each response inspectable and established the grounding rules a future AI implementation would need.</p></div>
      <div className="civeo-agent-rules"><article><span>Reads</span><h3>Current product state</h3><p>Province, panel, indicators and notifications.</p></article><article><span>Offers</span><h3>Explicit actions</h3><p>Known suggestions that map to real interface functions.</p></article><article><span>Refuses</span><h3>Ungrounded answers</h3><p>No plausible response when the product has no evidence.</p></article></div>
    </section>

    <section className="civeo-section civeo-making">
      <div><CaseSectionLabel number="04.01" className="civeo-label">How I worked</CaseSectionLabel><h2>AI accelerated the prototype. Product judgment set its boundaries.</h2></div>
      <div><p>I worked as the POC designer and used Claude and Codex during exploration and implementation. I defined the hierarchy, interaction rules, data states and the limit of the assistant.</p><p>The 15 workers were the users and testers. I reviewed the result in the browser and against the code, including persistence, province changes, Open-Meteo states and assistant actions.</p></div>
    </section>

    <section className="civeo-section civeo-close"><CaseSectionLabel number="04.02" dark className="civeo-label">What this proved</CaseSectionLabel><b>A shared operational model people could inspect and challenge.</b><hr /><h2>The interface became useful when it stopped asking people to reconstruct the system in their heads.</h2></section>

    <CaseMoreWorks previous={{ href: "/projects/fluxy", title: "Fluxy", description: "A responsible agent for everyday mobility." }} next={{ href: "/projects/saas", title: "Board", description: "Making workflow state visible across enterprise planning." }} />
  </main>
}
