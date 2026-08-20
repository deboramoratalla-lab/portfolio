"use client"

import { motion, MotionValue, useReducedMotion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"

function RevealWord({ children, progress, start, end }: { children: string; progress: MotionValue<number>; start: number; end: number }) {
  const color = useTransform(progress, [start, end], ["#aaa9a2", "#5145c7"])
  return <motion.span style={{ color }}>{children}&nbsp;</motion.span>
}

function ClosingRevealWord({ children, progress, start, end }: { children: string; progress: MotionValue<number>; start: number; end: number }) {
  const color = useTransform(progress, [start, end], ["#aaa9a2", "#6f8800"])
  return <motion.span style={{ color }}>{children}{" "}</motion.span>
}

export function CasePremiseReveal({ children }: { children: string }) {
  const target = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()
  const words = children.split(" ")
  const { scrollYProgress } = useScroll({ target, offset: ["start .76", "end .08"] })

  return <p ref={target} className="case-premise case-premise-reveal">{words.map((word, index) => {
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
      ? <span key={`${word}-${index}`} style={{ color: "#6f8800" }}>{word}{" "}</span>
      : <ClosingRevealWord key={`${word}-${index}`} progress={scrollYProgress} start={start} end={Math.min(start + .16, 1)}>{word}</ClosingRevealWord>
  })}</blockquote>
}
