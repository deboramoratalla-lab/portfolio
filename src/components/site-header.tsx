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
    transition={animateHomeEntrance ? { duration: .78, delay: 3.48, ease: [.16, 1, .3, 1] } : { duration: 0 }}
  >
    <Link className="monogram" href="/" aria-label="Debora Moratalla, home"><Image src="/media/dm-logo.png" alt="" width={31} height={31} priority /></Link>
    <button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>Menu</button>
    <nav className={open ? "nav open" : "nav"} onClick={() => setOpen(false)}>
      <Link href="/#about">About</Link><Link href="/#work">Work</Link><Link href="/#practice">Practice</Link><Link href="/#tools">Tools</Link><button className="nav-agent" onClick={() => window.dispatchEvent(new Event("open-portfolio-agent"))}>Ask Debora</button>
    </nav>
  </motion.header>
}
