import { NextResponse } from "next/server"
import { unstable_cache } from "next/cache"

export const revalidate = 43200
export const dynamic = "force-dynamic"
// Glassdoor is a commercial source. Its country snapshots are intentionally
// cached longer than the public feeds so a refresh button cannot exhaust an
// API allowance by repeatedly re-running the same searches.
const GLASSDOOR_REVALIDATE = 604800

type SourceJob = {
  id?: string | number
  jobTitle?: string
  title?: string
  companyName?: string
  company_name?: string
  jobGeo?: string
  candidate_required_location?: string
  url?: string
  url_original?: string
  jobType?: string[]
  job_type?: string
  jobIndustry?: string[]
  category?: string
  pubDate?: string
  publication_date?: string
}

type Opportunity = {
  id: string
  title: string
  company: string
  location: string
  type: string
  category: string
  source: "Jobicy" | "Remotive" | "Remote OK" | "Ashby" | "Glassdoor" | "Himalayas" | "Arbeitnow" | "TheirStack" | "We Work Remotely" | "Landing.Jobs" | "Startup Jobs"
  origin: "Public feed" | "Direct company feed" | "Commercial job API"
  url: string
  publishedAt: string | null
}

function normaliseDate(value: unknown) {
  if (typeof value === "string") return value
  if (typeof value === "number" && Number.isFinite(value)) return new Date(value < 1e12 ? value * 1000 : value).toISOString()
  return null
}

function categoryFor(title: string, sourceCategory = "") {
  const text = `${title} ${sourceCategory}`.toLowerCase()
  if (/product manager|project manager|program manager|technical program|operations/.test(text)) return "Product & Operations"
  if (/design system|design engineer|design technologist|ui engineer/.test(text)) return "Design Systems & Engineering"
  if (/product design|product designer/.test(text)) return "Product & Design"
  if (/\bux\b|\bui\b|user experience|user interface|interaction designer|ux researcher|user researcher|design researcher/.test(text)) return "UX/UI & Research"
  if (/content designer|brand designer|visual designer|creative director/.test(text)) return "Content & Brand"
  if (/developer relations|devrel|technical writer|solutions architect|developer advocate/.test(text)) return "Developer Experience"
  if (/security|privacy|identity|trust/.test(text)) return "Security"
  if (/devops|sre|platform|cloud|infrastructure|systems engineer/.test(text)) return "Platform & Cloud"
  if (/data|machine learning|\bml\b|artificial intelligence|\bai\b|analytics|scientist/.test(text)) return "Data & AI"
  if (/engineer|developer|frontend|front-end|backend|back-end|software|quality assurance|\bqa\b/.test(text)) return "Engineering"
  return "Technology"
}

function normaliseJob(job: SourceJob, source: Opportunity["source"]): Opportunity | null {
  const title = job.jobTitle || job.title
  const company = job.companyName || job.company_name
  const location = job.jobGeo || job.candidate_required_location || "Remote"
  const url = job.url || job.url_original
  if (!title || !company || !url) return null
  const type = Array.isArray(job.jobType) ? job.jobType.join(", ") : job.jobType || job.job_type || "Not specified"
  const industry = Array.isArray(job.jobIndustry) ? job.jobIndustry.join(" ") : job.jobIndustry || job.category || ""
  return { id: `${source}-${job.id || `${company}-${title}`}`, title, company, location, type, category: categoryFor(title, industry), source, origin: "Public feed", url, publishedAt: normaliseDate(job.pubDate || job.publication_date) }
}

type RemoteOkJob = {
  id?: string | number
  position?: string
  company?: string
  location?: string
  url?: string
  apply_url?: string
  tags?: string[]
  date?: string
}

function normaliseRemoteOk(job: RemoteOkJob): Opportunity | null {
  const title = job.position
  const company = job.company
  const location = job.location || "Remote"
  const url = job.apply_url || job.url
  if (!title || !company || !url) return null
  const tags = (job.tags || []).join(" ")
  return {
    id: `remote-ok-${job.id || `${company}-${title}`}`,
    title,
    company,
    location,
    type: "Remote",
    category: categoryFor(title, tags),
    source: "Remote OK",
    origin: "Public feed",
    url,
    publishedAt: normaliseDate(job.date),
  }
}

type AshbyJob = {
  id: string
  title: string
  department?: string
  team?: string
  employmentType?: string
  location?: string
  secondaryLocations?: { location?: string }[]
  publishedAt?: string
  isRemote?: boolean
  workplaceType?: string
  jobUrl?: string
}

type JSearchJob = {
  job_id?: string
  job_title?: string
  employer_name?: string
  job_location?: string
  job_country?: string
  job_apply_link?: string
  job_google_link?: string
  job_employment_type?: string
  job_is_remote?: boolean | null
  work_arrangement?: string | null
  job_posted_at_datetime_utc?: string
  job_publisher?: string
}

type JSearchResponse = {
  data?: JSearchJob[]
  next_cursor?: string | null
  next_page_token?: string | null
  cursor?: string | null
}

type TheirStackJob = { id?: string | number; job_title?: string; company?: string; location?: string; short_location?: string; country?: string; workplace_types?: string[]; employment_statuses?: string[]; date_posted?: string; url?: string; final_url?: string; source_url?: string }

type LegacyGlassdoorJob = {
  job_id: string | number
  job_title: string
  company_name: string
  location_name?: string
  job_link: string
  age_in_days?: number
}

function normaliseAshby(job: AshbyJob): Opportunity | null {
  const location = [job.location, ...(job.secondaryLocations || []).map(item => item.location)].filter(Boolean).join(", ") || "Remote"
  if (!job.isRemote || !job.jobUrl) return null
  const category = categoryFor(job.title, `${job.department || ""} ${job.team || ""}`)
  return {
    id: `ashby-linear-${job.id}`,
    title: job.title,
    company: "Linear",
    location,
    type: job.employmentType || job.workplaceType || "Remote",
    category,
    source: "Ashby",
    origin: "Direct company feed",
    url: job.jobUrl,
    publishedAt: normaliseDate(job.publishedAt),
  }
}

async function sourceFeed(url: string, source: Opportunity["source"]) {
  const response = await fetch(url, { next: { revalidate } })
  if (!response.ok) throw new Error(`${source} returned ${response.status}`)
  const payload = await response.json() as { jobs?: SourceJob[] }
  return (payload.jobs || []).map(job => normaliseJob(job, source)).filter((job): job is Opportunity => Boolean(job))
}

async function jobicyFeed() {
  return sourceFeed("https://jobicy.com/api/v2/remote-jobs?count=100", "Jobicy")
}

type HimalayasJob = {
  guid?: string
  title?: string
  companyName?: string
  locationRestrictions?: string[]
  timezoneRestriction?: string[]
  employmentType?: string
  category?: string[]
  parentCategories?: string[]
  pubDate?: string
  applicationLink?: string
}

type ArbeitnowJob = {
  slug?: string
  title?: string
  company_name?: string
  location?: string
  remote?: boolean
  url?: string
  tags?: string[]
  job_types?: string[]
  created_at?: number
}

type LandingJob = {
  id?: string | number
  title?: string
  job_title?: string
  position_name?: string
  company?: string | { name?: string }
  company_name?: string
  city?: string
  country_name?: string
  remote?: boolean
  url?: string
  apply_url?: string
  job_url?: string
  published_at?: string
  employment_type?: string
  categories?: string[]
}

function normaliseHimalayas(job: HimalayasJob): Opportunity | null {
  const location = job.locationRestrictions?.join(", ") || "Remote / restrictions not supplied"
  if (!job.guid || !job.title || !job.companyName || !job.applicationLink) return null
  const category = [...(job.category || []), ...(job.parentCategories || [])].join(" ")
  return { id: `himalayas-${job.guid}`, title: job.title, company: job.companyName, location, type: job.employmentType || "Remote", category: categoryFor(job.title, category), source: "Himalayas", origin: "Public feed", url: job.applicationLink, publishedAt: normaliseDate(job.pubDate) }
}

function normaliseArbeitnow(job: ArbeitnowJob): Opportunity | null {
  const location = job.location || (job.remote ? "Remote / restrictions not supplied" : "")
  if (!job.slug || !job.title || !job.company_name || !job.url || !job.remote) return null
  const tags = (job.tags || []).join(" ")
  return { id: `arbeitnow-${job.slug}`, title: job.title, company: job.company_name, location, type: (job.job_types || []).join(", ") || "Remote", category: categoryFor(job.title, tags), source: "Arbeitnow", origin: "Public feed", url: job.url, publishedAt: job.created_at ? new Date(job.created_at * 1000).toISOString() : null }
}

async function himalayasFeed() {
  const response = await fetch("https://himalayas.app/jobs/api?limit=20", { next: { revalidate }, signal: AbortSignal.timeout(8000) })
  if (!response.ok) throw new Error(`Himalayas returned ${response.status}`)
  const payload = await response.json() as { jobs?: HimalayasJob[]; data?: HimalayasJob[] }
  return (payload.jobs || payload.data || []).map(normaliseHimalayas).filter((job): job is Opportunity => Boolean(job))
}

async function arbeitnowFeed() {
  const response = await fetch("https://www.arbeitnow.com/api/job-board-api", { next: { revalidate }, signal: AbortSignal.timeout(8000) })
  if (!response.ok) throw new Error(`Arbeitnow returned ${response.status}`)
  const payload = await response.json() as { data?: ArbeitnowJob[] }
  return (payload.data || []).map(normaliseArbeitnow).filter((job): job is Opportunity => Boolean(job))
}

async function remoteOkFeed() {
  const response = await fetch("https://remoteok.com/api", { next: { revalidate } })
  if (!response.ok) throw new Error(`Remote OK returned ${response.status}`)
  const payload = await response.json() as RemoteOkJob[]
  return payload.map(normaliseRemoteOk).filter((job): job is Opportunity => Boolean(job))
}

async function directCompanyFeed() {
  const response = await fetch("https://api.ashbyhq.com/posting-api/job-board/linear", { next: { revalidate } })
  if (!response.ok) throw new Error(`Ashby returned ${response.status}`)
  const payload = await response.json() as { jobs?: AshbyJob[] }
  return (payload.jobs || []).map(normaliseAshby).filter((job): job is Opportunity => Boolean(job))
}

function decodeXml(value: string) {
  return value.replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/i, "$1").replace(/<[^>]+>/g, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/\s+/g, " ").trim()
}

function rssValue(item: string, tag: string) {
  const match = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))
  return match ? decodeXml(match[1]) : ""
}

function normaliseRss(xml: string, source: "We Work Remotely" | "Startup Jobs") {
  const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) || []
  return items.map((item, index): Opportunity | null => {
    const rawTitle = rssValue(item, "title")
    const url = rssValue(item, "link")
    const publishedAt = rssValue(item, "pubDate") || rssValue(item, "published")
    const category = rssValue(item, "category")
    if (!rawTitle || !url) return null
    const separator = rawTitle.lastIndexOf(" at ")
    const title = separator > 0 ? rawTitle.slice(0, separator).trim() : rawTitle
    const company = separator > 0 ? rawTitle.slice(separator + 4).trim() : source
    return { id: `${source.toLowerCase().replace(/\W+/g, "-")}-${index}-${url}`, title, company, location: "Remote / restrictions shown on source", type: "Remote", category: categoryFor(title, category), source, origin: "Public feed", url, publishedAt: normaliseDate(publishedAt) }
  }).filter((job): job is Opportunity => Boolean(job))
}

async function rssFeed(url: string, source: "We Work Remotely" | "Startup Jobs") {
  const response = await fetch(url, { next: { revalidate }, signal: AbortSignal.timeout(12000) })
  if (!response.ok) throw new Error(`${source} returned ${response.status}`)
  return normaliseRss(await response.text(), source)
}

async function weWorkRemotelyFeed() {
  return rssFeed("https://weworkremotely.com/remote-jobs.rss", "We Work Remotely")
}

async function startupJobsFeed() {
  return rssFeed("https://startup.jobs/feeds/jobs?workplace=remote", "Startup Jobs")
}

function normaliseLanding(job: LandingJob): Opportunity | null {
  const title = job.title || job.job_title || job.position_name
  const company = typeof job.company === "string" ? job.company : job.company?.name || job.company_name
  const url = job.url || job.apply_url || job.job_url
  if (!job.id || !title || !company || !url || !job.remote) return null
  const location = [job.city, job.country_name].filter(Boolean).join(", ") || "Remote / restrictions shown on source"
  return { id: `landing-jobs-${job.id}`, title, company, location, type: job.employment_type || "Remote", category: categoryFor(title, (job.categories || []).join(" ")), source: "Landing.Jobs", origin: "Public feed", url, publishedAt: normaliseDate(job.published_at) }
}

async function landingJobsFeed() {
  const endpoint = new URL("https://landing.jobs/api/v1/jobs")
  endpoint.searchParams.set("limit", "50")
  endpoint.searchParams.set("offset", "0")
  const response = await fetch(endpoint, { next: { revalidate }, signal: AbortSignal.timeout(12000) })
  if (!response.ok) throw new Error(`Landing.Jobs returned ${response.status}`)
  const payload = await response.json() as LandingJob[] | { jobs?: LandingJob[]; data?: LandingJob[] }
  const jobs = Array.isArray(payload) ? payload : payload.jobs || payload.data || []
  return jobs.map(normaliseLanding).filter((job): job is Opportunity => Boolean(job))
}

const theirStackFeed = unstable_cache(async (): Promise<Opportunity[]> => {
  const apiKey = process.env.THEIRSTACK_API_KEY
  if (!apiKey) return []
  const response = await fetch("https://api.theirstack.com/v1/jobs/search", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ job_title_or: ["product designer", "ux designer", "ui designer", "ux researcher", "design engineer", "software engineer", "data engineer", "devops engineer", "product manager"], workplace_types_or: ["remote"], posted_at_max_age_days: 30, property_exists_or: ["final_url"], is_closed: false, limit: 50, page: 0, include_total_results: true }),
    signal: AbortSignal.timeout(15000),
  })
  if (!response.ok) throw new Error(`TheirStack returned ${response.status}`)
  const payload = await response.json() as { data?: TheirStackJob[] }
  return (payload.data || []).map(normaliseTheirStack).filter((job): job is Opportunity => Boolean(job))
}, ["theirstack-remote-opportunity-radar-v1"], { revalidate: 2592000 })

function normaliseJSearch(job: JSearchJob): Opportunity | null {
  const location = job.job_location || job.job_country || "Remote / restrictions not supplied"
  const url = job.job_apply_link || job.job_google_link
  if (!job.job_id || !job.job_title || !job.employer_name || !url) return null
  return {
    id: `glassdoor-${job.job_id}`,
    title: job.job_title,
    company: job.employer_name,
    location,
    type: job.work_arrangement || job.job_employment_type || "Remote",
    category: categoryFor(job.job_title),
    source: "Glassdoor",
    origin: "Commercial job API",
    url,
    publishedAt: normaliseDate(job.job_posted_at_datetime_utc),
  }
}

function normaliseTheirStack(job: TheirStackJob): Opportunity | null {
  const url = job.final_url || job.url || job.source_url
  if (!job.id || !job.job_title || !job.company || !url) return null
  return { id: `theirstack-${job.id}`, title: job.job_title, company: job.company, location: job.location || job.short_location || job.country || "Remote / restrictions not supplied", type: job.workplace_types?.join(", ") || job.employment_statuses?.join(", ") || "Remote", category: categoryFor(job.job_title), source: "TheirStack", origin: "Commercial job API", url, publishedAt: normaliseDate(job.date_posted) }
}

function normaliseLegacyGlassdoor(job: LegacyGlassdoorJob): Opportunity | null {
  if (!job.job_id || !job.job_title || !job.company_name || !job.job_link) return null
  const age = Number.isFinite(job.age_in_days) ? Math.max(0, job.age_in_days || 0) : null
  return {
    id: `glassdoor-${job.job_id}`,
    title: job.job_title,
    company: job.company_name,
    location: job.location_name || "Remote / restrictions not supplied",
    type: "Remote",
    category: categoryFor(job.job_title),
    source: "Glassdoor",
    origin: "Commercial job API",
    url: job.job_link,
    publishedAt: age === null ? null : new Date(Date.now() - age * 86400000).toISOString(),
  }
}

async function glassdoorFeed(): Promise<{ jobs: Opportunity[]; provider: "JSearch cursor" | "Glassdoor API sample" | "Unavailable" }> {
  const apiKey = process.env.OPENWEBNINJA_API_KEY
  if (!apiKey) return { jobs: [], provider: "Unavailable" }
  // JSearch exposes cursor pagination. The previous Glassdoor endpoint only
  // delivered a small page sample, which made its count incomparable with the
  // Glassdoor website. Country + language are sent with every search because
  // the provider requires both for reliable non-US results.
  const markets = [
    { location: "Spain", country: "es", language: "es" },
    { location: "United Kingdom", country: "gb", language: "en" },
    { location: "Germany", country: "de", language: "de" },
  ]
  const roles = ["product designer", "ux designer", "ui designer", "ux researcher"]
  const maxPages = 3
  const searches = markets.flatMap(market => roles.map(role => ({ ...market, role })))

  const results = await Promise.allSettled(searches.map(async ({ location, country, language, role }) => {
    const jobs: Opportunity[] = []
    const cursors = new Set<string>()
    let cursor: string | null = null
    for (let page = 0; page < maxPages; page += 1) {
      const endpoint = new URL("https://api.openwebninja.com/jsearch/search-v2")
      endpoint.searchParams.set("query", `${role} in ${location} via glassdoor`)
      endpoint.searchParams.set("country", country)
      endpoint.searchParams.set("language", language)
      endpoint.searchParams.set("work_from_home", "true")
      if (cursor) endpoint.searchParams.set("cursor", cursor)
      const response = await fetch(endpoint, { headers: { "x-api-key": apiKey }, next: { revalidate: GLASSDOOR_REVALIDATE }, signal: AbortSignal.timeout(12000) })
      if (!response.ok) throw new Error(`JSearch returned ${response.status}`)
      const payload = await response.json() as JSearchResponse
      jobs.push(...(payload.data || []).map(normaliseJSearch).filter((job): job is Opportunity => Boolean(job)))
      const nextCursor = payload.next_cursor || payload.next_page_token || payload.cursor || null
      if (!nextCursor || cursors.has(nextCursor)) break
      cursors.add(nextCursor)
      cursor = nextCursor
    }
    return jobs
  }))
  const paginatedJobs = results.flatMap(result => result.status === "fulfilled" ? result.value : [])
  if (paginatedJobs.length) return { jobs: paginatedJobs, provider: "JSearch cursor" }

  // Keep the prior source visible if this key has not been subscribed to
  // JSearch yet. This is explicitly marked as a sample in the UI.
  const sampleRequests = ["product designer", "ux designer", "ui designer", "ux researcher", "design engineer"].flatMap(query => [1, 2].map(page => ({ query, page })))
  const samples = await Promise.allSettled(sampleRequests.map(async ({ query, page }) => {
    const endpoint = new URL("https://api.openwebninja.com/realtime-glassdoor-data/job-search")
    endpoint.searchParams.set("query", query)
    endpoint.searchParams.set("location", "Worldwide")
    endpoint.searchParams.set("remote_only", "true")
    endpoint.searchParams.set("page", String(page))
    const response = await fetch(endpoint, { headers: { "x-api-key": apiKey }, next: { revalidate: GLASSDOOR_REVALIDATE }, signal: AbortSignal.timeout(12000) })
    if (!response.ok) throw new Error(`Glassdoor returned ${response.status}`)
    const payload = await response.json() as { data?: { jobs?: LegacyGlassdoorJob[] } }
    return (payload.data?.jobs || []).map(normaliseLegacyGlassdoor).filter((job): job is Opportunity => Boolean(job))
  }))
  const sampleJobs = samples.flatMap(result => result.status === "fulfilled" ? result.value : [])
  return { jobs: sampleJobs, provider: sampleJobs.length ? "Glassdoor API sample" : "Unavailable" }
}

export async function GET() {
  const glassdoor = await glassdoorFeed()
  const feeds = await Promise.allSettled([
    jobicyFeed(),
    sourceFeed("https://remotive.com/api/remote-jobs", "Remotive"),
    remoteOkFeed(),
    himalayasFeed(),
    arbeitnowFeed(),
    directCompanyFeed(),
    theirStackFeed(),
    weWorkRemotelyFeed(),
    landingJobsFeed(),
    startupJobsFeed(),
  ])
  const jobs = [...feeds.flatMap(feed => feed.status === "fulfilled" ? feed.value : []), ...glassdoor.jobs]
  const seen = new Set<string>()
  const deduplicated = jobs.filter(job => {
    const key = `${job.company}-${job.title}`.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }).sort((a, b) => String(b.publishedAt || "").localeCompare(String(a.publishedAt || ""))).slice(0, 600)

  if (!deduplicated.length) return NextResponse.json({ jobs: [], updatedAt: new Date().toISOString(), sources: [], message: "The public feeds are temporarily unavailable. Try again later." }, { status: 503 })
  const activeSources = Array.from(new Set(deduplicated.map(job => job.source))).sort()
  return NextResponse.json({ jobs: deduplicated, updatedAt: new Date().toISOString(), sources: activeSources, glassdoorProvider: glassdoor.provider, contextAvailable: Boolean(process.env.OPENWEBNINJA_API_KEY) })
}
