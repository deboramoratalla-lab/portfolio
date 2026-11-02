"use client"

const routes = [
  ["What does the agent decide alone?", "Show me how Seamline decides what it can fix without a person"],
  ["What decision changed the product?", "Show me the product decision with the most downstream impact"],
  ["How did the system become real?", "Trace a design system from audit to code"],
]

export function HomePortfolioGuide() {
  function openRoute(prompt: string) {
    window.dispatchEvent(new CustomEvent("open-portfolio-agent", { detail: prompt }))
  }

  return (
    <section className="hiring-routes" aria-labelledby="hiring-routes-title">
      <div className="hiring-routes__intro">
        <p id="hiring-routes-title">Start somewhere</p>
        <span>Pick a question and I’ll take you to the project, decision or prototype behind the answer.</span>
      </div>
      <div className="hiring-routes__actions" aria-label="Portfolio routes">
        {routes.map(([label, prompt]) => (
          <button type="button" key={label} onClick={() => openRoute(prompt)}>
            <span>{label}</span>
            <b aria-hidden="true">↗</b>
          </button>
        ))}
      </div>
      <p className="hiring-routes__note">Every route ends in real work: a case, a decision or a prototype you can open.</p>
    </section>
  )
}
