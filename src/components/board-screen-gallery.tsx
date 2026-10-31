"use client"

import Image from "next/image"
import { useState } from "react"

const screens = [
  ["Choose a role", "Enter the cycle with the responsibilities and visibility of the person doing the work.", "/media/board-guide-01-role.png"],
  ["Recover context", "See priorities, ownership and the state of the annual plan before navigating deeper.", "/media/board-guide-02-home.png"],
  ["Read the cycle", "Understand the active phase and how the work connects across the planning workflow.", "/media/board-guide-03-cycle.png"],
  ["Open the task", "Bring the action, owner, dependency and downstream consequence into one view.", "/media/board-guide-04-task.png"],
  ["Complete the handoff", "Submit the work and expose its new state to the next responsible role.", "/media/board-guide-05-submit.png"],
  ["Confirm progress", "Show approval as a change to the shared cycle, not only a local success message.", "/media/board-guide-06-approved.png"],
] as const

export function BoardScreenGallery() {
  const [selected, setSelected] = useState(0)
  const [title, description, src] = screens[selected]

  return <div className="board-gallery">
    <div className="board-gallery__steps" role="group" aria-label="Explore the six workflow steps">
      {screens.map(([label], index) => <button key={label} type="button" aria-pressed={selected === index} aria-controls="board-gallery-screen" onClick={() => setSelected(index)}>
        <span>{String(index + 1).padStart(2, "0")}</span>{label}
      </button>)}
    </div>
    <figure className="board-gallery__figure" id="board-gallery-screen">
      <a className="board-gallery__image" href={src} target="_blank" rel="noreferrer" aria-label={`Open ${title.toLowerCase()} at full size (new tab)`}>
        <Image key={src} src={src} alt={`${title} screen in the Board workflow prototype`} width={1440} height={900} sizes="(max-width: 800px) 100vw, 92vw" />
        <span className="board-gallery__expand">View full size ↗</span>
      </a>
      <figcaption>
        <div aria-live="polite" aria-atomic="true"><span>{String(selected + 1).padStart(2, "0")} / 06</span><h3>{title}</h3><p>{description}</p></div>
        <div className="board-gallery__controls">
          <button type="button" aria-label="Previous workflow screen" disabled={selected === 0} onClick={() => setSelected(selected - 1)}>←</button>
          <button type="button" aria-label="Next workflow screen" disabled={selected === screens.length - 1} onClick={() => setSelected(selected + 1)}>→</button>
        </div>
      </figcaption>
    </figure>
  </div>
}
