"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { MotionSafeVideo } from "@/components/motion-safe-video"

/** Dark stage that continues the hero: the product window rises and settles as you scroll into it. */
export function SeamlineHeroStage() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] })
  const scale = useTransform(scrollYProgress, [0, 1], [reduced ? 1 : .86, 1])
  const y = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 40, 0])
  const rotateX = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 14, 0])
  const glow = useTransform(scrollYProgress, [0, 1], [0, 1])

  return <section ref={ref} className="sl-stage" aria-label="Seamline agent replaying its last run">
    <motion.div className="sl-stage-glow" style={{ opacity: glow }} aria-hidden="true" />
    <motion.figure className="sl-stage-window" style={{ scale, y, rotateX }}>
      <div className="sl-stage-chrome" aria-hidden="true"><i/><i/><i/><span>seamline-five.vercel.app</span></div>
      <MotionSafeVideo src="/media/seamline-agent-map.mp4" poster="/media/seamline-agent-map-poster.jpg" aria-label="The Seamline agent replaying its last run: changes travel in from Figma, code, Storybook and docs, the agent fixes what it can and sends the rest to a person" />
    </motion.figure>
    <p className="sl-stage-caption"><span>LIVE REPLAY</span>Changes come in from four sources. Fixes go back out. The decisions the agent won&apos;t make turn amber and wait for a person.</p>
  </section>
}
