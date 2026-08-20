import type { ReactNode } from "react"

type CaseEvidenceProps = {
  className?: string
  children: ReactNode
  caption?: ReactNode
}

/** A figure is the shared semantic container for product screens and artefacts. */
export function CaseEvidence({ className, children, caption }: CaseEvidenceProps) {
  return (
    <figure className={["case-evidence", className].filter(Boolean).join(" ")}>
      {children}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
