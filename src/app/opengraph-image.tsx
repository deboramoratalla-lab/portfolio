import { ImageResponse } from "next/og"

export const alt = "Debora Moratalla — Product designer and design engineer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#f1f0eb", color: "#161616", padding: "46px 54px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 16, letterSpacing: 1.5, textTransform: "uppercase", color: "#5d5c57" }}>
        <span style={{ display: "flex", gap: 12, alignItems: "center" }}><b style={{ color: "#5143d4", fontSize: 22 }}>DM</b> Debora Moratalla</span>
        <span>Product design · Design engineering</span>
      </div>
      <div style={{ display: "flex", flex: 1, marginTop: 35, borderTop: "1px solid #adaca5", borderBottom: "1px solid #adaca5" }}>
        <div style={{ display: "flex", flexDirection: "column", width: "58%", padding: "44px 40px 38px 0", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <span style={{ color: "#5143d4", fontSize: 18, letterSpacing: 1.5, textTransform: "uppercase" }}>Designing complex products, AI workflows and coded prototypes</span>
            <span style={{ fontSize: 59, lineHeight: 0.98, letterSpacing: -3.4, fontWeight: 600 }}>I make the logic visible.</span>
            <span style={{ maxWidth: 530, color: "#5d5c57", fontSize: 22, lineHeight: 1.32 }}>Product designer for technical systems, enterprise tools and data-dense decisions.</span>
          </div>
          <div style={{ display: "flex", gap: 28, color: "#4f4e49", fontSize: 17 }}>
            <span>10+ years</span><span>B2B + enterprise</span><span>Systems + AI</span>
          </div>
        </div>
        <div style={{ display: "flex", width: "42%", background: "#191a18", margin: "27px 0 27px 0", padding: 28, flexDirection: "column", color: "#f5f4ef", justifyContent: "space-between" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#b8b8b0", fontSize: 14, letterSpacing: 1.2, textTransform: "uppercase" }}><span>Lab / experiment</span><span style={{ color: "#9dae36" }}>Live evidence</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            <span style={{ fontSize: 31, lineHeight: 1.04, letterSpacing: -1.5 }}>From a slow AI job to a clear next step.</span>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 17 }}>
              <span style={{ color: "#55e5e6", fontSize: 69, lineHeight: 0.8, letterSpacing: -4 }}>42%</span>
              <span style={{ marginBottom: 4, color: "#b8b8b0", fontSize: 16 }}>GPU utilisation</span>
            </div>
          </div>
          <div style={{ display: "flex", borderTop: "1px solid #494a46", paddingTop: 16, justifyContent: "space-between", color: "#d8d7d0", fontSize: 14 }}><span>Grafana · Prometheus</span><span>→ Explore Lab</span></div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 20, color: "#5d5c57", fontSize: 17 }}><span>deboramoratalla.com</span><span>Madrid, Spain</span></div>
    </div>,
    size,
  )
}
