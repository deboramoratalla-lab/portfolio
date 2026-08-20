import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLink, ArrowRouteLink } from "@/components/ui-links"
import { OpenPortfolioAgentLink } from "@/components/open-portfolio-agent-link"
import { getLabEntry, labEntries } from "@/data/lab"

type ArticleSection = { title: string; paragraphs: string[]; points?: string[] }
type ArticleContent = { lead: string; quote: string; sections: ArticleSection[]; metrics?: [string, string][]; close: string }

const articles: Record<string, ArticleContent> = {
  "design-systems-need-evidence": {
    lead: "I used to think the first job of a design system was to define the right components. The product taught me to start somewhere less comfortable: with the decisions teams were already repeating.",
    quote: "An inventory tells you what exists. Evidence helps you decide what deserves to become a system.",
    sections: [
      { title: "The visible problem was inconsistency", paragraphs: ["TAP Mindset had eight card variations, six chips and four inputs. Most looked related but behaved differently. Consolidating them sounded like the obvious answer.", "The deeper problem was maintenance. Knowledge lived in individual files and documenting a component took 45 to 60 minutes. Every new feature made the library harder to understand."] },
      { title: "Count usage before drawing the answer", paragraphs: ["I mapped the critical flows and inspected more than 28,000 component instances. I was not looking for the most popular rectangle. I was looking for repeated product decisions."], points: ["Load-bearing patterns used across critical journeys.", "Accidental variants representing the same concept.", "Local exceptions created for a constraint that had never been evaluated systemically."] },
      { title: "Turn the audit into a decision tool", paragraphs: ["For each cluster I recorded its job, states, usage, behavioural differences and cost of change. That changed the review from ‘which version looks cleaner?’ to ‘does the product need these concepts to behave differently?’", "The useful output was not a giant spreadsheet. It was a smaller set of decisions with enough evidence for Design and Engineering to challenge together."] },
      { title: "What I would reuse", paragraphs: ["Start with one important journey, capture concepts rather than screenshots and record uncertainty explicitly. Do not promote a pattern into the system just because it appears often: repetition can be evidence of debt too.", "The goal is not perfect consistency. It is a system where a shared decision is easier to use than another local exception."] },
    ],
    metrics: [["28,000+", "Instances audited"], ["55 → 38", "Public concepts"], ["45 → <2 min", "Documentation time"]],
    close: "Before asking what your library is missing, ask what your product is already repeating — and why.",
  },
  "storybook-source-of-truth": {
    lead: "For a while I treated Figma as the place where the design system had to be recreated and maintained. I changed my position when the coded component became the more reliable description of what had actually shipped.",
    quote: "Figma remained useful for exploration. It stopped being the place where we described production truth.",
    sections: [
      { title: "The problem was not documentation", paragraphs: ["Design and Engineering were reviewing two representations of the same component. Names, defaults and edge cases could drift even when everybody was acting in good faith.", "A handoff document could explain intent, but it could not guarantee that the state being discussed still matched the public API in code."] },
      { title: "Put the contract next to the implementation", paragraphs: ["I used Storybook to bring foundations, real React components, documentation and behavioural states into one inspectable place. TypeScript props described the public options; stories made those options visible.", "A designer could review intent and states. An engineer could inspect the API and implementation without translating a separate specification."] },
      { title: "What belongs in the source of truth", paragraphs: ["A useful story should expose the decisions a consumer needs, not every internal implementation detail."], points: ["Supported props, defaults and variants.", "Empty, loading, error and permission states.", "Keyboard behaviour and accessible naming.", "Token references and usage guidance.", "Known constraints and decisions that still need review."] },
      { title: "What Figma still does better", paragraphs: ["I still use Figma to explore composition, compare directions and communicate before implementation. Code-first does not mean code-only.", "The boundary is simple: Figma helps us decide what might exist. Storybook shows what the team can actually use."] },
    ],
    close: "The source of truth is not the tool with the most documentation. It is the place closest to the behaviour that ships.",
  },
  "figma-plugin-component-apis": {
    lead: "Once code became the source of truth, I no longer wanted designers copying its structure back into Figma by hand. So I built a bridge instead of another checklist.",
    quote: "The plugin carries structure into Figma. It does not outsource product judgement to automation.",
    sections: [
      { title: "Define the job before opening the Plugin API", paragraphs: ["The job was not ‘generate a Figma component’. It was narrower: read a maintained component catalogue and carry names, options and token references into a place designers could inspect.", "That boundary mattered. A plugin can reproduce metadata reliably; it cannot decide whether a pattern should be one component or five."] },
      { title: "Create a catalogue code can explain", paragraphs: ["I built a TypeScript catalogue builder that describes each component’s props, variants, booleans, slots, defaults, CSS token references and Storybook metadata.", "The catalogue becomes a stable interchange layer. The plugin does not need to parse an entire repository or guess intent from a screenshot."] },
      { title: "Keep the plugin architecture small", paragraphs: ["The main plugin process reads the catalogue and creates or updates Figma nodes. A separate UI lets the designer select components, review incoming properties and see warnings before anything changes."], points: ["manifest.json defines permissions and entry points.", "code.ts talks to the Figma Plugin API.", "ui.html handles selection, progress and review.", "Typed messages keep the two contexts explicit."] },
      { title: "Design for partial failure", paragraphs: ["Imports fail in ordinary ways: a font is missing, a token has no match or a property changed since the last sync. I log those mismatches instead of silently inventing a substitute.", "That makes the plugin useful as a diagnostic tool too. Drift becomes visible while it is still inexpensive to discuss."] },
    ],
    close: "Automate the copying. Keep naming, accessibility and public-API decisions reviewable by people.",
  },
  "building-an-agent": {
    lead: "An agent is not a chatbot with a few extra permissions. It is a product system that observes context, makes a judgement and decides whether to act.",
    quote: "The first screen is rarely the hard part. The hard part is deciding what the system is allowed to notice.",
    sections: [
      { title: "Start with the job, not the prompt", paragraphs: ["Before deciding what the agent should say, write down what the person is trying to achieve. ‘Answer questions’ is too vague. ‘Protect an arrival goal when the commute changes’ gives the system something it can reason about.", "A useful goal gives you a test for every later decision: does this action help the person, or is the agent just being busy?"] },
      { title: "Give it context — and uncertainty", paragraphs: ["An agent needs the small set of signals that change the job: state, timing, constraints, history and permissions. Make that context explicit before designing the interface.", "A confident answer built on missing context is worse than a short explanation of what the system does not know."] },
      { title: "Design the decision boundary", paragraphs: ["Most behaviour falls into three useful states."], points: ["Stay quiet when nothing changed enough to interrupt.", "Prepare by gathering context or drafting a reversible next step.", "Ask when a consequential action needs attention, consent or choice."] },
      { title: "Test the awkward cases first", paragraphs: ["Happy paths make agents look smarter than they are. Start with stale data, conflicting goals, missing permissions, a person changing their mind and a recommendation arriving too late.", "A small coded model often reveals another state or human hand-off before the interface needs more polish."] },
    ],
    metrics: [["01", "Goal before prompt"], ["02", "Context before confidence"], ["03", "Consent before commitment"]],
    close: "The interface is the visible part. The rules underneath are the product.",
  },
  "smallest-useful-accessibility-pipeline": {
    lead: "I did not want accessibility to become a large audit performed just before release. I wanted the smallest feedback loop that could catch a component problem while somebody was still working on it.",
    quote: "A check is useful when it changes the next decision, not when it produces the longest report.",
    sections: [
      { title: "Start where components are already reviewed", paragraphs: ["Storybook was already where Design and Engineering met around component behaviour. That made it the right place to expose accessible names, keyboard states and automated violations beside the implementation.", "The aim was not to claim full compliance. It was to shorten the distance between introducing a problem and seeing it."] },
      { title: "Build a deliberately small baseline", paragraphs: ["I started with checks the team could understand and act on."], points: ["Run automated accessibility checks for every relevant story.", "Represent focus, disabled, error and loading states explicitly.", "Review keyboard order and visible focus manually.", "Test accessible names and relationships, not only colour contrast.", "Keep failures visible in the same pull request as the component change."] },
      { title: "Know what automation cannot prove", paragraphs: ["Automated tools can find missing attributes, invalid relationships and many contrast problems. They cannot tell whether a workflow makes sense, whether focus moves somewhere useful or whether an announcement arrives at the right moment.", "I treat automation as a release gate for detectable errors and manual review as product judgement, not as competing approaches."] },
      { title: "Make failure actionable", paragraphs: ["A red score without context becomes noise. Each failure needs the affected story, the rule, the DOM location and a route to reproduce it.", "The best pipeline is not the one with every possible check. It is the one the team trusts enough to keep running."] },
    ],
    close: "Start with a small gate the team will maintain. Then expand it when real failures teach you what is missing.",
  },
}

export function generateStaticParams() { return labEntries.map(entry => ({ slug: entry.slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const entry = getLabEntry((await params).slug)
  return entry ? { title: entry.title, description: entry.summary } : {}
}

function ArticleActions({ slug }: { slug: string }) {
  if (slug === "building-an-agent") return <>
    <OpenPortfolioAgentLink />
    <ArrowLink variant="secondary" tone="green" href="https://github.com/deboramoratalla-lab/portfolio" target="_blank" rel="noreferrer">Inspect on GitHub</ArrowLink>
  </>
  if (slug === "design-systems-need-evidence") return <>
    <ArrowRouteLink variant="secondary" tone="purple" href="/projects/tap-mindset-ds">Read the full case study</ArrowRouteLink>
    <ArrowLink variant="secondary" tone="green" href="https://github.com/deboramoratalla-lab/design-system-showcase" target="_blank" rel="noreferrer">Inspect the repository</ArrowLink>
  </>
  if (slug === "figma-plugin-component-apis") return <>
    <ArrowLink variant="secondary" tone="purple" href="https://github.com/deboramoratalla-lab/design-system-showcase/tree/main/tools" target="_blank" rel="noreferrer">Inspect the Figma tools</ArrowLink>
    <ArrowLink variant="secondary" tone="green" href="https://github.com/deboramoratalla-lab/design-system-showcase/blob/main/tools/figma-code-component-importer/scripts/build-catalog.mjs" target="_blank" rel="noreferrer">Read the catalogue builder</ArrowLink>
  </>
  return <>
    <ArrowLink variant="secondary" tone="purple" href="https://deboramoratalla-lab.github.io/design-system-showcase/?path=/story/welcome-start-here--start-here" target="_blank" rel="noreferrer">Explore Storybook</ArrowLink>
    <ArrowLink variant="secondary" tone="green" href="https://github.com/deboramoratalla-lab/design-system-showcase" target="_blank" rel="noreferrer">Inspect on GitHub</ArrowLink>
  </>
}

export default async function LabArticle({ params }: { params: Promise<{ slug: string }> }) {
  const entry = getLabEntry((await params).slug)
  if (!entry) notFound()
  const content = articles[entry.slug]
  if (!content) notFound()

  return <main className="lab-article">
    <header className="lab-article-hero">
      <div className="lab-article-hero-top">
        <Link href="/lab">← Back to Lab</Link>
        <span>Debora’s Lab / Publication</span>
      </div>
      <div className="lab-article-hero-copy">
        <div className="lab-article-meta"><span>{entry.type}</span><span>{entry.date}</span><span>{entry.readingTime}</span></div>
        <h1>{entry.title}</h1>
        <p>{entry.summary}</p>
      </div>
      <div className="lab-article-hero-foot"><span>Written from practice</span><span>↓ Read the field note</span></div>
    </header>
    <article className="lab-prose">
      <header className="lab-article-opening">
        <span>[ 00 / Premise ]</span>
        <p className="lab-lead">{content.lead}</p>
      </header>
      {content.sections.map((section, index) => <section className="lab-article-section" key={section.title}>
        <header>
          <span>{`[ 0${index + 1} / 04 ]`}</span>
          <h2>{section.title}</h2>
        </header>
        <div className="lab-article-section-copy">
          {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          {section.points && <ol>{section.points.map(point => <li key={point}>{point}</li>)}</ol>}
          {index === 0 && <aside className="lab-pullquote"><span>Note to self</span>{content.quote}</aside>}
          {index === 1 && content.metrics && <section className="lab-metrics" aria-label="Key evidence">
            {content.metrics.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
          </section>}
        </div>
      </section>)}
      <footer className="lab-article-close">
        <span>[ What I’m taking forward ]</span>
        <p>{content.close}</p>
        <div className="lab-article-actions"><ArticleActions slug={entry.slug} /></div>
      </footer>
    </article>
  </main>
}
