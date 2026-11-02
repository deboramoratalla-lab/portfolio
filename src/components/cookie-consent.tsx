"use client"

import { useEffect, useState } from "react"

const KEY = "dm-analytics-consent"
type Choice = "granted" | "denied"

function update(choice: Choice) {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void }
  w.gtag?.("consent", "update", { analytics_storage: choice })
}

/** Analytics only runs after the visitor says yes. Choice is remembered on this device. */
export function CookieConsent() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    let saved: string | null = null
    try { saved = localStorage.getItem(KEY) } catch {}
    if (saved === "granted" || saved === "denied") update(saved)
    else setOpen(true)
    const reopen = () => setOpen(true)
    window.addEventListener("open-cookie-settings", reopen)
    return () => window.removeEventListener("open-cookie-settings", reopen)
  }, [])
  const choose = (choice: Choice) => {
    try { localStorage.setItem(KEY, choice) } catch {}
    update(choice)
    setOpen(false)
  }
  if (!open) return null
  return <div className="cookie-consent" role="dialog" aria-live="polite" aria-label="Analytics cookies">
    <p>I use Google Analytics to see which work people read. No ads, no tracking across sites.</p>
    <div>
      <button type="button" onClick={() => choose("denied")}>No thanks</button>
      <button type="button" className="is-primary" onClick={() => choose("granted")}>Accept</button>
    </div>
  </div>
}
