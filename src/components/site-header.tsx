"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  return <header className="site-header">
    <Link className="monogram" href="/" aria-label="Debora Moratalla, home"><Image src="/media/dm-logo.png" alt="" width={31} height={31} priority /></Link>
    <button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>Menu</button>
    <nav className={open ? "nav open" : "nav"} onClick={() => setOpen(false)}>
      <Link href="/#about">About</Link><Link href="/#work">Work</Link><Link href="/#practice">Practice</Link><Link href="/#tools">Tools</Link>
    </nav>
  </header>
}
