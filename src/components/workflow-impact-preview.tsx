"use client"

import { useState } from "react"
import Image from "next/image"
import { IconApi, IconArrowRight, IconBolt, IconBraces, IconCheck, IconChevronRight, IconClock, IconFileDiff, IconHierarchy, IconLayoutSidebar, IconPlayerPlay, IconShieldCheck, IconSparkles, IconWebhook } from "@tabler/icons-react"
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
type State = { label: string; note: string; impact: string; title: string; copy: string; recommendation: string; action: string; confirmation: string; reasons: [string, string]; rows: [string, string, string, string][] }
const states: Record<Version, State> = {
  safe: { label: "Template copy", note: "No audience or send change", impact: "0 changed runs", title: "No material side effects found.", copy: "The proposed template preserves audience rules, consent checks and outbound email actions in the sampled runs.", recommendation: "Safe to publish", action: "Publish change", confirmation: "Marked ready to publish. No workflow was changed.", reasons: ["0 audiences changed", "0 new email sends"], rows: [["EMEA trial - 3 days", "Renewal reminder", "Renewal reminder", "MATCH"], ["US trial - 3 days", "Renewal reminder", "Renewal reminder", "MATCH"], ["Paid upgrade", "No lifecycle email", "No lifecycle email", "MATCH"]] },
  changed: { label: "Audience rule", note: "Broader segment reaches an email send", impact: "6 changed runs", title: "Six past runs would send a different email.", copy: "The proposed rule includes high-intent enterprise trials in an activation campaign instead of their current lifecycle path.", recommendation: "Request review before publishing", action: "Request review", confirmation: "Review request prepared. No workflow was changed.", reasons: ["2 new activation sends", "1 account bypasses review"], rows: [["EMEA enterprise trial", "Queue for lifecycle review", "Send activation email", "NEW EXTERNAL SEND"], ["Trial ends in 3 days", "Send renewal reminder", "Send activation email", "TEMPLATE CHANGED"], ["Consent not verified", "Suppress send", "Queue for lifecycle review", "ROUTE CHANGED"]] },
  broken: { label: "Email provider credential", note: "Customer.io write permission missing", impact: "3 failing runs", title: "Three executions stop before the email action.", copy: "The new Customer.io connection lacks profile-write scope. No email is sent, but audience synchronisation fails before delivery.", recommendation: "Fix permission before publishing", action: "Fix permission", confirmation: "Permission issue recorded. No workflow was changed.", reasons: ["3 missing write scopes", "0 emails sent"], rows: [["EMEA enterprise trial", "Upsert Customer.io profile", "Missing write scope", "FAILS"], ["Trial ends in 3 days", "Upsert Customer.io profile", "Missing write scope", "FAILS"], ["Product-qualified lead", "Upsert Customer.io profile", "Missing write scope", "FAILS"]] },
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

  return <section className={styles.root} id="workflow-impact">
    <header className={styles.intro}><span>Independent product exploration</span><h2>Change the workflow, not the outcome by accident.</h2><p>A replay surface for seeing what an automation will do before it is published.</p></header>
    <div className={styles.app}>
      <header className={styles.toolbar}><div className={styles.identity}><span className={styles.mark}><IconHierarchy size={17} /></span><strong>Relay</strong><span>Lifecycle operations</span></div><div className={styles.toolbarCenter}><span className={styles.viewIcon} aria-hidden="true"><IconLayoutSidebar size={16} /></span><span>Email workflow</span><IconChevronRight size={15} aria-hidden="true" /><b>Pre-publish replay</b></div><div className={styles.connection}><i aria-hidden="true" /><span>n8n connected</span></div></header>
      <div className={styles.guide}><strong>Review an email automation change against historical outcomes.</strong><span>Replay uses synthetic lifecycle events. It never writes to a customer system or sends email.</span></div>
      <div className={styles.workspace}>
        <aside className={styles.sidebar}><div className={styles.sidebarHead}><span>Example changes</span><small>Choose one</small></div><div className={styles.scenarios}>{(Object.keys(states) as Version[]).map(key => <button type="button" aria-pressed={version === key} className={version === key ? styles.selected : ""} key={key} onClick={() => { setVersion(key); setResult(null); setActed(false); setComparingCurrent(false) }}><strong>{states[key].label}</strong><small>{states[key].note}</small></button>)}</div><footer><IconShieldCheck size={15} aria-hidden="true" /><span>Replay mode</span></footer></aside>
        <div className={styles.canvas}>
          <section className={styles.decision}><div className={styles.impactVisual}><span>Can this change be published?</span><strong>{state.impact}</strong><small>across 3 representative paths</small></div><div><h3>{state.recommendation}</h3><p>{state.copy}</p><div className={styles.decisionReasons} aria-label="Why this recommendation"><span>{state.reasons[0]}</span><span>{state.reasons[1]}</span></div>{result && <small className={styles.liveDecision}>{result.decision}</small>}</div><div className={styles.outcomeDelta} aria-label="Representative outcome changes">{state.rows.map(row => <article key={row[0]}><header><strong>{row[0]}</strong><b>{row[3]}</b></header><div className={styles.deltaRoute}><div><small>Current</small><span>{row[1]}</span></div><i aria-hidden="true"><IconArrowRight size={14} /></i><div className={styles.proposedStep}><small>Proposed</small><span>{row[2]}</span></div></div></article>)}</div><button className={styles.run} onClick={result ? () => setActed(true) : runReplay} disabled={running || acted}>{running ? "Running replay" : acted ? <><IconCheck size={16} /> {state.confirmation}</> : result ? <><IconCheck size={16} /> {state.action}</> : <><IconPlayerPlay size={16} /> Run replay</>}</button></section>
          <details className={styles.caseDetails}><summary><span>View changed cases</span><small>Compare every sampled route</small></summary><section className={styles.replay}><header><div><IconFileDiff size={16} aria-hidden="true" /><span>Historical comparison</span></div><button type="button" aria-pressed={comparingCurrent} className={comparingCurrent ? styles.comparing : ""} onClick={() => setComparingCurrent(value => !value)}><IconSparkles size={15} aria-hidden="true" /> {comparingCurrent ? "Show proposed" : "Compare to current"}</button></header>{state.rows.map(row => <article key={row[0]}><strong>{row[0]}</strong><span>{row[1]}</span><IconArrowRight size={14} aria-hidden="true" /><span>{comparingCurrent ? row[1] : row[2]}</span><b>{comparingCurrent ? "CURRENT" : row[3]}</b></article>)}</section></details>
          <section className={styles.orchestration} aria-labelledby="n8n-workflow-title"><header><div><span>Live orchestration</span><h3 id="n8n-workflow-title">The replay itself runs through n8n.</h3></div><b><i /> Published workflow</b></header><div className={styles.orchestrationFlow} aria-label="n8n replay workflow"><div><IconWebhook size={18} /><span>Webhook</span><small>Receive scenario</small></div><IconArrowRight size={16} /><div><IconShieldCheck size={18} /><span>Validate scenario</span><small>Allowlisted input</small></div><IconArrowRight size={16} /><div><IconHierarchy size={18} /><span>Evaluate policy</span><small>Decision by scenario</small></div><IconArrowRight size={16} /><div><IconApi size={18} /><span>Build receipt</span><small>Typed decision JSON</small></div></div><div className={styles.execution}><div className={styles.executionSummary}><span className={result ? styles.executed : ""}><IconCheck size={15} /> {result ? "Execution received" : "Ready for execution"}</span><small><IconClock size={14} /> {result?.proxyLatencyMs ? `${result.proxyLatencyMs} ms round trip` : "Runs when you select Run replay"}</small>{result?.generatedAt && <time dateTime={result.generatedAt}>{new Date(result.generatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</time>}</div><details className={styles.payload}><summary><IconBraces size={15} /> Inspect payload contract</summary><div><section><span>Input</span><pre>{replayInput}</pre></section><section><span>Output</span><pre>{replayOutput}</pre></section></div></details><details className={styles.canvasProof}><summary>View the published n8n canvas</summary><Image src="/images/lab/workflow-impact-n8n.png" alt="Published n8n workflow with separate webhook, scenario validation, replay policy and execution receipt nodes" width={668} height={674} /></details></div></section>
          <details className={styles.workflowDetails} open><summary><div><span>Workflow under review</span><strong>Proposed customer workflow</strong></div><small>7 nodes · Lifecycle email automation</small></summary><div className={styles.flow} aria-label="Lifecycle email automation"><div className={styles.flowStage}><span>Trigger</span><div><IconBolt size={18} /><b>trial.ending</b><small>Signed product webhook</small></div><IconArrowRight size={17} /><div><IconShieldCheck size={18} /><b>Validate event</b><small>Rejects duplicate payloads</small></div></div><div className={styles.flowStage}><span>Qualify</span><div><IconHierarchy size={18} /><b>Enrich account</b><small>Plan, region and owner</small></div><IconArrowRight size={17} /><div><IconShieldCheck size={18} /><b>Check consent</b><small>Marketing permission gate</small></div></div><div className={styles.flowStage}><span>Deliver</span><div className={!comparingCurrent && version === "changed" ? styles.emphasis : ""}><IconSparkles size={18} /><b>Evaluate audience</b><small>{comparingCurrent ? "Current segment rule" : "Proposed segment rule"}</small></div><IconArrowRight size={17} /><div className={!comparingCurrent && version === "broken" ? styles.danger : ""}><IconHierarchy size={18} /><b>Sync Customer.io</b><small>Upserts the approved audience</small></div><IconArrowRight size={17} /><div><IconCheck size={18} /><b>Send and log</b><small>Delivery event to warehouse</small></div></div></div></details>
        </div>
      </div>
    </div>
    <small className={styles.note}>The action calls a published n8n webhook. The data is synthetic and no customer workflow is read or changed.</small>
  </section>
}

export function WorkflowImpactPreviewCover() {
  return <div className="workflow-impact-cover" aria-hidden="true"><header><span>Workflow impact</span><b>Preview</b></header><div><span>Before you publish</span><strong>see what changes.</strong></div><footer><i /><i /><i /><b>6 changed</b></footer></div>
}
