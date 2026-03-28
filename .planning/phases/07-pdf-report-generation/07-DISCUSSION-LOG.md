# Phase 7: PDF Report Generation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-28
**Phase:** 07-pdf-report-generation
**Areas discussed:** PDF Layout & Branding, Content Scope, Download Trigger UX, Disclaimer Treatment
**Mode:** Auto (--auto flag, all recommended defaults selected)

---

## PDF Layout & Branding

| Option | Description | Selected |
|--------|-------------|----------|
| Mirror on-screen layout | Branded header, Financial Anchors, Alerts, Sales Pipeline, Disclaimers — same order as results screen | ✓ |
| Custom PDF-only layout | Different structure optimized specifically for print/PDF reading | |
| Minimal summary | Just numbers in a table, no explanations | |

**User's choice:** [auto] Mirror on-screen layout (recommended default)
**Notes:** Consistency with the results screen the user just reviewed. Professional document layout via @react-pdf/renderer JSX, not a web screenshot.

---

## Content Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Headlines + explanations only | 6 output values with plain-English explanations, alerts, no intermediates | ✓ |
| Full breakdown with intermediates | Include targetBusinessProfit, adjustedPayroll, totalBillableHours, etc. | |
| Numbers only, no explanations | Compact table of values without copy | |

**User's choice:** [auto] Headlines + explanations only (recommended default)
**Notes:** Intermediates add complexity without value for the target user. Input summary included at top for scenario context.

---

## Download Trigger UX

| Option | Description | Selected |
|--------|-------------|----------|
| Button on results screen | "Get Your Trade Survival Report" below Edit button, lazy-loads PDF lib | ✓ |
| Auto-generate on results view | PDF generates immediately when results appear | |
| Separate report page | Navigate to a dedicated report page | |

**User's choice:** [auto] Button on results screen (recommended default)
**Notes:** Lazy-loading is critical for first-paint performance. Phase 9 will gate this behind email capture.

---

## Disclaimer Treatment

| Option | Description | Selected |
|--------|-------------|----------|
| Grouped footer section | All disclaimers collected at end of PDF, clean main content | ✓ |
| Inline with each value | Disclaimers appear next to each relevant number | |
| Separate disclaimer page | Full page of legal text at the end | |

**User's choice:** [auto] Grouped footer section (recommended default)
**Notes:** Professional PDF convention. Same copy as on-screen disclaimers plus a general "consult an accountant" note.

---

## Claude's Discretion

- PDF page layout specifics (margins, fonts, spacing)
- Color scheme (print-optimized vs matching web)
- Financial Anchors grid vs stacked layout
- Alert visual treatment in PDF
- Downloaded file naming convention
- Whether to include report date/timestamp

## Deferred Ideas

None — discussion stayed within phase scope
