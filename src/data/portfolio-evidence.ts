export type PortfolioEvidence = {
  id: string
  label: string
  href: string
  claims: string[]
}

export const portfolioEvidence: PortfolioEvidence[] = [
  {
    id: "board-framing",
    label: "Board · problem framing",
    href: "/projects/saas#chapter-01",
    claims: [
      "A UI request became a coordination model for three roles, 24 regions and 186 agencies.",
      "The work reframed interface complexity as a product and operating-model problem.",
    ],
  },
  {
    id: "board-tradeoffs",
    label: "Board · trade-offs",
    href: "/projects/saas#chapter-02",
    claims: [
      "The case study makes rejected paths and product trade-offs visible.",
      "It shows how constraints were protected under enterprise complexity.",
    ],
  },
  {
    id: "board-rules",
    label: "Board · rule system",
    href: "/projects/saas#chapter-03",
    claims: [
      "The outcome was a reusable rule system adopted for SUEZ's FY2026 budgeting cycle.",
      "The system aligned roles, regions, agencies and dependencies instead of solving one screen.",
    ],
  },
  {
    id: "board-coded-prototype",
    label: "Board · coded workflow prototype",
    href: "/projects/saas#board-02",
    claims: [
      "The Board case includes a coded, interactive prototype of the role-based workflow: role selection, home, task detail, submission, review and approval.",
      "Claude was used as a design participant to challenge edge cases and accelerate the prototype; Debora retained ownership of the operating model, interaction decisions and validation.",
    ],
  },
  {
    id: "civeo-poc",
    label: "Civeo · deployed municipal operations product",
    href: "/projects/civeo",
    claims: [
      "Civeo turned an Excel-led municipal operations process into a deployed product with four-level navigation, editable widgets, live and offline states, and a contextual assistant.",
      "Debora built the product directly in HTML, CSS and JavaScript, with Leaflet and Open-Meteo, and used it with 15 internal workers. It was implemented as a working operational surface rather than a static Figma handoff.",
    ],
  },
  {
    id: "tap-ds",
    label: "TAP Design System",
    href: "/projects/tap-mindset-ds",
    claims: [
      "The system connects foundations, code, Storybook and Figma.",
      "An audit consolidated 55 concepts into 38.",
      "A 45-minute documentation task was reduced to under two minutes.",
    ],
  },
  {
    id: "tap-architecture",
    label: "TAP · product architecture",
    href: "/projects/tap-mindset#chapter-02",
    claims: [
      "A fragmented, feature-led platform became three role-based experiences.",
      "The architecture gets users to value before asking for personalisation.",
    ],
  },
  {
    id: "tap-leadership",
    label: "TAP · product leadership",
    href: "/projects/tap-mindset#chapter-04",
    claims: [
      "The case demonstrates ownership across a 12-month product redesign.",
      "It shows alignment and decision-making across Product, Design and Engineering.",
    ],
  },
  {
    id: "fluxy-boundaries",
    label: "Fluxy · AI boundaries",
    href: "/projects/fluxy#chapter-03",
    claims: [
      "The agent monitors quietly, prepares decisions and asks for approval before consequential actions.",
      "Payment, disruption and changes of goal remain visible and under human control.",
    ],
  },
  {
    id: "tools",
    label: "Tools in context",
    href: "/#tools",
    claims: [
      "The working stack includes Figma, Storybook, React, Next.js, TypeScript, OpenAI API, GitHub and Vercel.",
      "Tools are presented through product decisions and implementation context, not as a standalone skills list.",
    ],
  },
  {
    id: "lab-audit",
    label: "Lab · auditing 28,000 instances",
    href: "/lab/design-systems-need-evidence",
    claims: [
      "The field note explains how an audit surfaced repeated product decisions and clarified what a design system needed to own.",
    ],
  },
  { id: "cv-profile", label: "Experience · professional profile", href: "/experience", claims: ["Debora is a Product Designer with 10+ years shaping digital products, systems and creative direction.", "Her background spans product design, design systems, visual design, service design, interiors, art direction and code."] },
  { id: "cv-board", label: "Experience · Board International", href: "/experience#board", claims: ["Debora has been Senior Product Designer at Board International since October 2024.", "She owns end-to-end product design across enterprise planning and financial products and works closely with Product and Engineering.", "She introduces AI-native workflows for research, documentation and design-to-engineering collaboration."] },
  { id: "cv-freelance", label: "Experience · product leadership", href: "/experience#freelance", claims: ["As a freelance Lead Product Designer from 2021 to 2024, Debora led TAP Mindset, built its design system, conceived AccessIA and designed a smart-city dashboard for internal teams."] },
  { id: "cv-earlier-roles", label: "Experience · earlier roles", href: "/experience#leroy-merlin", claims: ["Debora was Senior Product Designer at Leroy Merlin from 2022 to 2023, leading key e-commerce redesigns through research and experimentation.", "She was Senior Visual Designer at Netflix from 2019 to 2021, leading work for original productions and scalable visual systems.", "At BICG Digital from 2018 to 2019, she designed workplace-product experiences connecting hybrid-team demand, spatial scenarios and real-estate analytics across hyTeams, FlowArch and Liquid Real Estate."] },
  { id: "cv-education", label: "Experience · education", href: "/experience#education", claims: ["Debora holds an Associate Degree in Computer Applications Development and a BA in Interior Design.", "Her continuing education includes UX/UI at IMMUNE Institute and design tokens through Brad Frost Academy."] },
  { id: "cv-languages-speaking", label: "Experience · languages and teaching", href: "/experience#languages", claims: ["Debora speaks Spanish natively, English at C1 level and German at B2 level.", "She has spoken and taught about senior designers in the age of AI, building a design system with AI and UX/UI best practices."] },
]

export const portfolioEvidencePrompt = portfolioEvidence
  .map(item => `${item.id}\n${item.claims.map(claim => `- ${claim}`).join("\n")}`)
  .join("\n\n")
