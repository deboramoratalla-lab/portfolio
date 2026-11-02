"use client"

import Image from "next/image"
import Link from "next/link"
import type { Project } from "@/data/projects"
import { motion, useReducedMotion } from "motion/react"
import { useRef } from "react"
import { ArrowUpRight } from "@/components/arrow-up-right"

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const card = useRef<HTMLAnchorElement>(null)
  const reduced = useReducedMotion()
  const editorialAccent = index % 2 === 0 ? "#5145c7" : "#526600"
  return <Link ref={card} href={`/projects/${project.slug}`} className="project-card" style={{ "--accent": editorialAccent, "--stack": index } as React.CSSProperties}>
    <motion.div className="project-copy" initial={reduced ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .55 }} transition={{ duration: .75, delay: .08, ease: [0.16,1,0.3,1] }}>
      <div className="project-editorial-meta"><span>{project.tags[0]}</span><i>{`// 00${index + 1}`}</i></div>
      <div className="project-editorial-body"><h3>{project.shortTitle}</h3><p>{project.strapline}</p>
        {project.cardStat && <div className="project-proof"><strong>{project.cardStat[0]}</strong><span>{project.cardStat[1]}</span></div>}
        {project.cardRole && <p className="project-role">{project.cardRole}</p>}
      </div>
      <div className="project-editorial-footer"><span className="project-view">View case study <ArrowUpRight /></span></div>
    </motion.div>
    <motion.div className="project-image" initial={reduced ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: .35 }} transition={{ duration: .7, ease: [0.16,1,0.3,1] }}><Image src={project.cover} alt={`${project.shortTitle} project`} fill sizes="(max-width: 800px) 100vw, 50vw" /></motion.div>
  </Link>
}
