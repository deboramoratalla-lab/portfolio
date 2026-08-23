# GPU job triage

Local observability prototype for a distributed AI workload. It uses real Grafana and Prometheus containers. The workload service emits deliberately simulated worker readings because this repository is not connected to a GPU cluster.

## Run locally

1. Install Docker Desktop.
2. Run `docker compose up --build` from this directory.
3. Open Grafana at `http://localhost:3001` and sign in with `admin` / `local-demo`.
4. Open Prometheus at `http://localhost:9090`.

Use the scenario controller to reproduce the incident: `curl -X POST "http://localhost:9108/scenario?state=drift"` or replace `drift` with `baseline` or `blocked`. Prometheus records the change and Grafana updates worker progress, ETA variance, pressure, input wait and throughput.

## What is real and what is simulated

- Real: Docker, Grafana, Prometheus, PromQL queries, alert evaluation, the local service exposing `/metrics` and the scenario controller at `/scenario`.
- Simulated: the AI workload and GPU-like worker readings.

The simulator is intentionally small. Its purpose is to test a product question: how should an operator be guided from a changing signal to a responsible next action?
