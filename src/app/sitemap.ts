import type { MetadataRoute } from "next"
import { projects } from "@/data/projects"
export default function sitemap(): MetadataRoute.Sitemap { return ["", "/contact", ...projects.map(project => `/projects/${project.slug}`)].map(path => ({ url: `https://deboramoratalla.com${path}`, lastModified: new Date() })) }
