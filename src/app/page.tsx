import Image from "next/image"
import { ProjectCard } from "@/components/project-card"
import { ToolShowcase } from "@/components/tool-showcase"
import { projects } from "@/data/projects"

const methods = [
  ["I start by asking why", "I rarely take a brief at face value. I pull at the loose threads — what people are actually trying to do, what the business needs and what the system can support — until the problem feels honest.", "Questions first"],
  ["I put the awkward decisions on the table", "Trade-offs do not disappear because nobody names them. I make them visible early, including the ideas I would rather not ship.", "Trade-offs"],
  ["I don’t disappear into Figma", "I work best with Product and Engineering in the room. I share unfinished thinking, invite constraints early and leave behind decisions the team can use without me.", "Working in the open"],
  ["I automate the boring parts, not the thinking", "I use systems and AI for repetitive work: exploring options, checking patterns and speeding up execution. The judgment stays human.", "Systems · AI"],
]

export default function Home() {
  return <main id="top">
    <section className="home-hero"><div className="hero-words"><span>Clarity.</span><span>Structure.</span><span>Systems.</span></div><p>I design complex products and the systems behind them — turning ambiguous workflows into clear product decisions, scalable foundations and responsible AI.</p><video src="/media/ZOeDI7fC0g8dMMaYluHtSKEnHe0.mp4" autoPlay muted loop playsInline /></section>
    <section className="about section" id="about"><header className="section-title"><h2>About</h2><sup>01</sup></header><div className="about-grid"><div className="portrait"><Image src="/media/y6pNO70rr4PZo0E8r6ULmhFEeA.png" alt="Debora Moratalla" fill sizes="(max-width: 800px) 100vw, 38vw" /></div><div><p className="large-copy">I&apos;ve always been more interested in the system than the screen.</p><p>My multidisciplinary path has moved through brand, product, design systems and code. That range helps me see the relationships between decisions — and make complex products easier for teams to build and people to use.</p></div></div></section>
    <section className="work section" id="work"><header className="section-title"><h2>Selected work</h2><sup>02</sup></header><div className="project-stack">{projects.map((project, index) => <ProjectCard project={project} index={index} key={project.slug} />)}</div></section>
    <section className="practice section" id="practice"><header className="section-title"><h2>How I work</h2><sup>03</sup></header><div className="method-list">{methods.map(([title, copy, tag]) => <article key={title}><h3>{title}</h3><div><p>{copy}</p><span>{tag}</span></div></article>)}</div><blockquote>Systems before screens.<br/>Judgment before automation.</blockquote><p className="practice-close">I am most useful before the answer is obvious: asking the awkward question, turning messy constraints into something the team can act on, and staying close enough to engineering to see the idea through.</p></section>
    <section className="tools section" id="tools"><header className="section-title"><h2>Tools</h2><sup>04</sup></header><p className="large-copy">Tools change. Judgment compounds.</p><ToolShowcase /></section>
    <section className="earlier section"><header className="section-title"><h2>Earlier work</h2><sup>05</sup></header><p>Selected experiments and earlier product work — useful evidence of how my practice evolved.</p><div className="earlier-list">{[["AccessIA","Accessibility · AI concept","https://medium.com/design-bootcamp/accessia-the-future-of-ux-accessibility-045d83fd1d56"],["Moofi","Product design · Fintech","/projects/moofi"],["Mi Yo Digital","Service design · Digital identity","https://medium.com/@debora.moratalla/miyodigital-promoting-a-safer-digital-identity-fea48d136f52"],["Nomaia","Product strategy · Wellbeing","https://medium.com/@debora.moratalla/redefining-digital-workers-wellbeing-through-slow-living-with-lean-ux-01f97640bde6"]].map(([name, label, href], index) => <a href={href} key={name}><span>0{index+1}</span><strong>{name}</strong><p>{label}</p><i>↗</i></a>)}</div></section>
  </main>
}
