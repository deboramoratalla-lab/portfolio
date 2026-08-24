"use client"

import { useEffect, useMemo, useState } from "react"
import { IconArrowUpRight, IconBriefcase2, IconRefresh, IconSearch, IconX } from "@tabler/icons-react"

type Opportunity = { id: string; title: string; company: string; location: string; type: string; category: string; source: "Jobicy" | "Remotive" | "Remote OK" | "Ashby" | "Glassdoor"; origin: "Public feed" | "Direct company feed" | "Commercial job API"; url: string; publishedAt: string | null }
type RadarData = { jobs: Opportunity[]; updatedAt: string; sources: string[]; contextAvailable?: boolean; message?: string }
type CompanyContext = { provider: string; retrievedAt: string; company: { name: string; industry: string | null; rating: number | null; reviewCount: number; salaryCount: number; careerOpportunities: number | null; culture: number | null; workLifeBalance: number | null; sourceUrl: string | null } }

const featuredCategories = ["All technology", "Product & Design", "UX/UI & Research", "Design Systems & Engineering", "Content & Brand", "Engineering", "Data & AI", "Platform & Cloud", "Developer Experience", "Security", "Product & Operations"]

export function OpportunityRadarCover() {
  return <div className="opportunity-radar-cover" aria-hidden="true">
    <header><span>European tech opportunity radar</span><b>Public utility</b></header>
    <div className="opportunity-radar-cover-copy"><span>Remote roles in</span><strong>Technology</strong><p>Europe or Anywhere</p></div>
    <div className="opportunity-radar-cover-tags"><span>Product</span><span>UX/UI</span><span>Engineering</span><span>Data & AI</span><span>Platform</span></div>
    <footer><span>Sources</span><b>Public + Ashby + Glassdoor</b></footer>
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
  const [origin, setOrigin] = useState<"All sources" | Opportunity["origin"]>("All sources")
  const [query, setQuery] = useState("")
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [companyContext, setCompanyContext] = useState<CompanyContext | null>(null)
  const [contextError, setContextError] = useState("")
  const [contextLoading, setContextLoading] = useState("")

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
  const loadCompanyContext = async (company: string) => {
    setContextLoading(company); setContextError(""); setCompanyContext(null)
    try {
      const response = await fetch(`/api/opportunity-radar/company?company=${encodeURIComponent(company)}`)
      const payload = await response.json() as CompanyContext & { message?: string }
      if (!response.ok) throw new Error(payload.message || "Company context could not be read.")
      setCompanyContext(payload)
    } catch (cause) { setContextError(cause instanceof Error ? cause.message : "Company context could not be read.") }
    finally { setContextLoading("") }
  }
  const visible = useMemo(() => (data?.jobs || []).filter(job => (category === "All technology" || job.category === category) && (origin === "All sources" || job.origin === origin) && `${job.title} ${job.company} ${job.location}`.toLowerCase().includes(query.toLowerCase())).slice(0, 12), [category, data, origin, query])
  const categories = featuredCategories.filter(item => item === "All technology" || data?.jobs.some(job => job.category === item))
  const directCount = data?.jobs.filter(job => job.origin === "Direct company feed").length || 0

  return <section className="opportunity-radar" id="opportunity-radar" aria-labelledby="radar-title">
    <header className="opportunity-radar-intro">
      <div><span>Community utility</span><h2 id="radar-title">A clearer way to browse remote technology roles.</h2></div>
      <p>This public view combines remote listings that explicitly allow Europe or Anywhere. It shows source and date, but it does not rank people or guarantee coverage.</p>
    </header>
    <div className="opportunity-radar-surface">
      <header className="radar-surface-head"><div><span>European tech opportunity radar</span><small>Remote only / Europe or Anywhere</small></div><button type="button" onClick={() => void load()} disabled={isLoading}><IconRefresh size={16} />{isLoading ? "Refreshing" : "Refresh sources"}</button></header>
      <div className="radar-controls"><label><IconSearch size={17} /><span className="sr-only">Search opportunities</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search title, company or location" /></label><div className="radar-filter-group"><span>Role family</span><div className="radar-category-list" aria-label="Filter by role family">{categories.map(item => <button type="button" className={category === item ? "is-selected" : ""} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div></div><div className="radar-filter-group"><span>Source type</span><div className="radar-category-list" aria-label="Filter by source type">{(["All sources", "Direct company feed", "Commercial job API", "Public feed"] as const).map(item => <button type="button" className={origin === item ? "is-selected" : ""} onClick={() => setOrigin(item)} key={item}>{item}</button>)}</div></div></div>
      <div className="radar-summary"><span>{data ? `${data.jobs.length} current opportunities from direct, public and API sources` : "Reading sources"}</span><span>{data?.updatedAt ? `Checked ${new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit" }).format(new Date(data.updatedAt))}` : ""}</span></div>
      {!isLoading && data && <aside className="radar-evidence"><div><span>Direct Ashby feed</span><strong>{directCount} Europe-eligible roles</strong><p>Published by the employer through its own ATS. These are prioritised above aggregated listings.</p></div><div><span>Glassdoor job API</span><strong>UX, UI and design roles</strong><p>Remote Europe searches retrieved through OpenWeb Ninja, with each result linking back to Glassdoor.</p></div><div><span>Context policy</span><strong>Only disclose what is sourced</strong><p>Company context remains optional; jobs do not depend on a company-health lookup.</p></div></aside>}
      {error ? <div className="radar-message" role="status"><strong>Sources are unavailable right now.</strong><span>{error}</span><button type="button" onClick={() => void load()}>Try again</button></div> : <div className="radar-results" aria-live="polite">
        {isLoading ? Array.from({ length: 6 }, (_, index) => <div className="radar-skeleton" key={index} />) : visible.length ? visible.map(job => <article className={`radar-job ${job.origin === "Direct company feed" ? "is-direct" : ""} ${job.origin === "Commercial job API" ? "is-api" : ""}`} key={job.id}><div className="radar-job-main"><span className="radar-job-source">{job.origin === "Direct company feed" ? "Direct Ashby feed" : job.origin === "Commercial job API" ? "Glassdoor job API" : job.source}</span><h3>{job.title}</h3><p>{job.company} <i /> {job.location}</p>{data?.contextAvailable && <button type="button" className="radar-context-trigger" onClick={() => void loadCompanyContext(job.company)}>{contextLoading === job.company ? "Reading company context" : "Inspect company context"}</button>}</div><div className="radar-job-meta"><span>{job.category}</span><span>{job.type}</span><small>{relativeDate(job.publishedAt)}</small></div><a href={job.url} target="_blank" rel="noreferrer" aria-label={`Open ${job.title} at ${job.company}`}><IconArrowUpRight size={19} /></a></article>) : <div className="radar-empty"><IconBriefcase2 size={24} /><strong>No matching role in the current feed.</strong><p>Try another role family or a broader search.</p></div>}
      </div>}
      {(companyContext || contextError) && <section className="radar-company-context" aria-live="polite"><button type="button" onClick={() => { setCompanyContext(null); setContextError("") }} aria-label="Close company context"><IconX size={17} /></button>{contextError ? <><span>Company context</span><strong>Context unavailable</strong><p>{contextError}</p></> : companyContext && <><span>{companyContext.provider}</span><div><h3>{companyContext.company.name}</h3>{companyContext.company.industry && <p>{companyContext.company.industry}</p>}</div><dl><div><dt>Overall rating</dt><dd>{companyContext.company.rating ?? "Not supplied"}</dd></div><div><dt>Reviews</dt><dd>{companyContext.company.reviewCount || "Not supplied"}</dd></div><div><dt>Salary records</dt><dd>{companyContext.company.salaryCount || "Not supplied"}</dd></div><div><dt>Career opportunities</dt><dd>{companyContext.company.careerOpportunities ?? "Not supplied"}</dd></div></dl>{companyContext.company.sourceUrl && <a href={companyContext.company.sourceUrl} target="_blank" rel="noreferrer">Open source <IconArrowUpRight size={16} /></a>}</>}</section>}
      <footer className="radar-provenance"><span>Sources: <a href="https://jobicy.com" target="_blank" rel="noreferrer">Jobicy</a>, <a href="https://remotive.com" target="_blank" rel="noreferrer">Remotive</a>, <a href="https://remoteok.com" target="_blank" rel="noreferrer">Remote OK</a>, direct Ashby ATS and Glassdoor via API</span><span>Listings link to the original source.</span></footer>
    </div>
  </section>
}
