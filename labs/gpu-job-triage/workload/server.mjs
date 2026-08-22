import http from "node:http"

const port = Number(process.env.PORT || 9108)
const incidentAfter = Number(process.env.INCIDENT_AFTER_SECONDS || 45) * 1000
const startedAt = Date.now()

function value(worker, elapsed) {
  const baseline = [0.72, 0.71, 0.73, 0.70][worker]
  const incident = elapsed > incidentAfter && worker === 3
  const drift = incident ? Math.min(.48, (elapsed - incidentAfter) / 240000) : 0
  return { progress: Math.min(.98, baseline + elapsed / 900000 - drift), pressure: incident ? .88 : .39 + worker * .025, eta: incident ? 4680 : 2580 + worker * 40 }
}

function metrics() {
  const elapsed = Date.now() - startedAt
  const readings = [0, 1, 2, 3].map(worker => value(worker, elapsed))
  const delayCost = Math.max(0, readings[3].eta - readings[0].eta) / 60 * .72
  const lines = ["# HELP training_worker_progress Current completion fraction for the worker.", "# TYPE training_worker_progress gauge", "# HELP training_worker_eta_seconds Estimated seconds remaining for the worker.", "# TYPE training_worker_eta_seconds gauge", "# HELP training_worker_pressure Local workload pressure for the worker.", "# TYPE training_worker_pressure gauge"]
  readings.forEach((reading, index) => {
    const label = `worker-${String(index + 1).padStart(2, "0")}`
    lines.push(`training_worker_progress{worker="${label}"} ${reading.progress.toFixed(3)}`)
    lines.push(`training_worker_eta_seconds{worker="${label}"} ${reading.eta}`)
    lines.push(`training_worker_pressure{worker="${label}"} ${reading.pressure.toFixed(3)}`)
  })
  lines.push("# HELP training_delay_cost_eur Estimated cost at risk from the delayed worker.", "# TYPE training_delay_cost_eur gauge", `training_delay_cost_eur ${delayCost.toFixed(2)}`)
  return `${lines.join("\n")}\n`
}

http.createServer((request, response) => {
  if (request.url !== "/metrics") { response.writeHead(404); return response.end("Not found") }
  response.writeHead(200, { "Content-Type": "text/plain; version=0.0.4" })
  response.end(metrics())
}).listen(port, () => console.log(`Metrics service listening on ${port}`))
