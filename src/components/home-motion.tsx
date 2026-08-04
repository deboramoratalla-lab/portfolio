"use client"

import { AnimatePresence, motion, MotionValue, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { ArrowUpRight } from "@/components/arrow-up-right"

const ease = [0.16, 1, 0.3, 1] as const

export function MotionSectionTitle({ title, number }: { title: string; number: string }) {
  const reduced = useReducedMotion()
  return <motion.header className="section-title" initial={reduced ? false : { opacity: 0, y: 32, filter: "blur(10px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: .65 }} transition={{ duration: .85, ease }}>
    <h2>{title}</h2><sup>{number}</sup>
  </motion.header>
}

export function MotionAbout({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion()
  return <motion.div className="about-grid" initial="hidden" whileInView="shown" viewport={{ once: true, amount: .3 }} variants={{ hidden: {}, shown: { transition: { staggerChildren: .14 } } }}>
    {Array.isArray(children) ? children.map((child, index) => <motion.div className={index === 0 ? "portrait-motion" : "about-copy-motion"} key={index} variants={reduced ? {} : { hidden: { opacity: 0, y: 34, filter: "blur(8px)" }, shown: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: .85, ease } } }}>{child}</motion.div>) : children}
  </motion.div>
}

export function MethodList({ methods }: { methods: string[][] }) {
  const reduced = useReducedMotion()
  const [active, setActive] = useState<number | null>(null)
  const rows = useRef<Array<HTMLElement | null>>([])
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const previewX = useSpring(pointerX, { stiffness: 260, damping: 28, mass: .55 })
  const previewY = useSpring(pointerY, { stiffness: 260, damping: 28, mass: .55 })

  useEffect(() => {
    if (!window.matchMedia("(max-width: 800px)").matches) return
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.method))
    }), { rootMargin: "-40% 0px -40% 0px" })
    rows.current.forEach(row => row && observer.observe(row))
    return () => observer.disconnect()
  }, [])

  const followPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const width = Math.min(window.innerWidth * .34, 500)
    pointerX.set(Math.min(event.clientX + 24, window.innerWidth - width - 20))
    pointerY.set(Math.max(92, Math.min(event.clientY - 150, window.innerHeight - 310)))
  }

  return <div className="method-layout" onPointerMove={followPointer} onMouseLeave={() => setActive(null)}>
    <motion.div className={`method-visual ${active !== null ? "is-active" : ""}`} style={{ x: previewX, y: previewY }}>
      <AnimatePresence mode="wait">{active !== null && <motion.div key={methods[active][3]} initial={reduced ? false : { opacity: 0, scale: 1.06, filter: "blur(8px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: .985, filter: "blur(5px)" }} transition={{ duration: .42, ease }}><Image src={methods[active][3]} alt="" fill sizes="(max-width: 800px) 100vw, 34vw" /></motion.div>}</AnimatePresence>
    </motion.div>
    <motion.div className="method-list" initial="hidden" whileInView="shown" viewport={{ once: true, amount: .12 }} variants={{ hidden: {}, shown: { transition: { staggerChildren: .11 } } }}>
      {methods.map(([title, copy, tag], index) => <motion.article ref={element => { rows.current[index] = element }} data-method={index} tabIndex={0} onPointerEnter={() => setActive(index)} onMouseOver={() => setActive(index)} onFocus={() => setActive(index)} key={title} className={active === index ? "is-active" : ""} variants={reduced ? {} : { hidden: { opacity: 0, y: 28 }, shown: { opacity: 1, y: 0, transition: { duration: .72, ease } } }}><h3>{title}</h3><div><p>{copy}</p><span>{tag}</span></div></motion.article>)}
    </motion.div>
  </div>
}

function RevealWord({ children, progress, start, end }: { children: string; progress: MotionValue<number>; start: number; end: number }) {
  const color = useTransform(progress, [start, end], ["#353535", "#f1f1ed"])
  return <motion.span style={{ color }}>{children}&nbsp;</motion.span>
}

export function RevealStatement({ lines }: { lines: string[] }) {
  const target = useRef<HTMLQuoteElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target, offset: ["start .86", "end .42"] })
  const words = lines.flatMap((line, lineIndex) => line.split(" ").map((word, wordIndex) => ({ word, lineIndex, wordIndex })))
  let globalIndex = 0
  return <blockquote ref={target} className="reveal-statement">
    {lines.map((line, lineIndex) => <span className="reveal-line" key={line}>{line.split(" ").map(word => {
      const index = globalIndex++
      const start = index / Math.max(words.length, 1) * .82
      return reduced ? <span key={`${lineIndex}-${index}`}>{word}&nbsp;</span> : <RevealWord key={`${lineIndex}-${index}`} progress={scrollYProgress} start={start} end={Math.min(start + .18, 1)}>{word}</RevealWord>
    })}</span>)}
  </blockquote>
}

type Earlier = { name: string; label: string; href: string; image: string }

export function EarlierGrid({ items }: { items: Earlier[] }) {
  const reduced = useReducedMotion()
  return <motion.div className="earlier-grid" initial="hidden" whileInView="shown" viewport={{ once: true, amount: .08 }} variants={{ hidden: {}, shown: { transition: { staggerChildren: .09 } } }}>
    {items.map((item, index) => <motion.a href={item.href} key={item.name} className="earlier-card" variants={reduced ? {} : { hidden: { opacity: 0, y: 34, scale: .985 }, shown: { opacity: 1, y: 0, scale: 1, transition: { duration: .72, ease } } }} whileHover={reduced ? undefined : { y: -6 }} transition={{ duration: .35, ease }}><div><Image src={item.image} alt="" fill sizes="(max-width:800px) 100vw, 33vw" /></div><span><strong>{item.name}</strong><i>0{index + 1}<ArrowUpRight /></i></span><p>{item.label}</p></motion.a>)}
  </motion.div>
}
