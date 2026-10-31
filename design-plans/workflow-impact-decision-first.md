# Make the replay review decision-first

Written against: `475ce62`

## Evidence chain

- Surface: `/lab/workflow-impact-preview`, rendered by `WorkflowImpactPreview` in `src/components/workflow-impact-preview.tsx` and mounted through `src/app/lab/[slug]/page.tsx`.
- Problem: the current screen asks a first-time visitor to parse a three-step guide, choose a scenario and inspect a workflow map before it tells them whether the change is safe to publish. Once replay finishes, its primary action changes only to “Replay complete”, so it does not offer the decision-specific next step the surface exists to support.
- Design evidence: the article mounted on the same route says “Compare outcomes, not node diagrams” and that the flow remains visible while emphasis shifts to behaviour. It also states that a safe refinement can proceed, while a new external action or insufficient permission asks for review. The rendered component currently gives the map equal or greater spatial prominence than the outcome and uses a generic replay-complete state for all three scenarios.
- Owner: `src/components/workflow-impact-preview.tsx` and `src/components/workflow-impact-preview.module.css`.
- Scope and affected surfaces: the interactive Lab prototype and the workflow-impact article copy in `src/app/lab/[slug]/page.tsx`.
- Uncertainty: the existing route calls a published n8n webhook, while the article says the demo makes no claim to connect to n8n. Confirm the intended public claim before changing that article sentence; do not imply access to customer data.

## Design decision

Turn the right-hand impact panel into the starting point for the review, with one unambiguous question: “Can this change be published?” It must show the selected scenario’s consequence, a plain-language recommendation, and one next action that depends on the result. Place the current-versus-proposed evidence immediately beneath it. Keep the workflow as a collapsible explanatory detail, not the prerequisite for understanding the decision.

The required action mapping is deterministic:

- `safe`: “Publish change” — the sampled outcomes match and there is no new side effect.
- `changed`: “Request review” — past runs take a different route or introduce an external action.
- `broken`: “Fix permission” — the replay finds a stop before the action node.

The local demo may acknowledge the action with an in-surface confirmation only. It must not publish, write to n8n, or change any live workflow.

## Reuse

- Reuse `states` in `src/components/workflow-impact-preview.tsx` as the owner of scenario-specific copy, impact counts and comparison rows; add the decision/action fields there rather than creating a parallel state map.
- Reuse the existing `impact`, `replay`, `run`, `canvasHead`, `selected`, `accent`, `danger`, `ink`, `line` and responsive module-CSS owners.
- Exemplar: the article content in `src/app/lab/[slug]/page.tsx` already establishes outcome comparison and separate publish/approval as the governing product language.

## Changes

1. `src/components/workflow-impact-preview.tsx`
   - Change: remove the numbered `guide` and numbered sidebar/canvas/impact labels. Replace them with a concise sentence in the panel header that names the task: reviewing a proposed change against historical outcomes.
   - Preserve: the explanation that all tickets are synthetic and the connection status.
   - Verify: a visitor can identify the task without learning an artificial three-step sequence.

2. `src/components/workflow-impact-preview.tsx`
   - Change: extend each `states` entry with a recommendation, action label and action-confirmation copy. Render a decision card at the top of the primary content region: selected change, impact number, recommendation, and the scenario-specific action.
   - Preserve: the three existing scenarios and `runReplay()` request to the published n8n webhook.
   - Verify: selecting each scenario makes its recommended action intelligible before replay, and replay replaces the generic “Replay complete” label with the matching next action.

3. `src/components/workflow-impact-preview.tsx`
   - Change: promote the historical comparison to the primary evidence directly below the decision card. Keep “Compare to current” as a secondary view control, but avoid a full workflow view as the default interpretation surface.
   - Preserve: row-level labels such as `MATCH`, `NEW SIDE EFFECT`, `ROUTE CHANGED` and `FAILS`.
   - Verify: on the default `changed` scenario, a user can answer “what would change?” from the title, count and three comparison rows without opening workflow details.

4. `src/components/workflow-impact-preview.tsx` and `src/components/workflow-impact-preview.module.css`
   - Change: place the node flow in a native disclosure titled “Workflow details” with a short helper such as “Open to inspect the route behind this outcome.” Remove dead `.node`, `.edges`, `.flowHint`, drag and obsolete absolute-positioning CSS that no longer has matching markup.
   - Preserve: stage grouping, state emphasis (`emphasis` and `danger`) and the responsive linear flow treatment.
   - Verify: the flow is available for technical inspection, starts closed on desktop and mobile, and no longer competes with the decision on initial view.

5. `src/components/workflow-impact-preview.module.css`
   - Change: give the decision card the largest text scale and clearest border/background treatment in the workspace; give comparison rows a stable visual rhythm; make the scenario selector a compact “Example change” list. Use hierarchy through space, size and weight while retaining the user-approved dark text treatment for neutral copy.
   - Preserve: the light Relay visual language, purple accent, n8n status indicator and existing mobile breakpoints.
   - Verify: the initial desktop viewport shows the decision, recommendation and at least the first comparison evidence before workflow details; no light-grey labels reduce legibility.

6. `src/app/lab/[slug]/page.tsx`
   - Change: reconcile the technical-claim sentence in “Keep publish separate from approval” with the shipped interaction. If the webhook remains public and synthetic-only, state exactly that it calls a published n8n webhook for synthetic scenarios and does not replay or alter customer data. If that claim is not approved, change the UI status to a non-connection claim instead.
   - Preserve: the boundary between modelled examples and customer systems.
   - Verify: article and prototype make the same claim about n8n and synthetic data.

## Scope

- Inherit: the three supported scenario states on the Lab page.
- Verify: default (`changed`), `safe`, `broken`, waiting/error replay response, comparison toggle, 1240px desktop, 960px tablet and 700px mobile layouts.
- Exclude: changes to the actual n8n workflow, customer data, external publishing, drag-and-drop workflow editing and global portfolio style changes.

## Validation

- Product: choose each example change, inspect the recommendation, run the replay and use the resulting scenario-specific action. Expected outcome: the user knows whether to publish, request review or fix permission without needing to parse the node map.
- Interface: verify that the decision card and comparison rows are visible before the collapsed workflow details; confirm status/edge labels remain readable and the action has a distinct completion acknowledgement.
- System: confirm `states` remains the single owner of all scenario-specific copy and outcome data; remove no-longer-rendered flow-map CSS rather than maintaining two workflow visual systems.
- Repository: `npm run lint && npx tsc --noEmit` → exit 0.

## Stop conditions

- Stop if the n8n endpoint can read, write or expose non-synthetic workflow/customer data, or if the public connection claim cannot be verified.
- Stop if the review action needs to publish a live workflow rather than remain an in-prototype acknowledgement.

## Design documentation

- After acceptance and validation: record the rule “decision before topology; topology on demand” in the workflow-impact article’s “Compare outcomes, not node diagrams” section. Do not introduce global design-system documentation for this one-off Lab pattern.
