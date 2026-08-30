"use client"

import { useState } from "react"
import Image from "next/image"
import { IconApi, IconArrowRight, IconBraces, IconCheck, IconChevronRight, IconClock, IconFileDiff, IconHierarchy, IconPlayerPlay, IconShieldCheck, IconWebhook } from "@tabler/icons-react"
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
  safe: { label: "System message", path: "prompt.system", note: "Copy edit · no permission change", impact: "0 changed runs", title: "No material side effects found.", copy: "The revised system message improves response clarity without changing tool selection, escalation rules or the final outcome in sampled conversations.", recommendation: "Safe to publish", action: "Publish change", confirmation: "Marked ready to publish. No agent was changed.", reasons: ["0 tool calls changed", "0 escalations bypassed"], rows: [["Refund policy question", "Answer from policy", "Answer from policy", "MATCH"], ["Account access request", "Escalate to support", "Escalate to support", "MATCH"], ["Ambiguous billing issue", "Ask for context", "Ask for context", "MATCH"]] },
  changed: { label: "Tool instructions", path: "tools.crm.update", note: "+ write permission · approval removed", impact: "6 changed runs", title: "Six past conversations would take a different action.", copy: "The proposed tool instructions let the agent update a CRM record in cases that previously required a human review.", recommendation: "Request review before publishing", action: "Request review", confirmation: "Review request prepared. No agent was changed.", reasons: ["2 new CRM writes", "1 approval gate bypassed"], rows: [["Enterprise cancellation", "Queue for human review", "Update CRM status", "NEW TOOL CALL"], ["Duplicate customer record", "Ask an operator", "Merge CRM record", "ACTION CHANGED"], ["Consent not verified", "Block external action", "Queue CRM update", "ROUTE CHANGED"]] },
  broken: { label: "Model credential", path: "credentials.openai", note: "Connection test failed · access denied", impact: "3 failing runs", title: "Three conversations stop before a response.", copy: "The proposed model credential is missing execution access. No tool is called, but the agent cannot produce or route a response.", recommendation: "Fix credential before publishing", action: "Fix credential", confirmation: "Credential issue recorded. No agent was changed.", reasons: ["3 model calls blocked", "0 external tools called"], rows: [["Enterprise cancellation", "Draft safe response", "Model access denied", "FAILS"], ["Refund policy question", "Answer from policy", "Model access denied", "FAILS"], ["Account access request", "Escalate to support", "Model access denied", "FAILS"]] },
}

export function WorkflowImpactPreview() {
  const [version, setVersion] = useState<Version>("changed")
  const [result, setResult] = useState<ReplayResult | null>(null)
  const [running, setRunning] = useState(false)
  const [comparingCurrent, setComparingCurrent] = useState(false)
  const [acted, setActed] = useState(false)
  const state = states[version]
  const replayInput = JSON.stringify({ scenario: version, mode: "synthetic", writesEnabled: false }, null, 2)
  const replayOutput = result ? JSON.stringify({ status: result.status, impact: result.impact, decision: result.decision }, null, 2) : "Run the replay to inspect the response."

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

  const matchCount = state.rows.filter(row => row[3] === "MATCH").length
  const failedCount = state.rows.filter(row => row[3] === "FAILS").length
  const changedCount = state.rows.length - matchCount - failedCount
  const riskLabel = version === "safe" ? "Low risk" : version === "changed" ? "Review needed" : "Blocked"

  return <section className={styles.root} id="workflow-impact">
    <header className={styles.intro}><span>n8n agent experiment</span><h2>Change the agent, not its behaviour by accident.</h2><p>A pre-publish replay for prompts, memory, models and tool permissions.</p></header>
    <div className={styles.app}>
      <header className={styles.toolbar}><div className={styles.identity}><span className={styles.mark}><IconHierarchy size={17} /></span><strong>Relay</strong><span>Impact preview</span></div><div className={styles.toolbarCenter}><span>Support agent</span><IconChevronRight size={15} aria-hidden="true" /><b>Draft change</b></div><div className={styles.connection}><i aria-hidden="true" /><span>Live on n8n</span></div></header>
      <div className={styles.workspace}>
        <aside className={styles.sidebar}><div className={styles.sidebarHead}><span>Changes to review</span><small>Draft 18</small></div><div className={styles.scenarios}>{(Object.keys(states) as Version[]).map(key => <button type="button" aria-pressed={version === key} className={version === key ? styles.selected : ""} key={key} onClick={() => { setVersion(key); setResult(null); setActed(false); setComparingCurrent(false) }}><span className={styles.scenarioIndex}>{key === "safe" ? "M" : key === "changed" ? "+" : "!"}</span><span><small className={styles.scenarioPath}>{states[key].path}</small><strong>{states[key].label}</strong><small>{states[key].note}</small></span><IconChevronRight size={16} aria-hidden="true" /></button>)}</div><footer><IconShieldCheck size={16} aria-hidden="true" /><span><b>Read-only replay</b><small>Production writes disabled</small></span></footer></aside>
        <div className={styles.canvas}>
          <section className={`${styles.decision} ${styles[version]}`}>
            <div className={styles.decisionLead}><span>Publish readiness</span><div className={styles.risk}><i />{riskLabel}</div><h3>{state.recommendation}</h3><p>{state.copy}</p><div className={styles.decisionReasons}><span>{state.reasons[0]}</span><span>{state.reasons[1]}</span></div><div className={styles.decisionActions}><button type="button" className={styles.run} onClick={result ? () => setActed(true) : runReplay} disabled={running || acted}>{running ? "Running replay…" : acted ? <><IconCheck size={17} /> Done</> : result ? <><IconCheck size={17} /> {state.action}</> : <><IconPlayerPlay size={17} /> Run replay</>}</button><small>Representative replay · read only</small></div>{result && <small className={styles.liveDecision} role="status" aria-live="polite">{result.decision}</small>}</div>
            <div className={styles.impactPanel}><header><div><span>Replay result</span><strong>{state.impact}</strong></div><small>3 conversations replayed</small></header><div className={styles.distribution} aria-label={`${matchCount} unchanged, ${changedCount} changed and ${failedCount} failed`}>{matchCount > 0 && <span className={styles.distributionMatch} style={{flex:matchCount}} />}{changedCount > 0 && <span className={styles.distributionChange} style={{flex:changedCount}} />}{failedCount > 0 && <span className={styles.distributionFail} style={{flex:failedCount}} />}</div><dl className={styles.resultCounts}><div><dt>Unchanged</dt><dd>{matchCount}</dd></div><div><dt>Changed</dt><dd>{changedCount}</dd></div><div><dt>Failed</dt><dd>{failedCount}</dd></div></dl><p>Counts come directly from the conversation routes shown below.</p></div>
          </section>
          <section className={styles.outcomes} aria-labelledby="outcome-heading"><header><div><span>Behaviour map</span><h3 id="outcome-heading">What changes in each conversation</h3></div><button type="button" aria-pressed={comparingCurrent} className={comparingCurrent ? styles.comparing : ""} onClick={() => setComparingCurrent(value => !value)}><IconFileDiff size={16} /> {comparingCurrent ? "Showing current" : "Compare current"}</button></header><div className={styles.outcomeRows}>{state.rows.map((row, index) => <article key={row[0]}><span className={styles.rowNumber}>0{index + 1}</span><strong>{row[0]}</strong><div className={styles.route}><span>{row[1]}</span><IconArrowRight size={15} /><b>{comparingCurrent ? row[1] : row[2]}</b></div><em className={row[3] === "MATCH" ? styles.match : row[3] === "FAILS" ? styles.fail : styles.change}>{comparingCurrent ? "CURRENT" : row[3]}</em></article>)}</div></section>
          <details className={styles.orchestration}><summary><div><span className={styles.n8nMark}><IconHierarchy size={17} /></span><span><b>How this replay runs</b><small>Published n8n workflow · 4 steps</small></span></div><IconChevronRight size={18} /></summary><div className={styles.orchestrationBody}><div className={styles.orchestrationFlow} aria-label="n8n replay workflow"><div><IconWebhook size={18} /><span>Webhook</span><small>Receive scenario</small></div><IconArrowRight size={16} /><div><IconShieldCheck size={18} /><span>Validate</span><small>Allowlisted input</small></div><IconArrowRight size={16} /><div><IconHierarchy size={18} /><span>Evaluate</span><small>Replay policy</small></div><IconArrowRight size={16} /><div><IconApi size={18} /><span>Receipt</span><small>Decision JSON</small></div></div><div className={styles.executionSummary}><span className={result ? styles.executed : ""}><IconCheck size={15} /> {result ? "Execution received" : "Ready to run"}</span><small><IconClock size={14} /> {result?.proxyLatencyMs ? `${result.proxyLatencyMs} ms round trip` : "Live webhook connected"}</small></div><details className={styles.payload}><summary><IconBraces size={15} /> Inspect payload</summary><div><section><span>Input</span><pre>{replayInput}</pre></section><section><span>Output</span><pre>{replayOutput}</pre></section></div></details><details className={styles.canvasProof}><summary>View published n8n canvas</summary><Image src="/images/lab/workflow-impact-n8n.png" alt="Published n8n workflow with separate webhook, scenario validation, replay policy and execution receipt nodes" width={668} height={674} /></details></div></details>
        </div>
      </div>
    </div>
  </section>
}

export function WorkflowImpactPreviewCover() {
  return <div className="workflow-impact-cover" aria-hidden="true"><header><span>Agent impact</span><b>Preview</b></header><div><span>Before you publish</span><strong>replay its behaviour.</strong></div><footer><i /><i /><i /><b>6 changed</b></footer></div>
}
