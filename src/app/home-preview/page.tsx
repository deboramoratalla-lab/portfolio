import { EditorialPreviewHero } from "@/components/editorial-preview-hero"
import { HomePortfolioGuide } from "@/components/home-hiring-routes"
import { ProjectCard } from "@/components/project-card"
import { MethodList, MotionSectionTitle, RevealStatement } from "@/components/home-motion"
import { WorkbenchPreview } from "@/components/workbench-preview"
import { projects } from "@/data/projects"
import { labEntries } from "@/data/lab"
import { redirect } from "next/navigation"

const methods = [
  ["Model the rules", "I map roles, permissions, states, dependencies and failure paths before committing to screens.", "Before the interface", "/media/how-work/escher-cube-default-v6.png", "/media/how-work/escher-cube-hover-v6.png"],
  ["Expose the trade-offs", "I make defaults, exceptions and product judgment visible while they are still inexpensive to change.", "Before the debt", "/media/how-work/escher-pyramid-default.png", "/media/how-work/escher-pyramid-hover-v3.png"],
  ["Stay through implementation", "I bring engineering constraints into the work early and stay close enough to protect the intent as it ships.", "Before the handoff", "/media/how-work/escher-fork-default-v3.png", "/media/how-work/escher-fork-hover-v5.png"],
]

export function HomePreview() {
  return <main id="top" className="aeye-home-preview">
    <EditorialPreviewHero />
    <HomePortfolioGuide />
    <section className="work section" id="work"><MotionSectionTitle title="Selected work" number="01" statement="AI agents, design systems and enterprise workflows."/><div className="project-stack">{projects.map((project, index) => <ProjectCard project={project} index={index} key={project.slug} />)}</div></section>
    <section className="practice section" id="practice"><MotionSectionTitle title="How I work" number="02" statement="I start with the rules people are already carrying."/><MethodList methods={methods}/><p className="impossible-note"><span>{"// A NOTE ON IMPOSSIBLE OBJECTS"}</span>Complex systems rarely look impossible all at once. The contradiction appears when you follow the rules from one decision to the next. My job is to find that break before it ships.</p><RevealStatement inverse lines={["Make the logic visible.", "Keep the intent buildable."]}/></section>
    <section className="explorations section" id="lab"><MotionSectionTitle title="Lab" number="03" statement="Field notes, coded experiments and useful tools I’m building in public."/><WorkbenchPreview entries={labEntries.slice(0, 3)}/></section>
    <section className="beyond-section section" id="beyond"><MotionSectionTitle title="Beyond my own work" number="04" statement="Most of what I do well happens in other people's work."/><div className="beyond">
      <article><span>Teaching</span><h3>How seniors design with AI</h3><p>Guest speaker at Shift+R on seniority in the age of AI, and on how I built a design system with AI and what went wrong along the way.</p></article>
      <article><span>Inside teams</span><h3>Workshops at Board</h3><p>I run UX/UI practice workshops for product and engineering, so good decisions don't depend on one designer being in the room.</p></article>
      <article><span>Ways of working</span><h3>AI in the design process, with a person in charge</h3><p>At TAP I set up a weekly design and engineering review: automation prepares the work, a person approves anything that touches foundations, the API or accessibility.</p></article>
    </div></section>
    <section className="personal-note section" id="about"><MotionSectionTitle title="A note" number="05"/><div><p>Interiors, film, HR, then product. Same habit: finding the structure under things.</p><span>Today that structure is behaviour. I’m most interested in AI that knows when to act, when to wait and when to hand control back.</span></div></section>
  </main>
}

/** The preview route was only a staging address; production lives at /. */
export default function HomePreviewRedirect() {
  redirect("/")
}
