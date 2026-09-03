"use client"

import { useState, type KeyboardEvent } from "react"
import { IconArrowRight, IconBrain, IconCheck, IconClock, IconExternalLink, IconFileDiff, IconHierarchy, IconLockCheck, IconPlayerPlay, IconReceipt, IconSearch, IconShieldCheck, IconUserCheck, IconWebhook } from "@tabler/icons-react"
import type { ReplayReceipt, TraceNode, WorkflowScenario } from "@/lib/workflow-impact"
import styles from "./workflow-impact-preview.module.css"

type Panel = "architecture" | "evidence"
type ApprovalReceipt = { requestId: string; executionId: string; status: "pending"; createdAt: string; persistence: string; externalWrite: false; duplicate?: boolean }
type ScenarioState = { label: string; path: string; note: string; impact: string; copy: string; recommendation: string }

const workflowUrl = "https://deboramoratalla.app.n8n.cloud/workflow/9eARZ37mTUXE50IV"
const scenarioOrder: WorkflowScenario[] = ["safe", "changed", "broken"]
const states: Record<WorkflowScenario, ScenarioState> = {
  safe: { label: "Response policy", path: "System instructions", note: "Tone updated, permissions unchanged", impact: "0 routes changed", copy: "Responses become clearer while policy grounding, approval rules and tool access remain unchanged.", recommendation: "Ready to publish" },
  changed: { label: "CRM action", path: "Action policy", note: "External write enabled, approval removed", impact: "3 routes changed", copy: "The draft bypasses the human gate for a high-risk action. Relay should not publish this change without review.", recommendation: "Approval required" },
  broken: { label: "AI model", path: "OpenAI credential", note: "Model connection unavailable", impact: "3 routes failed", copy: "The model cannot run. Relay must follow its fallback path and prevent every downstream action.", recommendation: "Fix before publishing" },
}

const phaseNodes: { phase: TraceNode["phase"]; caption: string; className: string; nodes: { id: string; label: string; detail: string; icon: typeof IconWebhook }[] }[] = [
  { phase: "understand", caption: "Classify before reasoning", className: "understandPhase", nodes: [
    { id: "chat-trigger", label: "Chat Trigger", detail: "Support request", icon: IconWebhook },
    { id: "classify", label: "Classify request & risk", detail: "Intent and risk", icon: IconSearch },
  ] },
  { phase: "reason", caption: "Ground the agent", className: "reasonPhase", nodes: [
    { id: "retrieve-policy", label: "Retrieve approved policy", detail: "Restricted knowledge", icon: IconSearch },
    { id: "relay-agent", label: "Relay Support Agent", detail: "Model · memory · tool", icon: IconBrain },
  ] },
  { phase: "act", caption: "Limit autonomy", className: "safetyPhase", nodes: [
    { id: "risk-gate", label: "High-risk action?", detail: "Deterministic gate", icon: IconLockCheck },
    { id: "human-review", label: "Human approval", detail: "Required for writes", icon: IconUserCheck },
    { id: "safe-action", label: "Mocked safe action", detail: "No external write", icon: IconShieldCheck },
  ] },
  { phase: "observe", caption: "Make it auditable", className: "observePhase", nodes: [
    { id: "receipt", label: "Execution receipt", detail: "Decision trace", icon: IconReceipt },
  ] },
]

export function WorkflowImpactPreview() {
  const [version, setVersion] = useState<WorkflowScenario>("changed")
  const [panel, setPanel] = useState<Panel>("architecture")
  const [result, setResult] = useState<ReplayReceipt | null>(null)
  const [approval, setApproval] = useState<ApprovalReceipt | null>(null)
  const [running, setRunning] = useState(false)
  const [approving, setApproving] = useState(false)
  const [error, setError] = useState("")
  const state = states[version]

  function chooseScenario(next: WorkflowScenario) {
    setVersion(next); setResult(null); setApproval(null); setError("")
  }

  function moveScenario(event: KeyboardEvent<HTMLButtonElement>, current: WorkflowScenario) {
    if (!event.key.startsWith("Arrow")) return
    event.preventDefault()
    const currentIndex = scenarioOrder.indexOf(current)
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1
    const next = scenarioOrder[(currentIndex + direction + scenarioOrder.length) % scenarioOrder.length]
    chooseScenario(next)
    document.getElementById(`scenario-${next}`)?.focus()
  }

  function moveTab(event: KeyboardEvent<HTMLButtonElement>, current: Panel) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
    event.preventDefault()
    const next = current === "architecture" ? "evidence" : "architecture"
    setPanel(next)
    document.getElementById(`review-tab-${next}`)?.focus()
  }

  async function runReplay() {
    setRunning(true); setResult(null); setApproval(null); setError("")
    try {
      const response = await fetch(`/api/workflow-impact-replay?scenario=${version}`)
      if (!response.ok) throw new Error("Replay unavailable")
      setResult(await response.json()); setPanel("evidence")
    } catch {
      setError("The n8n replay is temporarily unavailable. Your selected scenario has been preserved.")
    } finally { setRunning(false) }
  }

  async function requestApproval() {
    if (!result) return
    setApproving(true); setError("")
    try {
      const response = await fetch("/api/workflow-impact-approval", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ scenario: version, traceId: result.traceId }) })
      if (!response.ok) throw new Error("Approval unavailable")
      setApproval(await response.json())
    } catch {
      setError("The approval route could not be reached. No request or external write was created.")
    } finally { setApproving(false) }
  }

  const riskLabel = version === "safe" ? "Ready" : version === "changed" ? "Needs approval" : "Fix required"
  const traceById = new Map(result?.trace.map((node) => [node.id, node.status]))

  return <section className={styles.reviewSection} id="workflow-impact">
    <header className={styles.reviewIntro}><span>Agent quality loop</span><h2>Test the support agent before it ships.</h2><p>Replay realistic customer conversations, inspect the agent’s trajectory and turn every failure into a reviewable quality signal.</p></header>
    <div className={styles.reviewApp}>
      <header className={styles.reviewBar}>
        <div className={styles.productIdentity}><span className={styles.reviewLogo}><IconHierarchy size={20} /></span><span><strong>Relay agent review</strong><small>Governed AI Support Agent</small></span></div>
        <span className={styles.connectionState}><i />Published workflow · 9eARZ…50IV</span>
        <button type="button" onClick={runReplay} disabled={running} aria-describedby="replay-status"><IconPlayerPlay size={17} />{running ? "Running through n8n…" : "Run replay"}</button>
      </header>
      <div className={styles.reviewBody}>
          <aside className={styles.changeList}>
          <header><span>Evaluation setup</span><h3>Scenario to test</h3><p>Choose one synthetic support fixture. The evaluation never touches customer data.</p></header>
          <div className={styles.scenarioOptions} role="radiogroup" aria-label="Scenario to replay">{scenarioOrder.map((key) => <button id={`scenario-${key}`} className={styles[key]} type="button" role="radio" key={key} aria-checked={version === key} tabIndex={version === key ? 0 : -1} onKeyDown={(event) => moveScenario(event, key)} onClick={() => chooseScenario(key)}><span className={styles.radioMark} aria-hidden="true"><i /></span><span className={styles.changeSymbol}><IconFileDiff size={17} /></span><span className={styles.scenarioCopy}><strong>{states[key].label}</strong><small>{states[key].path}</small></span><span className={styles.changeImpact}><strong>{states[key].impact}</strong><small>{version === key ? "Selected" : "Select"}</small></span></button>)}</div>
          <footer><IconShieldCheck size={19} /><span><strong>Evidence boundaries</strong><small><b>Live</b> n8n · <b>Synthetic</b> fixtures · <b>Mocked</b> writes</small></span></footer>
        </aside>
        <main className={`${styles.reviewDetail} ${styles[version]}`}>
          <header className={styles.selectedChange}><div><small>Proposed change</small><h3>{state.label}</h3><p>{state.note}</p></div><div><small>Expected impact</small><strong>{result?.impact ?? state.impact}</strong></div></header>
          <section className={styles.recommendationCard}><div><span>Release recommendation</span><strong><i />{riskLabel}</strong></div><h4>{state.recommendation}</h4><p>{result?.summary ?? state.copy}</p>{result && <div className={styles.reasonChips}><span>{result.reasons[0]}</span><span>{result.reasons[1]}</span></div>}</section>
          <div className={styles.panelTabs} role="tablist" aria-label="Review view"><button id="review-tab-architecture" role="tab" aria-selected={panel === "architecture"} aria-controls="review-panel-architecture" tabIndex={panel === "architecture" ? 0 : -1} onKeyDown={(event) => moveTab(event, "architecture")} onClick={() => setPanel("architecture")}><IconHierarchy size={17} />Agent controls</button><button id="review-tab-evidence" role="tab" aria-selected={panel === "evidence"} aria-controls="review-panel-evidence" tabIndex={panel === "evidence" ? 0 : -1} onKeyDown={(event) => moveTab(event, "evidence")} onClick={() => setPanel("evidence")}><IconFileDiff size={17} />Replay evidence</button></div>
          {panel === "architecture" ? <section id="review-panel-architecture" role="tabpanel" aria-labelledby="review-tab-architecture" className={styles.architecturePanel}>
            {phaseNodes.map((phase) => <div key={phase.phase} className={`${styles.phase} ${styles[phase.className]}`}><header><span>{phase.phase === "act" ? "Act safely" : phase.phase}</span><b>{phase.caption}</b></header>{phase.nodes.map((node) => { const NodeIcon = node.icon; const status = traceById.get(node.id); return <div key={node.id} className={`${styles.node} ${status ? styles[`trace_${status}`] : ""}`}><NodeIcon size={18} /><span><b>{node.label}</b><small>{node.detail}</small></span>{status && <em>{status}</em>}</div> })}</div>)}
          </section> : <section id="review-panel-evidence" role="tabpanel" aria-labelledby="review-tab-evidence" className={styles.evidencePanel}><header><div><small>{result ? result.evaluation.dataset : "Representative fixtures"}</small><h4>Current vs proposed behaviour</h4></div><span>{result ? `${result.evaluation.fixtureCount} fixtures received` : "Run to load evidence"}</span></header>
            {result ? <><div className={styles.routeComparison}>{result.comparison.map((row) => <article key={row.fixture}><header><b>{row.fixture}</b><em>{row.outcome}</em></header><div><span><small>Current</small>{row.current}</span><IconArrowRight size={16} /><strong><small>Proposed</small>{row.proposed}</strong></div></article>)}</div><div className={styles.receiptPanel}><header><span><IconReceipt size={17} />Execution receipt</span><a href={result.workflow.url} target="_blank" rel="noreferrer">View workflow <IconExternalLink size={14} /></a></header><dl><div><dt>n8n execution</dt><dd>#{result.executionId}</dd></div><div><dt>Trace</dt><dd>{result.traceId}</dd></div><div><dt>Decision</dt><dd>{result.decision}</dd></div><div><dt>Risk</dt><dd>{result.risk}</dd></div><div><dt>Policy</dt><dd>{result.policyId}</dd></div><div><dt>Approval</dt><dd>{result.approvalRequired ? "Required" : "Not required"}</dd></div><div><dt>External write</dt><dd>No · mocked</dd></div><div><dt>Duration</dt><dd>{result.proxyLatencyMs} ms</dd></div></dl><p>{result.evaluation.provenance}</p></div></> : <div className={styles.evidenceEmpty}><IconPlayerPlay size={20} /><p>Run this scenario to load its server-side fixtures, n8n receipt and executed route.</p></div>}
          </section>}
          <div id="replay-status" className={styles.liveStatus} role="status" aria-live="polite">{running ? "Sending the selected fixture through the n8n webhook." : error ? error : approval ? approval.duplicate ? `Existing approval ${approval.requestId} was reused. No duplicate or CRM write was created.` : `Approval ${approval.requestId} is pending in the n8n Data Table. No CRM write was made.` : result ? `Receipt ${result.traceId} received from n8n.` : "Ready for a synthetic replay."}</div>
          <footer className={styles.reviewAction}><span><IconClock size={17} /><small>{approval ? `${approval.requestId} · n8n execution #${approval.executionId}` : result ? `${result.proxyLatencyMs} ms · n8n webhook` : "No customer data or external writes"}</small></span>{result && version === "changed" ? <button type="button" onClick={requestApproval} disabled={approving || Boolean(approval)}>{approving ? "Routing request…" : approval ? <><IconCheck size={18} />Approval requested</> : <><IconUserCheck size={18} />Request approval</>}</button> : result ? <a className={styles.actionLink} href={workflowUrl} target="_blank" rel="noreferrer">Open published workflow <IconExternalLink size={16} /></a> : <button type="button" onClick={runReplay} disabled={running}><IconPlayerPlay size={18} />Test agent change</button>}</footer>
        </main>
      </div>
    </div>
  </section>
}

export function WorkflowImpactPreviewCover() {
  return <div className="workflow-impact-cover" aria-hidden="true"><header><span>Agent impact</span><b>Preview</b></header><div><span>Before you publish</span><strong>replay its behaviour.</strong></div><footer><i /><i /><i /><b>6 changed</b></footer></div>
}
