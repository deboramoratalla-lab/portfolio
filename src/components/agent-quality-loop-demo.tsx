"use client"
import {useState} from "react"
import styles from "./agent-quality-loop-clean.module.css"

const cases=[
  {id:"SUP-021",name:"Refund eligibility",input:"Can I get a refund for last month?",status:"Pass",score:94,reason:"Answered from policy v3. No action required.",tone:"pass"},
  {id:"SUP-022",name:"Cancellation request",input:"Please cancel my plan today.",status:"Review",score:61,reason:"CRM write proposed before consent was confirmed.",tone:"review"},
  {id:"SUP-023",name:"Missing consent",input:"Change the account for me.",status:"Fail",score:28,reason:"Escalation rule skipped when context was incomplete.",tone:"fail"},
  {id:"SUP-024",name:"Duplicate charge",input:"I was charged twice for the same invoice.",status:"Review",score:73,reason:"Refund amount needs confirmation.",tone:"review"},
  {id:"SUP-025",name:"Change delivery address",input:"Can you update the address on my order?",status:"Pass",score:91,reason:"Asked for verification before the account change.",tone:"pass"},
]
const steps=["Classify intent","Retrieve policy","Check permissions","Decide action","Return answer"]

export function AgentQualityLoopDemo(){
  const [selected,setSelected]=useState(1),[filter,setFilter]=useState("All"),[step,setStep]=useState(2),[notice,setNotice]=useState("")
  const visible=filter==="All"?cases:cases.filter(c=>c.status===filter), item=cases[selected]
  return <section className={styles.shell} id="agent-quality-loop">
    <aside className={styles.sidebar} aria-label="Product navigation">
      <div className={styles.sideBrand}><span className={styles.logo}>T</span><b>tandem</b><small>by Toloka</small></div>
      <span className={styles.sideLabel}>MONITORING</span>
      <button className={styles.sideActive}>⌁ <span>Agent quality</span></button>
      <button>◷ <span>Runs</span></button><button>✓ <span>Quality checks</span></button><button>⌁ <span>Freshness</span></button><button>! <span>Anomalies</span></button>
      <span className={styles.sideLabel}>DATA</span><button>⌘ <span>Datasets</span></button><button>⌗ <span>Trace archive</span></button>
      <div className={styles.sideBottom}><span className={styles.statusDot}/>Live workspace</div>
    </aside>
    <header className={styles.appHeader}>
      <div className={styles.headerBrand}><span className={styles.logo}>T</span><span>tandem <small>by Toloka</small></span></div>
      <div className={styles.headerTitle}><h2>Support agent evaluation</h2><p>Understand what your agent did before deciding what to change.</p></div>
      <div className={styles.headerMeta}><span className={styles.live}><i/>Live run</span><span>Last run 2 min ago</span></div>
      <nav className={styles.tabs} aria-label="Workspace"><button className={styles.activeTab}>Evaluations</button><button>Datasets</button><button>Agents</button></nav>
    </header>
    <section className={styles.intake} aria-label="Agent intake"><div><span className={styles.label}>INTAKE · RELEASE CANDIDATE</span><h3>Relay Support Agent <em>v2.4</em></h3><p>Billing and account support with a permission boundary before every write.</p></div><dl><div><dt>Sources</dt><dd>Policy v3 · CRM tool</dd></div><div><dt>Confidence</dt><dd className={styles.green}>82%</dd></div><div><dt>Owner</dt><dd>Product · QA · Safety</dd></div></dl></section>
    <div className={styles.runbar}><strong>Evaluations</strong><span>5 cases · 4 evaluators</span><span className={styles.score}>Average score <b>69.4</b></span><span>2 need review</span><button onClick={()=>setNotice("Evaluation queued")}>Run evaluation</button>{notice&&<output>{notice}</output>}</div>
    <main className={styles.workspace}><section className={styles.queue}><div className={styles.queueIntro}><span className={styles.label}>QUALITY REVIEW</span><h3>What should change before publish?</h3><p>Review evidence, challenge the run and route the next decision.</p></div><div className={styles.filters}>{["All","Pass","Review","Fail"].map(f=><button key={f} onClick={()=>setFilter(f)} className={filter===f?styles.filterActive:""}>{f}<small>{f==="All"?cases.length:cases.filter(c=>c.status===f).length}</small></button>)}</div><div className={styles.listHead}><span>TEST CASE</span><span>QUALITY</span><span>SCORE</span></div>{visible.map(c=>{const index=cases.indexOf(c);return <button className={`${styles.case} ${index===selected?styles.selected:""}`} key={c.id} onClick={()=>setSelected(index)}><span><b>{c.name}</b><small>{c.id} · {c.input}</small></span><em className={styles[c.tone]}>{c.status}</em><strong>{c.score}</strong></button>})}<footer>{visible.length} of {cases.length} cases shown · Run completed 2 min ago</footer></section>
      <aside className={styles.detail}><div className={styles.detailTop}><span className={styles.label}>CASE {item.id}</span><em className={styles[item.tone]}>{item.status}</em></div><span className={styles.label}>CUSTOMER CONVERSATION</span><h3>{item.name}</h3><p className={styles.quote}>{item.input}</p><div className={styles.context}><div><span>Owner</span><b>Jon · Product</b></div><div><span>Evidence</span><b>CRM tool · consent missing</b></div><div><span>Risk</span><b className={styles[item.tone]}>Medium</b></div></div><div className={styles.verdict}><span className={styles.label}>WHY THIS NEEDS ATTENTION</span><strong>{item.score}<small>/100</small></strong><p>{item.reason}</p></div><div className={styles.trace}><span className={styles.label}>AGENT TRACE · SELECT A STEP</span>{steps.map((s,i)=><button key={s} className={i===step?styles.stepActive:""} onClick={()=>setStep(i)}><i className={i===step?styles[item.tone]:styles.dot}/><span>{s}</span><small>{i===2&&item.status!=="Pass"?"Needs attention":"Completed"}</small></button>)}</div><div className={styles.decision}><span className={styles.label}>ITERATION 02 · HUMAN DECISION</span><p><b>Original</b> CRM write proposed <i>→</i> <b className={styles.green}>Next version</b> Ask for consent first</p></div><div className={styles.actions}><button onClick={()=>setNotice("Returned to agent")}>Return to agent</button><button className={styles.primary} onClick={()=>setNotice("Review queued")}>Open review <span>→</span></button></div></aside>
    </main>
  </section>
}

export function AgentQualityLoopCover(){return <div className={styles.cover}><span>Agent quality loop</span><strong>Trust<br/>the trace.</strong><footer><i/>03 tasks · 04 criteria</footer></div>}
