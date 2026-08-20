"use client"

import { useRef, useState } from "react"
import { useReducedMotion } from "motion/react"

export function LabPixelGrid() {
  const reduced = useReducedMotion()
  const lastCell = useRef(-1)
  const [active, setActive] = useState<number[]>([])
  function paint(event: React.PointerEvent<HTMLElement>) {
    if (reduced || event.pointerType === "touch") return
    const bounds = event.currentTarget.getBoundingClientRect()
    const columns = 40
    const cellSize = bounds.width / columns
    const x = Math.floor((event.clientX - bounds.left) / cellSize)
    const y = Math.floor((event.clientY - bounds.top) / cellSize)
    const cell = y * columns + x
    if (cell === lastCell.current || cell < 0 || cell >= 320) return
    lastCell.current = cell
    setActive(current => [...current.filter(item => item !== cell), cell])
    window.setTimeout(() => setActive(current => current.filter(item => item !== cell)), 760)
  }
  return <div className="lab-pixel-interaction" onPointerMove={paint} onPointerLeave={() => { lastCell.current = -1 }} aria-hidden="true"><div className="editorial-pixel-field lab-pixel-grid">{Array.from({ length: 320 }, (_, index) => {
    const activeIndex = active.indexOf(index)
    const age = activeIndex < 0 ? 0 : Math.min(4, active.length - 1 - activeIndex)
    return <i key={index} className={`${index % 4 === 0 ? "is-green" : "is-purple"} ${activeIndex >= 0 ? `is-active trail-${age}` : ""}`} />
  })}</div></div>
}
