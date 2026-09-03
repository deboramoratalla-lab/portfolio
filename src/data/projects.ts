export type Project = {
  slug: string
  number: string
  title: string
  shortTitle: string
  strapline: string
  problem?: string
  complexity?: string
  ownership?: string
  outcome?: string
  tags: string[]
  accent: string
  cover: string
  hero?: string
  role: string
  context: string
  timeline: string
  meta?: Array<[string, string]>
  heroLink?: [string, string]
  heroLinks?: Array<[string, string]>
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
      layout?: "split" | "stack" | "feature" | "compact" | "reframe" | "principles" | "plugin" | "proof" | "business" | "bridge" | "results" | "governance" | "storybook"
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
    strapline: "A budgeting product where status had become a coordination problem.",
    problem: "Finance teams could see the process, but not what was blocked or who owned the next move.",
    complexity: "Distributed approvals, dependencies and regional roles.",
    ownership: "Framed the workflow problem and defined the reusable rule system.", outcome: "Adopted by SUEZ for the FY2026 budgeting cycle.",
    tags: ["Product design", "Enterprise workflow"], accent: "#ffe67c",
    cover: "/media/suez-enterprise-planning-cover.png", hero: "/media/fL9YsjcUWjmuDS7xICXN72fDkpY.png",
    role: "Solo Senior Product Designer", context: "SUEZ × Board", timeline: "6 months",
    meta: [["Role","Solo Senior Product Designer"],["Team","SUEZ Finance · Product · Engineering"],["Stack","Board platform · Figma · Enterprise workflows"],["My ownership","Problem framing · Interaction design · Rule system"]],
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
    strapline: "Keeping product, design and code in sync as the system grows.",
    problem: "Component drift made each release slower to document and harder to keep aligned.",
    complexity: "Figma, code, tokens, Storybook and a 28,000-instance product surface.",
    ownership: "Led foundations, API reduction and the bridge between design and implementation.", outcome: "Reduced 55 public concepts to 38 and cut documentation from 45 minutes to under 2.", tags: ["Design system", "AI workflows"], accent: "#bce7f0",
    cover: "/media/7WRS2B1Dd4dOwKjpPVAjEylA44.png", hero: "/media/8E3h5foMKSIxJzUkdIrbzLfEFgM.png",
    role: "Lead Product Designer", context: "Product, Design ×2, Engineering ×2", timeline: "Ongoing",
    meta: [["Role:","Lead Product Designer · Design Engineer"],["Team:","Product Manager · Product Designers ×3 · Engineers ×2"],["Stack:","React · TypeScript · Storybook · Style Dictionary · Figma Plugins"],["My ownership:","Led foundations, API reduction and the bridge between design and implementation"]],
    heroLink: ["Go to Storybook","https://deboramoratalla-lab.github.io/design-system-showcase/?path=/story/welcome-start-here--start-here"],
    heroLinks: [
      ["Inspect Storybook","https://deboramoratalla-lab.github.io/design-system-showcase/?path=/story/welcome-start-here--start-here"],
      ["Inspect source","https://github.com/deboramoratalla-lab/design-system-showcase"],
    ],
    premise: "I started by deciding what the product genuinely needed, then built the system in code and created a practical AI workflow to keep React, Storybook and Figma in sync — without asking automation to make design decisions for us.",
    tldr: [
      "Audited 28,000+ component instances across the product to decide what should exist",
      "Turned design decisions into versioned tokens and React component contracts",
      "Built the component library and its inspectable API in Storybook",
      "Built a TypeScript catalogue pipeline and two Figma plugins to close the code–design loop",
      "Reduced the public component API from 55 to 38 concepts",
      "Cut component documentation from 45 minutes to under 2"
    ],
    chapters: [
      { number: "01", title: "Work out what was worth keeping", thesis: "The product did not need a bigger component library. It needed fewer decisions that the whole team could understand and reuse.", tone: "light", sections: [
        { tone: "light", layout: "feature", title: "We had plenty of components. That was part of the problem.", body: ["TAP Mindset had grown one sprint at a time. We ended up with eight kinds of card, six chips and four inputs, often doing almost the same job. Documenting a single component took 45–60 minutes, so it was understandably postponed whenever the roadmap became busy. The real system lived in people’s heads."] },
        { tone: "light", layout: "business", eyebrow: "Why it mattered", title: "The team was paying for the same decisions again and again.", body: ["A full documentation pass meant more than 30 hours of repetitive work before we had even moved a feature forward. I wanted the shared route to be the easiest route — useful enough that nobody needed to create an exception just to keep working."] },
        { tone: "dark", layout: "stack", eyebrow: "The audit", title: "I stopped drawing and started counting.", body: ["At that point, I decided not to design another component until I understood what we already had. I mapped the product flow by flow and inspected more than 28,000 component instances.", "The numbers changed the conversation. They showed which patterns the product truly depended on, which ones were duplicates and which ones had simply survived because nobody had challenged them."], media: "/media/8E3h5foMKSIxJzUkdIrbzLfEFgM.png" },
        { tone: "blue", layout: "reframe", eyebrow: "What changed", title: "The maintenance problem", body: ["The difficult part was not creating a design system. It was making one the team could keep useful while the product continued to move."] }
      ]},
      { number: "02", title: "Build it where the team could use it", thesis: "The system became useful when a designer could understand it in Figma and an engineer could inspect the same decision in code.", tone: "light", sections: [
        { tone: "light", layout: "feature", eyebrow: "Starting with the foundations", title: "I made the core decisions before I automated anything.", body: ["With the audit in front of me, I decided to rebuild from the foundations up: colour, type, spacing, elevation, radius, grid and motion. AI could help later, but automating a weak rule would only spread it faster.", "Then I used the evidence to reduce 55 public concepts to 38. I merged duplicates, kept the patterns the product actually relied on and retired the rest."], media: "/media/v0e9L7cLZpgOZ1Yikq3r8RoqLY.png" },
        { tone: "dark", layout: "proof", eyebrow: "How it works", title: "A design decision has one path through the system.", body: ["Once the foundations were stable, I got to work on the coded system. I turned tokens into CSS properties, design choices into TypeScript props and component behaviour into inspectable stories.", "I published the implementation because I wanted the technical story to be checked, not simply believed. Tokens, React components, stories and tests live together in the same repository."], points: [["Tokens","A JSON value is transformed into a CSS custom property"],["Components","TypeScript props define the React component’s public options"],["Checks","Storybook makes states, accessibility and behaviour visible"]], links: [["↗ Inspect token pipeline", "https://github.com/deboramoratalla-lab/design-system-showcase/tree/main/design-tokens"],["↗ Inspect React components", "https://github.com/deboramoratalla-lab/design-system-showcase/tree/main/src/components"]] },
        { tone: "light", layout: "storybook", eyebrow: "A place to inspect the work", title: "Storybook gave Design and Engineering the same reference point.", body: ["The next decision was where the team should meet. I chose Storybook because it could show foundations, brand rules, real components and their documentation in one place.", "That changed the handoff. A designer could check intent and states; an engineer could inspect the API and implementation without translating a separate specification. The repository is public, so each claim here can be followed into a working story or the code behind it."], media: "/media/UHTiiwNdPuTkZcoyyv0CB6hTHrY.png", links: [["↗ Open the live Storybook", "https://deboramoratalla-lab.github.io/design-system-showcase/?path=/story/welcome-start-here--start-here"],["↗ Inspect the GitHub repository", "https://github.com/deboramoratalla-lab/design-system-showcase"]] },
        { tone: "dark", layout: "bridge", eyebrow: "Connecting code and Figma", title: "I automated the parts nobody should have to copy by hand.", body: ["At first, I was still treating Figma as the place where the system had to be recreated and maintained. I changed my position once the coded component became the more reliable description of what actually shipped.", "So I built a TypeScript catalogue builder, a component importer and a documentation generator. The catalogue reads props, variants, booleans, slots, defaults, CSS token references and Storybook metadata. The plugins carry that structure into Figma instead of guessing from a screenshot."], links: [["↗ Inspect all Figma tools", "https://github.com/deboramoratalla-lab/design-system-showcase/tree/main/tools"],["↗ Read the catalogue builder", "https://github.com/deboramoratalla-lab/design-system-showcase/blob/main/tools/figma-code-component-importer/scripts/build-catalog.mjs"]] },
        { tone: "dark", layout: "plugin", eyebrow: "01 · Code component importer", title: "", body: [], video: "/media/VDnyOmgwVTRRwyqN4yVYpCa2Q.mov", caption: "Reads the coded component catalogue and rebuilds an editable component structure in Figma. Visual adapters handle the places where arbitrary JSX and CSS cannot be translated safely.", links: [["↗ Inspect importer source", "https://github.com/deboramoratalla-lab/design-system-showcase/tree/main/tools/figma-code-component-importer"]] },
        { tone: "dark", layout: "plugin", eyebrow: "02 · Documentation generator", title: "", body: [], video: "/media/DKUq3U6NX0ztkYDZUy6Xg3Y7ww.mov", caption: "Turns a selected component set into linked Overview and Variants & states documentation. If validation fails, it reports the stage and removes the temporary frames.", links: [["↗ Inspect generator source", "https://github.com/deboramoratalla-lab/design-system-showcase/tree/main/tools/figma-component-docs-generator"]] },
        { tone: "peach", layout: "reframe", title: "Code describes what. Judgment decides how.", body: ["The plugins carried structure, not judgment. Code could expose variants, slots and tokens; it could not decide whether a pattern should be one component or five, how properties should be grouped, or when an interface needed to hug or fill. That became the boundary of the system."] }
      ]},
      { number: "03", title: "Use AI without giving away the decisions", thesis: "AI saved time once we gave it good context, a narrow job and a clear point where a person had to review the result.", tone: "dark", sections: [
        { tone: "dark", layout: "principles", eyebrow: "Where AI helped", title: "AI was useful after the rules were clear — not before.", body: ["Only then did I bring AI into the workflow. I used it to find repetition, explore edge cases, prepare documentation and speed up implementation.", "I also changed how I thought about it. The useful question was no longer ‘what can AI generate?’ but ‘which decisions are clear enough to delegate safely?’ It could extend an explicit pattern. It could not redefine foundations, change the public API or make accessibility decisions without review."], points: [["Find","Spot repeated patterns and possible drift"],["Prepare","Draft documentation and implementation starting points"],["Check","Compare Figma, tokens and Storybook before release"],["Stop","Return foundation, API and accessibility decisions to a person"]] },
        { tone: "light", layout: "proof", eyebrow: "How the team used it", title: "The system stopped belonging to one designer.", body: ["By the end, three product designers and two engineers were using the library in day-to-day product work. Foundations, component decisions and documentation had moved out of individual files and into places everyone could inspect and question.", "It is still being used after my direct involvement. For me, that is the strongest result: the team can extend the product without needing me to return and explain the original decisions."], points: [["5 people","3 product designers · 2 engineers"],["Shared decisions","Design and Engineering review changes together"],["Still in use","The library remains part of the product workflow"]] },
        { tone: "dark", layout: "governance", eyebrow: "Keeping it healthy", title: "We made maintenance part of the team’s routine.", body: ["I introduced a weekly Design and Engineering review, gave each layer a clear owner and added release checks for parity between tokens, Figma and Storybook. Automation could prepare the work and flag inconsistencies. A person still approved any change that affected foundations, the public API or accessibility."] },
        { tone: "dark", layout: "results", eyebrow: "What improved — and what broke", title: "", body: ["The numbers were useful, but the failures taught me more. A parity check uncovered four brand scales that had quietly drifted apart. Poor context produced quick but inconsistent output. A version restore forced us to rebuild part of the consolidation. AI made good execution faster, and bad execution faster too."], metrics: [["28,000+","Instances audited"],["55 → 38","Component concepts"],["45 → <2 min","Documentation time"]] },
        { tone: "green", layout: "reframe", title: "The goal was never consistency. It was continuity.", body: ["Tools change. The system preserves the decisions that matter."] }
      ]}
    ]
  },
  {
    slug: "tap-mindset", number: "03", title: "TAP Mindset — Product Redesign /", shortTitle: "TAP Mindset",
    strapline: "Turning one feature-led product into three role-based experiences.",
    problem: "One feature-led product was serving three jobs with overlapping paths.",
    complexity: "Role-specific onboarding, shared capabilities and progressive personalisation.",
    ownership: "Led product architecture and the 12-month redesign with design and engineering.", outcome: "Reduced decisions before a first session by 38%.", tags: ["Product design", "Sports"], accent: "#e5f4d6",
    cover: "/media/tap-mindset-product-cover.png", hero: "/media/8vYUA69ov7JIByTeoOntKRg1Bb4.png",
    role: "Lead Product Designer", context: "Product Design ×2 · Engineering ×2", timeline: "12 months",
    meta: [["Role:","Lead Product Designer · Product direction"],["Team:","Product Designers ×2 · Engineers ×2"],["Stack:","Figma · Notion · iOS-first product"],["My ownership:","Led product architecture, direction, critique and final design decisions"]],
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
        { tone: "light", layout: "feature", eyebrow: "What I reviewed", title: "The product had grown one feature at a time.", body: ["I mapped navigation, onboarding and the recurring journeys for mental coaches, coaches and athletes. The same capabilities appeared under different labels, while role-specific actions competed inside shared flows."] },
        { tone: "light", layout: "business", eyebrow: "What the review exposed", title: "Each addition increased the number of decisions the product had to explain.", body: ["For users, that meant unclear starting points and inconsistent interactions. For the team, it meant more exceptions, duplicated design decisions and increasing divergence between design and implementation."] },
        { tone: "dark", layout: "compact", title: "The evidence pointed to one structural problem.", body: [], points: [["Navigation","Capabilities grouped by feature, not by user goal"],["Roles","Shared functions mixed with role-specific responsibilities"],["Interaction","Equivalent actions behaved differently across flows"],["Scale","Every new feature created another exception to maintain"]], signals: [["Observation","Feature-led architecture"],["Decision","Organise around role and intent"],["Design rule","One clear path, depth when needed"]] },
        { tone: "blue", layout: "reframe", title: "The brief changed: reduce decisions without reducing agency.", body: [] }
      ]},
      { number: "02", title: "Designing the system", thesis: "Four principles turned a broad redesign into a decision system the team could use across flows.", tone: "light", sections: [
        { tone: "light", layout: "principles", title: "", body: [], points: [["01","Clarity over density"],["02","Design for momentum"],["03","Intent-based structure"],["04","Consistency at scale"]] },
        { tone: "light", layout: "feature", title: "One product. Three different jobs to be done.", body: ["Mapping capabilities by role exposed where the experience should be shared, where it needed to diverge and which responsibilities were creating unnecessary overlap."], roleMap: true },
        { tone: "lavender", layout: "feature", eyebrow: "The first bet", title: "Activation before personalisation.", body: ["We shortened onboarding and delayed personalisation until after the first meaningful session. The trade-off was deliberate: less tailoring upfront, more momentum when motivation was highest."], points: [["Before","Personalise first"],["Decision","Reach value sooner"],["After","Personalise progressively"]] },
        { tone: "green", layout: "split", eyebrow: "AI in the process", title: "Rules before generation.", body: ["The product architecture and four principles were defined without AI. Once stable, they became context for AI-assisted flow exploration, edge-case expansion and implementation-ready prototypes. I used the system to constrain output, then reviewed every proposal against role intent, accessibility and buildability."], statement: "AI accelerated alternatives. It did not decide what the product should be.", links: [["→ Read the Design System case study", "/projects/tap-mindset-ds"],["↗ Explore Storybook", "https://deboramoratalla-lab.github.io/design-system-showcase/?path=/story/welcome-start-here--start-here"]] }
      ]},
      { number: "03", title: "Building the experience", thesis: "The interface shifted from disconnected tools to a continuous rhythm: prepare, train, reflect and return.", tone: "dark", sections: [
        { tone: "dark", layout: "feature", title: "One clear path, with depth available when needed.", body: ["Daily actions and long-term progress became distinct but connected. Navigation communicated what came next, while progressive disclosure kept exploratory routes available without making them compete with the primary task."], media: "/media/tap-product/before-after-foundations.png" },
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
    strapline: "An autonomous commuting agent that knows when to act — and when to wait.",
    problem: "A narrow top-up brief hid the larger burden of managing a changing commute.",
    complexity: "Goal protection, proactive suggestions, consent and uncertain network conditions.",
    ownership: "Defined the autonomy model, journey logic and interaction prototype.", outcome: "Validated three trust-critical moments across 12 commuting scenarios.", tags: ["Agentic design", "Mobility"], accent: "#ffe9ca",
    cover: "/media/fluxy-cover.png", hero: "/media/2b7YNCK8WXiTCdQRa84XPV7867M.png",
    role: "Lead Product Designer", context: "Independent concept", timeline: "2026",
    meta: [["Role","Lead Product Designer · AI Product Designer"],["Team","Independent concept · End-to-end ownership"],["Stack","Figma · React prototype · Vercel"],["My ownership","Defined the autonomy model, journey logic and interaction prototype"]],
    heroLink: ["Explore the agent", "/projects/fluxy/agent"],
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
  },
  {
    slug: "civeo", number: "05", title: "Civeo — Municipal Operations /", shortTitle: "Civeo",
    strapline: "A municipal operations surface that preserves context from overview to action.",
    problem: "Teams relied on Excel and separate service views to reconstruct the state of municipal operations.",
    complexity: "Four-level navigation, editable widgets, live data states and a grounded contextual assistant.",
    ownership: "Defined the product model, information architecture, interaction rules and working POC.", outcome: "Replaced an Excel-led process with one operational surface for 15 internal workers.",
    tags: ["Product design", "Design engineering"], accent: "#bcffff",
    cover: "/media/civeo-mockup.png", hero: "/media/civeo-dashboard.png",
    role: "POC Product Designer", context: "Internal teams · municipal operations", timeline: "Exploratory POC",
    meta: [["Role", "POC Product Designer"], ["Users", "15 internal workers"], ["Stack", "HTML · CSS · JavaScript · Leaflet · Open-Meteo"], ["My ownership", "Product framing · Information architecture · Prototype"]],
    heroLink: ["Open prototype", "/civeo/index.html"],
    premise: "I turned an Excel-led service process into one readable operating surface for internal teams working with municipal diputaciones.",
    tldr: ["Four-level operational hierarchy", "Editable widget system with persistence and reset", "Explicit live, timeout and offline states", "Grounded contextual assistant"],
    chapters: []
  }
]

export const projectBySlug = Object.fromEntries(projects.map((project) => [project.slug, project]))
