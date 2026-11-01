import Link from "next/link"
import Image from "next/image"
import { ArrowLink } from "@/components/ui-links"

const footerLinks = [
  ["Work", "/#work"],
  ["Lab", "/lab"],
  ["Experience", "/experience"],
  ["Contact", "/#contact"],
] as const

export function SiteFooter() {
  return <footer id="contact" className="site-footer">
    <div className="footer-cta">
      <span>Available for the right product challenge.</span>
      <p>hello@deboramoratalla.com</p>
      <div className="footer-actions">
        <ArrowLink className="footer-action" variant="secondary" tone="purple" href="mailto:hello@deboramoratalla.com">Email</ArrowLink>
        <ArrowLink className="footer-action" variant="secondary" tone="purple" href="https://www.linkedin.com/in/deboramoratallamartin/" target="_blank" rel="noreferrer">LinkedIn</ArrowLink>
        <ArrowLink className="footer-action" variant="secondary" tone="green" href="https://github.com/deboramoratalla-lab" target="_blank" rel="noreferrer">GitHub</ArrowLink>
      </div>
    </div>
    <div className="footer-bottom">
      <Link className="footer-mark" href="/"><Image src="/media/dm-logo.png" alt="DM" width={42} height={42} /></Link>
      <div><span>Explore</span><nav>{footerLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav></div>
      <div className="footer-location"><span>Based in Madrid</span><p>Product designer · Systems thinker</p></div>
    </div>
  </footer>
}
