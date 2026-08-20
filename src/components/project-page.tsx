import Image from "next/image"
import Link from "next/link"
import { projects, type Project } from "@/data/projects"
import { CasePremiseReveal } from "@/components/case-premise-reveal"
import { CaseMoreWorks } from "@/components/case-more-works"
import { TapDsCase } from "@/components/tap-ds-case"
import { TapProductCase } from "@/components/tap-product-case"
import { FluxyCase } from "@/components/fluxy-case"
import { BoardCase } from "@/components/board-case"
import { CiveoCase } from "@/components/civeo-case"

function RoleArchitectureMap() {
  const roles = [
    ["Mental coach", ["Organise", "Academies, groups and coach access"], ["Define", "Values, framework and planning"], ["Supervise", "Athletes, stats and visibility"]],
    ["Coach", ["Manage", "Athletes and training groups"], ["Monitor", "Stats, profiles and visibility"], ["Guide", "Messages and training plans"]],
    ["Athlete", ["Rest day", "Morning, thoughts and mindfulness"], ["Practice day", "Prepare, practise and reflect"], ["Competition day", "Prepare, perform and recover"]]
  ] as const
  return <div className="role-map"><p>Shared entry → role-specific experience</p><div className="role-map-entry">Onboarding<small>Select profile</small></div><div className="role-map-grid">{roles.map(([role, ...steps]) => <article key={role}><h4>{role}</h4>{steps.map(([label, copy], index) => <div key={label}><span>{label}</span><p>{copy}</p>{index < steps.length - 1 && <i>↓</i>}</div>)}</article>)}</div></div>
}

export function ProjectPage({ project }: { project: Project }) {
  if (project.slug === "saas") return <BoardCase />
  if (project.slug === "tap-mindset-ds") return <TapDsCase project={project} />
  if (project.slug === "tap-mindset") return <TapProductCase project={project} />
  if (project.slug === "fluxy") return <FluxyCase project={project} />
  if (project.slug === "civeo") return <CiveoCase />
  const index = projects.findIndex(item => item.slug === project.slug)
  const previous = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]
  const closing = project.slug === "saas" ? "People don’t coordinate work through screens. They coordinate through shared understanding." : project.slug === "tap-mindset-ds" ? "The goal was never consistency. It was continuity." : project.slug === "tap-mindset" ? "A product becomes scalable when its logic is clear enough to survive the next feature." : "Good design isn’t about adding more interactions. It’s about removing the unnecessary ones."
  return <main className={`case-study case-${project.slug}`} style={{ "--accent": project.accent } as React.CSSProperties}>
    <section className="case-hero" id="top">
      <div className="case-hero-context"><span>[CASE STUDY / {String(index + 1).padStart(2, "0")}]</span><p>&gt; {project.tags[0]}</p><i aria-hidden="true" />{project.heroLink && <Link className="case-hero-link" href={project.heroLink[1]} target={project.heroLink[1].startsWith("http") ? "_blank" : undefined} rel={project.heroLink[1].startsWith("http") ? "noreferrer" : undefined}>{project.heroLink[0]} <b aria-hidden="true">↗</b></Link>}</div>
      <div className="case-title-marquee" aria-label={project.title}>
        <div className="case-title-track">
          <h1>{project.title}</h1><span aria-hidden="true">{project.title}</span><span aria-hidden="true">{project.title}</span>
        </div>
      </div>
      <div className="case-intro-grid">
        <div className="case-sidebar"><div className="case-meta">{(project.meta ?? [["Role",project.role],["Team",project.context],["Time",project.timeline]]).map(([label,value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
          <div className="tldr"><span>TL;DR</span><ul>{project.tldr.map(item => <li key={item}>{item}</li>)}</ul></div>
        </div>
        <div className="case-premise-wrap">{project.premiseLabel && <span>{project.premiseLabel}</span>}{["tap-mindset-ds", "tap-mindset"].includes(project.slug) ? <CasePremiseReveal>{project.premise}</CasePremiseReveal> : <p className="case-premise">{project.premise}</p>}{project.slug === "fluxy" && project.hero && <div className="fluxy-hero-image"><Image src={project.hero} alt="Passenger travelling through the Underground" fill sizes="280px" /></div>}{project.heroStat && <div className="hero-stat"><strong>{project.heroStat[0]}</strong><span>{project.heroStat[1]}</span></div>}</div>
      </div>
    </section>
    {project.slug === "fluxy" && <section className="fluxy-introduction">
      <div className="fluxy-premise"><p className="eyebrow">The premise</p><h2>The brief asked for a better transaction. The opportunity was to remove the need to manage commuting at all.</h2><div><p>An online top-up flow solves one moment. Commuters still have to remember their balance, compare routes, monitor disruption and recover when the network changes. The product question was not how to make one task faster, but which decisions software could responsibly take off the passenger’s plate.</p><aside><span>Core thesis</span><strong>Goals stay stable. Routes, context and recommendations can change.</strong></aside></div></div>
      <div className="fluxy-business"><p className="eyebrow">The business bet</p><h3>The opportunity was fewer failure moments, not more app engagement.</h3><p>For an operator, the value is operational: prevent low-balance failures, reduce avoidable support contacts and protect journey completion when the network changes. Success would be measured through interventions resolved before travel, recommendation acceptance and fewer payment-related disruptions — not time spent in the interface.</p></div>
    </section>}
    <div className="case-index-wrap"><span>Case study index</span>{project.slug === "fluxy" && <h2>Four decisions shaped the product.</h2>}<nav className="case-index" aria-label="Case study index">{project.chapters.map(chapter => <Link key={chapter.number} href={`#chapter-${chapter.number}`}><span>{chapter.number}</span><strong>{chapter.title}</strong></Link>)}</nav></div>
    {project.chapters.map(chapter => <section className="chapter" id={`chapter-${chapter.number}`} key={chapter.number}>
      <header className={`chapter-header tone-${chapter.tone ?? "dark"}`}><span>{chapter.number}</span><div><p>{chapter.title}</p><h2>{chapter.thesis}</h2>{chapter.summary && <p className="chapter-summary">{chapter.summary}</p>}{chapter.intro && <div className="chapter-intro"><strong>{chapter.intro[0]}</strong><p>{chapter.intro[1]}</p></div>}</div></header>
      <div className="chapter-sections">{chapter.sections.map((section, sectionIndex) => <article className={`case-section tone-${section.tone ?? "dark"} layout-${section.layout ?? "split"}`} key={`${section.title}-${sectionIndex}`}>
        <div className="case-section-inner"><div className="section-copy">{section.eyebrow && <p className="eyebrow">{section.eyebrow}</p>}<h3>{section.title}</h3>{section.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
        {section.points && <div className="point-grid">{section.points.map(([label, value]) => <div key={`${label}-${value}`}><span>{label}</span><p>{value}</p></div>)}</div>}
        {section.signals && <div className="signal-grid">{section.signals.map(([label, value]) => <div key={`${label}-${value}`}><span>{label}</span><p>{value}</p></div>)}</div>}
        {section.roleMap && <RoleArchitectureMap />}
        {section.metrics && <div className="metrics">{section.metrics.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>}
        {section.media && <div className="case-media"><Image src={section.media} alt="" fill sizes="(max-width: 800px) 100vw, 80vw" /></div>}
        {section.video && <video className="case-video" src={section.video} autoPlay muted loop playsInline />}
        {section.embed && <iframe className="case-embed" src={section.embed} title={section.title} />}
        {section.caption && <p className="case-caption">{section.caption}</p>}
        {section.statement && <p className="section-statement">{section.statement}</p>}
        {section.links && <div className="section-links">{section.links.map(([label, href]) => <Link href={href} key={label}>{label}</Link>)}</div>}</div>
        {section.link && <Link className="case-inline-link" href={section.link[1]}>{section.link[0]}</Link>}
      </article>)}</div>
    </section>)}
    <section className="case-closing"><span>What this was actually about</span><p>{closing}</p></section>
    <CaseMoreWorks
      previous={{ href: `/projects/${previous.slug}`, title: previous.shortTitle, description: previous.strapline }}
      next={{ href: `/projects/${next.slug}`, title: next.shortTitle, description: next.strapline }}
    />
  </main>
}
