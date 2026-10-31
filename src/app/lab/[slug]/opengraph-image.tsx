import { ImageResponse } from "next/og"

export const alt = "Workflow impact preview, an n8n agent release-control experiment by Debora Moratalla"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const isWorkflow = slug === "workflow-impact-preview"

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#f7f8fa", color: "#151a24", padding: "42px 50px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#5c6575", fontSize: 16, letterSpacing: 2, textTransform: "uppercase" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 12 }}><b style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 9, background: "#ff6d5a", color: "#fff", fontSize: 18, letterSpacing: 0 }}>DM</b> Debora Moratalla</span>
        <span style={{ color: "#5864d9" }}>LAB / N8N</span>
      </div>

      <div style={{ display: "flex", flex: 1, gap: 42, marginTop: 30, alignItems: "stretch" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "52%", padding: "28px 0 18px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 19 }}>
            <span style={{ color: "#5864d9", fontSize: 18, letterSpacing: 1.5, textTransform: "uppercase" }}>AI agent release control</span>
            <span style={{ fontSize: 57, lineHeight: 0.98, letterSpacing: -3, fontWeight: 700 }}>{isWorkflow ? "Replay the impact before you publish." : "A product design experiment."}</span>
            <span style={{ color: "#3d4654", fontSize: 22, lineHeight: 1.3, maxWidth: 570 }}>{isWorkflow ? "A live n8n-backed prototype for seeing how prompt, memory, model and tool changes alter real conversations." : "Technical systems, AI workflows and decisions made visible."}</span>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 15, color: "#273142" }}>
            <span style={{ display: "flex", padding: "9px 14px", borderRadius: 999, background: "#dceeff", border: "1px solid #a9d4f5" }}>Replay</span>
            <span style={{ display: "flex", padding: "9px 14px", borderRadius: 999, background: "#e9e4ff", border: "1px solid #c9bfff" }}>Approvals</span>
            <span style={{ display: "flex", padding: "9px 14px", borderRadius: 999, background: "#dcf5e8", border: "1px solid #a9dfc1" }}>Execution trace</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "48%", background: "#fff", border: "1px solid #d8dee8", borderRadius: 18, padding: 26, boxShadow: "0 10px 24px rgba(44,54,75,.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#697386", fontSize: 14, letterSpacing: 1.3, textTransform: "uppercase" }}><span>Representative conversation</span><span style={{ color: "#22a66f" }}>Ready to review</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span style={{ fontSize: 25, fontWeight: 700 }}>What changed in this run?</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ display: "flex", width: 12, height: 12, borderRadius: 99, background: "#ff6d5a" }} /><span style={{ fontSize: 17, color: "#273142" }}>Tool call added</span><span style={{ marginLeft: "auto", color: "#5864d9", fontWeight: 700 }}>+1</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ display: "flex", width: 12, height: 12, borderRadius: 99, background: "#5864d9" }} /><span style={{ fontSize: 17, color: "#273142" }}>Approval route changed</span><span style={{ marginLeft: "auto", color: "#5864d9", fontWeight: 700 }}>+2</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ display: "flex", width: 12, height: 12, borderRadius: 99, background: "#22a66f" }} /><span style={{ fontSize: 17, color: "#273142" }}>Response still grounded</span><span style={{ marginLeft: "auto", color: "#22a66f", fontWeight: 700 }}>OK</span></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, borderTop: "1px solid #e1e5eb", paddingTop: 16, color: "#5864d9", fontSize: 16, fontWeight: 700 }}>n8n workflow <span style={{ color: "#8d96a5" }}>·</span> inspect before publish <span style={{ marginLeft: "auto" }}>→</span></div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #d8dee8", paddingTop: 18, color: "#697386", fontSize: 16 }}><span>deboramoratalla.com/lab/workflow-impact-preview</span><span>Designing the logic behind AI products</span></div>
    </div>,
    size,
  )
}
