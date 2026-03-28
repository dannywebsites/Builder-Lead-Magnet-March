# Phase 4: Contextual Copy & Input Guidance - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-28
**Phase:** 04-contextual-copy-input-guidance
**Areas discussed:** Fixed Costs Breakdown, Copy Presentation, "Don't Know?" Guidance, Trade Example Specificity
**Mode:** Auto (all areas auto-selected, recommended defaults chosen)

---

## Fixed Costs Breakdown

| Option | Description | Selected |
|--------|-------------|----------|
| Itemized category inputs | Break Fixed Costs into 8 categories with running total | ✓ |
| Single field with guidance | Keep single number but add category checklist as guidance | |
| Expandable sub-form | Collapsible section that expands to show categories | |

**User's choice:** [auto] Itemized category inputs (recommended default)
**Notes:** User explicitly flagged "Monthly fixed cost is very loose" in prior conversation. Memory note confirms itemized breakdown is required. Categories: Vehicle/Van, Premises/Rent, Equipment/Tools, Insurance, Technology/Software, Loans/Finance, Professional Fees, Other.

---

## Copy Presentation

| Option | Description | Selected |
|--------|-------------|----------|
| Always-visible inline text | Muted paragraph between label and input, always shown | ✓ |
| Tooltip/popover on icon | Info icon next to label, hover/click to reveal explanation | |
| Expandable accordion | "What is this?" link that expands to show explanation | |

**User's choice:** [auto] Always-visible inline text (recommended default)
**Notes:** Target users are tradespeople who need zero friction. Hiding explanations behind clicks adds cognitive load. Memory note says "Every field needs rich explanations" — always-visible aligns with this.

---

## "Don't Know?" Guidance

| Option | Description | Selected |
|--------|-------------|----------|
| Inline suggested ranges | "Typical range: £X - £Y" as part of explanation text | ✓ |
| Pre-filled defaults | Sensible defaults user can adjust | |
| Interactive "help me estimate" | Modal/popover with guided estimation steps | |

**User's choice:** [auto] Inline suggested ranges (recommended default)
**Notes:** Pre-filled defaults would bias calculations. Interactive estimation adds scope beyond Phase 4. Inline ranges give confidence without influencing the number.

---

## Trade Example Specificity

| Option | Description | Selected |
|--------|-------------|----------|
| Generic with trade framing | "e.g. £4,000" in trade language, one example per field | ✓ |
| Per-trade breakdown | "Plumber: £3k-5k, Electrician: £2.5k-4k" matrix | |
| Dynamic by trade selection | Add trade type selector, show tailored examples | |

**User's choice:** [auto] Generic with trade framing (recommended default)
**Notes:** Per-trade breakdowns add maintenance burden and risk being wrong for specific markets. Dynamic selection adds a new input field (scope creep). Generic examples in trade language are sufficient.

---

## Claude's Discretion

- Exact copy wording for all explanations and disclaimers
- Visual styling of explanation/disclaimer text
- FormField component extension approach
- Running total display design for Fixed Costs

## Deferred Ideas

None — discussion stayed within phase scope
