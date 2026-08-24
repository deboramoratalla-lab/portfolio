import { NextRequest, NextResponse } from "next/server"

export const revalidate = 86400

type GlassdoorCompany = {
  company_id: number
  name: string
  company_link?: string
  rating?: number
  review_count?: number
  salary_count?: number
  career_opportunities_rating?: number
  culture_and_values_rating?: number
  work_life_balance_rating?: number
  industry?: string
}

export async function GET(request: NextRequest) {
  const company = request.nextUrl.searchParams.get("company")?.trim()
  const apiKey = process.env.OPENWEBNINJA_API_KEY
  if (!company) return NextResponse.json({ message: "A company name is required." }, { status: 400 })
  if (!apiKey) return NextResponse.json({ enabled: false, message: "Company context is not configured." }, { status: 424 })

  const endpoint = new URL("https://api.openwebninja.com/realtime-glassdoor-data/company-search")
  endpoint.searchParams.set("query", company)
  endpoint.searchParams.set("limit", "1")

  const response = await fetch(endpoint, {
    headers: { "x-api-key": apiKey },
    next: { revalidate },
  })
  if (!response.ok) return NextResponse.json({ message: "Company context is unavailable right now." }, { status: response.status })

  const payload = await response.json() as { data?: GlassdoorCompany[] }
  const result = payload.data?.[0]
  if (!result) return NextResponse.json({ message: "No company context was found for this listing." }, { status: 404 })

  return NextResponse.json({
    provider: "Glassdoor via OpenWeb Ninja",
    retrievedAt: new Date().toISOString(),
    company: {
      name: result.name,
      industry: result.industry || null,
      rating: result.rating || null,
      reviewCount: result.review_count || 0,
      salaryCount: result.salary_count || 0,
      careerOpportunities: result.career_opportunities_rating || null,
      culture: result.culture_and_values_rating || null,
      workLifeBalance: result.work_life_balance_rating || null,
      sourceUrl: result.company_link || null,
    },
  })
}
