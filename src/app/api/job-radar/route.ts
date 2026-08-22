import { NextResponse } from "next/server"

type JobicyJob = {
  id: number
  url: string
  jobTitle: string
  companyName: string
  jobGeo: string
  jobIndustry: string[]
  jobType: string[]
  jobExcerpt: string
  pubDate: string
}

const sectorRules = {
  "AI & Devtools": /\b(ai|artificial intelligence|machine learning|developer|devtools?|cloud|infrastructure|platform|data)\b/i,
  "Digital culture": /\b(media|culture|creative|music|museum|education|community|editorial|content)\b/i,
  Health: /\b(health|medical|clinical|care|wellbeing|doctor|therapy|patient)\b/i,
} as const

function getSectors(job: JobicyJob) {
  const searchable = [job.jobTitle, job.companyName, job.jobExcerpt, job.jobIndustry.join(" ")].join(" ")
  return Object.entries(sectorRules).flatMap(([sector, rule]) => rule.test(searchable) ? [sector] : [])
}

export async function GET() {
  try {
    const response = await fetch("https://jobicy.com/api/v2/remote-jobs?count=100&geo=europe&tag=design", {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    })
    if (!response.ok) throw new Error(`Job feed returned ${response.status}`)

    const data = await response.json() as { jobs?: JobicyJob[] }
    const jobs = (data.jobs ?? [])
      .filter(job => /\b(product designer|product design|design engineer|ux designer|ui designer|user experience|design researcher|design manager|service designer|interaction designer|conversational designer)\b/i.test(job.jobTitle))
      .map(job => ({
        id: job.id,
        title: job.jobTitle,
        company: job.companyName,
        location: job.jobGeo,
        employment: job.jobType.join(", "),
        industries: job.jobIndustry.map(industry => industry.replace(/&amp;/g, "&")),
        publishedAt: job.pubDate,
        href: job.url,
        sectors: getSectors(job),
      }))

    return NextResponse.json({ jobs, updatedAt: new Date().toISOString(), source: "Jobicy" })
  } catch {
    return NextResponse.json({ jobs: [], updatedAt: new Date().toISOString(), source: "Jobicy", unavailable: true }, { status: 200 })
  }
}
