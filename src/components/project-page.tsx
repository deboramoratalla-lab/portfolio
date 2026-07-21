import Image from "next/image"
import Link from "next/link"
import { projects, type Project } from "@/data/projects"

export function ProjectPage({ project }: { project: Project }) {
  const index = projects.findIndex(item => item.slug === project.slug)
  const previous = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]
  const closing = project.slug === "saas" ? "People don’t coordinate work through screens. They coordinate through shared understanding." : project.slug === "tap-mindset-ds" ? "The goal was never consistency. It was continuity." : project.slug === "tap-mindset" ? "A product becomes scalable when its logic is clear enough to survive the next feature." : "Good design isn’t about adding more interactions. It’s about removing the unnecessary ones."
  return <main className={`case-study case-${project.slug}`} style={{ "--accent": project.accent } as React.CSSProperties}>
    <section className="case-hero" id="top">
      <span className="case-kicker">Case study · {project.number}</span><h1>{project.title}</h1>
      <div className="case-intro-grid">
        <div className="case-meta"><div><span>Role</span><strong>{project.role}</strong></div><div><span>Team</span><strong>{project.context}</strong></div><div><span>Time</span><strong>{project.timeline}</strong></div></div>
        <p className="case-premise">{project.premise}</p>
      </div>
      <div className="tldr">{project.tldr.map(item => <p key={item}>{item}</p>)}</div>
    </section>
    <nav className="case-index" aria-label="Case study index">{project.chapters.map(chapter => <Link key={chapter.number} href={`#chapter-${chapter.number}`}><span>{chapter.number}</span><strong>{chapter.title}</strong></Link>)}</nav>
    {project.chapters.map(chapter => <section className="chapter" id={`chapter-${chapter.number}`} key={chapter.number}>
      <header className="chapter-header"><span>{chapter.number}</span><div><p>{chapter.title}</p><h2>{chapter.thesis}</h2></div></header>
      {chapter.sections.map((section, sectionIndex) => <article className={`case-section tone-${sectionIndex % 3}`} key={`${section.title}-${sectionIndex}`}>
        <div className="case-section-inner"><div className="section-copy">{section.eyebrow && <p className="eyebrow">{section.eyebrow}</p>}<h3>{section.title}</h3>{section.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
        {section.points && <div className="point-grid">{section.points.map(([label, value]) => <div key={`${label}-${value}`}><span>{label}</span><p>{value}</p></div>)}</div>}
        {section.metrics && <div className="metrics">{section.metrics.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>}
        {section.media && <div className="case-media"><Image src={section.media} alt="" fill sizes="(max-width: 800px) 100vw, 80vw" /></div>}
        {section.video && <video className="case-video" src={section.video} autoPlay muted loop playsInline controls />}</div>
      </article>)}
    </section>)}
    <section className="case-closing"><span>What this was actually about</span><p>{closing}</p></section>
    <div className="more-works-word" aria-hidden="true">More Works</div>
    <nav className="project-pagination"><Link href={`/projects/${previous.slug}`}><span>Previous project</span><strong>{previous.shortTitle}</strong></Link><Link href={`/projects/${next.slug}`}><span>Next project</span><strong>{next.shortTitle}</strong></Link></nav>
  </main>
}
