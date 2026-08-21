import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "@/components/arrow-up-right"
import { ArrowRouteLink } from "@/components/ui-links"
import type { LabEntry } from "@/data/lab"

const HOME_LAB_LIMIT = 5
const LAB_COVERS = [
  "/media/design-system-component-evidence.png",
  "/media/storybook-design-tokens-library.png",
  "/media/figma-code-component-importer.png",
  "/media/fluxy-production-deployment.png",
  "/media/accessibility-color-contrast-tokens.png",
]

const LAB_COVER_ALTS = [
  "Design-system component evidence arranged as an inspectable interface",
  "Storybook foundations and design-token documentation",
  "Figma plugin importing component APIs from code",
  "Coded agent workflow running in a production preview",
  "Accessibility colour-contrast checks expressed as reusable tokens",
]

export function WorkbenchPreview({ entries }: { entries: LabEntry[] }) {
  const visibleEntries = entries.slice(0, HOME_LAB_LIMIT)
  const [featuredEntry, ...noteEntries] = visibleEntries

  return <div className="home-lab-preview">
    {featuredEntry && <div className="home-lab-index">
      <Link href={`/lab/${featuredEntry.slug}`} className="home-lab-feature">
        <div className="home-lab-feature-copy">
          <div className="home-lab-card-meta"><span>01 · {featuredEntry.type}</span><span>{featuredEntry.date}</span></div>
          <h3>{featuredEntry.title}</h3>
          <p>{featuredEntry.summary}</p>
          <span className="home-lab-card-action">Read more <ArrowUpRight /></span>
        </div>
        <figure className="home-lab-feature-media">
          <Image src={LAB_COVERS[0]} alt={LAB_COVER_ALTS[0]} fill sizes="(max-width: 800px) 100vw, 45vw" />
        </figure>
      </Link>

      <div className="home-lab-notes" aria-label="More lab notes">
        {noteEntries.map((entry, index) => <Link href={`/lab/${entry.slug}`} className="home-lab-note" key={entry.slug}>
          <span className="home-lab-note-number">{String(index + 2).padStart(2, "0")}</span>
          <div className="home-lab-note-copy">
            <div className="home-lab-note-meta"><span>{entry.type}</span><span>{entry.date}</span></div>
            <h3>{entry.title}</h3>
          </div>
          <ArrowUpRight />
        </Link>)}
      </div>
    </div>}
    {entries.length > HOME_LAB_LIMIT && <div className="home-lab-more">
      <ArrowRouteLink href="/lab" variant="primary" tone="purple">See more</ArrowRouteLink>
    </div>}
  </div>
}
