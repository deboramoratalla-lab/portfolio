"use client"

import Link from "next/link"
import { FormEvent, useCallback, useEffect, useRef, useState } from "react"
import { ArrowUpRight } from "@/components/arrow-up-right"

type Evidence = { label: string; href: string }
type AgentAnswer = { title: string; body: string; evidence: Evidence[]; source?: "rules" | "ai" }

const prompts = [
  "I am hiring for a senior product role. What should I evaluate first?",
  "As a Head of Product, show me evidence that Debora can handle complex B2B workflows",
  "Show me the evidence of seniority, ownership and decision-making",
  "What should I probe in an interview with Debora?",
]

const answers = {
  hiring: { title: "Assess judgment first, then craft.", body: "For a senior product role, start with how Debora frames ambiguous problems, makes trade-offs visible and turns messy constraints into systems a team can keep using. The strongest hiring signal is not one polished UI; it is the way Board moved from a screen request into a reusable coordination model for roles, regions and agencies.", evidence: [{ label: "Board · problem framing", href: "/projects/saas#chapter-01" }, { label: "Board · reusable rules", href: "/projects/saas#chapter-03" }, { label: "TAP Mindset · product leadership", href: "/projects/tap-mindset#chapter-04" }] },
  headProduct: { title: "For a Head of Product, the signal is operating leverage.", body: "Debora’s best work helps teams make better product decisions repeatedly: clearer workflows, shared rules, reduced concept sprawl and product architecture that can scale across roles. That matters if you need a designer who can work upstream with Product and Engineering, not only execute screens downstream.", evidence: [{ label: "Enterprise workflow complexity", href: "/projects/saas" }, { label: "Design system continuity", href: "/projects/tap-mindset-ds" }, { label: "Role-based product architecture", href: "/projects/tap-mindset#chapter-02" }] },
  impact: { title: "Look for measurable simplification.", body: "The clearest impact is where complexity was reduced without flattening the product. Board created a rule system for SUEZ’s FY2026 budgeting cycle. TAP Design System reduced 55 concepts to 38 and cut a documentation task from 45 minutes to under two. Those are useful signals for recruiters because they connect design work to team speed and product clarity.", evidence: [{ label: "Board · adopted workflow rules", href: "/projects/saas#chapter-03" }, { label: "TAP DS · measurable system outcomes", href: "/projects/tap-mindset-ds#chapter-02" }] },
  collaboration: { title: "She works where Product, Design and Engineering meet.", body: "The portfolio is strongest when Debora is turning unclear product intent into shared decisions: naming the real problem, defining reusable rules, documenting behavior and staying close enough to code for the system to survive implementation. That is the collaboration signal a Head of Product usually wants to see.", evidence: [{ label: "Board · shared operating model", href: "/projects/saas#chapter-03" }, { label: "TAP DS · design and code together", href: "/projects/tap-mindset-ds" }, { label: "Tools in context", href: "/#tools" }] },
  judgment: { title: "Her judgment shows in what gets constrained.", body: "Debora’s work is not presented as more screens or more ideas. It is about deciding what the product should make explicit, what should become a rule and what should stay under human control. That shows up in Board’s rejected paths, TAP’s role-based architecture and Fluxy’s autonomy boundaries.", evidence: [{ label: "Board · what did not ship", href: "/projects/saas#chapter-02" }, { label: "TAP Mindset · role architecture", href: "/projects/tap-mindset#chapter-02" }, { label: "Fluxy · autonomy boundaries", href: "/projects/fluxy#chapter-03" }] },
  seniority: { title: "The seniority signal is ownership of ambiguity.", body: "The strongest evidence is her ability to move before the brief is clean: reframe the problem, align stakeholders, define decision rules and leave the team with a system rather than a one-off deliverable. That is closer to product leadership than interface production.", evidence: [{ label: "Board · from UI request to product model", href: "/projects/saas#chapter-01" }, { label: "TAP Mindset · 12-month redesign", href: "/projects/tap-mindset#chapter-04" }, { label: "TAP DS · system ownership", href: "/projects/tap-mindset-ds" }] },
  interview: { title: "Probe the edges, not the portfolio story.", body: "A useful interview should test how she makes trade-offs under pressure: which constraint she would protect, how she handles stakeholder conflict, when a system is too heavy, and where AI should not act autonomously. The case studies give enough evidence to ask precise follow-ups instead of generic portfolio questions.", evidence: [{ label: "Ask about Board trade-offs", href: "/projects/saas#chapter-02" }, { label: "Ask about design system maintenance", href: "/projects/tap-mindset-ds#chapter-02" }, { label: "Ask about AI boundaries", href: "/projects/fluxy#chapter-03" }] },
  enterprise: { title: "Start with Board.", body: "This is the clearest view of how Debora thinks under complexity. A request to improve a UI became a coordination model for three roles, 24 regions and 186 agencies — then a reusable rule system adopted for SUEZ’s FY2026 budgeting cycle.", evidence: [{ label: "See how the brief was reframed", href: "/projects/saas#chapter-01" }, { label: "See the rule system", href: "/projects/saas#chapter-03" }] },
  leadership: { title: "Look for the decisions, not the deliverables.", body: "Debora’s leadership shows up in the work she makes possible: naming the real problem, aligning people around shared rules and making trade-offs explicit enough for Product, Design and Engineering to move together.", evidence: [{ label: "A 12-month product redesign", href: "/projects/tap-mindset#chapter-04" }, { label: "The choices Board did not ship", href: "/projects/saas#chapter-02" }] },
  ai: { title: "AI speeds up the work. Judgment still sets the direction.", body: "Debora uses AI for audits, documentation, edge cases and implementation — the repetitive work that slows a system down. Product intent, accessibility, public APIs and autonomy boundaries remain deliberate human decisions.", evidence: [{ label: "AI inside a coded design system", href: "/projects/tap-mindset-ds#chapter-02" }, { label: "Designing responsible autonomy", href: "/projects/fluxy#chapter-03" }] },
  systems: { title: "A system matters when the team can keep it alive.", body: "TAP connects foundations, code, Storybook and Figma without creating another product to maintain. The revealing numbers are not component counts: 55 concepts became 38, and a 45-minute documentation task dropped below two.", evidence: [{ label: "Read the Design System case", href: "/projects/tap-mindset-ds" }, { label: "Open the live Storybook", href: "https://deboramoratalla-lab.github.io/design-system-showcase/?path=/story/welcome-start-here--start-here" }] },
  agentic: { title: "Fluxy is about knowing when the product should disappear.", body: "The agent monitors quietly, prepares the next decision and steps forward only when it can help. Anything consequential — payment, disruption or a change of goal — stays visible and under the passenger’s control.", evidence: [{ label: "See the autonomy model", href: "/projects/fluxy#chapter-02" }, { label: "See it tested in the prototype", href: "/projects/fluxy#chapter-04" }] },
  product: { title: "TAP Mindset shows the product architecture work.", body: "Debora moved a fragmented, feature-led platform into three role-based experiences. The redesign gets people to value before asking for personalisation, then lets the product learn progressively over time.", evidence: [{ label: "See the product reframe", href: "/projects/tap-mindset#chapter-01" }, { label: "See the three-role architecture", href: "/projects/tap-mindset#chapter-02" }] },
  career: { title: "Her path crosses product, systems and engineering.", body: "Debora is a Senior Product Designer specialising in complex B2B products, design systems and AI. She has 8+ years across enterprise software, retail and entertainment. She currently owns end-to-end product design at Board International; before that she led independent product work, redesigned e-commerce at Leroy Merlin, shaped digital experiences for Netflix and worked on enterprise analytics at BICG.", evidence: [{ label: "See her enterprise work", href: "/projects/saas" }, { label: "See her product leadership", href: "/projects/tap-mindset" }] },
  tools: { title: "She designs close to the material of the product.", body: "Her core stack spans Figma, Storybook and Tokens Studio; React, Next.js, TypeScript and Tailwind; Claude, the OpenAI API, MCP and Cursor; plus GitHub, VS Code and Vercel. The point is not the list — it is being able to move from product intent to a production-aware solution.", evidence: [{ label: "See the tools in context", href: "/#tools" }, { label: "See design and code working together", href: "/projects/tap-mindset-ds" }] },
  languages: { title: "She works across languages as well as disciplines.", body: "Debora speaks Spanish natively, works professionally in English at C1 level and holds B2 German certification.", evidence: [{ label: "More about Debora", href: "/#about" }] },
  education: { title: "Her background started beyond the screen.", body: "Debora studied Interior Design and Human Resources before specialising in UX/UI at IMMUNE and later in design tokens. Her training covers research, interaction and information architecture, interface design, prototyping, implementation and user testing. That mix still shows in the work: spatial clarity, systems thinking and attention to how people organise around a product.", evidence: [{ label: "See how she works", href: "/#practice" }, { label: "See the systems work", href: "/projects/tap-mindset-ds" }] },
  community: { title: "Design has also been a way to make everyday life better.", body: "Before moving fully into digital product design, Debora volunteered with Tengo Hogar, helping refurbish homes for people without resources. She also won first prize in a visual-merchandising competition organised by Nuevo Estilo and Jardín de Serrano. Both belong to an earlier chapter, but they explain the same instinct: make complex or difficult environments feel clearer and more humane.", evidence: [{ label: "More about Debora", href: "/#about" }, { label: "See her working principles", href: "/#practice" }] },
  tour: { title: "Four projects. Ninety seconds. Start here.", body: "Board shows the reframe. TAP Design System shows systems and AI in practice. TAP Mindset shows product architecture and leadership. Fluxy shows how Debora thinks about responsible autonomy.", evidence: [{ label: "Board · Frame the right problem", href: "/projects/saas#chapter-01" }, { label: "TAP DS · Build for continuity", href: "/projects/tap-mindset-ds#chapter-02" }, { label: "TAP Mindset · Lead the reframe", href: "/projects/tap-mindset#chapter-04" }, { label: "Fluxy · Bound autonomy", href: "/projects/fluxy#chapter-03" }] },
} satisfies Record<string, AgentAnswer>

function answerQuestion(question: string): AgentAnswer {
  const q = question.toLowerCase()
  if (/hiring|hire|recruiter|contrat|senior product role|evaluate first|fit/.test(q)) return answers.hiring
  if (/head of product|product leader|operating leverage|b2b|complex b2b/.test(q)) return answers.headProduct
  if (/impact|business|proof|measurable|outcome|evidence/.test(q)) return answers.impact
  if (/pm|engineer|engineering|collabor|cross-functional|stakeholder/.test(q)) return answers.collaboration
  if (/judgment|judgement|craft|visual execution|beyond visual|trade-off|trade off/.test(q)) return answers.judgment
  if (/seniority|ownership|decision-making|decision making|how senior/.test(q)) return answers.seniority
  if (/risk|gap|probe|interview|question/.test(q)) return answers.interview
  if (/90|tour|recorrido|quick|rápid/.test(q)) return answers.tour
  if (/enterprise|suez|board|workflow|complex|complej/.test(q)) return answers.enterprise
  if (/lead|senior|stakeholder|collabor|hire|hiring|contrat/.test(q)) return answers.leadership
  if (/\bai\b|artificial|automation|automat|agentic process/.test(q)) return answers.ai
  if (/system|storybook|component|code|figma|token/.test(q)) return answers.systems
  if (/agent|autonomy|autonom|fluxy|mobility|commut/.test(q)) return answers.agentic
  if (/product|onboarding|role|athlete|coach|mindset/.test(q)) return answers.product
  if (/career|background|experience|years|cv|resume|board international|leroy|netflix|bicg|freelance/.test(q)) return answers.career
  if (/tools|stack|react|next|typescript|tailwind|cursor|github|vercel|mcp|claude/.test(q)) return answers.tools
  if (/language|spanish|english|german|idioma|ingl[eé]s|alem[aá]n/.test(q)) return answers.languages
  if (/education|study|studied|degree|interior|human resources|formaci[oó]n|estudi/.test(q)) return answers.education
  if (/volunteer|community|award|prize|tengo hogar|premio|voluntari/.test(q)) return answers.community
  return { title: "Tell me what you need to assess.", body: "Debora works best where product architecture, systems and responsible automation overlap. Pick the lens closest to your role and I’ll take you to the evidence — not just the polished screens.", evidence: [{ label: "Complex enterprise workflows", href: "/projects/saas" }, { label: "Design systems & AI", href: "/projects/tap-mindset-ds" }, { label: "Product leadership", href: "/projects/tap-mindset" }, { label: "Agentic product design", href: "/projects/fluxy" }] }
}

export function PortfolioAgent() {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState<AgentAnswer | null>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const ask = useCallback(async (value: string) => {
    const fallback = answerQuestion(value)
    setQuestion(value)
    setAnswer(fallback)
    setLoading(true)
    try {
      const response = await fetch("/api/portfolio-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: value, fallback }),
      })
      if (!response.ok) return
      const data = await response.json() as { answer?: AgentAnswer; configured?: boolean }
      if (data.answer?.title && data.answer?.body && data.configured) setAnswer({ ...data.answer, source: "ai" })
    } catch {
      // The local rules answer remains available when the external model is not configured.
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => {
    const show = (event: Event) => {
      setOpen(true)
      const prompt = (event as CustomEvent<string>).detail
      if (prompt) ask(prompt)
    }
    window.addEventListener("open-portfolio-agent", show)
    return () => window.removeEventListener("open-portfolio-agent", show)
  }, [ask])
  useEffect(() => { if (open) window.setTimeout(() => inputRef.current?.focus(), 180) }, [open])
  const submit = (event: FormEvent) => { event.preventDefault(); if (question.trim()) ask(question.trim()) }

  return <>
    {open && <div className="agent-shell" role="dialog" aria-modal="true" aria-label="Ask Debora about her work">
      <button className="agent-backdrop" aria-label="Close Ask Debora" onClick={() => setOpen(false)} />
      <aside className="agent-panel">
        <header><div><span>A guided way in</span><strong>Find the right work</strong></div><button onClick={() => setOpen(false)} aria-label="Close">Close</button></header>
        <div className="agent-body">{!answer ? <div className="agent-intro"><p>Tell me what you need to assess. I’ll route you like a recruiter or Head of Product would: seniority, impact, judgment, collaboration, systems or AI boundaries.</p><div>{prompts.map(prompt => <button key={prompt} onClick={() => ask(prompt)}>{prompt}</button>)}</div></div> : <div className="agent-answer" aria-live="polite"><span>{loading ? "Checking the evidence" : answer.source === "ai" ? "AI answer · portfolio-grounded" : "Rules answer · portfolio-grounded"}</span><h2>{answer.title}</h2><p>{answer.body}</p><nav>{answer.evidence.map(item => <Link key={item.label} href={item.href} onClick={() => setOpen(false)}>{item.label}<ArrowUpRight /></Link>)}</nav><button className="agent-reset" onClick={() => { setAnswer(null); setQuestion("") }}>Try another lens</button></div>}</div>
        <form onSubmit={submit}><input ref={inputRef} value={question} onChange={event => setQuestion(event.target.value)} placeholder="What do you want to understand?" aria-label="Question about Debora's portfolio" /><button type="submit" aria-label="Ask"><ArrowUpRight /></button></form>
        <footer>Grounded in the published case studies, Debora’s CV and public LinkedIn profile.</footer>
      </aside>
    </div>}
  </>
}
