"use client"

import { useEffect, useRef, useState } from "react"

const groups = [
  { label: "Design & systems", tools: [{ name: "Figma", icon: "figma" }, { name: "FigJam", icon: "figma" }, { name: "Storybook", icon: "storybook" }, { name: "Supernova", icon: "storybook" }] },
  { label: "Build & prototype", tools: [{ name: "Framer", icon: "framer" }, { name: "React", icon: "react" }, { name: "HTML / CSS", icon: "html5" }, { name: "GitHub", icon: "github" }, { name: "Vercel", icon: "vercel" }] },
  { label: "AI & automation", tools: [{ name: "Claude", icon: "anthropic" }, { name: "Cursor", icon: "cursor" }, { name: "Codex", icon: "openai" }] },
  { label: "Research & delivery", tools: [{ name: "Maze", icon: "maze" }, { name: "Linear", icon: "linear" }, { name: "Notion", icon: "notion" }] },
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
    <div className="tool-groups">
      {groups.map((group, groupIndex) => <div className="tool-group" key={group.label}>
        <span className="tool-group-index">0{groupIndex + 1}</span><p>{group.label}</p>
        <div className="tool-pills">{group.tools.map(tool => {
          const index = tools.findIndex(item => item.name === tool.name)
          return <button type="button" key={tool.name} data-index={index} ref={el => { rows.current[index] = el }} className={active === index ? "is-active" : ""} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}>
            <img src={`/tools/${tool.icon}.svg`} alt="" /><span>{tool.name}</span>
          </button>
        })}</div>
      </div>)}
    </div>
    <div className="tool-stage" aria-hidden="true">
      <p>Explore the stack</p>
      <strong>{selected ? selected.name : "Hover to explore"}</strong>
      <span>{selected ? selected.group : "Tools change. The way I use them matters more."}</span>
      <div className={`tool-logo ${selected ? "is-active" : ""}`}>{selected && <img key={selected.icon} src={`/tools/${selected.icon}.svg`} alt="" />}</div>
    </div>
  </div>
}
