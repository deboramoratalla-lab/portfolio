"use client"

import { useRef, useState } from "react"
import { motion } from "motion/react"
import { IconAlertTriangle, IconArrowRight, IconBolt, IconCheck, IconChevronRight, IconFileDiff, IconHierarchy, IconLayoutSidebar, IconPlayerPlay, IconShieldCheck, IconSparkles } from "@tabler/icons-react"
import styles from "./workflow-impact-preview.module.css"

type Version = "safe" | "changed" | "broken"
type ReplayResult = { decision: string; generatedAt: string; source: string }
type NodeId = "intake" | "classify" | "lookup" | "policy" | "route" | "approve" | "act"
type NodePosition = Record<NodeId, { x: number; y: number }>

const initialNodePositions: NodePosition = {
  intake: { x: 20, y: 124 },
  classify: { x: 140, y: 48 },
  lookup: { x: 140, y: 194 },
  policy: { x: 268, y: 48 },
  route: { x: 268, y: 194 },
  approve: { x: 398, y: 48 },
  act: { x: 398, y: 194 },
}

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
  const [nodePositions, setNodePositions] = useState<NodePosition>(initialNodePositions)
  const flowRef = useRef<HTMLDivElement>(null)
  const state = states[version]

  function moveNode(node: NodeId, offset: { x: number; y: number }) {
    setNodePositions(current => ({ ...current, [node]: { x: Math.max(8, Math.min(430, current[node].x + offset.x)), y: Math.max(34, Math.min(204, current[node].y + offset.y)) } }))
  }

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
      <div className={styles.workspace}>
        <aside className={styles.sidebar}><div className={styles.sidebarHead}><span>Choose a scenario</span><small>Impact preview</small></div><div className={styles.scenarios}>{(Object.keys(states) as Version[]).map(key => <button className={version === key ? styles.selected : ""} key={key} onClick={() => { setVersion(key); setResult(null); setComparingCurrent(false) }}><strong>{states[key].label}</strong><small>{states[key].note}</small></button>)}</div><footer><IconShieldCheck size={15} /><span>Replay mode</span></footer></aside>
        <main className={styles.canvas}>
          <div className={styles.canvasHead}><div><span>{comparingCurrent ? "Current workflow" : "Proposed workflow"}</span><h3>{comparingCurrent ? "This is the route users follow today." : state.title}</h3></div><button className={comparingCurrent ? styles.comparing : ""} onClick={() => setComparingCurrent(value => !value)}><IconSparkles size={15} /> {comparingCurrent ? "Show proposed" : "Compare to current"}</button></div>
          <motion.div ref={flowRef} className={styles.flow} aria-label="Workflow canvas"><span className={styles.flowHint}>Drag cards to rearrange the canvas. Routing stays unchanged.</span><svg className={styles.edges} aria-hidden="true" viewBox="0 0 560 286" preserveAspectRatio="none"><path d={`M ${nodePositions.intake.x + 118} ${nodePositions.intake.y + 38} C ${nodePositions.intake.x + 136} ${nodePositions.intake.y + 38}, ${nodePositions.classify.x - 18} ${nodePositions.classify.y + 38}, ${nodePositions.classify.x} ${nodePositions.classify.y + 38}`} /><path d={`M ${nodePositions.intake.x + 118} ${nodePositions.intake.y + 38} C ${nodePositions.intake.x + 136} ${nodePositions.intake.y + 38}, ${nodePositions.lookup.x - 18} ${nodePositions.lookup.y + 38}, ${nodePositions.lookup.x} ${nodePositions.lookup.y + 38}`} /><path d={`M ${nodePositions.classify.x + 118} ${nodePositions.classify.y + 38} C ${nodePositions.classify.x + 136} ${nodePositions.classify.y + 38}, ${nodePositions.policy.x - 18} ${nodePositions.policy.y + 38}, ${nodePositions.policy.x} ${nodePositions.policy.y + 38}`} /><path d={`M ${nodePositions.lookup.x + 118} ${nodePositions.lookup.y + 38} C ${nodePositions.lookup.x + 136} ${nodePositions.lookup.y + 38}, ${nodePositions.route.x - 18} ${nodePositions.route.y + 38}, ${nodePositions.route.x} ${nodePositions.route.y + 38}`} /><path d={`M ${nodePositions.policy.x + 118} ${nodePositions.policy.y + 38} C ${nodePositions.policy.x + 136} ${nodePositions.policy.y + 38}, ${nodePositions.route.x - 18} ${nodePositions.route.y + 38}, ${nodePositions.route.x} ${nodePositions.route.y + 38}`} /><path d={`M ${nodePositions.route.x + 118} ${nodePositions.route.y + 38} C ${nodePositions.route.x + 136} ${nodePositions.route.y + 38}, ${nodePositions.approve.x - 18} ${nodePositions.approve.y + 38}, ${nodePositions.approve.x} ${nodePositions.approve.y + 38}`} /><path d={`M ${nodePositions.approve.x + 118} ${nodePositions.approve.y + 38} C ${nodePositions.approve.x + 136} ${nodePositions.approve.y + 38}, ${nodePositions.act.x - 18} ${nodePositions.act.y + 38}, ${nodePositions.act.x} ${nodePositions.act.y + 38}`} /></svg><motion.div drag dragConstraints={flowRef} dragElastic={0.04} dragMomentum={false} onDragEnd={(_, info) => moveNode("intake", info.offset)} style={{ left: nodePositions.intake.x, top: nodePositions.intake.y }} className={styles.node}><IconBolt size={17} /><span>New ticket</span><small>Trigger</small></motion.div><motion.div drag dragConstraints={flowRef} dragElastic={0.04} dragMomentum={false} onDragEnd={(_, info) => moveNode("classify", info.offset)} style={{ left: nodePositions.classify.x, top: nodePositions.classify.y }} className={styles.node}><IconSparkles size={17} /><span>Detect intent</span><small>AI step</small></motion.div><motion.div drag dragConstraints={flowRef} dragElastic={0.04} dragMomentum={false} onDragEnd={(_, info) => moveNode("lookup", info.offset)} style={{ left: nodePositions.lookup.x, top: nodePositions.lookup.y }} className={styles.node}><IconHierarchy size={17} /><span>Find account</span><small>Customer data</small></motion.div><motion.div drag dragConstraints={flowRef} dragElastic={0.04} dragMomentum={false} onDragEnd={(_, info) => moveNode("policy", info.offset)} style={{ left: nodePositions.policy.x, top: nodePositions.policy.y }} className={styles.node}><IconShieldCheck size={17} /><span>Check policy</span><small>Rules</small></motion.div><motion.div drag dragConstraints={flowRef} dragElastic={0.04} dragMomentum={false} onDragEnd={(_, info) => moveNode("route", info.offset)} style={{ left: nodePositions.route.x, top: nodePositions.route.y }} className={`${styles.node} ${!comparingCurrent && version === "changed" ? styles.emphasis : ""}`}><IconHierarchy size={17} /><span>Set owner</span><small>{comparingCurrent ? "Current rule" : "Rule changed"}</small></motion.div><motion.div drag dragConstraints={flowRef} dragElastic={0.04} dragMomentum={false} onDragEnd={(_, info) => moveNode("approve", info.offset)} style={{ left: nodePositions.approve.x, top: nodePositions.approve.y }} className={styles.node}><IconCheck size={17} /><span>Approve reply</span><small>Human check</small></motion.div><motion.div drag dragConstraints={flowRef} dragElastic={0.04} dragMomentum={false} onDragEnd={(_, info) => moveNode("act", info.offset)} style={{ left: nodePositions.act.x, top: nodePositions.act.y }} className={`${styles.node} ${!comparingCurrent && version === "broken" ? styles.danger : ""}`}><IconCheck size={17} /><span>Send & log</span><small>External action</small></motion.div></motion.div>
          <section className={styles.replay}><header><div><IconFileDiff size={16} /><span>Historical replay</span></div><small>{comparingCurrent ? "Current route" : "Current → proposed"}</small></header>{state.rows.map(row => <article key={row[0]}><strong>{row[0]}</strong><span>{row[1]}</span><IconArrowRight size={14} /><span>{comparingCurrent ? row[1] : row[2]}</span><b>{comparingCurrent ? "CURRENT" : row[3]}</b></article>)}</section>
        </main>
        <aside className={styles.impact}><header><span>Impact estimate</span><IconAlertTriangle size={17} /></header><strong className={styles.impactNumber}>{state.impact}</strong><p>{state.copy}</p><div className={styles.signal}><span>Replay coverage</span><b>3 recent paths</b><div><i /><i /><i /><i /><i /></div></div><div className={styles.liveResult}>{result ? <><span>Live result</span><strong>{result.decision}</strong><small>{result.source || "No response returned"}</small></> : <><span>Ready to replay</span><strong>Check before publish.</strong><small>The test uses synthetic scenarios only.</small></>}</div><button className={styles.run} onClick={runReplay} disabled={running}>{running ? "Running replay" : result ? <><IconCheck size={16} /> Replay complete</> : <><IconPlayerPlay size={16} /> Run replay</>}</button></aside>
      </div>
    </div>
    <small className={styles.note}>The action calls a published n8n webhook. The data is synthetic and no customer workflow is read or changed.</small>
  </section>
}

export function WorkflowImpactPreviewCover() {
  return <div className="workflow-impact-cover" aria-hidden="true"><header><span>Workflow impact</span><b>Preview</b></header><div><span>Before you publish</span><strong>see what changes.</strong></div><footer><i /><i /><i /><b>6 changed</b></footer></div>
}
