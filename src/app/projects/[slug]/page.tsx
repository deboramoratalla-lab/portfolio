import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProjectPage } from "@/components/project-page"
import { projectBySlug, projects } from "@/data/projects"

const SITE = "https://deboramoratalla.com"

export function generateStaticParams() { return projects.map(project => ({ slug: project.slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = projectBySlug[slug]
  if (!project) return {}
  const title = project.seoTitle ? `${project.shortTitle} · ${project.seoTitle}` : project.shortTitle
  const description = project.seoDescription ?? project.strapline
  const url = `/projects/${project.slug}`
  const image = `${url}/opengraph-image`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} — Debora Moratalla`, description, url, type: "article", images: [{ url: image, width: 1200, height: 630, alt: `${project.shortTitle} case study by Debora Moratalla` }] },
    twitter: { card: "summary_large_image", title: `${title} — Debora Moratalla`, description, images: [image] },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = projectBySlug[slug]
  if (!project) notFound()
  const url = `${SITE}/projects/${project.slug}`
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: `${project.shortTitle} — case study`,
      headline: project.seoTitle ? `${project.shortTitle}: ${project.seoTitle}` : project.shortTitle,
      description: project.seoDescription ?? project.strapline,
      url,
      image: `${SITE}${project.cover}`,
      genre: "Product design case study",
      keywords: project.tags.join(", "),
      inLanguage: "en",
      author: { "@type": "Person", name: "Debora Moratalla", url: SITE },
      creator: { "@type": "Person", name: "Debora Moratalla", url: SITE },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Work", item: `${SITE}/#work` },
        { "@type": "ListItem", position: 2, name: project.shortTitle, item: url },
      ],
    },
  ]
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <ProjectPage project={project} />
  </>
}
