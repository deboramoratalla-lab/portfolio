"use client"

import { useMemo, useState } from "react"
import { IconAlertTriangle, IconArrowRight, IconCheck, IconChevronRight, IconClock, IconFileText, IconFlag3, IconRefresh, IconShieldCheck, IconUserCheck } from "@tabler/icons-react"
import styles from "./decision-handover-demo.module.css"

type DecisionId = "checkout" | "provisioning" | "search"
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
    id: "checkout",
    service: "Checkout API",
    title: "Keep traffic at 25%",
    owner: "Marta Ruiz",
    decided: "08:16",
    status: "review",
    choice: "Hold the rollout at 25%",
    rationale: "Error rate was recovering after the cache change. A rollback would create a second unknown while the incident was already stabilising.",
    condition: "Revisit if p95 latency stays above 1.2 s for 10 minutes.",
    event: "The threshold was crossed for 11 minutes at 08:41.",
    consequence: "The original decision is still active, but its reason to wait is no longer true.",
  },
  {
    id: "provisioning",
    service: "EU provisioning",
    title: "Hold extra capacity",
    owner: "Jon Bell", 
    decided: "07:54",
    status: "active",
    choice: "Do not add capacity yet",
    rationale: "The queue was falling after the regional retry limit was reduced. Extra capacity would increase cost before confirming demand was sustained.",
    condition: "Revisit if the queue exceeds 900 requests for 15 minutes.",
    event: "Queue remains below the review condition.",
    consequence: "No follow-up is needed. The handover preserves the reason for leaving this alone.",
  },
  {
    id: "search",
    service: "Search indexing",
    title: "Defer the reindex",
    owner: "Nora Lind", 
    decided: "07:32",
    status: "active",
    choice: "Keep the reindex outside peak traffic",
    rationale: "Search freshness was within the service target. Starting the job now would compete with a customer import already in progress.",
    condition: "Revisit if freshness exceeds 18 minutes.",
    event: "Freshness is 11 minutes.",
    consequence: "No follow-up is needed. This is a decision, not a reminder to create more work.",
  },
]

export function DecisionHandoverCover() {
  return <div className={styles.cover} aria-hidden="true">
    <header><span>Handover</span><b>3 active decisions</b></header>
    <div className={styles.coverBody}><span>Checkout API</span><strong>Keep traffic<br />at 25%</strong><i><b /><b /><b /></i></div>
    <footer><span>Condition crossed</span><IconArrowRight size={15} /></footer>
  </div>
}

export function DecisionHandoverDemo() {
  const [decisions, setDecisions] = useState(initialDecisions)
  const [selectedId, setSelectedId] = useState<DecisionId>("checkout")
  const [view, setView] = useState<"handover" | "guardrails">("handover")
  const [reviewOpen, setReviewOpen] = useState(false)
  const selected = useMemo(() => decisions.find(decision => decision.id === selectedId) ?? decisions[0], [decisions, selectedId])
  const needsReview = selected.status === "review"

  function chooseDecision(id: DecisionId) {
    setSelectedId(id)
    setReviewOpen(false)
  }

  function updateDecision(action: "rollback" | "wait") {
    setDecisions(current => current.map(decision => decision.id === selectedId
      ? { ...decision, status: "updated", choice: action === "rollback" ? "Roll back to the previous cache policy" : "Wait with a new review condition", rationale: action === "rollback" ? "The latency condition held long enough to make the original wait decision unsafe." : "The team accepted a short extension and set a new condition for review.", condition: action === "rollback" ? "Rollback started at 08:49. Monitor recovery for 15 minutes." : "Revisit if p95 latency stays above 1.2 s for another 5 minutes.", event: "Decision reassessed at handover.", consequence: action === "rollback" ? "The next operator can see both the original context and the action that replaced it." : "The next operator can see that the wait was deliberate and time-bound." }
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
        <div className={styles.appIdentity}><span className={styles.appMark}><IconFlag3 size={17} /></span><strong>Handover</strong><span>Operations</span></div>
        <div className={styles.appDate}><IconClock size={15} /> Tuesday, 09:00 handover</div>
        <div className={styles.appStatus}><IconShieldCheck size={15} /> Modeled scenario</div>
      </header>

      <nav className={styles.tabs} aria-label="Handover views">
        <button className={view === "handover" ? styles.activeTab : ""} onClick={() => setView("handover")}>Active decisions <b>{decisions.length}</b></button>
        <button className={view === "guardrails" ? styles.activeTab : ""} onClick={() => setView("guardrails")}>When to write one</button>
      </nav>

      {view === "guardrails" ? <section className={styles.guardrails} aria-live="polite">
        <div><span>Keep routine work quiet</span><h3>A receipt appears only when a decision can outlive its context.</h3><p>Routine changes, expected retries and acknowledged alerts do not create another item for the next person to parse.</p></div>
        <div className={styles.rules}>
          <article><IconCheck size={18} /><strong>Record it</strong><p>It changes risk, cost or an agreed service level.</p></article>
          <article><IconCheck size={18} /><strong>Name the condition</strong><p>Someone can tell what would make the decision worth reopening.</p></article>
          <article><IconCheck size={18} /><strong>Leave it out</strong><p>The action is routine and needs no later interpretation.</p></article>
        </div>
      </section> : <div className={styles.workspace}>
        <aside className={styles.rail}>
          <header><span>Handover queue</span><small>Only active decisions</small></header>
          <div className={styles.decisionList}>{decisions.map(decision => <button type="button" className={`${styles.decisionRow} ${decision.id === selectedId ? styles.selected : ""}`} onClick={() => chooseDecision(decision.id)} key={decision.id}>
            <span className={styles.rowTop}><small>{decision.service}</small>{decision.status === "review" && <b>Review</b>}{decision.status === "updated" && <b className={styles.updated}>Updated</b>}</span>
            <strong>{decision.title}</strong>
            <span className={styles.rowMeta}>{decision.owner} <i /> {decision.decided}</span>
          </button>)}</div>
          <footer><IconFileText size={15} /> 3 decisions carried forward</footer>
        </aside>

        <main className={styles.detail} aria-live="polite">
          <section className={styles.schedule} aria-label="Decision schedule">
            <header className={styles.scheduleHeader}>
              <div><span>Tuesday · 09:00 handover</span><h3>Decision schedule</h3></div>
              <button type="button" className={styles.todayButton}>Today <IconChevronRight size={15} /></button>
            </header>
            <div className={styles.scheduleGrid}>
              <div className={styles.scheduleTime}><span>07:00</span><span>08:00</span><span>09:00</span></div>
              <div className={styles.scheduleColumns}>
                <div><header><span>Before handover</span><small>07:00–08:30</small></header><button type="button" className={`${styles.scheduleCard} ${styles.limeCard} ${selectedId === "search" ? styles.scheduleSelected : ""}`} onClick={() => chooseDecision("search")}><span>Search indexing</span><strong>Defer the reindex</strong><small>Nora · 07:32</small></button><button type="button" className={`${styles.scheduleCard} ${styles.aquaCard} ${selectedId === "provisioning" ? styles.scheduleSelected : ""}`} onClick={() => chooseDecision("provisioning")}><span>EU provisioning</span><strong>Hold extra capacity</strong><small>Jon · 07:54</small></button></div>
                <div><header><span>Handover</span><small>08:30–09:00</small></header><button type="button" className={`${styles.scheduleCard} ${styles.yellowCard} ${selectedId === "checkout" ? styles.scheduleSelected : ""}`} onClick={() => chooseDecision("checkout")}><span>Checkout API</span><strong>Keep traffic at 25%</strong><small>Marta · 08:16</small></button><div className={styles.scheduleHint}>Choose a decision to read its context.</div></div>
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
            <p>Choose an action. This prototype records the handover state locally and does not operate a live service.</p>
            <div><button type="button" onClick={() => updateDecision("rollback")}><IconRefresh size={16} /> Roll back</button><button type="button" onClick={() => updateDecision("wait")}><IconUserCheck size={16} /> Keep waiting</button></div>
          </section>}
          </section>
        </main>
      </div>}
      <footer className={styles.appFooter}><span><b>Signal</b> is a reason to review, not an instruction to act.</span><span>Scenario data only</span></footer>
    </div>
    <p className={styles.note}>The interface is a coded product hypothesis. Names, times and operational readings are fictional, included to test the handover states rather than claim a live integration.</p>
  </section>
}
