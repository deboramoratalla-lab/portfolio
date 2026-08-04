import Link from "next/link"
import { ArrowUpRight } from "@/components/arrow-up-right"

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-ticker"><span>Structured</span><span>Clear</span><span>Scalable</span><span>Connected</span></div>
    <div className="footer-cta">
      <p>If you&apos;re building something complex and need someone who can see the whole system.</p>
      <a className="button" href="mailto:hello@deboramoratalla.com">Let&apos;s connect <ArrowUpRight /></a>
    </div>
    <div className="footer-bottom">
      <Link className="footer-mark" href="/"><img src="/media/dm-logo.png" alt="DM" /></Link>
      <div><span>Explore</span><nav><Link href="/#about">About</Link><Link href="/#work">Work</Link><Link href="/#practice">Practice</Link><Link href="/#tools">Tools</Link></nav></div>
      <div className="footer-location"><span>Based in Madrid</span><p>Product designer · Systems thinker</p></div>
    </div>
  </footer>
}
