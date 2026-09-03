"use client"

import { useEffect, useMemo, useState } from "react"
import { IconArrowUpRight, IconBriefcase2, IconRefresh, IconSearch, IconX } from "@tabler/icons-react"

type Opportunity = { id: string; title: string; company: string; location: string; type: string; category: string; source: "Jobicy" | "Remotive" | "Remote OK" | "Ashby" | "Glassdoor" | "Himalayas" | "Arbeitnow" | "TheirStack" | "We Work Remotely" | "Landing.Jobs" | "Startup Jobs" | "Remote First Jobs"; origin: "Public feed" | "Direct company feed" | "Commercial job API"; url: string; publishedAt: string | null }
type RadarData = { jobs: Opportunity[]; updatedAt: string; sources: string[]; glassdoorProvider?: "JSearch cursor" | "Glassdoor API sample" | "Unavailable"; contextAvailable?: boolean; message?: string }
type CompanyContext = { provider: string; retrievedAt: string; company: { name: string; industry: string | null; rating: number | null; reviewCount: number; salaryCount: number; careerOpportunities: number | null; culture: number | null; workLifeBalance: number | null; sourceUrl: string | null } }

const featuredCategories = ["All opportunities", "Product, UX & Research", "Creative & Brand", "Marketing & Growth", "Engineering", "Data & AI", "Cloud & Platform", "Developer Experience", "Security", "Product & Operations"]
const marketRoutes = [
  { name: "EURES", description: "Official European labour-market network", href: "https://eures.europa.eu/index_en" },
  { name: "Wellfound", description: "Startup roles and company context", href: "https://wellfound.com/jobs" },
  { name: "Get on Board", description: "Curated technology roles across markets", href: "https://www.getonbrd.com/jobs" },
  { name: "Quibit", description: "Technology roles with region and contract filters", href: "https://www.qibit.tech/" },
  { name: "Torre", description: "Global remote work across technical disciplines", href: "https://torre.co/es" },
  { name: "Hireline", description: "Technology, data and security roles", href: "https://hireline.io/mx" },
  { name: "Working Nomads", description: "Curated remote work", href: "https://www.workingnomads.com/jobs" },
]
const searchHelpers = [
  { label: "Discover earlier", links: [{ name: "Scoutify", href: "https://scoutify.com" }, { name: "LinkedIn job alerts", href: "https://www.linkedin.com/jobs" }, { name: "Google Alerts", href: "https://www.google.com/alerts" }] },
  { label: "Compare a role to your experience", links: [{ name: "Teal", href: "https://www.tealhq.com" }, { name: "Pronto", href: "https://www.gopronto.co" }] },
]
const PAGE_SIZE = 18

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

function seniorityFor(title: string) {
  const value = title.toLowerCase()
  if (/\b(intern|internship|graduate|apprentice|entry[ -]?level|junior|jr\.?)\b/.test(value)) return "Entry level"
  if (/\b(staff|principal|distinguished)\b/.test(value)) return "Staff & principal"
  if (/\b(lead|manager|director|head of|vice president|\bvp\b)\b/.test(value)) return "Lead & management"
  if (/\b(senior|sr\.?)\b/.test(value)) return "Senior"
  return "Not specified"
}

function contractFor(type: string) {
  const value = type.toLowerCase()
  if (/\b(full[ -]?time|permanent)\b/.test(value)) return "Full-time"
  if (/\b(contract|temporary|fixed[ -]?term)\b/.test(value)) return "Contract"
  if (/\b(part[ -]?time)\b/.test(value)) return "Part-time"
  if (/\b(intern|internship)\b/.test(value)) return "Internship"
  if (/\b(freelance|consultant|consulting)\b/.test(value)) return "Freelance"
  return "Not specified"
}

function locationScopeFor(location: string) {
  const value = location.toLowerCase()
  if (/worldwide|anywhere|global/.test(value)) return "Worldwide"
  if (/europe|emea|european|spain|germany|france|italy|portugal|netherlands|belgium|ireland|united kingdom|\buk\b|sweden|denmark|norway|finland|poland|austria|switzerland/.test(value)) return "Europe listed"
  if (/restriction|not supplied|shown on source/.test(value)) return "Restrictions on source"
  return "Location listed"
}

function categoryMatches(selected: string, job: Opportunity) {
  if (selected === "All opportunities") return true
  if (selected === "Product, UX & Research") return ["Product & Design", "UX/UI & Research", "Design Systems & Engineering", "Product & Operations"].includes(job.category)
  return job.category === selected
}

export function OpportunityRadarDemo() {
  const [data, setData] = useState<RadarData | null>(null)
  const [category, setCategory] = useState("All opportunities")
  const [origin, setOrigin] = useState<"All sources" | Opportunity["origin"]>("All sources")
  const [source, setSource] = useState<"All networks" | Opportunity["source"]>("All networks")
  const [sort, setSort] = useState<"recent" | "source">("recent")
  const [freshness, setFreshness] = useState<"any" | "48h" | "7d" | "30d">("any")
  const [seniority, setSeniority] = useState("Any level")
  const [contract, setContract] = useState("Any contract")
  const [locationScope, setLocationScope] = useState("Any location scope")
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
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
      categoryMatches(category, job) &&
      (origin === "All sources" || job.origin === origin) &&
      (source === "All networks" || job.source === source) &&
      (freshness === "any" || (freshness === "48h" && ageInHours(job) <= 48) || (freshness === "7d" && ageInHours(job) <= 168) || (freshness === "30d" && ageInHours(job) <= 720)) &&
      (seniority === "Any level" || seniorityFor(job.title) === seniority) &&
      (contract === "Any contract" || contractFor(job.type) === contract) &&
      (locationScope === "Any location scope" || locationScopeFor(job.location) === locationScope) &&
      (!search || `${job.title} ${job.company} ${job.location} ${job.category} ${job.type} ${job.source}`.toLowerCase().includes(search))
    ).sort((a, b) => {
      if (sort === "source") return Number(b.origin === "Direct company feed") - Number(a.origin === "Direct company feed") || String(b.publishedAt || "").localeCompare(String(a.publishedAt || ""))
      return String(b.publishedAt || "").localeCompare(String(a.publishedAt || ""))
    })
  }, [category, contract, data, freshness, locationScope, origin, query, seniority, sort, source])
  const pageCount = Math.max(1, Math.ceil(matches.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const visible = matches.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const pageOptions = Array.from({ length: pageCount }, (_, index) => index + 1).filter(item => item === 1 || item === pageCount || Math.abs(item - currentPage) <= 1)
  const categories = featuredCategories.filter(item => item === "All opportunities" || (item === "Product, UX & Research" ? data?.jobs.some(job => categoryMatches(item, job)) : data?.jobs.some(job => job.category === item)) )
  const availableSources = useMemo(() => Array.from(new Set((data?.jobs || []).map(job => job.source))).sort(), [data])
  const seniorityOptions = useMemo(() => ["Any level", ...Array.from(new Set((data?.jobs || []).map(job => seniorityFor(job.title)))).filter(item => item !== "Not specified"), "Not specified"], [data])
  const contractOptions = useMemo(() => ["Any contract", ...Array.from(new Set((data?.jobs || []).map(job => contractFor(job.type)))).filter(item => item !== "Not specified"), "Not specified"], [data])
  const locationScopeOptions = useMemo(() => ["Any location scope", ...Array.from(new Set((data?.jobs || []).map(job => locationScopeFor(job.location))))], [data])
  useEffect(() => { if (page > pageCount) setPage(pageCount) }, [page, pageCount])
  const sourceBreakdown = useMemo(() => availableSources.map(name => {
    const jobs = (data?.jobs || []).filter(job => job.source === name)
    return { name, count: jobs.length, newCount: jobs.filter(job => job.publishedAt && Date.now() - new Date(job.publishedAt).getTime() <= 48 * 3600000).length, origin: jobs[0]?.origin || "Public feed" }
  }), [availableSources, data])
  const glassdoorCount = data?.jobs.filter(job => job.origin === "Commercial job API").length || 0
  const glassdoorIsCursor = data?.glassdoorProvider === "JSearch cursor"

  return <section className="opportunity-radar" id="opportunity-radar" aria-labelledby="radar-title">
    <header className="opportunity-radar-intro">
      <div><span>Community utility</span><h2 id="radar-title">Start with a clearer view of remote technology work.</h2></div>
      <p>Explore live roles across product, design and technology, with their source and location kept visible from the start.</p>
    </header>
    <div className="opportunity-radar-surface">
      <header className="radar-surface-head"><div><span>Remote opportunities</span><small>Live public feeds · global coverage</small></div><button type="button" onClick={() => void load()} disabled={isLoading}><IconRefresh size={16} />{isLoading ? "Refreshing" : "Refresh roles"}</button></header>
      <div className="radar-controls">
        <label className="radar-search"><IconSearch size={18} /><span className="sr-only">Search opportunities</span><input value={query} onChange={event => { setQuery(event.target.value); setPage(1) }} placeholder="Try Product designer, React, Madrid…" /></label>
        <div className="radar-filter-group"><span>Choose a role family</span><div className="radar-category-list" aria-label="Filter by role family">{categories.map(item => <button type="button" className={category === item ? "is-selected" : ""} onClick={() => { setCategory(item); setPage(1) }} key={item}>{item}</button>)}</div></div>
        <div className="radar-select-row radar-primary-filters">
          <label><span>Published</span><select value={freshness} onChange={event => { setFreshness(event.target.value as typeof freshness); setPage(1) }}><option value="any">Any time</option><option value="48h">Last 48 hours</option><option value="7d">Last 7 days</option><option value="30d">Last 30 days</option></select></label>
          <label><span>Experience level</span><select value={seniority} onChange={event => { setSeniority(event.target.value); setPage(1) }}>{seniorityOptions.map(item => <option key={item}>{item}</option>)}</select></label>
          <label><span>Employment type</span><select value={contract} onChange={event => { setContract(event.target.value); setPage(1) }}>{contractOptions.map(item => <option key={item}>{item}</option>)}</select></label>
          <label><span>Location in the posting</span><select value={locationScope} onChange={event => { setLocationScope(event.target.value); setPage(1) }}>{locationScopeOptions.map(item => <option key={item}>{item}</option>)}</select></label>
          {(category !== "All opportunities" || origin !== "All sources" || source !== "All networks" || freshness !== "any" || seniority !== "Any level" || contract !== "Any contract" || locationScope !== "Any location scope" || query) && <button type="button" className="radar-clear-filters" onClick={() => { setCategory("All opportunities"); setOrigin("All sources"); setSource("All networks"); setFreshness("any"); setSeniority("Any level"); setContract("Any contract"); setLocationScope("Any location scope"); setQuery(""); setPage(1) }}>Reset filters</button>}
        </div>
        <details className="radar-advanced-filters"><summary>Source and sorting options</summary><div className="radar-select-row"><label><span>Source type</span><select value={origin} onChange={event => { setOrigin(event.target.value as typeof origin); setPage(1) }}><option>All sources</option><option>Direct company feed</option><option>Commercial job API</option><option>Public feed</option></select></label><label><span>Network</span><select value={source} onChange={event => { setSource(event.target.value as typeof source); setPage(1) }}><option>All networks</option>{availableSources.map(item => <option key={item}>{item}</option>)}</select></label><label><span>Order</span><select value={sort} onChange={event => { setSort(event.target.value as typeof sort); setPage(1) }}><option value="recent">Newest first</option><option value="source">Direct feeds first</option></select></label></div></details>
      </div>
      <div className="radar-summary"><span>{data ? `${matches.length} roles to explore` : "Reading sources"}</span><span>{data ? `${availableSources.length} live networks` : ""}</span><span>{data?.updatedAt ? `Checked ${new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit" }).format(new Date(data.updatedAt))}` : ""}</span></div>
      {!isLoading && data && <aside className="radar-source-ledger" aria-label="Source coverage">
        <div className="radar-source-ledger-copy"><span>Where these roles come from</span><p>Every card links to its original posting. Location and eligibility stay exactly as supplied; neither is inferred.</p></div>
        <div className="radar-source-list">{sourceBreakdown.map(item => <button type="button" key={item.name} onClick={() => { setSource(item.name); setPage(1) }}><strong>{item.name}</strong><span>{item.count} roles</span><small>{item.newCount ? `${item.newCount} in 48h · ` : ""}{item.origin === "Direct company feed" ? "Direct" : item.origin === "Commercial job API" ? "API" : "Public"}</small></button>)}</div>
        <p className="radar-source-note">{glassdoorCount ? `${glassdoorIsCursor ? "Glassdoor via JSearch" : "Glassdoor API"} returned ${glassdoorCount} remote roles.` : "Glassdoor returned no remote roles in this refresh; it is not used to imply complete coverage."}</p>
      </aside>}
      <aside className="radar-market-routes" aria-label="More places to explore">
        <div><span>Broaden the search</span><p>These trusted boards are not counted above because they do not expose a general public feed for this tool.</p></div>
        <nav>{marketRoutes.map(route => <a href={route.href} target="_blank" rel="noreferrer" key={route.name}><strong>{route.name}</strong><span>{route.description}</span><IconArrowUpRight size={16} /></a>)}</nav>
      </aside>
      {error ? <div className="radar-message" role="status"><strong>Sources are unavailable right now.</strong><span>{error}</span><button type="button" onClick={() => void load()}>Try again</button></div> : <div className="radar-results" aria-live="polite">
        {isLoading ? Array.from({ length: 6 }, (_, index) => <div className="radar-skeleton" key={index} />) : visible.length ? visible.map(job => <article className={`radar-job ${job.origin === "Direct company feed" ? "is-direct" : ""} ${job.origin === "Commercial job API" ? "is-api" : ""}`} key={job.id}><div className="radar-job-main"><span className="radar-job-source">{job.origin === "Direct company feed" ? "Direct Ashby feed" : job.origin === "Commercial job API" ? (glassdoorIsCursor ? "Glassdoor via JSearch" : "Glassdoor API sample") : job.source}</span><h3>{job.title}</h3><p>{job.company} <i /> {job.location}</p>{data?.contextAvailable && <button type="button" className="radar-context-trigger" onClick={() => void loadCompanyContext(job.company)}>{contextLoading === job.company ? "Reading company context" : "Inspect company context"}</button>}</div><div className="radar-job-meta"><span>{job.category}</span><span>{job.type}</span><small>{relativeDate(job.publishedAt)}</small></div><a href={job.url} target="_blank" rel="noreferrer" aria-label={`Open ${job.title} at ${job.company}`}><IconArrowUpRight size={19} /></a></article>) : <div className="radar-empty"><IconBriefcase2 size={24} /><strong>No matching role in the current feed.</strong><p>Try another role family or a broader search.</p></div>}
      </div>}
      {!isLoading && !error && matches.length > PAGE_SIZE && <nav className="radar-pagination" aria-label="Opportunity pages"><span>Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, matches.length)} of {matches.length}</span><div><button type="button" onClick={() => setPage(current => Math.max(1, current - 1))} disabled={currentPage === 1}>Previous</button>{pageOptions.map((item, index) => <span className="radar-pagination-item" key={item}>{index > 0 && item - pageOptions[index - 1] > 1 && <span className="radar-pagination-gap" aria-hidden="true">…</span>}<button type="button" onClick={() => setPage(item)} aria-current={currentPage === item ? "page" : undefined} className={currentPage === item ? "is-current" : ""}>{item}</button></span>)}<button type="button" onClick={() => setPage(current => Math.min(pageCount, current + 1))} disabled={currentPage === pageCount}>Next</button></div></nav>}
      {(companyContext || contextError) && <section className="radar-company-context" aria-live="polite"><button type="button" onClick={() => { setCompanyContext(null); setContextError("") }} aria-label="Close company context"><IconX size={17} /></button>{contextError ? <><span>Company context</span><strong>Context unavailable</strong><p>{contextError}</p></> : companyContext && <><span>{companyContext.provider}</span><div><h3>{companyContext.company.name}</h3>{companyContext.company.industry && <p>{companyContext.company.industry}</p>}</div><dl><div><dt>Overall rating</dt><dd>{companyContext.company.rating ?? "Not supplied"}</dd></div><div><dt>Reviews</dt><dd>{companyContext.company.reviewCount || "Not supplied"}</dd></div><div><dt>Salary records</dt><dd>{companyContext.company.salaryCount || "Not supplied"}</dd></div><div><dt>Career opportunities</dt><dd>{companyContext.company.careerOpportunities ?? "Not supplied"}</dd></div></dl>{companyContext.company.sourceUrl && <a href={companyContext.company.sourceUrl} target="_blank" rel="noreferrer">Open source <IconArrowUpRight size={16} /></a>}</>}</section>}
      <aside className="radar-search-support" aria-label="Useful job-search tools"><div><span>Keep the search moving</span><p>These tools help with discovery and preparation; they do not alter or rank the roles in this radar.</p></div><div>{searchHelpers.map(group => <section key={group.label}><h3>{group.label}</h3><ul>{group.links.map(link => <li key={link.name}><a href={link.href} target="_blank" rel="noreferrer">{link.name}<IconArrowUpRight size={14} /></a></li>)}</ul></section>)}</div></aside>
      <footer className="radar-provenance"><span>Sources currently returning listings: {data?.sources.join(", ") || "Reading feeds"}.</span><span>Listings link to the original source.</span></footer>
    </div>
  </section>
}
