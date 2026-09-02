import Link from "next/link"
import type { CSSProperties } from "react"

type CaseStudyChapter = readonly [number: string, title: string]

export function CaseStudyIndex({
  chapters,
  hrefForChapter,
  className,
  introduction = "The decisions, evidence and outcomes behind the work.",
}: {
  chapters: readonly CaseStudyChapter[]
  hrefForChapter: (number: string) => string
  className?: string
  introduction?: string
}) {
  return (
    <nav className={["case-story-nav", className].filter(Boolean).join(" ")} aria-label="Case study index" style={{ "--case-index-count": chapters.length } as CSSProperties}>
      <header className="case-index-unified__header">
        <span>CASE STUDY / {chapters.length} PARTS</span>
        <p>{introduction}</p>
      </header>
      <div className="case-index-unified__chapters">
        {chapters.map(([number, title]) => (
          <Link href={hrefForChapter(number)} key={number}>
            <small>{number}</small>
            <strong>{title}</strong>
            <span aria-hidden="true">↘</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
