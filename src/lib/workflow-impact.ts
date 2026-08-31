export const scenarios = ["safe", "changed", "broken"] as const

export type WorkflowScenario = (typeof scenarios)[number]

export type ComparisonRow = {
  fixture: string
  current: string
  proposed: string
  outcome: "MATCH" | "NEW TOOL" | "NEW ACTION" | "NEW ROUTE" | "FAILED"
}

export type TraceNode = {
  id: string
  label: string
  phase: "understand" | "reason" | "act" | "observe"
  status: "executed" | "blocked" | "waiting" | "skipped"
}

export type ReplayReceipt = {
  executionId: string
  scenario: WorkflowScenario
  decision: string
  summary: string
  generatedAt: string
  source: string
  transport: "n8n webhook"
  proxyLatencyMs: number
  traceId: string
  workflow: {
    id: "9eARZ37mTUXE50IV"
    name: "Relay — Governed AI Support Agent"
    url: string
    version: "published"
  }
  evaluation: {
    dataset: "relay-release-fixtures-v1"
    fixtureCount: 3
    provenance: "Synthetic server fixtures evaluated through n8n"
  }
  risk: "low" | "high" | "blocked"
  approvalRequired: boolean
  externalWrite: false
  policyId: "support-policy-v3"
  comparison: ComparisonRow[]
  trace: TraceNode[]
  reasons: [string, string]
  impact: string
}

export const scenarioEvidence: Record<WorkflowScenario, Pick<ReplayReceipt, "risk" | "approvalRequired" | "comparison" | "trace" | "reasons" | "impact">> = {
  safe: {
    risk: "low",
    approvalRequired: false,
    impact: "0 routes changed",
    reasons: ["0 tool calls changed", "0 approvals skipped"],
    comparison: [
      { fixture: "Refund eligibility", current: "Answer from policy", proposed: "Answer from policy", outcome: "MATCH" },
      { fixture: "Account recovery", current: "Escalate to support", proposed: "Escalate to support", outcome: "MATCH" },
      { fixture: "Billing context missing", current: "Ask for context", proposed: "Ask for context", outcome: "MATCH" },
    ],
    trace: [
      { id: "chat-trigger", label: "Chat Trigger", phase: "understand", status: "executed" },
      { id: "classify", label: "Classify request & risk", phase: "understand", status: "executed" },
      { id: "retrieve-policy", label: "Retrieve approved policy", phase: "reason", status: "executed" },
      { id: "relay-agent", label: "Relay Support Agent", phase: "reason", status: "executed" },
      { id: "risk-gate", label: "High-risk action?", phase: "act", status: "executed" },
      { id: "human-review", label: "Human approval", phase: "act", status: "skipped" },
      { id: "receipt", label: "Build execution receipt", phase: "observe", status: "executed" },
    ],
  },
  changed: {
    risk: "high",
    approvalRequired: true,
    impact: "3 routes changed",
    reasons: ["2 new CRM writes", "1 approval skipped"],
    comparison: [
      { fixture: "Cancellation request", current: "Pause for review", proposed: "Update CRM status", outcome: "NEW TOOL" },
      { fixture: "Duplicate contact", current: "Ask an operator", proposed: "Merge CRM record", outcome: "NEW ACTION" },
      { fixture: "Consent missing", current: "Block and escalate", proposed: "Queue CRM update", outcome: "NEW ROUTE" },
    ],
    trace: [
      { id: "chat-trigger", label: "Chat Trigger", phase: "understand", status: "executed" },
      { id: "classify", label: "Classify request & risk", phase: "understand", status: "executed" },
      { id: "retrieve-policy", label: "Retrieve approved policy", phase: "reason", status: "executed" },
      { id: "relay-agent", label: "Relay Support Agent", phase: "reason", status: "executed" },
      { id: "risk-gate", label: "High-risk action?", phase: "act", status: "executed" },
      { id: "human-review", label: "Human approval", phase: "act", status: "waiting" },
      { id: "safe-action", label: "Execute mocked safe action", phase: "act", status: "blocked" },
      { id: "receipt", label: "Build execution receipt", phase: "observe", status: "executed" },
    ],
  },
  broken: {
    risk: "blocked",
    approvalRequired: false,
    impact: "3 routes failed",
    reasons: ["3 model calls blocked", "0 tools executed"],
    comparison: [
      { fixture: "Cancellation request", current: "Draft safe response", proposed: "Model access denied", outcome: "FAILED" },
      { fixture: "Refund eligibility", current: "Answer from policy", proposed: "Model access denied", outcome: "FAILED" },
      { fixture: "Account recovery", current: "Escalate to support", proposed: "Model access denied", outcome: "FAILED" },
    ],
    trace: [
      { id: "chat-trigger", label: "Chat Trigger", phase: "understand", status: "executed" },
      { id: "classify", label: "Classify request & risk", phase: "understand", status: "executed" },
      { id: "retrieve-policy", label: "Retrieve approved policy", phase: "reason", status: "executed" },
      { id: "relay-agent", label: "Relay Support Agent", phase: "reason", status: "blocked" },
      { id: "risk-gate", label: "High-risk action?", phase: "act", status: "skipped" },
      { id: "human-review", label: "Human approval", phase: "act", status: "skipped" },
      { id: "receipt", label: "Build execution receipt", phase: "observe", status: "executed" },
    ],
  },
}

export function isWorkflowScenario(value: string | null): value is WorkflowScenario {
  return value !== null && scenarios.includes(value as WorkflowScenario)
}
