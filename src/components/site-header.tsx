"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { motion, useReducedMotion } from "motion/react"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const reducedMotion = useReducedMotion()
  const animateHomeEntrance = pathname === "/" && !reducedMotion

  return <motion.header
    className="site-header"
    initial={animateHomeEntrance ? { opacity: 0, y: -92 } : false}
    animate={{ opacity: 1, y: 0 }}
    transition={animateHomeEntrance ? { duration: .78, delay: .12, ease: [.16, 1, .3, 1] } : { duration: 0 }}
  >
    <Link className="monogram" href="/" aria-label="Debora Moratalla, home"><Image src="/media/dm-logo.png" alt="" width={31} height={31} priority /></Link>
    <button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="site-navigation">Menu</button>
    <nav id="site-navigation" className={open ? "nav open" : "nav"} onClick={() => setOpen(false)}>
      <Link href="/#work">Work</Link><Link href="/lab">Lab</Link><Link href="/experience">Experience</Link><Link href="/#contact">Contact</Link><button className="nav-agent" onClick={() => window.dispatchEvent(new Event("open-portfolio-agent"))}>Ask Debora</button>
    </nav>
  </motion.header>
}
