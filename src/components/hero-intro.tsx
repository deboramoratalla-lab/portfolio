"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"

export function HeroIntro() {
  const heroRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const reelY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : -54])
  const systemY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : -86])
  const systemScale = useTransform(scrollYProgress, [0, 1], [1, reducedMotion ? 1 : .965])
  const enter = reducedMotion ? { duration: 0 } : { duration: .9, ease: [.16, 1, .3, 1] as const }

  return <section ref={heroRef} className="home-hero" aria-label="Introduction">
    <div className="intro-sequence" aria-hidden="true"><span>Systems</span></div>
    <div className="hero-intro-copy">
      <div className="hero-small-words">
        <motion.span initial={reducedMotion ? false : { opacity: 0, filter: "blur(16px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ ...enter, delay: reducedMotion ? 0 : 2.58 }}>Clarity.</motion.span>
        <motion.span initial={reducedMotion ? false : { opacity: 0, filter: "blur(16px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ ...enter, delay: reducedMotion ? 0 : 2.72 }}>Structure.</motion.span>
      </div>
      <motion.p initial={reducedMotion ? false : { opacity: 0, filter: "blur(10px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ ...enter, duration: reducedMotion ? 0 : 1.05, delay: reducedMotion ? 0 : 2.88 }}>I work where products get complicated: tangled workflows, growing systems and AI that needs clear boundaries. I turn that complexity into decisions teams can build on.</motion.p>
    </div>
    <motion.div className="hero-reel" style={{ y: reelY }} initial={reducedMotion ? false : { opacity: 0, x: 150 }} animate={{ opacity: 1, x: 0 }} transition={{ ...enter, duration: reducedMotion ? 0 : 1.08, delay: reducedMotion ? 0 : 2.78 }}><video src="/media/ZOeDI7fC0g8dMMaYluHtSKEnHe0.mp4" autoPlay muted loop playsInline /></motion.div>
    <motion.div className="hero-ticker" initial={reducedMotion ? false : { scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ ...enter, duration: reducedMotion ? 0 : .82, delay: reducedMotion ? 0 : 3.02 }}>
      <motion.span initial={reducedMotion ? false : { opacity: 0, x: 90 }} animate={{ opacity: 1, x: 0 }} transition={{ ...enter, duration: reducedMotion ? 0 : .8, delay: reducedMotion ? 0 : 3.12 }}>AI Workflows</motion.span>
      <motion.span initial={reducedMotion ? false : { opacity: 0, x: 150 }} animate={{ opacity: 1, x: 0 }} transition={{ ...enter, duration: reducedMotion ? 0 : .9, delay: reducedMotion ? 0 : 3.22 }}>Design Systems</motion.span>
    </motion.div>
    <motion.div className="hero-system-wrap" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reducedMotion ? 0 : .62, delay: reducedMotion ? 0 : 2.7 }}><motion.span className="hero-system" style={{ y: systemY, scale: systemScale }}>Systems</motion.span></motion.div>
  </section>
}
