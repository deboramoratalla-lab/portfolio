"use client"

import { motion, MotionValue, useReducedMotion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"

function Word({ children, progress, start, end }: { children: string; progress: MotionValue<number>; start: number; end: number }) {
  const color = useTransform(progress, [start, end], ["#666", "#f4f3ed"])
  return <motion.span style={{ color }}>{children}&nbsp;</motion.span>
}

export function BoardRevealText({ children }: { children: string }) {
  const target = useRef<HTMLHeadingElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target, offset: ["start .78", "end .18"] })
  const words = children.split(" ")

  return <h2 ref={target} className="board-reveal-text">{words.map((word, index) => {
    const start = index / Math.max(words.length, 1) * .84
    return reduced
      ? <span key={`${word}-${index}`}>{word}&nbsp;</span>
      : <Word key={`${word}-${index}`} progress={scrollYProgress} start={start} end={Math.min(start + .14, 1)}>{word}</Word>
  })}</h2>
}
