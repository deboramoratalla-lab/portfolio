import Image from "next/image"
import { ProjectCard } from "@/components/project-card"
import { ToolShowcase } from "@/components/tool-showcase"
import { HeroIntro } from "@/components/hero-intro"
import { projects } from "@/data/projects"
import { EarlierGrid, MethodList, MotionAbout, MotionSectionTitle, RevealStatement } from "@/components/home-motion"

const methods = [
  ["I start by asking why", "I rarely take a brief at face value. I pull at the loose threads — what people are actually trying to do, what the business needs and what the system can support — until the problem feels honest.", "Questions first", "/media/asking-why-concept.png"],
  ["I put the awkward decisions on the table", "Trade-offs do not disappear because nobody names them. I make them visible early, including the ideas I would rather not ship.", "Trade-offs", "/media/how-i-work-tradeoffs.png"],
  ["I don’t disappear into Figma", "I work best with Product and Engineering in the room. I share unfinished thinking, invite constraints early and leave behind decisions the team can use without me.", "Working in the open", "/media/how-i-work-collaboration.png"],
  ["I automate the boring parts, not the thinking", "I use systems and AI for repetitive work: exploring options, checking patterns and speeding up execution. The judgment stays human.", "Systems · AI", "/media/how-i-work-automation.png"],
]

export default function Home() {
  return <main id="top">
    <HeroIntro />
    <section className="about section" id="about"><MotionSectionTitle title="About" number="01"/><MotionAbout><div className="portrait"><Image src="/media/y6pNO70rr4PZo0E8r6ULmhFEeA.png" alt="Debora Moratalla" fill sizes="(max-width: 800px) 100vw, 38vw" /></div><div><p className="large-copy">I&apos;m happiest in the messy middle — when a product is growing, the workflows are tangled and the obvious answer is probably too simple.</p><p>I&apos;m a senior product designer working across complex products, design systems and AI-assisted experiences. I&apos;ve moved through brand, product, systems and code, so I&apos;m comfortable translating between users, business and engineering. I ask the awkward questions early, make trade-offs visible and leave teams with more than polished screens: clearer decisions and foundations they can keep building on.</p></div></MotionAbout></section>
    <section className="work section" id="work"><MotionSectionTitle title="Selected work" number="02"/><div className="project-stack">{projects.map((project, index) => <ProjectCard project={project} index={index} key={project.slug} />)}</div></section>
    <section className="practice section" id="practice"><MotionSectionTitle title="How I work" number="03"/><MethodList methods={methods}/><RevealStatement lines={["Systems before screens.", "Judgment before automation."]}/><p className="practice-close">I am most useful before the answer is obvious: asking the awkward question, turning messy constraints into something the team can act on, and staying close enough to engineering to see the idea through.</p></section>
    <section className="tools section" id="tools"><MotionSectionTitle title="Tools" number="04"/><ToolShowcase /></section>
    <section className="earlier section"><MotionSectionTitle title="Earlier work" number="05"/><EarlierGrid items={[
      ["AccessIA","Accessibility · AI concept","https://medium.com/design-bootcamp/accessia-the-future-of-ux-accessibility-045d83fd1d56","/media/8YnggG8NPTylEcj2U9q9XLUao.jpg"],
      ["Moofi","Product design · Fintech","/projects/moofi","/media/t9F0HSYsx4KaPvb297n67QHfMFM.png"],
      ["Mi Yo Digital","Service design · Digital identity","https://medium.com/@debora.moratalla/miyodigital-promoting-a-safer-digital-identity-fea48d136f52","/media/Z1eHxuo4nM04jAwcN71PPFZs5Q.png"],
      ["Nomaia","Product strategy · Wellbeing","https://medium.com/@debora.moratalla/redefining-digital-workers-wellbeing-through-slow-living-with-lean-ux-01f97640bde6","/media/6mDeNp7oYgeyBEgSpGaidPGOtSc.png"],
      ["Valeria","Product design · Concept","#","/media/26EnvWlBBg207dThkXKLU4gCds.jpg"],
    ].map(([name,label,href,image]) => ({name,label,href,image}))}/></section>
  </main>
}
