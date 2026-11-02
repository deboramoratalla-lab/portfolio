"use client"

import { FormEvent, useCallback, useEffect, useRef, useState } from "react"
import { ArrowUpRight } from "@/components/arrow-up-right"
import { ArrowRouteLink } from "@/components/ui-links"

import { usePathname } from "next/navigation"
import { answerQuestion, pageQuestions, roles, starters, type AgentAnswer } from "@/data/portfolio-agent-content"

export function PortfolioAgent() {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState<AgentAnswer | null>(null)
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<string | null>(null)
  const pathname = usePathname()
  const pageSet = pageQuestions[pathname ?? ""]
  const activeRole = roles.find(item => item.id === role)
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const openDialog = useCallback(() => {
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setOpen(true)
  }, [])
  const closeDialog = useCallback(() => {
    setOpen(false)
    window.requestAnimationFrame(() => returnFocusRef.current?.focus())
  }, [])
  const ask = useCallback(async (value: string) => {
    const fallback = answerQuestion(value)
    setQuestion(value)
    setAnswer(null)
    setLoading(true)
    try {
      const response = await fetch("/api/portfolio-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: value, mode: "free" }),
      })
      if (!response.ok) return
      const data = await response.json() as { answer?: AgentAnswer; configured?: boolean }
      if (data.answer?.title && data.answer?.body && data.configured) setAnswer({ ...data.answer, source: "ai", followUps: fallback.followUps })
      else setAnswer(fallback)
    } catch {
      setAnswer(fallback)
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => {
    const show = (event: Event) => {
      openDialog()
      const prompt = (event as CustomEvent<string>).detail
      if (prompt) ask(prompt)
    }
    window.addEventListener("open-portfolio-agent", show)
    return () => window.removeEventListener("open-portfolio-agent", show)
  }, [ask, openDialog])
  useEffect(() => {
    if (!open) return
    const focusDialog = window.setTimeout(() => inputRef.current?.focus(), 180)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        closeDialog()
        return
      }
      if (event.key !== "Tab" || !dialogRef.current) return
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])"))
      const first = focusable[0]
      const last = focusable.at(-1)
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => {
      window.clearTimeout(focusDialog)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [closeDialog, open])
  const submit = (event: FormEvent) => { event.preventDefault(); if (question.trim()) ask(question.trim()) }

  return <>
    {!open && <div className="agent-entry is-visible">
      <button className="agent-trigger" onClick={openDialog} aria-label="Open the portfolio guide">
        <span className="agent-spark" aria-hidden="true">✦</span>
        Ask about my work
      </button>
    </div>}
    {open && <div ref={dialogRef} className="agent-shell" role="dialog" aria-modal="true" aria-labelledby="portfolio-agent-title">
      <button className="agent-backdrop" aria-label="Close the portfolio guide" onClick={closeDialog} tabIndex={-1} />
      <aside className="agent-panel">
        <header><div><span>AI guide</span><strong id="portfolio-agent-title">Ask about Debora</strong></div><button className="agent-close-action ui-action ui-action-secondary" onClick={closeDialog} aria-label="Close"><span className="agent-close-icon" aria-hidden="true">×</span> Close</button></header>
        <div className="agent-body">{loading ? <div className="agent-thinking" aria-live="polite"><span>Looking through her work</span><i /><i /><i /></div> : !answer ? <div className="agent-intro">
          <p>Hi. I&apos;m a guide to Debora&apos;s work. Ask me anything about her, or start here.</p>
          <div className="agent-starters">{starters.map(item => <button key={item.label} onClick={() => ask(item.label)}><strong>{item.label}</strong><span>{item.hint}</span></button>)}</div>
          {pageSet && <section className="agent-group"><h3>{pageSet.label}</h3><div>{pageSet.questions.map(prompt => <button key={prompt} onClick={() => ask(prompt)}>{prompt}</button>)}</div></section>}
          <section className="agent-group"><h3>Hiring? Pick the role</h3><div className="agent-roles" role="group" aria-label="Role you are hiring for">{roles.map(item => <button key={item.id} aria-pressed={role === item.id} onClick={() => setRole(role === item.id ? null : item.id)}>{item.label}</button>)}</div>
            {activeRole && <div>{activeRole.questions.map(prompt => <button key={prompt} onClick={() => ask(prompt)}>{prompt}</button>)}</div>}
          </section>
        </div> : <div className="agent-answer" aria-live="polite">
          <span>{answer.source === "ai" ? "AI answer · from her published work" : "From her published work"}</span>
          <h2>{answer.title}</h2>
          {answer.points ? <ul className="agent-points">{answer.points.map(point => <li key={point}>{point}</li>)}</ul> : answer.body && <p>{answer.body}</p>}
          {answer.limitation && <p className="agent-limitation"><strong>Not proven yet</strong>{answer.limitation}</p>}
          {answer.evidence.length > 0 && <nav aria-label="See it in the work">{answer.evidence.map(item => <ArrowRouteLink variant="secondary" tone="purple" key={item.label} href={item.href} onClick={closeDialog}>{item.label}</ArrowRouteLink>)}</nav>}
          {(answer.followUps ?? []).length > 0 && <section className="agent-group agent-next"><h3>Ask next</h3><div>{answer.followUps!.map(prompt => <button key={prompt} onClick={() => ask(prompt)}>{prompt}</button>)}</div></section>}
          <button className="agent-restart" onClick={() => { setAnswer(null); setQuestion("") }}>← Start over</button>
        </div>}</div>
        <form onSubmit={submit}><input ref={inputRef} value={question} onChange={event => setQuestion(event.target.value)} placeholder="Ask about Debora or her work" aria-label="Question about Debora's portfolio" /><button type="submit" aria-label="Ask"><ArrowUpRight /></button></form>
        <footer>AI guide · answers from her published work and CV. If it isn&apos;t there, it says so.</footer>
      </aside>
    </div>}
  </>
}
