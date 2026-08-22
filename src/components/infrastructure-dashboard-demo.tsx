"use client"

import { useMemo, useState } from "react"

const clusters = [
  { id: "north", label: "EU North", utilisation: 78, queued: 42, capacity: "1,248 / 1,600", trend: [46, 50, 48, 55, 57, 54, 61, 66, 63, 71, 75, 78] },
  { id: "central", label: "EU Central", utilisation: 63, queued: 16, capacity: "810 / 1,280", trend: [58, 61, 55, 57, 54, 59, 62, 59, 64, 61, 66, 63] },
  { id: "west", label: "EU West", utilisation: 51, queued: 8, capacity: "492 / 960", trend: [38, 42, 46, 43, 49, 47, 52, 50, 55, 52, 48, 51] },
] as const

const ranges = ["6h", "24h", "7d"] as const

function chartPath(values: readonly number[]) {
  return values.map((value, index) => {
    const x = 5 + (index / (values.length - 1)) * 90
    const y = 92 - value * 0.82
    return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`
  }).join(" ")
}

export function InfrastructureDashboardCover() {
  return <div className="infrastructure-cover" aria-hidden="true">
    <header><span>Atlas / Compute</span><i>Live</i></header>
    <div className="infrastructure-cover-chart"><span>GPU utilisation</span><strong>78%</strong><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path className="infrastructure-chart-grid" d="M0 20H100M0 50H100M0 80H100" /><path className="infrastructure-chart-threshold" d="M0 35H100" /><path className="infrastructure-chart-line" d={chartPath(clusters[0].trend)} /></svg></div>
    <footer><span>1,248 / 1,600 GPUs</span><b>42 queued jobs</b></footer>
  </div>
}

export function InfrastructureDashboardDemo() {
  const [clusterId, setClusterId] = useState<(typeof clusters)[number]["id"]>("north")
  const [range, setRange] = useState<(typeof ranges)[number]>("24h")
  const [selectedSignal, setSelectedSignal] = useState<"queue" | "utilisation">("queue")
  const cluster = useMemo(() => clusters.find(item => item.id === clusterId) ?? clusters[0], [clusterId])
  const trend = range === "6h" ? cluster.trend.slice(-6) : range === "7d" ? cluster.trend.map((value, index) => Math.max(24, value - 12 + (index % 3) * 5)) : cluster.trend
  const alert = selectedSignal === "queue"
    ? { eyebrow: "Queue pressure", title: `${cluster.queued} jobs waiting in ${cluster.label}`, detail: cluster.queued > 20 ? "The queue is growing while utilisation is above the operating threshold. Review the worker pool before the next training window." : "The queue remains within the current baseline. Keep the next training window under observation.", action: "Inspect queued jobs" }
    : { eyebrow: "Capacity signal", title: `${cluster.utilisation}% GPU utilisation in ${cluster.label}`, detail: cluster.utilisation > 70 ? "Usage is climbing above the operating threshold. Compare active jobs before adding capacity or moving workloads." : "Usage remains below the operating threshold. Compare the trend before reallocating capacity.", action: "Compare active jobs" }

  return <section className="infrastructure-demo" id="infrastructure-demo" aria-labelledby="infrastructure-demo-title">
    <header className="infrastructure-demo-intro">
      <div><span>[ Interactive experiment ]</span><h2 id="infrastructure-demo-title">A small console for one operating decision.</h2></div>
      <p>Synthetic data only. Select a region and a signal to see how the same metric needs context before it can guide an action.</p>
    </header>
    <div className="infrastructure-console">
      <header className="infrastructure-console-bar"><strong>Atlas / Compute observability</strong><span><i /> Synthetic environment</span><button type="button" onClick={() => setSelectedSignal(selectedSignal === "queue" ? "utilisation" : "queue")}>Switch signal</button></header>
      <div className="infrastructure-console-controls">
        <div role="group" aria-label="Choose a cluster">{clusters.map(item => <button type="button" aria-pressed={clusterId === item.id} className={clusterId === item.id ? "is-active" : ""} onClick={() => setClusterId(item.id)} key={item.id}>{item.label}</button>)}</div>
        <div role="group" aria-label="Choose a time range">{ranges.map(item => <button type="button" aria-pressed={range === item} className={range === item ? "is-active" : ""} onClick={() => setRange(item)} key={item}>{item}</button>)}</div>
      </div>
      <div className="infrastructure-console-grid">
        <section className="infrastructure-chart" aria-label={`GPU utilisation for ${cluster.label} over ${range}`}>
          <header><span>GPU utilisation</span><strong>{cluster.utilisation}%</strong><small>Last {range}</small></header>
          <svg viewBox="0 0 100 100" role="img" aria-label={`GPU utilisation line chart ending at ${cluster.utilisation} percent`} preserveAspectRatio="none"><path className="infrastructure-chart-grid" d="M0 20H100M0 50H100M0 80H100" /><path className="infrastructure-chart-threshold" d="M0 35H100" /><path className="infrastructure-chart-line" d={chartPath(trend)} /></svg>
          <footer><span>0%</span><span>Operating threshold · 70%</span><span>100%</span></footer>
        </section>
        <aside className="infrastructure-signal">
          <span>{alert.eyebrow}</span><h3>{alert.title}</h3><p>{alert.detail}</p><button type="button" onClick={() => setSelectedSignal(selectedSignal === "queue" ? "utilisation" : "queue")}>{alert.action} <b>↗</b></button>
        </aside>
        <section className="infrastructure-stats" aria-label="Selected cluster status">
          <div><span>Available GPUs</span><strong>{cluster.capacity}</strong><small>Allocated / total</small></div>
          <div><span>Queued jobs</span><strong>{cluster.queued}</strong><small>{cluster.queued > 20 ? "Needs review" : "Within baseline"}</small></div>
          <div><span>Running jobs</span><strong>{Math.round(cluster.utilisation * 1.7)}</strong><small>Training and inference</small></div>
        </section>
      </div>
    </div>
  </section>
}
