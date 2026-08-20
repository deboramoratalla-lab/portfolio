import type { ReactNode } from "react"

type SupportCardProps = {
  number: string
  title: string
  items: string[]
  icon: ReactNode
}

export function SupportCard({ number, title, items, icon }: SupportCardProps) {
  return (
    <article>
      <span className="support-card-icon" aria-hidden="true">{icon}</span>
      <span className="editorial-number">{number}</span>
      <h3>{title}</h3>
      {items.map((item) => <p key={item}>{item}</p>)}
    </article>
  )
}
