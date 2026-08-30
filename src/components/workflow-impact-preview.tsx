"use client"

import { useState } from "react"
import { IconArrowRight, IconBrain, IconCheck, IconClock, IconFileDiff, IconHierarchy, IconLockCheck, IconPlayerPlay, IconReceipt, IconSearch, IconShieldCheck, IconUserCheck, IconWebhook } from "@tabler/icons-react"
import styles from "./workflow-impact-preview.module.css"

type Version = "safe" | "changed" | "broken"
type Panel = "architecture" | "evidence"
type ReplayResult = { decision: string; generatedAt: string; source: string; proxyLatencyMs?: number }
type State = { label: string; path: string; note: string; impact: string; copy: string; recommendation: string; action: string; reasons: [string, string]; rows: [string, string, string, string][] }

const states: Record<Version, State> = {
  safe: { label: "Response policy", path: "System instructions", note: "Tone updated, permissions unchanged", impact: "0 routes changed", copy: "Responses become clearer while policy grounding, approval rules and tool access remain unchanged.", recommendation: "Ready to publish", action: "Publish change", reasons: ["0 tool calls changed", "0 approvals skipped"], rows: [["Refund eligibility", "Answer from policy", "Answer from policy", "MATCH"], ["Account recovery", "Escalate to support", "Escalate to support", "MATCH"], ["Billing context missing", "Ask for context", "Ask for context", "MATCH"]] },
  changed: { label: "CRM action", path: "Action policy", note: "External write enabled, approval removed", impact: "3 routes changed", copy: "The draft bypasses the human gate for a high-risk action. Relay should not publish this change without review.", recommendation: "Approval required", action: "Send for approval", reasons: ["2 new CRM writes", "1 approval skipped"], rows: [["Cancellation request", "Pause for review", "Update CRM status", "NEW TOOL"], ["Duplicate contact", "Ask an operator", "Merge CRM record", "NEW ACTION"], ["Consent missing", "Block and escalate", "Queue CRM update", "NEW ROUTE"]] },
  broken: { label: "AI model", path: "OpenAI credential", note: "Model connection unavailable", impact: "3 routes failed", copy: "The model cannot run. Relay must follow its fallback path and prevent every downstream action.", recommendation: "Fix before publishing", action: "Open credential", reasons: ["3 model calls blocked", "0 tools executed"], rows: [["Cancellation request", "Draft safe response", "Model access denied", "FAILED"], ["Refund eligibility", "Answer from policy", "Model access denied", "FAILED"], ["Account recovery", "Escalate to support", "Model access denied", "FAILED"]] },
}

export function WorkflowImpactPreview() {
  const [version, setVersion] = useState<Version>("changed")
  const [panel, setPanel] = useState<Panel>("architecture")
  const [result, setResult] = useState<ReplayResult | null>(null)
  const [running, setRunning] = useState(false)
  const [acted, setActed] = useState(false)
  const state = states[version]

  async function runReplay() {
    setRunning(true); setResult(null); setActed(false)
    try {
      const response = await fetch(`/api/workflow-impact-replay?scenario=${version}`)
      if (!response.ok) throw new Error("Replay unavailable")
      setResult(await response.json()); setPanel("evidence")
    } catch {
      setResult({ decision: "The replay service is temporarily unavailable.", generatedAt: "", source: "" })
    } finally { setRunning(false) }
  }

  const riskLabel = version === "safe" ? "Ready" : version === "changed" ? "Needs approval" : "Fix required"

  return <section className={styles.reviewSection} id="workflow-impact">
    <header className={styles.reviewIntro}><span>Agent release control</span><h2>Test the agent before it ships.</h2><p>Inspect the real n8n control flow, replay a proposed change and review its effect before publishing.</p></header>
    <div className={styles.reviewApp}>
      <header className={styles.reviewBar}>
        <div className={styles.productIdentity}><span className={styles.reviewLogo}><IconHierarchy size={20} /></span><span><strong>Relay agent review</strong><small>Governed AI Support Agent</small></span></div>
        <span className={styles.connectionState}><i />Published in n8n</span>
        <button type="button" onClick={runReplay} disabled={running}><IconPlayerPlay size={17} />{running ? "Running..." : "Run replay"}</button>
      </header>
      <div className={styles.reviewBody}>
        <aside className={styles.changeList}>
          <header><span>Draft changes</span><h3>Choose a scenario</h3><p>Replay the same governed agent with one controlled change.</p></header>
          <div className={styles.scenarioOptions}>{(Object.keys(states) as Version[]).map((key) => <button type="button" key={key} aria-pressed={version === key} onClick={() => { setVersion(key); setResult(null); setActed(false) }}><span className={`${styles.changeSymbol} ${styles[key]}`}><IconFileDiff size={17} /></span><span><strong>{states[key].label}</strong><small>{states[key].path}</small></span><span className={styles.changeImpact}>{states[key].impact}<IconArrowRight size={15} /></span></button>)}</div>
          <footer><IconShieldCheck size={19} /><span><strong>Shadow evaluation</strong><small>No customer data or external writes</small></span></footer>
        </aside>
        <main className={`${styles.reviewDetail} ${styles[version]}`}>
          <header className={styles.selectedChange}><div><small>Proposed change</small><h3>{state.label}</h3><p>{state.note}</p></div><div><small>Expected impact</small><strong>{state.impact}</strong></div></header>
          <section className={styles.recommendationCard}><div><span>Recommendation</span><strong><i />{riskLabel}</strong></div><h4>{state.recommendation}</h4><p>{state.copy}</p><div className={styles.reasonChips}><span>{state.reasons[0]}</span><span>{state.reasons[1]}</span></div></section>
          <div className={styles.panelTabs} role="tablist" aria-label="Review view"><button role="tab" aria-selected={panel === "architecture"} onClick={() => setPanel("architecture")}><IconHierarchy size={17} />Agent controls</button><button role="tab" aria-selected={panel === "evidence"} onClick={() => setPanel("evidence")}><IconFileDiff size={17} />Replay evidence</button></div>
          {panel === "architecture" ? <section className={styles.architecturePanel} aria-label="Published n8n agent architecture">
            <div className={styles.phase}><header><span>Understand</span><b>Classify before reasoning</b></header><div className={styles.node}><IconWebhook size={18} /><span><b>Chat Trigger</b><small>Support request</small></span></div><div className={styles.node}><IconSearch size={18} /><span><b>Classify request</b><small>Intent and risk</small></span></div></div>
            <div className={`${styles.phase} ${styles.reasonPhase}`}><header><span>Reason</span><b>Ground the agent</b></header><div className={`${styles.node} ${styles.primaryNode}`}><IconBrain size={19} /><span><b>Relay Support Agent</b><small>Reason and select a tool</small></span></div><div className={styles.dependencies}><span><b>OpenAI model</b><small>Language</small></span><span><b>Session memory</b><small>Context</small></span><span><b>Approved policy</b><small>Restricted tool</small></span></div></div>
            <div className={`${styles.phase} ${styles.safetyPhase}`}><header><span>Act safely</span><b>Limit autonomy</b></header><div className={styles.node}><IconLockCheck size={18} /><span><b>Risk gate</b><small>Block or continue</small></span></div><div className={styles.node}><IconUserCheck size={18} /><span><b>Human approval</b><small>Required for writes</small></span></div></div>
            <div className={styles.phase}><header><span>Observe</span><b>Make it auditable</b></header><div className={styles.node}><IconReceipt size={18} /><span><b>Execution receipt</b><small>Decision trace</small></span></div><div className={styles.node}><IconCheck size={18} /><span><b>Safety summary</b><small>User response</small></span></div></div>
          </section> : <section className={styles.evidencePanel} aria-label="Replay evidence"><header><div><small>Representative fixtures</small><h4>Current vs proposed behaviour</h4></div><span>{result ? "Receipt received" : "Not run yet"}</span></header><div className={styles.routeComparison}>{state.rows.map((row) => <article key={row[0]}><header><b>{row[0]}</b><em>{row[3]}</em></header><div><span><small>Current</small>{row[1]}</span><IconArrowRight size={16} /><strong><small>Proposed</small>{row[2]}</strong></div></article>)}</div>{result && <p className={styles.replayResult} role="status">{result.decision}</p>}</section>}
          <footer className={styles.reviewAction}><span><IconClock size={17} /><small>{result?.proxyLatencyMs ? `${result.proxyLatencyMs} ms through n8n` : "Ready for a synthetic replay"}</small></span><button type="button" onClick={result ? () => setActed(true) : runReplay} disabled={running || acted}>{running ? "Running replay" : acted ? <><IconCheck size={18} />Decision saved</> : result ? state.action : <><IconPlayerPlay size={18} />Test agent change</>}</button></footer>
        </main>
      </div>
    </div>
  </section>
}

export function WorkflowImpactPreviewCover() {
  return <div className="workflow-impact-cover" aria-hidden="true"><header><span>Agent impact</span><b>Preview</b></header><div><span>Before you publish</span><strong>replay its behaviour.</strong></div><footer><i /><i /><i /><b>6 changed</b></footer></div>
}
