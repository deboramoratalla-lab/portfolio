"use client"

import { AnimatePresence, motion, MotionValue, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { ArrowUpRight } from "@/components/arrow-up-right"

const ease = [0.16, 1, 0.3, 1] as const
const scrambleGlyphs = "01<>[]{}/*+—_#%"

function ScrambleStatement({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const inView = useInView(ref, { once: true, amount: .55 })
  const reduced = useReducedMotion()
  const [output, setOutput] = useState(reduced ? text : text.replace(/\S/g, "·"))

  useEffect(() => {
    if (!inView || reduced) return
    let frame = 0
    const totalFrames = Math.max(30, text.length * 1.08)
    const timer = window.setInterval(() => {
      frame += 1
      const resolved = Math.floor((frame / totalFrames) * text.length)
      setOutput(text.split("").map((character, index) => character === " " ? " " : index < resolved ? character : scrambleGlyphs[(frame * 5 + index * 7) % scrambleGlyphs.length]).join(""))
      if (frame >= totalFrames) {
        setOutput(text)
        window.clearInterval(timer)
      }
    }, 24)
    return () => window.clearInterval(timer)
  }, [inView, reduced, text])

  return <h2 ref={ref} className="scramble-heading" aria-label={text}><span className="scramble-size" aria-hidden="true">{text}</span><span className="scramble-output" aria-hidden="true">{output}</span></h2>
}

export function MotionSectionTitle({ title, number, statement }: { title: string; number: string; statement?: string }) {
  const reduced = useReducedMotion()
  return <motion.header className="section-title" initial={reduced ? false : { opacity: 0, y: 32, filter: "blur(10px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: .65 }} transition={{ duration: .85, ease }}>
    <p className="section-label">{title}</p><sup>{number}</sup>{statement && <ScrambleStatement text={statement}/>}
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
      <AnimatePresence mode="wait">{active !== null && <motion.div key={methods[active][3]} initial={reduced ? false : { opacity: 0, scale: 1.06, filter: "blur(8px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: .985, filter: "blur(5px)" }} transition={{ duration: .42, ease }}><Image src={methods[active][3]} alt={`${methods[active][0]} design principle`} fill sizes="(max-width: 800px) 100vw, 34vw" /></motion.div>}</AnimatePresence>
    </motion.div>
    <motion.div className="method-list" initial="hidden" whileInView="shown" viewport={{ once: true, amount: .12 }} variants={{ hidden: {}, shown: { transition: { staggerChildren: .11 } } }}>
      {methods.map(([title, copy, tag, image, pixelImage], index) => <motion.article ref={element => { rows.current[index] = element }} data-method={index} tabIndex={0} onPointerEnter={() => setActive(index)} onMouseOver={() => setActive(index)} onFocus={() => setActive(index)} key={title} className={active === index ? "is-active" : ""} variants={reduced ? {} : { hidden: { opacity: 0, y: 28 }, shown: { opacity: 1, y: 0, transition: { duration: .72, ease } } }}><div className="method-inline-visual"><Image className="method-clean" src={image} alt={`${title} design principle`} fill sizes="210px" unoptimized/><Image className="method-pixel" src={pixelImage} alt="" fill sizes="210px" unoptimized/></div><h3>{title}</h3><div><p>{copy}</p><span>{tag}</span></div></motion.article>)}
    </motion.div>
  </div>
}

function RevealWord({ children, progress, start, end, inverse = false }: { children: string; progress: MotionValue<number>; start: number; end: number; inverse?: boolean }) {
  const color = useTransform(progress, [start, end], inverse ? ["#5145c7", "#aaa9a2"] : ["#353535", "#f1f1ed"])
  return <motion.span style={{ color }}>{children}&nbsp;</motion.span>
}

export function RevealStatement({ lines, inverse = false }: { lines: string[]; inverse?: boolean }) {
  const target = useRef<HTMLQuoteElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target, offset: ["start .86", "end .42"] })
  const words = lines.flatMap((line, lineIndex) => line.split(" ").map((word, wordIndex) => ({ word, lineIndex, wordIndex })))
  let globalIndex = 0
  return <blockquote ref={target} className="reveal-statement">
    {lines.map((line, lineIndex) => <span className="reveal-line" key={line}>{line.split(" ").map(word => {
      const index = globalIndex++
      const start = index / Math.max(words.length, 1) * .82
      return reduced ? <span key={`${lineIndex}-${index}`}>{word}&nbsp;</span> : <RevealWord key={`${lineIndex}-${index}`} progress={scrollYProgress} start={start} end={Math.min(start + .18, 1)} inverse={inverse}>{word}</RevealWord>
    })}</span>)}
  </blockquote>
}

type Earlier = { name: string; label: string; href: string; image: string }

export function EarlierGrid({ items }: { items: Earlier[] }) {
  const reduced = useReducedMotion()
  return <motion.div className="earlier-grid" initial="hidden" whileInView="shown" viewport={{ once: true, amount: .08 }} variants={{ hidden: {}, shown: { transition: { staggerChildren: .09 } } }}>
    {items.map((item, index) => <motion.a href={item.href} key={item.name} className="earlier-card" style={{ "--earlier-accent": index % 2 === 0 ? "#5145c7" : "#526600" } as React.CSSProperties} variants={reduced ? {} : { hidden: { opacity: 0, y: 34, scale: .985 }, shown: { opacity: 1, y: 0, scale: 1, transition: { duration: .72, ease } } }} transition={{ duration: .35, ease }}><i className="earlier-index">{`// 00${index + 1}`}</i><div className="earlier-copy"><h3>{item.name}</h3><p>{item.label.split(" · ").map(part => <span key={part}>{part}</span>)}</p></div><div className="earlier-media"><Image src={item.image} alt={`${item.name} case study cover`} fill sizes="(max-width:800px) 100vw, 25vw" /></div><span className="earlier-link">View case <ArrowUpRight /></span></motion.a>)}
  </motion.div>
}
