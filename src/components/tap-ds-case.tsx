import Image from "next/image"
import type { Project } from "@/data/projects"
import { CasePremiseReveal } from "@/components/case-premise-reveal"
import { CaseMoreWorks } from "@/components/case-more-works"
import { CaseStudyIndex } from "@/components/case-study-index"
import { ArrowRouteLink } from "@/components/ui-links"

export function TapDsCase({ project }: { project: Project }) {
  return <main className="tap-ds" style={{ "--accent": project.accent } as React.CSSProperties}>
    <section className="tap-ds-hero case-hero-unified" id="top">
      <div className="tap-ds-context case-hero-kicker-unified"><span>[CASE STUDY / 02]</span><span>&gt; DESIGN SYSTEM</span><i /><span className="tap-ds-context-links">{(project.heroLinks ?? (project.heroLink ? [project.heroLink] : [])).map(([label, href], index) => <ArrowRouteLink variant="secondary" tone={index % 2 ? "green" : "purple"} href={href} target="_blank" rel="noreferrer" key={href}>{label}</ArrowRouteLink>)}</span></div>
      <h1 className="case-hero-title-unified">{project.title}</h1>
      <CasePremiseReveal>{project.premise}</CasePremiseReveal>
      <div className="tap-ds-meta case-hero-meta-unified">
        {project.meta?.slice(0,3).map(([label,value]) => <div key={label}><span>{label.replace(":","")}</span><p>{value}</p></div>)}
        <div className="tap-ds-ownership"><span>MY OWNERSHIP</span><p>{project.ownership}</p></div>
      </div>
    </section>

    <CaseStudyIndex className="tap-ds-index" chapters={project.chapters.map(chapter => [chapter.number, chapter.title] as const)} hrefForChapter={number => `#tap-${number}`} />

    {project.chapters.map(chapter => <section className="tap-ds-chapter" id={`tap-${chapter.number}`} key={chapter.number}>
      <header><p><em>[{chapter.number}.00]</em><b>&gt;</b>{chapter.title}</p><h2>{chapter.thesis}</h2><div className="tap-ds-chapter-mark" aria-hidden="true"><span>{chapter.number}</span><i /><i /><i /></div></header>
      <div className={`tap-ds-sections tap-ds-sections-${chapter.number}`}>
        {chapter.sections.map((section, index) => <article className={`tap-ds-block tap-ds-${section.layout ?? "split"} tap-ds-block-${String(index + 1).padStart(2,"0")}`} key={`${section.title}-${index}`}>
          <div className="tap-ds-copy"><span className="tap-ds-block-label"><i>[{chapter.number}.{String(index + 1).padStart(2,"0")}]</i><b>&gt;</b>{section.eyebrow ?? (chapter.number === "01" && index === 0 ? "Diagnosis" : "Evidence")}</span>{section.title && <h3>{section.title}</h3>}{section.body.map(text => <p key={text}>{text}</p>)}</div>
          {section.points && <div className="tap-ds-points">{section.points.map(([label,value]) => <div key={`${label}-${value}`}><small>{label}</small><p>{value}</p></div>)}</div>}
          {section.metrics && <div className="tap-ds-metrics">{section.metrics.map(([value,label], metricIndex) => <div key={label} className={metricIndex % 2 ? "green" : "purple"}><strong>{value}</strong><span>{label}</span></div>)}</div>}
          {section.layout === "bridge" && <div className="tap-ds-system-route" aria-label="Code to Figma workflow"><small>[ SYSTEM ROUTE ]</small><div><span><i>01</i>TS props</span><b>→</b><span><i>02</i>Catalogue</span><b>→</b><span><i>03</i>Plugin</span><b>→</b><span><i>04</i>Figma</span></div></div>}
          {section.layout === "governance" && <div className="tap-ds-release-gates" aria-label="Release gates"><small>[ RELEASE GATES ]</small><div><span><i>01</i>Token parity<b>Automated</b></span><span><i>02</i>Public API<b>Peer review</b></span><span><i>03</i>Accessibility<b>Human sign-off</b></span></div></div>}
          {section.media && <figure><Image src={section.media} alt="" fill sizes="90vw" /></figure>}
          {section.video && <div className="tap-ds-video-frame"><span className="tap-ds-plate-label">WORKING PROTOTYPE / {String(index + 1).padStart(2,"0")}</span><video src={section.video} autoPlay muted loop playsInline /></div>}
          {section.caption && <small className="tap-ds-caption">{section.caption}</small>}
          {section.link && <ArrowRouteLink variant="secondary" tone="purple" href={section.link[1]} target="_blank" rel="noreferrer">{section.link[0]}</ArrowRouteLink>}
          {section.links && <div className="tap-ds-links">{section.links.map(([label, href], linkIndex) => <ArrowRouteLink variant="secondary" tone={linkIndex % 2 ? "green" : "purple"} href={href} target="_blank" rel="noreferrer" key={href}>{label}</ArrowRouteLink>)}</div>}
        </article>)}
      </div>
    </section>)}
    <CaseMoreWorks previous={{ href:"/projects/saas",title:"Board",description:"Making workflow state visible across a €1.2B budgeting system." }} next={{ href:"/projects/tap-mindset",title:"TAP Mindset",description:"Reframing one product into three role-based experiences." }} />
  </main>
}
