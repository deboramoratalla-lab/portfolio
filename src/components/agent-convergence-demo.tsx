"use client"

import { useMemo, useState } from "react"
import { IconArrowNarrowRight, IconCheck, IconGitBranch, IconLock, IconMessageCircle, IconPlayerPause, IconPlayerPlay, IconShieldCheck } from "@tabler/icons-react"

type Mode = "parallel" | "queue" | "review"

const modes: Record<Mode, { label: string; action: string; title: string; copy: string; status: string; evidence: string; tone: string }> = {
  parallel: {
    label: "Unresolved overlap",
    action: "Keep all agents running",
    title: "Three tasks are moving. One boundary is not safe yet.",
    copy: "Auth migration and API tests both change the session contract. Parallel execution is fast, but the second diff could validate an interface that no longer exists.",
    status: "1 conflict surface",
    evidence: "Shared contract / session.ts",
    tone: "is-risk",
  },
  queue: {
    label: "Recommended sequence",
    action: "Queue API tests after migration",
    title: "Keep the independent work moving. Hold the dependent task.",
    copy: "The refactor can continue in its own worktree. The test agent starts from the migration commit, so its evidence corresponds to the contract it is checking.",
    status: "Boundary protected",
    evidence: "Dependency made explicit",
    tone: "is-safe",
  },
  review: {
    label: "Human review gate",
    action: "Open the contract review",
    title: "This is a product decision, not a scheduling detail.",
    copy: "The migration changes token expiry behaviour. Before agents converge, a developer confirms the intended fallback path and leaves a decision beside the relevant diff.",
    status: "Decision requested",
    evidence: "1 comment required",
    tone: "is-review",
  },
}

const tasks = [
  { id: "A-14", title: "Refactor token refresh", agent: "Codex", files: "auth/refresh.ts", state: "RUNNING", lane: "safe" },
  { id: "B-07", title: "Migrate session contract", agent: "Junie", files: "auth/session.ts", state: "READY", lane: "risk" },
  { id: "C-22", title: "Update API regression tests", agent: "Claude", files: "api/session.spec.ts", state: "WAITING", lane: "wait" },
]

export function AgentConvergenceCover() {
  return <div className="agent-convergence-cover" aria-hidden="true">
    <header><span>Agent convergence</span><b>01 boundary</b></header>
    <div className="agent-convergence-cover-title"><span>Parallel,</span><strong>not blind.</strong></div>
    <div className="agent-convergence-cover-lanes"><i /><i /><i /><b>session.ts</b></div>
    <footer><span>3 worktrees</span><span>Developer decision</span></footer>
  </div>
}

export function AgentConvergenceDemo() {
  const [mode, setMode] = useState<Mode>("parallel")
  const current = modes[mode]
  const visibleTasks = useMemo(() => tasks.map(task => ({ ...task, state: mode === "queue" && task.id === "C-22" ? "QUEUED" : mode === "review" && task.id === "B-07" ? "REVIEW" : task.state })), [mode])

  return <section className="agent-convergence" aria-labelledby="agent-convergence-title">
    <header className="agent-convergence-intro">
      <div><span>Independent product exploration</span><h2 id="agent-convergence-title">Parallel, not blind.</h2></div>
      <p>A decision surface for the moment agents stop being isolated tasks and start becoming one change a developer must be able to trust.</p>
    </header>

    <div className="convergence-console">
      <header className="convergence-bar"><div><span>Workspace / atlas-api</span><small>3 active worktrees · 1 shared boundary</small></div><div className="convergence-live"><i /> Live plan</div></header>
      <div className="convergence-tabs" role="group" aria-label="Choose a task coordination strategy">
        <button className={mode === "parallel" ? "is-active" : ""} onClick={() => setMode("parallel")}><IconPlayerPlay size={14} /> Keep parallel</button>
        <button className={mode === "queue" ? "is-active" : ""} onClick={() => setMode("queue")}><IconGitBranch size={14} /> Protect boundary</button>
        <button className={mode === "review" ? "is-active" : ""} onClick={() => setMode("review")}><IconMessageCircle size={14} /> Review first</button>
      </div>

      <div className="convergence-grid">
        <section className="convergence-map" aria-label="Task convergence map">
          <header><span>[ Task map ]</span><small>Worktrees remain isolated until merge</small></header>
          <div className="convergence-lanes">
            {visibleTasks.map((task, index) => <article className={`convergence-task ${task.lane} ${task.id === "C-22" && mode === "queue" ? "is-queued" : ""}`} key={task.id}>
              <div className="convergence-task-index"><span>{String(index + 1).padStart(2, "0")}</span><i /></div>
              <div><span>{task.id} · {task.agent}</span><h3>{task.title}</h3><p>{task.files}</p></div>
              <b>{task.state}</b>
            </article>)}
          </div>
          <div className={`convergence-boundary ${current.tone}`}>
            <div className="convergence-boundary-node"><IconLock size={17} /></div>
            <div><span>Shared boundary</span><strong>session.ts</strong><small>{current.evidence}</small></div>
            <div className="convergence-boundary-arrows"><IconArrowNarrowRight size={22} /><IconArrowNarrowRight size={22} /></div>
          </div>
          <footer><span>Base commit 4bd8e1a</span><span>Run environment: git worktree</span></footer>
        </section>

        <aside className={`convergence-decision ${current.tone}`} aria-live="polite">
          <span>{current.label}</span>
          <h3>{current.title}</h3>
          <p>{current.copy}</p>
          <dl><div><dt>Risk</dt><dd>{mode === "parallel" ? "HIGH" : mode === "queue" ? "LOW" : "HELD"}</dd></div><div><dt>Review cost</dt><dd>{mode === "parallel" ? "+18 min" : mode === "queue" ? "+4 min" : "NOW"}</dd></div></dl>
          <button type="button" onClick={() => setMode(mode === "parallel" ? "queue" : mode === "queue" ? "review" : "parallel")}><span>{current.action}</span>{mode === "review" ? <IconPlayerPause size={17} /> : <IconArrowNarrowRight size={19} />}</button>
          <small><IconShieldCheck size={14} /> {current.status}</small>
        </aside>
      </div>

      <footer className="convergence-proof"><span><b>Why this matters</b> · Agent progress is not evidence that their changes can safely converge.</span><span><IconCheck size={14} /> Developer remains accountable</span></footer>
    </div>
  </section>
}
