"use client"

import { useEffect, useMemo, useState } from "react"

type Sector = "All" | "AI & Devtools" | "Digital culture" | "Health"
type Job = {
  id: number
  title: string
  company: string
  location: string
  employment: string
  industries: string[]
  publishedAt: string
  href: string
  sectors: Exclude<Sector, "All">[]
}

const sectors: Sector[] = ["All", "AI & Devtools", "Digital culture", "Health"]

function relativeDate(value: string) {
  const days = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 86_400_000))
  return days === 0 ? "Today" : days === 1 ? "1 day ago" : `${days} days ago`
}

export function JobSignalsCover() {
  return <div className="job-radar-cover" aria-hidden="true">
    <header><span>Signals / Europe</span><i>Live feed</i></header>
    <div><strong>12</strong><span>design signals</span></div>
    <ul><li><b />AI &amp; Devtools</li><li><b />Digital culture</li><li><b />Health</li></ul>
  </div>
}

export function JobSignalsRadar() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [activeSector, setActiveSector] = useState<Sector>("All")
  const [updatedAt, setUpdatedAt] = useState<string>()
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    fetch("/api/job-radar")
      .then(response => response.json())
      .then((data: { jobs?: Job[]; updatedAt?: string; unavailable?: boolean }) => {
        setJobs(data.jobs ?? [])
        setUpdatedAt(data.updatedAt)
        setUnavailable(Boolean(data.unavailable))
      })
      .catch(() => setUnavailable(true))
  }, [])

  const visibleJobs = useMemo(() => activeSector === "All" ? jobs : jobs.filter(job => job.sectors.includes(activeSector)), [activeSector, jobs])

  return <section className="job-radar" id="job-signals-radar" aria-labelledby="job-signals-radar-title">
    <header className="job-radar-intro">
      <div><span>[ Live experiment ]</span><h2 id="job-signals-radar-title">Signals, not search.</h2></div>
      <p>A small open radar for product-design roles that are remote and available in Europe. It reads a public job feed, filters the role shape first, then lets you inspect the sector signal instead of starting from a company list.</p>
    </header>
    <div className="job-radar-console">
      <header className="job-radar-bar"><strong>Opportunity radar / Europe + remote</strong><span><i /> {updatedAt ? `Updated ${new Intl.DateTimeFormat("en", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(updatedAt))}` : "Reading public feed"}</span></header>
      <div className="job-radar-controls" role="group" aria-label="Filter roles by sector">
        {sectors.map(sector => <button type="button" key={sector} className={activeSector === sector ? "is-active" : ""} aria-pressed={activeSector === sector} onClick={() => setActiveSector(sector)}>{sector}</button>)}
      </div>
      <div className="job-radar-results" aria-live="polite">
        {unavailable && <p className="job-radar-empty">The public feed is temporarily unavailable. Try again shortly.</p>}
        {!unavailable && !updatedAt && <p className="job-radar-empty">Finding current design signals…</p>}
        {!unavailable && updatedAt && visibleJobs.length === 0 && <p className="job-radar-empty">No current product-design signals match this sector. Try the broader view.</p>}
        {visibleJobs.slice(0, 12).map(job => <article className="job-radar-result" key={job.id}>
          <div><span>{job.sectors.length ? job.sectors.join(" · ") : "Product design"}</span><h3>{job.title}</h3><p>{job.company} <b>·</b> {job.location} <b>·</b> {job.employment || "Remote"}</p></div>
          <div className="job-radar-result-side"><small>{relativeDate(job.publishedAt)}</small><a href={job.href} target="_blank" rel="noreferrer">Open role ↗</a></div>
        </article>)}
      </div>
      <footer>Public listings supplied by <a href="https://jobicy.com/" target="_blank" rel="noreferrer">Jobicy</a>. The feed is refreshed hourly; availability is confirmed on the original listing.</footer>
    </div>
  </section>
}
