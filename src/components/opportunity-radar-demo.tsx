"use client"

import { useEffect, useMemo, useState } from "react"
import { IconArrowUpRight, IconBriefcase2, IconRefresh, IconSearch, IconX } from "@tabler/icons-react"

type Opportunity = { id: string; title: string; company: string; location: string; type: string; category: string; source: "Jobicy" | "Remotive" | "Remote OK" | "Ashby" | "Glassdoor" | "Himalayas" | "Arbeitnow" | "TheirStack" | "We Work Remotely" | "Landing.Jobs" | "Startup Jobs"; origin: "Public feed" | "Direct company feed" | "Commercial job API"; url: string; publishedAt: string | null }
type RadarData = { jobs: Opportunity[]; updatedAt: string; sources: string[]; glassdoorProvider?: "JSearch cursor" | "Glassdoor API sample" | "Unavailable"; contextAvailable?: boolean; message?: string }
type CompanyContext = { provider: string; retrievedAt: string; company: { name: string; industry: string | null; rating: number | null; reviewCount: number; salaryCount: number; careerOpportunities: number | null; culture: number | null; workLifeBalance: number | null; sourceUrl: string | null } }

const featuredCategories = ["All technology", "Product & Design", "UX/UI & Research", "Design Systems & Engineering", "Content & Brand", "Engineering", "Data & AI", "Platform & Cloud", "Developer Experience", "Security", "Product & Operations"]

export function OpportunityRadarCover() {
  return <div className="opportunity-radar-cover" aria-hidden="true">
    <header><span>Remote tech opportunity radar</span><b>Public utility</b></header>
    <div className="opportunity-radar-cover-copy"><span>Remote roles in</span><strong>Technology</strong><p>Worldwide</p></div>
    <div className="opportunity-radar-cover-tags"><span>Product</span><span>UX/UI</span><span>Engineering</span><span>Data & AI</span><span>Platform</span></div>
    <footer><span>Sources</span><b>Live feeds / direct links</b></footer>
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
  const [source, setSource] = useState<"All networks" | Opportunity["source"]>("All networks")
  const [sort, setSort] = useState<"recent" | "source">("recent")
  const [freshness, setFreshness] = useState<"any" | "48h" | "7d" | "30d">("any")
  const [query, setQuery] = useState("")
  const [shown, setShown] = useState(18)
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
      const body = await response.text()
      const payload = (body ? JSON.parse(body) : { message: "The source refresh ended without a response. Try again in a moment." }) as RadarData
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
  const matches = useMemo(() => {
    const search = query.trim().toLowerCase()
    const ageInHours = (job: Opportunity) => job.publishedAt ? Math.max(0, (Date.now() - new Date(job.publishedAt).getTime()) / 3600000) : Number.POSITIVE_INFINITY
    return (data?.jobs || []).filter(job =>
      (category === "All technology" || job.category === category) &&
      (origin === "All sources" || job.origin === origin) &&
      (source === "All networks" || job.source === source) &&
      (freshness === "any" || (freshness === "48h" && ageInHours(job) <= 48) || (freshness === "7d" && ageInHours(job) <= 168) || (freshness === "30d" && ageInHours(job) <= 720)) &&
      (!search || `${job.title} ${job.company} ${job.location} ${job.category} ${job.type} ${job.source}`.toLowerCase().includes(search))
    ).sort((a, b) => {
      if (sort === "source") return Number(b.origin === "Direct company feed") - Number(a.origin === "Direct company feed") || String(b.publishedAt || "").localeCompare(String(a.publishedAt || ""))
      return String(b.publishedAt || "").localeCompare(String(a.publishedAt || ""))
    })
  }, [category, data, freshness, origin, query, sort, source])
  const visible = matches.slice(0, shown)
  const categories = featuredCategories.filter(item => item === "All technology" || data?.jobs.some(job => job.category === item))
  const availableSources = useMemo(() => Array.from(new Set((data?.jobs || []).map(job => job.source))).sort(), [data])
  const sourceBreakdown = useMemo(() => availableSources.map(name => {
    const jobs = (data?.jobs || []).filter(job => job.source === name)
    return { name, count: jobs.length, newCount: jobs.filter(job => job.publishedAt && Date.now() - new Date(job.publishedAt).getTime() <= 48 * 3600000).length, origin: jobs[0]?.origin || "Public feed" }
  }), [availableSources, data])
  const glassdoorCount = data?.jobs.filter(job => job.origin === "Commercial job API").length || 0
  const glassdoorIsCursor = data?.glassdoorProvider === "JSearch cursor"

  return <section className="opportunity-radar" id="opportunity-radar" aria-labelledby="radar-title">
    <header className="opportunity-radar-intro">
      <div><span>Community utility</span><h2 id="radar-title">A clearer way to browse remote technology roles.</h2></div>
      <p>This public view combines remote listings from across markets. It keeps location and any supplied restriction visible, but it does not infer hiring eligibility, rank people or guarantee coverage.</p>
    </header>
    <div className="opportunity-radar-surface">
      <header className="radar-surface-head"><div><span>Remote tech opportunity radar</span><small>Remote only / global coverage</small></div><button type="button" onClick={() => void load()} disabled={isLoading}><IconRefresh size={16} />{isLoading ? "Refreshing" : "Refresh sources"}</button></header>
      <div className="radar-controls">
        <label className="radar-search"><IconSearch size={17} /><span className="sr-only">Search opportunities</span><input value={query} onChange={event => { setQuery(event.target.value); setShown(18) }} placeholder="Search title, company, location or skill" /></label>
        <div className="radar-filter-group"><span>Role family</span><div className="radar-category-list" aria-label="Filter by role family">{categories.map(item => <button type="button" className={category === item ? "is-selected" : ""} onClick={() => { setCategory(item); setShown(18) }} key={item}>{item}</button>)}</div></div>
        <div className="radar-select-row">
          <label><span>Source type</span><select value={origin} onChange={event => { setOrigin(event.target.value as typeof origin); setShown(18) }}><option>All sources</option><option>Direct company feed</option><option>Commercial job API</option><option>Public feed</option></select></label>
          <label><span>Network</span><select value={source} onChange={event => { setSource(event.target.value as typeof source); setShown(18) }}><option>All networks</option>{availableSources.map(item => <option key={item}>{item}</option>)}</select></label>
          <label><span>Published</span><select value={freshness} onChange={event => { setFreshness(event.target.value as typeof freshness); setShown(18) }}><option value="any">Any time</option><option value="48h">Last 48 hours</option><option value="7d">Last 7 days</option><option value="30d">Last 30 days</option></select></label>
          <label><span>Order</span><select value={sort} onChange={event => setSort(event.target.value as typeof sort)}><option value="recent">Newest first</option><option value="source">Direct feeds first</option></select></label>
          {(category !== "All technology" || origin !== "All sources" || source !== "All networks" || freshness !== "any" || query) && <button type="button" className="radar-clear-filters" onClick={() => { setCategory("All technology"); setOrigin("All sources"); setSource("All networks"); setFreshness("any"); setQuery(""); setShown(18) }}>Clear filters</button>}
        </div>
      </div>
      <div className="radar-summary"><span>{data ? `${matches.length} matching opportunities` : "Reading sources"}</span><span>{data ? `${availableSources.length} active sources` : ""}</span><span>{data?.updatedAt ? `Checked ${new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit" }).format(new Date(data.updatedAt))}` : ""}</span></div>
      {!isLoading && data && <aside className="radar-source-ledger" aria-label="Source coverage">
        <div className="radar-source-ledger-copy"><span>Coverage now</span><p>Every card links to its original posting. Location and eligibility stay exactly as supplied; neither is inferred.</p></div>
        <div className="radar-source-list">{sourceBreakdown.map(item => <button type="button" key={item.name} onClick={() => { setSource(item.name); setShown(18) }}><strong>{item.name}</strong><span>{item.count} roles</span><small>{item.newCount ? `${item.newCount} in 48h · ` : ""}{item.origin === "Direct company feed" ? "Direct" : item.origin === "Commercial job API" ? "API" : "Public"}</small></button>)}</div>
        <p className="radar-source-note">{glassdoorCount ? `${glassdoorIsCursor ? "Glassdoor via JSearch" : "Glassdoor API"} returned ${glassdoorCount} remote roles.` : "Glassdoor returned no remote roles in this refresh; it is not used to imply complete coverage."}</p>
      </aside>}
      {error ? <div className="radar-message" role="status"><strong>Sources are unavailable right now.</strong><span>{error}</span><button type="button" onClick={() => void load()}>Try again</button></div> : <div className="radar-results" aria-live="polite">
        {isLoading ? Array.from({ length: 6 }, (_, index) => <div className="radar-skeleton" key={index} />) : visible.length ? visible.map(job => <article className={`radar-job ${job.origin === "Direct company feed" ? "is-direct" : ""} ${job.origin === "Commercial job API" ? "is-api" : ""}`} key={job.id}><div className="radar-job-main"><span className="radar-job-source">{job.origin === "Direct company feed" ? "Direct Ashby feed" : job.origin === "Commercial job API" ? (glassdoorIsCursor ? "Glassdoor via JSearch" : "Glassdoor API sample") : job.source}</span><h3>{job.title}</h3><p>{job.company} <i /> {job.location}</p>{data?.contextAvailable && <button type="button" className="radar-context-trigger" onClick={() => void loadCompanyContext(job.company)}>{contextLoading === job.company ? "Reading company context" : "Inspect company context"}</button>}</div><div className="radar-job-meta"><span>{job.category}</span><span>{job.type}</span><small>{relativeDate(job.publishedAt)}</small></div><a href={job.url} target="_blank" rel="noreferrer" aria-label={`Open ${job.title} at ${job.company}`}><IconArrowUpRight size={19} /></a></article>) : <div className="radar-empty"><IconBriefcase2 size={24} /><strong>No matching role in the current feed.</strong><p>Try another role family or a broader search.</p></div>}
      </div>}
      {!isLoading && !error && matches.length > visible.length && <div className="radar-load-more"><span>Showing {visible.length} of {matches.length}</span><button type="button" onClick={() => setShown(current => current + 18)}>Show 18 more</button></div>}
      {(companyContext || contextError) && <section className="radar-company-context" aria-live="polite"><button type="button" onClick={() => { setCompanyContext(null); setContextError("") }} aria-label="Close company context"><IconX size={17} /></button>{contextError ? <><span>Company context</span><strong>Context unavailable</strong><p>{contextError}</p></> : companyContext && <><span>{companyContext.provider}</span><div><h3>{companyContext.company.name}</h3>{companyContext.company.industry && <p>{companyContext.company.industry}</p>}</div><dl><div><dt>Overall rating</dt><dd>{companyContext.company.rating ?? "Not supplied"}</dd></div><div><dt>Reviews</dt><dd>{companyContext.company.reviewCount || "Not supplied"}</dd></div><div><dt>Salary records</dt><dd>{companyContext.company.salaryCount || "Not supplied"}</dd></div><div><dt>Career opportunities</dt><dd>{companyContext.company.careerOpportunities ?? "Not supplied"}</dd></div></dl>{companyContext.company.sourceUrl && <a href={companyContext.company.sourceUrl} target="_blank" rel="noreferrer">Open source <IconArrowUpRight size={16} /></a>}</>}</section>}
      <footer className="radar-provenance"><span>Sources currently returning listings: {data?.sources.join(", ") || "Reading feeds"}.</span><span>Listings link to the original source.</span></footer>
    </div>
  </section>
}
