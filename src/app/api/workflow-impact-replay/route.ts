import { NextRequest, NextResponse } from "next/server"

const workflowUrl = "https://deboramoratalla.app.n8n.cloud/webhook/workflow-impact-replay"
const scenarios = new Set(["safe", "changed", "broken"])

export async function GET(request: NextRequest) {
  const requestedScenario = request.nextUrl.searchParams.get("scenario") ?? "changed"
  const scenario = scenarios.has(requestedScenario) ? requestedScenario : "changed"

  try {
    const startedAt = performance.now()
    const response = await fetch(`${workflowUrl}?scenario=${scenario}`, { cache: "no-store" })
    if (!response.ok) return NextResponse.json({ error: "Replay failed" }, { status: 502 })
    const workflowResult = await response.json()
    return NextResponse.json({
      ...workflowResult,
      transport: "n8n webhook",
      proxyLatencyMs: Math.round(performance.now() - startedAt),
    }, { headers: { "Cache-Control": "no-store" } })
  } catch {
    return NextResponse.json({ error: "Replay unavailable" }, { status: 502 })
  }
}
