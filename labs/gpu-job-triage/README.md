# GPU job triage

Local observability prototype for a distributed AI workload. It uses real Grafana and Prometheus containers. The workload service emits deliberately simulated worker readings because this repository is not connected to a GPU cluster.

## Run locally

1. Install Docker Desktop.
2. Run `docker compose up --build` from this directory.
3. Open Grafana at `http://localhost:3001` and sign in with `admin` / `local-demo`.
4. Open Prometheus at `http://localhost:9090`.

After 45 seconds, `worker-04` starts falling behind. Prometheus records the divergence and Grafana shows the worker progress, ETA variance, pressure and cost reading.

## What is real and what is simulated

- Real: Docker, Grafana, Prometheus, PromQL queries, alert evaluation and the local service exposing `/metrics`.
- Simulated: the AI workload and GPU-like worker readings.

The simulator is intentionally small. Its purpose is to test a product question: how should an operator be guided from a changing signal to a responsible next action?
