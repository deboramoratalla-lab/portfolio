type CaseSectionLabelProps = {
  number: string
  children: React.ReactNode
  level?: "chapter" | "subsection"
  as?: "small" | "span" | "p"
  className?: string
  dark?: boolean
}

export function CaseSectionLabel({ number, children, level = "subsection", as: Tag = "small", className, dark = false }: CaseSectionLabelProps) {
  return <Tag className={["case-section-label", `case-section-label--${level}`, dark && "case-section-label--dark", className].filter(Boolean).join(" ")}>
    <span>[{number}]</span><b aria-hidden="true">&gt;</b><span>{children}</span>
  </Tag>
}
