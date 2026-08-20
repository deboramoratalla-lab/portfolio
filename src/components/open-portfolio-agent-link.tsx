"use client"

import { ArrowUpRight } from "@/components/arrow-up-right"

export function OpenPortfolioAgentLink() {
  return (
    <a
      href="#portfolio-agent"
      onClick={(event) => {
        event.preventDefault()
        window.dispatchEvent(new Event("open-portfolio-agent"))
      }}
    >
      Ask the portfolio agent <ArrowUpRight />
    </a>
  )
}
