import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { projectBySlug, projects } from "@/data/projects"

export const alt = "Case study by Debora Moratalla"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export function generateStaticParams() { return projects.map(project => ({ slug: project.slug })) }

async function cover(src: string) {
  try {
    const file = await readFile(path.join(process.cwd(), "public", src))
    const type = src.endsWith(".png") ? "image/png" : "image/jpeg"
    return `data:${type};base64,${file.toString("base64")}`
  } catch { return null }
}

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = projectBySlug[slug]
  const image = project ? await cover(project.cover) : null
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#efeee9", color: "#141414", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 520, padding: "48px 48px 44px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#5145c7", fontSize: 16, letterSpacing: 2, textTransform: "uppercase" }}><span>Case study</span><span style={{ color: "#77766f" }}>{project?.tags[0] ?? ""}</span></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span style={{ fontSize: 76, lineHeight: 0.95, letterSpacing: -4 }}>{project?.shortTitle ?? "Debora Moratalla"}</span>
          <span style={{ fontSize: 24, lineHeight: 1.3, color: "#55554f" }}>{project?.strapline ?? ""}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: "1px solid #c9c8c1", paddingTop: 22 }}>
          {project?.cardStat && <span style={{ display: "flex", alignItems: "baseline", gap: 14 }}><b style={{ fontSize: 46, fontWeight: 400, color: "#5145c7", letterSpacing: -2, whiteSpace: "nowrap", flexShrink: 0 }}>{project.cardStat[0]}</b><span style={{ fontSize: 17, color: "#55554f", maxWidth: 300 }}>{project.cardStat[1]}</span></span>}
          <span style={{ fontSize: 15, color: "#77766f", letterSpacing: 1.5, textTransform: "uppercase" }}>Debora Moratalla · Senior Product Designer</span>
        </div>
      </div>
      <div style={{ display: "flex", flex: 1, background: "#111" }}>
        {image && <img src={image} alt="" width={680} height={630} style={{ width: 680, height: 630, objectFit: "cover" }} />}
      </div>
    </div>,
    size,
  )
}
