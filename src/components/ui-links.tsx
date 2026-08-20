import Link, { type LinkProps } from "next/link"
import type { AnchorHTMLAttributes, ReactNode } from "react"
import { ArrowUpRight } from "@/components/arrow-up-right"

type LinkContentProps = {
  children: ReactNode
  arrow?: boolean
  variant?: "primary" | "secondary" | "plain"
  tone?: "purple" | "green"
  className?: string
}

type LinkBrand = "email" | "github" | "linkedin" | "storybook"

function linkBrand(href: unknown): LinkBrand | undefined {
  const value = typeof href === "string" ? href.toLowerCase() : ""
  if (value.startsWith("mailto:")) return "email"
  if (value.includes("linkedin.com")) return "linkedin"
  if (value.includes("github.com")) return "github"
  if (value.includes("storybook") || value.includes("github.io/design-system-showcase")) return "storybook"
}

function BrandIcon({ brand }: { brand?: LinkBrand }) {
  return brand ? <span className={`ui-brand-icon ui-brand-icon-${brand}`} aria-hidden="true" /> : null
}

function LinkLabel({ children }: { children: ReactNode }) {
  return typeof children === "string" ? children.replace(/^[↗→]\s*/, "") : children
}

function actionClassName(variant: LinkContentProps["variant"], tone: LinkContentProps["tone"], className?: string) {
  return [variant && variant !== "plain" ? `ui-action ui-action-${variant} ui-action-${tone}` : "", className].filter(Boolean).join(" ")
}

export function ArrowLink({ children, arrow = true, variant = "plain", tone = "purple", className, ...props }: LinkContentProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const showArrow = variant === "secondary" || arrow
  return <a {...props} className={actionClassName(variant, tone, className)}><BrandIcon brand={linkBrand(props.href)} /><LinkLabel>{children}</LinkLabel>{showArrow && <ArrowUpRight />}</a>
}

type ArrowRouteLinkProps = LinkContentProps & LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps | "children" | "className">

export function ArrowRouteLink({ children, arrow = true, variant = "plain", tone = "purple", className, ...props }: ArrowRouteLinkProps) {
  const showArrow = variant === "secondary" || arrow
  return <Link {...props} className={actionClassName(variant, tone, className)}><BrandIcon brand={linkBrand(props.href)} /><LinkLabel>{children}</LinkLabel>{showArrow && <ArrowUpRight />}</Link>
}
