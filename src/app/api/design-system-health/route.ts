import { NextResponse } from "next/server"

const repo = "deboramoratalla-lab/design-system-showcase"

async function github(path: string) {
  const response = await fetch(`https://api.github.com/repos/${repo}${path}`, { next: { revalidate: 3600 }, headers: { Accept: "application/vnd.github+json", "User-Agent": "Debora-Labs-Portfolio" } })
  if (!response.ok) throw new Error(`GitHub returned ${response.status}`)
  return response.json()
}

async function buttonConsumers() {
  const tree = await github("/git/trees/main?recursive=1")
  const files = tree.tree.filter((item: { type: string; path: string }) => item.type === "blob" && /^src\/(?!components\/Button\/).+\.(ts|tsx)$/.test(item.path) && !/\.(stories|test|spec)\.(ts|tsx)$/.test(item.path) && item.path !== "src/components/index.ts")
  const sources = await Promise.all(files.map(async (item: { path: string }) => {
    const response = await fetch(`https://raw.githubusercontent.com/${repo}/main/${item.path}`, { next: { revalidate: 3600 } })
    return response.ok ? response.text() : ""
  }))
  return sources.filter(source => /from\s+["'](?:\.\.?\/)*Button["']/.test(source)).length
}

export async function GET() {
  try {
    const [repository, workflowData, issues, components, buttonFiles] = await Promise.all([github(""), github("/actions/runs?per_page=1"), github("/issues?state=open&per_page=100"), github("/contents/src/components"), buttonConsumers()])
    const latest = workflowData.workflow_runs?.[0]
    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      repository: { updatedAt: repository.updated_at, stars: repository.stargazers_count },
      workflow: latest ? { name: latest.name, conclusion: latest.conclusion, updatedAt: latest.updated_at, href: latest.html_url } : null,
      openIssues: issues.filter((issue: { pull_request?: unknown }) => !issue.pull_request).length,
      components: components.filter((item: { type: string }) => item.type === "dir").length,
      componentNames: components.filter((item: { type: string }) => item.type === "dir").map((item: { name: string }) => item.name),
      buttonFiles,
    })
  } catch {
    return NextResponse.json({ unavailable: true }, { status: 200 })
  }
}
