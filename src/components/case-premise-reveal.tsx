"use client"

import { motion, MotionValue, useReducedMotion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"

// Motion needs a concrete color for interpolation. Keep this aligned with
// --accent-purple-on-dark / --purple-400 in tokens.css.
const REVEAL_PURPLE_ON_DARK = "#c9c1ff"

function RevealWord({ children, progress, start, end }: { children: string; progress: MotionValue<number>; start: number; end: number }) {
  const color = useTransform(progress, [start, end], ["#aaa9a2", REVEAL_PURPLE_ON_DARK])
  return <motion.span style={{ color }}>{children}&nbsp;</motion.span>
}

function ClosingRevealWord({ children, progress, start, end }: { children: string; progress: MotionValue<number>; start: number; end: number }) {
  const color = useTransform(progress, [start, end], ["#aaa9a2", "#526600"])
  return <motion.span style={{ color }}>{children}{" "}</motion.span>
}

export function CasePremiseReveal({ children, className = "" }: { children: string; className?: string }) {
  const target = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()
  const words = children.split(" ")
  const { scrollYProgress } = useScroll({ target, offset: ["start .76", "end .08"] })

  return <p ref={target} className={["case-premise", "case-premise-reveal", "case-hero-premise-unified", className].filter(Boolean).join(" ")}>{words.map((word, index) => {
    const start = index / Math.max(words.length, 1) * .92
    return reduced
      ? <span key={`${word}-${index}`}>{word}&nbsp;</span>
      : <RevealWord key={`${word}-${index}`} progress={scrollYProgress} start={start} end={Math.min(start + .09, 1)}>{word}</RevealWord>
  })}</p>
}

export function CaseClosingReveal({ children }: { children: string }) {
  const target = useRef<HTMLQuoteElement>(null)
  const reduced = useReducedMotion()
  const words = children.split(" ")
  const { scrollYProgress } = useScroll({ target, offset: ["start .9", "start .28"] })

  return <blockquote ref={target} className="tap-story-close">{words.map((word, index) => {
    const start = index / Math.max(words.length, 1) * .82
    return reduced
      ? <span key={`${word}-${index}`} style={{ color: "#526600" }}>{word}{" "}</span>
      : <ClosingRevealWord key={`${word}-${index}`} progress={scrollYProgress} start={start} end={Math.min(start + .16, 1)}>{word}</ClosingRevealWord>
  })}</blockquote>
}
