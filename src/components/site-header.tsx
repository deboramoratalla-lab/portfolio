"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import { motion, useReducedMotion } from "motion/react"

const caseNavigation = {
  "/projects/saas": {
    prefix: "board",
    chapters: [
      ["01", "Find the problem"],
      ["02", "Build the rules"],
      ["03", "Survive delivery"],
    ],
  },
  "/projects/tap-mindset-ds": {
    prefix: "tap",
    chapters: [
      ["01", "Keep what matters"],
      ["02", "Make it usable"],
      ["03", "Use AI carefully"],
    ],
  },
  "/projects/tap-mindset": {
    prefix: "tap",
    chapters: [
      ["01", "Read the product"],
      ["02", "Choose the structure"],
      ["03", "Build, test, correct"],
      ["04", "Make it hold"],
    ],
  },
  "/projects/fluxy": {
    prefix: "fluxy",
    chapters: [
      ["01", "Read the burden"],
      ["02", "Define the agent"],
      ["03", "Bound autonomy"],
      ["04", "Make it testable"],
    ],
  },
  "/projects/civeo": {
    prefix: "civeo",
    chapters: [
      ["01", "Find lost context"],
      ["02", "Build the model"],
      ["03", "Trust live data"],
      ["04", "Ground the agent"],
    ],
  },
} as const

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const reducedMotion = useReducedMotion()
  const animateHomeEntrance = pathname === "/" && !reducedMotion
  const caseContext = useMemo(() => caseNavigation[pathname as keyof typeof caseNavigation], [pathname])
  const [activeChapter, setActiveChapter] = useState<string | undefined>(caseContext?.chapters[0]?.[0])

  useEffect(() => {
    if (!caseContext) return

    const sections = caseContext.chapters
      .map(([number]) => document.querySelector(`#${caseContext.prefix}-${number}`))
      .filter((section): section is Element => Boolean(section))
    const observer = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
      if (visible) setActiveChapter(visible.target.id.split("-").at(-1))
    }, { rootMargin: "-18% 0px -68% 0px", threshold: 0 })

    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [caseContext])

  return <motion.header
    className="site-header"
    initial={animateHomeEntrance ? { opacity: 0, y: -92 } : false}
    animate={{ opacity: 1, y: 0 }}
    transition={animateHomeEntrance ? { duration: .78, delay: .12, ease: [.16, 1, .3, 1] } : { duration: 0 }}
  >
    <Link className="monogram" href="/" aria-label="Debora Moratalla, home"><Image src="/media/dm-logo.png" alt="" width={31} height={31} priority /></Link>
    {caseContext && <nav className="case-menu case-menu-inline" aria-label="Case study chapters">{caseContext.chapters.map(([number, title]) => <Link href={`#${caseContext.prefix}-${number}`} key={number} aria-current={activeChapter === number ? "step" : undefined}><small>{number}</small><span>{title}</span></Link>)}</nav>}
    <button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="site-navigation">Menu</button>
    <nav id="site-navigation" className={open ? "nav open" : "nav"} onClick={() => setOpen(false)}>
      {caseContext && <details className="case-menu-mobile"><summary><span>INDEX</span><small>{activeChapter} · {caseContext.chapters.find(([number]) => number === activeChapter)?.[1]}</small></summary><div>{caseContext.chapters.map(([number, title]) => <Link href={`#${caseContext.prefix}-${number}`} key={number} aria-current={activeChapter === number ? "step" : undefined}><small>{number}</small>{title}</Link>)}</div></details>}
      <Link href="/#work">Work</Link><Link href="/lab">Lab</Link><Link href="/experience">Experience</Link><Link href="/#contact">Contact</Link><button className="nav-agent" onClick={() => window.dispatchEvent(new Event("open-portfolio-agent"))}>Ask Debora</button>
    </nav>
  </motion.header>
}
