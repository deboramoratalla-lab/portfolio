import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Fluxy — When does an app need an agent?",
  description: "A practical note on deciding when an agent is useful, and what it should be allowed to do.",
}

const anatomy = [
  ["01", "A goal", "What is the person actually trying to protect? For Fluxy, that is arriving on time — not simply finding a route."],
  ["02", "Context", "The agent watches the things that can change the plan: delays, connections, time and the passenger’s constraints."],
  ["03", "A decision", "It chooses whether to stay quiet, prepare an option or ask the person to decide. That boundary is the product."],
  ["04", "A visible action", "Every intervention explains what changed, what Fluxy recommends and what remains under human control."],
]

const rules = [
  ["01", "Protect the goal", "The system optimises for the passenger’s arrival goal, not for a route in isolation."],
  ["02", "Be useful before being visible", "Fluxy watches the context and prepares the next useful option before asking for attention."],
  ["03", "Keep the decision explicit", "It can explain and recommend. Consequential changes stay behind a clear, human confirmation."],
]

const buildNotes = [
  {
    number: "01",
    tag: "DECISION",
    title: "When does an app actually need an agent?",
    dek: "Not every hard workflow needs autonomy. I look for a goal that persists, context that keeps changing and decisions that are expensive to repeat.",
    points: ["Rules can cover predictable paths.", "Chat can explain a state.", "An agent earns its place when it can watch, prepare and hand control back."],
  },
  {
    number: "02",
    tag: "POLICY",
    title: "Rules before prompts.",
    dek: "The useful part of an agent is not the prompt. It is the boundary around the prompt: when the system acts, waits or asks.",
    points: ["Act when the goal is safe and the context is fresh.", "Wait when a recommendation is useful but reversible.", "Ask when money, identity or a major journey change is involved."],
  },
  {
    number: "03",
    tag: "API DESIGN",
    title: "Design the API around intent, not screens.",
    dek: "A prototype becomes more believable when its interface has a contract. I model the goal, constraints, permissions and proposed action before drawing the final surface.",
    points: ["Structured input: goal, constraints and user authority.", "Structured output: recommendation, reason, confidence and next action.", "A trace for every tool call, so the decision can be inspected later."],
  },
  {
    number: "04",
    tag: "CLI / OBSERVABILITY",
    title: "The CLI is part of the product.",
    dek: "If I cannot run the same scenario twice, inspect the trace and replay the failure, I do not really understand what I designed.",
    points: ["Fixtures make edge cases repeatable.", "A trace makes hidden decisions visible.", "A small command surface turns a vague demo into a testable system."],
  },
  {
    number: "05",
    tag: "FAILURE STATES",
    title: "Failure is a state, not an exception.",
    dek: "Agents operate with stale context, uncertain tools and incomplete permissions. The interface has to make uncertainty legible before it becomes a surprise.",
    points: ["Show what the system knows and what it does not.", "Keep consequential actions reversible or explicitly approved.", "Hand off to a person with the context intact, not with a blank error."],
  },
]

export default function FluxyAgentNote() {
  return <main className="fluxy-agent-note">
    <header className="fluxy-agent-note__intro">
      <p className="fluxy-agent-note__eyebrow">FLUXY / BUILDING IN PUBLIC</p>
      <h1>When does an app actually need an agent?</h1>
      <p className="fluxy-agent-note__lede">I didn’t start by designing an agent. I started by asking whether the product needed one at all. Fluxy became a way to test that question in public: what can a commuting system do usefully without making the passenger supervise every step?</p>
      <div className="fluxy-agent-note__actions">
        <Link href="/projects/fluxy">Read the case study <span aria-hidden="true">↗</span></Link>
        <a href="https://fluxy-rho.vercel.app/" target="_blank" rel="noreferrer">Open the full prototype <span aria-hidden="true">↗</span></a>
      </div>
    </header>

    <section className="fluxy-agent-note__anatomy" aria-labelledby="fluxy-anatomy-title">
      <div className="fluxy-agent-note__anatomy-intro">
        <p className="fluxy-agent-note__eyebrow">01 / THE QUESTION</p>
        <h2 id="fluxy-anatomy-title">An agent only earns its place when a normal interface starts to fall short.</h2>
        <p>Some problems need a clearer screen, a better default or one less decision. I used Fluxy to look for the point where a system can prepare useful work on its own — without quietly taking over the journey.</p>
      </div>
      <div className="fluxy-agent-note__anatomy-grid">
        {anatomy.map(([number, title, body]) => <article key={number}>
          <span>{`// ${number}`}</span>
          <h3>{title}</h3>
          <p>{body}</p>
        </article>)}
      </div>
    </section>

    <section className="fluxy-agent-note__reflection" aria-labelledby="fluxy-reflection-title">
      <p className="fluxy-agent-note__eyebrow">02 / THE FIRST VERSION</p>
      <h2 id="fluxy-reflection-title">The first version was too helpful.</h2>
      <p>I initially treated autonomy as a feature: detect a disruption, suggest a better route, move on. That looked efficient on the whiteboard. In practice, it made the system feel like it was making decisions before it had understood the passenger’s goal.</p>
      <p>So I stopped asking “what can the agent automate?” and started asking “what is the smallest useful intervention?” That change gave the prototype a much clearer shape.</p>
    </section>

    <section className="fluxy-agent-note__rules" aria-labelledby="fluxy-rules-title">
      <div className="fluxy-agent-note__rules-heading">
        <p className="fluxy-agent-note__eyebrow" id="fluxy-rules-title">03 / THE RULES</p>
        <h2>Rules before screens.</h2>
        <p>These are the decisions that keep an autonomous system useful without making it opaque or overbearing.</p>
      </div>
      {rules.map(([number, title, body], index) => <article className={`fluxy-agent-note__rule fluxy-agent-note__rule--${index % 2 ? "green" : "purple"}`} key={number}>
        <span>{`// ${number}`}</span>
        <h2>{title}</h2>
        <p>{body}</p>
      </article>)}
    </section>

    <section className="fluxy-agent-note__embed-section" aria-labelledby="fluxy-try-title">
      <div>
        <p className="fluxy-agent-note__eyebrow">04 / INTERACTIVE MODEL</p>
        <h2 id="fluxy-try-title">Now try the decision boundary.</h2>
        <p>Start with a goal, introduce a change in context and see what Fluxy prepares. The prototype is an interaction model, not a claim that the agent should decide everything.</p>
      </div>
      <div className="fluxy-agent-note__embed"><iframe src="https://fluxy-rho.vercel.app/" title="Fluxy agent prototype" /></div>
    </section>

    <section className="fluxy-agent-note__build-notes" aria-labelledby="fluxy-build-title">
      <header className="fluxy-agent-note__build-heading">
        <p className="fluxy-agent-note__eyebrow">05 / BUILD NOTES</p>
        <h2 id="fluxy-build-title">Five things I am learning while building the agent.</h2>
        <p>Short, technical notes from the parts that usually disappear behind the interface: policy, APIs, tooling and failure.</p>
      </header>
      <div className="fluxy-agent-note__posts">
        {buildNotes.map((post) => <article className="fluxy-agent-note__post" key={post.number}>
          <header className="fluxy-agent-note__post-meta"><span>{`// ${post.number}`}</span><span>{post.tag}</span></header>
          <h3>{post.title}</h3>
          <p className="fluxy-agent-note__post-dek">{post.dek}</p>
          <ul>{post.points.map((point) => <li key={point}>{point}</li>)}</ul>
        </article>)}
      </div>
    </section>
  </main>
}
