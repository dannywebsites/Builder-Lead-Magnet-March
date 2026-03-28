# Phase 4: Contextual Copy & Input Guidance - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Every input field displays a plain-English explanation and contextual asterisk notes (tax disclaimers, buffer explanations) so tradespeople understand exactly what they are entering and why. This phase also converts the Fixed Costs field from a single number into an itemized category breakdown. No new calculation logic — the engine still receives the same CalculatorInput shape.

</domain>

<decisions>
## Implementation Decisions

### Fixed Costs Breakdown
- **D-01:** Fixed Costs field becomes an itemized category breakdown instead of a single number input. Categories: Vehicle/Van, Premises/Rent, Equipment/Tools, Insurance, Technology/Software, Loans/Finance, Professional Fees, Other.
- **D-02:** Each category is a NumberInput with its own label and explanation. A running total displays at the bottom of the group.
- **D-03:** The form state still stores a single `fixedOverheads` value (the sum of all categories). The calculator engine interface does not change.

### Copy Presentation
- **D-04:** Field explanations are always-visible inline text — no tooltips, accordions, or popovers. Tradespeople should not have to click to understand a field.
- **D-05:** Explanation text appears as a muted paragraph between the label and the input field.
- **D-06:** Asterisk disclaimers (tax buffers, efficiency cap, slippage) appear below the relevant input in a visually distinct style (smaller text, asterisk prefix).

### "Don't Know?" Guidance
- **D-07:** Each financial field shows a "Typical range" as part of the explanation text (e.g., "Most tradespeople pay £1,500 - £3,000/month in fixed costs").
- **D-08:** No default pre-filled values — placeholder text shows a realistic example value instead.
- **D-09:** Use "protect" framing for guardrails, not "limit" framing (e.g., "This protects your margin" not "This limits your input").

### Trade Example Specificity
- **D-10:** Generic examples with trade-relevant framing. Use "e.g. £4,000" style, not per-trade breakdowns.
- **D-11:** Frame in trade language ("your take-home after the business is paid", not "net personal draw"). One example per field.

### Carried from Prior Phases
- **D-12:** All form fields use NumberInput/SelectInput components from Phase 3 (src/components/ui/)
- **D-13:** Zod schemas enforce business rules at schema level — copy should explain WHY the limits exist (Phase 1 D-06)
- **D-14:** Zero-staff fields greyed out but visible — explanation text should still be readable when disabled (Phase 3 D-04)

### Claude's Discretion
- Exact wording of all explanations and disclaimers (tone should be direct, no jargon, conversational)
- Visual styling of explanation text and disclaimer text (colors, font size, spacing)
- Whether to add a FormField wrapper that standardizes label + explanation + input + disclaimer layout
- How to handle the running total display for Fixed Costs categories

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing UI Components
- `src/components/ui/FormField.tsx` — Existing label + error wrapper (may need extension for explanation text)
- `src/components/ui/NumberInput.tsx` — Number input with prefix/suffix, error display
- `src/components/ui/SelectInput.tsx` — Select dropdown with error display

### Step Components (where copy will be added)
- `src/components/wizard/steps/StepBusinessIdentity.tsx` — Entity Type, Currency, VAT Rate
- `src/components/wizard/steps/StepFinancials.tsx` — Gross Personal Draw, Fixed Overheads (becomes itemized)
- `src/components/wizard/steps/StepJobPricing.tsx` — Average Job Value, Direct Cost %
- `src/components/wizard/steps/StepStaff.tsx` — Staff Count, Staff Hourly Rate, Staff Hours Per Week

### Form Infrastructure
- `src/lib/form/step-schemas.ts` — Per-step Zod schemas (Step2Schema will need update for itemized fixed costs)
- `src/lib/form/form-defaults.ts` — Default form values (needs new category fields)
- `src/lib/form/transform.ts` — Transform to CalculatorInput (needs to sum categories into fixedOverheads)

### Calculator Types (unchanged)
- `src/lib/calculator/types.ts` — CalculatorInput interface (fixedOverheads remains a single number)
- `src/lib/calculator/constants.ts` — BUSINESS_RULES with all buffer/cap values for disclaimer text

### Requirements
- `.planning/REQUIREMENTS.md` — FORM-10 (plain-English notes), FORM-11 (asterisk disclaimers)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `NumberInput` component — Already supports prefix, suffix, placeholder, disabled state. Can be reused for each fixed cost category.
- `FormField` component — Has label + error display. Could be extended with an `explanation` prop for the inline help text.
- `SelectInput` component — Supports label + options. Needs explanation text added.
- `BUSINESS_RULES` constants — All buffer values (0.75 efficiency, 1.15 slippage, 1.30 employer burden, 0.80 corp tax) available for referencing in disclaimer copy.

### Established Patterns
- Each step component manages its own layout with a header (h2 + subtitle paragraph) and vertical flex gap
- `useWatch` from react-hook-form used for reactive field dependencies (currency symbol, staff disable)
- Tailwind utility classes for all styling, no custom CSS

### Integration Points
- Step components are the primary edit targets — each gets explanation text and disclaimers
- `StepFinancials` gets the biggest change: single field becomes itemized category breakdown
- `step-schemas.ts` and `form-defaults.ts` need schema/default updates for new category fields
- `transform.ts` needs to sum categories before passing to calculator

</code_context>

<specifics>
## Specific Ideas

- The user explicitly said "Monthly fixed cost is very loose" — the itemized breakdown is a direct response to this feedback
- The user said fields like "Direct Cost %" mean nothing without context — every field must have a "what is this?" explanation
- Use trade language throughout: "your van lease", "tools and equipment", "public liability insurance" — not financial jargon

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-contextual-copy-input-guidance*
*Context gathered: 2026-03-28*
