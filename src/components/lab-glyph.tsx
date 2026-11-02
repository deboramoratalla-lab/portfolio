/** Small line drawings that summarise what each lab piece is about. Stroke follows currentColor. */
export function LabGlyph({ slug, className }: { slug: string; className?: string }) {
  const common = { viewBox: "0 0 64 64", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className: `lab-glyph ${className ?? ""}`, "aria-hidden": true }
  switch (slug) {
    case "decision-handover": // one card hands a decision to the next, with the reason attached
      return <svg {...common}><rect x="6" y="14" width="22" height="28" rx="3"/><rect className="g-move" x="36" y="22" width="22" height="28" rx="3"/><path d="M11 22h12M11 28h8"/><path className="g-dash" d="M28 30h8" strokeDasharray="2 3"/><circle cx="47" cy="36" r="3"/></svg>
    case "workflow-impact-preview": // the same conversation, before and after a change
      return <svg {...common}><path d="M4 26c6-10 10 10 16 0s10-10 16 0 10 10 16 0 6-6 8-4"/><path className="g-move" d="M4 42c6-6 10 6 16 0s10-14 16 0 10 6 16 0 6-4 8-2" opacity=".55"/><path d="M4 54h56" opacity=".35"/></svg>
    case "parallel-not-blind": // parallel agents; one drifts away from the others
      return <svg {...common}><path d="M6 16h52M6 30h52"/><path className="g-move" d="M6 44h24c8 0 10 8 18 8h10"/><circle cx="30" cy="44" r="2.5" fill="currentColor"/></svg>
    case "european-tech-opportunity-radar": // a radar sweep over scattered roles
      return <svg {...common}><circle cx="32" cy="32" r="24"/><circle cx="32" cy="32" r="14" opacity=".6"/><path className="g-spin" d="M32 32 52 18"/><circle cx="44" cy="20" r="2" fill="currentColor"/><circle cx="20" cy="40" r="2" fill="currentColor"/><circle cx="40" cy="44" r="2" fill="currentColor"/></svg>
    case "gpu-job-triage": // a cost gauge deciding whether the batch keeps running
      return <svg {...common}><path d="M10 44a22 22 0 0 1 44 0"/><path d="M14 44h4M46 44h4M32 22v4" opacity=".6"/><path className="g-needle" d="M32 44 44 30"/><circle cx="32" cy="44" r="3"/><path d="M18 54h28" opacity=".35"/></svg>
    case "metrics-are-not-decisions":
      return <svg {...common}><path d="M8 52V30M20 52V20M32 52V36M44 52V14M56 52V26"/><path className="g-dash" d="M6 24h52" strokeDasharray="2 4"/></svg>
    case "agent-quality-loop":
      return <svg {...common}><path className="g-spin" d="M32 10a22 22 0 1 1-21 15"/><path d="M8 18l3 7 7-3"/><circle cx="32" cy="32" r="5"/></svg>
    default:
      return <svg {...common}><path d="M10 10h44v44H10z" opacity=".4"/><path className="g-move" d="M10 32h44M32 10v44"/></svg>
  }
}
