"use client"

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"

export function EditorialPreviewHero() {
  const ref = useRef<HTMLElement>(null)
  const lastCell = useRef(-1)
  const reduced = useReducedMotion()
  const [activeCells, setActiveCells] = useState<number[]>([])
  const [typedProduct, setTypedProduct] = useState(() => reduced ? "complex products" : "")
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const titleY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 76])
  const panelY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -42])
  const enter = reduced ? { duration: 0 } : { duration: .9, ease: [.16, 1, .3, 1] as const }

  useEffect(() => {
    const phrases = ["complex products", "AI workflows", "coded prototypes"]
    if (reduced) return
    let index = 0
    let phraseIndex = 0
    let deleting = false
    let timer: number
    const tick = () => {
      const phrase = phrases[phraseIndex]
      if (!deleting) {
        index += 1
        setTypedProduct(phrase.slice(0, index))
        if (index === phrase.length) {
          deleting = true
          timer = window.setTimeout(tick, 1450)
        } else timer = window.setTimeout(tick, 82)
      } else {
        index -= 1
        setTypedProduct(phrase.slice(0, index))
        if (index === 0) {
          deleting = false
          phraseIndex = (phraseIndex + 1) % phrases.length
          timer = window.setTimeout(tick, 420)
        } else timer = window.setTimeout(tick, 42)
      }
    }
    timer = window.setTimeout(tick, 620)
    return () => window.clearTimeout(timer)
  }, [reduced])

  function paintPixels(event: React.PointerEvent<HTMLElement>) {
    if (reduced || event.pointerType === "touch") return
    const bounds = event.currentTarget.getBoundingClientRect()
    const blackBandTop = 0
    const blackBandHeight = 230
    const localY = event.clientY - bounds.top
    if (localY < blackBandTop || localY >= blackBandTop + blackBandHeight) {
      lastCell.current = -1
      return
    }
    const columns = 40
    const cellSize = bounds.width / columns
    const column = Math.max(0, Math.min(columns - 1, Math.floor((event.clientX - bounds.left) / cellSize)))
    const row = Math.max(0, Math.floor((localY - blackBandTop) / cellSize))
    const cell = row * columns + column
    if (cell === lastCell.current) return
    lastCell.current = cell
    setActiveCells(current => [...current.filter(item => item !== cell), cell])
    window.setTimeout(() => setActiveCells(current => current.filter(item => item !== cell)), 760)
  }

  return <section ref={ref} className="editorial-hero" aria-label="Introduction" onPointerMove={paintPixels} onPointerLeave={() => { lastCell.current = -1 }}>
    <div className="editorial-pixel-field" aria-hidden="true">{Array.from({ length: 320 }, (_, index) => {
      const activeIndex = activeCells.indexOf(index)
      const age = activeIndex < 0 ? 0 : Math.min(4, activeCells.length - 1 - activeIndex)
      return <i key={index} className={`${index % 4 === 0 ? "is-green" : "is-purple"} ${activeIndex >= 0 ? `is-active trail-${age}` : ""}`} />
    })}</div>
    <div className="editorial-hero-top">
      <motion.div className="editorial-identity" initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...enter, delay: .1 }}><span className="editorial-identity-photo"><Image src="/media/y6pNO70rr4PZo0E8r6ULmhFEeA.png" alt="" fill priority sizes="44px" /></span><span>Debora Moratalla</span></motion.div>
      <motion.span initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...enter, delay: .35 }}>Product designer &amp; builder</motion.span>
    </div>

    <div className="editorial-hero-stage">
      <motion.h1 className="editorial-title" style={{ y: titleY }}>
        <motion.span initial={reduced ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ ...enter, delay: .18 }}>I make</motion.span>
        <motion.span className="editorial-code-line" initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...enter, delay: .28 }} aria-label="Focus: complex products, AI workflows and coded prototypes"><code><span className="code-keyword">const</span> <span className="code-name">focus</span> <span className="code-operator">=</span> <span className="code-string">&quot;{typedProduct}<b aria-hidden="true"/>&quot;</span><span className="code-operator">;</span></code></motion.span>
        <motion.span initial={reduced ? false : { opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ ...enter, delay: .42 }}>from the logic up.</motion.span>
      </motion.h1>

      <motion.aside className="editorial-proof" style={{ y: panelY }} initial={reduced ? false : { opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ ...enter, delay: .58 }}>
        <div className="editorial-proof-meta"><span>10+ years</span><i/><span>Product + systems</span><i/><span>AI + code</span></div>
        <p>I turn complex product logic into experiences people can understand, use and build — working from the first model to the shipped detail.</p>
        <div className="editorial-proof-actions"><a className="is-linkedin" href="https://www.linkedin.com/in/deboramoratallamartin/" target="_blank" rel="noreferrer"><svg className="social-icon social-icon--linkedin" viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 3.5A2.3 2.3 0 1 1 5.2 8a2.3 2.3 0 0 1 0-4.5ZM3.3 9.8h3.8v10.7H3.3V9.8Zm6.1 0h3.6v1.5h.1a4 4 0 0 1 3.6-2c3.8 0 4.5 2.5 4.5 5.8v5.4h-3.8v-4.8c0-1.1 0-3.1-1.9-3.1s-2.2 1.5-2.2 3v4.9H9.4V9.8Z"/></svg><span>LinkedIn</span></a><a className="is-github" href="https://github.com/deboramoratalla-lab" target="_blank" rel="noreferrer"><Image src="/tools/github.svg" width={16} height={16} alt=""/><span>GitHub</span></a></div>
      </motion.aside>
    </div>

  </section>
}
