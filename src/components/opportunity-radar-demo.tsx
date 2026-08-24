"use client"

import { useEffect, useMemo, useState } from "react"
import { IconArrowUpRight, IconBriefcase2, IconRefresh, IconSearch } from "@tabler/icons-react"

type Opportunity = { id: string; title: string; company: string; location: string; type: string; category: string; source: "Jobicy" | "Remotive" | "Remote OK"; url: string; publishedAt: string | null }
type RadarData = { jobs: Opportunity[]; updatedAt: string; sources: string[]; message?: string }

const featuredCategories = ["All technology", "Product & Design", "Engineering", "Data & AI", "Platform & Cloud", "Developer Experience", "Security", "Product & Operations"]

export function OpportunityRadarCover() {
  return <div className="opportunity-radar-cover" aria-hidden="true">
    <header><span>European tech opportunity radar</span><b>Public utility</b></header>
    <div className="opportunity-radar-cover-copy"><span>Remote roles in</span><strong>Technology</strong><p>Europe or Anywhere</p></div>
    <div className="opportunity-radar-cover-tags"><span>Product & Design</span><span>Engineering</span><span>Data & AI</span><span>Platform & Cloud</span></div>
    <footer><span>Sources</span><b>Jobicy + Remotive</b></footer>
  </div>
}

function relativeDate(date: string | null) {
  if (!date) return "Date not supplied"
  const days = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 86400000))
  return days === 0 ? "Today" : days === 1 ? "Yesterday" : `${days} days ago`
}

export function OpportunityRadarDemo() {
  const [data, setData] = useState<RadarData | null>(null)
  const [category, setCategory] = useState("All technology")
  const [query, setQuery] = useState("")
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = async (showLoading = true) => {
    if (showLoading) setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/opportunity-radar", { cache: "no-store" })
      const payload = await response.json() as RadarData
      if (!response.ok) throw new Error(payload.message || "The sources could not be read.")
      setData(payload)
    } catch (cause) { setError(cause instanceof Error ? cause.message : "The sources could not be read.") }
    finally { setLoading(false) }
  }

  useEffect(() => {
    const request = window.setTimeout(() => { void load(false) }, 0)
    return () => window.clearTimeout(request)
  }, [])
  const visible = useMemo(() => (data?.jobs || []).filter(job => (category === "All technology" || job.category === category) && `${job.title} ${job.company} ${job.location}`.toLowerCase().includes(query.toLowerCase())).slice(0, 12), [category, data, query])
  const categories = featuredCategories.filter(item => item === "All technology" || data?.jobs.some(job => job.category === item))

  return <section className="opportunity-radar" id="opportunity-radar" aria-labelledby="radar-title">
    <header className="opportunity-radar-intro">
      <div><span>Community utility</span><h2 id="radar-title">A clearer way to browse remote technology roles.</h2></div>
      <p>This public view combines remote listings that explicitly allow Europe or Anywhere. It shows source and date, but it does not rank people or guarantee coverage.</p>
    </header>
    <div className="opportunity-radar-surface">
      <header className="radar-surface-head"><div><span>European tech opportunity radar</span><small>Remote only / Europe or Anywhere</small></div><button type="button" onClick={() => void load()} disabled={isLoading}><IconRefresh size={16} />{isLoading ? "Refreshing" : "Refresh sources"}</button></header>
      <div className="radar-controls"><label><IconSearch size={17} /><span className="sr-only">Search opportunities</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search title, company or location" /></label><div className="radar-category-list" aria-label="Filter by role family">{categories.map(item => <button type="button" className={category === item ? "is-selected" : ""} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div></div>
      <div className="radar-summary"><span>{data ? `${data.jobs.length} current opportunities from public feeds` : "Reading public feeds"}</span><span>{data?.updatedAt ? `Checked ${new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit" }).format(new Date(data.updatedAt))}` : ""}</span></div>
      {error ? <div className="radar-message" role="status"><strong>Sources are unavailable right now.</strong><span>{error}</span><button type="button" onClick={() => void load()}>Try again</button></div> : <div className="radar-results" aria-live="polite">
        {isLoading ? Array.from({ length: 6 }, (_, index) => <div className="radar-skeleton" key={index} />) : visible.length ? visible.map(job => <article className="radar-job" key={job.id}><div className="radar-job-main"><span className="radar-job-source">{job.source}</span><h3>{job.title}</h3><p>{job.company} <i /> {job.location}</p></div><div className="radar-job-meta"><span>{job.category}</span><span>{job.type}</span><small>{relativeDate(job.publishedAt)}</small></div><a href={job.url} target="_blank" rel="noreferrer" aria-label={`Open ${job.title} at ${job.company}`}><IconArrowUpRight size={19} /></a></article>) : <div className="radar-empty"><IconBriefcase2 size={24} /><strong>No matching role in the current feed.</strong><p>Try another role family or a broader search.</p></div>}
      </div>}
      <footer className="radar-provenance"><span>Sources: <a href="https://jobicy.com" target="_blank" rel="noreferrer">Jobicy</a>, <a href="https://remotive.com" target="_blank" rel="noreferrer">Remotive</a> and <a href="https://remoteok.com" target="_blank" rel="noreferrer">Remote OK</a></span><span>Listings link to the original source.</span></footer>
    </div>
  </section>
}
