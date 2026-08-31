# Design QA — Relay agent release control

- Source visual truth: `/private/tmp/n8n-prototype-audit/04-replay-result.png`
- Implementation: `/private/tmp/workflow-qa-implementation-v2.png`
- Viewport: 1440 × 900 CSS px, device scale factor 1
- Source pixels: 697 × 674 (earlier production capture, narrow responsive state)
- Implementation pixels: 1280 × 720 (in-app browser capture at the requested 16:9 state)
- Density normalization: evaluated as responsive product states rather than pixel-identical crops; browser chrome was excluded from the comparison judgment.
- State: CRM action selected; replay completed; real n8n receipt visible; approval available.

## Full-view comparison evidence

The updated implementation preserves the established white canvas, warm neutral shell, compact scenario rail, semantic amber risk treatment and teal primary action. It replaces the earlier generic decision message and oversized full-width action with a compact, structured execution receipt and a persistent action footer. The information density remains appropriate for the 16:9 application frame.

## Focused-region comparison evidence

The evidence and action region required focused review because it contains the smallest typography and the primary handoff. The updated capture confirms readable receipt labels, a visible real execution ID, explicit write boundary, and a primary approval action that remains visible at the bottom of the scroll region.

## Findings

- No remaining P0, P1 or P2 findings.
- P3: execution metadata is intentionally compact. At browser zoom above 100%, the receipt grid reflows to two columns and then one column through the existing breakpoints.

Required fidelity surfaces:

- Fonts and typography: existing Inter display/sans system retained; hierarchy and weights remain consistent. Receipt labels were raised to 9 px and values to 10 px.
- Spacing and layout rhythm: 16:9 frame retained; evidence cards and receipt use the existing 8–10 px internal rhythm; the primary action is now sticky within the detail pane.
- Colors and visual tokens: existing semantic blue, amber, green and red tokens retained. Trace states use green, amber, red and dashed-neutral treatments with text labels.
- Image quality and assets: no raster imagery is required in this product surface. Icons continue to use the existing Tabler icon library.
- Copy and content: generic demo language was replaced with workflow ID, n8n execution ID, policy, dataset provenance and explicit live/synthetic/mocked boundaries.

## Interaction verification

- Replay completed against the published n8n webhook.
- Approval request completed against n8n and persisted in the Data Table.
- Tabs respond to left/right arrow keys.
- Scenario radios respond to arrow keys.
- Fresh-session console check: no errors or warnings.

## Comparison history

1. P2 — primary approval action was below the visible evidence region after the receipt was added.
2. Fix — made the action footer sticky inside the review detail and increased receipt text sizes.
3. Post-fix evidence — `/private/tmp/workflow-qa-implementation-v2.png` shows the receipt and `Request approval` action together in the same 16:9 viewport.

## Implementation checklist

- [x] Real n8n execution receipt
- [x] Persisted approval request
- [x] Server-owned support fixtures
- [x] Node-level execution trace
- [x] Explicit evidence boundaries
- [x] Keyboard navigation
- [x] Responsive receipt grid
- [x] Technical evidence document and sanitized sample receipt

final result: passed
