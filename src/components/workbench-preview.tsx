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

  return <div className="home-lab-preview">
    <div className="home-lab-mosaic">
      {visibleEntries.map((entry, index) => <Link href={`/lab/${entry.slug}`} className="home-lab-card" key={entry.slug}>
        <div className="home-lab-card-copy">
          <div className="home-lab-card-meta"><span>{entry.type}</span><span>{entry.date}</span></div>
          <h3>{entry.title}</h3>
          {index === 0 && <p>{entry.summary}</p>}
          <span className="home-lab-card-action">Read more <ArrowUpRight /></span>
        </div>
        <figure className="home-lab-card-media">
          <Image src={LAB_COVERS[index]} alt={LAB_COVER_ALTS[index]} fill sizes={index === 0 ? "50vw" : "25vw"} />
        </figure>
      </Link>)}
    </div>
    {entries.length > HOME_LAB_LIMIT && <div className="home-lab-more">
      <ArrowRouteLink href="/lab" variant="primary" tone="purple">See more</ArrowRouteLink>
    </div>}
  </div>
}
