export type LabEntry = {
  slug: string
  type: "Field note" | "Build" | "Experiment"
  title: string
  summary: string
  date: string
  readingTime: string
  topics: string[]
}

export const labEntries: LabEntry[] = [
  { slug: "decision-handover", type: "Experiment", title: "What changed is not why.", summary: "A decision-handover dashboard, grounded in a product-team problem I encountered while building a framework at TAP.", date: "August 2026", readingTime: "4 min read", topics: ["Product design", "Operational UX", "Interaction design"] },
  { slug: "workflow-impact-preview", type: "Experiment", title: "Before you publish a workflow, see what it would change.", summary: "An independent interaction experiment for reviewing an automation change against prior workflow executions.", date: "August 2026", readingTime: "4 min read", topics: ["Automation", "AI workflows", "Developer tools"] },
  {
    slug: "parallel-not-blind",
    type: "Experiment",
    title: "Parallel isn’t always safe.",
    summary: "A decision surface for the moment parallel AI tasks stop being isolated work and need to converge into one change a developer can trust.",
    date: "August 2026",
    readingTime: "4 min read",
    topics: ["Agentic UX", "Developer tools", "Interaction design"],
  },
  {
    slug: "european-tech-opportunity-radar",
    type: "Build",
    title: "A clearer way to browse remote technology roles.",
    summary: "A public, source-aware view of remote opportunities across product, UX/UI, research, design systems, engineering, data, platform and developer experience.",
    date: "August 2026",
    readingTime: "3 min read",
    topics: ["Public utility", "Developer tools", "Data products"],
  },
  {
    slug: "gpu-job-triage",
    type: "Experiment",
    title: "When should a costly AI batch keep running?",
    summary: "A capacity decision model, with a separate real telemetry path that makes signal source and freshness inspectable.",
    date: "August 2026",
    readingTime: "4 min read",
    topics: ["AI infrastructure", "Observability", "Product design"],
  },
  {
    slug: "metrics-are-not-decisions",
    type: "Experiment",
    title: "Metrics are not decisions: reading design-system health from real signals.",
    summary: "An independent experiment in making repository activity, checks and maintenance signals legible enough to act on. The demo reads public GitHub data.",
    date: "August 2026",
    readingTime: "5 min read",
    topics: ["Data visualisation", "Observability", "Design systems"],
  },
  {
    slug: "design-systems-need-evidence",
    type: "Field note",
    title: "Your design system doesn’t need more components. It needs better evidence.",
    summary: "A practical way to find repeated decisions, separate useful variation from drift and decide what a design system should actually own.",
    date: "August 2026",
    readingTime: "6 min read",
    topics: ["Design systems", "Auditing", "Governance"],
  },
  {
    slug: "storybook-source-of-truth",
    type: "Build",
    title: "How I made Storybook the source of truth — not Figma.",
    summary: "A code-first workflow where component APIs, states, accessibility and documentation live next to what actually ships.",
    date: "August 2026",
    readingTime: "7 min read",
    topics: ["Storybook", "Component APIs", "Design systems"],
  },
  {
    slug: "figma-plugin-component-apis",
    type: "Build",
    title: "How to build a Figma plugin that imports component APIs from code.",
    summary: "A practical bridge that reads TypeScript props, variants, defaults and token references instead of rebuilding coded components by hand.",
    date: "August 2026",
    readingTime: "9 min read",
    topics: ["Figma plugins", "TypeScript", "Design engineering"],
  },
  {
    slug: "building-an-agent",
    type: "Build",
    title: "How to build an agent without starting with a chat box",
    summary: "A practical guide to the rules, boundaries and feedback loops that make an agent useful in a real product.",
    date: "August 2026",
    readingTime: "8 min read",
    topics: ["Agentic UX", "Product systems", "Prototyping"],
  },
  {
    slug: "smallest-useful-accessibility-pipeline",
    type: "Experiment",
    title: "The smallest useful accessibility pipeline I could build.",
    summary: "A practical baseline for catching component accessibility problems in Storybook before they become product debt.",
    date: "August 2026",
    readingTime: "7 min read",
    topics: ["Accessibility", "Storybook", "Testing"],
  },
]

export function getLabEntry(slug: string) {
  return labEntries.find(entry => entry.slug === slug)
}
