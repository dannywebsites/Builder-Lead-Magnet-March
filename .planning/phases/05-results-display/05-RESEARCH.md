# Phase 5: Results Display - Research

**Researched:** 2026-03-28
**Domain:** React component architecture, state management, client-side rendering, accessibility
**Confidence:** HIGH

## Summary

Phase 5 wires the existing `calculate()` engine output to an on-screen results view that replaces the wizard form without a page reload. The entire technical surface is React state management (lifting `CalculatorOutput` + `showResults` boolean into `page.tsx`), a new `ResultsView` component tree, and centralized output copy constants following the `field-copy.ts` pattern already established in Phase 4.

No new libraries are needed. The existing stack (React 19, react-hook-form 7, Tailwind CSS 4, nuqs) covers every requirement. The `formatCurrency()` utility handles all monetary display. The `CalculatorOutput` interface already exposes all 6 headline values plus 5 intermediates. The main work is component construction, copy writing, and parent-level state orchestration.

**Primary recommendation:** Lift state to `page.tsx`, build a `ResultsView` component consuming `CalculatorOutput` + `Currency`, and create an `output-copy.ts` constants file mirroring the `field-copy.ts` pattern.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Two-section layout -- Financial Anchors (Monthly Revenue Goal, Monthly Billings, Hourly Floor Rate) as hero cards at top, Sales Pipeline (Jobs to Win, Quotes Needed, Leads Needed) as a secondary group below.
- **D-02:** Financial Anchors are the visual focus -- larger, bolder treatment. Sales Pipeline is important but secondary in visual hierarchy.
- **D-03:** Results replace the form on the same page (no route change, no new URL). The wizard form hides and results render in its place.
- **D-04:** Form state is preserved in react-hook-form so the user can return to editing without re-entering data.
- **D-05:** Each output value has a plain-English explanation displayed inline beneath it, always visible -- same pattern as input field explanations from Phase 4.
- **D-06:** Use trade language, not financial jargon -- consistent with Phase 4 D-10/D-11.
- **D-07:** "Protect" framing carries forward for any guardrail language in explanations.
- **D-08:** An "Edit Your Numbers" button on the results view returns to the form with all values preserved. User lands on Step 1 by default but can navigate to any step via WizardProgress.
- **D-09:** Results state is managed in the parent page component -- form and results are sibling views toggled by a `showResults` boolean.
- **D-10:** When staffCount = 0, Hourly Floor Rate output should show a contextual note (e.g., "Based on your hours only -- no staff billable hours included").
- **D-11:** `calculate()` returns full CalculatorOutput with all 11 fields including intermediates -- results view consumes this directly.
- **D-12:** Currency formatting via existing `formatCurrency()` utility -- all monetary values display in user's selected currency (GBP/EUR) with proper symbol and 2 decimal places.
- **D-13:** Always-visible inline text, no tooltips or accordions.

### Claude's Discretion
- Visual styling of result cards (colors, borders, shadows, spacing)
- Whether to show intermediate calculation values (targetBusinessProfit, adjustedPayroll, etc.) or keep those for PDF only
- Animation/transition when switching from form to results
- Exact wording of all output explanations (tone: direct, no jargon, conversational)
- Whether Financial Anchors use a card grid or stacked layout
- Sales Pipeline visual treatment (numbered funnel, cards, or simple list)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| OUT-01 | Display Monthly Revenue Goal (Net) = MRT | `CalculatorOutput.monthlyRevenueTarget` field, `formatCurrency()` for display |
| OUT-02 | Display Monthly Billings (Gross) = MRT * (1 + VAT_Rate) | `CalculatorOutput.monthlyBillings` field, `formatCurrency()` for display |
| OUT-03 | Display Hourly Floor Rate = MRT / Total_Billable_Hours | `CalculatorOutput.hourlyFloorRate` field, `formatCurrency()` with `decimals: 2`, zero-staff edge case note (D-10) |
| OUT-04 | Display Jobs to Win = MRT / Avg_Job_Value | `CalculatorOutput.jobsToWin` field (already `Math.ceil`), plain number display |
| OUT-05 | Display Quotes Needed = Jobs_to_Win / 0.30 | `CalculatorOutput.quotesNeeded` field (already `Math.ceil`), plain number display |
| OUT-06 | Display Leads Needed = Quotes_Needed / 0.30 | `CalculatorOutput.leadsNeeded` field (already `Math.ceil`), plain number display |
| OUT-07 | Every output displays a plain-English note explaining what it means | `output-copy.ts` constants file, inline explanation pattern from NumberInput/FormField |
| OUT-08 | Results display instantly on-screen after calculation (no page reload) | Parent state toggle in `page.tsx`, no route change, no server call |
</phase_requirements>

## Standard Stack

### Core (Already Installed -- No New Dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.4 | Component rendering for results view | Already in project, all UI built with it |
| react-hook-form | 7.72.0 | Form state preservation during edit-back flow | Already manages wizard state, `getValues()` provides data for calculate |
| Tailwind CSS | 4.x | All styling for result cards, layout, typography | Already used throughout, zero-runtime cost |
| Next.js | 15.5.14 | Page component hosts form/results toggle | Already the framework |

### Supporting (Already Installed)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| nuqs | 2.8.9 | Step query param management for edit-back | Already manages `?step=N`, used when returning to form |

**No new packages needed for this phase.**

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Parent state boolean | URL query param (`?view=results`) | Would add bookmarkable results URL but results depend on form data not in URL -- meaningless without context. Boolean is simpler and matches D-03. |
| Inline explanations | Tooltip/popover | Rejected by D-13. Always-visible text is the locked decision. |
| CSS transition for view switch | framer-motion | Unnecessary dependency for a single transition. CSS `transition` or no animation at all is sufficient. |

## Architecture Patterns

### Recommended Project Structure

```
src/
  components/
    results/
      ResultsView.tsx          # Main results container (receives CalculatorOutput + Currency + onEdit callback)
      FinancialAnchorCard.tsx   # Single financial anchor card (value + label + explanation)
      PipelineMetric.tsx        # Single pipeline metric (value + label + explanation)
  lib/
    results/
      output-copy.ts           # Centralized plain-English explanations for all 6 output values
```

### Pattern 1: Parent State Orchestration (D-09)

**What:** `page.tsx` manages a `showResults` boolean and `CalculatorOutput | null` state. It renders either `WizardForm` or `ResultsView` based on this flag.
**When to use:** Always -- this is the locked decision.
**Example:**

```typescript
// page.tsx pattern
"use client"; // Will need to become a client component or extract a client wrapper

import { useState, Suspense } from "react";
import type { CalculatorOutput } from "@/lib/calculator/types";
import type { Currency } from "@/lib/calculator/types";

export default function Home() {
  const [results, setResults] = useState<{
    output: CalculatorOutput;
    currency: Currency;
    staffCount: number;
  } | null>(null);

  return (
    <main>
      <Suspense>
        {results ? (
          <ResultsView
            output={results.output}
            currency={results.currency}
            staffCount={results.staffCount}
            onEdit={() => setResults(null)}
          />
        ) : (
          <WizardForm
            onCalculated={(output, currency, staffCount) =>
              setResults({ output, currency, staffCount })
            }
          />
        )}
      </Suspense>
    </main>
  );
}
```

**Key detail:** `WizardForm` currently calls `calculate()` internally (line 53 of WizardForm.tsx). It needs a new `onCalculated` callback prop to lift the result to the parent. The form instance (`useForm`) stays mounted or its state is preserved because `react-hook-form` holds values in its internal store -- even if `WizardForm` unmounts and remounts, `defaultValues` can be re-populated from a ref or the parent can keep the form mounted but hidden.

**Critical consideration:** If `WizardForm` unmounts when results show, form state is lost. Two options:
1. Keep `WizardForm` mounted but hidden (`display: none` or `hidden` attribute) -- simplest, preserves all state including dirty/touched.
2. Unmount `WizardForm` and store form values in parent state, re-passing as `defaultValues` on remount -- more complex, potential edge cases with nuqs step param.

**Recommendation:** Option 1 (keep mounted, hide with CSS). This is the simplest way to guarantee D-04 (form state preserved). The form's DOM is lightweight (~4 steps of inputs).

### Pattern 2: Centralized Output Copy (D-05, D-06, D-07)

**What:** A `output-copy.ts` file following the exact `field-copy.ts` pattern.
**When to use:** For all 6 output value explanations.
**Example:**

```typescript
// src/lib/results/output-copy.ts
type OutputCopyEntry = {
  readonly label: string;
  readonly explanation: string;
};

export const OUTPUT_COPY: Record<string, OutputCopyEntry> = {
  monthlyRevenueTarget: {
    label: "Monthly Revenue Goal (Net)",
    explanation: "This is the minimum your business needs to bring in each month before VAT...",
  },
  monthlyBillings: {
    label: "Monthly Billings (Gross)",
    explanation: "This is what actually needs to land in your bank account each month, including VAT...",
  },
  hourlyFloorRate: {
    label: "Hourly Floor Rate",
    explanation: "The absolute minimum you should charge per hour to cover all your costs...",
  },
  jobsToWin: {
    label: "Jobs to Win",
    explanation: "Based on your average job value, this is how many jobs you need to complete each month...",
  },
  quotesNeeded: {
    label: "Quotes to Send",
    explanation: "Assuming roughly 1 in 3 quotes converts to a job, this is how many quotes you need out the door...",
  },
  leadsNeeded: {
    label: "Leads to Generate",
    explanation: "Working backward from quotes, and assuming about 1 in 3 enquiries turn into a quote opportunity...",
  },
} as const;
```

### Pattern 3: Result Card Component

**What:** A reusable card component that displays value + label + explanation.
**When to use:** For each of the 6 output values.

```typescript
// FinancialAnchorCard.tsx pattern
interface FinancialAnchorCardProps {
  label: string;
  value: string;        // Pre-formatted by formatCurrency()
  explanation: string;
  note?: string;        // For edge cases like zero-staff (D-10)
}
```

### Anti-Patterns to Avoid
- **Calculating in the results component:** The calculation is already done. `ResultsView` receives `CalculatorOutput` as a prop -- it should never call `calculate()` itself.
- **Formatting in the copy constants:** Keep `output-copy.ts` as pure text strings. Formatting (`formatCurrency()`) happens in the component at render time, not in the constants file.
- **Route-based results page:** D-03 explicitly locks this as same-page, no URL change. Do not create a `/results` route.
- **Re-validating on edit-back:** D-08 says the user returns to the form with all values preserved. No re-validation on return -- they already submitted valid data.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Currency formatting | Custom string concatenation | `formatCurrency(value, currency)` from `src/lib/calculator/currency.ts` | Already handles GBP/EUR locale, decimal places, symbol positioning |
| Number rounding | `toFixed(2)` | `roundCurrency()` from `src/lib/calculator/currency.ts` | Avoids floating point drift, already used by engine |
| Form state preservation | Manual state storage | react-hook-form's internal store (keep component mounted) | Battle-tested, handles dirty/touched state, integrates with existing wizard |

## Common Pitfalls

### Pitfall 1: Form State Lost on Unmount
**What goes wrong:** If `WizardForm` unmounts when results display, all form state (values, dirty fields, touched fields) is destroyed. User clicks "Edit Your Numbers" and gets a blank form.
**Why it happens:** `useForm` state lives in the component instance. Unmounting destroys it.
**How to avoid:** Keep `WizardForm` mounted but hidden (CSS `hidden` class or conditional className). Only toggle visibility.
**Warning signs:** Form resets to defaults after clicking "Edit Your Numbers."

### Pitfall 2: Hourly Floor Rate Division by Zero
**What goes wrong:** When `staffCount = 0`, `totalBillableHours = 0`, and `hourlyFloorRate = 0`. The value displays as "$0.00" which is misleading.
**Why it happens:** Engine already handles this (`totalBillableHours > 0 ? ... : 0` on line 94 of engine.ts). But displaying "0" without context confuses the user.
**How to avoid:** D-10 requires a contextual note. Check `staffCount` (passed as prop) and render the note when it equals 0. Note: hourlyFloorRate being 0 with zero staff is correct behavior -- the user has no billable hours through staff, so this metric is not meaningful for solo operators.
**Warning signs:** User sees "$0.00/hr" with no explanation.

### Pitfall 3: Suspense Boundary and Client Components
**What goes wrong:** `page.tsx` currently renders `WizardForm` inside a `<Suspense>` boundary because `WizardForm` uses `useSearchParams` via nuqs. If `page.tsx` gains `useState` for results management, it becomes a client component itself.
**Why it happens:** `useState` requires `"use client"`. But the Suspense boundary is needed for nuqs `useQueryState`.
**How to avoid:** Extract a `CalculatorApp` client component that manages the `showResults` state and contains the Suspense boundary. Keep `page.tsx` as a server component that renders `<CalculatorApp />`.
**Warning signs:** Build errors about `useState` in server components, or hydration mismatches.

### Pitfall 4: formatCurrency Decimal Precision
**What goes wrong:** Hourly Floor Rate should show 2 decimal places (e.g., "23.47/hr"), but the default `formatCurrency()` uses 0 decimals.
**Why it happens:** `formatCurrency()` defaults to `decimals: 0` per the existing implementation.
**How to avoid:** Pass `{ decimals: 2 }` for hourlyFloorRate. Pipeline numbers (jobsToWin, quotesNeeded, leadsNeeded) are integers and should display without decimals or currency symbols.
**Warning signs:** Hourly rate shows as "23" instead of "23.47".

### Pitfall 5: Pipeline Numbers Are Not Currency
**What goes wrong:** Applying `formatCurrency()` to jobsToWin/quotesNeeded/leadsNeeded would show them as "$12" when they should just be "12".
**Why it happens:** Copy-paste from financial anchor card rendering.
**How to avoid:** Pipeline metrics use plain number display (e.g., `value.toLocaleString()` or just `String(value)`). Only the 3 Financial Anchors use `formatCurrency()`.
**Warning signs:** "You need to win $12 jobs this month" -- the dollar sign makes no sense.

## Code Examples

### WizardForm Callback Integration

```typescript
// Current handleCalculate in WizardForm.tsx (lines 45-57)
// BEFORE:
const handleCalculate = useCallback(async () => {
  const schema = STEP_SCHEMAS[3];
  const fieldNames = Object.keys(schema.shape) as Array<keyof FormValues>;
  const valid = await methods.trigger(fieldNames);
  if (!valid) return;

  const data = methods.getValues();
  const input = transformToCalculatorInput(data);
  const result = calculate(input);
  console.log("Calculation result:", result);
  alert(`Monthly Revenue Target: ${result.monthlyRevenueTarget}`);
}, [methods]);

// AFTER: Lift result to parent via callback prop
interface WizardFormProps {
  onCalculated: (output: CalculatorOutput, currency: Currency, staffCount: number) => void;
}

const handleCalculate = useCallback(async () => {
  const schema = STEP_SCHEMAS[3];
  const fieldNames = Object.keys(schema.shape) as Array<keyof FormValues>;
  const valid = await methods.trigger(fieldNames);
  if (!valid) return;

  const data = methods.getValues();
  const input = transformToCalculatorInput(data);
  const result = calculate(input);
  onCalculated(result, data.currency, data.staffCount);
}, [methods, onCalculated]);
```

### Parent Orchestrator Component

```typescript
// src/components/CalculatorApp.tsx
"use client";

import { useState, Suspense } from "react";
import type { CalculatorOutput, Currency } from "@/lib/calculator/types";
import WizardForm from "@/components/wizard/WizardForm";
import { ResultsView } from "@/components/results/ResultsView";

interface ResultsState {
  output: CalculatorOutput;
  currency: Currency;
  staffCount: number;
}

export function CalculatorApp() {
  const [results, setResults] = useState<ResultsState | null>(null);

  return (
    <Suspense>
      <div className={results ? "hidden" : ""}>
        <WizardForm
          onCalculated={(output, currency, staffCount) =>
            setResults({ output, currency, staffCount })
          }
        />
      </div>
      {results && (
        <ResultsView
          output={results.output}
          currency={results.currency}
          staffCount={results.staffCount}
          onEdit={() => setResults(null)}
        />
      )}
    </Suspense>
  );
}
```

### formatCurrency Usage by Output Type

```typescript
// Financial Anchors -- currency formatted
formatCurrency(output.monthlyRevenueTarget, currency)           // "GBP 8,234" or "EUR 8,234"
formatCurrency(output.monthlyBillings, currency)                // "GBP 9,881"
formatCurrency(output.hourlyFloorRate, currency, { decimals: 2 }) // "GBP 25.34"

// Pipeline numbers -- plain integers, no currency
String(output.jobsToWin)     // "12"
String(output.quotesNeeded)  // "40"
String(output.leadsNeeded)   // "134"
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Lifting state with Redux/Zustand | Parent component state + props | N/A (project decision) | No extra dependencies; simple prop drilling for 2 sibling components |
| Route-based multi-page forms | Single-page with visibility toggle | N/A (project decision D-03) | Simpler, faster transitions, form state automatically preserved |
| Tooltip-based explanations | Always-visible inline text | N/A (project decision D-13) | Better accessibility, no hover/click required |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 |
| Config file | `vitest.config.ts` (root) |
| Quick run command | `pnpm test` |
| Full suite command | `pnpm test` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| OUT-01 | Monthly Revenue Goal displays correctly | unit | `pnpm vitest run src/components/results/__tests__/ResultsView.test.tsx -t "monthly revenue"` | No -- Wave 0 |
| OUT-02 | Monthly Billings displays correctly | unit | `pnpm vitest run src/components/results/__tests__/ResultsView.test.tsx -t "monthly billings"` | No -- Wave 0 |
| OUT-03 | Hourly Floor Rate displays with 2 decimals | unit | `pnpm vitest run src/components/results/__tests__/ResultsView.test.tsx -t "hourly floor"` | No -- Wave 0 |
| OUT-04 | Jobs to Win displays as integer | unit | `pnpm vitest run src/components/results/__tests__/ResultsView.test.tsx -t "jobs to win"` | No -- Wave 0 |
| OUT-05 | Quotes Needed displays as integer | unit | `pnpm vitest run src/components/results/__tests__/ResultsView.test.tsx -t "quotes needed"` | No -- Wave 0 |
| OUT-06 | Leads Needed displays as integer | unit | `pnpm vitest run src/components/results/__tests__/ResultsView.test.tsx -t "leads needed"` | No -- Wave 0 |
| OUT-07 | Each output has plain-English explanation | unit | `pnpm vitest run src/components/results/__tests__/ResultsView.test.tsx -t "explanation"` | No -- Wave 0 |
| OUT-08 | Results render without page reload | unit | `pnpm vitest run src/components/results/__tests__/ResultsView.test.tsx -t "renders"` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm test`
- **Per wave merge:** `pnpm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/components/results/__tests__/ResultsView.test.tsx` -- covers OUT-01 through OUT-08 (render tests with mock CalculatorOutput)
- [ ] Vitest environment may need `jsdom` for component tests -- current config uses `environment: "node"` which cannot render React components. Will need `environment: "jsdom"` or a per-file `@vitest-environment jsdom` comment.
- [ ] `@testing-library/react` and `@testing-library/jest-dom` -- not currently installed, needed for component render tests

**Note:** Component tests for this phase require DOM rendering. The current vitest config uses `environment: "node"`. Options: (a) install `@testing-library/react` + `jsdom` and add a test environment override, or (b) test only the data layer (output-copy constants, formatCurrency integration) and rely on human verification for visual rendering. Given this is a UI phase with `ui_safety_gate: true`, human verification will happen regardless -- automated tests should focus on data correctness (right values formatted correctly) rather than DOM structure.

## Open Questions

1. **Intermediate values on-screen vs PDF-only**
   - What we know: `CalculatorOutput` includes 5 intermediates (targetBusinessProfit, adjustedPayroll, totalBillableHours, realDirectCost, adjustedOverheads). D-11 says the view consumes the full output.
   - What's unclear: User left this as Claude's discretion.
   - Recommendation: Keep the on-screen view clean with just the 6 headline values. Intermediates add clutter for a tradesperson who wants the bottom line. Reserve intermediates for the PDF report (Phase 7) where space is abundant and users expect detail.

2. **Zero-staff hourly rate display**
   - What we know: Engine returns 0 when staffCount = 0. D-10 says show a contextual note.
   - What's unclear: Whether to hide the card entirely or show it with the note.
   - Recommendation: Show the card with the note. Hiding it would create a jarring layout difference between solo and staffed users. The note explains why the value is not meaningful.

## Project Constraints (from CLAUDE.md)

- **Tech stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, Biome -- all styling via Tailwind utility classes
- **No login:** Calculator works without authentication
- **Static export:** `output: 'export'` -- no server-side features
- **GSD Workflow:** All changes through GSD commands
- **Biome:** Linting and formatting via Biome (not ESLint/Prettier)
- **pnpm:** Package manager
- **Feature-based folders:** `src/lib/` for logic, `src/components/` for UI, feature subdirectories within each

## Sources

### Primary (HIGH confidence)
- `src/lib/calculator/types.ts` -- CalculatorOutput interface with all 11 fields
- `src/lib/calculator/engine.ts` -- calculate() function, zero-staff handling (line 94)
- `src/lib/calculator/currency.ts` -- formatCurrency() with decimals option, roundCurrency()
- `src/components/wizard/WizardForm.tsx` -- current handleCalculate implementation (lines 45-57)
- `src/app/page.tsx` -- current parent component structure with Suspense boundary
- `src/lib/form/field-copy.ts` -- established pattern for centralized copy constants
- `src/components/ui/NumberInput.tsx` -- explanation/disclaimer prop pattern
- `package.json` -- all current dependency versions verified

### Secondary (MEDIUM confidence)
- React documentation on conditional rendering and state preservation -- well-established patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already installed and in use, no new dependencies
- Architecture: HIGH -- patterns directly derived from existing codebase conventions and locked decisions
- Pitfalls: HIGH -- identified from reading actual source code (Suspense boundary, formatCurrency defaults, engine zero-staff handling)

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (stable -- no external dependencies to go stale)
