import Image from "next/image"
import type { Project } from "@/data/projects"
import { CasePremiseReveal } from "@/components/case-premise-reveal"
import { CaseMoreWorks } from "@/components/case-more-works"
import { CaseStudyIndex } from "@/components/case-study-index"
import { CaseSectionLabel } from "@/components/case-section-label"
import { ArrowLink, ArrowRouteLink } from "@/components/ui-links"

const chapters = [
  ["01", "Read the burden"],
  ["02", "Define the agent"],
  ["03", "Bound autonomy"],
  ["04", "Make it testable"],
] as const

const principles = [
  ["01", "Goal stays fixed", "Context changes around a stable arrival goal.", "Recalculate and prepare a better option.", "Never change what the passenger is trying to achieve."],
  ["02", "Useful before visible", "Routine information becomes consequential.", "Surface only the next useful action.", "No notification when nothing needs a decision."],
  ["03", "Consent at cost", "Money, personal data or commitment is involved.", "Stage the action and explain the reason.", "The passenger approves before anything happens."],
  ["04", "Fallback honestly", "Fluxy cannot protect the original goal.", "Explain the constraint and the safest alternative.", "No confident answer when the system is uncertain."],
] as const

const insights = [
  ["01", "Repeated decisions", "Passengers repeat the same small decisions every day."],
  ["02", "Information arrives late", "Real-time information only becomes valuable when a change is detected."],
  ["03", "Checking has a cost", "The cost of missing an important update is much higher than checking once."],
  ["04", "Trust is contextual", "People accept anticipation when it is clear why the intervention matters."],
] as const

const benchmarkProducts = ["Metro + TMB", "Citymapper", "Google Maps", "SNCF Connect", "TfL Go", "Fluxy"] as const

const benchmarkRows = [
  ["Multimodal routing", "none", "full", "full", "full", "full", "partial"],
  ["Real-time disruption alerts", "partial", "full", "full", "full", "full", "full"],
  ["Proactive rerouting", "none", "none", "none", "partial", "partial", "full"],
  ["In-app payment / recharge", "partial", "none", "none", "full", "full", "full"],
  ["Standing preferences", "none", "partial", "partial", "full", "full", "full"],
  ["Automatic fare reasoning", "none", "none", "none", "partial", "full", "full"],
  ["Approval before spending", "na", "na", "na", "partial", "partial", "full"],
  ["Passive routine learning", "none", "none", "partial", "none", "none", "full"],
] as const

const benchmarkMark = { full: "✓", partial: "◐", none: "×", na: "—" } as const

const journeyStates = [
  ["01", "Goal", "Arrive before 08:45"],
  ["02", "Observe", "Monitor balance, network and time"],
  ["03", "Detect", "A disruption threatens the goal"],
] as const

const autonomyPaths = [
  ["SILENT", "Low impact", "Adjust the journey without interrupting the passenger.", "No notification"],
  ["CONSENT", "Solvable", "Prepare the best alternative and ask before applying it.", "Passenger decides"],
  ["FALLBACK", "Not solvable", "Explain the constraint honestly and preserve control.", "No false promise"],
] as const

export function FluxyCase({ project }: { project: Project }) {
  return <main className="fluxy-story" style={{ "--fx-accent": project.accent } as React.CSSProperties}>
    <section className="fx-hero case-hero-unified" id="top">
      <div className="fx-kicker case-hero-kicker-unified"><span>[CASE STUDY / 04]</span><span>&gt; AGENTIC PRODUCT DESIGN</span><i/><ArrowRouteLink variant="primary" tone="purple" href="/projects/fluxy/agent">Explore the agent</ArrowRouteLink></div>
      <h1 className="case-hero-title-unified">Fluxy — A commuting agent that steps in when the journey changes.</h1>
      <CasePremiseReveal className="fx-premise">I turned a narrow online top-up brief into a product that protects the passenger&apos;s goal, prepares the next decision and leaves consequential choices in human hands.</CasePremiseReveal>
      <div className="fx-meta case-hero-meta-unified"><div><small>ROLE</small><p>Lead Product Designer · AI Product Designer</p></div><div><small>TEAM</small><p>Independent concept · End-to-end ownership</p></div><div><small>STACK</small><p>Figma · React prototype · Vercel</p></div><div className="fx-ownership"><small>MY OWNERSHIP</small><p>{project.ownership}</p></div></div>
    </section>

    <CaseStudyIndex introduction="From repeated passenger effort to bounded, testable autonomy." chapters={chapters} hrefForChapter={number => `#fluxy-${number}`} />

    <section className="fx-chapter" id="fluxy-01">
      <header><CaseSectionLabel as="p" number="01.00" level="chapter">Read the burden</CaseSectionLabel><h2>The top-up was one transaction inside a commute people had to manage continuously.</h2></header>
      <article className="fx-reframe"><div><span>THE BRIEF</span><p>Improve online top-ups.</p></div><i>→</i><div><span>THE QUESTION I CHOSE</span><p>Which commuting decisions could software responsibly remove?</p></div></article>
      <article className="fx-burden"><div><span>&gt; WHAT I MAPPED</span><h3>None of the decisions was difficult. Their accumulation was.</h3><p>Before leaving, passengers checked balance, weather and timing. During travel they monitored delays and transfers. When the network changed, they compared alternatives and rebuilt the rest of the journey.</p></div><ol><li><small>01</small><strong>Prepare</strong><p>Balance, weather and timing before leaving.</p></li><li><small>02</small><strong>Monitor</strong><p>Delays, transfers and remaining time.</p></li><li><small>03</small><strong>React</strong><p>Options when the network changes.</p></li><li><small>04</small><strong>Recover</strong><p>The rest of the journey after disruption.</p></li></ol></article>
      <article className="fx-benchmark"><div><span>&gt; COMPETITIVE BENCHMARK</span><h3>Transport apps informed passengers. They rarely carried the decision forward.</h3><p>I compared local operators, journey planners and mobility products across eight behaviours. I marked partial support instead of rounding it up: the opportunity only became visible when information, anticipation and consent were considered together.</p></div><div className="fx-benchmark-matrix" role="table" aria-label="Cross-product feature benchmark"><div className="fx-benchmark-head" role="row"><span role="columnheader">BEHAVIOUR</span>{benchmarkProducts.map(product=><b role="columnheader" key={product}>{product}</b>)}</div>{benchmarkRows.map(([feature,...states])=><div className="fx-benchmark-row" role="row" key={feature}><span role="rowheader">{feature}</span>{states.map((state,index)=><b role="cell" className={`is-${state}`} key={`${feature}-${benchmarkProducts[index]}`} aria-label={state}>{benchmarkMark[state]}</b>)}</div>)}<div className="fx-benchmark-key"><span><i className="is-full">✓</i> Full</span><span><i className="is-partial">◐</i> Partial</span><span><i className="is-none">×</i> Not supported</span><span><i className="is-na">—</i> N/A</span></div></div></article>
      <article className="fx-insights"><span>&gt; WHAT THE RESEARCH CHANGED</span><ol>{insights.map(([number,title,body])=><li key={number}><small>{number}</small><strong>{title}</strong><p>{body}</p></li>)}</ol></article>
      <blockquote className="fx-thesis">Goals stay stable. Routes, context and recommendations can change.</blockquote>
    </section>

    <section className="fx-chapter fx-dark" id="fluxy-02">
      <header><CaseSectionLabel as="p" number="02.00" level="chapter" dark>Define the agent</CaseSectionLabel><h2>The strategic move was a product that decides when interaction is necessary.</h2></header>
      <article className="fx-why-agent"><div><span>&gt; WHY AN AGENT?</span><h3>The problem was not access to information. It was who had to do the work.</h3></div><div><p>At that point, I changed my position. A better dashboard would still require the passenger to wake, check, decide and act every day.</p><p>So I defined Fluxy as an agent that observes, anticipates and recommends continuously — then asks for approval at the boundary where human judgement matters.</p></div></article>
      <article className="fx-agent-journey">
        <div className="fx-agent-journey-intro"><span>&gt; AGENT-ASSISTED JOURNEY</span><h3>One goal. Three levels of autonomy.</h3><p>I mapped the agent as a decision system: first understand the passenger&apos;s goal, then classify the impact of change before choosing whether to act, ask or step back.</p></div>
        <div className="fx-agent-journey-map">
          <div className="fx-agent-spine">{journeyStates.map(([number,title,body])=><div key={number}><small>{number}</small><strong>{title}</strong><p>{body}</p></div>)}</div>
          <div className="fx-agent-fork" aria-hidden="true"><i/><b>IMPACT CHECK</b><i/></div>
          <div className="fx-agent-paths">{autonomyPaths.map(([mode,title,body,outcome],index)=><div key={mode} className={`fx-agent-path fx-agent-path-${index + 1}`}><small>{mode}</small><strong>{title}</strong><p>{body}</p><b>{outcome}</b></div>)}</div>
        </div>
        <p className="fx-agent-rule">The interface appears at the decision boundary — not before.</p>
      </article>
      <article className="fx-demo"><div><span>&gt; INTERACTIVE MODEL</span><h3>See how Fluxy reasons before it intervenes.</h3><p>Start with a passenger goal, introduce a change in context and inspect the recommendation. The prototype makes the operating model tangible without pretending the agent should decide everything.</p><ArrowLink variant="secondary" tone="green" href="https://fluxy-rho.vercel.app/" target="_blank" rel="noreferrer">Open in a new tab</ArrowLink></div><iframe src="https://fluxy-rho.vercel.app/" title="Interactive Fluxy agent prototype"/></article>
    </section>

    <section className="fx-chapter" id="fluxy-03">
      <header><CaseSectionLabel as="p" number="03.00" level="chapter">Bound autonomy</CaseSectionLabel><h2>Trust needed an interaction model, not a reassuring tone of voice.</h2></header>
      <article className="fx-principles"><div className="fx-principles-intro"><span>&gt; FOUR AUTONOMY RULES</span><p>These rules defined when Fluxy could stay silent, prepare context, ask for consent or admit the goal could not be protected.</p></div><ol className="fx-rule-deck">{principles.map(([number,title,trigger,permission,boundary])=><li key={number}><div className="fx-rule-top"><small>{number}</small><strong>{title}</strong></div><div className="fx-rule-body"><p><b>When</b><span>{trigger}</span></p><p><b>Fluxy may</b><span>{permission}</span></p><p><b>Limit</b><span>{boundary}</span></p></div></li>)}</ol></article>
      <article className="fx-policy"><span>&gt; PRODUCT LEADERSHIP & AI</span><div className="fx-policy-content"><h3>I treated the agent as a policy system, not a chat surface.</h3><div className="fx-policy-notes"><div><small>THE WORK</small><p>I translated fare policy, accessibility, operations and passenger trust into explicit autonomy rules, then used AI to simulate edge cases and produce auditable decision traces.</p></div><div><small>THE BOUNDARY</small><p>AI expanded scenario coverage. It did not define the boundaries: payment, personal-data expansion and major journey changes always remained behind human approval.</p></div></div></div></article>
      <article className="fx-visual-language">
        <div className="fx-identity-intro"><span>&gt; VISUAL IDENTITY</span><h3>Calm by default. Visible when it matters.</h3><p>I translated the agent&apos;s behaviour into a semantic visual system. Paper is the only product background; amber is reserved for Fluxy speaking proactively; transit and alert colours describe system state rather than personality.</p><blockquote>Trust is built through consistency, not personality.</blockquote></div>
        <div className="fx-identity-system">
          <div className="fx-logo-lockups"><figure><Image src="/media/fluxy-logo-light.svg" alt="Fluxy logo for light surfaces" width={190} height={204}/><strong>Fluxy</strong><small>by Metropolis Underground</small></figure><figure><Image src="/media/fluxy-logo-dark.svg" alt="Fluxy logo for dark surfaces" width={190} height={204}/><strong>Fluxy</strong><small>by Metropolis Underground</small></figure></div>
          <div className="fx-identity-name"><div><small>NAME</small><strong>Fluxy</strong><p>Move with confidence.</p></div><div><small>PERSONALITY</small><p><b>Calm</b><b>Helpful</b><b>Predictive</b><b>Human</b></p></div></div>
          <div className="fx-identity-palette"><div><i/><small>PAPER</small><b>#F5F3EF</b></div><div><i/><small>INK</small><b>#12151C</b></div><div><i/><small>AGENT SIGNAL</small><b>#E8A33D</b></div><div><i/><small>TRANSIT</small><b>#1F7A6C</b></div><div><i/><small>ALERT</small><b>#B23A3A</b></div></div>
          <div className="fx-identity-voice"><small>VOICE &amp; ACCESSIBILITY</small><p>Confident, plain and transparent about every recommendation. Supporting text and error colours were deepened when the brand values failed WCAG AA — accessibility won over exact hex fidelity.</p></div>
        </div>
      </article>
      <article className="fx-brand-imagery">
        <div className="fx-brand-imagery-copy">
          <span>&gt; BRAND IMAGERY</span>
          <h3>The agent belongs in the journey, not at the centre of it.</h3>
          <p>Everyday movement, with assistance present only when context makes it useful.</p>
        </div>
        <figure><Image src="/media/fluxy-commute-agent.png" alt="Passenger receiving contextual assistance while travelling through an underground station" fill sizes="33vw"/></figure>
        <figure><Image src="/media/fluxy-commute-gates.png" alt="Passenger moving through underground gates with her phone" fill sizes="33vw"/></figure>
      </article>
    </section>

    <section className="fx-chapter" id="fluxy-04">
      <header><CaseSectionLabel as="p" number="04.00" level="chapter">Make it testable</CaseSectionLabel><h2>Three moments made the autonomy model concrete enough to inspect, challenge and test.</h2></header>
      <article className="fx-proof"><div><span>01 / DAILY BRIEF</span><h3>Build trust before disruption.</h3><p>One glance replaces checks for balance, weather, timing and route confidence.</p></div><figure><Image src="/media/Mmfb40qOiaxKtQrgIFMJi6A.png" alt="Fluxy daily commute brief" fill sizes="58vw"/></figure></article>
      <article className="fx-proof fx-proof-reverse"><div><span>02 / SMART RECHARGE</span><h3>Autonomy stops at payment.</h3><p>Fluxy monitors balance and stages the top-up. The passenger still authorises the transaction.</p></div><figure><Image src="/media/3ZRShN2uu7UG2p8p8J3RXWpJg1U.png" alt="Fluxy smart recharge consent flow" fill sizes="58vw"/></figure></article>
      <article className="fx-proof"><div><span>03 / GOAL PROTECTION</span><h3>The objective survives change.</h3><p>When disruption threatens arrival, Fluxy explains the trigger and recommends a route in terms of the passenger&apos;s priority.</p></div><figure><Image src="/media/1OrTKFTrcLckBt1fLOZU36fom5s.png" alt="Fluxy disruption and route recommendation flow" fill sizes="58vw"/></figure></article>
      <article className="fx-results"><div><span>&gt; WHAT THE PROJECT DEMONSTRATED</span><h3>The strongest product decision was deciding when the product should disappear.</h3></div><div><p><strong>One model</strong> connects the daily brief, low balance and disruption instead of treating them as separate features.</p><p><strong>Clear boundaries</strong> distinguish what Fluxy may observe, prepare, recommend and execute.</p><p><strong>A coherent language</strong> carries the same principles through product behaviour, interface and brand.</p></div></article>
      <article className="fx-validation-gap"><span>&gt; WHAT REMAINS UNPROVEN</span><div><h3>The interaction model is designed. Trust still has to be earned in use.</h3><p>This is an independent concept, so I would not present prototype coherence as product impact. The next step is to test whether passengers understand why Fluxy intervenes, notice when consent is required and recover confidently when the original goal cannot be protected.</p><ul><li>Comprehension of the intervention trigger</li><li>Consent and refusal at payment</li><li>Trust after an honest fallback</li></ul></div></article>
      <article className="fx-future"><span>&gt; LOOKING AHEAD</span><div><h3>The interaction model can extend without turning Fluxy into a feature catalogue.</h3><ul><li>Live activity surfaces for time-sensitive changes.</li><li>Calendar awareness when arrival time matters.</li><li>Wearable cues for hands-free journeys.</li><li>Continuous learning with explicit permission.</li></ul></div></article>
      <blockquote className="fx-close">Software can monitor, prepare and recommend. Consequential decisions remain human.</blockquote>
    </section>

    <CaseMoreWorks previous={{href:"/projects/tap-mindset",title:"TAP Mindset",description:"Rebuilding a fragmented product around role, intent and shared logic."}} next={{href:"/projects/saas",title:"Board",description:"Making workflow state visible across a complex enterprise system."}} />
  </main>
}
