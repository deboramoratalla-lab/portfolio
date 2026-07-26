"use client"

import { useEffect, useRef, useState } from "react"

const groups = [
  { label: "Design & systems", tools: [{ name: "Figma", icon: "figma", color: "#a259ff", detail: "Interfaces, systems and collaborative definition" }, { name: "FigJam", icon: "figma", color: "#f24e1e", detail: "Mapping complexity before drawing screens" }, { name: "Storybook", icon: "storybook", color: "#ff4785", detail: "Component behaviour made visible and testable" }, { name: "Supernova", icon: "storybook", color: "#6c5ce7", detail: "Tokens and documentation across platforms" }] },
  { label: "Build & prototype", tools: [{ name: "Framer", icon: "framer", color: "#f4f4f0", detail: "High-fidelity product stories and live prototypes" }, { name: "React", icon: "react", color: "#61dafb", detail: "Production-aware component prototyping" }, { name: "HTML / CSS", icon: "html5", color: "#e34f26", detail: "The material underneath every interface" }, { name: "GitHub", icon: "github", color: "#f0f0ec", detail: "Design work connected to code and delivery" }, { name: "Vercel", icon: "vercel", color: "#ffffff", detail: "Fast deployment for experiments and agents" }] },
  { label: "AI workflows", tools: [{ name: "Codex", icon: "openai", color: "#10a37f", detail: "From design intent to working implementation" }, { name: "Claude", icon: "anthropic", color: "#d97757", detail: "Reasoning, critique and structured synthesis" }, { name: "Cursor", icon: "cursor", color: "#8b8bff", detail: "Code iteration inside the product workflow" }, { name: "v0", fallback: "▲", color: "#f4f4f0", detail: "Rapid interface exploration with real code" }] },
  { label: "Research & delivery", tools: [{ name: "Hotjar", fallback: "↗", color: "#fd3a5c", detail: "Behavioural signals beyond stated intent" }, { name: "Maze", icon: "maze", color: "#9b6cff", detail: "Prototype validation and task evidence" }, { name: "Looker", fallback: "◌", color: "#4285f4", detail: "Product decisions grounded in data" }, { name: "Linear", icon: "linear", color: "#5e6ad2", detail: "Clear handoff, scope and delivery rhythm" }, { name: "Notion", icon: "notion", color: "#f4f4f0", detail: "Decision records that teams can reuse" }] },
]

const tools = groups.flatMap(group => group.tools.map(tool => ({ ...tool, group: group.label })))

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
    <h3 className="tool-heading"><span>Tools change.</span><span>Judgment compounds.</span></h3>
    <div className="tool-groups">
      {groups.map((group, groupIndex) => <div className="tool-group" key={group.label}>
        <p><span>0{groupIndex + 1}</span> · {group.label}</p>
        <div className="tool-pills">{group.tools.map(tool => {
          const index = tools.findIndex(item => item.name === tool.name)
          return <button type="button" aria-label={`${tool.name}: ${tool.detail}`} key={tool.name} data-index={index} style={{ "--pill-color": tool.color } as React.CSSProperties} ref={el => { rows.current[index] = el }} className={active === index ? "is-active" : ""} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}>
            {"icon" in tool && tool.icon ? <img src={`/tools/${tool.icon}.svg`} alt="" /> : <i>{tool.fallback}</i>}<span>{tool.name}</span>
          </button>
        })}</div>
      </div>)}
    </div>
    <div className={`tool-stage ${selected ? "is-active" : ""}`} style={{ "--tool-color": selected?.color ?? "#777777" } as React.CSSProperties} aria-hidden="true">
      <p>Explore the stack</p>
      <strong>{selected ? selected.name : "Hover to explore"}</strong>
      <span>{selected ? selected.detail : "Tools change. The way I use them matters more."}</span>
      <div className={`tool-constellation ${selected ? "is-active" : ""}`}>{Array.from({ length: 10 }, (_, index) => <i key={index} />)}</div>
      <div className={`tool-logo ${selected ? "is-active" : ""}`}>{selected && ("icon" in selected && selected.icon ? <img key={selected.icon} src={`/tools/${selected.icon}.svg`} alt="" /> : <i>{selected.fallback}</i>)}</div>
    </div>
  </div>
}
