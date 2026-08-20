"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLink } from "@/components/ui-links"

type Role = {
  id: string
  role: string
  company: string
  period: string
  scope?: string
  details: string[]
}

export function ExperienceMap({ roles }: { roles: Role[] }) {
  const timelineRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timeline = timelineRef.current
    if (!timeline) return

    const entries = Array.from(
      timeline.querySelectorAll<HTMLElement>("[data-career-entry]"),
    )

    const update = () => {
      const focusLine = window.innerHeight * 0.48
      let next = 0
      let closest = Number.POSITIVE_INFINITY

      entries.forEach((entry, index) => {
        const rect = entry.getBoundingClientRect()
        const distance = Math.abs(rect.top + Math.min(rect.height * 0.36, 104) - focusLine)
        if (distance < closest) {
          closest = distance
          next = index
        }
      })

      setActive(next)
    }

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    update()

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [roles.length])

  return (
    <section className="career-log">
      <aside className="career-log__intro">
        <span className="career-log__eyebrow">CAREER CHANGELOG</span>
        <h3>The work behind<br />the practice.</h3>
        <ArrowLink
          className="career-log__link"
          variant="primary"
          tone="purple"
          href="https://www.linkedin.com/in/deboramoratallamartin/"
          target="_blank"
          rel="noreferrer"
        >
          View LinkedIn
        </ArrowLink>
        <p>A record of the products, systems and decisions that shaped the practice.</p>
      </aside>

      <div className="career-log__timeline" ref={timelineRef}>
        {roles.map((item, index) => (
          <article
            className={`career-log__entry ${active === index ? "is-active" : ""}`}
            data-career-entry
            key={item.id}
          >
            <time className="career-log__date">{item.period}</time>
            <span className={`career-log__icon ${index === 0 ? "career-log__icon--code" : ""}`} aria-hidden="true">
              {index === 0 ? "</>" : index % 3 === 1 ? "✦" : "⌁"}
            </span>
            <div className="career-log__content">
              <h4>{item.role}</h4>
              <p className="career-log__company">{item.company}</p>
              {item.scope && <p className="career-log__scope"><span>Scope</span>{item.scope}</p>}
              <ul>
                {item.details.map((detail) => (
                  <li key={detail}><b aria-hidden="true">&gt;</b><span>{detail}</span></li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
