"use client"

import { useMemo, useState } from "react"
import { IconAlertTriangle, IconArrowRight, IconCalendarWeek, IconCheck, IconChevronRight, IconClock, IconFlag3, IconRefresh, IconSearch, IconShieldCheck, IconUserCheck, IconUsers } from "@tabler/icons-react"
import styles from "./decision-handover-demo.module.css"

type DecisionId = "onboarding" | "templates" | "emptyState"
type DecisionStatus = "active" | "review" | "updated"

type Decision = {
  id: DecisionId
  service: string
  title: string
  owner: string
  decided: string
  status: DecisionStatus
  choice: string
  rationale: string
  condition: string
  event: string
  consequence: string
}

const initialDecisions: Decision[] = [
  {
    id: "onboarding",
    service: "Onboarding flow",
    title: "Keep address lookup optional",
    owner: "Marta Ruiz",
    decided: "08:16",
    status: "review",
    choice: "Ship address lookup as an optional assist",
    rationale: "Early flow reviews showed that a manual entry path was necessary for non-standard addresses. Making lookup mandatory would add friction before we knew it removed enough effort.",
    condition: "Revisit after the next five moderated sessions, or if manual entry becomes the reason people abandon this step.",
    event: "The fifth session exposed a case where lookup could not resolve the address.",
    consequence: "The original choice is still active, but its assumption about coverage needs a product review.",
  },
  {
    id: "templates",
    service: "Project setup",
    title: "Keep templates out of first release",
    owner: "Jon Bell", 
    decided: "07:54",
    status: "active",
    choice: "Keep project templates out of the first release",
    rationale: "The team agreed to first make a single project structure understandable. Templates would multiply configuration choices before the core set-up flow had been validated.",
    condition: "Revisit when three teams complete the core set-up without facilitator help.",
    event: "The validation target has not been reached.",
    consequence: "No follow-up is needed. The handover preserves the scope decision and its evidence threshold.",
  },
  {
    id: "emptyState",
    service: "Design system",
    title: "Hold the new empty state",
    owner: "Nora Lind", 
    decided: "07:32",
    status: "active",
    choice: "Keep the new empty state out of the shared library",
    rationale: "Two product areas needed different recovery actions. Publishing one pattern now would create a false sense of consistency and make the exceptions harder to see.",
    condition: "Revisit when the two teams agree on a shared recovery action and content model.",
    event: "The teams are still using different recovery actions.",
    consequence: "No follow-up is needed. This is a deliberate boundary for the system, not an unfinished task.",
  },
]

type WorkItem = {
  id: string
  title: string
  detail: string
  column: "To do" | "In progress" | "Review" | "Done"
  day: string
  time: string
  tags: string[]
  people: string[]
  progress: number
  kind: "decision" | "review" | "routine" | "delivery"
}

const workItems: WorkItem[] = [
  { id: "address", title: "Keep address lookup optional", detail: "Validate manual entry coverage", column: "In progress", day: "Mon", time: "09:30", tags: ["Decision", "Onboarding"], people: ["MR", "JB"], progress: 80, kind: "decision" },
  { id: "empty", title: "Map empty-state recovery paths", detail: "Compare two product areas", column: "In progress", day: "Mon", time: "11:00", tags: ["Design system", "Research"], people: ["NL", "MR"], progress: 60, kind: "delivery" },
  { id: "research", title: "Review unsupported address path", detail: "Fifth moderated session is in", column: "Review", day: "Tue", time: "10:00", tags: ["Condition met", "Research"], people: ["MR", "JB", "NL"], progress: 66, kind: "review" },
  { id: "template", title: "Clarify project setup helper copy", detail: "Pair with content design", column: "To do", day: "Tue", time: "14:00", tags: ["Routine", "Project setup"], people: ["JB", "NL"], progress: 25, kind: "routine" },
  { id: "success", title: "Instrument activation success", detail: "Define the event model", column: "To do", day: "Wed", time: "09:00", tags: ["Analytics", "Onboarding"], people: ["JB", "MR"], progress: 15, kind: "delivery" },
  { id: "prototype", title: "Prototype recovery guidance", detail: "Test the fallback in the flow", column: "In progress", day: "Wed", time: "13:30", tags: ["Prototype", "UX writing"], people: ["NL", "MR"], progress: 45, kind: "delivery" },
  { id: "handover", title: "Prepare product handover", detail: "Share the evidence and next call", column: "To do", day: "Thu", time: "10:30", tags: ["Handover", "Product"], people: ["JB", "NL"], progress: 35, kind: "decision" },
  { id: "qa", title: "QA mobile manual-entry state", detail: "Resolved in the same session", column: "Done", day: "Thu", time: "15:00", tags: ["QA", "Routine"], people: ["NL"], progress: 100, kind: "routine" },
  { id: "insights", title: "Synthesize session patterns", detail: "Share a decision-ready readout", column: "Review", day: "Fri", time: "10:00", tags: ["Research", "Insights"], people: ["MR", "JB"], progress: 75, kind: "delivery" },
  { id: "release", title: "Publish onboarding guidance", detail: "Ready for the next release", column: "Done", day: "Fri", time: "14:30", tags: ["Release", "Onboarding"], people: ["JB", "NL"], progress: 100, kind: "delivery" },
]

export function DecisionHandoverCover() {
  return <div className={styles.cover} aria-hidden="true">
    <header><span>Handover</span><b>3 active decisions</b></header>
    <div className={styles.coverBody}><span>Onboarding flow</span><strong>Keep lookup<br />optional</strong><i><b /><b /><b /></i></div>
    <footer><span>Review condition met</span><IconArrowRight size={15} /></footer>
  </div>
}

export function DecisionHandoverJourney() {
  return <section className={styles.journey} aria-labelledby="decision-journey-title">
    <header><span>Prototype map</span><h2 id="decision-journey-title">From a changed signal to a decision someone can defend.</h2><p>The prototype is deliberately small: it distinguishes ordinary delivery work from a decision whose reasoning must survive the handover.</p></header>
    <div className={styles.journeyFlow}>
      <article><span>01</span><div><strong>A condition changes</strong><p>A task crosses the review trigger attached to it.</p></div></article>
      <article><span>02</span><div><strong>The receipt restores context</strong><p>What was decided, why it made sense then and when to reopen it.</p></div></article>
      <article><span>03</span><div><strong>A person reviews</strong><p>They keep the boundary or revise the next product action.</p></div></article>
      <article><span>04</span><div><strong>Work returns to the board</strong><p>The resolved task keeps its reasoning and follow-up connected.</p></div></article>
    </div>
    <aside className={styles.journeyQuiet}><span>Routine update</span><strong>Visible in activity. No receipt, no extra process.</strong><p>It did not change scope, customer risk or a decision that needs later interpretation.</p></aside>
  </section>
}

export function DecisionHandoverDemo() {
  const [decisions, setDecisions] = useState(initialDecisions)
  const [selectedId, setSelectedId] = useState<DecisionId>("onboarding")
  const [view, setView] = useState<"handover" | "context" | "guardrails">("context")
  const [reviewOpen, setReviewOpen] = useState(false)
  const [routineReasonOpen, setRoutineReasonOpen] = useState(false)
  const [contextSelection, setContextSelection] = useState<"none" | "routine" | "receipt">("none")
  const [boardFilter, setBoardFilter] = useState<"all" | "decision" | "review" | "routine">("all")
  const [calendarView, setCalendarView] = useState<"day" | "week" | "month">("week")
  const [taskQuery, setTaskQuery] = useState("")
  const [checkScenario, setCheckScenario] = useState<"decision" | "routine">("decision")
  const [commentDraft, setCommentDraft] = useState("")
  const [commentAdded, setCommentAdded] = useState(false)
  const selected = useMemo(() => decisions.find(decision => decision.id === selectedId) ?? decisions[0], [decisions, selectedId])
  const needsReview = selected.status === "review"
  const visibleWork = useMemo(() => workItems.filter(item => {
    const matchesFilter = boardFilter === "all" || item.kind === boardFilter || (boardFilter === "review" && item.kind === "review")
    const matchesQuery = `${item.title} ${item.detail} ${item.tags.join(" ")}`.toLowerCase().includes(taskQuery.toLowerCase())
    return matchesFilter && matchesQuery
  }), [boardFilter, taskQuery])

  function chooseDecision(id: DecisionId) {
    setSelectedId(id)
    setReviewOpen(false)
    setRoutineReasonOpen(false)
  }

  function openDecisionInContext() {
    setSelectedId("onboarding")
    setContextSelection("receipt")
    setReviewOpen(false)
  }

  function openWorkItem(item: WorkItem) {
    if (item.kind === "decision" || item.kind === "review") {
      setSelectedId("onboarding")
      setContextSelection("receipt")
    } else {
      setContextSelection("routine")
    }
    setReviewOpen(false)
  }

  function workItemTone(item: WorkItem) {
    if (item.kind === "decision") return styles.taskDecision
    if (item.kind === "review") return styles.taskReview
    if (item.kind === "routine") return styles.taskRoutine
    return ""
  }

  function addFollowUp() {
    if (!commentDraft.trim()) return
    setCommentAdded(true)
    setCommentDraft("")
  }

  function updateDecision(action: "revise" | "keep") {
    setDecisions(current => current.map(decision => decision.id === selectedId
      ? { ...decision, status: "updated", choice: action === "revise" ? "Add a fallback for unsupported addresses" : "Keep lookup optional with a new review condition", rationale: action === "revise" ? "The session showed that the manual path needs clearer recovery when lookup cannot resolve an address." : "The team agreed the optional path remains the right boundary while more evidence is gathered.", condition: action === "revise" ? "Validate the fallback in the next design review." : "Revisit after three additional sessions with the updated task.", event: "Decision reassessed at product handover.", consequence: action === "revise" ? "The next person can see the initial assumption and the design change it produced." : "The next person can see that the scope was deliberately retained and time-bound." }
      : decision))
    setReviewOpen(false)
  }

  return <section className={styles.root} id="decision-handover" aria-labelledby="decision-handover-title">
    <header className={styles.intro}>
      <span>Independent product exploration</span>
      <h2 id="decision-handover-title">What changed is not why.</h2>
      <p>A handover surface for decisions that are still active when their original context has disappeared.</p>
    </header>

    <div className={styles.app}>
      <header className={styles.appBar}>
        <div className={styles.appIdentity}><span className={styles.appMark}><IconFlag3 size={17} /></span><strong>Handover</strong><span>Product team</span></div>
        <div className={styles.appDate}><IconClock size={15} /> Tuesday, 09:00 product handover</div>
        <div className={styles.appStatus}><IconShieldCheck size={15} /> Modeled scenario</div>
      </header>

      <nav className={styles.tabs} aria-label="Handover views">
        <button className={view === "context" ? styles.activeTab : ""} onClick={() => setView("context")}>Active decisions <b>{decisions.length}</b></button>
        <button className={view === "handover" ? styles.activeTab : ""} onClick={() => setView("handover")}>Handover</button>
        <button className={view === "guardrails" ? styles.activeTab : ""} onClick={() => setView("guardrails")}>Decision check</button>
      </nav>

      {view === "context" ? <section className={styles.contextView} aria-live="polite">
        <header className={styles.contextHeader}>
          <div><span>Product delivery</span><h3>Checkout reliability</h3><p>The team plan for this week. Decisions stay inside the work until their evidence changes.</p></div>
          <div className={styles.contextPeople}><span>MR</span><span>JB</span><span>NL</span><b>3 contributors</b></div>
        </header>
        <section className={styles.kpiGrid} aria-label="Delivery overview">
          <article><span>Active work</span><strong>12</strong><small><b>+3</b> planned this week</small></article>
          <article><span>In progress</span><strong>4</strong><small><b>67%</b> of weekly capacity</small></article>
          <article><span>Needs review</span><strong>{needsReview ? "1" : "0"}</strong><small>{needsReview ? "One decision condition met" : "No decision waiting"}</small></article>
          <article><span>Completed</span><strong>8</strong><small><b>84%</b> delivered on plan</small></article>
        </section>
        <div className={styles.contextBody}>
          <section className={styles.taskBoard} aria-label="Product work calendar">
            <header className={styles.boardHeader}>
              <div><span>Team plan</span><small>18–22 August · Product, research and design system work</small></div>
              <div className={styles.boardActions}>
                <label className={styles.taskSearch}><IconSearch size={15} /><span className="sr-only">Search product work</span><input value={taskQuery} onChange={event => setTaskQuery(event.target.value)} placeholder="Search work" /></label>
                <div className={styles.calendarView} role="group" aria-label="Choose calendar view"><button type="button" className={calendarView === "day" ? styles.calendarActive : ""} onClick={() => setCalendarView("day")}>Day</button><button type="button" className={calendarView === "week" ? styles.calendarActive : ""} onClick={() => setCalendarView("week")}>Week</button><button type="button" className={calendarView === "month" ? styles.calendarActive : ""} onClick={() => setCalendarView("month")}>Month</button></div>
              </div>
            </header>
            <div className={styles.taskFilters} role="toolbar" aria-label="Filter product work"><button type="button" className={boardFilter === "all" ? styles.filterActive : ""} onClick={() => setBoardFilter("all")}>All <b>12</b></button><button type="button" className={boardFilter === "decision" ? styles.filterActive : ""} onClick={() => setBoardFilter("decision")}>Decisions</button><button type="button" className={boardFilter === "review" ? styles.filterActive : ""} onClick={() => setBoardFilter("review")}>Review needed</button><button type="button" className={boardFilter === "routine" ? styles.filterActive : ""} onClick={() => setBoardFilter("routine")}>Routine</button><span><IconUsers size={14} /> All owners</span><span><IconCalendarWeek size={14} /> This week</span></div>
            {calendarView === "week" ? <div className={styles.weekGrid}>{["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => <section key={day} className={styles.dayColumn}><header><span>{day}</span><strong>{18 + index}</strong></header>{visibleWork.filter(item => item.day === day).map(item => <button type="button" key={item.id} className={`${styles.calendarTask} ${workItemTone(item)}`} onClick={() => openWorkItem(item)}><time>{item.time}</time><div className={styles.taskTags}>{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div><strong>{item.title}</strong><p>{item.detail}</p><footer><span className={styles.avatarStack}>{item.people.map(person => <i key={person}>{person}</i>)}</span><b>{item.progress}%</b></footer></button>)}</section>)}</div> : calendarView === "day" ? <div className={styles.dayAgenda}>{visibleWork.map(item => <button type="button" key={item.id} className={`${styles.agendaTask} ${workItemTone(item)}`} onClick={() => openWorkItem(item)}><time>{item.time}</time><div><div className={styles.taskTags}>{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div><strong>{item.title}</strong><p>{item.detail}</p></div><span className={styles.avatarStack}>{item.people.map(person => <i key={person}>{person}</i>)}</span></button>)}</div> : <div className={styles.monthGrid}>{Array.from({ length: 20 }, (_, index) => <button type="button" key={index} className={`${styles.monthCell} ${index === 6 ? styles.monthFocused : ""}`} onClick={() => index === 6 && openDecisionInContext()}><span>{index + 4}</span>{index % 3 === 0 && <i />}{index === 6 && <><b>3</b><small>Decision review</small></>}</button>)}</div>}
          </section>

          {contextSelection !== "none" && <aside className={styles.contextPanel} aria-label="Selected task detail">
            <button type="button" className={styles.closeDetail} aria-label="Close task detail" onClick={() => { setContextSelection("none"); setReviewOpen(false) }}>×</button>
            {contextSelection === "routine" ? <div className={styles.quietState}>
              <span className={styles.quietIcon}><IconCheck size={18} /></span><span>Routine update</span><h4>Nothing else needs to travel.</h4><p>This change is visible in activity, but it does not change product scope, customer risk or a decision that someone should reopen later.</p><button type="button" onClick={openDecisionInContext}>See a decision that does <IconArrowRight size={16} /></button>
            </div> : <div key={`${selected.id}-${selected.status}`} className={styles.contextReceipt}>
              <header><span>Decision receipt</span><div className={`${styles.state} ${needsReview ? styles.needsReview : ""}`}>{needsReview ? <IconAlertTriangle size={14} /> : <IconCheck size={14} />}{needsReview ? "Review needed" : "Reassessed"}</div></header>
              <h4>{selected.choice}</h4><small>Decided by {selected.owner} at {selected.decided}</small>
              <div className={styles.taskMeta}><span>Checkout reliability</span><span>Product + research</span></div>
              <dl><div><dt>Why then</dt><dd>{selected.rationale}</dd></div><div><dt>Revisit when</dt><dd>{selected.condition}</dd></div></dl>
              <section className={styles.taskChecklist} aria-label="Review checklist"><header><span>Before review</span><b>2 / 3 ready</b></header><p><IconCheck size={14} /> Original evidence is attached</p><p><IconCheck size={14} /> Owner is available for handover</p><p><span className={styles.checkEmpty} /> Agree the next experiment</p></section>
              <section className={styles.decisionThread} aria-label="Decision discussion">
                <header><span>Decision thread</span><b>3 notes</b></header>
                <article><span className={styles.commentAvatar}>MR</span><p><strong>Marta · Research</strong> Two sessions needed manual entry for non-standard addresses. <small>08:10</small></p></article>
                <article><span className={`${styles.commentAvatar} ${styles.productAvatar}`}>JB</span><p><strong>Jon · Product</strong> Keep lookup optional until we know whether it removes more effort than it adds. <small>08:16</small></p></article>
                <article><span className={`${styles.commentAvatar} ${styles.alertAvatar}`}>MR</span><p><strong>Marta · Research</strong> The fifth session could not resolve the address. The review condition is met. <small>09:02</small></p></article>
                {commentAdded && <article className={styles.newComment}><span className={styles.commentAvatar}>You</span><p><strong>Follow-up added</strong> The next experiment will be agreed in review. <small>Now</small></p></article>}
                <div className={styles.commentComposer}><input value={commentDraft} onChange={event => setCommentDraft(event.target.value)} onKeyDown={event => { if (event.key === "Enter") addFollowUp() }} aria-label="Add a follow-up note" placeholder="Add a follow-up note…" /><button type="button" onClick={addFollowUp} disabled={!commentDraft.trim()}>Add</button></div>
              </section>
              <section className={styles.contextTrigger}><IconAlertTriangle size={17} /><div><span>Condition crossed</span><strong>{selected.event}</strong></div></section>
              {needsReview ? <button type="button" onClick={() => setReviewOpen(true)}>Review decision <IconChevronRight size={17} /></button> : <p className={styles.reassessedNote}><IconCheck size={15} /> The original reasoning and its follow-up are now visible together.</p>}
            </div>}
          </aside>}
        </div>
        <footer className={styles.contextFooter}><span>Try the flow: select the routine update, then the decision and its trigger.</span><span><b>Signal ≠ instruction</b> · a person decides what follows.</span></footer>
        {reviewOpen && <section className={styles.contextReview} aria-label="Decision review">
          <header><span>Review before acting</span><button type="button" aria-label="Close review" onClick={() => setReviewOpen(false)}>×</button></header>
          <h4>The evidence changed. The decision still needs a person.</h4><p>Choose the next product action; this prototype saves the reassessment locally.</p>
          <div><button type="button" onClick={() => updateDecision("revise")}><IconRefresh size={16} /> Revise the flow</button><button type="button" onClick={() => updateDecision("keep")}><IconUserCheck size={16} /> Keep the scope</button></div>
        </section>}
      </section> : view === "guardrails" ? <section className={styles.guardrails} aria-live="polite">
        <div>
          <span>Before it travels</span>
          <h3>Does this task need a decision receipt?</h3>
          <p>Choose a task type to see what the next person should inherit — and what should stay quiet.</p>
          <div className={styles.scenarioPicker} role="group" aria-label="Choose a task type">
            <button type="button" className={checkScenario === "decision" ? styles.scenarioActive : ""} onClick={() => setCheckScenario("decision")} aria-pressed={checkScenario === "decision"}><span>Product decision</span><strong>Keep lookup optional</strong></button>
            <button type="button" className={checkScenario === "routine" ? styles.scenarioActive : ""} onClick={() => setCheckScenario("routine")} aria-pressed={checkScenario === "routine"}><span>Routine update</span><strong>Clarify helper copy</strong></button>
          </div>
          <aside className={styles.guardrailExample} aria-label="Decision check result">
            <span>{checkScenario === "decision" ? "Receipt created" : "No receipt created"}</span>
            <strong>{checkScenario === "decision" ? "The choice, its reasoning and the review condition travel together." : "The update remains visible in activity, without creating a second artefact to maintain."}</strong>
          </aside>
        </div>
        <div className={styles.rules}>
          <header><span>Decision check</span><h4>{checkScenario === "decision" ? "All three conditions are present." : "This is work, but not a decision to carry."}</h4></header>
          <article className={checkScenario === "routine" ? styles.ruleMiss : ""}>{checkScenario === "decision" ? <IconCheck size={18} /> : <IconAlertTriangle size={18} />}<strong>It changes a product outcome</strong><p>{checkScenario === "decision" ? "The scope boundary changes the customer path and what the team validates next." : "The helper-copy update does not alter scope, risk or an agreed quality bar."}</p></article>
          <article className={checkScenario === "routine" ? styles.ruleMiss : ""}>{checkScenario === "decision" ? <IconCheck size={18} /> : <IconAlertTriangle size={18} />}<strong>The reasoning will matter later</strong><p>{checkScenario === "decision" ? "The next teammate needs the original trade-off without reconstructing the research discussion." : "The edit is self-explanatory in the task activity."}</p></article>
          <article className={checkScenario === "routine" ? styles.ruleMiss : ""}>{checkScenario === "decision" ? <IconCheck size={18} /> : <IconAlertTriangle size={18} />}<strong>There is a review trigger</strong><p>{checkScenario === "decision" ? "A moderated session that cannot resolve the address is a named reason to reassess." : "There is no later event that should reopen this copy change."}</p></article>
          <p className={styles.noReceipt}><b>{checkScenario === "decision" ? "Write a receipt" : "Leave it in activity"}</b> — the system distinguishes a useful trail from extra process.</p>
        </div>
      </section> : <div className={styles.workspace}>
        <main className={styles.detail} aria-live="polite">
          <section className={styles.schedule} aria-label="Decision schedule">
            <header className={styles.scheduleHeader}>
              <div><span>Tuesday, 09:00 product handover</span><h3>Three product decisions carried forward</h3></div>
              <span className={styles.scheduleStatus}><IconClock size={15} /> Handover in progress</span>
            </header>
            <div className={styles.scheduleGrid}>
              <div className={styles.scheduleTime}><span>07:00</span><span>08:00</span><span>09:00</span></div>
              <div className={styles.scheduleColumns}>
                <div><header><span>Before handover</span><small>07:00-08:30</small></header><button type="button" aria-pressed={selectedId === "emptyState"} className={`${styles.scheduleCard} ${styles.limeCard} ${selectedId === "emptyState" ? styles.scheduleSelected : ""}`} onClick={() => chooseDecision("emptyState")}><span>Design system</span><strong>Hold the new empty state</strong><small>Nora, 07:32</small></button><button type="button" aria-pressed={selectedId === "templates"} className={`${styles.scheduleCard} ${styles.aquaCard} ${selectedId === "templates" ? styles.scheduleSelected : ""}`} onClick={() => chooseDecision("templates")}><span>Project setup</span><strong>Keep templates out of v1</strong><small>Jon, 07:54</small></button></div>
                <div><header><span>Handover</span><small>08:30-09:00</small></header><button type="button" aria-pressed={selectedId === "onboarding"} className={`${styles.scheduleCard} ${styles.yellowCard} ${selectedId === "onboarding" ? styles.scheduleSelected : ""}`} onClick={() => chooseDecision("onboarding")}><span>Onboarding flow</span><strong>Keep lookup optional</strong><small>Marta, 08:16</small></button><div className={styles.scheduleHint}>Select a decision to see why it was made and when to reopen it.</div></div>
                <div><header><span>Next shift</span><small>09:00 onwards</small></header><div className={styles.openSlot}><span>Open context</span><small>New decisions appear here only when they need a later review.</small><button type="button" className={styles.routineItem} aria-expanded={routineReasonOpen} onClick={() => setRoutineReasonOpen(open => !open)}><span>Routine update</span><strong>Clarified helper copy in project setup</strong><small>{routineReasonOpen ? "Hide why no receipt exists" : "Why no receipt?"}</small></button>{routineReasonOpen && <p className={styles.routineReason} role="status"><b>No receipt created.</b> The change did not alter scope, customer risk or a decision that needs later review.</p>}</div></div>
              </div>
            </div>
          </section>

          <section key={`${selected.id}-${selected.status}`} className={styles.detailSheet}>
          <header className={styles.detailHeader}><div><span>{selected.service}</span><h3>{selected.title}</h3></div><div className={`${styles.state} ${needsReview ? styles.needsReview : ""}`}>{needsReview ? <IconAlertTriangle size={15} /> : <IconCheck size={15} />}{needsReview ? "Review needed" : selected.status === "updated" ? "Reassessed" : "Still valid"}</div></header>
          <section className={styles.receipt}>
            <div className={styles.receiptLead}><span>Decision receipt</span><strong>{selected.choice}</strong><small>Decided by {selected.owner} at {selected.decided}</small></div>
            <div className={styles.receiptField}><span>Why this was reasonable then</span><p>{selected.rationale}</p></div>
            <div className={styles.receiptField}><span>Revisit when</span><p>{selected.condition}</p></div>
          </section>
          <section className={`${styles.signal} ${needsReview ? styles.signalAlert : ""}`}>
            <div className={styles.signalIcon}>{needsReview ? <IconAlertTriangle size={19} /> : <IconCheck size={19} />}</div>
            <div><span>{needsReview ? "The condition changed" : "No condition crossed"}</span><strong>{selected.event}</strong><p>{selected.consequence}</p></div>
            {needsReview && <button type="button" onClick={() => setReviewOpen(true)}>Review decision <IconChevronRight size={17} /></button>}
          </section>
          {reviewOpen && <section className={styles.reviewPanel} aria-label="Decision review">
            <header><span>Review before acting</span><button type="button" aria-label="Close review" onClick={() => setReviewOpen(false)}>×</button></header>
            <h4>The signal changed. The decision still needs a person.</h4>
            <p>Choose an action. This prototype records the handover state locally and does not operate a live product.</p>
            <div><button type="button" onClick={() => updateDecision("revise")}><IconRefresh size={16} /> Revise the flow</button><button type="button" onClick={() => updateDecision("keep")}><IconUserCheck size={16} /> Keep the scope</button></div>
          </section>}
          </section>
        </main>
      </div>}
      <footer className={styles.appFooter}><span><b>A signal is a reading, not an instruction.</b></span><span>Scenario data only</span></footer>
    </div>
  </section>
}
