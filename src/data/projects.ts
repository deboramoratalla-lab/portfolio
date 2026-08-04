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
  meta?: Array<[string, string]>
  heroLink?: [string, string]
  premiseLabel?: string
  heroStat?: [string, string]
  premise: string
  tldr: string[]
  chapters: Array<{
    number: string
    title: string
    thesis: string
    summary?: string
    intro?: [string, string]
    tone?: "dark" | "light" | "ivory" | "lime" | "blue" | "cyan" | "lavender" | "peach" | "green" | "orange" | "fluxy-dark" | "fluxy-panel"
    sections: Array<{
      eyebrow?: string
      title: string
      body: string[]
      tone?: "dark" | "light" | "ivory" | "lime" | "blue" | "cyan" | "lavender" | "peach" | "green" | "orange" | "fluxy-dark" | "fluxy-panel"
      layout?: "split" | "stack" | "feature" | "compact" | "reframe" | "principles" | "plugin" | "proof" | "business" | "bridge" | "results" | "governance"
      media?: string
      video?: string
      embed?: string
      caption?: string
      link?: [string, string]
      metrics?: Array<[string, string]>
      points?: Array<[string, string]>
      signals?: Array<[string, string]>
      roleMap?: boolean
      statement?: string
      links?: Array<[string, string]>
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
    meta: [["Role","Solo Senior Product Designer"],["Scope","Problem framing → Interaction design → Rule system."],["Timeline","6 months"],["Context","Suez × Board"]],
    premiseLabel: "Annual budget coordinated · €1.2B",
    heroStat: ["€1.2B", "24 regions · 186 agencies · one dependency chain"],
    premise: "How a homepage redesign became a coordination system for finance teams — and a reusable foundation for the work that followed.",
    tldr: ["€1.2B annual budget coordinated", "24 regions and 186 agencies", "3 roles validated", "24 reusable design rules"],
    chapters: [
      { number: "01", title: "The diagnosis", thesis: "The brief described a UI problem. The work exposed a coordination problem.", intro: ["Every calculation existed. Every approval existed. Every workflow existed.", "A page can be feature-rich and operationally empty. The finance team could see everything, but the system did not tell them where the process stood, who owned the next move or what was blocked downstream."], tone: "light", sections: [
        { tone: "dark", layout: "feature", title: "A menu, not a coordination tool.", body: ["Evidence 01 / Existing experience", "Everything was available. Nothing was prioritised."], media: "/media/fL9YsjcUWjmuDS7xICXN72fDkpY.png" },
        { tone: "light", layout: "feature", eyebrow: "First attempt", title: "My first answer was the one they asked for.", body: ["The brief said make it more visual, show the workflow. So I mapped the whole budget process into a single visual flow.", "It showed where the stops were, but not where each user was. A user could trace the process end to end and still not answer: where am I right now, and what is waiting on me?"], media: "/media/euI7feC9sysqqis8gqXR6X4QOo.png" },
        { tone: "cyan", layout: "reframe", eyebrow: "The reframe", title: "This was not a UI problem. It was a workflow architecture problem.", body: ["The homepage did not need to expose more information. It needed to turn the state of a distributed process into something every role could read and act on."], points: [["Brief","Improve consistency and navigation"],["Insight","UI inconsistency was a symptom"],["Challenge","Make workflow state visible"]] },
        { tone: "dark", layout: "proof", title: "Four questions the system never answered.", body: ["Users held the operating model in memory. Mapping made the gap concrete."], points: [["Progress","Where am I, and what is complete?"],["Ownership","Who approves this? Who owns next?"],["Dependencies","What is blocking me?"],["Next steps","What should I do now?"]] }
      ]},
      { number: "02", title: "The system", thesis: "Rules first. Screens second.", tone: "lime", sections: [
        { tone: "lime", layout: "principles", eyebrow: "Six operating principles", title: "The interface followed the rules — not the other way around.", body: ["Before drawing screens, I defined the behaviours the system had to guarantee across every role and phase."], points: [["01","Visibility before navigation"],["02","Context must survive execution"],["03","Dependencies are product objects"],["04","Workflow state is never optional"],["05","Actionable before informational"],["06","Roles coordinate before screens divide"]] },
        { tone: "dark", layout: "feature", title: "The coordination layer that was missing.", body: ["A persistent status bar survives every screen. Priorities are ordered by downstream consequence, dependencies become a first-class column, and workflow state is never optional."], video: "/media/hi5RUlder0uFb2zoYYPHJlwIt3E.mov", caption: "The persistent status bar survives every screen — making current state, ownership and the next required action impossible to lose." },
        { tone: "dark", layout: "principles", eyebrow: "What shaped the new workflow experience", title: "", body: [], points: [["01 · Persistent workflow status","A coordination layer that follows the user through the entire process."],["02 · Priorities ordered by consequence, not time","The system surfaces the work with the greatest downstream impact."],["03 · Dependencies as first-class objects","Every blockage reveals its owner, consequence and recovery path."]] },
        { tone: "light", layout: "stack", title: "The senior decision is often the thing you choose not to ship.", body: ["I rejected status distributed across existing screens, a breadcrumb that ignored dependencies, and a configurable dashboard that would make workflow state optional.", "I traded flexibility for a guarantee."], points: [["Rejected","Status inside existing screens"],["Rejected","A breadcrumb instead of dependencies"],["Rejected","A configurable dashboard"]] },
        { tone: "cyan", layout: "proof", eyebrow: "Roles tested", title: "They read the state off the screen — without prompting.", body: ["National Finance, regional controllers and agency users could identify progress, ownership and next action from the same operating model."], points: [["National Finance","Global visibility without losing regional context."],["Regional controller","Dependencies and blocked work became explicit."],["Agency user","The next required action was visible without explanation."]] }
      ]},
      { number: "03", title: "From product to system", thesis: "The most durable output wasn’t a screen.", tone: "dark", sections: [
        { tone: "dark", layout: "feature", title: "The 24 rules became more valuable than the screens they produced.", body: ["The rule library connected workflow principles, screen behaviour and acceptance criteria — giving future projects proven patterns instead of a blank page.", "See the full project context / Figma"], metrics: [["24","Design rules"],["3","Roles modelled"],["06","Reusable patterns"]], media: "/media/9j6WjZoUkauvEI9LNsWRRL3GYGw.png" },
        { tone: "light", layout: "proof", eyebrow: "Tested in the context of the real workflow", title: "Rules were reviewed as behaviour, not documentation.", body: ["Role-based walkthroughs tested whether the rules held under real hand-offs. Platform limitations were documented separately so constraints never masqueraded as product decisions."], points: [["Role-based walkthroughs","National, regional and agency users tested the same dependency chain."],["A platform ceiling","55+ limitations were documented as constraints, not presented as outcomes."]] },
        { tone: "lime", layout: "reframe", eyebrow: "What this was actually about", title: "People don’t coordinate work through screens.\n\nThey coordinate through shared understanding.\n\nThe product’s job is to make that understanding visible.", body: ["Adopted by SUEZ for the FY2026 budgeting cycle."] }
      ]}
    ]
  },
  {
    slug: "tap-mindset-ds", number: "02", title: "TAP Mindset Design System & AI Workflow /", shortTitle: "TAP Design System",
    strapline: "Building the system that keeps product, design and code in sync.", tags: ["Design system", "AI workflows"], accent: "#bce7f0",
    cover: "/media/7WRS2B1Dd4dOwKjpPVAjEylA44.png", hero: "/media/8E3h5foMKSIxJzUkdIrbzLfEFgM.png",
    role: "Lead Product Designer", context: "Product, Design ×2, Engineering ×2", timeline: "Ongoing",
    meta: [["Role:","Lead Product Designer"],["Team:","Product Manager · Product Designers ×2 · Developers ×2"],["Process:","Scrum (Sprints), Notion"]],
    heroLink: ["Go to Storybook","https://deboramoratalla-lab.github.io/design-system-showcase/?path=/story/welcome-start-here--start-here"],
    premise: "I built a design system that connected Figma and code, then used AI-assisted tools to reduce maintenance without turning automation into another system to maintain.",
    tldr: [
      "Audited 28,000+ component instances across the product to decide what should exist",
      "Designed foundations and token architecture by hand — no AI",
      "Built the component library in code, documented in Storybook",
      "Built two custom Figma plugins to close the gap between code and design",
      "Reduced the public component API from 55 to 38 concepts",
      "Cut component documentation from 45 minutes to under 2"
    ],
    chapters: [
      { number: "01", title: "The problem worth solving", thesis: "The visible issue was inconsistency. The consequential one was maintenance.", tone: "light", sections: [
        { tone: "light", layout: "feature", title: "The system was not failing because components were missing.", body: ["TAP Mindset started as an MVP. Every sprint added flows, features and decisions: eight card variations, six chips and four inputs, most doing the same job. But documenting one component took 45–60 minutes, and that time always lost against the roadmap. Knowledge lived in people, not in the system."] },
        { tone: "light", layout: "business", eyebrow: "The business case", title: "At 45–60 minutes per component, a full documentation pass represented more than 30 hours of repeat work before a feature moved forward. The business case was continuity: reduce recurring maintenance, protect delivery capacity and make system adoption cheaper than bypassing it.", body: [] },
        { tone: "dark", layout: "stack", eyebrow: "The audit", title: "Not designing. Counting.", body: ["I mapped every flow and audited 28,000+ component instances. That exposed which patterns were load-bearing, which were duplicates and which existed for no reason at all."], media: "/media/8E3h5foMKSIxJzUkdIrbzLfEFgM.png" },
        { tone: "blue", layout: "reframe", eyebrow: "The reframe", title: "The problem was never building the design system. It was maintaining it without slowing the product down.", body: [] }
      ]},
      { number: "02", title: "The system & the bet", thesis: "Establish a source of truth, reduce what the team had to maintain, then close the loop between code and design.", tone: "light", sections: [
        { tone: "light", layout: "feature", eyebrow: "The source of truth", title: "Foundations by hand. Components from evidence.", body: ["I designed color, type, spacing, elevation, radius, grid and motion without AI. These decisions become the source of truth for everything downstream; if they are wrong, everything is wrong fast.", "Usage data shaped the component layer. I reduced the public API from 55 concepts to 38 — merging duplicates, promoting real patterns and archiving what nobody used."], media: "/media/v0e9L7cLZpgOZ1Yikq3r8RoqLY.png" },
        { tone: "light", layout: "feature", title: "A source of truth the team could inspect, use and challenge.", body: ["Storybook made the system tangible: foundations, brand rules and production components lived together, with implementation and documentation in the same place."], media: "/media/UHTiiwNdPuTkZcoyyv0CB6hTHrY.png", link: ["↗ Explore the live Storybook", "https://deboramoratalla-lab.github.io/design-system-showcase/?path=/story/welcome-start-here--start-here"] },
        { tone: "dark", layout: "bridge", title: "Once code became the source of truth, manual syncing had an expiry date.", body: ["I built a component importer and a documentation generator to keep Storybook and Figma connected without turning maintenance into another product."] },
        { tone: "dark", layout: "plugin", eyebrow: "Code component importer", title: "", body: [], video: "/media/VDnyOmgwVTRRwyqN4yVYpCa2Q.mov", caption: "Reads a coded component and rebuilds its structure in Figma." },
        { tone: "dark", layout: "plugin", eyebrow: "Document generator", title: "", body: [], video: "/media/DKUq3U6NX0ztkYDZUy6Xg3Y7ww.mov", caption: "Clones a master template and generates the full doc page." },
        { tone: "peach", layout: "reframe", title: "Code describes what. Judgment decides how.", body: ["The plugins carried structure, not judgment. Code could expose variants, slots and tokens; it could not decide whether a pattern should be one component or five, how properties should be grouped, or when an interface needed to hug or fill. That became the boundary of the system."] }
      ]},
      { number: "03", title: "What it cost, what it taught", thesis: "The measurable gains mattered. So did the failures: token drift, weak context and the cost of rebuilding work that moved too quickly.", tone: "dark", sections: [
        { tone: "dark", layout: "results", title: "", body: ["The parity audit exposed four brand scales that had silently drifted apart. Weak context produced fast but inconsistent output. A version restore forced part of the consolidation to be rebuilt. AI accelerated execution — and mistakes — with equal efficiency."], metrics: [["28,000+","Instances audited"],["55 → 38","Component concepts"],["45 → <2 min","Documentation time"]] },
        { tone: "dark", layout: "governance", eyebrow: "Leadership & AI governance", title: "I established weekly reviews with Design and Engineering, assigned ownership by layer and introduced release checks for token, Figma and Storybook parity. AI could audit repetition, draft documentation and accelerate implementation. It could not change foundations, public APIs or accessibility decisions without human review.", body: [] },
        { tone: "green", layout: "reframe", title: "The goal was never consistency. It was continuity.", body: ["Tools will change. Judgment remains."] }
      ]}
    ]
  },
  {
    slug: "tap-mindset", number: "03", title: "TAP Mindset — Product Redesign /", shortTitle: "TAP Mindset",
    strapline: "Reframing one product into three role-based experiences.", tags: ["Product design", "Sports"], accent: "#e5f4d6",
    cover: "/media/KSw5kmupZz4s4LoheYzh4rnIY.png", hero: "/media/8vYUA69ov7JIByTeoOntKRg1Bb4.png",
    role: "Lead Product Designer", context: "Product Design ×2 · Engineering ×2", timeline: "12 months",
    meta: [["Role:","Lead Product Designer"],["Team:","• Product Designers ×2\n• Developers ×2"],["Process:","Scrum (Sprints), Notion"],["Platform:","Mobile (iOS-first)"],["Timeline:","12 months"]],
    heroLink: ["Read DS case study","/projects/tap-mindset-ds"],
    premise: "Led the end-to-end redesign of a mental-training platform — from fragmented features to a role-based product architecture.",
    tldr: [
      "Reframed the product architecture around user intent, not features",
      "Mapped one product into three role-based experiences — coach, mental coach and athlete",
      "Redesigned onboarding to reach first value sooner, personalising progressively",
      "Established four design principles the team could apply across every flow",
      "Led a 12-month redesign with two designers, in close partnership with engineering"
    ],
    chapters: [
      { number: "01", title: "Reframing the product", thesis: "The experience was organised around features, not user intent.", tone: "light", sections: [
        { tone: "light", layout: "feature", title: "A fragmented architecture was becoming a growth constraint.", body: ["Users faced blurred mental models, inconsistent interactions and too many decisions before reaching a meaningful action. This was not a UI clean-up. It was a product architecture problem."] },
        { tone: "light", layout: "business", eyebrow: "Business stakes", title: "Every new feature increased the decisions users faced, multiplied role-specific exceptions and created more design and engineering divergence. The risk was not visual inconsistency; it was a product that became harder to adopt and more expensive to evolve.", body: [] },
        { tone: "dark", layout: "compact", title: "Four symptoms. One structural cause.", body: [], points: [["01","Cognitive overload"],["02","Blurred mental models"],["03","Inconsistent interactions"],["04","A system that could not scale"]], signals: [["Observe","Feature-led navigation"],["Reframe","Intent-led architecture"],["Design","Clear path, progressive depth"]] },
        { tone: "blue", layout: "reframe", title: "The redesign had to reduce decisions without reducing agency.", body: [] }
      ]},
      { number: "02", title: "Designing the system", thesis: "Four principles turned a broad redesign into a decision system the team could use across flows.", tone: "light", sections: [
        { tone: "light", layout: "principles", title: "", body: [], points: [["01","Clarity over density"],["02","Design for momentum"],["03","Intent-based structure"],["04","Consistency at scale"]] },
        { tone: "light", layout: "feature", title: "One product. Three different jobs to be done.", body: ["Mapping capabilities by role exposed where the experience should be shared, where it needed to diverge and which responsibilities were creating unnecessary overlap."], roleMap: true },
        { tone: "lavender", layout: "feature", eyebrow: "The first bet", title: "Activation before personalisation.", body: ["We shortened onboarding and delayed personalisation until after the first meaningful session. The trade-off was deliberate: less tailoring upfront, more momentum when motivation was highest."], points: [["Before","Personalise first"],["Decision","Reach value sooner"],["After","Personalise progressively"]] },
        { tone: "green", layout: "split", eyebrow: "AI in the process", title: "Rules before generation.", body: ["The product architecture and four principles were defined without AI. Once stable, they became context for AI-assisted flow exploration, edge-case expansion and implementation-ready prototypes. I used the system to constrain output, then reviewed every proposal against role intent, accessibility and buildability."], statement: "AI accelerated alternatives. It did not decide what the product should be.", links: [["→ Read the Design System case study", "/projects/tap-mindset-ds"],["↗ Explore Storybook", "https://deboramoratalla-lab.github.io/design-system-showcase/?path=/story/welcome-start-here--start-here"]] }
      ]},
      { number: "03", title: "Building the experience", thesis: "The interface shifted from disconnected tools to a continuous rhythm: prepare, train, reflect and return.", tone: "dark", sections: [
        { tone: "dark", layout: "feature", title: "One clear path, with depth available when needed.", body: ["Daily actions and long-term progress became distinct but connected. Navigation communicated what came next, while progressive disclosure kept exploratory routes available without making them compete with the primary task."], media: "/media/CJeQTobftuZtlYtEXfM0e7jq7xc.png" },
        { tone: "lavender", layout: "feature", eyebrow: "The brand system", title: "The identity had to behave like the product: calm, focused and useful.", body: [], media: "/media/m8mVArIM9VzKohEm4ONZgSbfY.png" }
      ]},
      { number: "04", title: "What changed", thesis: "The structural outcome was not a collection of cleaner screens. It was a product that made its own logic visible.", tone: "light", sections: [
        { tone: "light", layout: "proof", title: "", body: [], points: [["01","Clear separation between user intents"],["02","Fewer decisions before the first meaningful session"],["03","A structure the product could grow into"]], media: "/media/F2QELFSYF2MG5Cgw8Xr4XZKexlo.png" },
        { tone: "light", layout: "split", eyebrow: "Leadership & alignment", title: "I set the product logic, then created the conditions for the team to carry it forward.", body: ["Across twelve months, I led two product designers, established the four principles and split the redesign into role architecture, activation and system workstreams. I used critiques to keep decisions consistent, partnered with Product and Engineering to expose constraints early, and made the final calls when role needs, scope and buildability pulled in different directions."] },
        { tone: "peach", layout: "reframe", eyebrow: "The correction", title: "Simplification became a problem when it removed context.", body: ["Early iterations were too restrictive for exploratory users. I reintroduced progressive disclosure: the primary action stayed obvious, but deeper layers remained available when the moment required them."] },
        { tone: "dark", layout: "results", eyebrow: "Evidence, not theatre", title: "Early validation supported the direction. Product analytics would test whether it held at scale.", body: ["The redesign reduced ambiguity. The next responsibility was proving that clarity changed behaviour."], metrics: [["5/6","Athletes chose the right starting path without prompting"],["−38%","Fewer decisions before reaching a first session"],["3 roles","Validated with product and domain leads in one shared architecture"],["4 signals","Instrumented for beta: comprehension, activation, completion and return"]] }
      ]}
    ]
  },
  {
    slug: "fluxy", number: "04", title: "Fluxy — Product Design Case Study /", shortTitle: "Fluxy",
    strapline: "Designing an agent that earns autonomy through legibility and consent.", tags: ["Agentic design", "Mobility"], accent: "#ffe9ca",
    cover: "/media/ASHNp23jYU6G6rS2Bcba6Rz5TUY.png", hero: "/media/2b7YNCK8WXiTCdQRa84XPV7867M.png",
    role: "Lead Product Designer", context: "Independent concept", timeline: "2026",
    meta: [["Role","Lead Product Designer"],["Brief","Independent concept"],["Focus","Product strategy · Agentic interaction · Prototyping"],["App","Mobile commuting agent · iOS-first"],["Year","2026"]],
    heroLink: ["View prototype","https://www.figma.com/design/McQVV5wJ9vrs50KyNmthFm/Untitled"],
    premiseLabel: "The premise",
    premise: "I turned a narrow online top-up brief into Fluxy: an autonomous commuting agent that protects the passenger’s goal, prepares decisions and intervenes only when circumstances change.",
    tldr: ["Reframed a top-up brief around the full commuting burden", "Defined an agentic interaction model", "Designed autonomy around consent and transparency", "Prototyped three end-to-end moments of trust"],
    chapters: [
      { number: "01", title: "The mismatch", thesis: "A top-up problem was only the visible edge of a much larger burden.", tone: "light", sections: [
        { tone: "light", layout: "compact", title: "", body: ["Looking across the commute exposed an accumulation of small, repetitive decisions. None was difficult alone. Together they created the cognitive load: checking, anticipating, comparing, remembering and recovering."], points: [["Brief","Improve online top-ups."],["Observation","People manage the network continuously."],["Reframe","Protect the passenger’s goal."]], signals: [["Prepare","Check balance, weather and timing before leaving."],["Monitor","Watch delays, transfers and remaining time."],["React","Compare alternatives when the network changes."],["Recover","Re-plan the rest of the journey after disruption."]] }
      ]},
      { number: "02", title: "From route planner to agent", thesis: "The strategic move was a product that decides when interaction is necessary.", tone: "dark", sections: [
        { tone: "dark", layout: "compact", title: "", body: ["Fluxy works in the background until the passenger’s objective is threatened. It observes context, evaluates options and prepares a recommendation. The interface appears at the decision boundary — not before."], points: [["Goal","Arrive at work by 08:45"],["Context","Balance, disruption and timing change"],["Agent","Fluxy evaluates and prepares options"],["Decision boundary","Passenger confirms consequential actions"]], statement: "The product’s value is not the number of decisions it automates. It is knowing which decisions should disappear, which can be prepared and which must remain human." },
        { tone: "fluxy-panel", layout: "feature", eyebrow: "Interactive model", title: "See how Fluxy reasons before it intervenes.", body: ["The demo makes the agent’s operating model tangible: start with a passenger goal, introduce a change in context and see how Fluxy prepares a recommendation while keeping the final decision explicit."], embed: "https://fluxy-rho.vercel.app/", link: ["Open the agent in a new tab ↗", "https://fluxy-rho.vercel.app/"] }
      ]},
      { number: "03", title: "Designing responsible autonomy", thesis: "Trust needed an interaction model, not a reassuring tone of voice.", tone: "light", sections: [
        { tone: "light", layout: "compact", title: "", body: ["An agent can only reduce effort if people understand what it is doing, why it intervenes and where their control begins. I turned those requirements into four rules used across the journey."], points: [["Invisible by default","Do not ask for attention when the goal remains achievable."],["Explain the trigger","Every intervention must reveal what changed."],["Prepare, don’t presume","Fluxy can recommend and stage an action; consequential choices require consent."],["Protect the goal","Optimise for the passenger’s objective, not simply the fastest route."]] },
        { tone: "light", layout: "split", eyebrow: "Product leadership & AI process", title: "I treated the agent as a policy system, not a chat surface.", body: ["I translated fare policy, accessibility, operations and passenger trust into explicit autonomy rules, then used AI to simulate edge cases and generate auditable decision traces. The model accelerated scenario coverage; it did not define the boundaries. Payments, personal-data expansion and major journey changes always remained behind human approval."] }
      ]},
      { number: "04", title: "Proving the model", thesis: "Three moments tested whether an autonomous product could still feel understandable and controlled.", summary: "The prototype focused on moments with different levels of urgency and consequence. Together they tested whether Fluxy could be useful when quiet, persuasive when needed and transparent when asking for consent.", tone: "light", sections: [
        { tone: "orange", layout: "feature", eyebrow: "Daily brief", title: "Build trust before disruption", body: ["A single morning view communicates the plan, confidence and anything worth knowing — without turning commuting into another dashboard."], media: "/media/Mmfb40qOiaxKtQrgIFMJi6A.png", caption: "One glance replaces four checks — balance, weather, timing and route confidence, before the passenger leaves home." },
        { tone: "light", layout: "feature", eyebrow: "Smart recharge", title: "Autonomy stops at payment", body: ["Fluxy monitors balance and recommends a recharge only when necessary. It prepares the action; the passenger authorises the transaction."], media: "/media/3ZRShN2uu7UG2p8p8J3RXWpJg1U.png", caption: "Fluxy stages the top-up and shows why — but the payment button stays with the passenger. This is the autonomy boundary made visible." },
        { tone: "fluxy-dark", layout: "feature", eyebrow: "Goal protection", title: "The objective survives change", body: ["When disruption threatens arrival, Fluxy explains what changed and recommends a new route in terms of the passenger’s priority."], media: "/media/1OrTKFTrcLckBt1fLOZU36fom5s.png", caption: "The route changes, but the arrival goal does not — the recommendation explains the trade-off and leaves the final choice with the passenger." },
        { tone: "dark", layout: "results", eyebrow: "What the project demonstrated", title: "The strongest product decision was deciding when the product should disappear.", body: ["The challenge started with online top-ups and ended as an exploration of agentic commuting. The work was less about adding features than defining a boundary: software can monitor, prepare and recommend, but it must remain legible and return consequential decisions to the passenger."], metrics: [["5/6","Passengers understood why Fluxy intervened without additional explanation"],["6/6","Expected payment to require confirmation — the autonomy boundary was clear"],["12","Routine, disruption and low-balance scenarios tested"]] }
      ]}
    ]
  }
]

export const projectBySlug = Object.fromEntries(projects.map((project) => [project.slug, project]))
