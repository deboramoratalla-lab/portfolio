import Link from "next/link"

const builds = [
  ["CODE PROTOTYPE", "Fluxy agent model", "A working journey prototype for goal protection, disruption and explainable route changes.", "/projects/fluxy/agent"],
  ["COMPONENT SYSTEM", "TAP component bridge", "A coded component library, Storybook docs and Figma plugins that keep tokens inspectable.", "/projects/tap-mindset-ds"],
  ["AGENTIC EXPLORATION", "Portfolio agent", "An evidence-aware assistant that answers questions about my work, experience and CV.", "#ask-debora"],
  ["INTERACTION EXPERIMENT", "Pixels, states, timing", "Small tests around reveal, motion and responsive behaviour, kept close to the material.", "/lab"],
]

export function BuiltPreview() {
  return <div className="built-grid">
    {builds.map(([label, title, body, href], index) => <Link className="built-card" href={href} key={title}>
      <div className="built-card__top"><span>{label}</span><i>{`// 0${index + 1}`}</i></div>
      <h3>{title}</h3>
      <p>{body}</p>
      <span className="built-card__action">Explore <span aria-hidden="true">↗</span></span>
    </Link>)}
  </div>
}
