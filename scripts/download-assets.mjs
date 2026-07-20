import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { basename, extname, join } from "node:path"
import { pipeline } from "node:stream/promises"

const inventory = JSON.parse(readFileSync("source-inventory.json", "utf8"))
const destination = "public/media"
mkdirSync(destination, { recursive: true })
mkdirSync("src/data", { recursive: true })

const urls = [...new Set(
  inventory.flatMap((page) => page.media.map((asset) => asset.src))
    .filter((url) => url.includes("framerusercontent.com"))
)]

const manifest = {}

for (const source of urls) {
  const parsed = new URL(source)
  const original = basename(parsed.pathname)
  const extension = extname(original) || ".bin"
  const stem = original.slice(0, -extension.length)
  const filename = `${stem}${extension}`
  const target = join(destination, filename)

  if (!existsSync(target)) {
    const response = await fetch(source)
    if (!response.ok || !response.body) {
      throw new Error(`Unable to download ${source}: ${response.status}`)
    }

    await pipeline(response.body, createWriteStream(target))
    console.log(`${filename} · ${response.headers.get("content-length") ?? "unknown"} bytes`)
  }
  manifest[source] = `/media/${filename}`
}

writeFileSync("src/data/asset-manifest.json", JSON.stringify(manifest, null, 2))
