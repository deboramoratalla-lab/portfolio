"use client"

import { useEffect, useState } from "react"

type Health = { updatedAt: string; repository: { updatedAt: string; stars: number }; workflow: { name: string; conclusion: string | null; updatedAt: string; href: string } | null; openIssues: number; components: number; unavailable?: boolean }

function date(value?: string) { return value ? new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value)) : "Reading source" }

export function DesignSystemHealthDemo() {
  const [data, setData] = useState<Health>()
  useEffect(() => { fetch("/api/design-system-health").then(response => response.json()).then(setData).catch(() => setData({ unavailable: true } as Health)) }, [])
  const failed = data?.workflow?.conclusion === "failure"
  return <section className="infrastructure-demo" id="design-system-health" aria-labelledby="design-system-health-title">
    <header className="infrastructure-demo-intro"><div><span>[ Live repository signal ]</span><h2 id="design-system-health-title">A small console for design-system health.</h2></div><p>Real public GitHub data from the design-system repository. The point is to see where a maintainer might look next, not to turn a status into a verdict.</p></header>
    <div className="infrastructure-console"><header className="infrastructure-console-bar"><strong>Design system / health check</strong><span><i /> {data?.updatedAt ? `Checked ${date(data.updatedAt)}` : "Reading GitHub"}</span></header><div className="infrastructure-console-grid"><section className="infrastructure-chart"><header><span>Latest automated check</span><strong>{data?.workflow ? failed ? "Needs review" : "Passing" : "Loading"}</strong><small>{data?.workflow?.name ?? "GitHub Actions"}</small></header><div className="infrastructure-signal"><span>Why this matters</span><h3>{data?.workflow ? failed ? "The accessibility workflow reported a failure." : "The latest workflow completed successfully." : "Checking the public workflow."}</h3><p>{data?.workflow ? `Last updated ${date(data.workflow.updatedAt)}. Open the original run to inspect the result before acting.` : "The console will show the latest public workflow result."}</p>{data?.workflow && <a href={data.workflow.href} target="_blank" rel="noreferrer">Inspect workflow <b>↗</b></a>}</div></section><section className="infrastructure-signal"><span>Repository activity</span><h3>{data ? `${data.openIssues} open issue${data.openIssues === 1 ? "" : "s"}` : "Reading issues"}</h3><p>Open issues are a small maintenance signal. They do not describe severity or effort on their own.</p></section><section className="infrastructure-stats" aria-label="Repository status"><div><span>Components</span><strong>{data?.components ?? "—"}</strong><small>Public component folders</small></div><div><span>Repository updated</span><strong>{date(data?.repository.updatedAt)}</strong><small>Latest public repository update</small></div><div><span>Source</span><strong>GitHub</strong><small>Public repository API</small></div></section></div><footer>Data is cached for one hour. <a href="https://github.com/deboramoratalla-lab/design-system-showcase" target="_blank" rel="noreferrer">Open the source repository ↗</a></footer></div>
  </section>
}
