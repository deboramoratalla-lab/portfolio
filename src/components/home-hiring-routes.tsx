"use client"

const routes = [
  ["Product judgment", "Show me the case that proves product judgment"],
  ["Design and engineering", "How does Debora work with engineering?"],
  ["Complex enterprise", "Which project best shows enterprise product design?"],
]

export function HomeHiringRoutes() {
  function openRoute(prompt: string) {
    window.dispatchEvent(new CustomEvent("open-portfolio-agent", { detail: prompt }))
  }

  return (
    <section className="hiring-routes" aria-labelledby="hiring-routes-title">
      <div className="hiring-routes__intro">
        <p id="hiring-routes-title">For hiring teams</p>
        <span>Choose the evidence you need. Ask Debora will take you straight to the relevant work.</span>
      </div>
      <div className="hiring-routes__actions" aria-label="Portfolio routes">
        {routes.map(([label, prompt]) => (
          <button type="button" key={label} onClick={() => openRoute(prompt)}>
            <span>{label}</span>
            <b aria-hidden="true">↗</b>
          </button>
        ))}
      </div>
      <p className="hiring-routes__note">I started with spaces, images and stories. Product gave me a new material: behaviour.</p>
    </section>
  )
}
