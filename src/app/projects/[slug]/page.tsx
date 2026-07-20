import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProjectPage } from "@/components/project-page"
import { projectBySlug, projects } from "@/data/projects"

export function generateStaticParams() { return projects.map(project => ({ slug: project.slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = projectBySlug[slug]
  return project ? { title: project.shortTitle, description: project.strapline } : {}
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = projectBySlug[slug]
  if (!project) notFound()
  return <ProjectPage project={project} />
}
