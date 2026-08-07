"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"

export function HeroIntro() {
  const heroRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : -46])
  const systemY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : -86])
  const systemScale = useTransform(scrollYProgress, [0, 1], [1, reducedMotion ? 1 : .965])
  const enter = reducedMotion ? { duration: 0 } : { duration: .9, ease: [.16, 1, .3, 1] as const }

  return <section ref={heroRef} className="home-hero" aria-label="Introduction">
    <div className="intro-sequence" aria-hidden="true"><span>Systems</span></div>
    <div className="hero-intro-copy">
      <motion.div
        className="hero-identity"
        initial={reducedMotion ? false : { opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ ...enter, delay: reducedMotion ? 0 : 2.48 }}
      >
        <span>Debora Moratalla</span>
        <span>Product design · systems · AI</span>
      </motion.div>
      <div className="hero-small-words">
        <motion.span
          initial={reducedMotion ? false : { opacity: 0, filter: "blur(16px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ ...enter, delay: reducedMotion ? 0 : 2.58 }}
        >Design for</motion.span>
        <motion.span
          initial={reducedMotion ? false : { opacity: 0, filter: "blur(16px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ ...enter, delay: reducedMotion ? 0 : 2.72 }}
        >messy products.</motion.span>
      </div>
      <motion.p
        initial={reducedMotion ? false : { opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ ...enter, duration: reducedMotion ? 0 : 1.05, delay: reducedMotion ? 0 : 2.88 }}
      >A portfolio about judgment, constraints and systems that teams keep using after the screen is shipped.</motion.p>
    </div>
    <motion.figure
      className="hero-portrait"
      style={{ y: portraitY }}
      initial={reducedMotion ? false : { opacity: 0, x: 90, filter: "blur(18px) grayscale(1)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px) grayscale(1)" }}
      transition={{ ...enter, duration: reducedMotion ? 0 : 1.08, delay: reducedMotion ? 0 : 2.86 }}
      aria-label="Portrait of Debora Moratalla"
    >
      <Image
        src="/media/y6pNO70rr4PZo0E8r6ULmhFEeA.png"
        alt=""
        fill
        priority
        sizes="(max-width: 800px) 78vw, 38vw"
      />
    </motion.figure>
    <motion.div
      className="hero-system-wrap"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reducedMotion ? 0 : .62, delay: reducedMotion ? 0 : 2.7 }}
    ><motion.span className="hero-system" style={{ y: systemY, scale: systemScale }}>Systems</motion.span></motion.div>
  </section>
}
