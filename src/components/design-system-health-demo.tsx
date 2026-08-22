"use client"

import { useEffect, useState } from "react"

type Health = { updatedAt: string; repository: { updatedAt: string; stars: number }; workflow: { name: string; conclusion: string | null; updatedAt: string; href: string } | null; openIssues: number; components: number; buttonFiles: number; unavailable?: boolean }

function date(value?: string) { return value ? new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value)) : "Reading source" }

export function DesignSystemHealthDemo() {
  const [data, setData] = useState<Health>()
  useEffect(() => { fetch("/api/design-system-health").then(response => response.json()).then(setData).catch(() => setData({ unavailable: true } as Health)) }, [])
  const failed = data?.workflow?.conclusion === "failure"
  return <section className="infrastructure-demo" id="design-system-health" aria-labelledby="design-system-health-title">
    <header className="infrastructure-demo-intro"><div><span>[ Live repository signal ]</span><h2 id="design-system-health-title">A small console for design-system health.</h2></div><p>Real public GitHub data from the design-system repository. The point is to see where a maintainer might look next, not to turn a status into a verdict.</p></header>
    <div className="infrastructure-console"><header className="infrastructure-console-bar"><strong>Design system / health check</strong><span><i /> {data?.updatedAt ? `Checked ${date(data.updatedAt)}` : "Reading GitHub"}</span></header><div className="infrastructure-console-grid"><section className="infrastructure-chart"><header><span>Latest automated check</span><strong>{data?.workflow ? failed ? "Needs review" : "Passing" : "Loading"}</strong><small>{data?.workflow?.name ?? "GitHub Actions"}</small></header><div className="infrastructure-signal"><span>Why this matters</span><h3>{data?.workflow ? failed ? "The accessibility workflow reported a failure." : "The latest workflow completed successfully." : "Checking the public workflow."}</h3><p>{data?.workflow ? `Last updated ${date(data.workflow.updatedAt)}. Open the original run to inspect the result before acting.` : "The console will show the latest public workflow result."}</p>{data?.workflow && <a href={data.workflow.href} target="_blank" rel="noreferrer">Inspect workflow <b>↗</b></a>}</div></section><section className="infrastructure-signal"><span>Figma library preview</span><h3>Button / 86 inserts</h3><p>7 files · 2 teams · 1 detach in the last 30 days. This is the view that becomes available when library analytics is connected.</p></section><section className="infrastructure-stats" aria-label="Repository status"><div><span>Components</span><strong>{data?.components ?? "—"}</strong><small>Public component folders</small></div><div><span>Button consumers</span><strong>{data?.buttonFiles ?? "—"}</strong><small>Files importing Button</small></div><div><span>Open issues</span><strong>{data?.openIssues ?? "—"}</strong><small>Maintenance context</small></div></section></div><footer>GitHub data is cached for one hour. Figma preview data illustrates the connected-library view. <a href="https://github.com/deboramoratalla-lab/design-system-showcase" target="_blank" rel="noreferrer">Open the source repository ↗</a></footer></div>
  </section>
}
