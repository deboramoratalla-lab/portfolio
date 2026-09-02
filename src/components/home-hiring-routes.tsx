"use client"

const routes = [
  ["What decision changed the product?", "Show me the product decision with the most downstream impact"],
  ["How did the system become real?", "Trace a design system from audit to code"],
  ["What was tested in code?", "Show me a prototype that became a working product"],
]

export function HomePortfolioGuide() {
  function openRoute(prompt: string) {
    window.dispatchEvent(new CustomEvent("open-portfolio-agent", { detail: prompt }))
  }

  return (
    <section className="hiring-routes" aria-labelledby="hiring-routes-title">
      <div className="hiring-routes__intro">
        <p id="hiring-routes-title">A way in</p>
        <span>Ask Debora connects a question to the case, chapter and decision that answer it.</span>
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
