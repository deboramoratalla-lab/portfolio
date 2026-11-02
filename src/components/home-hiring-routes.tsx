"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "motion/react"
import { starters } from "@/data/portfolio-agent-content"

const typed = ["Who is Debora?", "Has she designed an AI agent end to end?", "What is she looking for next?", "Has her work been adopted by a real team?"]

export function HomePortfolioGuide() {
  const reduced = useReducedMotion()
  const [text, setText] = useState(typed[0])

  useEffect(() => {
    if (reduced) return
    let phrase = 0, i = typed[0].length, deleting = true, timer: number
    const tick = () => {
      const target = typed[phrase]
      if (deleting) { i--; if (i <= 0) { deleting = false; phrase = (phrase + 1) % typed.length } }
      else { i++; if (i >= typed[phrase].length) { deleting = true; setText(typed[phrase]); timer = window.setTimeout(tick, 2200); return } }
      setText((deleting ? target : typed[phrase]).slice(0, Math.max(0, i)))
      timer = window.setTimeout(tick, deleting ? 28 : 55)
    }
    timer = window.setTimeout(tick, 2600)
    return () => window.clearTimeout(timer)
  }, [reduced])

  const open = (prompt?: string) => window.dispatchEvent(new CustomEvent("open-portfolio-agent", { detail: prompt }))

  return (
    <section className="guide-band" aria-labelledby="guide-band-title">
      <div className="guide-band__head">
        <p id="guide-band-title"><i aria-hidden="true" />AI guide</p>
        <span>Short on time? Ask about me. Straight answers, with links to the proof.</span>
      </div>
      <button type="button" className="guide-band__field" onClick={() => open()} aria-label="Ask the AI guide about Debora">
        <span className="guide-band__text" aria-hidden="true">{text}<b /></span>
        <span className="guide-band__send" aria-hidden="true">↗</span>
      </button>
      <div className="guide-band__chips" aria-label="Suggested questions">
        {starters.map(({ label }) => <button type="button" key={label} onClick={() => open(label)}>{label}</button>)}
      </div>
    </section>
  )
}
