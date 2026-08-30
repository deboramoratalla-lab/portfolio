"use client"

import { useState } from "react"
import { IconArrowRight, IconCheck, IconClock, IconFileDiff, IconHierarchy, IconPlayerPlay, IconWebhook } from "@tabler/icons-react"
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
  const [viewMode, setViewMode] = useState<"graph" | "table">("graph")
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

  return <section className={styles.experiment} id="workflow-impact">
    <header className={styles.experimentIntro}><span>Agent release control</span><h2>Trace a change before it ships.</h2><p>Replay proposed agent behaviour against past conversations and inspect every route that changes.</p></header>
    <div className={styles.releaseApp}>
      <header className={styles.appHeader}><div><span className={styles.brandGlyph}><IconHierarchy size={18}/></span><span><b>Agent impact</b><small>support-agent · production shadow</small></span></div><div className={styles.liveStatus}><i/>n8n connected</div><button type="button" onClick={runReplay} disabled={running}><IconPlayerPlay size={16}/>{running?"Running replay":"Run replay"}</button></header>
      <div className={styles.releaseWorkspace}>
        <main className={styles.discoveryArea}>
          <div className={styles.viewSwitch} role="group" aria-label="View mode"><button type="button" aria-pressed={viewMode==="graph"} onClick={()=>setViewMode("graph")}><IconHierarchy size={15}/>Graph</button><button type="button" aria-pressed={viewMode==="table"} onClick={()=>setViewMode("table")}><IconFileDiff size={15}/>Table</button></div>
          {viewMode==="graph"?<div className={styles.changeGraph} aria-label="Agent change graph"><div className={styles.graphInstruction}><strong>Select a proposed change</strong><span>The inspector updates with its replay result.</span></div><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M38 50 H51 C57 50 57 21 64 21"/><path d="M38 50 H64"/><path d="M38 50 H51 C57 50 57 79 64 79"/></svg><section className={styles.graphContext}><span>Replay context</span><div><IconWebhook size={17}/><p><b>support-agent</b><small>Published workflow</small></p></div><div><IconClock size={17}/><p><b>3 past conversations</b><small>Redacted production traces</small></p></div></section>{(Object.keys(states) as Version[]).map((key,index)=><button type="button" key={key} aria-pressed={version===key} className={`${styles.graphEntity} ${styles.changeEntity} ${styles[`changeEntity${index+1}`]}`} onClick={()=>{setVersion(key);setResult(null);setActed(false)}}><span><IconHierarchy size={18}/></span><div><b>{states[key].label}</b><small>{states[key].path}</small></div><i><IconArrowRight size={14}/></i></button>)}</div>:<div className={styles.changeTable}><header><span>Change</span><span>Configuration</span><span>Impact</span><span>Status</span></header>{(Object.keys(states) as Version[]).map(key=><button type="button" key={key} aria-pressed={version===key} onClick={()=>{setVersion(key);setResult(null);setActed(false)}}><b>{states[key].label}</b><span>{states[key].path}</span><span>{states[key].impact}</span><em>{key==="safe"?"Ready":key==="changed"?"Review":"Blocked"}</em></button>)}</div>}
        </main>
        <aside className={`${styles.detailPanel} ${styles[version]}`}><section className={styles.detailTitle}><span className={styles.detailIcon}><IconHierarchy size={24}/></span><div><small>Selected change</small><h3>{state.label}</h3><p>{state.path}</p></div></section><div className={styles.riskFacts}><div><small>Publish status</small><strong><i/>{riskLabel}</strong></div><div><small>Observed impact</small><b>{state.impact}</b></div></div><section className={styles.insightSection}><h4>Why this result</h4><div><span>{state.reasons[0]}</span><span>{state.reasons[1]}</span></div></section><section className={styles.summarySection}><h4>Recommendation</h4><strong>{state.recommendation}</strong><p>{state.copy}</p></section><section className={styles.routeSection}><h4>Conversation routes</h4>{state.rows.map(row=><article key={row[0]}><div><b>{row[0]}</b><small>{row[1]}</small></div><IconArrowRight size={15}/><strong>{row[2]}</strong></article>)}</section><dl className={styles.propertyList}><div><dt>Source</dt><dd>n8n webhook</dd></div><div><dt>Environment</dt><dd>production-shadow</dd></div><div><dt>Execution</dt><dd>{result?.proxyLatencyMs?`${result.proxyLatencyMs} ms`:"Not run"}</dd></div></dl>{result&&<p className={styles.resultNotice} role="status">{result.decision}</p>}<footer><button type="button" onClick={result?()=>setActed(true):runReplay} disabled={running||acted}>{running?"Running replay":acted?<><IconCheck size={18}/>Decision saved</>:result?state.action:<><IconPlayerPlay size={18}/>Run selected change</>}</button><small>Read-only replay · no external actions</small></footer></aside>
      </div>
    </div>
  </section>
}

export function WorkflowImpactPreviewCover() {
  return <div className="workflow-impact-cover" aria-hidden="true"><header><span>Agent impact</span><b>Preview</b></header><div><span>Before you publish</span><strong>replay its behaviour.</strong></div><footer><i /><i /><i /><b>6 changed</b></footer></div>
}
