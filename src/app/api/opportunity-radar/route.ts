import { NextResponse } from "next/server"

export const revalidate = 43200
export const dynamic = "force-dynamic"

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
  source: "Jobicy" | "Remotive" | "Remote OK" | "Ashby" | "Glassdoor" | "Himalayas" | "Arbeitnow"
  origin: "Public feed" | "Direct company feed" | "Commercial job API"
  url: string
  publishedAt: string | null
}

const EUROPE = /anywhere|worldwide|europe|eu\b|emea|uk\b|united kingdom|germany|france|spain|italy|netherlands|belgium|portugal|ireland|poland|sweden|norway|denmark|finland|austria|switzerland|czech|slovak|romania|bulgaria|greece|croatia|serbia|slovenia|hungary|estonia|latvia|lithuania/i

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
  if (!title || !company || !url || !EUROPE.test(location)) return null
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
  if (!title || !company || !url || !EUROPE.test(location)) return null
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

type GlassdoorJob = {
  job_id: string | number
  job_title: string
  company_name: string
  location_name?: string
  job_link: string
  age_in_days?: number
}

function normaliseAshby(job: AshbyJob): Opportunity | null {
  const location = [job.location, ...(job.secondaryLocations || []).map(item => item.location)].filter(Boolean).join(", ") || "Remote"
  if (!job.isRemote || !job.jobUrl || !EUROPE.test(location)) return null
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
  const feeds = await Promise.allSettled([
    sourceFeed("https://jobicy.com/api/v2/remote-jobs?count=100&geo=europe", "Jobicy"),
    sourceFeed("https://jobicy.com/api/v2/remote-jobs?count=100&geo=emea", "Jobicy"),
    sourceFeed("https://jobicy.com/api/v2/remote-jobs?count=100", "Jobicy"),
  ])
  return feeds.flatMap(feed => feed.status === "fulfilled" ? feed.value : [])
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

function normaliseHimalayas(job: HimalayasJob): Opportunity | null {
  const location = job.locationRestrictions?.join(", ") || "Worldwide"
  if (!job.guid || !job.title || !job.companyName || !job.applicationLink || !EUROPE.test(location)) return null
  const category = [...(job.category || []), ...(job.parentCategories || [])].join(" ")
  return { id: `himalayas-${job.guid}`, title: job.title, company: job.companyName, location, type: job.employmentType || "Remote", category: categoryFor(job.title, category), source: "Himalayas", origin: "Public feed", url: job.applicationLink, publishedAt: normaliseDate(job.pubDate) }
}

function normaliseArbeitnow(job: ArbeitnowJob): Opportunity | null {
  const location = job.location || (job.remote ? "Remote / Europe" : "")
  if (!job.slug || !job.title || !job.company_name || !job.url || !job.remote || !EUROPE.test(location)) return null
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

function normaliseGlassdoor(job: GlassdoorJob): Opportunity | null {
  // The commercial API has already filtered this request with location=Europe
  // and remote_only=true. Its returned display location is often just "Remote"
  // or a city, so applying a second text filter here silently drops valid results.
  const location = job.location_name || "Remote / Europe"
  if (!job.job_id || !job.job_title || !job.company_name || !job.job_link) return null
  const age = Number.isFinite(job.age_in_days) ? Math.max(0, job.age_in_days || 0) : null
  return {
    id: `glassdoor-${job.job_id}`,
    title: job.job_title,
    company: job.company_name,
    location,
    type: "Remote",
    category: categoryFor(job.job_title),
    source: "Glassdoor",
    origin: "Commercial job API",
    url: job.job_link,
    publishedAt: age === null ? null : new Date(Date.now() - age * 86400000).toISOString(),
  }
}

async function glassdoorFeed() {
  const apiKey = process.env.OPENWEBNINJA_API_KEY
  if (!apiKey) return [] as Opportunity[]
  const queries = ["product designer", "ux designer", "ui designer", "ux researcher", "design engineer"]
  const responses = await Promise.allSettled(queries.map(async query => {
    const endpoint = new URL("https://api.openwebninja.com/realtime-glassdoor-data/job-search")
    endpoint.searchParams.set("query", query)
    endpoint.searchParams.set("location", "Europe")
    endpoint.searchParams.set("remote_only", "true")
    endpoint.searchParams.set("page", "1")
    const response = await fetch(endpoint, { headers: { "x-api-key": apiKey }, next: { revalidate } })
    if (!response.ok) throw new Error(`Glassdoor returned ${response.status}`)
    const payload = await response.json() as { data?: { jobs?: GlassdoorJob[] } }
    return (payload.data?.jobs || []).map(normaliseGlassdoor).filter((job): job is Opportunity => Boolean(job))
  }))
  return responses.flatMap(response => response.status === "fulfilled" ? response.value : [])
}

export async function GET() {
  const feeds = await Promise.allSettled([
    jobicyFeed(),
    sourceFeed("https://remotive.com/api/remote-jobs", "Remotive"),
    remoteOkFeed(),
    himalayasFeed(),
    arbeitnowFeed(),
    directCompanyFeed(),
    glassdoorFeed(),
  ])
  const jobs = feeds.flatMap(feed => feed.status === "fulfilled" ? feed.value : [])
  const seen = new Set<string>()
  const deduplicated = jobs.filter(job => {
    const key = `${job.company}-${job.title}`.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }).sort((a, b) => Number(b.origin === "Direct company feed") - Number(a.origin === "Direct company feed") || String(b.publishedAt || "").localeCompare(String(a.publishedAt || ""))).slice(0, 300)

  if (!deduplicated.length) return NextResponse.json({ jobs: [], updatedAt: new Date().toISOString(), sources: [], message: "The public feeds are temporarily unavailable. Try again later." }, { status: 503 })
  return NextResponse.json({ jobs: deduplicated, updatedAt: new Date().toISOString(), sources: ["Jobicy", "Remotive", "Remote OK", "Himalayas", "Arbeitnow", "Ashby direct company feed", "Glassdoor via OpenWeb Ninja"], contextAvailable: Boolean(process.env.OPENWEBNINJA_API_KEY) })
}
