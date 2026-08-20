import type { ReactNode } from "react"

type EditorialSectionHeaderProps = {
  label: string
  title: string
  description: ReactNode
  titleId?: string
}

/** Shared heading contract for editorial index sections. */
export function EditorialSectionHeader({ label, title, description, titleId }: EditorialSectionHeaderProps) {
  return (
    <header className="editorial-section-header">
      <div>
        <span className="editorial-label">{label}</span>
        <h2 id={titleId}>{title}</h2>
      </div>
      <p>{description}</p>
    </header>
  )
}
