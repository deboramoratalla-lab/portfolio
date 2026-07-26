"use client"

import { useEffect, useRef, useState } from "react"

const groups = [
  { label: "Design & systems", tools: [{ name: "Figma", icon: "figma", detail: "Interfaces, systems and collaborative definition" }, { name: "FigJam", icon: "figma", detail: "Mapping complexity before drawing screens" }, { name: "Storybook", icon: "storybook", detail: "Component behaviour made visible and testable" }, { name: "Supernova", icon: "storybook", detail: "Tokens and documentation across platforms" }] },
  { label: "Build & prototype", tools: [{ name: "Framer", icon: "framer", detail: "High-fidelity product stories and live prototypes" }, { name: "React", icon: "react", detail: "Production-aware component prototyping" }, { name: "HTML / CSS", icon: "html5", detail: "The material underneath every interface" }, { name: "GitHub", icon: "github", detail: "Design work connected to code and delivery" }, { name: "Vercel", icon: "vercel", detail: "Fast deployment for experiments and agents" }] },
  { label: "AI workflows", tools: [{ name: "Codex", icon: "openai", detail: "From design intent to working implementation" }, { name: "Claude", icon: "anthropic", detail: "Reasoning, critique and structured synthesis" }, { name: "Cursor", icon: "cursor", detail: "Code iteration inside the product workflow" }, { name: "v0", fallback: "▲", detail: "Rapid interface exploration with real code" }] },
  { label: "Research & delivery", tools: [{ name: "Hotjar", fallback: "↗", detail: "Behavioural signals beyond stated intent" }, { name: "Maze", icon: "maze", detail: "Prototype validation and task evidence" }, { name: "Looker", fallback: "◌", detail: "Product decisions grounded in data" }, { name: "Linear", icon: "linear", detail: "Clear handoff, scope and delivery rhythm" }, { name: "Notion", icon: "notion", detail: "Decision records that teams can reuse" }] },
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
    <h3 className="tool-heading"><span>Tools change.</span><sup>04</sup><span>Judgment compounds.</span></h3>
    <div className="tool-groups">
      {groups.map((group, groupIndex) => <div className="tool-group" key={group.label}>
        <p><span>0{groupIndex + 1}</span> · {group.label}</p>
        <div className="tool-pills">{group.tools.map(tool => {
          const index = tools.findIndex(item => item.name === tool.name)
          return <button type="button" aria-label={`${tool.name}: ${tool.detail}`} key={tool.name} data-index={index} ref={el => { rows.current[index] = el }} className={active === index ? "is-active" : ""} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}>
            {"icon" in tool && tool.icon ? <img src={`/tools/${tool.icon}.svg`} alt="" /> : <i>{tool.fallback}</i>}<span>{tool.name}</span>
          </button>
        })}</div>
      </div>)}
    </div>
    <div className="tool-stage" aria-hidden="true">
      <p>Explore the stack</p>
      <strong>{selected ? selected.name : "Hover to explore"}</strong>
      <span>{selected ? selected.detail : "Tools change. The way I use them matters more."}</span>
      <div className={`tool-logo ${selected ? "is-active" : ""}`}>{selected && ("icon" in selected && selected.icon ? <img key={selected.icon} src={`/tools/${selected.icon}.svg`} alt="" /> : <i>{selected.fallback}</i>)}</div>
    </div>
  </div>
}
