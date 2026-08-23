import https from "node:https";
import os from "node:os";

const endpoint = process.env.GRAFANA_REMOTE_WRITE_URL;
const instanceId = process.env.GRAFANA_METRICS_INSTANCE_ID;
const token = process.env.GRAFANA_METRICS_WRITE_TOKEN;

if (!endpoint || !instanceId || !token) {
  throw new Error("Missing Grafana remote-write configuration.");
}

const cores = os.cpus().length;
let previousNetwork = null;

function varint(value) {
  const bytes = [];
  let current = BigInt(value);
  while (current > 127n) {
    bytes.push(Number((current & 127n) | 128n));
    current >>= 7n;
  }
  bytes.push(Number(current));
  return Buffer.from(bytes);
}

function field(tag, value) {
  return Buffer.concat([varint(tag), varint(value.length), value]);
}

function label(name, value) {
  return field(10, Buffer.concat([field(10, Buffer.from(name)), field(18, Buffer.from(value))]));
}

function sample(value, timestamp) {
  const number = Buffer.alloc(8);
  number.writeDoubleLE(value);
  return field(18, Buffer.concat([Buffer.from([9]), number, Buffer.from([16]), varint(timestamp)]));
}

function series(name, value, timestamp) {
  const payload = Buffer.concat([
    label("__name__", name),
    label("source", "portfolio-mac"),
    sample(value, timestamp),
  ]);
  return field(10, payload);
}

function snappyLiteral(input) {
  const chunks = [varint(input.length)];
  for (let offset = 0; offset < input.length;) {
    const size = Math.min(60, input.length - offset);
    chunks.push(Buffer.from([(size - 1) << 2]), input.subarray(offset, offset + size));
    offset += size;
  }
  return Buffer.concat(chunks);
}

function networkBytes() {
  const interfaces = os.networkInterfaces();
  // Node does not expose byte counters on macOS, so only aggregate active interface count.
  return Object.entries(interfaces).filter(([name, entries]) => name !== "lo0" && entries?.some((entry) => !entry.internal)).length;
}

function collect() {
  const timestamp = Date.now();
  const memoryUsed = ((os.totalmem() - os.freemem()) / os.totalmem()) * 100;
  const load = (os.loadavg()[0] / Math.max(cores, 1)) * 100;
  const activeInterfaces = networkBytes();
  const deltaInterfaces = previousNetwork === null ? 0 : activeInterfaces - previousNetwork;
  previousNetwork = activeInterfaces;
  const metrics = [
    ["portfolio_mac_cpu_load_percent", Math.min(100, Math.max(0, load))],
    ["portfolio_mac_memory_used_percent", Math.min(100, Math.max(0, memoryUsed))],
    ["portfolio_mac_active_network_interfaces", activeInterfaces],
    ["portfolio_mac_network_interface_delta", deltaInterfaces],
    ["portfolio_mac_uptime_seconds", os.uptime()],
  ];
  return snappyLiteral(Buffer.concat(metrics.map(([name, value]) => series(name, value, timestamp))));
}

function send() {
  const body = collect();
  const target = new URL(endpoint);
  const request = https.request({
    hostname: target.hostname,
    path: target.pathname,
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${instanceId}:${token}`).toString("base64")}`,
      "Content-Type": "application/x-protobuf",
      "Content-Encoding": "snappy",
      "X-Prometheus-Remote-Write-Version": "0.1.0",
      "Content-Length": body.length,
    },
  }, (response) => {
    if (response.statusCode < 200 || response.statusCode >= 300) {
      console.error(`Grafana remote write failed: ${response.statusCode}`);
    }
    response.resume();
  });
  request.on("error", (error) => console.error(`Grafana remote write error: ${error.message}`));
  request.end(body);
}

send();
setInterval(send, 15_000);
