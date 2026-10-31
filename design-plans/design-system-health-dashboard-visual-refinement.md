# Design-system health dashboard: visual refinement

Current commit: `678d4f4`

## Design language

- Audited surface: the live repository dashboard in `src/components/design-system-health-demo.tsx`, rendered on `/lab/metrics-are-not-decisions`.
- Design sources: local Lab visual language in `src/app/globals.css`, especially `.infrastructure-demo`, `.infrastructure-console`, `.infrastructure-signal`, and `.infrastructure-stats`.
- Documented decisions: dark console, mono metadata, purple and acid-green signal accents, bordered editorial grid.
- Governing owners and consumers: `DesignSystemHealthDemo` owns the dashboard structure; its scoped infrastructure selectors own its presentation.
- Explicit exceptions: None documented.

## Findings

| # | Problem | Evidence | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | The latest workflow outcome is visually similar to supporting copy, despite being the dashboard's primary decision signal. | `DesignSystemHealthDemo` renders the outcome as a plain `<strong>` in `.infrastructure-chart header`; the existing console language already reserves accent colour for status signals. | Add a dedicated status badge and oversized outcome treatment, using green only for passing and an existing warm alert treatment for review. | Latest workflow header and status styles. | High |
| 2 | “Why this matters” is nested inside the main chart column while a second `.infrastructure-signal` sits beside it, making the two cards look like unrelated levels of hierarchy. | The rendered structure places an `.infrastructure-signal` inside `.infrastructure-chart` and another as its grid sibling; both share the same card styling. | Make the primary workflow panel a single composed card with status, explanation and action; reserve the adjacent panel for repository maintenance context. | Dashboard grid markup and scoped styles. | High |
| 3 | The full repository-update date is rendered at metric display size, which gives it the same weight as the component count. | `.infrastructure-stats strong` applies the same large display style to all three statistics, including the date string. | Keep component count as the numeric metric; render the update date as a compact date plus a relative-status label. | Repository stats row and date formatting. | High |

## Improve first

Create one clear workflow-status panel. It has the highest leverage because the dashboard's stated job is to tell a maintainer where to look next, and the current workflow outcome is its only actionable live signal.

## Implementation plan

1. In `src/components/design-system-health-demo.tsx`, derive a `workflowState` object from `data?.workflow?.conclusion` with visible label, explanation and tone class. Keep the current source link and live-data wording.
2. Replace the nested `.infrastructure-signal` in `.infrastructure-chart` with a dedicated workflow summary structure: status badge, one sentence of explanation, update date and original-run action.
3. Keep the existing adjacent repository-activity panel, but add a small “maintenance context” label so it reads as secondary information.
4. Split the date metric in the stats row into a smaller date treatment. Do not change API fields or data semantics.
5. Add scoped CSS modifiers under `.infrastructure-console` in `src/app/globals.css`; reuse the existing dark console, mono labels, purple accent and green status colour. Add a warm review tone only inside this dashboard.
6. Verify mobile layout at the existing `max-width: 800px` breakpoint, ensuring the workflow action remains visible without horizontal overflow.
7. Run `npm run lint` and `npx tsc --noEmit`, then review the published `/lab/metrics-are-not-decisions` route.
