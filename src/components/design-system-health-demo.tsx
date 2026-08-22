"use client"

import { useEffect, useMemo, useState } from "react"

type Health = { updatedAt: string; workflow: { name: string; conclusion: string | null; updatedAt: string; href: string } | null; openIssues: number; components: number; componentNames: string[]; component: string; componentFiles: number; storybook: { stories: number; docs: number; componentStories: number }; unavailable?: boolean }
const figure = (value: number, max: number) => Math.max(8, Math.min(100, Math.round(value / max * 100)))
const score = (name: string) => [...name].reduce((total, letter) => total + letter.charCodeAt(0), 0)

export function DesignSystemHealthDemo() {
  const [data, setData] = useState<Health>()
  const [selected, setSelected] = useState("Button")
  useEffect(() => { fetch(`/api/design-system-health?component=${encodeURIComponent(selected)}`).then(response => response.json()).then(setData).catch(() => setData({ unavailable: true } as Health)) }, [selected])
  const needsReview = data?.workflow?.conclusion === "failure"
  const status = data?.workflow ? needsReview ? "Needs review" : "Healthy" : "Reading"
  const adoption = data?.componentFiles ?? 0
  const figmaRows = useMemo(() => (data?.componentNames ?? []).map(name => ({ name, inserts: 18 + score(name) % 170, files: 1 + score(name) % 12, detaches: score(name) % 5 })).sort((a, b) => b.inserts - a.inserts), [data])
  const selectedFigma = figmaRows.find(row => row.name === selected) ?? figmaRows[0]
  return <section className="ds-observatory" id="design-system-health" aria-labelledby="design-system-health-title">
    <header className="ds-observatory-intro"><div><span>[ Live system observatory ]</span><h2 id="design-system-health-title">See the system, then decide where to look.</h2></div><p>GitHub supplies the live signals. The Figma view is a preview of Library Analytics, ready to connect when that data becomes available.</p></header>
    <div className="ds-observatory-console">
      <header className="ds-observatory-bar"><strong>Design system / signal map</strong><span><i /> {data?.updatedAt ? "Live GitHub snapshot" : "Reading public source"}</span></header>
      <div className="ds-observatory-pulse">
        <div className={`ds-health-ring ${needsReview ? "is-review" : "is-healthy"}`}><span>{needsReview ? "!" : "✓"}</span></div>
        <div><span className="ds-kicker">Latest automated check</span><h3>{status}</h3><p>{data?.workflow?.name ?? "GitHub Actions"} is the main signal. It tells a maintainer where to begin, not what conclusion to draw.</p></div>
        {data?.workflow && <a href={data.workflow.href} target="_blank" rel="noreferrer">Inspect workflow ↗</a>}
      </div>
      <div className="ds-observatory-grid">
        <section className="ds-observatory-panel ds-adoption-panel"><header><span>01 / Code + docs</span><small>GitHub · Storybook</small></header><div className="ds-bar-row"><div><strong>{selected}</strong><span>{adoption} consumer files</span></div><i><b style={{ width: `${figure(adoption, 8)}%` }} /></i></div><div className="ds-bar-row is-muted"><div><strong>Storybook states</strong><span>{data?.storybook.componentStories ?? "—"} explorables</span></div><i><b style={{ width: `${figure(data?.storybook.componentStories ?? 0, 8)}%` }} /></i></div><p>{data?.storybook.stories ?? "—"} stories and {data?.storybook.docs ?? "—"} documentation pages published in Storybook.</p></section>
        <section className="ds-observatory-panel ds-figma-panel"><header><span>02 / Figma adoption</span><small>Exploratory API</small></header><label className="ds-component-picker"><span>Inspect a component</span><select value={selected} onChange={event => setSelected(event.target.value)}>{figmaRows.map(row => <option key={row.name}>{row.name}</option>)}</select><b>↓</b></label><div className="ds-figma-chart">{figmaRows.slice(0, 6).map(row => <div key={row.name} style={{ height: `${figure(row.inserts, 190)}%` }} />)}</div><div className="ds-figma-meta"><strong>{selectedFigma?.inserts ?? "—"}</strong><span>{selectedFigma?.name ?? "Component"} inserts<br />last 30 days</span><small>{selectedFigma?.files ?? "—"} files · 2 teams · {selectedFigma?.detaches ?? "—"} detaches</small></div><p>Exploratory API view, mapped from the published component catalogue. Ready to replace with Library Analytics when available.</p></section>
        <section className="ds-observatory-panel ds-attention-panel"><header><span>03 / Attention map</span><small>Live + preview</small></header><div className="ds-signal-map"><i className="ds-axis ds-axis-x">adoption →</i><i className="ds-axis ds-axis-y">risk →</i><b className="ds-dot is-review" style={{ left: "72%", bottom: "72%" }}>A11y</b><b className="ds-dot is-code" style={{ left: `${Math.max(20, figure(adoption, 8))}%`, bottom: "28%" }}>{selected.slice(0, 5)}</b><b className="ds-dot is-preview" style={{ left: `${Math.max(28, figure(selectedFigma?.inserts ?? 0, 190))}%`, bottom: `${26 + (selectedFigma?.detaches ?? 0) * 10}%` }}>Figma</b></div><p>{selected} is positioned from its live code adoption; the Figma point is illustrative.</p></section>
      </div>
      <footer><div><span>Now</span><strong>{needsReview ? "Inspect the accessibility workflow." : "Keep the latest workflow under observation."}</strong></div><div><span>Context</span><strong>{data?.openIssues ?? "—"} open issues in the public repository.</strong></div><a href="https://github.com/deboramoratalla-lab/design-system-showcase" target="_blank" rel="noreferrer">Open source repository ↗</a></footer>
    </div>
  </section>
}
