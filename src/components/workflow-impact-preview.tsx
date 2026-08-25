"use client"

import { useState } from "react"
import { IconAlertTriangle, IconArrowRight, IconCheck, IconFileDiff, IconPlayerPlay, IconShieldCheck } from "@tabler/icons-react"
import styles from "./workflow-impact-preview.module.css"

type Version = "safe" | "changed" | "broken"
type ReplayResult = { decision: string; generatedAt: string; source: string }
const states: Record<Version, { label: string; impact: string; title: string; copy: string; rows: [string, string, string, string][] }> = {
  safe: { label: "Copy refinement", impact: "0 changed runs", title: "No material side effects found.", copy: "The proposed workflow preserves routing and outbound actions in the sampled runs.", rows: [["Refund request", "Draft response", "Draft response", "MATCH"], ["Account access", "Escalate", "Escalate", "MATCH"], ["Invoice question", "Draft response", "Draft response", "MATCH"]] },
  changed: { label: "Routing rule", impact: "6 changed runs", title: "Six past runs would take a different path.", copy: "The new rule would send some enterprise requests directly to an external reply step.", rows: [["Enterprise access", "Human review", "Send external reply", "NEW SIDE EFFECT"], ["Refund request", "Draft response", "Send external reply", "NEW SIDE EFFECT"], ["Account access", "Escalate", "Human review", "ROUTE CHANGED"]] },
  broken: { label: "Credential migration", impact: "3 failing runs", title: "Three executions stop before the action node.", copy: "The new connection lacks write scope. No message is sent, but the workflow fails after classification.", rows: [["Account access", "Update CRM", "Missing write scope", "FAILS"], ["Enterprise access", "Update CRM", "Missing write scope", "FAILS"], ["Refund request", "Update CRM", "Missing write scope", "FAILS"]] },
}

export function WorkflowImpactPreview() {
  const [version, setVersion] = useState<Version>("changed")
  const [result, setResult] = useState<ReplayResult | null>(null)
  const [running, setRunning] = useState(false)
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
  return <section className={`${styles.root} workflow-impact`} id="workflow-impact"><header><span>Independent product exploration</span><h2>See the effect of a workflow change before it goes live.</h2><p>A replay model for automation builders. It separates a changed route from a new external side effect or a broken permission.</p></header><div className="workflow-console"><div className="workflow-bar"><span>Support intake automation</span><small><IconShieldCheck size={14} /> Replay only. No actions sent.</small></div><div className="workflow-tabs">{(Object.keys(states) as Version[]).map(key => <button className={version === key ? "is-active" : ""} key={key} onClick={() => { setVersion(key); setResult(null) }}>{states[key].label}</button>)}</div><div className={`workflow-reading is-${version}`}><section><span>Proposed change</span><h3>{state.title}</h3><div className="workflow-flow"><b>Trigger</b><IconArrowRight size={14}/><b>Classify</b><IconArrowRight size={14}/><b>Route</b><IconArrowRight size={14}/><b>Act</b></div></section><aside><strong>{state.impact}</strong><p>{state.copy}</p></aside></div><section className="workflow-runs"><header><div><IconFileDiff size={16}/><h3>Historical replay</h3></div><span>Current / proposed</span></header>{state.rows.map(row => <article key={row[0]}><strong>{row[0]}</strong><span>{row[1]}</span><IconArrowRight size={14}/><span>{row[2]}</span><b>{row[3]}</b></article>)}</section><footer><span><IconAlertTriangle size={16}/>{result ? `${result.decision} · ${result.source || "Replay did not complete"}` : "Run a real replay before publishing."}</span><button onClick={runReplay} disabled={running}>{running ? <>Running replay…</> : result ? <><IconCheck size={16}/>Replay complete</> : <><IconPlayerPlay size={16}/>Run replay</>}</button></footer></div><small className="workflow-note">The action calls a published n8n webhook with synthetic scenarios. It never reads or writes customer workflow data.</small></section>
}

export function WorkflowImpactPreviewCover() {
  return <div className="workflow-impact-cover" aria-hidden="true"><header><span>Workflow impact</span><b>Preview</b></header><div><span>Before you publish</span><strong>see what changes.</strong></div><footer><i /><i /><i /><b>6 changed</b></footer></div>
}
