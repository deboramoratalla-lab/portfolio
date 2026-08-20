import type { ReactNode } from "react"

type CaseChapterProps = {
  id: string
  className: string
  label: ReactNode
  title: ReactNode
  children: ReactNode
}

/** Shared chapter landmark: one label, one chapter heading, then evidence. */
export function CaseChapter({ id, className, label, title, children }: CaseChapterProps) {
  return (
    <section id={id} className={className}>
      <header>
        {label}
        <h2>{title}</h2>
      </header>
      {children}
    </section>
  )
}
