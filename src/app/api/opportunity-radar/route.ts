import { NextResponse } from "next/server"

export const revalidate = 43200

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
  source: "Jobicy" | "Remotive" | "Remote OK" | "Ashby"
  origin: "Public feed" | "Direct company feed"
  url: string
  publishedAt: string | null
}

const EUROPE = /anywhere|europe|eu\b|emea|uk\b|united kingdom|germany|france|spain|italy|netherlands|belgium|portugal|ireland|poland|sweden|norway|denmark|finland|austria|switzerland|czech|slovak|romania|bulgaria|greece|croatia|serbia|slovenia|hungary|estonia|latvia|lithuania/i

function categoryFor(title: string, sourceCategory = "") {
  const text = `${title} ${sourceCategory}`.toLowerCase()
  if (/product manager|project manager|program manager|technical program|operations/.test(text)) return "Product & Operations"
  if (/product design|ux|ui |designer|design system|researcher/.test(text)) return "Product & Design"
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
  return { id: `${source}-${job.id || `${company}-${title}`}`, title, company, location, type, category: categoryFor(title, industry), source, origin: "Public feed", url, publishedAt: job.pubDate || job.publication_date || null }
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
    publishedAt: job.date || null,
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
    publishedAt: job.publishedAt || null,
  }
}

async function sourceFeed(url: string, source: Opportunity["source"]) {
  const response = await fetch(url, { next: { revalidate } })
  if (!response.ok) throw new Error(`${source} returned ${response.status}`)
  const payload = await response.json() as { jobs?: SourceJob[] }
  return (payload.jobs || []).map(job => normaliseJob(job, source)).filter((job): job is Opportunity => Boolean(job))
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

export async function GET() {
  const feeds = await Promise.allSettled([
    sourceFeed("https://jobicy.com/api/v2/remote-jobs?count=100", "Jobicy"),
    sourceFeed("https://remotive.com/api/remote-jobs?limit=100", "Remotive"),
    remoteOkFeed(),
    directCompanyFeed(),
  ])
  const jobs = feeds.flatMap(feed => feed.status === "fulfilled" ? feed.value : [])
  const seen = new Set<string>()
  const deduplicated = jobs.filter(job => {
    const key = `${job.company}-${job.title}`.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }).sort((a, b) => Number(b.origin === "Direct company feed") - Number(a.origin === "Direct company feed") || (b.publishedAt || "").localeCompare(a.publishedAt || "")).slice(0, 120)

  if (!deduplicated.length) return NextResponse.json({ jobs: [], updatedAt: new Date().toISOString(), sources: [], message: "The public feeds are temporarily unavailable. Try again later." }, { status: 503 })
  return NextResponse.json({ jobs: deduplicated, updatedAt: new Date().toISOString(), sources: ["Jobicy", "Remotive", "Remote OK", "Ashby direct company feed"] })
}
