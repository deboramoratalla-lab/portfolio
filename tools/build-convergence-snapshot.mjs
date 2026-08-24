import { execFileSync } from "node:child_process"
import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"

const refs = process.argv.slice(2).length ? process.argv.slice(2) : ["ba5309d", "dd9c352", "daa296c"]
const runGit = (args) => execFileSync("git", args, { encoding: "utf8" }).trim()

const tasks = refs.map((ref, index) => {
  const [hash, parent] = runGit(["show", "-s", "--format=%H%x1f%P", ref]).split("\u001f")
  const files = runGit(["diff-tree", "--no-commit-id", "--name-only", "-r", hash]).split("\n").filter(Boolean)
  return { id: `T-${String(index + 1).padStart(2, "0")}`, hash: hash.slice(0, 7), parent: parent.split(" ")[0].slice(0, 7), files }
})

const byFile = new Map()
for (const task of tasks) for (const file of task.files) byFile.set(file, [...(byFile.get(file) || []), task.id])
const sharedFiles = [...byFile.entries()].filter(([, owners]) => owners.length > 1).map(([path, taskIds]) => ({ path, taskIds }))

const snapshot = {
  source: { repository: "deboramoratalla-lab/portfolio", method: "git diff-tree", generatedAt: new Date().toISOString() },
  tasks,
  sharedFiles,
  recommendation: sharedFiles.length ? "queue-dependent-review" : "safe-to-converge",
}

const output = resolve("src/data/agent-convergence-snapshot.json")
mkdirSync(dirname(output), { recursive: true })
writeFileSync(output, `${JSON.stringify(snapshot, null, 2)}\n`)
console.log(`Wrote ${output} from ${refs.join(", ")}`)
