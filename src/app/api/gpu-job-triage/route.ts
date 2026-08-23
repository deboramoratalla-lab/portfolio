import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type PrometheusResponse = {
  data?: { result?: Array<{ value?: [number, string] }> };
};

const queryUrl = process.env.GRAFANA_PROMETHEUS_QUERY_URL;
const instanceId = process.env.GRAFANA_METRICS_INSTANCE_ID;
const token = process.env.GRAFANA_METRICS_READ_TOKEN;

async function query(expression: string) {
  if (!queryUrl || !instanceId || !token) return null;
  const authorization = `Basic ${Buffer.from(`${instanceId}:${token}`).toString("base64")}`;
  const response = await fetch(`${queryUrl.replace(/\/$/, "")}/api/v1/query?query=${encodeURIComponent(expression)}`, {
    cache: "no-store",
    headers: { Authorization: authorization },
  });
  if (!response.ok) throw new Error(`Grafana Cloud returned ${response.status}`);
  const payload = await response.json() as PrometheusResponse;
  const raw = payload.data?.result?.[0]?.value?.[1];
  return raw === undefined ? null : Number(raw);
}

export async function GET() {
  if (!queryUrl || !instanceId || !token) {
    return NextResponse.json({ status: "not-configured", updatedAt: new Date().toISOString() });
  }

  try {
    const [progress, inputWaitSeconds, throughput, cost, workerCount] = await Promise.all([
      query("avg(training_worker_progress) * 100"),
      query("avg(training_worker_input_wait_seconds) * 1000"),
      query("sum(training_worker_throughput)"),
      query("training_delay_cost_eur"),
      query("count(training_worker_progress)"),
    ]);
    if (progress === null || inputWaitSeconds === null || throughput === null) {
      return NextResponse.json({ status: "no-data", updatedAt: new Date().toISOString() });
    }
    return NextResponse.json({
      status: "live",
      updatedAt: new Date().toISOString(),
      metrics: {
        progress: Math.round(progress),
        inputWaitMs: Math.round(inputWaitSeconds),
        throughput: Number(throughput.toFixed(2)),
        cost: Number((cost ?? 0).toFixed(2)),
        workers: Math.round(workerCount ?? 0),
      },
    });
  } catch {
    return NextResponse.json({ status: "unavailable", updatedAt: new Date().toISOString() });
  }
}
