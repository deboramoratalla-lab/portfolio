"use client"

import { useState } from "react"
import { IconArrowRight, IconCheck, IconChevronRight, IconClock, IconFileDiff, IconHierarchy, IconMinus, IconPlayerPlay, IconPlus, IconSearch, IconSettings, IconShieldCheck, IconWebhook } from "@tabler/icons-react"
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

  const riskLabel = version === "safe" ? "Ready" : version === "changed" ? "Needs approval" : "Fix required"

  return <section className={styles.previewSection} id="workflow-impact">
    <header className={styles.previewHeading}><span>n8n / behaviour preview</span><h2>Review the route before you run it.</h2><p>Test one draft change against real conversation traces. Nothing writes to production.</p></header>
    <div className={styles.productWindow}>
      <header className={styles.productBar}><div className={styles.productName}><span className={styles.productLogo}><IconHierarchy size={16}/></span><b>Relay</b><span>Draft / support-agent</span></div><button className={styles.startButton} type="button" onClick={runReplay} disabled={running}><IconPlayerPlay size={14}/>{running ? "Running" : "Start"}</button><div className={styles.productTools}><span><i/>n8n live</span><button type="button">Share</button></div></header>
      <div className={styles.productBody}>
        <nav className={styles.toolRail} aria-label="Workspace tools"><button type="button" aria-label="Workflows"><IconHierarchy size={17}/></button><button type="button" aria-label="Search"><IconSearch size={17}/></button><button type="button" className={styles.toolActive} aria-label="Impact preview"><IconFileDiff size={17}/></button><button type="button" aria-label="Executions"><IconClock size={17}/></button><button type="button" aria-label="Settings"><IconSettings size={17}/></button><span/><button type="button" aria-label="Security"><IconShieldCheck size={17}/></button></nav>
        <aside className={styles.blockLibrary}><div className={styles.libraryTitle}><span>Draft changes</span><small>3</small></div><label className={styles.librarySearch}><IconSearch size={14}/><input aria-label="Find a change" placeholder="Find" readOnly /></label><div className={styles.libraryGroup}><header><span>Agent configuration</span><IconChevronRight size={14}/></header>{(Object.keys(states) as Version[]).map(key=><button type="button" key={key} aria-pressed={version===key} className={version===key?styles.librarySelected:""} onClick={()=>{setVersion(key);setResult(null);setActed(false);setComparingCurrent(false)}}><span className={`${styles.blockIcon} ${styles[key]}`}><IconHierarchy size={15}/></span><span><b>{states[key].label}</b><small>{states[key].path}</small></span><i>{key==="safe"?"M":key==="changed"?"+":"!"}</i></button>)}</div><div className={styles.libraryGroup}><header><span>Replay source</span><IconChevronRight size={14}/></header><div className={styles.sourceItem}><span className={styles.blockIcon}><IconWebhook size={15}/></span><span><b>Conversation history</b><small>3 selected traces</small></span></div></div><footer><span><i/>production-shadow</span><small>Writes disabled</small></footer></aside>
        <main className={styles.workflowStage}>
          <div className={styles.stageControls}><button type="button"><IconPlus size={14}/></button><span>110%</span><button type="button"><IconMinus size={14}/></button></div>
          <svg className={styles.workflowLines} viewBox="0 0 900 620" preserveAspectRatio="none" aria-hidden="true"><path d="M448 102 V170"/><path d="M448 244 V305"/><path d="M448 379 V415 C448 450 270 438 270 488"/><path d="M448 379 V488"/><path d="M448 379 V415 C448 450 626 438 626 488"/></svg>
          <article className={`${styles.workflowBlock} ${styles.inputBlock}`}><span className={styles.blockIcon}><IconWebhook size={16}/></span><div><small>Replay source</small><b>3 past conversations</b><p>Production traces · redacted</p></div><i>3</i></article>
          <span className={`${styles.lineLabel} ${styles.firstLabel}`}>load traces</span>
          <article className={`${styles.workflowBlock} ${styles.focusBlock}`}><span className={styles.blockIcon}><IconHierarchy size={16}/></span><div><small>Draft change</small><b>{state.label}</b><p>{state.note}</p></div><i>1</i></article>
          <span className={`${styles.lineLabel} ${styles.secondLabel}`}>replay both versions</span>
          {state.rows.map((row,index)=><article key={row[0]} className={`${styles.workflowBlock} ${styles.resultBlock} ${styles[`resultPosition${index+1}`]}`}><span className={styles.blockIcon}>{row[3]==="MATCH"?<IconCheck size={16}/>:<IconArrowRight size={16}/>}</span><div><small>{row[0]}</small><b>{comparingCurrent?row[1]:row[2]}</b><p>{comparingCurrent?"current route":row[3].toLowerCase()}</p></div></article>)}
          <button className={styles.addBlock} type="button" aria-label="Add workflow step"><IconPlus size={15}/></button>
          <div className={styles.stageFooter}><span><i/>{result?"Replay completed":"Ready to replay"}</span><span><IconClock size={13}/>{result?.proxyLatencyMs?`${result.proxyLatencyMs} ms`:"Webhook connected"}</span></div>
        </main>
        <aside className={`${styles.configurationPanel} ${styles[version]}`}><header><button type="button">Setup</button><button type="button" className={styles.configActive}>Configure</button><button type="button">Test</button></header><section className={styles.configHeading}><span className={styles.configIcon}><IconHierarchy size={17}/></span><div><small>{state.path}</small><h3>{state.label}</h3></div></section><div className={styles.configField}><label>Status</label><div className={styles.statusValue}><i/>{riskLabel}</div><small>{state.recommendation}</small></div><div className={styles.configField}><label>Observed impact</label><strong>{state.impact}</strong></div><div className={styles.configField}><label>Execution changes</label><ul><li>{state.reasons[0]}</li><li>{state.reasons[1]}</li></ul></div><div className={styles.configField}><label>Review summary</label><p>{state.copy}</p></div><button type="button" className={styles.compareButton} aria-pressed={comparingCurrent} onClick={()=>setComparingCurrent(value=>!value)}><IconFileDiff size={15}/>{comparingCurrent?"Showing current":"Compare with current"}</button>{result&&<p className={styles.executionMessage} role="status">{result.decision}</p>}<footer><button type="button" onClick={result?()=>setActed(true):runReplay} disabled={running||acted}>{running?"Running replay":acted?<><IconCheck size={15}/>Saved</>:result?state.action:<><IconPlayerPlay size={15}/>Save & test</>}</button><small>Read-only execution</small></footer></aside>
      </div>
    </div>
  </section>
}

export function WorkflowImpactPreviewCover() {
  return <div className="workflow-impact-cover" aria-hidden="true"><header><span>Agent impact</span><b>Preview</b></header><div><span>Before you publish</span><strong>replay its behaviour.</strong></div><footer><i /><i /><i /><b>6 changed</b></footer></div>
}
