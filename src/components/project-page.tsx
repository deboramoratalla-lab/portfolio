import Image from "next/image"
import Link from "next/link"
import { projects, type Project } from "@/data/projects"

export function ProjectPage({ project }: { project: Project }) {
  const index = projects.findIndex(item => item.slug === project.slug)
  const previous = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]
  return <main className="case-study" style={{ "--accent": project.accent } as React.CSSProperties}>
    <section className="case-hero" id="top">
      <span className="case-kicker">Case study · {project.number}</span><h1>{project.title}</h1>
      <div className="case-meta"><div><span>Role</span><strong>{project.role}</strong></div><div><span>Context</span><strong>{project.context}</strong></div><div><span>Timeline</span><strong>{project.timeline}</strong></div></div>
      <p className="case-premise">{project.premise}</p>
      <div className="tldr">{project.tldr.map(item => <p key={item}>{item}</p>)}</div>
      {project.hero && <div className="hero-media"><Image src={project.hero} alt="" fill priority sizes="100vw" /></div>}
    </section>
    <nav className="case-index" aria-label="Case study index">{project.chapters.map(chapter => <Link key={chapter.number} href={`#chapter-${chapter.number}`}><span>{chapter.number}</span><strong>{chapter.title}</strong></Link>)}</nav>
    {project.chapters.map(chapter => <section className="chapter" id={`chapter-${chapter.number}`} key={chapter.number}>
      <header className="chapter-header"><span>{chapter.number}</span><div><p>{chapter.title}</p><h2>{chapter.thesis}</h2></div></header>
      {chapter.sections.map((section, sectionIndex) => <article className="case-section" key={`${section.title}-${sectionIndex}`}>
        <div className="section-copy">{section.eyebrow && <p className="eyebrow">{section.eyebrow}</p>}<h3>{section.title}</h3>{section.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
        {section.points && <div className="point-grid">{section.points.map(([label, value]) => <div key={`${label}-${value}`}><span>{label}</span><p>{value}</p></div>)}</div>}
        {section.metrics && <div className="metrics">{section.metrics.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>}
        {section.media && <div className="case-media"><Image src={section.media} alt="" fill sizes="(max-width: 800px) 100vw, 80vw" /></div>}
        {section.video && <video className="case-video" src={section.video} autoPlay muted loop playsInline controls />}
      </article>)}
    </section>)}
    <nav className="project-pagination"><Link href={`/projects/${previous.slug}`}><span>Previous project</span><strong>{previous.shortTitle}</strong></Link><Link href={`/projects/${next.slug}`}><span>Next project</span><strong>{next.shortTitle}</strong></Link></nav>
  </main>
}
