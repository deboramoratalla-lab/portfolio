import type { ReactNode } from "react"
import { CasePremiseReveal } from "@/components/case-premise-reveal"

type CaseHeroProps = {
  className: string
  kickerClassName: string
  kicker: ReactNode
  title: ReactNode
  premise: string
  premiseClassName?: string
  meta: ReactNode
}

/**
 * Shared semantic shell for every portfolio case-study opening.
 * Page-specific classes remain available for art direction; the document
 * structure, heading ownership and meta order do not vary by project.
 */
export function CaseHero({ className, kickerClassName, kicker, title, premise, premiseClassName, meta }: CaseHeroProps) {
  return (
    <section className={`${className} case-hero-unified`} id="top">
      <div className={`${kickerClassName} case-hero-kicker-unified`}>{kicker}</div>
      <h1 className="case-hero-title-unified">{title}</h1>
      <CasePremiseReveal className={premiseClassName}>{premise}</CasePremiseReveal>
      {meta}
    </section>
  )
}
