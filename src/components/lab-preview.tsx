import Link from "next/link"
import { ArrowUpRight } from "@/components/arrow-up-right"
import type { LabEntry } from "@/data/lab"

export function LabPreview({ entries }: { entries: LabEntry[] }) {
  return <div className="lab-preview">
    <header className="lab-intro">
      <p>Short, practical explorations of technical product design, systems and AI behaviour.</p>
    </header>
    <div className="lab-list">
      {entries.map((entry, index) => <Link href={`/lab/${entry.slug}`} className="lab-card" key={entry.slug}>
        <span className="lab-row-number">{`// 00${index + 1}`}</span>
        <h3>{entry.title}</h3>
        <div className="lab-topics"><span>{entry.type}</span><span>{entry.readingTime}</span>{entry.topics.slice(0, 2).map(topic => <span key={topic}>{topic}</span>)}</div>
        <span className="lab-row-view">Explore <ArrowUpRight /></span>
      </Link>)}
    </div>
  </div>
}
