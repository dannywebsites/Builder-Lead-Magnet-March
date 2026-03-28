# Phase 5: Results Display - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-28
**Phase:** 05-results-display
**Areas discussed:** Results layout, Transition from form, Output explanations, Recalculate flow
**Mode:** --auto (all decisions auto-selected from recommended defaults)

---

## Results Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Two sections (Financial + Pipeline) | Hero cards for financial anchors at top, secondary group for pipeline below | ✓ |
| Single flat list | All 6 values in one undifferentiated list | |
| Tabbed sections | Financial and Pipeline on separate tabs | |

**User's choice:** [auto] Two sections — mirrors the natural two-part output
**Notes:** Financial Anchors are the primary "shock value" — they answer the core question. Pipeline is the "what to do about it" follow-up.

---

## Transition from Form

| Option | Description | Selected |
|--------|-------------|----------|
| Replace form on same page | Form hides, results render in its place, no URL change | ✓ |
| New route/page | Navigate to /results with output data | |
| Scroll down below form | Form stays visible, results appear below | |

**User's choice:** [auto] Replace form on same page — keeps URL simple, instant transition
**Notes:** Form state preserved in react-hook-form for edit-back flow.

---

## Output Explanations

| Option | Description | Selected |
|--------|-------------|----------|
| Always-visible inline (Phase 4 pattern) | Plain-English note beneath each value, always shown | ✓ |
| Expandable/collapsible | Click to reveal explanation per value | |
| Tooltip on hover | Hover for explanation | |

**User's choice:** [auto] Always-visible inline — consistency with Phase 4 input explanations
**Notes:** Tradespeople shouldn't have to click for context. Same principle as Phase 4 D-04.

---

## Recalculate Flow

| Option | Description | Selected |
|--------|-------------|----------|
| Edit button → return to form (values preserved) | Single button returns to Step 1, all values intact | ✓ |
| Inline editing on results page | Edit values directly on results view | |
| Browser back button only | Rely on URL state to return | |

**User's choice:** [auto] Edit button with preserved values — leverages existing WizardProgress navigation
**Notes:** User lands on Step 1 by default but can click any step in WizardProgress.

---

## Claude's Discretion

- Visual styling of result cards (colors, borders, shadows, spacing)
- Whether to show intermediate calculation values or keep for PDF only
- Animation/transition between form and results
- Exact wording of all output explanations
- Financial Anchors layout (card grid vs stacked)
- Sales Pipeline visual treatment (funnel, cards, list)

## Deferred Ideas

None — discussion stayed within phase scope
