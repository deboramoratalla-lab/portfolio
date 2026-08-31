# Relay governed agent — release-control evidence

This experiment is a working product hypothesis for reviewing behavioural changes to an n8n agent before promotion. It combines a governed support-agent path with two isolated release-control paths in the same published workflow.

## What is live

- Published n8n workflow: `Relay — Governed AI Support Agent` (`9eARZ37mTUXE50IV`).
- `GET /webhook/relay-agent-release-review`: evaluates one allowlisted synthetic scenario and returns the real n8n execution ID, comparison fixtures and node trace.
- `POST /webhook/relay-agent-release-approval`: validates the scenario and persists a pending approval record in the `Relay release approvals` n8n Data Table.
- The portfolio uses server-side proxy routes so the browser does not own integration details.

## What is deliberately synthetic

- Representative conversations are a versioned evaluation fixture set: `relay-release-fixtures-v1`.
- The CRM action is mocked. Every receipt returns `externalWrite: false`.
- No customer data, CRM credentials or production write permissions are present.

## Governing path

1. Classify the request and risk.
2. Retrieve approved policy.
3. Let the agent reason with a model, session-scoped memory and one constrained policy-search tool.
4. Use deterministic gates for missing policy, high-risk actions and human approval.
5. Build an execution receipt and user-facing safety summary.

## Release-review contract

The replay contract includes:

- real `executionId` from n8n;
- workflow and client trace identifiers;
- decision, risk and approval requirement;
- current-versus-proposed outcomes for three support fixtures;
- executed, waiting, blocked and skipped nodes;
- policy and dataset provenance;
- explicit `externalWrite: false`.

See [`public/evidence/relay-changed-receipt.json`](../public/evidence/relay-changed-receipt.json) for a sanitized response captured from the published workflow.

## Approval audit

The approval path stores `request_id`, `trace_id`, `scenario`, `status`, `created_at` and `external_write`. It creates an auditable pending request without performing the proposed CRM write.

## Known boundary

This is release-control evidence, not production evaluation infrastructure. A production implementation would add authentication, retention rules, a larger evaluation dataset, idempotency enforcement and an error workflow with operational alerting.
