"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

/**
 * Shared scroll motion for the home and every case study, in the same language as Seamline:
 * blocks rise in, lists stagger, numbers count up, section headings write themselves.
 * Only touches content below the first screen, never elements another motion system owns.
 */
const BLOCKS = "main section > header, main section > article, main section > figure, main section > blockquote, main section > div, main section > ol, main section > ul, main section > h2, main section > p"
const LISTS = "ol > li, ul > li, [role=row]"
const NUMBER = /^[^\d]{0,2}\d[\d.,]*\s?[%×xBkKM+]?(\s?→\s?[\d.,<]+)?$/

function owned(el: Element) {
  return !!el.closest("[style*='opacity'], nav, .site-header, footer, .agent-shell, .seamline-story, .hero-reel, .editorial-preview-hero")
}

function splitWords(el: HTMLElement) {
  if (el.dataset.words || el.children.length) return
  const text = el.textContent ?? ""
  el.dataset.words = "1"
  el.setAttribute("aria-label", text)
  el.textContent = ""
  let i = 0
  for (const w of text.split(/(\s+)/)) {
    if (/^\s+$/.test(w)) { el.append(w); continue }
    const span = document.createElement("span")
    span.className = "sm-word"
    span.setAttribute("aria-hidden", "true")
    span.style.setProperty("--w", String(i++))
    span.textContent = w
    el.append(span)
  }
}

function countUp(el: HTMLElement) {
  const text = (el.textContent ?? "").trim()
  if (el.dataset.counted || !NUMBER.test(text)) return
  const m = text.match(/^(\D*)([\d.,]+)(.*)$/)
  if (!m) return
  el.dataset.counted = "1"
  const [, pre, num, post] = m
  const target = Number(num.replace(/,/g, ""))
  if (!Number.isFinite(target) || target === 0) return
  const decimals = num.includes(".") ? num.split(".")[1].length : 0
  const start = performance.now()
  const frame = (now: number) => {
    const t = Math.min(1, (now - start) / 1000)
    const v = target * (1 - Math.pow(1 - t, 3))
    el.textContent = pre + (decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString("en")) + post
    if (t < 1) requestAnimationFrame(frame); else el.textContent = text
  }
  requestAnimationFrame(frame)
}

export function SiteMotion() {
  const pathname = usePathname()
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const main = document.querySelector("main")
    if (!main || main.classList.contains("seamline-story")) return
    const fold = window.innerHeight * .92
    let io: IntersectionObserver | null = null
    const timer = window.setTimeout(() => {
      const below = (el: Element) => el.getBoundingClientRect().top > fold
      const blocks = Array.from(main.querySelectorAll<HTMLElement>(BLOCKS)).filter(el => !owned(el) && below(el) && el.offsetHeight < window.innerHeight * 2.2 && !el.closest(".sm-reveal"))
      blocks.forEach(el => {
        el.classList.add("sm-reveal")
        const items = Array.from(el.querySelectorAll<HTMLElement>(LISTS)).filter(li => !owned(li))
        if (items.length >= 2 && items.length <= 14) items.forEach((li, i) => { li.style.setProperty("--i", String(i)); li.classList.add("sm-stagger") })
        el.querySelectorAll<HTMLElement>("h2").forEach(h => { if (!h.classList.contains("scramble-heading")) splitWords(h) })
        if (el.tagName === "H2") splitWords(el)
      })
      main.classList.add("sm-ready")
      io = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          el.classList.add("is-in")
          el.querySelectorAll<HTMLElement>("strong, b, .metric, dt, [class*=stat] span:first-child").forEach(n => { if (n.children.length === 0) countUp(n) })
          io?.unobserve(el)
        }
      }, { rootMargin: "0px 0px -10% 0px", threshold: .08 })
      blocks.forEach(el => io!.observe(el))
    }, 350)
    return () => { window.clearTimeout(timer); io?.disconnect() }
  }, [pathname])
  return null
}
