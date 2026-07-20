"use client"

import { useEffect, useRef, useState } from "react"

const tools = [
  { name: "Figma", icon: "figma", use: "Product design & systems", group: "Design" },
  { name: "Storybook", icon: "storybook", use: "Coded component libraries", group: "Systems" },
  { name: "React", icon: "react", use: "Prototypes & production UI", group: "Build" },
  { name: "GitHub", icon: "github", use: "Versioned collaboration", group: "Build" },
  { name: "Vercel", icon: "vercel", use: "Shipping live prototypes", group: "Build" },
  { name: "Claude", icon: "anthropic", use: "Research & exploration", group: "AI" },
  { name: "Cursor", icon: "cursor", use: "AI-assisted implementation", group: "AI" },
  { name: "Maze", icon: "maze", use: "Prototype testing", group: "Research" },
  { name: "Linear", icon: "linear", use: "Product delivery", group: "Product" },
  { name: "Notion", icon: "notion", use: "Decisions & documentation", group: "Product" },
]

export function ToolShowcase() {
  const [active, setActive] = useState<number | null>(null)
  const rows = useRef<Array<HTMLButtonElement | null>>([])

  useEffect(() => {
    if (!window.matchMedia("(max-width: 800px)").matches) return
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index))
      }),
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 },
    )
    rows.current.forEach(row => row && observer.observe(row))
    return () => observer.disconnect()
  }, [])

  const selected = active === null ? null : tools[active]

  return <div className="tool-showcase" onMouseLeave={() => setActive(null)}>
    <div className="tool-stage" aria-hidden="true">
      <div className={`tool-orbit ${selected ? "is-active" : ""}`}>
        <span className="orbit-line orbit-one" />
        <span className="orbit-line orbit-two" />
        <span className="orbit-dot" />
        {selected && <img key={selected.icon} src={`/tools/${selected.icon}.svg`} alt="" />}
      </div>
      <p>{selected ? selected.group : "Hover to explore"}</p>
      <strong>{selected ? selected.name : "The stack changes. The way I think doesn’t."}</strong>
    </div>

    <div className="tool-list">
      {tools.map((tool, index) => <button
        type="button"
        key={tool.name}
        data-index={index}
        ref={element => { rows.current[index] = element }}
        className={active === index ? "is-active" : ""}
        onMouseEnter={() => setActive(index)}
        onFocus={() => setActive(index)}
        onClick={() => setActive(index)}
      >
        <span className="tool-index">{String(index + 1).padStart(2, "0")}</span>
        <span className="tool-name">{tool.name}</span>
        <span className="tool-use">{tool.use}</span>
        <span className="tool-arrow">↗</span>
      </button>)}
    </div>
  </div>
}
