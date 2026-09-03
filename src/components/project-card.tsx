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
        {(project.problem || project.complexity || project.ownership || project.outcome) && <ul className="project-signals" aria-label="Project snapshot">
          {project.problem && <li className="project-signal"><span className="project-signal__dot" aria-hidden="true">+</span><span className="project-signal__label">Problem</span><span>{project.problem}</span></li>}
          {project.complexity && <li className="project-signal"><span className="project-signal__dot" aria-hidden="true">+</span><span className="project-signal__label">Complexity</span><span>{project.complexity}</span></li>}
          {project.ownership && <li className="project-signal"><span className="project-signal__dot" aria-hidden="true">+</span><span className="project-signal__label">Ownership</span><span>{project.ownership}</span></li>}
          {project.outcome && <li className="project-signal project-signal--outcome"><span className="project-signal__dot" aria-hidden="true">→</span><span className="project-signal__label">Outcome</span><span>{project.outcome}</span></li>}
        </ul>}
      </div>
      <div className="project-editorial-footer"><span className="project-view">View case study <ArrowUpRight /></span></div>
    </motion.div>
    <motion.div className="project-image" initial={reduced ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: .35 }} transition={{ duration: .7, ease: [0.16,1,0.3,1] }}><Image src={project.cover} alt={`${project.shortTitle} project`} fill sizes="(max-width: 800px) 100vw, 50vw" /></motion.div>
  </Link>
}
