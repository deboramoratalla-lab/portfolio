"use client"

import { useMemo, useState } from "react"
import { IconArrowNarrowRight, IconBrandGithub, IconCheck, IconExternalLink, IconGitBranch, IconLock, IconMessageCircle, IconPlayerPause, IconPlayerPlay, IconShieldCheck } from "@tabler/icons-react"
import gitSnapshot from "@/data/agent-convergence-snapshot.json"

type Mode = "parallel" | "queue" | "review"

const modes: Record<Mode, { label: string; action: string; title: string; copy: string; status: string; evidence: string; tone: string }> = {
  parallel: {
    label: "Unresolved overlap",
    action: "Keep all agents running",
    title: "Three changes moved. Their shared files are not safe to merge blindly.",
    copy: "The Git snapshot shows all three touched the same route, styles and demo. Parallel work may be useful, but a green task state does not prove that its diff still fits the other two.",
    status: `${gitSnapshot.sharedFiles.length} shared files`,
    evidence: "Git overlap detected",
    tone: "is-risk",
  },
  queue: {
    label: "Recommended sequence",
    action: "Queue API tests after migration",
    title: "Keep independent scope moving. Gate the files that overlap.",
    copy: "A dependent task should start from the current contract, not from an earlier assumption. The sequence makes the review evidence correspond to the code that will actually merge.",
    status: "Boundary protected",
    evidence: "Dependency made explicit",
    tone: "is-safe",
  },
  review: {
    label: "Human review gate",
    action: "Open the contract review",
    title: "A diff can expose a boundary. It cannot decide the intended behaviour.",
    copy: "Before changes converge, a developer checks whether the shared route still expresses the desired product behaviour and leaves the decision alongside the relevant change.",
    status: "Decision requested",
    evidence: "1 comment required",
    tone: "is-review",
  },
}

const workstreams = ["Discovery layer", "Source layer", "Context layer"]
const tasks = gitSnapshot.tasks.map((task, index) => ({ ...task, agent: "Git change set", title: workstreams[index] || `Change set ${index + 1}`, files: task.files[0], state: index === 0 ? "READY" : index === 1 ? "RUNNING" : "WAITING", lane: index === 0 ? "safe" : index === 1 ? "risk" : "wait" }))
const repositoryUrl = `https://github.com/${gitSnapshot.source.repository}`
const snapshotScriptUrl = `${repositoryUrl}/blob/main/tools/build-convergence-snapshot.mjs`

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
  const visibleTasks = useMemo(() => tasks.map((task, index) => ({ ...task, state: mode === "queue" && index === 2 ? "QUEUED" : mode === "review" && index === 1 ? "REVIEW" : task.state })), [mode])

  return <section className="agent-convergence" aria-labelledby="agent-convergence-title">
    <header className="agent-convergence-intro">
      <div><span>Evidence-backed product prototype</span><h2 id="agent-convergence-title">Parallel, not blind.</h2></div>
      <p>A decision surface for the moment parallel changes stop being isolated tasks and start becoming one change a developer must be able to trust.</p>
    </header>

    <div className="convergence-console">
      <header className="convergence-bar"><div><a className="convergence-repo-link" href={repositoryUrl} target="_blank" rel="noreferrer"><IconBrandGithub size={14} /> {gitSnapshot.source.repository}<IconExternalLink size={12} /></a><small>{gitSnapshot.tasks.length} commit ranges · {gitSnapshot.sharedFiles.length} shared files</small></div><div className="convergence-live"><i /> Git evidence captured</div></header>
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
              <div><span>{task.id} · {task.agent} · captured revision</span><h3>{task.title}</h3><p>{task.files}</p></div>
              <b>{task.state}</b>
            </article>)}
          </div>
          <div className={`convergence-boundary ${current.tone}`}>
            <div className="convergence-boundary-node"><IconLock size={17} /></div>
            <div><span>Shared boundary</span><strong>{gitSnapshot.sharedFiles[0]?.path.split("/").pop()}</strong><small>{current.evidence}</small></div>
            <div className="convergence-boundary-arrows"><IconArrowNarrowRight size={22} /><IconArrowNarrowRight size={22} /></div>
          </div>
          <footer><span>Shared file evidence</span><a href={snapshotScriptUrl} target="_blank" rel="noreferrer">Snapshot generator <IconExternalLink size={11} /></a></footer>
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

      <footer className="convergence-proof"><span><b>Evidence boundary</b> · Commit history and file overlap come from Git; the coordination replay is the product hypothesis.</span><span><IconCheck size={14} /> Developer remains accountable</span></footer>
    </div>
  </section>
}
