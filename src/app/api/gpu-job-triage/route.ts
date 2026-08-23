import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type PrometheusResponse = {
  data?: { result?: Array<{ value?: [number, string] }> };
};

type GrafanaConfig = { queryUrl: string; instanceId: string; token: string };

async function query(expression: string, config: GrafanaConfig) {
  const authorization = `Basic ${Buffer.from(`${config.instanceId}:${config.token}`).toString("base64")}`;
  const response = await fetch(`${config.queryUrl.replace(/\/$/, "")}/api/prom/api/v1/query?query=${encodeURIComponent(expression)}`, {
    cache: "no-store",
    headers: { Authorization: authorization },
  });
  if (!response.ok) throw new Error(`Grafana Cloud returned ${response.status}`);
  const payload = await response.json() as PrometheusResponse;
  const sample = payload.data?.result?.[0]?.value;
  if (!sample) return null;
  return { value: Number(sample[1]), timestamp: Number(sample[0]) };
}

export async function GET() {
  const queryUrl = process.env["GRAFANA_PROMETHEUS_QUERY_URL"];
  const instanceId = process.env["GRAFANA_METRICS_INSTANCE_ID"];
  const token = process.env["GRAFANA_METRICS_READ_TOKEN"];
  if (!queryUrl || !instanceId || !token) {
    return NextResponse.json({
      status: "not-configured",
      updatedAt: new Date().toISOString(),
    });
  }
  const config = { queryUrl, instanceId, token };

  try {
    const [progress, inputWaitSeconds, throughput, cost, workerCount] = await Promise.all([
      query("avg(portfolio_mac_cpu_load_percent)", config),
      query("avg(portfolio_mac_memory_used_percent)", config),
      query("max(portfolio_mac_active_network_interfaces)", config),
      query("max(portfolio_mac_uptime_seconds) / 3600", config),
      query("count(portfolio_mac_cpu_load_percent)", config),
    ]);
    if (progress === null || inputWaitSeconds === null || throughput === null) {
      return NextResponse.json({ status: "no-data", updatedAt: new Date().toISOString() });
    }
    return NextResponse.json({
      status: "live",
      updatedAt: new Date().toISOString(),
      metrics: {
        progress: Math.round(progress.value),
        inputWaitMs: Math.round(inputWaitSeconds.value),
        throughput: Number(throughput.value.toFixed(2)),
        cost: Number((cost?.value ?? 0).toFixed(2)),
        workers: Math.round(workerCount?.value ?? 0),
        freshnessSeconds: Math.max(0, Math.round(Date.now() / 1000 - progress.timestamp)),
      },
    });
  } catch {
    return NextResponse.json({ status: "unavailable", updatedAt: new Date().toISOString() });
  }
}
