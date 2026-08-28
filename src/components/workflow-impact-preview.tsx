"use client"

import { useState } from "react"
import Image from "next/image"
import { IconApi, IconArrowRight, IconBraces, IconCheck, IconChevronRight, IconClock, IconFileDiff, IconHierarchy, IconLayoutSidebar, IconPlayerPlay, IconShieldCheck, IconSparkles, IconWebhook } from "@tabler/icons-react"
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
  safe: { label: "System message", note: "Clearer tone, same tools and boundaries", impact: "0 changed runs", title: "No material side effects found.", copy: "The revised system message improves response clarity without changing tool selection, escalation rules or the final outcome in sampled conversations.", recommendation: "Safe to publish", action: "Publish change", confirmation: "Marked ready to publish. No agent was changed.", reasons: ["0 tool calls changed", "0 escalations bypassed"], rows: [["Refund policy question", "Answer from policy", "Answer from policy", "MATCH"], ["Account access request", "Escalate to support", "Escalate to support", "MATCH"], ["Ambiguous billing issue", "Ask for context", "Ask for context", "MATCH"]] },
  changed: { label: "Tool instructions", note: "Agent can now trigger an external action", impact: "6 changed runs", title: "Six past conversations would take a different action.", copy: "The proposed tool instructions let the agent update a CRM record in cases that previously required a human review.", recommendation: "Request review before publishing", action: "Request review", confirmation: "Review request prepared. No agent was changed.", reasons: ["2 new CRM writes", "1 approval gate bypassed"], rows: [["Enterprise cancellation", "Queue for human review", "Update CRM status", "NEW TOOL CALL"], ["Duplicate customer record", "Ask an operator", "Merge CRM record", "ACTION CHANGED"], ["Consent not verified", "Block external action", "Queue CRM update", "ROUTE CHANGED"]] },
  broken: { label: "Model credential", note: "Chat model access is unavailable", impact: "3 failing runs", title: "Three conversations stop before a response.", copy: "The proposed model credential is missing execution access. No tool is called, but the agent cannot produce or route a response.", recommendation: "Fix credential before publishing", action: "Fix credential", confirmation: "Credential issue recorded. No agent was changed.", reasons: ["3 model calls blocked", "0 external tools called"], rows: [["Enterprise cancellation", "Draft safe response", "Model access denied", "FAILS"], ["Refund policy question", "Answer from policy", "Model access denied", "FAILS"], ["Account access request", "Escalate to support", "Model access denied", "FAILS"]] },
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
    <header className={styles.intro}><span>n8n agent experiment</span><h2>Change the agent, not its behaviour by accident.</h2><p>A pre-publish replay for prompts, memory, models and tool permissions.</p></header>
    <div className={styles.app}>
      <header className={styles.toolbar}><div className={styles.identity}><span className={styles.mark}><IconHierarchy size={17} /></span><strong>Relay</strong><span>AI support agent</span></div><div className={styles.toolbarCenter}><span className={styles.viewIcon} aria-hidden="true"><IconLayoutSidebar size={16} /></span><span>Support agent</span><IconChevronRight size={15} aria-hidden="true" /><b>Pre-publish replay</b></div><div className={styles.connection}><i aria-hidden="true" /><span>n8n connected</span></div></header>
      <div className={styles.guide}><strong>Review an AI agent change against prior conversation outcomes.</strong><span>Replay uses synthetic conversations. It never calls a production tool, writes customer data or changes the live agent.</span></div>
      <div className={styles.workspace}>
        <aside className={styles.sidebar}><div className={styles.sidebarHead}><span>Example changes</span><small>Choose one</small></div><div className={styles.scenarios}>{(Object.keys(states) as Version[]).map(key => <button type="button" aria-pressed={version === key} className={version === key ? styles.selected : ""} key={key} onClick={() => { setVersion(key); setResult(null); setActed(false); setComparingCurrent(false) }}><strong>{states[key].label}</strong><small>{states[key].note}</small></button>)}</div><footer><IconShieldCheck size={15} aria-hidden="true" /><span>Replay mode</span></footer></aside>
        <div className={styles.canvas}>
          <section className={styles.decision}><div className={styles.impactVisual}><span>Can this agent change be published?</span><strong>{state.impact}</strong><small>across 3 representative conversations</small></div><div><h3>{state.recommendation}</h3><p>{state.copy}</p><div className={styles.decisionReasons} aria-label="Why this recommendation"><span>{state.reasons[0]}</span><span>{state.reasons[1]}</span></div>{result && <small className={styles.liveDecision} role="status" aria-live="polite">{result.decision}</small>}</div><div className={styles.outcomeDelta} aria-label="Representative agent outcome changes">{state.rows.map(row => <article key={row[0]}><header><strong>{row[0]}</strong><b>{row[3]}</b></header><div className={styles.deltaRoute}><div><small>Current agent</small><span>{row[1]}</span></div><i aria-hidden="true"><IconArrowRight size={14} /></i><div className={styles.proposedStep}><small>Proposed agent</small><span>{row[2]}</span></div></div></article>)}</div><button type="button" className={styles.run} onClick={result ? () => setActed(true) : runReplay} disabled={running || acted}>{running ? "Running replay" : acted ? <><IconCheck size={16} /> {state.confirmation}</> : result ? <><IconCheck size={16} /> {state.action}</> : <><IconPlayerPlay size={16} /> Run replay</>}</button></section>
          <details className={styles.caseDetails}><summary><span>View changed cases</span><small>Compare every sampled route</small></summary><section className={styles.replay}><header><div><IconFileDiff size={16} aria-hidden="true" /><span>Historical comparison</span></div><button type="button" aria-pressed={comparingCurrent} className={comparingCurrent ? styles.comparing : ""} onClick={() => setComparingCurrent(value => !value)}><IconSparkles size={15} aria-hidden="true" /> {comparingCurrent ? "Show proposed" : "Compare to current"}</button></header>{state.rows.map(row => <article key={row[0]}><strong>{row[0]}</strong><span>{row[1]}</span><IconArrowRight size={14} aria-hidden="true" /><span>{comparingCurrent ? row[1] : row[2]}</span><b>{comparingCurrent ? "CURRENT" : row[3]}</b></article>)}</section></details>
          <section className={styles.orchestration} aria-labelledby="n8n-workflow-title"><header><div><span>Live orchestration</span><h3 id="n8n-workflow-title">The replay itself runs through n8n.</h3></div><b><i /> Published workflow</b></header><div className={styles.orchestrationFlow} aria-label="n8n replay workflow"><div><IconWebhook size={18} /><span>Webhook</span><small>Receive scenario</small></div><IconArrowRight size={16} /><div><IconShieldCheck size={18} /><span>Validate scenario</span><small>Allowlisted input</small></div><IconArrowRight size={16} /><div><IconHierarchy size={18} /><span>Evaluate policy</span><small>Decision by scenario</small></div><IconArrowRight size={16} /><div><IconApi size={18} /><span>Build receipt</span><small>Typed decision JSON</small></div></div><div className={styles.execution}><div className={styles.executionSummary}><span className={result ? styles.executed : ""}><IconCheck size={15} /> {result ? "Execution received" : "Ready for execution"}</span><small><IconClock size={14} /> {result?.proxyLatencyMs ? `${result.proxyLatencyMs} ms round trip` : "Runs when you select Run replay"}</small>{result?.generatedAt && <time dateTime={result.generatedAt}>{new Date(result.generatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</time>}</div><details className={styles.payload}><summary><IconBraces size={15} /> Inspect payload contract</summary><div><section><span>Input</span><pre>{replayInput}</pre></section><section><span>Output</span><pre>{replayOutput}</pre></section></div></details><details className={styles.canvasProof}><summary>View the published n8n canvas</summary><Image src="/images/lab/workflow-impact-n8n.png" alt="Published n8n workflow with separate webhook, scenario validation, replay policy and execution receipt nodes" width={668} height={674} /></details></div></section>
          <details className={styles.workflowDetails} open><summary><div><span>Agent under review</span><strong>Proposed n8n agent workflow</strong></div><small>7 nodes · AI support agent</small></summary><div className={styles.flow} aria-label="Proposed AI support agent workflow"><div className={styles.flowStage}><span>Understand</span><div><IconWebhook size={18} /><b>Chat Trigger</b><small>New support message</small></div><IconArrowRight size={17} /><div><IconHierarchy size={18} /><b>Load memory</b><small>Conversation history</small></div></div><div className={styles.flowStage}><span>Reason</span><div><IconApi size={18} /><b>Retrieve policy</b><small>Approved knowledge only</small></div><IconArrowRight size={17} /><div className={!comparingCurrent && version === "broken" ? styles.danger : ""}><IconSparkles size={18} /><b>AI Agent</b><small>{comparingCurrent ? "Current prompt + model" : "Proposed prompt + model"}</small></div></div><div className={styles.flowStage}><span>Act safely</span><div className={!comparingCurrent && version === "changed" ? styles.emphasis : ""}><IconHierarchy size={18} /><b>Select tool</b><small>Answer, ticket or CRM</small></div><IconArrowRight size={17} /><div><IconShieldCheck size={18} /><b>Human review</b><small>Required for external writes</small></div><IconArrowRight size={17} /><div><IconCheck size={18} /><b>Reply and log</b><small>Response + execution trace</small></div></div></div></details>
        </div>
      </div>
    </div>
    <small className={styles.note}>The agent is the system under review; the replay verdict comes from a deterministic n8n workflow. Conversations are synthetic, and no production model, tool or customer record is called or changed.</small>
  </section>
}

export function WorkflowImpactPreviewCover() {
  return <div className="workflow-impact-cover" aria-hidden="true"><header><span>Agent impact</span><b>Preview</b></header><div><span>Before you publish</span><strong>replay its behaviour.</strong></div><footer><i /><i /><i /><b>6 changed</b></footer></div>
}
