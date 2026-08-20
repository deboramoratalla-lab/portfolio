"use client"

import { useRef, useState } from "react"
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react"

const ranges = [
  { label: "Product", capabilities: ["Roles", "States", "Workflows"] },
  { label: "Systems", capabilities: ["Tokens", "Component APIs", "Governance"] },
  { label: "Code", capabilities: ["React", "TypeScript", "AI workflows"] },
]

export function ToolShowcase() {
  const track = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [stage, setStage] = useState(reduced ? ranges.length * 3 + 1 : 0)
  const [progress, setProgress] = useState(0)
  const { scrollYProgress } = useScroll({ target: track, offset: ["start .72", "end .72"] })
  useMotionValueEvent(scrollYProgress, "change", value => {
    const nextProgress = reduced ? 1 : Math.max(0, Math.min(1, value))
    setProgress(nextProgress)
    const nextStage = Math.min(ranges.length * 3 + 1, Math.floor(nextProgress * (ranges.length * 3 + 2)))
    setStage(current => Math.max(current, nextStage))
  })

  return <div className={`working-range${stage >= ranges.length * 3 ? " is-shipped" : ""}${stage >= ranges.length * 3 + 1 ? " is-complete" : ""}`} ref={track}>
    <div
      className={`signal-path${stage > 0 ? " is-tracking" : ""}`}
      style={{ "--signal-progress": `${progress * 100}%` } as React.CSSProperties}
    >
      <div className="signal-grid" aria-hidden="true" />
      <div className="signal-line" aria-hidden="true"><span /></div>
      <div className="signal-nodes">
        {ranges.map((range, index) => {
          const nodeStage = index * 3 + 1
          const labelStage = index * 3 + 2
          const contentStage = index * 3 + 3
          const classes = [stage >= nodeStage && "has-node", stage >= labelStage && "has-label", stage >= contentStage && "has-content"].filter(Boolean).join(" ")
          return <article className={classes} key={range.label}>
          <span className="signal-index">{`// 00${index + 1}`}</span>
          <button type="button">
            <i aria-hidden="true" />{range.label}
          </button>
          <ul>{range.capabilities.map(item => <li key={item}>{item}</li>)}</ul>
        </article>})}
      </div>
      <span className="signal-output">shipped<span>_</span></span>
      <p className="working-stack"><span>Stack /</span>Figma · React · TypeScript · Claude · Codex · GitHub · Vercel</p>
    </div>
  </div>
}
