import { randomUUID } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import { isWorkflowScenario } from "@/lib/workflow-impact"

const workflowUrl = "https://deboramoratalla.app.n8n.cloud/webhook/relay-agent-release-approval"
const webhookSecret = process.env.RELAY_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const scenario = isWorkflowScenario(body?.scenario) ? body.scenario : null
  const traceId = typeof body?.traceId === "string" ? body.traceId.slice(0, 80) : null

  if (!scenario || !traceId) {
    return NextResponse.json({ error: "A valid replay receipt is required" }, { status: 400 })
  }

  if (!webhookSecret) {
    return NextResponse.json({ error: "Approval route is not configured" }, { status: 503 })
  }

  const requestId = `APR-${randomUUID().slice(0, 8).toUpperCase()}`
  const idempotencyKey = `relay-approval:${scenario}:${traceId}`
  const createdAt = new Date().toISOString()

  try {
    const response = await fetch(workflowUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Relay-Webhook-Key": webhookSecret },
      body: JSON.stringify({ scenario, traceId, requestId, idempotencyKey }),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    })
    if (!response.ok) return NextResponse.json({ error: "Approval route failed" }, { status: 502 })

    const workflowReceipt = await response.json()
    return NextResponse.json({
      ...workflowReceipt,
      requestId: workflowReceipt.requestId ?? requestId,
      idempotencyKey,
      traceId,
      scenario,
      status: workflowReceipt.status ?? "pending",
      createdAt: workflowReceipt.createdAt ?? createdAt,
      source: "Relay — Governed AI Support Agent",
      transport: "n8n webhook",
      persistence: workflowReceipt.persistence ?? "n8n Data Table",
      externalWrite: false,
    }, { headers: { "Cache-Control": "no-store" } })
  } catch {
    return NextResponse.json({ error: "Approval route unavailable" }, { status: 502 })
  }
}
