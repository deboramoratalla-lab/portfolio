import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import { isWorkflowScenario, scenarioEvidence, type WorkflowScenario } from "@/lib/workflow-impact"

const workflowUrl = "https://deboramoratalla.app.n8n.cloud/webhook/relay-agent-release-review"
const webhookSecret = process.env.RELAY_WEBHOOK_SECRET
const agentDecisions: Record<WorkflowScenario, { decision: string; summary: string }> = {
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
  if (!webhookSecret) {
    return NextResponse.json({ error: "Replay route is not configured" }, { status: 503 })
  }

  const requestedScenario = request.nextUrl.searchParams.get("scenario") ?? "changed"
  const scenario: WorkflowScenario = isWorkflowScenario(requestedScenario) ? requestedScenario : "changed"
  const traceId = `relay-${randomUUID().slice(0, 8)}`

  try {
    const startedAt = performance.now()
    const response = await fetch(`${workflowUrl}?scenario=${scenario}&traceId=${traceId}`, {
      cache: "no-store",
      headers: { "X-Relay-Webhook-Key": webhookSecret },
      signal: AbortSignal.timeout(8_000),
    })
    if (!response.ok) return NextResponse.json({ error: "Replay failed" }, { status: 502 })
    const workflowResult = await response.json()
    return NextResponse.json({
      ...workflowResult,
      ...agentDecisions[scenario],
      ...workflowResult,
      scenario,
      reasons: scenarioEvidence[scenario].reasons,
      impact: scenarioEvidence[scenario].impact,
      transport: "n8n webhook",
      traceId,
      externalWrite: false,
      policyId: "support-policy-v3",
      workflow: {
        id: "9eARZ37mTUXE50IV",
        name: "Relay — Governed AI Support Agent",
        url: "https://deboramoratalla.app.n8n.cloud/workflow/9eARZ37mTUXE50IV",
        version: "published",
      },
      evaluation: {
        dataset: "support-agent-eval-v1",
        fixtureCount: Array.isArray(workflowResult.comparison) ? workflowResult.comparison.length : 0,
        provenance: "Synthetic support conversations evaluated through n8n with human-review-ready verdicts",
      },
      proxyLatencyMs: Math.round(performance.now() - startedAt),
    }, { headers: { "Cache-Control": "no-store" } })
  } catch {
    return NextResponse.json({ error: "Replay unavailable" }, { status: 502 })
  }
}
