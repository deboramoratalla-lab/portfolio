"use client"

import { useState } from "react"
import { IconArrowRight, IconBolt, IconCheck, IconChevronRight, IconFileDiff, IconHierarchy, IconLayoutSidebar, IconPlayerPlay, IconShieldCheck, IconSparkles } from "@tabler/icons-react"
import styles from "./workflow-impact-preview.module.css"

type Version = "safe" | "changed" | "broken"
type ReplayResult = { decision: string; generatedAt: string; source: string }
type State = { label: string; note: string; impact: string; title: string; copy: string; recommendation: string; action: string; confirmation: string; rows: [string, string, string, string][] }
const states: Record<Version, State> = {
  safe: { label: "Copy refinement", note: "No routing change", impact: "0 changed runs", title: "No material side effects found.", copy: "The proposed workflow preserves routing and outbound actions in the sampled runs.", recommendation: "Safe to publish", action: "Publish change", confirmation: "Marked ready to publish. No workflow was changed.", rows: [["Refund request", "Draft response", "Draft response", "MATCH"], ["Account access", "Escalate", "Escalate", "MATCH"], ["Invoice question", "Draft response", "Draft response", "MATCH"]] },
  changed: { label: "Routing rule", note: "Route reaches an external action", impact: "6 changed runs", title: "Six past runs would take a different path.", copy: "The new rule would send some enterprise requests directly to an external reply step.", recommendation: "Request review before publishing", action: "Request review", confirmation: "Review request prepared. No workflow was changed.", rows: [["Enterprise access", "Human review", "Send external reply", "NEW SIDE EFFECT"], ["Refund request", "Draft response", "Send external reply", "NEW SIDE EFFECT"], ["Account access", "Escalate", "Human review", "ROUTE CHANGED"]] },
  broken: { label: "Credential migration", note: "Permission missing", impact: "3 failing runs", title: "Three executions stop before the action node.", copy: "The new connection lacks write scope. No message is sent, but the workflow fails after classification.", recommendation: "Fix permission before publishing", action: "Fix permission", confirmation: "Permission issue recorded. No workflow was changed.", rows: [["Account access", "Update CRM", "Missing write scope", "FAILS"], ["Enterprise access", "Update CRM", "Missing write scope", "FAILS"], ["Refund request", "Update CRM", "Missing write scope", "FAILS"]] },
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

  return <section className={styles.root} id="workflow-impact">
    <header className={styles.intro}><span>Independent product exploration</span><h2>Change the workflow, not the outcome by accident.</h2><p>A replay surface for seeing what an automation will do before it is published.</p></header>
    <div className={styles.app}>
      <header className={styles.toolbar}><div className={styles.identity}><span className={styles.mark}><IconHierarchy size={17} /></span><strong>Relay</strong><span>Support operations</span></div><div className={styles.toolbarCenter}><button aria-label="Workflow view"><IconLayoutSidebar size={16} /></button><span>Workflow review</span><IconChevronRight size={15} /><b>Pre-publish replay</b></div><div className={styles.connection}><i /><span>n8n connected</span></div></header>
      <div className={styles.guide}><strong>Review a proposed change against historical outcomes.</strong><span>Replay uses synthetic tickets. It never sends a message or writes to a customer system.</span></div>
      <div className={styles.workspace}>
        <aside className={styles.sidebar}><div className={styles.sidebarHead}><span>Example changes</span><small>Choose one</small></div><div className={styles.scenarios}>{(Object.keys(states) as Version[]).map(key => <button className={version === key ? styles.selected : ""} key={key} onClick={() => { setVersion(key); setResult(null); setActed(false); setComparingCurrent(false) }}><strong>{states[key].label}</strong><small>{states[key].note}</small></button>)}</div><footer><IconShieldCheck size={15} /><span>Replay mode</span></footer></aside>
        <main className={styles.canvas}>
          <section className={styles.decision}><div className={styles.impactVisual}><span>Can this change be published?</span><strong>{state.impact}</strong><div className={styles.impactBars} aria-label="Three representative historical paths"><span className={version === "safe" ? styles.match : styles.changed} /><span className={version === "safe" ? styles.match : styles.changed} /><span className={version === "broken" ? styles.failed : version === "safe" ? styles.match : styles.changed} /></div><small>3 representative paths</small></div><div><h3>{state.recommendation}</h3><p>{state.copy}</p>{result && <small className={styles.liveDecision}>{result.decision}</small>}</div><button className={styles.run} onClick={result ? () => setActed(true) : runReplay} disabled={running || acted}>{running ? "Running replay" : acted ? <><IconCheck size={16} /> {state.confirmation}</> : result ? <><IconCheck size={16} /> {state.action}</> : <><IconPlayerPlay size={16} /> Run replay</>}</button></section>
          <section className={styles.replay}><header><div><IconFileDiff size={16} /><span>Historical comparison</span></div><button className={comparingCurrent ? styles.comparing : ""} onClick={() => setComparingCurrent(value => !value)}><IconSparkles size={15} /> {comparingCurrent ? "Show proposed" : "Compare to current"}</button></header>{state.rows.map(row => <article key={row[0]}><strong>{row[0]}</strong><span>{row[1]}</span><IconArrowRight size={14} /><span>{comparingCurrent ? row[1] : row[2]}</span><b>{comparingCurrent ? "CURRENT" : row[3]}</b></article>)}</section>
          <details className={styles.workflowDetails}><summary><span>Workflow details</span><small>Inspect the route behind this outcome</small></summary><div className={styles.flow} aria-label="Support automation flow"><div className={styles.flowStage}><span>Understand</span><div><IconBolt size={18} /><b>New ticket</b><small>Receives the request</small></div><IconArrowRight size={17} /><div><IconSparkles size={18} /><b>Detect intent</b><small>Identifies the request</small></div></div><div className={styles.flowStage}><span>Check context</span><div><IconHierarchy size={18} /><b>Find account</b><small>Loads customer context</small></div><IconArrowRight size={17} /><div><IconShieldCheck size={18} /><b>Check policy</b><small>Applies support rules</small></div></div><div className={styles.flowStage}><span>Decide and act</span><div className={!comparingCurrent && version === "changed" ? styles.emphasis : ""}><IconHierarchy size={18} /><b>Set owner</b><small>{comparingCurrent ? "Uses current route" : "Uses proposed route"}</small></div><IconArrowRight size={17} /><div><IconCheck size={18} /><b>Approve reply</b><small>Human control point</small></div><IconArrowRight size={17} /><div className={!comparingCurrent && version === "broken" ? styles.danger : ""}><IconCheck size={18} /><b>Send and log</b><small>Updates the system</small></div></div></div></details>
        </main>
      </div>
    </div>
    <small className={styles.note}>The action calls a published n8n webhook. The data is synthetic and no customer workflow is read or changed.</small>
  </section>
}

export function WorkflowImpactPreviewCover() {
  return <div className="workflow-impact-cover" aria-hidden="true"><header><span>Workflow impact</span><b>Preview</b></header><div><span>Before you publish</span><strong>see what changes.</strong></div><footer><i /><i /><i /><b>6 changed</b></footer></div>
}
