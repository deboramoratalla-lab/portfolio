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
  {
    slug: "metrics-are-not-decisions",
    type: "Experiment",
    title: "Metrics are not decisions: designing an AI infrastructure dashboard.",
    summary: "An independent experiment in making capacity, queue pressure and anomalies legible enough to act on. The demo uses synthetic data.",
    date: "August 2026",
    readingTime: "5 min read",
    topics: ["Data visualisation", "Observability", "AI infrastructure"],
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
