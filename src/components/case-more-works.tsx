import Link from "next/link"

type ProjectLink = {
  href: string
  title: string
  description: string
}

export function CaseMoreWorks({ previous, next }: { previous: ProjectLink; next: ProjectLink }) {
  return <section className="board-more" aria-label="More Works">
    <div className="board-more-marquee">
      <div className="board-more-track" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => <span key={index}>More Works©</span>)}
      </div>
    </div>
    <nav>
      <Link href={previous.href}><small>Previous project</small><strong>{previous.title}</strong><p>{previous.description}</p></Link>
      <Link href={next.href}><small>Next project</small><strong>{next.title}</strong><p>{next.description}</p></Link>
    </nav>
  </section>
}
