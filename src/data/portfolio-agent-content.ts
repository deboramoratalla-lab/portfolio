export type Evidence = { label: string; href: string }
export type AgentAnswer = {
  title: string
  points?: string[]
  body?: string
  evidence: Evidence[]
  limitation?: string
  followUps?: string[]
  probe?: string
  source?: "rules" | "ai"
}

/** Curated answers. Third person: the guide talks about Debora, never as her. Conclusion first, proof second. */
export const answers = {
  seamline: { title: "Yes. Seamline is an AI agent she designed and built on her own.", points: ["It keeps Figma, code, Storybook and docs in sync for GitHub's Primer.", "It acts alone only above 85% confidence. Everything else goes to a person, and the pull request stays red until they decide.", "Three rejections of the same kind of change pause its autonomy for that kind."], evidence: [{ label: "How autonomy is decided", href: "/projects/seamline#seamline-02" }, { label: "Open the live console", href: "https://seamline-five.vercel.app/" }], limitation: "Hackathon project on a public design system. Not used by a real team yet.", followUps: ["What broke when she tested it?", "Where does she draw the line on autonomy?"] },
  seamlineTests: { title: "She tested it to break it, and the failures shaped the design.", points: ["The small model invented a commit, so judgment moved to the larger one.", "The model gave different answers each time. Three reads and a second model took false alarms to zero.", "6/6 breaks found on a screen she hadn't tuned for. 343/343 random breaks caught."], evidence: [{ label: "Where it broke", href: "/projects/seamline#seamline-04" }, { label: "Code and test log", href: "https://github.com/deboramoratalla-lab/ds-lab" }], followUps: ["What does the agent decide alone?", "How does she use AI in her own process?"] },
  agentic: { title: "Software prepares. People decide anything with real consequences.", points: ["In Seamline, the agent never creates a new option alone and never picks a side when two people disagree.", "In Fluxy, the commuting agent stages a payment but the passenger always approves it.", "Both products show why they act, and both can step back."], evidence: [{ label: "Seamline · five kinds of change", href: "/projects/seamline#seamline-02" }, { label: "Fluxy · autonomy rules", href: "/projects/fluxy#fluxy-03" }], followUps: ["Has she designed an AI agent end to end?", "How does she use AI in her own process?"] },
  ai: { title: "AI does the repetitive work. She keeps the decisions.", points: ["At TAP, automation prepared audits and documentation. Documentation time went from 45 minutes to under 2.", "A person still approved anything touching foundations, the public API or accessibility.", "She also builds with AI: Seamline runs on three models, each chosen for a different job."], evidence: [{ label: "TAP Design System · AI in the workflow", href: "/projects/tap-mindset-ds" }, { label: "Seamline", href: "/projects/seamline" }], followUps: ["Has she designed an AI agent end to end?", "How did a design system reach code?"] },
  enterprise: { title: "Yes. Her Board work was adopted by SUEZ for its FY2026 budget cycle.", points: ["A request for a nicer homepage turned into a coordination model for a €1.2B budget.", "3 roles, 24 regions and 186 agencies working on one dependency chain.", "24 reusable design rules the team kept using after the project."], evidence: [{ label: "Board · the real problem", href: "/projects/saas#board-01" }, { label: "Board · the rule system", href: "/projects/saas#board-02" }], followUps: ["What did she decide not to ship?", "How does she work with engineering?"] },
  judgment: { title: "Her judgment shows in what she leaves out.", points: ["At Board, her first answer was the one the brief asked for. She dropped it when it didn't tell users where they stood.", "She documents platform limits as constraints, not as outcomes.", "In Seamline, she rebuilt the agent on day three because 'it fixes everything' was the wrong product."], evidence: [{ label: "Board · first attempt", href: "/projects/saas#board-01" }, { label: "Seamline · day one", href: "/projects/seamline#seamline-02" }], followUps: ["What's the strongest proof of seniority?", "Has her work been adopted by a real team?"] },
  seniority: { title: "She moves before the brief is clear, and leaves a system behind.", points: ["Board: reframed a UI request into a coordination problem, alone, with finance, product and engineering.", "TAP: led a 12-month redesign and the design system under it.", "She runs UX workshops at Board and speaks on designing with AI."], evidence: [{ label: "Board", href: "/projects/saas" }, { label: "TAP Mindset · 12-month redesign", href: "/projects/tap-mindset" }, { label: "Experience", href: "/experience" }], limitation: "Her teams have been small: 2 designers and 2 engineers at TAP. No large team management on record.", followUps: ["How does she work with engineering?", "Has her work been adopted by a real team?"] },
  collaboration: { title: "Close to engineering, from the first model to the shipped detail.", points: ["She prototypes in code when that's the fastest way to test behaviour.", "At TAP she set up a weekly design and engineering review with clear owners per layer.", "In Seamline, the engineer's world (PRs, CI checks) is where decisions land."], evidence: [{ label: "TAP Design System", href: "/projects/tap-mindset-ds" }, { label: "Civeo · built in code", href: "/projects/civeo" }], followUps: ["How did a design system reach code?", "What's the strongest proof of seniority?"] },
  systems: { title: "TAP's design system lives in code, not just in Figma.", points: ["She audited 28,000+ component instances before changing anything.", "55 public concepts became 38.", "Storybook is the source of truth. Figma follows it."], evidence: [{ label: "TAP Design System", href: "/projects/tap-mindset-ds" }, { label: "Live Storybook", href: "https://deboramoratalla-lab.github.io/design-system-showcase/?path=/story/welcome-start-here--start-here" }], followUps: ["What changed in numbers?", "How does she keep design and code in sync?"] },
  impact: { title: "Fewer concepts, faster teams, a cycle that shipped.", points: ["Board: adopted by SUEZ for the FY2026 budgeting cycle.", "TAP Design System: 55 → 38 concepts, documentation from 45 min to under 2.", "TAP Mindset: 38% fewer decisions before a first session."], evidence: [{ label: "Board", href: "/projects/saas" }, { label: "TAP Design System", href: "/projects/tap-mindset-ds" }, { label: "TAP Mindset", href: "/projects/tap-mindset" }], followUps: ["What's the strongest proof of seniority?", "Has she designed an AI agent end to end?"] },
  product: { title: "TAP Mindset is her product architecture work.", points: ["One feature-led app became three role-based experiences: coach, mental coach and athlete.", "People reach value before being asked to personalise.", "38% fewer decisions before a first session."], evidence: [{ label: "TAP Mindset", href: "/projects/tap-mindset" }], followUps: ["What's the strongest proof of seniority?", "How did a design system reach code?"] },
  civeo: { title: "Civeo replaced an Excel process with one working tool.", points: ["Built directly in code, used by 15 internal workers.", "Four-level navigation, editable widgets, live and offline states.", "A contextual assistant grounded in the data on screen."], evidence: [{ label: "Civeo", href: "/projects/civeo" }, { label: "Open the prototype", href: "/civeo/index.html" }], followUps: ["How does she work with engineering?", "Has she designed an AI agent end to end?"] },
  prototypes: { title: "She prototypes behaviour in code when Figma would slow the test down.", points: ["Civeo was built and used in code from the start.", "Seamline's console runs on real data and a real pull request.", "Fluxy's agent can be tried live."], evidence: [{ label: "Civeo", href: "/projects/civeo" }, { label: "Fluxy · try the agent", href: "/projects/fluxy/agent" }], followUps: ["How does she work with engineering?", "Has she designed an AI agent end to end?"] },
  career: { title: "10+ years on complex products, now Senior Product Designer at Board.", points: ["Board International (current), freelance lead product work, Leroy Merlin, Netflix, BICG.", "Came to product from interior design, film art direction and HR.", "Spanish native, English C1, German B2."], evidence: [{ label: "Experience", href: "/experience" }], followUps: ["What's the strongest proof of seniority?", "Has she designed an AI agent end to end?"] },
  languages: { title: "Spanish native, English C1, German B2.", evidence: [{ label: "Experience", href: "/experience" }], followUps: ["What's the strongest proof of seniority?"] },
  tour: { title: "Four cases in ninety seconds.", points: ["Seamline: an AI agent that knows when to stop.", "Board: a €1.2B budget process made readable, adopted by SUEZ.", "TAP Design System: AI in the workflow, measured.", "Fluxy: autonomy rules for a commuting agent."], evidence: [{ label: "Seamline", href: "/projects/seamline" }, { label: "Board", href: "/projects/saas" }, { label: "TAP Design System", href: "/projects/tap-mindset-ds" }, { label: "Fluxy", href: "/projects/fluxy" }], followUps: ["Has she designed an AI agent end to end?", "Has her work been adopted by a real team?"] },
  unknown: { title: "That's not in her published work.", body: "I only answer from her case studies and CV, so I'd rather not guess. Try one of these, or ask her directly.", evidence: [{ label: "Email Debora", href: "mailto:hello@deboramoratalla.com" }], followUps: ["What's the strongest proof of seniority?", "Has she designed an AI agent end to end?"] },
} satisfies Record<string, AgentAnswer>

export type AnswerKey = keyof typeof answers

/** Every suggested question maps to one curated answer. */
export const questionAnswers: Record<string, AnswerKey> = {
  "What's the strongest proof of seniority?": "seniority",
  "Has her work been adopted by a real team?": "enterprise",
  "How does she work with engineering?": "collaboration",
  "Has she designed an AI agent end to end?": "seamline",
  "Where does she draw the line on autonomy?": "agentic",
  "How does she use AI in her own process?": "ai",
  "How did a design system reach code?": "systems",
  "What changed in numbers?": "impact",
  "How does she keep design and code in sync?": "seamline",
  "What does the agent decide alone?": "seamline",
  "What broke when she tested it?": "seamlineTests",
  "What was the real problem?": "enterprise",
  "What did she decide not to ship?": "judgment",
  "How was the redesign structured?": "product",
  "Was it used by real people?": "civeo",
  "Why build it in code?": "prototypes",
  "Where are her roles and dates?": "career",
  "Give me the 90-second tour": "tour",
}

export const roles = [
  { id: "senior", label: "Senior / Staff Product Designer", questions: ["What's the strongest proof of seniority?", "Has her work been adopted by a real team?", "How does she work with engineering?"] },
  { id: "ai", label: "AI Product Designer", questions: ["Has she designed an AI agent end to end?", "Where does she draw the line on autonomy?", "How does she use AI in her own process?"] },
  { id: "systems", label: "Design Systems", questions: ["How did a design system reach code?", "What changed in numbers?", "How does she keep design and code in sync?"] },
] as const

/** Questions about the page the visitor is on. */
export const pageQuestions: Record<string, { label: string; questions: string[] }> = {
  "/projects/seamline": { label: "About Seamline", questions: ["What does the agent decide alone?", "What broke when she tested it?", "Where does she draw the line on autonomy?"] },
  "/projects/saas": { label: "About Board", questions: ["What was the real problem?", "What did she decide not to ship?", "What changed in numbers?"] },
  "/projects/tap-mindset-ds": { label: "About TAP Design System", questions: ["How did a design system reach code?", "How does she use AI in her own process?", "What changed in numbers?"] },
  "/projects/tap-mindset": { label: "About TAP Mindset", questions: ["How was the redesign structured?", "What's the strongest proof of seniority?"] },
  "/projects/fluxy": { label: "About Fluxy", questions: ["Where does she draw the line on autonomy?", "What did she decide not to ship?"] },
  "/projects/civeo": { label: "About Civeo", questions: ["Was it used by real people?", "Why build it in code?"] },
  "/experience": { label: "About her path", questions: ["Where are her roles and dates?", "What's the strongest proof of seniority?"] },
}

export function answerQuestion(question: string): AgentAnswer {
  const direct = questionAnswers[question]
  if (direct) return answers[direct]
  const q = question.toLowerCase()
  if (/broke|fail|test/.test(q) && /seamline|agent/.test(q)) return answers.seamlineTests
  if (/seamline|decide.*alone|guardrail|human in the loop|hackathon|agent.*(design|built|end to end)/.test(q)) return answers.seamline
  if (/autonom|line|boundar|fluxy|consent/.test(q)) return answers.agentic
  if (/senior|staff|lead|ownership|level/.test(q)) return answers.seniority
  if (/adopt|real team|shipped|production|enterprise|suez|board/.test(q)) return answers.enterprise
  if (/not ship|trade-?off|judg|decision/.test(q)) return answers.judgment
  if (/engineer|developer|collabor|code/.test(q) && !/design system/.test(q)) return answers.collaboration
  if (/design system|storybook|token|component/.test(q)) return answers.systems
  if (/number|metric|impact|result|outcome/.test(q)) return answers.impact
  if (/\bai\b|artificial|automat|llm|model/.test(q)) return answers.ai
  if (/civeo|municipal/.test(q)) return answers.civeo
  if (/prototype|prototip/.test(q)) return answers.prototypes
  if (/tap|mindset|athlete|coach/.test(q)) return answers.product
  if (/language|idioma|english|german/.test(q)) return answers.languages
  if (/career|experience|cv|resume|years|background|netflix|leroy/.test(q)) return answers.career
  if (/tour|quick|overview|summary/.test(q)) return answers.tour
  return answers.unknown
}
