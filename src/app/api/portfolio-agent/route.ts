import { NextResponse } from "next/server"

type Evidence = { label: string; href: string }
type AgentAnswer = { title: string; body: string; evidence: Evidence[]; probe?: string; source?: "rules" | "ai" }

const portfolioContext = `
Debora Moratalla is a product designer focused on complex B2B products, design systems and AI.
Audience: recruiters and Heads of Product assessing seniority, product judgment, systems thinking, collaboration and responsible AI.

Evidence map:
- Board International / SUEZ: complex enterprise workflow. A UI request became a coordination model for three roles, 24 regions and 186 agencies, then a reusable rule system for SUEZ FY2026 budgeting. Useful for product judgment, complexity, business impact and collaboration.
- TAP Design System: connects foundations, code, Storybook and Figma. 55 concepts became 38. A 45-minute documentation task dropped below two minutes. Useful for design systems, systems ownership, design-code continuity and team adoption.
- TAP Mindset: product architecture and leadership. A fragmented platform became three role-based experiences. Useful for seniority, product architecture and collaboration with product teams.
- Fluxy: agentic mobility concept. Autonomy is bounded: the product monitors quietly, prepares decisions and asks for approval on consequential actions. Useful for AI boundaries and responsible autonomy.

Useful links:
- /projects/saas#chapter-01 Board problem framing
- /projects/saas#chapter-02 Board trade-offs
- /projects/saas#chapter-03 Board rule system
- /projects/tap-mindset-ds TAP Design System
- /projects/tap-mindset#chapter-02 TAP product architecture
- /projects/tap-mindset#chapter-04 TAP product leadership
- /projects/fluxy#chapter-03 Fluxy AI boundaries
- /#tools tools and implementation context
`

const allowedEvidence = [
  { label: "Board · problem framing", href: "/projects/saas#chapter-01" },
  { label: "Board · trade-offs", href: "/projects/saas#chapter-02" },
  { label: "Board · rule system", href: "/projects/saas#chapter-03" },
  { label: "TAP Design System", href: "/projects/tap-mindset-ds" },
  { label: "TAP product architecture", href: "/projects/tap-mindset#chapter-02" },
  { label: "TAP product leadership", href: "/projects/tap-mindset#chapter-04" },
  { label: "Fluxy · AI boundaries", href: "/projects/fluxy#chapter-03" },
  { label: "Tools in context", href: "/#tools" },
]

function coerceEvidence(items: unknown, fallback: Evidence[]): Evidence[] {
  if (!Array.isArray(items)) return fallback
  const allowed = new Map(allowedEvidence.map(item => [item.href, item]))
  const evidence = items
    .map(item => {
      if (!item || typeof item !== "object") return null
      const href = "href" in item && typeof item.href === "string" ? item.href : ""
      return allowed.get(href) ?? null
    })
    .filter((item): item is Evidence => Boolean(item))
  return evidence.length ? evidence.slice(0, 4) : fallback
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY
  const { question, fallback, mode } = await request.json().catch(() => ({})) as { question?: string; fallback?: AgentAnswer; mode?: "quest" | "free" }

  if (!question || typeof question !== "string") {
    return NextResponse.json({ error: "Missing question" }, { status: 400 })
  }

  if (!apiKey) {
    return NextResponse.json({ answer: fallback ?? null, configured: false })
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-5.6-luna"
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      reasoning: { effort: "low" },
      input: [
        {
          role: "system",
          content: `You are the portfolio agent for Debora Moratalla. Answer as a sharp product hiring advisor for recruiters and Heads of Product. Use only the provided portfolio context. Do not invent employers, metrics, links or claims. Return strict JSON with title, body, probe and evidence. Body must be ${mode === "free" ? "80-120" : "55-90"} words. Probe is one precise interview or assessment question. Evidence must use only the allowed hrefs from the context.`,
        },
        {
          role: "user",
          content: `${portfolioContext}\n\nAllowed evidence JSON:\n${JSON.stringify(allowedEvidence)}\n\nQuestion: ${question}`,
        },
      ],
      text: {
        verbosity: "low",
        format: {
          type: "json_schema",
          name: "portfolio_answer",
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["title", "body", "probe", "evidence"],
            properties: {
              title: { type: "string" },
              body: { type: "string" },
              probe: { type: "string" },
              evidence: {
                type: "array",
                minItems: 1,
                maxItems: 4,
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: ["label", "href"],
                  properties: {
                    label: { type: "string" },
                    href: { type: "string" },
                  },
                },
              },
            },
          },
          strict: true,
        },
      },
    }),
  })

  if (!response.ok) {
    return NextResponse.json({ answer: fallback ?? null, configured: true }, { status: 200 })
  }

  const data = await response.json()
  const rawText = typeof data.output_text === "string" ? data.output_text : ""
  let parsed: AgentAnswer
  try {
    parsed = JSON.parse(rawText) as AgentAnswer
  } catch {
    return NextResponse.json({ answer: fallback ?? null, configured: true })
  }
  const answer: AgentAnswer = {
    title: parsed.title || fallback?.title || "Start with the evidence.",
    body: parsed.body || fallback?.body || "The strongest route through this portfolio is to assess problem framing, operating leverage, collaboration and responsible AI boundaries through the published case studies.",
    probe: parsed.probe || fallback?.probe,
    evidence: coerceEvidence(parsed.evidence, fallback?.evidence ?? allowedEvidence.slice(0, 3)),
    source: "ai",
  }

  return NextResponse.json({ answer, configured: true })
}
