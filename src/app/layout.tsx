import type { Metadata } from "next"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { InvertCursor } from "@/components/invert-cursor"
import { BackToTop } from "@/components/back-to-top"
import { PortfolioAgent } from "@/components/portfolio-agent"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  metadataBase: new URL("https://deboramoratalla.com"),
  title: { default: "Debora Moratalla — Senior Product Designer", template: "%s — Debora Moratalla" },
  description: "Senior Product Designer turning complex workflows into clear product decisions, scalable systems and responsible AI experiences.",
  alternates: { canonical: "/" },
  authors: [{ name: "Debora Moratalla", url: "https://deboramoratalla.com" }],
  creator: "Debora Moratalla",
  icons: { icon: "/media/dm-logo.png", shortcut: "/media/dm-logo.png", apple: "/media/dm-logo.png" },
  keywords: ["Senior Product Designer", "Enterprise Product Design", "Design Systems", "AI Product Design", "Design Engineering", "Product Strategy"],
  openGraph: { title: "Debora Moratalla — Senior Product Designer", description: "Complex products. Clear decisions. Systems that scale.", url: "https://deboramoratalla.com", siteName: "Debora Moratalla", locale: "en_GB", type: "website" },
  twitter: { card: "summary", title: "Debora Moratalla — Senior Product Designer", description: "Complex products. Clear decisions. Systems that scale." },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const personSchema = { "@context": "https://schema.org", "@type": "Person", name: "Debora Moratalla Martín", url: "https://deboramoratalla.com", jobTitle: "Senior Product Designer", sameAs: ["https://www.linkedin.com/in/deboramoratallamartin/"], knowsAbout: ["Enterprise Product Design", "Design Systems", "AI Product Design", "Design Engineering", "Product Strategy"] }
  return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} /><InvertCursor /><SiteHeader />{children}<SiteFooter /><PortfolioAgent /><BackToTop /><Analytics /><SpeedInsights /></body></html>
}
