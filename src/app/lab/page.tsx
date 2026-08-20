import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "@/components/arrow-up-right"
import { ArrowLink } from "@/components/ui-links"
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
    <section className="lab-open-resources" aria-labelledby="open-resources-title">
      <div className="lab-open-resources-copy">
        <span className="editorial-meta">[ OPEN RESOURCES ]</span>
        <h2 id="open-resources-title">Small tools for design, code and AI.</h2>
        <p>Skills, checkers and templates I’m building in public so other designers can inspect, adapt and reuse the work.</p>
      </div>
      <div className="lab-open-resources-side">
        <span className="lab-open-resources-kicker">DEBORA LABS / PUBLIC REPO</span>
        <p>Reusable workflows for design systems, Storybook, accessibility and agent-ready product work.</p>
        <ArrowLink variant="secondary" tone="purple" href="https://github.com/deboramoratalla-lab/debora-labs" target="_blank" rel="noreferrer">Open the repository</ArrowLink>
      </div>
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
