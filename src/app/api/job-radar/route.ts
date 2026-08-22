import { NextResponse } from "next/server"

type Source = "Jobicy" | "Greenhouse" | "Lever" | "Ashby"
type RadarJob = { id: string; title: string; company: string; location: string; employment: string; publishedAt: string; href: string; source: Source; searchable: string }

const designRole = /\b(product designer|product design|ux designer|ui designer|user experience|design researcher|design systems|design engineer|design manager|service designer|interaction designer|conversational designer)\b/i
const europe = /\b(europe|emea|uk|united kingdom|ireland|france|germany|spain|portugal|italy|netherlands|belgium|austria|switzerland|denmark|sweden|norway|finland|poland|czech|slovakia|slovenia|croatia|greece|hungary|estonia|latvia|lithuania|romania|bulgaria|serbia|bosnia|montenegro|ukraine)\b/i
const sectorRules = { "AI & Devtools": /\b(ai|artificial intelligence|machine learning|developer|devtools?|cloud|infrastructure|platform|data|automation)\b/i, "Digital culture": /\b(media|culture|creative|music|museum|education|community|editorial|content|creator)\b/i, Health: /\b(health|medical|clinical|care|wellbeing|doctor|therapy|patient)\b/i } as const

const sectors = (searchable: string) => Object.entries(sectorRules).flatMap(([sector, rule]) => rule.test(searchable) ? [sector] : [])

async function readJson<T>(url: string) {
  const response = await fetch(url, { next: { revalidate: 3600 }, headers: { Accept: "application/json" } })
  if (!response.ok) throw new Error(`Job feed returned ${response.status}`)
  return response.json() as Promise<T>
}

async function fromJobicy(): Promise<RadarJob[]> {
  type Job = { id: number; url: string; jobTitle: string; companyName: string; jobGeo: string; jobType: string[]; jobExcerpt: string; pubDate: string }
  const data = await readJson<{ jobs?: Job[] }>("https://jobicy.com/api/v2/remote-jobs?count=100&geo=europe&tag=design")
  return (data.jobs ?? []).map(job => ({ id: `jobicy-${job.id}`, title: job.jobTitle, company: job.companyName, location: job.jobGeo, employment: job.jobType.join(", "), publishedAt: job.pubDate, href: job.url, source: "Jobicy", searchable: [job.jobTitle, job.companyName, job.jobExcerpt].join(" ") }))
}

async function fromGreenhouse(): Promise<RadarJob[]> {
  type Job = { id: number; title: string; absolute_url: string; updated_at: string; location?: { name?: string }; content?: string }
  const data = await readJson<{ jobs?: Job[] }>("https://boards-api.greenhouse.io/v1/boards/stripe/jobs?content=true")
  return (data.jobs ?? []).map(job => ({ id: `greenhouse-${job.id}`, title: job.title, company: "Stripe", location: job.location?.name ?? "Location not specified", employment: "", publishedAt: job.updated_at, href: job.absolute_url, source: "Greenhouse", searchable: [job.title, job.location?.name, job.content].join(" ") })).filter(job => /\bremote\b/i.test(job.searchable))
}

async function fromLever(): Promise<RadarJob[]> {
  type Job = { id: string; text: string; hostedUrl: string; createdAt: number; workplaceType?: string; categories?: { location?: string; commitment?: string }; description?: string; additional?: string }
  const data = await readJson<Job[]>("https://api.lever.co/v0/postings/jobgether?mode=json")
  return data.map(job => ({ id: `lever-${job.id}`, title: job.text, company: "Jobgether", location: job.categories?.location ?? "Location not specified", employment: job.categories?.commitment ?? "", publishedAt: new Date(job.createdAt).toISOString(), href: job.hostedUrl, source: "Lever", searchable: [job.text, job.categories?.location, job.workplaceType, job.description, job.additional].join(" ") })).filter(job => /\bremote\b/i.test(job.searchable))
}

async function fromAshby(): Promise<RadarJob[]> {
  type Job = { id: string; title: string; location?: string; employmentType?: string; publishedAt?: string; isRemote?: boolean; jobUrl: string; descriptionPlain?: string }
  const data = await readJson<{ jobs?: Job[] }>("https://api.ashbyhq.com/posting-api/job-board/n8n")
  return (data.jobs ?? []).filter(job => job.isRemote).map(job => ({ id: `ashby-${job.id}`, title: job.title, company: "n8n", location: job.location ?? "Europe", employment: job.employmentType === "FullTime" ? "Full-time" : job.employmentType ?? "", publishedAt: job.publishedAt ?? new Date().toISOString(), href: job.jobUrl, source: "Ashby", searchable: [job.title, job.location, job.descriptionPlain].join(" ") }))
}

export async function GET() {
  const results = await Promise.allSettled([fromJobicy(), fromGreenhouse(), fromLever(), fromAshby()])
  const jobs = results.flatMap(result => result.status === "fulfilled" ? result.value : []).filter(job => designRole.test(job.title) && europe.test(job.searchable)).map(({ searchable, ...job }) => ({ ...job, sectors: sectors(searchable) })).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  return NextResponse.json({ jobs, updatedAt: new Date().toISOString(), sources: ["Jobicy", "Greenhouse", "Lever", "Ashby"], unavailable: jobs.length === 0 })
}
