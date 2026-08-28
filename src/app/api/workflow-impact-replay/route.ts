import { NextRequest, NextResponse } from "next/server"

const workflowUrl = "https://deboramoratalla.app.n8n.cloud/webhook/workflow-impact-replay"
const scenarios = ["safe", "changed", "broken"] as const
type Scenario = (typeof scenarios)[number]
const scenarioSet = new Set<string>(scenarios)
const agentDecisions: Record<Scenario, { decision: string; summary: string }> = {
  safe: {
    decision: "Publish agent change",
    summary: "The revised system message preserves responses, tool calls and escalation boundaries.",
  },
  changed: {
    decision: "Request an agent behaviour review",
    summary: "The new tool instructions introduce CRM writes that require human approval.",
  },
  broken: {
    decision: "Fix model credential before publishing",
    summary: "The proposed chat model credential cannot execute representative conversations.",
  },
}

export async function GET(request: NextRequest) {
  const requestedScenario = request.nextUrl.searchParams.get("scenario") ?? "changed"
  const scenario: Scenario = scenarioSet.has(requestedScenario) ? requestedScenario as Scenario : "changed"

  try {
    const startedAt = performance.now()
    const response = await fetch(`${workflowUrl}?scenario=${scenario}`, { cache: "no-store" })
    if (!response.ok) return NextResponse.json({ error: "Replay failed" }, { status: 502 })
    const workflowResult = await response.json()
    return NextResponse.json({
      ...workflowResult,
      ...agentDecisions[scenario],
      scenario,
      transport: "n8n webhook",
      proxyLatencyMs: Math.round(performance.now() - startedAt),
    }, { headers: { "Cache-Control": "no-store" } })
  } catch {
    return NextResponse.json({ error: "Replay unavailable" }, { status: 502 })
  }
}
