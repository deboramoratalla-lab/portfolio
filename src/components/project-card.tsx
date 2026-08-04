"use client"

import Image from "next/image"
import Link from "next/link"
import type { Project } from "@/data/projects"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const card = useRef<HTMLAnchorElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: card, offset: ["start end", "end start"] })
  const imageY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [22, -22])
  return <Link ref={card} href={`/projects/${project.slug}`} className="project-card" style={{ "--accent": project.accent, "--stack": index } as React.CSSProperties}>
    <motion.div className="project-copy" initial={reduced ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .55 }} transition={{ duration: .75, delay: .08, ease: [0.16,1,0.3,1] }}><div><h3>{project.shortTitle}</h3><p>{project.strapline}</p><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div></motion.div>
    <motion.div className="project-image" style={{ y: imageY }} initial={reduced ? false : { opacity: 0, scale: .965 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: .35 }} transition={{ duration: .9, ease: [0.16,1,0.3,1] }}><Image src={project.cover} alt={`${project.shortTitle} project`} fill sizes="(max-width: 800px) 100vw, 50vw" /></motion.div>
  </Link>
}
