import { EditorialPreviewHero } from "@/components/editorial-preview-hero"
import { HomeHiringRoutes } from "@/components/home-hiring-routes"
import { ProjectCard } from "@/components/project-card"
import { EarlierGrid, MethodList, MotionSectionTitle, RevealStatement } from "@/components/home-motion"
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
    <HomeHiringRoutes />
    <section className="work section" id="work"><MotionSectionTitle title="Selected work" number="01" statement="When the interface is only the visible part."/><div className="project-stack">{projects.map((project, index) => <ProjectCard project={project} index={index} key={project.slug} />)}</div></section>
    <section className="practice section" id="practice"><MotionSectionTitle title="How I work" number="02" statement="I start with the rules people are already carrying."/><MethodList methods={methods}/><p className="impossible-note"><span>{"// A NOTE ON IMPOSSIBLE OBJECTS"}</span>Complex systems rarely look impossible all at once. The contradiction appears when you follow the rules from one decision to the next. My job is to find that break before it ships.</p><RevealStatement inverse lines={["Make the logic visible.", "Keep the intent buildable."]}/></section>
    <section className="explorations section" id="lab"><MotionSectionTitle title="Lab" number="03" statement="Field notes, coded experiments and useful tools I’m building in public."/><WorkbenchPreview entries={labEntries}/></section>
    <section className="earlier section"><MotionSectionTitle title="Earlier work" number="04" statement="Earlier work, before the pattern became obvious."/><EarlierGrid items={[
      ["AccessIA","Accessibility · AI concept","https://medium.com/design-bootcamp/accessia-the-future-of-ux-accessibility-045d83fd1d56","/media/accessia-plugin-cover.png"],
      ["Moofi","Product design · Fintech","https://medium.com/@debora.moratalla/navigating-the-future-of-e-commerce-in-2030-a-design-sprint-journey-3a360d9287d8","/media/t9F0HSYsx4KaPvb297n67QHfMFM.png"],
      ["Mi Yo Digital","Service design · Digital identity","https://medium.com/@debora.moratalla/miyodigital-promoting-a-safer-digital-identity-fea48d136f52","/media/Z1eHxuo4nM04jAwcN71PPFZs5Q.png"],
      ["Nomaia","Product strategy · Wellbeing","https://medium.com/@debora.moratalla/redefining-digital-workers-wellbeing-through-slow-living-with-lean-ux-01f97640bde6","/media/6mDeNp7oYgeyBEgSpGaidPGOtSc.png"],
    ].map(([name,label,href,image]) => ({name,label,href,image}))}/></section>
    <section className="personal-note section" id="about"><MotionSectionTitle title="A note" number="05"/><div><p>That path still shapes how I work: looking for structure, noticing what is missing and making difficult ideas easier to navigate.</p><span>I’m especially interested in AI systems that know when to act, when to wait and when to hand control back.</span></div></section>
  </main>
}

/** The preview route was only a staging address; production lives at /. */
export default function HomePreviewRedirect() {
  redirect("/")
}
