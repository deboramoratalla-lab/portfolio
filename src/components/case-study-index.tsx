import Link from "next/link"

type CaseStudyChapter = readonly [number: string, title: string]

export function CaseStudyIndex({
  chapters,
  hrefForChapter,
  className,
}: {
  chapters: readonly CaseStudyChapter[]
  hrefForChapter: (number: string) => string
  className?: string
}) {
  return (
    <nav className={["case-index-unified", className].filter(Boolean).join(" ")} aria-label="Case study index">
      <span>&gt; CASE STUDY INDEX</span>
      <div>
        {chapters.map(([number, title]) => (
          <Link href={hrefForChapter(number)} key={number}>
            <small>{`// ${number}`}</small>
            <strong>{title}</strong>
          </Link>
        ))}
      </div>
    </nav>
  )
}
