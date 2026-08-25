"use client"

import { useState } from "react"
import { IconAlertTriangle, IconArrowRight, IconBolt, IconCheck, IconChevronRight, IconFileDiff, IconHierarchy, IconLayoutSidebar, IconPlayerPlay, IconShieldCheck, IconSparkles } from "@tabler/icons-react"
import styles from "./workflow-impact-preview.module.css"

type Version = "safe" | "changed" | "broken"
type ReplayResult = { decision: string; generatedAt: string; source: string }
const states: Record<Version, { label: string; note: string; impact: string; title: string; copy: string; rows: [string, string, string, string][] }> = {
  safe: { label: "Copy refinement", note: "No routing change", impact: "0 changed runs", title: "No material side effects found.", copy: "The proposed workflow preserves routing and outbound actions in the sampled runs.", rows: [["Refund request", "Draft response", "Draft response", "MATCH"], ["Account access", "Escalate", "Escalate", "MATCH"], ["Invoice question", "Draft response", "Draft response", "MATCH"]] },
  changed: { label: "Routing rule", note: "Route reaches an external action", impact: "6 changed runs", title: "Six past runs would take a different path.", copy: "The new rule would send some enterprise requests directly to an external reply step.", rows: [["Enterprise access", "Human review", "Send external reply", "NEW SIDE EFFECT"], ["Refund request", "Draft response", "Send external reply", "NEW SIDE EFFECT"], ["Account access", "Escalate", "Human review", "ROUTE CHANGED"]] },
  broken: { label: "Credential migration", note: "Permission missing", impact: "3 failing runs", title: "Three executions stop before the action node.", copy: "The new connection lacks write scope. No message is sent, but the workflow fails after classification.", rows: [["Account access", "Update CRM", "Missing write scope", "FAILS"], ["Enterprise access", "Update CRM", "Missing write scope", "FAILS"], ["Refund request", "Update CRM", "Missing write scope", "FAILS"]] },
}

export function WorkflowImpactPreview() {
  const [version, setVersion] = useState<Version>("changed")
  const [result, setResult] = useState<ReplayResult | null>(null)
  const [running, setRunning] = useState(false)
  const [comparingCurrent, setComparingCurrent] = useState(false)
  const state = states[version]

  async function runReplay() {
    setRunning(true)
    setResult(null)
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
      <div className={styles.guide}><div><strong>Review a workflow change before publishing.</strong><span>Replay uses synthetic tickets. It never sends a message or writes to a customer system.</span></div><ol><li><b>1</b> Choose a change</li><li><b>2</b> Review the route</li><li><b>3</b> Run the replay</li></ol></div>
      <div className={styles.workspace}>
        <aside className={styles.sidebar}><div className={styles.sidebarHead}><span>1. Choose a change</span><small>Impact preview</small></div><div className={styles.scenarios}>{(Object.keys(states) as Version[]).map(key => <button className={version === key ? styles.selected : ""} key={key} onClick={() => { setVersion(key); setResult(null); setComparingCurrent(false) }}><strong>{states[key].label}</strong><small>{states[key].note}</small></button>)}</div><footer><IconShieldCheck size={15} /><span>Replay mode</span></footer></aside>
        <main className={styles.canvas}>
          <div className={styles.canvasHead}><div><span>2. {comparingCurrent ? "Current workflow" : "Review the proposed workflow"}</span><h3>{comparingCurrent ? "This is the route users follow today." : state.title}</h3></div><button className={comparingCurrent ? styles.comparing : ""} onClick={() => setComparingCurrent(value => !value)}><IconSparkles size={15} /> {comparingCurrent ? "Show proposed" : "Compare to current"}</button></div>
          <div className={styles.flow} aria-label="Support automation flow"><div className={styles.flowStage}><span>Understand</span><div><IconBolt size={18} /><b>New ticket</b><small>Receives the request</small></div><IconArrowRight size={17} /><div><IconSparkles size={18} /><b>Detect intent</b><small>Identifies the request</small></div></div><div className={styles.flowStage}><span>Check context</span><div><IconHierarchy size={18} /><b>Find account</b><small>Loads customer context</small></div><IconArrowRight size={17} /><div><IconShieldCheck size={18} /><b>Check policy</b><small>Applies support rules</small></div></div><div className={styles.flowStage}><span>Decide and act</span><div className={!comparingCurrent && version === "changed" ? styles.emphasis : ""}><IconHierarchy size={18} /><b>Set owner</b><small>{comparingCurrent ? "Uses current route" : "Uses proposed route"}</small></div><IconArrowRight size={17} /><div><IconCheck size={18} /><b>Approve reply</b><small>Human control point</small></div><IconArrowRight size={17} /><div className={!comparingCurrent && version === "broken" ? styles.danger : ""}><IconCheck size={18} /><b>Send and log</b><small>Updates the system</small></div></div></div>
          <section className={styles.replay}><header><div><IconFileDiff size={16} /><span>Historical replay</span></div><small>{comparingCurrent ? "Current route" : "Current → proposed"}</small></header>{state.rows.map(row => <article key={row[0]}><strong>{row[0]}</strong><span>{row[1]}</span><IconArrowRight size={14} /><span>{comparingCurrent ? row[1] : row[2]}</span><b>{comparingCurrent ? "CURRENT" : row[3]}</b></article>)}</section>
        </main>
        <aside className={styles.impact}><header><span>3. Check impact</span><IconAlertTriangle size={17} /></header><strong className={styles.impactNumber}>{state.impact}</strong><p>{state.copy}</p><div className={styles.signal}><span>Replay coverage</span><b>3 recent paths</b><div><i /><i /><i /><i /><i /></div></div><div className={styles.liveResult}>{result ? <><span>Live result</span><strong>{result.decision}</strong><small>{result.source || "No response returned"}</small></> : <><span>Ready to replay</span><strong>Run the selected change safely.</strong><small>The result explains whether to publish, review or fix it first.</small></>}</div><button className={styles.run} onClick={runReplay} disabled={running}>{running ? "Running replay" : result ? <><IconCheck size={16} /> Replay complete</> : <><IconPlayerPlay size={16} /> Run replay</>}</button></aside>
      </div>
    </div>
    <small className={styles.note}>The action calls a published n8n webhook. The data is synthetic and no customer workflow is read or changed.</small>
  </section>
}

export function WorkflowImpactPreviewCover() {
  return <div className="workflow-impact-cover" aria-hidden="true"><header><span>Workflow impact</span><b>Preview</b></header><div><span>Before you publish</span><strong>see what changes.</strong></div><footer><i /><i /><i /><b>6 changed</b></footer></div>
}
