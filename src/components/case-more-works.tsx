import { ArrowRouteLink } from "@/components/ui-links"

type ProjectLink = {
  href: string
  title: string
  description: string
}

export function CaseMoreWorks({ previous, next }: { previous: ProjectLink; next: ProjectLink }) {
  return <section className="board-more" aria-label="More Works">
    <header><span>[N. NEXT]</span><p>&gt; MORE WORK</p></header>
    <nav>
      {[previous, next].map((project, index) => <ArrowRouteLink key={project.href} href={project.href}><small>{index === 0 ? "Previous project" : "Next project"}</small><strong>{project.title}</strong><p>{project.description}</p><b>View case study</b></ArrowRouteLink>)}
    </nav>
  </section>
}
