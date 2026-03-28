# Phase 6: Legal Alerts - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-28
**Phase:** 06-legal-alerts
**Areas discussed:** Alert Placement, Alert Visual Treatment, Alert Trigger Logic, Efficiency Cap Behavior
**Mode:** --auto (all areas auto-selected, recommended defaults chosen)

---

## Alert Placement

| Option | Description | Selected |
|--------|-------------|----------|
| Between Financial Anchors and Sales Pipeline | Dedicated section in the visual flow — important but doesn't displace headline numbers | ✓ |
| Below all results | Less prominent, risk of being missed on mobile | |
| Inline with relevant output cards | Contextual but clutters the clean card layout | |

**User's choice:** [auto] Between Financial Anchors and Sales Pipeline (recommended default)
**Notes:** Alerts are legal notices that users must see. Placing between the two main sections ensures visibility without disrupting the headline financial numbers.

---

## Alert Visual Treatment

| Option | Description | Selected |
|--------|-------------|----------|
| Amber/warning cards with icon | Distinct from output cards (white/gray), uses familiar warning pattern | ✓ |
| Red/danger cards | Too alarming for informational legal notices | |
| Subtle inline text | Risk of being missed — these are important legal warnings | |

**User's choice:** [auto] Amber/warning cards with icon (recommended default)
**Notes:** Consistent with "protect" framing. Should feel helpful, not alarming.

---

## Alert Trigger Logic

| Option | Description | Selected |
|--------|-------------|----------|
| Separate pure function module | Follows existing calculator pattern, independently testable | ✓ |
| Embedded in calculation engine | Couples alerts to math, harder to test separately | |
| Inline in ResultsView component | Mixes logic with rendering, violates separation pattern | |

**User's choice:** [auto] Separate pure function module (recommended default)
**Notes:** Mirrors existing `engine.ts` pattern — pure functions, full test coverage.

---

## Efficiency Cap Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Always display when staff > 0 | Per ROADMAP.md success criteria — cap is always relevant with staff | ✓ |
| Only display when user "attempts override" | No override mechanism exists (75% is hard-coded), so this trigger is unclear | |
| Always display regardless of staff count | Over-alerts solo traders where billable hours = 0 | |

**User's choice:** [auto] Always display when staff > 0 (recommended default)
**Notes:** Per roadmap: "Efficiency cap explanation displays if 75% cap is relevant (always, for staff > 0)." The 75% cap is hard-coded and non-overridable, so the alert explains WHY it exists.

---

## Claude's Discretion

- Exact amber/warning color values and border treatment
- Alert icon choice
- Alert grouping vs flat list
- Exact wording of all alert copy
- Animation/transition
- Alert ordering

## Deferred Ideas

None — discussion stayed within phase scope
