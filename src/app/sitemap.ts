import type { MetadataRoute } from "next"
import { projects } from "@/data/projects"
import { labEntries } from "@/data/lab"
export default function sitemap(): MetadataRoute.Sitemap { return ["", "/lab", "/experience", ...labEntries.map(entry => `/lab/${entry.slug}`), ...projects.filter(project => project.slug !== "saas").map(project => `/projects/${project.slug}`)].map(path => ({ url: `https://deboramoratalla.com${path}`, lastModified: new Date() })) }
