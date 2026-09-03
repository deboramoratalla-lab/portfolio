import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CaseSectionLabel } from "@/components/case-section-label"
import { ArrowLink, ArrowRouteLink } from "@/components/ui-links"
import { OpenPortfolioAgentLink } from "@/components/open-portfolio-agent-link"
import { DesignSystemHealthDemo } from "@/components/design-system-health-demo"
import { GpuJobTriageDecisionDemo, TelemetryEvidenceDemo } from "@/components/gpu-job-triage-demo"
import { OpportunityRadarDemo } from "@/components/opportunity-radar-demo"
import { AgentConvergenceDemo } from "@/components/agent-convergence-demo"
import { WorkflowImpactPreview } from "@/components/workflow-impact-preview"
import { DecisionHandoverDemo, DecisionHandoverJourney } from "@/components/decision-handover-demo"
import { AgentQualityLoopDemo } from "@/components/agent-quality-loop-demo"
import { getLabEntry, labEntries } from "@/data/lab"

type ArticleSection = { title: string; paragraphs: string[]; points?: string[] }
type ArticleContent = { lead: string; quote: string; sections: ArticleSection[]; metrics?: [string, string][]; close: string }
type ReusableResource = { title: string; description: string; href: string; label: string }

const dsRepo = "https://github.com/deboramoratalla-lab/design-system-showcase"
const portfolioRepo = "https://github.com/deboramoratalla-lab/portfolio"

const reusableResources: Record<string, ReusableResource[]> = {
  "parallel-not-blind": [
    { title: "Snapshot generator", description: "A small Node script that reads commit-level changed files with git diff-tree and writes the evidence used in the replay.", href: `${portfolioRepo}/blob/main/tools/build-convergence-snapshot.mjs`, label: "Read the generator" },
    { title: "Captured Git evidence", description: "The committed snapshot: source commits, parent hashes and the files changed by each task-shaped change set.", href: `${portfolioRepo}/blob/main/src/data/agent-convergence-snapshot.json`, label: "Inspect the snapshot" },
    { title: "Interaction prototype", description: "The client component that keeps the evidence separate from the coordination scenarios it lets someone explore.", href: `${portfolioRepo}/blob/main/src/components/agent-convergence-demo.tsx`, label: "Read the prototype" },
  ],
  "design-systems-need-evidence": [
    { title: "Layered token source", description: "Core, semantic and component decisions expressed as inspectable JSON aliases.", href: `${dsRepo}/blob/main/design-tokens/tokens.json`, label: "Open tokens.json" },
    { title: "Component anatomy", description: "A real component kept beside its styles, story and public export.", href: `${dsRepo}/tree/main/src/components/AppHeader`, label: "Inspect AppHeader" },
    { title: "Published token inventory", description: "The maintained token source exposed where the team reviews the system.", href: "https://deboramoratalla-lab.github.io/design-system-showcase/?path=/story/foundations-design-tokens--token-index", label: "Open Storybook" },
  ],
  "storybook-source-of-truth": [
    { title: "Typed public API", description: "The Tag contract, defaults and rendered attributes in the shipped React component.", href: `${dsRepo}/blob/main/src/components/Tag/Tag.tsx`, label: "Read Tag.tsx" },
    { title: "Inspectable stories", description: "The examples that turn supported states into reviewable behaviour.", href: `${dsRepo}/blob/main/src/components/Tag/Tag.stories.tsx`, label: "Read Tag stories" },
    { title: "Live documentation", description: "The component API and its rendered output in the published Storybook.", href: "https://deboramoratalla-lab.github.io/design-system-showcase/?path=/docs/components-primitives-tag--docs", label: "Open Tag docs" },
  ],
  "figma-plugin-component-apis": [
    { title: "Catalogue builder", description: "The interchange layer that extracts component structure before Figma imports it.", href: `${dsRepo}/blob/main/tools/figma-code-component-importer/scripts/build-catalog.mjs`, label: "Read the builder" },
    { title: "Plugin implementation", description: "Manifest, plugin process and UI kept together in a small inspectable tool.", href: `${dsRepo}/tree/main/tools/figma-code-component-importer`, label: "Inspect the plugin" },
    { title: "Source component", description: "The typed Checkbox contract used to create editable Figma properties.", href: `${dsRepo}/blob/main/src/components/Checkbox/Checkbox.tsx`, label: "Read Checkbox.tsx" },
  ],
  "smallest-useful-accessibility-pipeline": [
    { title: "Component-level gate", description: "Storybook is configured to fail the test run when detectable violations appear.", href: `${dsRepo}/blob/main/.storybook/preview.ts`, label: "Read the a11y config" },
    { title: "Pull-request workflow", description: "The same browser checks run automatically on pull requests and changes to main.", href: `${dsRepo}/blob/main/.github/workflows/ui-accessibility.yml`, label: "Inspect the workflow" },
    { title: "Live reproduction", description: "Open the published story and inspect the Accessibility panel beside the component.", href: "https://deboramoratalla-lab.github.io/design-system-showcase/?path=/story/components-primitives-badge--notification", label: "Reproduce the check" },
  ],
  "building-an-agent": [
    { title: "Decision model", description: "The visible product surface for observing, interpreting and choosing whether to act.", href: `${portfolioRepo}/blob/main/src/components/portfolio-agent.tsx`, label: "Inspect the agent UI" },
    { title: "Server boundary", description: "The route that keeps model access and product context outside the browser.", href: `${portfolioRepo}/blob/main/src/app/api/portfolio-agent/route.ts`, label: "Inspect the API route" },
    { title: "Try the behaviour", description: "Use the agent in the portfolio and question the decisions behind the work.", href: "/", label: "Open the agent" },
  ],
}

const articles: Record<string, ArticleContent> = {
  "agent-quality-loop": {
    lead: "A support agent can sound convincing and still make the wrong decision. This experiment makes the evaluation loop visible before anyone trusts it with a real customer.",
    quote: "A good score is not evidence until you can inspect the failure behind it.",
    sections: [
      { title: "Replay the conversation, not just the answer", paragraphs: ["Each fixture follows a realistic support request through intent detection, policy retrieval, tool use and the final response.", "The reviewer can see where the agent made its decision, what context it used and whether it crossed a permission boundary."] },
      { title: "Turn failure into a useful signal", paragraphs: ["A human reviewer marks the trajectory against a small set of criteria: policy correctness, customer safety, action accuracy and explanation quality."], points: ["Pass when the response and action agree with policy.", "Flag when the agent reaches a plausible but unsafe conclusion.", "Escalate when the evidence is incomplete or ambiguous."] },
      { title: "The loop is the product", paragraphs: ["The output is not a leaderboard. It is a decision about what to change next: a prompt, a policy, a tool contract or an evaluation case.", "The prototype is deliberately separate from the n8n release-control experiment. It explores the quality layer that should sit around any agent workflow."] },
    ],
    metrics: [["03", "Support fixtures"], ["04", "Quality criteria"], ["01", "Next decision"]],
    close: "I am carrying this forward as a product pattern for trustworthy agents: replay behaviour, inspect the reasoning boundary and keep human judgement in the loop where confidence is not enough.",
  },
  "decision-handover": {
    lead: "This exploration came from building a product framework at TAP while leading the product team’s work and tasks. The work could move between people, but the reasoning behind a decision often stayed with the person who made it.",
    quote: "A signal is a reading, not an instruction.",
    sections: [
      { title: "The work moved. The reasoning did not.", paragraphs: ["At TAP, I was creating the framework while leading the product team’s work and tasks. That made continuity a real design problem: a decision could be visible in a board or a conversation, while the reason for it remained implicit in the person who had been carrying the work.", "The risk was not that people lacked information. It was that the next person could see what had changed without knowing why a choice had been made, or what would make it worth reopening."] },
      { title: "Only the decision should travel", paragraphs: ["I wanted to test a smaller handover pattern than a full activity log. The next person needed enough context to judge an active decision, without being asked to reconstruct a day of work or read another inbox.", "The constraint was deliberate: routine work should stay quiet. Only a decision with an owner, a rationale and a clear review condition should travel forward."] },
      { title: "Show the condition, not an order", paragraphs: ["I built a coded dashboard around three fields: what was decided, why it was reasonable at that moment and what condition would make it worth reviewing. The schedule makes active decisions scannable first. Selecting one brings the receipt into view without leaving the workspace.", "The review state matters most. When a condition is crossed, the interface does not pretend to know the next action. It brings the original reasoning back to the person responsible for reassessing it. A visible routine update shows the complementary state: it has no receipt because it does not change scope, customer risk or a later decision."] },
      { title: "What building it clarified", paragraphs: ["This is an interaction hypothesis, not a TAP feature or a claim of production impact. Building it clarified a boundary: a receipt is not a record of activity. It is a compact piece of shared reasoning with an owner and a condition for review.", "Motion carries that distinction too. A new receipt enters when someone selects a decision; a changed condition makes the review state arrive without turning it into an alarm. The boundary is part of the solution."] },
    ],
    close: "I am carrying this into future experiments: start with a work problem I have seen, name the decision that is getting lost, then test the smallest interface that helps a team make it visible again.",
  },
  "workflow-impact-preview": {
    lead: "An independent product exploration built on n8n: a pre-publish replay for understanding how changes to a governed agent affect its responses, approvals and actions.",
    quote: "An agent change is safe when its behaviour is understood, not merely when its nodes still connect.",
    sections: [
      { title: "The risky moment is before publish", paragraphs: ["An n8n agent can look valid on the canvas while a small change to its instructions, memory, model credential or tool policy materially changes what it says and does.", "This prototype asks a focused question at that publishing moment: which representative conversations would end differently, and would the proposed agent gain any new external actions?"] },
      { title: "Replay behaviour, not just the graph", paragraphs: ["The published Relay workflow classifies intent and risk, retrieves approved policy, and then gives the agent a model, session-scoped memory and one constrained knowledge tool.", "Each replay compares the current and proposed outcome. Differences are named as response changes, new tool calls, bypassed approval gates or failures, so a reviewer does not need to reverse-engineer the whole graph first."] },
      { title: "Agentic execution needs deterministic guardrails", paragraphs: ["The agent can reason and propose an action, but deterministic n8n gates control what happens next. Missing policy is blocked, high-risk actions require human approval, and every demonstration write remains simulated.", "The same published workflow now exposes two isolated, allowlisted release-control paths. One returns the real n8n execution ID, support fixtures and node trace; the other persists a pending approval in an n8n Data Table. Neither path calls production data or changes an external system."] },
    ],
    close: "n8n provides the orchestration primitives, while the agent supplies contextual reasoning. This impact preview makes their boundary visible before a change is published.",
  },
  "parallel-not-blind": {
    lead: "An independent interaction experiment for agentic development environments. It examines the moment when several useful task loops become one product decision: can their output converge safely, and who is accountable for the answer?",
    quote: "Parallel execution makes work faster. It does not make dependency disappear.",
    sections: [
      { title: "The interesting moment is between tasks", paragraphs: ["Most agent interfaces make individual task progress visible: each agent has a plan, a worktree, a diff and a state. That is necessary, but it leaves a harder moment unresolved: two independent tasks can still alter the same contract.", "The prototype starts when that overlap becomes legible. It is not a generic fleet dashboard. It is a short decision surface for a developer who needs to keep useful work moving without treating a green status as proof of a safe merge."] },
      { title: "Show the boundary, not just the activity", paragraphs: ["Three tasks run in isolated worktrees. The interface maps each to the file it is changing, then elevates the shared session contract where their work begins to depend on one another.", "This creates a useful distinction between independence and compatibility. A task can be healthy in its own environment while still needing to wait, sequence or invite a human decision before it joins another task."] },
      { title: "Make a coordination choice consequential", paragraphs: ["The controls replay three plausible moves. Keep the tasks parallel and accept a conflict surface; queue the dependent test task after the migration; or open a review gate because the question is product behaviour, not execution order.", "Each choice changes the recommendation, task state, risk and cost of review. The goal is not to automate judgement. It is to give the developer an understandable set of trade-offs at the point where their judgement matters."] },
      { title: "Turn the hypothesis into reproducible evidence", paragraphs: ["The coordination replay is modelled, but its evidence is not invented. A small Node script reads three real commits from this portfolio with git diff-tree, records their parent hashes and changed files, then writes the snapshot used by the prototype.", "The script finds three files touched by all three changes: the route, the component and the stylesheet. That does not prove the changes would conflict, but it gives the interface a defensible reason to surface a boundary. The generator and captured JSON are linked below.", "This is still not an Air integration, and it does not pretend to observe live agent telemetry. The product hypothesis is narrower: if an agentic workspace already knows task scope, file context and execution isolation, it can help a developer recognise a risky convergence before review becomes expensive."] },
    ],
    close: "The ambition is not autonomous orchestration. It is an agentic workspace where speed never obscures the point at which a person needs to make the call.",
  },
  "european-tech-opportunity-radar": {
    lead: "A small community utility for browsing technical opportunities without treating job boards as a black box. It is designed for people exploring the market, not for ranking candidates.",
    quote: "A useful job board should make its sources and limits as visible as its listings.",
    sections: [
      { title: "Start with coverage, not a candidate", paragraphs: ["Most job-search tools presume a single person and an implicit profile. This experiment starts somewhere else: what would make the market easier to inspect for a wider technology community?", "The role families deliberately extend beyond product design: product, UX/UI, research, design systems, engineering, data and AI, platform, security, developer experience and technical operations are all part of the same ecosystem."] },
      { title: "Keep the source visible", paragraphs: ["Each listing keeps a direct route back to its original source. The tool does not claim to be complete, and it does not infer salary, seniority or eligibility when the feed does not provide it.", "The current version reads public remote-job feeds from Jobicy, Remotive, Remote OK, We Work Remotely and Startup Jobs; Linear’s public Ashby job board directly; and global remote searches from the Glassdoor job-search API supplied by OpenWeb Ninja. Listings are categorised from the title and supplied category; location and any hiring restriction remain visible rather than being guessed."] },
      { title: "Make the limits part of the interface", paragraphs: ["Remote does not always mean legally hireable everywhere, and a listing can disappear before a feed refreshes. The interface treats those gaps as information, not as a hidden implementation detail.", "Ashby and Glassdoor serve different purposes here: the former is a direct employer ATS feed; the latter is a commercial job-search API. Company context is optional enrichment through OpenWeb Ninja, and always shows its provider and original link alongside the reading."] },
    ],
    close: "The useful outcome is not a perfect directory. It is a more legible starting point for people navigating remote technical work across markets.",
  },
  "gpu-job-triage": {
    lead: "This is a local product prototype for a familiar infrastructure moment: an AI batch becomes less efficient and the person on call needs to decide whether to keep capacity, investigate or pause it.",
    quote: "Observability is useful when it shortens the distance between a changing signal and a responsible action.",
    sections: [
      { title: "Start with the person who has to decide", paragraphs: ["Infrastructure dashboards can expose every available reading while leaving the important question unanswered. In this experiment, the job is not treated as a wall of charts. It is a situation with a delay, a likely cause and a decision that has consequences.", "The interface begins with the job's state and the recommended next step. Supporting readings explain why that recommendation exists, rather than asking someone to assemble the story across several panels."] },
      { title: "Replay one incident, not an entire cloud", paragraphs: ["The prototype keeps the scenario deliberately small: utilisation falls, the expected completion time changes and the cost at risk becomes visible.", "The controls replay stable capacity, underutilised capacity and a blocked pipeline. They are a local incident simulation designed to test the explanation and interaction, not a claim about a live customer workload."] },
      { title: "Use real tooling behind the concept", paragraphs: ["The companion stack is Docker-ready. Prometheus is the collector: every few seconds it asks the local workload service for readings such as worker progress, pressure and estimated time remaining, then stores them as time series. Grafana is the viewer: it asks Prometheus for those readings, turns them into panels and evaluates alert rules.", "The local service produces the same worker-level signals that the product prototype translates into a decision. Grafana is intentionally not the hero. It is the inspectable technical layer behind the experiment: useful for verifying a query, following a signal or debugging an alert."] },
      { title: "A technical evolution: test the evidence path", paragraphs: ["The job scenario remains a model because this Mac is not a GPU cluster. I later added a small real telemetry path to test the part that should not be fictional: how a signal arrives, stays fresh and becomes visible in the product.", "A local Node process samples selected aggregate host readings every 15 seconds, sends them to Grafana Cloud through Prometheus remote write, and a private Vercel route queries the latest series. The Signal health panel shows that path without claiming that the Mac is the AI workload."] },
    ],
    close: "The experiment asks a product question, not a tooling question: can an operator understand what changed and choose a next step before a slow job turns into avoidable cost?",
  },
  "metrics-are-not-decisions": {
    lead: "This is an independent experiment that joins live GitHub and Storybook signals around a design-system component. I wanted to test one question: how does an observatory turn changing evidence into a decision someone can make?",
    quote: "A dashboard earns its space when it connects a changing signal to the next action.",
    sections: [
      { title: "Start with the decision", paragraphs: ["A signal is a reading, not an instruction. A failed workflow, an import count or a missing documented state only matters when a maintainer can tell what changed and where to look next.", "I built the experiment around a smaller decision: which component deserves attention now? The interface keeps status, technical adoption and documentable behaviour in the same view instead of hiding each source in a separate tool."] },
      { title: "Let one component change the whole view", paragraphs: ["The selector is the centre of the experiment. Choosing a component asks the server for its current import count, then updates the code-adoption bar and its position on the attention map.", "Storybook supplies a second live reading: the number of published stories associated with that component. The comparison does not claim that more stories automatically mean better documentation. It exposes the surface someone can inspect."] },
      { title: "Make source and uncertainty visible", paragraphs: ["GitHub supplies the repository, workflow, issue and import signals. The published Storybook index supplies stories and documentation pages. Both are cached for an hour so the public sources are treated respectfully.", "Figma is different. The current view is an exploratory mapping based on the published component catalogue, showing how inserts, files and detaches would appear when Library Analytics is available. It is deliberately described as a preview, not counted as live evidence."] },
      { title: "Use visuals to direct attention", paragraphs: ["The health ring makes the latest automated check the first reading. Bars compare code adoption and Storybook states. The signal map shows the selected component beside workflow risk and the exploratory Figma point.", "That does not automate a maintenance decision. It makes the reason for attention inspectable before someone acts, then routes the person back to the original workflow or repository."] },
    ],
    close: "The experiment is deliberately small. Its value is in testing whether several inspectable sources can make the next question clearer without hiding which parts are live and which are still exploratory.",
  },
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
  if (!entry) return {}
  const url = `https://deboramoratalla.com/lab/${entry.slug}`
  const image = entry.slug === "workflow-impact-preview"
    ? "https://deboramoratalla.com/lab/workflow-impact-preview/opengraph-image?v=2"
    : "https://deboramoratalla.com/opengraph-image"
  return {
    title: entry.title,
    description: entry.summary,
    alternates: { canonical: url },
    openGraph: {
      title: entry.title,
      description: entry.summary,
      url,
      type: "article",
      images: [{ url: image, width: 1200, height: 630, alt: entry.title }],
    },
    twitter: { card: "summary_large_image", title: entry.title, description: entry.summary, images: [image] },
  }
}

function ArticleActions({ slug }: { slug: string }) {
  if (slug === "decision-handover") return <ArrowRouteLink variant="secondary" tone="purple" href="#decision-handover">Open the prototype</ArrowRouteLink>
  if (slug === "european-tech-opportunity-radar") return <ArrowRouteLink variant="secondary" tone="purple" href="#opportunity-radar">Open the radar</ArrowRouteLink>
  if (slug === "workflow-impact-preview") return <>
    <ArrowLink variant="secondary" tone="purple" href={`${portfolioRepo}/blob/main/src/components/workflow-impact-preview.tsx`} target="_blank" rel="noreferrer">Inspect the implementation</ArrowLink>
    <ArrowLink variant="secondary" tone="green" href={`${portfolioRepo}/blob/main/docs/relay-agent-release-control.md`} target="_blank" rel="noreferrer">Read the technical evidence</ArrowLink>
    <ArrowLink variant="secondary" tone="purple" href="https://deboramoratalla.app.n8n.cloud/workflow/9eARZ37mTUXE50IV" target="_blank" rel="noreferrer">Open the n8n workflow</ArrowLink>
  </>
  if (slug === "gpu-job-triage") return <>
    <ArrowRouteLink variant="secondary" tone="purple" href="#gpu-job-triage">Open the prototype</ArrowRouteLink>
    <ArrowLink variant="secondary" tone="green" href={`${portfolioRepo}/tree/main/labs/gpu-job-triage`} target="_blank" rel="noreferrer">Inspect the Grafana stack</ArrowLink>
  </>
  if (slug === "metrics-are-not-decisions") return <>
    <ArrowRouteLink variant="secondary" tone="purple" href="#design-system-health">Open the live demo</ArrowRouteLink>
    <ArrowLink variant="secondary" tone="green" href={`${portfolioRepo}/blob/main/src/app/api/design-system-health/route.ts`} target="_blank" rel="noreferrer">Inspect the source</ArrowLink>
  </>
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

const designSystemEvidence = [
  {
    number: "01",
    eyebrow: "Code inventory",
    title: "First, I made the real maintenance surface visible.",
    body: "Each component lived with its implementation, styles, Storybook story and public export. The inventory let me compare product concepts instead of relying on a collection of screenshots.",
    src: "/media/lab-code-inventory.png",
    alt: "VS Code repository showing the component inventory and the files that make up AppHeader.",
    width: 1850,
    height: 1654,
    href: `${dsRepo}/tree/main/src/components/AppHeader`,
    linkLabel: "Inspect the component files",
  },
  {
    number: "02",
    eyebrow: "Token architecture",
    title: "Then I separated values from meaning and component decisions.",
    body: "Core, semantic and component layers use typed JSON and aliases. Style Dictionary transforms the same inspectable source instead of asking every component to store its own interpretation.",
    src: "/media/lab-token-architecture.png",
    alt: "VS Code showing tokens.json with core, semantic and component layers and token aliases.",
    width: 2376,
    height: 1560,
    href: `${dsRepo}/blob/main/design-tokens/tokens.json`,
    linkLabel: "Open tokens.json",
  },
  {
    number: "03",
    eyebrow: "Shared reference",
    title: "Finally, the decisions became visible where the team reviewed the work.",
    body: "Storybook connects the token inventory with the components that actually ship. Designers can inspect intent and states; engineers can follow the same decision into its API and source.",
    src: "/media/storybook-design-tokens-library.png",
    alt: "Storybook Design Tokens Library showing token categories, downloadable JSON files and token values.",
    width: 3024,
    height: 1634,
    href: `${dsRepo}/blob/main/src/stories/Foundations/DesignTokens.stories.tsx`,
    linkLabel: "Inspect the token story",
  },
]

function DesignSystemEvidence() {
  return <section className="lab-evidence-dossier" aria-labelledby="lab-evidence-title">
    <header>
      <span>[ Technical evidence ]</span>
      <div>
        <h2 id="lab-evidence-title">Three artefacts. One inspectable system.</h2>
        <p>The proof follows the same path as the work: inventory what exists, structure the decisions, then publish the result where Design and Engineering can question it together.</p>
      </div>
    </header>
    <div className="lab-evidence-list">
      {designSystemEvidence.map((evidence, index) => <figure className={`lab-evidence-item lab-evidence-item-${index + 1}`} key={evidence.number}>
        <div className="lab-evidence-copy">
          <span>{evidence.number} / {evidence.eyebrow}</span>
          <h3>{evidence.title}</h3>
          <p>{evidence.body}</p>
          <EvidenceLink href={evidence.href}>{evidence.linkLabel}</EvidenceLink>
        </div>
        <div className="lab-evidence-media">
          <Image src={evidence.src} alt={evidence.alt} width={evidence.width} height={evidence.height} sizes="(max-width: 800px) 100vw, 68vw" />
        </div>
      </figure>)}
    </div>
  </section>
}

function EvidenceLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <div className="lab-evidence-link"><ArrowLink variant="secondary" tone="purple" href={href} target="_blank" rel="noreferrer">{children}</ArrowLink></div>
}

function StorybookEvidence() {
  return <section className="lab-evidence-dossier lab-evidence-dossier-single" aria-labelledby="storybook-evidence-title">
    <header>
      <span>[ Technical evidence ]</span>
      <div>
        <h2 id="storybook-evidence-title">One contract, followed from code to behaviour.</h2>
        <p>The evidence is not three versions of the component. It is one decision moving through the system: TypeScript defines the API, Storybook makes it controllable and the stories expose the supported results.</p>
      </div>
    </header>
    <div className="lab-evidence-list">
      <figure className="lab-evidence-item">
        <div className="lab-evidence-copy"><span>01 / TypeScript contract</span><h3>The public options start in code.</h3><p>The union type and component interface make tone, selection, icon behaviour and label explicit. Defaults and rendered attributes are inspectable in the same implementation.</p><EvidenceLink href={`${dsRepo}/blob/main/src/components/Tag/Tag.tsx`}>Read Tag.tsx</EvidenceLink></div>
        <div className="lab-evidence-media"><Image src="/media/lab-storybook-typescript-contract.png" alt="TypeScript implementation of the Tag component showing its tone union, public props and rendered data attributes." width={1464} height={1498} sizes="(max-width: 800px) 100vw, 68vw" /></div>
      </figure>
      <figure className="lab-evidence-item">
        <div className="lab-evidence-copy"><span>02 / Interactive documentation</span><h3>The same API becomes visible and testable.</h3><p>The rendered component, property types, defaults and controls stay together. The team can change an option and inspect the result without translating a separate specification.</p><EvidenceLink href="https://deboramoratalla-lab.github.io/design-system-showcase/?path=/docs/components-primitives-tag--docs">Open the live API</EvidenceLink></div>
        <div className="lab-evidence-media"><Image src="/media/lab-storybook-component-api.png" alt="Real Storybook documentation for the Tag component showing its rendered state, typed properties, defaults and interactive controls." width={2554} height={1475} sizes="(max-width: 800px) 100vw, 68vw" /></div>
      </figure>
      <figure className="lab-evidence-item">
        <div className="lab-evidence-copy"><span>03 / Rendered states</span><h3>Supported variations are shown, not implied.</h3><p>Tones, selected treatments and the version without an icon are documented as real outputs. Consumers can see the intended boundaries before introducing another local variant.</p><EvidenceLink href={`${dsRepo}/blob/main/src/components/Tag/Tag.stories.tsx`}>Read the stories</EvidenceLink></div>
        <div className="lab-evidence-media"><Image src="/media/lab-storybook-rendered-variations.png" alt="Storybook component variations showing Tag tones, selected treatments and variants without an icon." width={1878} height={1190} sizes="(max-width: 800px) 100vw, 68vw" /></div>
      </figure>
    </div>
  </section>
}

function FigmaPluginEvidence() {
  return <section className="lab-evidence-dossier lab-evidence-dossier-single" aria-labelledby="figma-plugin-evidence-title">
    <header>
      <span>[ Technical evidence ]</span>
      <div>
        <h2 id="figma-plugin-evidence-title">From a coded catalogue to an editable component.</h2>
        <p>The plugin carries component structure into Figma without flattening it. Selection begins with the maintained catalogue; the output preserves the properties designers need to work with the component.</p>
      </div>
    </header>
    <div className="lab-evidence-list lab-plugin-evidence-list">
      <figure className="lab-evidence-item">
        <div className="lab-evidence-copy"><span>01 / Source contract</span><h3>The component already describes its usable structure.</h3><p>CheckboxSize, visual states, booleans and defaults are explicit in TypeScript. The importer has a typed contract to interpret instead of inferring variants from pixels.</p><EvidenceLink href={`${dsRepo}/blob/main/src/components/Checkbox/Checkbox.tsx`}>Read Checkbox.tsx</EvidenceLink></div>
        <div className="lab-evidence-media"><Image src="/media/lab-figma-plugin-source-contract.png" alt="TypeScript source for Checkbox showing size, visual state, checked and indeterminate properties and their defaults." width={1628} height={1610} sizes="(max-width: 800px) 100vw, 68vw" /></div>
      </figure>
      <figure className="lab-evidence-item">
        <div className="lab-evidence-copy"><span>02 / Catalogue to Figma</span><h3>The importer begins with a real coded component.</h3><p>Inside Figma, the plugin exposes the components available in the local design-system catalogue. Selection replaces rebuilding structure from a screenshot or remembering another naming convention.</p><EvidenceLink href={`${dsRepo}/blob/main/tools/figma-code-component-importer/scripts/build-catalog.mjs`}>Read the catalogue builder</EvidenceLink></div>
        <div className="lab-evidence-media"><Image src="/media/lab-figma-plugin-catalogue.png" alt="Code Component Importer running inside Figma with the catalogue dropdown open over the Checkbox component documentation." width={1848} height={1772} sizes="(max-width: 800px) 100vw, 68vw" /></div>
      </figure>
      <figure className="lab-evidence-item">
        <div className="lab-evidence-copy"><span>03 / Editable output</span><h3>The result is a component set, not a pasted picture.</h3><p>The generated Checkbox keeps 36 variants and exposes Size, Selection and State as editable Figma properties. Its source path remains visible, making the relationship with code inspectable.</p><EvidenceLink href={`${dsRepo}/tree/main/tools/figma-code-component-importer`}>Inspect the plugin source</EvidenceLink></div>
        <div className="lab-evidence-media"><Image src="/media/lab-figma-plugin-editable-output.png" alt="Generated Checkbox component set in Figma with 36 variants and editable Size, Selection and State properties." width={2212} height={996} sizes="(max-width: 800px) 100vw, 68vw" /></div>
      </figure>
    </div>
  </section>
}

function AccessibilityEvidence() {
  return <section className="lab-evidence-dossier lab-evidence-dossier-single" aria-labelledby="accessibility-evidence-title">
    <header>
      <span>[ Evidence 01 / Review loop ]</span>
      <div>
        <h2 id="accessibility-evidence-title">The check appears beside the component.</h2>
        <p>Storybook runs the automated accessibility rules beside the rendered component while the team is already reviewing it. This captured Badge story reports no detectable violations; that is a useful release baseline, not a claim of complete accessibility.</p>
      </div>
    </header>
    <figure className="lab-evidence-feature">
      <div className="lab-evidence-media"><Image src="/media/lab-accessibility-ci-gate.png" alt="Published Storybook Badge story with the Accessibility panel reporting zero violations and three automated checks passed." width={1280} height={720} sizes="(max-width: 800px) 100vw, 90vw" /></div>
      <figcaption><span>Automated component check</span><p>Published Badge story · 0 violations · 3 passes · captured from the live Storybook</p></figcaption>
    </figure>
    <div className="lab-ci-gate" aria-label="Accessibility continuous integration gate">
      <div className="lab-ci-gate-copy">
        <span>[ Evidence 02 / CI gate ]</span>
        <h3>The same check now protects every change.</h3>
        <p>The Storybook test runner opens the real stories in a browser, executes the accessibility rules and fails the pull request when it finds a detectable violation. Manual judgement still covers the parts automation cannot understand.</p>
        <EvidenceLink href={`${dsRepo}/blob/main/.github/workflows/ui-accessibility.yml`}>Inspect the workflow</EvidenceLink>
      </div>
      <ol className="lab-ci-flow">
        <li><span>01</span><strong>Story changes</strong><small>Component behaviour becomes reviewable.</small></li>
        <li><span>02</span><strong>Browser renders</strong><small>Vitest runs the real Storybook project.</small></li>
        <li><span>03</span><strong>axe checks</strong><small>Detectable violations fail the run.</small></li>
        <li><span>04</span><strong>PR is gated</strong><small>The failure stays beside the change.</small></li>
      </ol>
    </div>
  </section>
}

function ReusableResources({ slug }: { slug: string }) {
  const resources = reusableResources[slug]
  if (!resources?.length) return null

  return <section className="lab-reuse" aria-labelledby={`reuse-${slug}`}>
    <header>
      <span>[ Open materials ]</span>
      <div>
        <h2 id={`reuse-${slug}`}>What you can reuse.</h2>
        <p>Not just a conclusion: these are the working artefacts behind the argument. Open them, question them and adapt what is useful.</p>
        <div className="lab-reuse-header-link"><ArrowLink variant="secondary" tone="purple" href="https://github.com/deboramoratalla-lab/debora-labs" target="_blank" rel="noreferrer">Browse the full Debora Labs kit</ArrowLink></div>
      </div>
    </header>
    <div className="lab-reuse-grid">
      {resources.map((resource, index) => <article key={resource.title}>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <h3>{resource.title}</h3>
        <p>{resource.description}</p>
        {resource.href.startsWith("/")
          ? <ArrowRouteLink variant="secondary" tone={index % 2 ? "green" : "purple"} href={resource.href}>{resource.label}</ArrowRouteLink>
          : <ArrowLink variant="secondary" tone={index % 2 ? "green" : "purple"} href={resource.href} target="_blank" rel="noreferrer">{resource.label}</ArrowLink>}
      </article>)}
    </div>
  </section>
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
        <CaseSectionLabel number="00.00" level="chapter">Premise</CaseSectionLabel>
        <p className="lab-lead">{content.lead}</p>
      </header>
      {content.sections.map((section, index) => <section className="lab-article-section" key={section.title}>
        <header>
          <CaseSectionLabel number={`0${index + 1}.00`} level="chapter">Section {String(index + 1).padStart(2, "0")}</CaseSectionLabel>
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
      {entry.slug === "design-systems-need-evidence" && <DesignSystemEvidence />}
      {entry.slug === "storybook-source-of-truth" && <StorybookEvidence />}
      {entry.slug === "figma-plugin-component-apis" && <FigmaPluginEvidence />}
      {entry.slug === "smallest-useful-accessibility-pipeline" && <AccessibilityEvidence />}
      {entry.slug === "metrics-are-not-decisions" && <DesignSystemHealthDemo />}
      {entry.slug === "european-tech-opportunity-radar" && <OpportunityRadarDemo />}
      {entry.slug === "parallel-not-blind" && <AgentConvergenceDemo />}
      {entry.slug === "decision-handover" && <><DecisionHandoverJourney /><DecisionHandoverDemo /></>}
      {entry.slug === "workflow-impact-preview" && <WorkflowImpactPreview />}
      {entry.slug === "agent-quality-loop" && <AgentQualityLoopDemo />}
      {entry.slug === "gpu-job-triage" && <><GpuJobTriageDecisionDemo /><TelemetryEvidenceDemo /></>}
      <ReusableResources slug={entry.slug} />
      <footer className="lab-article-close">
        <span>[ What I’m taking forward ]</span>
        <p>{content.close}</p>
        <div className="lab-article-actions"><ArticleActions slug={entry.slug} /></div>
      </footer>
    </article>
  </main>
}
