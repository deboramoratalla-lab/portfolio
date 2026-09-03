import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

const publicRoutes = [
  ["home", "/"],
  ["experience", "/experience"],
  ["lab", "/lab"],
  ["Board access", "/board-access"],
  ["Civeo case study", "/projects/civeo"],
  ["Fluxy case study", "/projects/fluxy"],
  ["TAP Mindset case study", "/projects/tap-mindset"],
  ["TAP design system case study", "/projects/tap-mindset-ds"],
  ["n8n workflow impact experiment", "/lab/workflow-impact-preview"],
  ["remote technology opportunity radar", "/lab/european-tech-opportunity-radar"],
] as const

for (const [name, route] of publicRoutes) {
  test(`${name} has no detectable accessibility violations`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" })
    await expect(page.locator("main")).toBeVisible()

    const results = await new AxeBuilder({ page }).analyze()

    expect(results.violations).toEqual([])
  })
}
