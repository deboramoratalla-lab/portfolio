import type { Metadata } from "next"
import { professionalProfile } from "@/data/professional-profile"
import { LabPixelGrid } from "@/components/lab-pixel-grid"
import { ExperienceMap } from "@/components/experience-map"
import { EditorialSectionHeader } from "@/components/editorial-section-header"
import { SupportCard } from "@/components/support-card"

export const metadata: Metadata = { title: "Experience - Debora Moratalla", description: "Professional experience, education and languages of product designer and design engineer Debora Moratalla." }

export default function ExperiencePage() {
  return <main className="editorial-page experience-page">
    <section className="lab-grid-hero" aria-labelledby="experience-title">
      <h1 className="lab-grid-label" id="experience-title">EXPERIENCE</h1>
      <LabPixelGrid />
    </section>
    <section className="experience-profile-strip" aria-label="Professional profile">
      <div className="experience-profile-strip__copy">
        <span>[ PROFILE ]</span>
        <h2>{professionalProfile.summary}</h2>
      </div>
      <aside className="experience-profile-strip__card">
        <span>CURRENT PRACTICE</span>
        <p>Enterprise product design, design systems and AI workflows — from system model to shipped interface.</p>
      </aside>
    </section>
    <section className="editorial-section experience-index" aria-labelledby="experience-index-title">
      <ExperienceMap roles={professionalProfile.roles} />
    </section>
    <section className="editorial-section experience-support" aria-label="Further experience">
      <EditorialSectionHeader label="BEYOND THE ROLE" title="Other threads I keep active." description="Teaching, learning and the contexts that keep the work grounded." />
      <div className="support-grid">
        <SupportCard number="// 01" title="Education" items={professionalProfile.education} icon={<svg viewBox="0 0 24 24"><path d="m9 6-5 6 5 6M15 6l5 6-5 6M13 4l-2 16" /></svg>} />
        <SupportCard number="// 02" title="Languages" items={professionalProfile.languages} icon={<svg viewBox="0 0 24 24"><path d="m5 19 2-6 9-9 3 3-9 9-5 3Z" /><path d="m14 5 3 3M5 19l4-1" /></svg>} />
        <SupportCard number="// 03" title="Speaking & teaching" items={professionalProfile.speaking} icon={<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="2" /><circle cx="19" cy="6" r="2" /><circle cx="19" cy="18" r="2" /><path d="m7 11 10-4M7 13l10 4" /></svg>} />
      </div>
    </section>
  </main>
}
