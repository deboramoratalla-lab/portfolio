"use client"

import { useEffect } from "react"

const REVEAL = [
  ".fx-chapter > header",
  ".fx-chapter > article",
  ".fx-chapter > blockquote",
].join(",")

// Children that enter one after another inside a revealed block.
const STAGGER = [
  ".fx-burden ol > li",
  ".sl-personas section",
  ".fx-agent-spine > div",
  ".fx-agent-paths > div",
  ".fx-rule-deck > li",
  ".fx-insights ol > li",
  ".sl-voice li",
  ".sl-roles [role=row]",
  ".fx-results > div:last-child > p",
  ".fx-validation-gap li",
  ".fx-reframe > *",
].join(",")

const COUNT = ".fx-burden ol li strong, .fx-results > div:last-child strong"
const WORDS = ".fx-thesis, .fx-close, .fx-agent-rule, .fx-chapter > header h2"

function splitWords(el: HTMLElement) {
  if (el.dataset.words) return
  el.dataset.words = "1"
  el.setAttribute("aria-label", el.textContent ?? "")
  const words = (el.textContent ?? "").split(/(\s+)/)
  el.textContent = ""
  let i = 0
  for (const w of words) {
    if (/^\s+$/.test(w)) { el.append(w); continue }
    const span = document.createElement("span")
    span.className = "sl-word"
    span.setAttribute("aria-hidden", "true")
    span.style.setProperty("--w", String(i++))
    span.textContent = w
    el.append(span)
  }
}

function countUp(el: HTMLElement) {
  const text = el.textContent ?? ""
  const match = text.match(/^(\D*)([\d,.]+)(.*)$/)
  if (!match || el.dataset.counted) return
  el.dataset.counted = "1"
  const [, pre, num, post] = match
  const target = Number(num.replace(/,/g, ""))
  const decimals = num.includes(".") ? num.split(".")[1].length : 0
  // "343/343": count the first number, keep the denominator fixed.
  const start = performance.now(), duration = 1100
  const frame = (now: number) => {
    const t = Math.min(1, (now - start) / duration)
    const eased = 1 - Math.pow(1 - t, 3)
    el.textContent = pre + (target * eased).toFixed(decimals) + post
    if (t < 1) requestAnimationFrame(frame)
    else el.textContent = text
  }
  requestAnimationFrame(frame)
}

export function SeamlineMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".seamline-story")
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    root.querySelectorAll<HTMLElement>(WORDS).forEach(splitWords)
    root.querySelectorAll<HTMLElement>(STAGGER).forEach(el => {
      const index = Array.prototype.indexOf.call(el.parentElement?.children ?? [], el)
      el.style.setProperty("--i", String(index))
      el.classList.add("sl-stagger")
    })
    const blocks = Array.from(root.querySelectorAll<HTMLElement>(REVEAL))
    blocks.forEach(el => el.classList.add("sl-reveal"))
    root.classList.add("sl-motion-ready")

    const io = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const el = entry.target as HTMLElement
        el.classList.add("is-in")
        el.querySelectorAll<HTMLElement>(COUNT).forEach(countUp)
        io.unobserve(el)
      }
    }, { rootMargin: "0px 0px -12% 0px", threshold: .12 })
    blocks.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
  return null
}
