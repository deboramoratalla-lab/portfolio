import { expect, test } from "@playwright/test"

const routes = [
  ["home", "/"],
  ["board", "/projects/saas"],
  ["civeo", "/projects/civeo"],
  ["fluxy", "/projects/fluxy"],
] as const

for (const [name, route] of routes) {
  test(`${name} keeps its visual contract`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" })
    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      animations: "disabled",
      maxDiffPixelRatio: 0.015,
    })
  })
}

test("every core route keeps one page heading and no horizontal overflow", async ({ page }) => {
  for (const [, route] of routes) {
    await page.goto(route, { waitUntil: "networkidle" })
    await expect(page.locator("h1")).toHaveCount(1)
    await expect(page.locator("img:not([alt])")).toHaveCount(0)
    expect(await page.locator("html").evaluate(element => element.scrollWidth <= window.innerWidth + 1)).toBeTruthy()
  }
})
