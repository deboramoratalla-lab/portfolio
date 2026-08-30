"use client"

import { useState } from "react"
import { IconArrowRight, IconCheck, IconClock, IconFileDiff, IconHierarchy, IconPlayerPlay, IconShieldCheck, IconWebhook } from "@tabler/icons-react"
import styles from "./workflow-impact-preview.module.css"

type Version = "safe" | "changed" | "broken"
type ReplayResult = {
  scenario?: Version
  status?: string
  impact?: string
  decision: string
  summary?: string
  generatedAt: string
  source: string
  transport?: string
  proxyLatencyMs?: number
}
type State = { label: string; path: string; note: string; impact: string; title: string; copy: string; recommendation: string; action: string; confirmation: string; reasons: [string, string]; rows: [string, string, string, string][] }
const states: Record<Version, State> = {
  safe: { label: "Response policy", path: "System instructions", note: "Tone updated · permissions unchanged", impact: "0 routes changed", title: "No material side effects found.", copy: "Responses become clearer. Tool use, escalation and outcomes stay the same in every replayed conversation.", recommendation: "Ready to publish", action: "Publish change", confirmation: "Marked ready to publish. No agent was changed.", reasons: ["0 tool calls changed", "0 approvals skipped"], rows: [["Refund eligibility", "Answer from policy", "Answer from policy", "MATCH"], ["Account recovery", "Escalate to support", "Escalate to support", "MATCH"], ["Billing context missing", "Ask for context", "Ask for context", "MATCH"]] },
  changed: { label: "CRM action", path: "Update contact", note: "Write enabled · approval removed", impact: "3 routes changed", title: "Six past conversations would take a different action.", copy: "The draft writes directly to the CRM where the current workflow asks a teammate to review the request first.", recommendation: "Approval required", action: "Send for approval", confirmation: "Review request prepared. No agent was changed.", reasons: ["2 new CRM writes", "1 approval skipped"], rows: [["Cancellation request", "Queue for review", "Update CRM status", "NEW TOOL"], ["Duplicate contact", "Ask an operator", "Merge CRM record", "NEW ACTION"], ["Consent missing", "Block external action", "Queue CRM update", "NEW ROUTE"]] },
  broken: { label: "AI model", path: "OpenAI credential", note: "Connection unavailable", impact: "3 routes failed", title: "Three conversations stop before a response.", copy: "The selected credential cannot execute the model. The workflow stops before it can answer or choose a tool.", recommendation: "Fix before publishing", action: "Open credential", confirmation: "Credential issue recorded. No agent was changed.", reasons: ["3 model calls blocked", "0 tools executed"], rows: [["Cancellation request", "Draft safe response", "Model access denied", "FAILED"], ["Refund eligibility", "Answer from policy", "Model access denied", "FAILED"], ["Account recovery", "Escalate to support", "Model access denied", "FAILED"]] },
}

export function WorkflowImpactPreview() {
  const [version, setVersion] = useState<Version>("changed")
  const [result, setResult] = useState<ReplayResult | null>(null)
  const [running, setRunning] = useState(false)
  const [acted, setActed] = useState(false)
  const state = states[version]

  async function runReplay() {
    setRunning(true)
    setResult(null); setActed(false)
    try {
      const response = await fetch(`/api/workflow-impact-replay?scenario=${version}`)
      if (!response.ok) throw new Error("Replay unavailable")
      setResult(await response.json())
    } catch {
      setResult({ decision: "The replay service is temporarily unavailable.", generatedAt: "", source: "" })
    } finally { setRunning(false) }
  }

  const riskLabel = version === "safe" ? "Ready" : version === "changed" ? "Needs approval" : "Fix required"

  return <section className={styles.reviewSection} id="workflow-impact">
    <header className={styles.reviewIntro}><span>Agent release control</span><h2>Trace a change before it ships.</h2><p>Run an allowlisted synthetic scenario through the published n8n workflow and review its decision before publishing.</p></header>
    <div className={styles.reviewApp}>
      <header className={styles.reviewBar}><div><span className={styles.reviewLogo}><IconHierarchy size={19}/></span><span><strong>Agent impact review</strong><small>support-agent · production shadow</small></span></div><span className={styles.connectionState}><i/>n8n connected</span><button type="button" onClick={runReplay} disabled={running}><IconPlayerPlay size={17}/>{running?"Running…":"Run replay"}</button></header>
      <div className={styles.reviewBody}>
        <aside className={styles.changeList}><header><span>Changes under review</span><h3>Select one scenario</h3><p>Each option sends one allowlisted synthetic scenario to the published workflow.</p></header><div>{(Object.keys(states) as Version[]).map((key,index)=><button type="button" key={key} aria-pressed={version===key} onClick={()=>{setVersion(key);setResult(null);setActed(false)}}><span className={`${styles.changeSymbol} ${styles[key]}`}>{index+1}</span><span><strong>{states[key].label}</strong><small>{states[key].path}</small></span><span className={styles.changeImpact}>{states[key].impact}<IconArrowRight size={16}/></span></button>)}</div><footer><IconShieldCheck size={18}/><span><strong>Synthetic input only</strong><small>No agent, tool or customer data is changed</small></span></footer></aside>
        <main className={`${styles.reviewDetail} ${styles[version]}`}><header className={styles.selectedChange}><div><span className={styles.selectedIcon}><IconFileDiff size={22}/></span><span><small>Selected scenario</small><h3>{state.label}</h3><p>{state.note}</p></span></div><div><small>Expected impact</small><strong>{state.impact}</strong></div></header><section className={styles.recommendationCard}><div><span>Recommendation</span><strong><i/>{riskLabel}</strong></div><h4>{state.recommendation}</h4><p>{state.copy}</p><ul><li>{state.reasons[0]}</li><li>{state.reasons[1]}</li></ul></section><div className={styles.evidenceGrid}><section><span>Scenario fixture</span><h4>3 representative conversations</h4><p>Deterministic examples illustrate the expected policy outcome. They are not customer or production traces.</p></section><section><span>Execution</span><h4>{result?"Receipt received":"Ready to run"}</h4><p>{result?.proxyLatencyMs?`${result.proxyLatencyMs} ms round trip through n8n.`:"Published webhook connected. The workflow accepts only safe, changed or broken."}</p></section></div><details className={styles.reviewDisclosure}><summary><span><IconFileDiff size={18}/><b>View representative outcomes</b></span><small>3 examples</small></summary><div className={styles.routeComparison}>{state.rows.map(row=><article key={row[0]}><header><b>{row[0]}</b><em>{row[3]}</em></header><div><span><small>Current</small>{row[1]}</span><IconArrowRight size={16}/><strong><small>Proposed</small>{row[2]}</strong></div></article>)}</div></details><details className={styles.reviewDisclosure} open><summary><span><IconHierarchy size={18}/><b>Published n8n workflow</b></span><small>{result?"Receipt received":"Ready"}</small></summary><div className={styles.executionFlow}><span><IconWebhook size={17}/><b>Webhook</b><small>Receive scenario</small></span><IconArrowRight size={15}/><span><IconShieldCheck size={17}/><b>Validate scenario</b><small>Allowlisted input</small></span><IconArrowRight size={15}/><span><IconHierarchy size={17}/><b>Evaluate policy</b><small>Decision by scenario</small></span><IconArrowRight size={15}/><span><IconCheck size={17}/><b>Build receipt</b><small>Typed decision JSON</small></span></div></details>{result&&<p className={styles.replayResult} role="status">{result.decision}</p>}<footer className={styles.reviewAction}><span><IconClock size={17}/><small>{result?.proxyLatencyMs?`${result.proxyLatencyMs} ms`:"Not run yet"}</small></span><button type="button" onClick={result?()=>setActed(true):runReplay} disabled={running||acted}>{running?"Running replay":acted?<><IconCheck size={18}/>Decision saved</>:result?state.action:<><IconPlayerPlay size={18}/>Run selected scenario</>}</button></footer></main>
      </div>
    </div>
  </section>
}

export function WorkflowImpactPreviewCover() {
  return <div className="workflow-impact-cover" aria-hidden="true"><header><span>Agent impact</span><b>Preview</b></header><div><span>Before you publish</span><strong>replay its behaviour.</strong></div><footer><i /><i /><i /><b>6 changed</b></footer></div>
}
