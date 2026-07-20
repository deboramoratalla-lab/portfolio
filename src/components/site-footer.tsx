import Link from "next/link"

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-ticker"><span>Structured</span><span>Clear</span><span>Scalable</span><span>Connected</span></div>
    <p className="footer-pitch">If you&apos;re building something complex and need someone who can see the whole system — let&apos;s talk.</p>
    <a className="button" href="mailto:hello@deboramoratalla.com">Let&apos;s connect <span>↗</span></a>
    <div className="footer-bottom"><nav><Link href="/#about">About</Link><Link href="/#work">Work</Link><Link href="/#practice">Practice</Link><Link href="/#tools">Tools</Link></nav><span>Based in Madrid · Product Designer</span></div>
  </footer>
}
