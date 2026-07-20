import type { Metadata } from "next"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  metadataBase: new URL("https://deboramoratalla.com"),
  title: { default: "Debora Moratalla — Senior Product Designer", template: "%s — Debora Moratalla" },
  description: "Senior Product Designer turning complex workflows into clear product decisions, scalable systems and responsible AI experiences.",
  openGraph: { title: "Debora Moratalla — Senior Product Designer", description: "Complex products. Clear decisions. Systems that scale.", url: "https://deboramoratalla.com", siteName: "Debora Moratalla", type: "website" },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteHeader />{children}<SiteFooter /></body></html>
}
