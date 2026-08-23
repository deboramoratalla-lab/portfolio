import http from "node:http"

const port = Number(process.env.PORT || 9108)
const startedAt = Date.now()
let scenario = "baseline"

function value(worker, elapsed) {
  const baseline = [0.72, 0.71, 0.73, 0.70][worker]
  const affected = worker === 3
  const severity = scenario === "blocked" ? .48 : scenario === "drift" ? .20 : 0
  const drift = affected ? severity : 0
  const wait = affected ? (scenario === "blocked" ? .231 : scenario === "drift" ? .086 : .012) : .014
  return { progress: Math.min(.98, baseline + elapsed / 900000 - drift), pressure: affected ? .39 + severity + .12 : .39 + worker * .025, eta: affected ? 2580 + severity * 4375 : 2580 + worker * 40, wait, throughput: affected ? .46 - severity * .82 : .46 }
}

function metrics() {
  const elapsed = Date.now() - startedAt
  const readings = [0, 1, 2, 3].map(worker => value(worker, elapsed))
  const delayCost = Math.max(0, readings[3].eta - readings[0].eta) / 60 * .72
  const lines = ["# HELP training_worker_progress Current completion fraction for the worker.", "# TYPE training_worker_progress gauge", "# HELP training_worker_eta_seconds Estimated seconds remaining for the worker.", "# TYPE training_worker_eta_seconds gauge", "# HELP training_worker_pressure Local workload pressure for the worker.", "# TYPE training_worker_pressure gauge", "# HELP training_worker_input_wait_seconds Waiting time for input.", "# TYPE training_worker_input_wait_seconds gauge", "# HELP training_worker_throughput Samples processed per second.", "# TYPE training_worker_throughput gauge"]
  readings.forEach((reading, index) => {
    const label = `worker-${String(index + 1).padStart(2, "0")}`
    lines.push(`training_worker_progress{worker="${label}"} ${reading.progress.toFixed(3)}`)
    lines.push(`training_worker_eta_seconds{worker="${label}"} ${reading.eta}`)
    lines.push(`training_worker_pressure{worker="${label}"} ${reading.pressure.toFixed(3)}`)
    lines.push(`training_worker_input_wait_seconds{worker="${label}"} ${reading.wait.toFixed(3)}`)
    lines.push(`training_worker_throughput{worker="${label}"} ${reading.throughput.toFixed(3)}`)
  })
  lines.push("# HELP training_delay_cost_eur Estimated cost at risk from the delayed worker.", "# TYPE training_delay_cost_eur gauge", `training_delay_cost_eur ${delayCost.toFixed(2)}`)
  return `${lines.join("\n")}\n`
}

http.createServer((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*")
  const url = new URL(request.url, `http://${request.headers.host}`)
  if (url.pathname === "/scenario" && request.method === "POST") {
    const next = url.searchParams.get("state")
    if (!next || !["baseline", "drift", "blocked"].includes(next)) { response.writeHead(400); return response.end("Unknown scenario") }
    scenario = next
    response.writeHead(204)
    return response.end()
  }
  if (url.pathname === "/scenario") { response.writeHead(200, { "Content-Type": "application/json" }); return response.end(JSON.stringify({ scenario })) }
  if (url.pathname !== "/metrics") { response.writeHead(404); return response.end("Not found") }
  response.writeHead(200, { "Content-Type": "text/plain; version=0.0.4" })
  response.end(metrics())
}).listen(port, () => console.log(`Metrics service listening on ${port}`))
