"use client"

import { useState } from "react"
import { IconArrowRight, IconCheck, IconChevronRight, IconClock, IconFileDiff, IconHierarchy, IconPlayerPlay, IconShieldCheck, IconWebhook } from "@tabler/icons-react"
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

  const riskLabel = version === "safe" ? "Low risk" : version === "changed" ? "Review needed" : "Blocked"

  return <section className={styles.root} id="workflow-impact">
    <header className={styles.intro}><span>Workflow impact / n8n</span><h2>See where an agent change leads.</h2><p>Replay a draft against past conversations before it reaches production.</p></header>
    <div className={styles.app}>
      <header className={styles.toolbar}><div className={styles.windowDots} aria-hidden="true"><i /><i /><i /></div><div className={styles.identity}><span className={styles.mark}><IconHierarchy size={17} /></span><strong>Relay</strong><span>/</span><b>support-agent</b><span>/</span><b>draft-18</b></div><div className={styles.toolbarAction}><span><i /> n8n connected</span><button type="button" onClick={runReplay} disabled={running}><IconPlayerPlay size={15} />{running ? "Replaying…" : "Replay draft"}</button></div></header>
      <div className={styles.workspace}>
        <nav className={styles.sidebar} aria-label="Draft changes"><div className={styles.sidebarHead}><strong>Change set</strong><span>3 files</span></div><div className={styles.scenarios}>{(Object.keys(states) as Version[]).map(key => <button type="button" aria-pressed={version === key} className={version === key ? styles.selected : ""} key={key} onClick={() => { setVersion(key); setResult(null); setActed(false); setComparingCurrent(false) }}><span className={`${styles.scenarioIndex} ${styles[key]}`}>{key === "safe" ? "M" : key === "changed" ? "+" : "!"}</span><span><strong>{states[key].label}</strong><small>{states[key].path}</small></span><IconChevronRight size={15} /></button>)}</div><div className={styles.sidebarMeta}><span>Environment</span><strong>production-shadow</strong><span>Dataset</span><strong>3 past conversations</strong></div><footer><IconShieldCheck size={16} /><span><b>Writes disabled</b><small>Replay is read only</small></span></footer></nav>
        <main className={styles.canvas}>
          <header className={styles.canvasHeader}><div><span>Impact trace</span><strong>{state.label}</strong></div><button type="button" aria-pressed={comparingCurrent} onClick={() => setComparingCurrent(value => !value)}><IconFileDiff size={15} />{comparingCurrent ? "Current routes" : "Show current"}</button></header>
          <div className={styles.flowCanvas} aria-label="Replay route diagram">
            <svg className={styles.connectors} viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true"><path d="M188 300 C255 300 256 300 320 300"/><path d="M526 300 C590 300 565 122 650 122"/><path d="M526 300 C590 300 590 300 650 300"/><path d="M526 300 C590 300 565 478 650 478"/></svg>
            <article className={`${styles.flowNode} ${styles.startNode}`}><span className={styles.nodeIcon}><IconWebhook size={17} /></span><div><small>Input</small><strong>Replay sample</strong><p>3 conversation traces</p></div><i>3</i></article>
            <article className={`${styles.flowNode} ${styles.changeNode}`}><span className={styles.nodeIcon}><IconHierarchy size={17} /></span><div><small>Draft change</small><strong>{state.path}</strong><p>{state.note}</p></div><i>+1</i></article>
            {state.rows.map((row, index) => <article className={`${styles.flowNode} ${styles.outcomeNode} ${styles[`outcome${index + 1}`]}`} key={row[0]}><span className={styles.nodeIcon}>{row[3] === "MATCH" ? <IconCheck size={17} /> : <IconArrowRight size={17} />}</span><div><small>{row[0]}</small><strong>{comparingCurrent ? row[1] : row[2]}</strong><p>{comparingCurrent ? "Current route" : row[3].toLowerCase()}</p></div></article>)}
            <div className={styles.canvasStatus}><span><i />{result ? "Replay complete" : "Ready"}</span><span><IconClock size={14} />{result?.proxyLatencyMs ? `${result.proxyLatencyMs} ms` : "Live webhook"}</span></div>
          </div>
        </main>
        <aside className={`${styles.inspector} ${styles[version]}`}><header><span>Inspector</span><b>Change</b><b>Replay</b></header><section className={styles.inspectorTitle}><span className={styles.inspectorIcon}><IconHierarchy size={18} /></span><div><small>{state.path}</small><h3>{state.label}</h3></div></section><section className={styles.verdict}><span>Publish status</span><strong><i />{riskLabel}</strong><p>{state.recommendation}</p></section><dl className={styles.properties}><div><dt>Observed impact</dt><dd>{state.impact}</dd></div><div><dt>Tool calls</dt><dd>{state.reasons[0]}</dd></div><div><dt>Approval gates</dt><dd>{state.reasons[1]}</dd></div><div><dt>Orchestrator</dt><dd><IconHierarchy size={14} /> n8n · live</dd></div></dl><section className={styles.inspectorNote}><span>Review note</span><p>{state.copy}</p></section>{result && <p className={styles.liveDecision} role="status">{result.decision}</p>}<footer><button type="button" className={styles.run} onClick={result ? () => setActed(true) : runReplay} disabled={running || acted}>{running ? "Running…" : acted ? <><IconCheck size={16} /> Recorded</> : result ? state.action : <><IconPlayerPlay size={16} /> Run replay</>}</button><small>No production writes</small></footer></aside>
      </div>
    </div>
  </section>
}

export function WorkflowImpactPreviewCover() {
  return <div className="workflow-impact-cover" aria-hidden="true"><header><span>Agent impact</span><b>Preview</b></header><div><span>Before you publish</span><strong>replay its behaviour.</strong></div><footer><i /><i /><i /><b>6 changed</b></footer></div>
}
