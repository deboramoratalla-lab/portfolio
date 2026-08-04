"use client"

import { motion, MotionValue, useReducedMotion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"

function RevealWord({ children, progress, start, end }: { children: string; progress: MotionValue<number>; start: number; end: number }) {
  const color = useTransform(progress, [start, end], ["#565656", "#f4f3ed"])
  return <motion.span style={{ color }}>{children}&nbsp;</motion.span>
}

export function CasePremiseReveal({ children }: { children: string }) {
  const target = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()
  const words = children.split(" ")
  const { scrollYProgress } = useScroll({ target, offset: ["start .78", "end .22"] })

  return <p ref={target} className="case-premise case-premise-reveal">{words.map((word, index) => {
    const start = index / Math.max(words.length, 1) * .84
    return reduced
      ? <span key={`${word}-${index}`}>{word}&nbsp;</span>
      : <RevealWord key={`${word}-${index}`} progress={scrollYProgress} start={start} end={Math.min(start + .16, 1)}>{word}</RevealWord>
  })}</p>
}
