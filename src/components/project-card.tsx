import Image from "next/image"
import Link from "next/link"
import type { Project } from "@/data/projects"

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return <Link href={`/projects/${project.slug}`} className="project-card" style={{ "--accent": project.accent, "--stack": index } as React.CSSProperties}>
    <div className="project-copy"><span className="project-number">({project.number})</span><div><h3>{project.shortTitle}</h3><p>{project.strapline}</p><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div></div>
    <div className="project-image"><Image src={project.cover} alt={`${project.shortTitle} project`} fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
  </Link>
}
