# Phase 5: Results Display - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

After form submission, headline financial anchors and sales pipeline numbers render instantly on-screen with plain-English explanations — no page reload, no server round-trip. This phase creates the results view and wires it to the existing calculation engine. Legal alerts (Phase 6), PDF generation (Phase 7), and email capture (Phase 9) are out of scope.

</domain>

<decisions>
## Implementation Decisions

### Results Layout
- **D-01:** Two-section layout — Financial Anchors (Monthly Revenue Goal, Monthly Billings, Hourly Floor Rate) as hero cards at top, Sales Pipeline (Jobs to Win, Quotes Needed, Leads Needed) as a secondary group below.
- **D-02:** Financial Anchors are the visual focus — larger, bolder treatment. Sales Pipeline is important but secondary in visual hierarchy.

### Transition from Form
- **D-03:** Results replace the form on the same page (no route change, no new URL). The wizard form hides and results render in its place.
- **D-04:** Form state is preserved in react-hook-form so the user can return to editing without re-entering data.

### Output Explanations
- **D-05:** Each output value has a plain-English explanation displayed inline beneath it, always visible — same pattern as input field explanations from Phase 4 (carries forward D-04/D-05 from Phase 4).
- **D-06:** Use trade language, not financial jargon — consistent with Phase 4 D-10/D-11. Example: "This is the minimum your business needs to bring in each month before you can pay yourself" not "Minimum Revenue Target".
- **D-07:** "Protect" framing carries forward for any guardrail language in explanations (Phase 4 D-09).

### Recalculate Flow
- **D-08:** An "Edit Your Numbers" button on the results view returns to the form with all values preserved. User lands on Step 1 by default but can navigate to any step via WizardProgress.
- **D-09:** Results state is managed in the parent page component — form and results are sibling views toggled by a `showResults` boolean.

### Zero-Staff Edge Case
- **D-10:** When staffCount = 0, Hourly Floor Rate output should show a contextual note (e.g., "Based on your hours only — no staff billable hours included"). The value still calculates correctly (engine handles this).

### Carried from Prior Phases
- **D-11:** `calculate()` returns full CalculatorOutput with all 11 fields including intermediates (Phase 2 D-01) — results view consumes this directly.
- **D-12:** Currency formatting via existing `formatCurrency()` utility — all monetary values display in user's selected currency (GBP/EUR) with proper symbol and 2 decimal places.
- **D-13:** Always-visible inline text, no tooltips or accordions (Phase 4 D-04).

### Claude's Discretion
- Visual styling of result cards (colors, borders, shadows, spacing)
- Whether to show intermediate calculation values (targetBusinessProfit, adjustedPayroll, etc.) or keep those for PDF only
- Animation/transition when switching from form to results
- Exact wording of all output explanations (tone: direct, no jargon, conversational)
- Whether Financial Anchors use a card grid or stacked layout
- Sales Pipeline visual treatment (numbered funnel, cards, or simple list)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Calculator Output (Source of Truth)
- `src/lib/calculator/types.ts` — CalculatorOutput interface with all 11 output fields (monthlyRevenueTarget, monthlyBillings, hourlyFloorRate, jobsToWin, quotesNeeded, leadsNeeded, plus intermediates)
- `src/lib/calculator/engine.ts` — calculate() function that produces CalculatorOutput
- `src/lib/calculator/currency.ts` — formatCurrency() utility for GBP/EUR display

### Current Form (Integration Point)
- `src/components/wizard/WizardForm.tsx` — handleCalculate currently alerts result; needs to pass CalculatorOutput to results view instead
- `src/app/page.tsx` — Parent page that hosts WizardForm; will need state management for form/results toggle

### Existing UI Patterns
- `src/components/ui/NumberInput.tsx` — Has explanation/disclaimer prop pattern (reference for consistent results copy styling)
- `src/components/ui/FormField.tsx` — Label + explanation + error layout pattern
- `src/lib/form/field-copy.ts` — Centralized copy constants pattern (reference for output copy organization)

### Requirements
- `.planning/REQUIREMENTS.md` — OUT-01 through OUT-08 (all output display requirements)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `formatCurrency(value, currency)` — Ready for formatting all monetary output values
- `NumberInput` explanation/disclaimer pattern — Can inform consistent styling for output explanations
- `field-copy.ts` pattern — Centralized copy constants can be replicated for output explanations
- `WizardProgress` — Already supports clickable completed steps, useful for edit-back navigation

### Established Patterns
- `useWatch` from react-hook-form for reactive state (used for currency symbol in form)
- Tailwind utility classes for all styling
- Feature-based folder structure (`src/lib/calculator/`, `src/lib/form/`, `src/components/wizard/`)
- Suspense boundary around client components using useSearchParams (nuqs)

### Integration Points
- `WizardForm.handleCalculate()` — Currently logs + alerts. Needs to call a callback prop or manage parent state to show results.
- `page.tsx` — Will become the orchestrator managing `showResults` state and passing CalculatorOutput to the results component.
- `transformToCalculatorInput()` — Already validated; results view receives the output of `calculate(transformToCalculatorInput(formData))`.

</code_context>

<specifics>
## Specific Ideas

- The two-section split (Financial Anchors + Sales Pipeline) mirrors the calculator's two-part value proposition: "what your business must earn" and "how much sales activity that requires"
- Output explanations should feel like a knowledgeable friend explaining the numbers, not a financial report
- The "Edit Your Numbers" flow should feel instant — no loading states, no re-validation on return

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-results-display*
*Context gathered: 2026-03-28*
