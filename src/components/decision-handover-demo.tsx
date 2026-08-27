"use client"

import { useMemo, useState } from "react"
import { IconAlertTriangle, IconArrowRight, IconCheck, IconChevronRight, IconClock, IconFlag3, IconRefresh, IconShieldCheck, IconUserCheck } from "@tabler/icons-react"
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

export function DecisionHandoverCover() {
  return <div className={styles.cover} aria-hidden="true">
    <header><span>Handover</span><b>3 active decisions</b></header>
    <div className={styles.coverBody}><span>Onboarding flow</span><strong>Keep lookup<br />optional</strong><i><b /><b /><b /></i></div>
    <footer><span>Review condition met</span><IconArrowRight size={15} /></footer>
  </div>
}

export function DecisionHandoverDemo() {
  const [decisions, setDecisions] = useState(initialDecisions)
  const [selectedId, setSelectedId] = useState<DecisionId>("onboarding")
  const [view, setView] = useState<"handover" | "guardrails">("handover")
  const [reviewOpen, setReviewOpen] = useState(false)
  const selected = useMemo(() => decisions.find(decision => decision.id === selectedId) ?? decisions[0], [decisions, selectedId])
  const needsReview = selected.status === "review"

  function chooseDecision(id: DecisionId) {
    setSelectedId(id)
    setReviewOpen(false)
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
        <button className={view === "handover" ? styles.activeTab : ""} onClick={() => setView("handover")}>Active decisions <b>{decisions.length}</b></button>
        <button className={view === "guardrails" ? styles.activeTab : ""} onClick={() => setView("guardrails")}>When to write one</button>
      </nav>

      {view === "guardrails" ? <section className={styles.guardrails} aria-live="polite">
        <div><span>Keep routine work quiet</span><h3>A receipt appears only when a product decision can outlive its context.</h3><p>Routine delivery updates, resolved comments and expected iterations do not create another item for the next person to parse.</p></div>
        <div className={styles.rules}>
          <article><IconCheck size={18} /><strong>Record it</strong><p>It changes customer risk, product scope or an agreed quality bar.</p></article>
          <article><IconCheck size={18} /><strong>Name the condition</strong><p>Someone can tell what would make the decision worth reopening.</p></article>
          <article><IconCheck size={18} /><strong>Leave it out</strong><p>The action is routine and needs no later interpretation.</p></article>
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
                <div><header><span>Next shift</span><small>09:00 onwards</small></header><div className={styles.openSlot}><span>Open context</span><small>New decisions appear here only when they need a later review.</small></div></div>
              </div>
            </div>
          </section>

          <section className={styles.detailSheet}>
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
      <footer className={styles.appFooter}><span><b>Signal</b> is a reason to review, not an instruction to act.</span><span>Scenario data only</span></footer>
    </div>
    <p className={styles.note}>The interface is a coded product hypothesis. Names, times and product scenarios are fictional, included to test the handover states rather than claim a live integration.</p>
  </section>
}
