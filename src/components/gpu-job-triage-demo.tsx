"use client";

import { useMemo, useState } from "react";
import {
  IconActivityHeartbeat,
  IconBolt,
  IconChartHistogram,
  IconChevronRight,
  IconCpu,
  IconDots,
  IconGauge,
  IconPlayerPlay,
  IconRefresh,
  IconWaveSine,
} from "@tabler/icons-react";

type Scenario = "baseline" | "drift" | "blocked";

type Worker = {
  name: string;
  progress: number;
  throughput: string;
  wait: string;
  cost: string;
  tone: "cyan" | "lime" | "orange" | "muted";
};

const scenarios = {
  baseline: {
    label: "Running",
    progress: 70,
    inputWait: "86 ms",
    eta: "18 min",
    throughput: "42.8/s",
    queue: "14",
    retries: "0.7%",
    action: "Keep the current allocation",
    detail: "Workers are converging together. There is enough headroom to finish this batch without adding capacity.",
    points: [34, 49, 27, 58, 46, 31, 41, 72, 34, 22, 22, 58, 44, 18, 32, 56, 69, 48, 38, 57, 43],
    marker: 10,
    workers: [
      { name: "worker-01", progress: 74, throughput: "11.3/s", wait: "78 ms", cost: "$1.84", tone: "cyan" },
      { name: "worker-02", progress: 71, throughput: "10.9/s", wait: "82 ms", cost: "$1.79", tone: "cyan" },
      { name: "worker-03", progress: 69, throughput: "10.6/s", wait: "86 ms", cost: "$1.76", tone: "lime" },
      { name: "worker-04", progress: 67, throughput: "10.0/s", wait: "98 ms", cost: "$1.72", tone: "muted" },
    ] as Worker[],
  },
  drift: {
    label: "Drift detected",
    progress: 61,
    inputWait: "164 ms",
    eta: "31 min",
    throughput: "31.4/s",
    queue: "38",
    retries: "2.1%",
    action: "Inspect worker-04 before scaling",
    detail: "Throughput is falling while input wait climbs. One worker is behind the rest, so extra capacity would hide the cause.",
    points: [31, 45, 34, 53, 47, 38, 42, 64, 41, 28, 38, 68, 55, 30, 48, 73, 78, 61, 52, 75, 66],
    marker: 16,
    workers: [
      { name: "worker-01", progress: 67, throughput: "10.4/s", wait: "110 ms", cost: "$1.91", tone: "cyan" },
      { name: "worker-02", progress: 64, throughput: "9.8/s", wait: "124 ms", cost: "$1.87", tone: "cyan" },
      { name: "worker-03", progress: 59, throughput: "7.7/s", wait: "161 ms", cost: "$1.80", tone: "lime" },
      { name: "worker-04", progress: 53, throughput: "3.5/s", wait: "262 ms", cost: "$1.65", tone: "orange" },
    ] as Worker[],
  },
  blocked: {
    label: "Input blocked",
    progress: 38,
    inputWait: "1.4 s",
    eta: "Paused",
    throughput: "4.9/s",
    queue: "126",
    retries: "8.4%",
    action: "Resolve the input dependency",
    detail: "Adding GPUs would not help. The queue is waiting on input, so unblock the upstream dependency first.",
    points: [30, 45, 35, 52, 45, 38, 49, 66, 43, 29, 35, 69, 55, 31, 58, 80, 91, 80, 69, 88, 83],
    marker: 18,
    workers: [
      { name: "worker-01", progress: 44, throughput: "2.6/s", wait: "1.2 s", cost: "$1.39", tone: "lime" },
      { name: "worker-02", progress: 40, throughput: "1.5/s", wait: "1.4 s", cost: "$1.36", tone: "orange" },
      { name: "worker-03", progress: 36, throughput: "0.8/s", wait: "1.5 s", cost: "$1.31", tone: "orange" },
      { name: "worker-04", progress: 32, throughput: "0.0/s", wait: "1.7 s", cost: "$1.27", tone: "orange" },
    ] as Worker[],
  },
};

function StepChart({ points, marker }: { points: number[]; marker: number }) {
  const width = 420;
  const height = 166;
  const insetX = 10;
  const insetY = 12;
  const step = (width - insetX * 2) / (points.length - 1);
  const path = points.reduce((acc, point, index) => {
    const x = insetX + index * step;
    const y = insetY + ((100 - point) / 100) * (height - insetY * 2);
    if (index === 0) return `M ${x} ${y}`;
    return `${acc} H ${x} V ${y}`;
  }, "");
  const markerX = insetX + marker * step;
  const markerY = insetY + ((100 - points[marker]) / 100) * (height - insetY * 2);

  return (
    <svg className="triage-step-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Input wait over the last 45 minutes">
      <defs>
        <pattern id="triage-grid" width="21" height="18" patternUnits="userSpaceOnUse">
          <path d="M 21 0 L 0 0 0 18" fill="none" stroke="rgba(206, 210, 224, .09)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="0" y="0" width={width} height={height} fill="url(#triage-grid)" />
      <path d={path} fill="none" stroke="rgba(211, 215, 226, .78)" strokeWidth="1.6" strokeLinejoin="round" />
      <line x1={markerX} x2={markerX} y1={markerY + 8} y2="154" stroke="#eff45a" strokeWidth="1" />
      <circle cx={markerX} cy="154" r="2" fill="#eff45a" />
      <rect x={markerX - 6} y={markerY - 6} width="12" height="12" rx="1" fill="#eff45a" />
      <rect x={Math.min(markerX + 5, 348)} y={Math.max(markerY - 38, 3)} width="55" height="28" rx="2" fill="#32361d" stroke="rgba(239,244,90,.3)" />
      <text x={Math.min(markerX + 12, 355)} y={Math.max(markerY - 19, 22)} fill="#eff45a" fontSize="14" fontFamily="monospace">{points[marker]} ms</text>
    </svg>
  );
}

function ParticleField({ workers }: { workers: Worker[] }) {
  const particles = useMemo(() => Array.from({ length: 125 }, (_, index) => {
    const angle = index * 2.39996;
    const radius = 12 + Math.sqrt(index / 124) * 124;
    const x = 156 + Math.cos(angle) * radius * 1.12;
    const y = 157 + Math.sin(angle) * radius * 0.72;
    return { x, y, lineX: 156 + Math.cos(angle) * (radius * 0.2), lineY: 157 + Math.sin(angle) * (radius * 0.2), hot: index % 9 === 0 };
  }), []);
  const stalled = workers.filter((worker) => worker.tone === "orange").length;

  return (
    <div className="triage-particle-field" aria-hidden="true">
      <svg viewBox="0 0 330 310" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="triage-glow"><stop stopColor="#5ff5ec" stopOpacity=".75" /><stop offset="1" stopColor="#5ff5ec" stopOpacity="0" /></radialGradient>
        </defs>
        <circle cx="156" cy="157" r="113" fill="url(#triage-glow)" opacity=".16" />
        {particles.map((point, index) => (
          <g key={index}>
            {index % 2 === 0 && <line x1="156" y1="157" x2={point.x} y2={point.y} stroke={point.hot ? "#61e9ed" : "#d8deeb"} strokeOpacity={point.hot ? ".5" : ".18"} strokeWidth=".55" />}
            <circle cx={point.x} cy={point.y} r={point.hot ? "2.1" : "1.15"} fill={point.hot ? "#61f4ec" : "#e7eaf1"} opacity={point.hot ? ".9" : ".72"} />
          </g>
        ))}
        <circle cx="156" cy="157" r="5" fill="#f2ffff" />
        <circle cx="156" cy="157" r="14" fill="url(#triage-glow)" />
      </svg>
      {stalled > 0 && <span className="triage-particle-warning">{stalled} delayed</span>}
    </div>
  );
}

function Bars({ value, tone = "cyan" }: { value: number; tone?: "cyan" | "lime" | "orange" }) {
  return <span className={`triage-bars triage-bars-${tone}`} aria-hidden="true">{Array.from({ length: 7 }, (_, index) => <i key={index} className={index < Math.ceil(value / 14.3) ? "active" : ""} />)}</span>;
}

function Ring({ value, tone }: { value: number; tone: Worker["tone"] }) {
  const radius = 19;
  const circumference = 2 * Math.PI * radius;
  return <span className={`triage-ring triage-ring-${tone}`}><svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r={radius} /><circle cx="24" cy="24" r={radius} strokeDasharray={`${(value / 100) * circumference} ${circumference}`} /></svg><b>{value}%</b></span>;
}

export function GpuJobTriageDemo() {
  const [scenario, setScenario] = useState<Scenario>("baseline");
  const [decisionApplied, setDecisionApplied] = useState(false);
  const data = scenarios[scenario];
  const tone = scenario === "blocked" ? "orange" : scenario === "drift" ? "lime" : "cyan";
  const confirmation = scenario === "baseline" ? "Allocation kept. The next check is scheduled in 10 minutes." : scenario === "drift" ? "Triage opened for worker-04. Scaling remains on hold." : "Input dependency marked for escalation. GPU scaling remains paused.";

  return (
    <section className="gpu-triage-demo" aria-labelledby="triage-demo-title">
      <div className="triage-demo-intro">
        <span>Interactive prototype</span>
        <h2 id="triage-demo-title">The decision surface, not the telemetry wall.</h2>
        <p>Replay a workload state to see how the same signals can point to a different next step.</p>
      </div>

      <div className="triage-surface">
        <header className="triage-surface-header">
          <div className="triage-job-identity"><span className="triage-mark"><IconActivityHeartbeat size={16} /></span><b>nebula / training</b><span>vision-batch-07</span></div>
          <div className="triage-header-actions">
            <span className="triage-live"><i /> live signals</span>
            <button type="button" aria-label="Refresh workload data"><IconRefresh size={15} /></button>
            <button type="button" aria-label="More options"><IconDots size={17} /></button>
          </div>
        </header>

        <div className="triage-scenario-bar">
          <span><IconPlayerPlay size={14} /> Replay state</span>
          <div role="group" aria-label="Choose a workload state">
            {(Object.keys(scenarios) as Scenario[]).map((name) => <button key={name} type="button" onClick={() => { setScenario(name); setDecisionApplied(false); }} className={scenario === name ? "is-selected" : ""}>{scenarios[name].label}</button>)}
          </div>
        </div>

        <div className="triage-layout-v3">
          <article className="triage-hero-card-v3">
            <div className="triage-run-label"><i /> {data.label}</div>
            <ParticleField workers={data.workers} />
            <div className="triage-primary-reading">
              <div className="triage-reading-title"><span>Distributed AI job</span><small><IconCpu size={15} /> 4 workers</small></div>
              <div className="triage-big-metrics">
                <div className="triage-metric-v4"><Bars value={data.progress} tone={tone} /><div><strong>{data.progress}%</strong><span>progress <em>+2.5</em></span></div></div>
                <div className="triage-metric-v4"><Bars value={scenario === "blocked" ? 86 : scenario === "drift" ? 62 : 38} tone={tone} /><div><strong>{data.inputWait}</strong><span>input wait <em>{scenario === "baseline" ? "stable" : "rising"}</em></span></div></div>
              </div>
              <p>{data.detail}</p>
              <div className="triage-wave"><IconWaveSine size={38} /><b>live</b></div>
            </div>
            <footer><button type="button" onClick={() => setDecisionApplied(true)} aria-pressed={decisionApplied}><IconActivityHeartbeat size={17} /> {decisionApplied ? "Decision recorded" : data.action}<IconChevronRight size={16} /></button></footer>
          </article>

          <aside className="triage-side-v3">
            <div className="triage-panel-head"><h3><IconGauge size={18} /> Input wait</h3><button type="button" aria-label="Input wait options"><IconDots size={18} /></button></div>
            <StepChart points={data.points} marker={data.marker} />
            <div className="triage-chart-labels"><span>00</span><span>15</span><span>30</span><span>45m</span></div>
            <div className="triage-summary-stats"><div><IconBolt size={16} /><span>Throughput</span><b>{data.throughput}</b></div><div><IconChartHistogram size={16} /><span>Queue</span><b>{data.queue}</b></div><div><IconActivityHeartbeat size={16} /><span>Retries</span><b>{data.retries}</b></div></div>
            <div className="triage-recommendation"><span>Recommended action</span><strong>{data.action}</strong><div><small>ETA <b>{data.eta}</b></small><small>Cost <b>$7.11</b></small></div></div>
          </aside>
        </div>
        <div className={`triage-decision-feedback ${decisionApplied ? "is-visible" : ""}`} aria-live="polite"><IconActivityHeartbeat size={15} /> {decisionApplied ? confirmation : "No decision recorded yet."}</div>

        <section className="triage-worker-health" aria-label="Worker health status">
          <div className="triage-health-heading"><h3>Worker health</h3><span><i /> {scenario === "baseline" ? "all workers reporting" : "attention required"}</span></div>
          <div className="triage-worker-table" role="table">
            <div className="triage-worker-head" role="row"><span>Worker</span><span>Progress</span><span>Throughput</span><span>Input wait</span><span>Cost</span></div>
            {data.workers.map((worker) => <div className="triage-worker-row" role="row" key={worker.name}><span><IconCpu size={16} /> {worker.name}</span><Ring value={worker.progress} tone={worker.tone} /><span>{worker.throughput}</span><span className={`triage-wait-${worker.tone}`}>{worker.wait}</span><span>{worker.cost}</span></div>)}
          </div>
        </section>
        <footer className="triage-provenance"><span><i /> Scenario-driven workload signals</span><span>Prometheus collector · Grafana dashboard · Docker compose</span></footer>
      </div>
    </section>
  );
}
