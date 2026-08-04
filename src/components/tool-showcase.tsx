"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react"

const groups = [
  { label: "Design & systems", tools: [{ name: "Figma", icon: "figma", color: "#a259ff", detail: "Interfaces, systems and collaborative definition" }, { name: "Storybook", icon: "storybook", color: "#ff4785", detail: "Component behaviour made visible and testable" }, { name: "Supernova", icon: "supernova", color: "#6c5ce7", detail: "Tokens and documentation across platforms" }] },
  { label: "Build & prototype", tools: [{ name: "Framer", icon: "framer", color: "#f4f4f0", detail: "High-fidelity product stories and live prototypes" }, { name: "React", icon: "react", color: "#61dafb", detail: "Production-aware component prototyping" }, { name: "Next.js", icon: "nextjs", color: "#ffffff", detail: "Production-ready web applications and portfolio experiences" }, { name: "TypeScript", icon: "typescript", color: "#3178c6", detail: "Reliable interfaces and maintainable front-end systems" }, { name: "HTML / CSS", icon: "html5", color: "#e34f26", detail: "The material underneath every interface" }, { name: "GitHub", icon: "github", color: "#f0f0ec", detail: "Design work connected to code and delivery" }, { name: "Vercel", icon: "vercel", color: "#ffffff", detail: "Fast deployment for experiments and agents" }] },
  { label: "AI workflows", tools: [{ name: "Claude", icon: "anthropic", color: "#d97757", detail: "Reasoning, critique and structured synthesis" }, { name: "Cursor", icon: "cursor", color: "#8b8bff", detail: "Code iteration inside the product workflow" }, { name: "v0", icon: "v0", color: "#f4f4f0", detail: "Rapid interface exploration with real code" }] },
  { label: "Research & delivery", tools: [{ name: "Hotjar", icon: "hotjar", color: "#fd3a5c", detail: "Behavioural signals beyond stated intent" }, { name: "Maze", icon: "maze", color: "#9b6cff", detail: "Prototype validation and task evidence" }, { name: "Looker", icon: "looker", color: "#4285f4", detail: "Product decisions grounded in data" }, { name: "Linear", icon: "linear", color: "#5e6ad2", detail: "Clear handoff, scope and delivery rhythm" }, { name: "Notion", icon: "notion", color: "#f4f4f0", detail: "Decision records that teams can reuse" }] },
  { label: "Automations", tools: [{ name: "n8n", icon: "n8n", color: "#ea4b71", detail: "Connected workflows and agentic automation" }, { name: "Make", icon: "make", color: "#6d00cc", detail: "Visual automation across products and services" }, { name: "Zapier", icon: "zapier", color: "#ff4f00", detail: "Fast operational workflows between everyday tools" }] },
]

const tools = groups.flatMap(group => group.tools.map(tool => ({ ...tool, group: group.label })))

export function ToolShowcase() {
  const [active, setActive] = useState<number | null>(null)
  const rows = useRef<Array<HTMLButtonElement | null>>([])
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const previewX = useSpring(pointerX, { stiffness: 300, damping: 28, mass: .45 })
  const previewY = useSpring(pointerY, { stiffness: 300, damping: 28, mass: .45 })

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

  const followPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerX.set(Math.min(event.clientX + 22, window.innerWidth - 112))
    pointerY.set(Math.max(88, Math.min(event.clientY - 40, window.innerHeight - 120)))
  }

  return <div className="tool-showcase" onPointerMove={followPointer} onMouseLeave={() => setActive(null)}>
    <aside className="tool-philosophy">
      <p className="tool-manifesto-lead">I&apos;ve lost count of how many tools I was told would change everything.</p>
      <div>
        <p>Some did, for a while. Most became another tab, another subscription, another thing to keep up with.</p>
        <p>I like new tools. I like the small thrill of making something move faster than it did yesterday. But speed has a way of making the wrong answer look convincing.</p>
        <p>So I try to stay attached to the human part: the awkward conversation, the half-formed idea shared too early, the moment someone says “I don&apos;t understand” and changes the direction of the work.</p>
        <p>I use AI, systems and code to remove repetition — not responsibility. A tool can help me see more options. It cannot decide what deserves to exist.</p>
      </div>
    </aside>
    <div className="tool-groups">
      {groups.map((group, groupIndex) => <div className="tool-group" key={group.label}>
        <p><span>0{groupIndex + 1}</span> · {group.label}</p>
        <div className="tool-pills">{group.tools.map(tool => {
          const index = tools.findIndex(item => item.name === tool.name)
          return <button type="button" aria-label={`${tool.name}: ${tool.detail}`} key={tool.name} data-index={index} style={{ "--pill-color": tool.color } as React.CSSProperties} ref={el => { rows.current[index] = el }} className={active === index ? "is-active" : ""} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}>
            <img src={`/tools/${tool.icon}.svg`} alt="" /><span>{tool.name}</span>
          </button>
        })}</div>
      </div>)}
    </div>
    <AnimatePresence>{selected && <motion.div key={selected.name} className="tool-float" style={{ x: previewX, y: previewY, "--tool-color": selected.color } as unknown as React.CSSProperties} initial={{ opacity: 0, scale: .6, rotate: -12 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: .7, rotate: 8 }} transition={{ duration: .28, ease: [0.16,1,0.3,1] }} aria-hidden="true">
      <div><img src={`/tools/${selected.icon}.svg`} alt="" /></div>
    </motion.div>}</AnimatePresence>
  </div>
}
