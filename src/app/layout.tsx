import type { Metadata } from "next"
import "./tokens.css"
import "./globals.css"
import "./site-header.css"
import "../styles/index.css"
import "./responsive.css"
import "../styles/pages/home.css"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BackToTop } from "@/components/back-to-top"
import { PortfolioAgent } from "@/components/portfolio-agent"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  metadataBase: new URL("https://deboramoratalla.com"),
  title: { default: "Debora Moratalla — Senior Product Designer", template: "%s — Debora Moratalla" },
  description: "Product designer for technical systems, enterprise tools, AI workflows and complex B2B products.",
  alternates: { canonical: "/" },
  authors: [{ name: "Debora Moratalla", url: "https://deboramoratalla.com" }],
  creator: "Debora Moratalla",
  icons: { icon: "/icon.svg", shortcut: "/icon.svg", apple: "/media/dm-logo.png" },
  keywords: ["Product Designer", "Technical Product Design", "Enterprise Product Design", "Design Systems", "AI Product Design", "Design Engineering", "Product Strategy"],
  openGraph: { title: "Debora Moratalla — Senior Product Designer", description: "Product design for technical systems, enterprise tools and AI workflows.", url: "https://deboramoratalla.com", siteName: "Debora Moratalla", locale: "en_GB", type: "website", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Debora Moratalla — Product designer and design engineer" }] },
  twitter: { card: "summary_large_image", title: "Debora Moratalla — Senior Product Designer", description: "Product design for technical systems, enterprise tools and AI workflows.", images: ["/opengraph-image"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const personSchema = { "@context": "https://schema.org", "@type": "Person", name: "Debora Moratalla Martín", url: "https://deboramoratalla.com", jobTitle: "Product Designer", sameAs: ["https://www.linkedin.com/in/deboramoratallamartin/"], knowsAbout: ["Technical Product Design", "Enterprise Product Design", "Design Systems", "AI Product Design", "Design Engineering", "Product Strategy"] }
  return <html lang="en" data-scroll-behavior="smooth"><body className="portfolio"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} /><SiteHeader />{children}<SiteFooter /><PortfolioAgent /><BackToTop /><Analytics /><SpeedInsights /></body></html>
}
