import { NextResponse } from "next/server"

const repo = "deboramoratalla-lab/design-system-showcase"

async function github(path: string) {
  const response = await fetch(`https://api.github.com/repos/${repo}${path}`, { next: { revalidate: 3600 }, headers: { Accept: "application/vnd.github+json", "User-Agent": "Debora-Labs-Portfolio" } })
  if (!response.ok) throw new Error(`GitHub returned ${response.status}`)
  return response.json()
}

export async function GET() {
  try {
    const [repository, workflowData, issues, components] = await Promise.all([github(""), github("/actions/runs?per_page=1"), github("/issues?state=open&per_page=100"), github("/contents/src/components")])
    const latest = workflowData.workflow_runs?.[0]
    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      repository: { updatedAt: repository.updated_at, stars: repository.stargazers_count },
      workflow: latest ? { name: latest.name, conclusion: latest.conclusion, updatedAt: latest.updated_at, href: latest.html_url } : null,
      openIssues: issues.filter((issue: { pull_request?: unknown }) => !issue.pull_request).length,
      components: components.filter((item: { type: string }) => item.type === "dir").length,
    })
  } catch {
    return NextResponse.json({ unavailable: true }, { status: 200 })
  }
}
