import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "@/components/arrow-up-right"
import { labEntries } from "@/data/lab"
import { LabPixelGrid } from "@/components/lab-pixel-grid"
import { EditorialSectionHeader } from "@/components/editorial-section-header"

export const metadata: Metadata = {
  title: "Lab",
  description: "Field notes, builds and experiments on technical product design, design systems and AI behaviour.",
}

export default function LabPage() {
  return <main className="editorial-page lab-page">
    <section className="lab-grid-hero" aria-labelledby="lab-title">
      <span className="lab-grid-label">LABS &amp; NOTES</span>
      <LabPixelGrid />
    </section>
    <section className="editorial-section lab-index-section" aria-labelledby="lab-index-title">
      <EditorialSectionHeader label="LAB INDEX" title="Notes I’m still testing." titleId="lab-index-title" description="Writing, builds and experiments from the workbench." />
      <div className="lab-editorial-list lab-card-grid">
        {labEntries.map((entry, index) => <Link href={`/lab/${entry.slug}`} className="lab-editorial-row" key={entry.slug}>
          <span className="lab-card-icon" aria-hidden="true"><i /><i /><i /><i /><i /></span>
          <span className="editorial-number">{"// "}{String(index + 1).padStart(2, "0")}</span>
          <div className="lab-editorial-copy"><span className="editorial-meta">{entry.type} · {entry.date} · {entry.readingTime}</span><h3>{entry.title}</h3><p>{entry.summary}</p><span className="lab-topics">{entry.topics.join(" · ")}</span></div>
          <span className="editorial-action">Read more <ArrowUpRight /></span>
        </Link>)}
      </div>
    </section>
  </main>
}
