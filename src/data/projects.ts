export type Project = {
  slug: string
  number: string
  title: string
  shortTitle: string
  strapline: string
  tags: string[]
  accent: string
  cover: string
  hero?: string
  role: string
  context: string
  timeline: string
  premise: string
  tldr: string[]
  chapters: Array<{
    number: string
    title: string
    thesis: string
    tone?: "dark" | "light" | "lime" | "blue" | "lavender" | "peach" | "green"
    sections: Array<{
      eyebrow?: string
      title: string
      body: string[]
      tone?: "dark" | "light" | "lime" | "blue" | "lavender" | "peach" | "green"
      layout?: "split" | "stack" | "feature" | "compact"
      media?: string
      video?: string
      metrics?: Array<[string, string]>
      points?: Array<[string, string]>
    }>
  }>
}

export const projects: Project[] = [
  {
    slug: "saas", number: "01", title: "Enterprise Planning /", shortTitle: "Board",
    strapline: "Making workflow state visible across a €1.2B budgeting system.",
    tags: ["Product design", "Enterprise workflow"], accent: "#ffe67c",
    cover: "/media/U83YozysM0D05lMq82nlFdYG1M.png", hero: "/media/fL9YsjcUWjmuDS7xICXN72fDkpY.png",
    role: "Solo Senior Product Designer", context: "SUEZ × Board", timeline: "6 months",
    premise: "How a homepage redesign became a coordination system for finance teams — and a reusable foundation for the work that followed.",
    tldr: ["€1.2B annual budget coordinated", "24 regions and 186 agencies", "3 roles validated", "24 reusable design rules"],
    chapters: [
      { number: "01", title: "The diagnosis", thesis: "The brief described a UI problem. The work exposed a coordination problem.", tone: "light", sections: [
        { tone: "dark", layout: "feature", title: "A menu, not a coordination tool.", body: ["Every calculation, approval and workflow existed. Yet the finance teams responsible for keeping the cycle moving still coordinated it through email.", "One task stalled upstream held twenty-four regional leads downstream. The only mechanism for detecting that stall was somebody asking."], media: "/media/fL9YsjcUWjmuDS7xICXN72fDkpY.png" },
        { tone: "light", layout: "feature", eyebrow: "First attempt", title: "My first answer was the one they asked for.", body: ["The brief said make it more visual, show the workflow. So I mapped the whole budget process into a single visual flow.", "It showed where the stops were, but not where each user was. A user could trace the process end to end and still not answer: where am I right now, and what is waiting on me?"], media: "/media/euI7feC9sysqqis8gqXR6X4QOo.png" },
        { tone: "blue", layout: "compact", title: "Four questions the system never answered.", body: ["Users held the operating model in memory. Mapping made the gap concrete."], points: [["Progress","Where am I, and what is complete?"],["Ownership","Who approves this? Who owns next?"],["Dependencies","What is blocking me?"],["Next steps","What should I do now?"]] }
      ]},
      { number: "02", title: "The system", thesis: "Rules first. Screens second.", tone: "lime", sections: [
        { tone: "dark", layout: "feature", title: "The coordination layer that was missing.", body: ["A persistent status bar survives every screen. Priorities are ordered by downstream consequence, dependencies become a first-class column, and workflow state is never optional."], video: "/media/hi5RUlder0uFb2zoYYPHJlwIt3E.mov" },
        { tone: "light", layout: "stack", title: "The senior decision is often the thing you choose not to ship.", body: ["I rejected status distributed across existing screens, a breadcrumb that ignored dependencies, and a configurable dashboard that would make workflow state optional.", "I traded flexibility for a guarantee."], points: [["Rejected","Status inside existing screens"],["Rejected","A breadcrumb instead of dependencies"],["Rejected","A configurable dashboard"]] },
        { tone: "blue", layout: "split", eyebrow: "Leadership & alignment", title: "I turned three local perspectives into one operating model.", body: ["I facilitated working sessions with National Finance, regional controllers, agency users, Product and Engineering. A shared decision log separated policy from preference and made ownership explicit."] }
      ]},
      { number: "03", title: "From product to system", thesis: "The most durable output wasn’t a screen.", tone: "dark", sections: [
        { tone: "dark", layout: "feature", title: "A rule library the next project could reuse.", body: ["The rule library connected workflow principles, screen behaviour and acceptance criteria — giving future projects proven patterns instead of a blank page."], metrics: [["24","Design rules"],["3","Roles modelled"],["06","Reusable patterns"]], media: "/media/9j6WjZoUkauvEI9LNsWRRL3GYGw.png" },
        { tone: "lime", layout: "split", eyebrow: "AI as a consumer of the system", title: "Stable rules make AI-assisted work reliable.", body: ["Once decisions were expressed as roles, states, dependencies and exceptions, they could constrain AI-assisted exploration instead of relying on prompts alone."], points: [["Validation","Three role-based walkthroughs"],["Constraint","55+ platform limitations documented"],["Outcome","Adopted for the FY2026 budgeting cycle"]] }
      ]}
    ]
  },
  {
    slug: "tap-mindset-ds", number: "02", title: "TAP Mindset Design System & AI Workflow /", shortTitle: "TAP Design System",
    strapline: "Building the system that keeps product, design and code in sync.", tags: ["Design system", "AI workflows"], accent: "#bce7f0",
    cover: "/media/7WRS2B1Dd4dOwKjpPVAjEylA44.png", hero: "/media/8E3h5foMKSIxJzUkdIrbzLfEFgM.png",
    role: "Lead Product Designer", context: "Product, Design ×2, Engineering ×2", timeline: "Ongoing",
    premise: "I built a design system that connected Figma and code, then used AI-assisted tools to reduce maintenance without turning automation into another system to maintain.",
    tldr: ["28,000+ component instances audited", "55 → 38 component concepts", "45 → <2 min documentation time", "Two Figma plugins built"],
    chapters: [
      { number: "01", title: "The problem worth solving", thesis: "The visible issue was inconsistency. The consequential one was maintenance.", tone: "light", sections: [
        { tone: "light", layout: "feature", title: "The system was not failing because components were missing.", body: ["TAP Mindset started as an MVP. Every sprint added flows, features and decisions. But documenting one component took 45–60 minutes, and that time always lost against the roadmap.", "Knowledge lived in people, not in the system."], media: "/media/8E3h5foMKSIxJzUkdIrbzLfEFgM.png" },
        { tone: "dark", layout: "stack", eyebrow: "The audit", title: "Not designing. Counting.", body: ["I mapped every flow and audited 28,000+ component instances. That exposed which patterns were load-bearing, which were duplicates and which existed for no reason at all."], metrics: [["28,000+","Instances audited"],["30+ h","Repeat documentation"],["4","Drifting brand scales"]] }
      ]},
      { number: "02", title: "The system & the bet", thesis: "Establish a source of truth, reduce what the team had to maintain, then close the loop between code and design.", tone: "blue", sections: [
        { tone: "light", layout: "feature", eyebrow: "The source of truth", title: "Foundations by hand. Components from evidence.", body: ["I designed color, type, spacing, elevation, radius, grid and motion without AI. Usage data then shaped the component layer.", "I reduced the public API from 55 concepts to 38 — merging duplicates, promoting real patterns and archiving what nobody used."], media: "/media/v0e9L7cLZpgOZ1Yikq3r8RoqLY.png" },
        { tone: "light", layout: "feature", title: "A source of truth the team could inspect, use and challenge.", body: ["Storybook made the system tangible: foundations, brand rules and production components lived together, with implementation and documentation in the same place."], media: "/media/UHTiiwNdPuTkZcoyyv0CB6hTHrY.png" },
        { tone: "dark", layout: "feature", eyebrow: "Code component importer", title: "Reads code and rebuilds its structure in Figma.", body: ["Once code became the source of truth, manual syncing had an expiry date."], video: "/media/VDnyOmgwVTRRwyqN4yVYpCa2Q.mov" },
        { tone: "peach", layout: "feature", eyebrow: "Document generator", title: "Clones a master template and generates the full doc page.", body: ["The plugins carried structure, not judgment. Code could expose variants, slots and tokens; it could not decide whether a pattern should be one component or five."], video: "/media/DKUq3U6NX0ztkYDZUy6Xg3Y7ww.mov" }
      ]},
      { number: "03", title: "What it cost, what it taught", thesis: "The measurable gains mattered. So did the failures.", tone: "dark", sections: [
        { tone: "dark", layout: "stack", title: "AI accelerated execution — and mistakes — with equal efficiency.", body: ["The parity audit exposed four brand scales that had silently drifted apart. Weak context produced fast but inconsistent output. A version restore forced part of the consolidation to be rebuilt."], metrics: [["55 → 38","Component concepts"],["45 → <2 min","Documentation time"],["4","Brand scales reconciled"]] },
        { tone: "green", layout: "split", eyebrow: "Leadership & AI governance", title: "The system needed owners, review gates and a clear boundary for automation.", body: ["I established weekly reviews with Design and Engineering, assigned ownership by layer and introduced release checks for token, Figma and Storybook parity.", "AI could audit repetition, draft documentation and accelerate implementation. It could not change foundations, public APIs or accessibility decisions without human review."] }
      ]}
    ]
  },
  {
    slug: "tap-mindset", number: "03", title: "TAP Mindset — Product Redesign /", shortTitle: "TAP Mindset",
    strapline: "Reframing one product into three role-based experiences.", tags: ["Product design", "Sports"], accent: "#e5f4d6",
    cover: "/media/KSw5kmupZz4s4LoheYzh4rnIY.png", hero: "/media/8vYUA69ov7JIByTeoOntKRg1Bb4.png",
    role: "Lead Product Designer", context: "Product Design ×2 · Engineering ×2", timeline: "12 months",
    premise: "Led the end-to-end redesign of a mental-training platform — from fragmented features to a role-based product architecture.",
    tldr: ["Reframed architecture around user intent", "Mapped three role-based experiences", "Redesigned onboarding for earlier value", "Established four product principles"],
    chapters: [
      { number: "01", title: "Reframing the product", thesis: "The experience was organised around features, not user intent.", tone: "light", sections: [
        { tone: "light", layout: "feature", title: "A fragmented architecture was becoming a growth constraint.", body: ["Every new feature increased the decisions users faced, multiplied role-specific exceptions and created more design and engineering divergence.", "The risk was not visual inconsistency; it was a product that became harder to adopt and more expensive to evolve."], media: "/media/8vYUA69ov7JIByTeoOntKRg1Bb4.png" },
        { tone: "dark", layout: "compact", eyebrow: "The diagnosis", title: "Four symptoms. One structural cause.", body: ["The redesign had to reduce decisions without reducing agency."], points: [["01","Cognitive overload"],["02","Blurred mental models"],["03","Inconsistent interactions"],["04","A system that could not scale"]] }
      ]},
      { number: "02", title: "Designing the system", thesis: "Four principles turned a broad redesign into a decision system.", tone: "blue", sections: [
        { tone: "light", layout: "feature", title: "One product. Three different jobs to be done.", body: ["Mapping capabilities by role exposed where the experience should be shared, where it needed to diverge and which responsibilities were creating unnecessary overlap."], points: [["Mental coach","Organise, define and supervise"],["Coach","Manage, monitor and guide"],["Athlete","Prepare, practise and compete"]], media: "/media/CJeQTobftuZtlYtEXfM0e7jq7xc.png" },
        { tone: "lavender", layout: "feature", eyebrow: "The first bet", title: "Activation before personalisation.", body: ["We shortened onboarding and delayed personalisation until after the first meaningful session. The trade-off was deliberate: less tailoring upfront, more momentum when motivation was highest."], points: [["Before","Personalise first"],["Decision","Reach value sooner"],["After","Personalise progressively"]] },
        { tone: "green", layout: "split", eyebrow: "AI in the process", title: "Rules before generation.", body: ["The product architecture and four principles were defined without AI. Once stable, they became context for flow exploration, edge-case expansion and implementation-ready prototypes.", "AI accelerated alternatives. It did not decide what the product should be."] }
      ]},
      { number: "03", title: "Building the experience", thesis: "One clear path, with depth available when needed.", tone: "dark", sections: [
        { tone: "dark", layout: "feature", title: "Prepare, train, reflect and return.", body: ["Daily actions and long-term progress became distinct but connected. Navigation communicated what came next, while progressive disclosure kept exploratory routes available without competing with the primary task."], media: "/media/m8mVArIM9VzKohEm4ONZgSbfY.png" },
        { tone: "lavender", layout: "feature", title: "Simplification became a problem when it removed context.", body: ["Early iterations were too restrictive for exploratory users. I reintroduced progressive disclosure: the primary action stayed obvious, but deeper layers remained available when the moment required them."], media: "/media/F2QELFSYF2MG5Cgw8Xr4XZKexlo.png" }
      ]},
      { number: "04", title: "What changed", thesis: "The product made its own logic visible.", tone: "light", sections: [
        { tone: "dark", layout: "stack", eyebrow: "Leadership & alignment", title: "I set the product logic, then created the conditions for the team to carry it forward.", body: ["Across twelve months, I led two product designers, established the four principles and split the redesign into role architecture, activation and system workstreams."], metrics: [["5/6","Athletes chose the right starting path"],["−38%","Fewer decisions before first session"],["3 roles","One shared architecture"],["4 signals","Instrumented for beta"]] }
      ]}
    ]
  },
  {
    slug: "fluxy", number: "04", title: "Fluxy — Product Design Case Study /", shortTitle: "Fluxy",
    strapline: "Designing an agent that earns autonomy through legibility and consent.", tags: ["Agentic design", "Mobility"], accent: "#ffe9ca",
    cover: "/media/ASHNp23jYU6G6rS2Bcba6Rz5TUY.png", hero: "/media/2b7YNCK8WXiTCdQRa84XPV7867M.png",
    role: "Lead Product Designer", context: "Independent concept", timeline: "2026",
    premise: "I turned a narrow online top-up brief into Fluxy: an autonomous commuting agent that protects the passenger’s goal, prepares decisions and intervenes only when circumstances change.",
    tldr: ["Reframed a top-up brief around commuting", "Defined an agentic interaction model", "Designed autonomy around consent", "Prototyped three moments of trust"],
    chapters: [
      { number: "01", title: "The mismatch", thesis: "A top-up problem was only the visible edge of a much larger burden.", tone: "light", sections: [
        { tone: "light", layout: "feature", title: "The opportunity was to remove the need to manage commuting at all.", body: ["Commuters still have to remember their balance, compare routes, monitor disruption and recover when the network changes.", "The product question was not how to make one task faster, but which decisions software could responsibly take off the passenger’s plate."], media: "/media/2b7YNCK8WXiTCdQRa84XPV7867M.png" },
        { tone: "peach", layout: "split", eyebrow: "The business bet", title: "Fewer failure moments, not more app engagement.", body: ["For an operator, the value is operational: prevent low-balance failures, reduce avoidable support contacts and protect journey completion when the network changes."] }
      ]},
      { number: "02", title: "From route planner to agent", thesis: "The strategic move was a product that decides when interaction is necessary.", tone: "dark", sections: [
        { tone: "dark", layout: "compact", title: "Goals stay stable. Context and recommendations can change.", body: ["Fluxy works in the background until the passenger’s objective is threatened. It observes context, evaluates options and prepares a recommendation.", "The interface appears at the decision boundary — not before."], points: [["Goal","Arrive at work by 08:45"],["Context","Balance, disruption and timing change"],["Agent","Fluxy evaluates and prepares options"],["Boundary","Passenger confirms consequential actions"]] },
        { tone: "dark", layout: "feature", eyebrow: "Interactive model", title: "See how Fluxy reasons before it intervenes.", body: ["Start with a passenger goal, introduce a change in context and see how Fluxy prepares a recommendation while keeping the final decision explicit."], media: "/media/Mmfb40qOiaxKtQrgIFMJi6A.png" }
      ]},
      { number: "03", title: "Designing responsible autonomy", thesis: "Trust needed an interaction model, not a reassuring tone of voice.", tone: "light", sections: [
        { tone: "light", layout: "compact", title: "Four rules used across the journey.", body: ["An agent can only reduce effort if people understand what it is doing, why it intervenes and where their control begins."], points: [["Invisible by default","Do not ask for attention when the goal remains achievable."],["Explain the trigger","Every intervention reveals what changed."],["Prepare, don’t presume","Consequential choices require consent."],["Protect the goal","Optimise for the passenger’s objective."]] },
        { tone: "light", layout: "split", eyebrow: "Product leadership & AI process", title: "I treated the agent as a policy system, not a chat surface.", body: ["I translated fare policy, accessibility, operations and passenger trust into explicit autonomy rules, then used AI to simulate edge cases and generate auditable decision traces.", "The model accelerated scenario coverage; it did not define the boundaries."] }
      ]},
      { number: "04", title: "Proving the model", thesis: "Three moments tested whether autonomy could still feel understandable and controlled.", tone: "light", sections: [
        { tone: "peach", layout: "feature", eyebrow: "Daily brief", title: "Build trust before disruption", body: ["A single morning view communicates the plan, confidence and anything worth knowing — without turning commuting into another dashboard."], media: "/media/Mmfb40qOiaxKtQrgIFMJi6A.png" },
        { tone: "light", layout: "feature", eyebrow: "Smart recharge", title: "Autonomy stops at payment", body: ["Fluxy monitors balance and recommends a recharge only when necessary. It prepares the action; the passenger authorises the transaction."], media: "/media/3ZRShN2uu7UG2p8p8J3RXWpJg1U.png" },
        { tone: "dark", layout: "feature", eyebrow: "Goal protection", title: "The objective survives change", body: ["When disruption threatens arrival, Fluxy explains what changed and recommends a new route in terms of the passenger’s priority."], media: "/media/1OrTKFTrcLckBt1fLOZU36fom5s.png", metrics: [["5/6","Understood why Fluxy intervened"],["6/6","Expected payment confirmation"],["12","Scenarios tested"]] }
      ]}
    ]
  }
]

export const projectBySlug = Object.fromEntries(projects.map((project) => [project.slug, project]))
