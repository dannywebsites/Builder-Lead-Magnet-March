# Phase 3: Multi-Step Input Form - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-28
**Phase:** 03-multi-step-input-form
**Areas discussed:** Step grouping

---

## Step Grouping

### Q1: How should the 10 inputs be grouped across wizard steps?

| Option | Description | Selected |
|--------|-------------|----------|
| 3 steps (Recommended) | Step 1: Entity+Currency+VAT. Step 2: Draw+Overheads+Staff x3. Step 3: Job Value+Direct Cost. Fewest clicks. | |
| 4 steps | Step 1: Entity+Currency+VAT. Step 2: Draw+Overheads. Step 3: Staff x3. Step 4: Job Value+Direct Cost. | ✓ |
| 5 steps (one per concept) | Most hand-holding, most clicks. | |

**User's choice:** 4 steps
**Notes:** Balances granularity with speed.

### Q2: Should Entity Type + Currency + VAT be separate dropdowns?

| Option | Description | Selected |
|--------|-------------|----------|
| 3 separate selects | Each independent, matches Phase 1 D-02 | ✓ |
| 2 selects + auto | Currency auto-inferred from VAT | |
| You decide | Claude picks best UX | |

**User's choice:** 3 separate selects
**Notes:** Consistent with Phase 1 decision that currency and VAT are independent.

### Q3: How should Direct Cost % be presented?

| Option | Description | Selected |
|--------|-------------|----------|
| Percentage slider + number | Visual, interactive, slider enforces 80% cap | |
| Number input only | Plain field with % suffix, error if >80% | |
| You decide | Claude picks | ✓ |

**User's choice:** You decide
**Notes:** Claude has discretion on input style for Direct Cost %.

### Q4: When staffCount is 0, should staff fields hide or grey out?

| Option | Description | Selected |
|--------|-------------|----------|
| Hide staff fields | Disappear when count=0, cleaner | |
| Grey out fields | Stay visible but disabled with 0 values | ✓ |
| You decide | Claude picks | |

**User's choice:** Grey out fields
**Notes:** User wants fields visible so sole operators can see what they'd fill in with staff.

## Claude's Discretion

- Form layout and visual style
- Validation UX (timing, placement)
- Navigation behavior
- Progress indicator design
- URL state management
- Keyboard navigation and accessibility

## Deferred Ideas

None
