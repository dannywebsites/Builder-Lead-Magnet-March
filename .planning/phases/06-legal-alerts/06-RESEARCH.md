# Phase 6: Legal Alerts - Research

**Researched:** 2026-03-28
**Domain:** Conditional alert logic + alert display components (React/TypeScript/Tailwind)
**Confidence:** HIGH

## Summary

Phase 6 is a focused, self-contained feature: pure functions that evaluate calculator inputs/outputs against legal trigger conditions, and React components that render the triggered alerts on the results screen. No new libraries are needed -- the entire phase uses existing project infrastructure (TypeScript for logic, Tailwind for styling, Vitest for testing).

The codebase already has clean patterns to follow: pure calculation functions in `src/lib/calculator/`, centralized copy constants in dedicated files (`field-copy.ts`, `output-copy.ts`), and card-style result components (`FinancialAnchorCard`, `PipelineMetric`). The alert system replicates these patterns with amber/warning visual treatment.

**Primary recommendation:** Build the alert trigger module as a pure function (`src/lib/calculator/alerts.ts`) that takes `CalculatorInput` + `CalculatorOutput` and returns an array of triggered `Alert` objects. Unit test each trigger independently. Build a single `AlertCard` component and an `AlertsSection` container. Wire into `ResultsView` between Financial Anchors and Sales Pipeline sections.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- D-01: Alerts display in a dedicated section between Financial Anchors and Sales Pipeline sections on the results screen
- D-02: Only triggered alerts display -- no empty section or placeholder when no alerts fire
- D-03: Amber/warning-styled cards with icon and plain-English explanation text, visually distinct from both anchor cards and pipeline metrics
- D-04: "Protect" framing for all alert copy
- D-05: Trade language, no financial jargon
- D-06: Always-visible inline text, no collapsible/accordion/tooltip treatment
- D-07: Alert triggers in separate pure function module (`src/lib/calculator/alerts.ts`)
- D-08: Each alert has unique key, title, body text, and trigger condition -- fully testable independently
- D-09: ALRT-01 (Gross Draw Warning) always displays for both entity types
- D-10: ALRT-02 (Irish Two-Thirds Rule) triggers when vatRate === 0.135 AND directCostPct > 0.66
- D-11: ALRT-03 (Efficiency Cap) always displays when staffCount > 0
- D-12: ALRT-04 (CIS/RCT Warning) always displays
- D-13: Centralized alert copy constants in `src/lib/results/alert-copy.ts`
- D-14: Two-section results layout preserved (Phase 5 D-01/D-02) -- alerts insert between
- D-15: ResultsView is the integration point -- receives CalculatorOutput, currency, and staffCount
- D-16: Currency formatting via formatCurrency() for any monetary values in alerts

### Claude's Discretion
- Exact amber/warning color values and border treatment (within Tailwind palette)
- Alert icon choice (warning triangle, info circle, etc.)
- Whether to group alerts by type or display as a flat list
- Exact wording of all alert copy (tone: direct, protective, conversational)
- Animation/transition for alerts appearing
- Order of alerts when multiple trigger simultaneously

### Deferred Ideas (OUT OF SCOPE)
None
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ALRT-01 | Gross Draw Warning -- displayed for both entity types, explains personal tax is not covered by the business target | Pure trigger function (always true), alert copy constant, AlertCard render |
| ALRT-02 | Irish Two-Thirds Rule -- IF vatRate == 13.5% AND directCostPct > 0.66 THEN alert: must use 23% rate | Conditional trigger function using CalculatorInput.vatRate and directCostPct |
| ALRT-03 | Efficiency Cap Warning -- IF staffCount > 0, display explanation that billable hours are hard-capped at 75% | Conditional trigger function using CalculatorInput.staffCount |
| ALRT-04 | CIS/RCT Subcontractor Warning -- alert about cash flow impact of withholding tax (up to 30% UK / 35% IE) | Pure trigger function (always true), alert copy constant |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- Tech stack: Next.js 15 / React 19 / TypeScript / Tailwind CSS 4
- No heavy frameworks; fast first paint
- No login/auth
- Tax accuracy uses conservative buffers (20% Corp Tax, 30% employer burden) -- not precise statutory rates
- Input validation: direct cost % capped at 80%, billable hours capped at 75% (hard limits)
- Markets: UK and Ireland only
- Toast notifications via sonner for validation alerts (though this phase uses inline alerts, not toasts)
- Biome for linting/formatting
- pnpm as package manager

## Standard Stack

No new libraries needed. This phase uses exclusively existing project dependencies.

### Core (Already Installed)
| Library | Purpose in This Phase |
|---------|----------------------|
| TypeScript | Alert trigger logic types and interfaces |
| React 19 | AlertCard and AlertsSection components |
| Tailwind CSS 4 | Amber/warning card styling |
| Vitest + jsdom | Unit tests for trigger functions and component rendering |

### No New Installations Required
```bash
# Nothing to install -- all dependencies already in place
```

## Architecture Patterns

### New Files to Create
```
src/
├── lib/
│   ├── calculator/
│   │   └── alerts.ts           # Pure trigger functions + Alert type
│   └── results/
│       └── alert-copy.ts       # Centralized alert copy constants
├── components/
│   └── results/
│       ├── AlertCard.tsx        # Single alert card component
│       └── AlertsSection.tsx    # Container that renders triggered alerts
```

### Modified Files
```
src/
├── components/
│   ├── CalculatorApp.tsx        # Pass CalculatorInput data to ResultsView
│   └── results/
│       └── ResultsView.tsx      # Add alerts section between anchors and pipeline
```

### Pattern 1: Alert Type and Trigger Module

**What:** A pure function module that evaluates inputs against trigger conditions and returns an array of alert objects.
**When to use:** Follows the established pattern of pure calculation functions in `src/lib/calculator/`.

```typescript
// src/lib/calculator/alerts.ts

import type { CalculatorInput, CalculatorOutput } from "./types";

export interface Alert {
  key: "gross-draw" | "two-thirds-rule" | "efficiency-cap" | "cis-rct";
  title: string;
  body: string;
}

export function getTriggeredAlerts(
  input: CalculatorInput,
  output: CalculatorOutput,
): Alert[] {
  const alerts: Alert[] = [];

  // ALRT-01: Always fires for both entity types
  alerts.push({ key: "gross-draw", title: TITLE, body: BODY });

  // ALRT-02: Irish Two-Thirds Rule
  if (input.vatRate === 0.135 && input.directCostPct > 0.66) {
    alerts.push({ key: "two-thirds-rule", title: TITLE, body: BODY });
  }

  // ALRT-03: Efficiency Cap -- only when staff > 0
  if (input.staffCount > 0) {
    alerts.push({ key: "efficiency-cap", title: TITLE, body: BODY });
  }

  // ALRT-04: CIS/RCT -- always fires
  alerts.push({ key: "cis-rct", title: TITLE, body: BODY });

  return alerts;
}
```

### Pattern 2: Centralized Alert Copy Constants

**What:** Follows the exact pattern from `output-copy.ts` and `field-copy.ts`.

```typescript
// src/lib/results/alert-copy.ts

type AlertCopyEntry = {
  readonly title: string;
  readonly body: string;
};

export const ALERT_COPY = {
  "gross-draw": {
    title: "...",
    body: "...",
  },
  "two-thirds-rule": {
    title: "...",
    body: "...",
  },
  "efficiency-cap": {
    title: "...",
    body: "...",
  },
  "cis-rct": {
    title: "...",
    body: "...",
  },
} as const satisfies Record<string, AlertCopyEntry>;
```

### Pattern 3: AlertCard Component

**What:** Amber/warning styled card visually distinct from both `FinancialAnchorCard` (white bg/shadow) and `PipelineMetric` (gray-50).

```typescript
// src/components/results/AlertCard.tsx

interface AlertCardProps {
  title: string;
  body: string;
}

export function AlertCard({ title, body }: AlertCardProps) {
  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-6">
      {/* Icon + title row */}
      <div className="flex items-start gap-3">
        <svg {/* warning triangle icon */} />
        <div>
          <p className="text-sm font-semibold text-amber-800">{title}</p>
          <p className="mt-1 text-sm text-amber-700">{body}</p>
        </div>
      </div>
    </div>
  );
}
```

### Pattern 4: Data Flow for Alerts

**What:** `CalculatorApp` currently passes only `output`, `currency`, and `staffCount` to `ResultsView`. Alerts need access to `CalculatorInput` fields (entityType, vatRate, directCostPct). Two options:

**Recommended approach:** Compute alerts at the `CalculatorApp` level and pass the alerts array down to `ResultsView`. This keeps ResultsView as a pure display component and moves all logic upstream.

```typescript
// CalculatorApp.tsx -- compute alerts before passing to ResultsView
interface ResultsState {
  output: CalculatorOutput;
  currency: Currency;
  staffCount: number;
  alerts: Alert[];  // Add alerts to state
}

// In the onCalculated callback:
const alerts = getTriggeredAlerts(input, output);
setResults({ output, currency, staffCount, alerts });
```

**Alternative:** Pass the full `CalculatorInput` to `ResultsView` and let it compute alerts. But this breaks the existing pattern where ResultsView is a display-only component.

### Anti-Patterns to Avoid
- **Embedding alert logic in components:** Trigger logic must be in `alerts.ts`, not in JSX conditionals scattered across components. This ensures testability.
- **Hardcoding alert text in components:** All copy goes in `alert-copy.ts` per the established centralized copy pattern.
- **Using sonner toasts for legal alerts:** Toasts are for transient validation feedback. Legal alerts are persistent, always-visible notices per D-06.
- **Rendering empty alert section:** Per D-02, if no alerts trigger (theoretically impossible since ALRT-01 and ALRT-04 always fire, but defensively), render nothing.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Alert icon SVG | Custom icon component library | Inline SVG or Heroicons-style inline path | One icon needed (warning triangle). A single inline SVG is cleaner than adding an icon library dependency. |

**Key insight:** This phase is pure application logic -- no complex problems requiring external solutions. The "don't hand-roll" principle doesn't apply here because there are no deceptively complex sub-problems.

## Common Pitfalls

### Pitfall 1: Two-Thirds Rule Floating Point Comparison
**What goes wrong:** `input.directCostPct > 0.66` may behave unexpectedly if the value stored is something like `0.6600000000000001` due to floating point arithmetic.
**Why it happens:** The form input is a percentage (0-100) that gets divided to a decimal. If the Zod schema transforms `66` to `0.66`, the comparison is exact. But intermediate math could introduce floating point noise.
**How to avoid:** Verify the exact value path from form input to `directCostPct` in `CalculatorInput`. The Zod schema in `schemas.ts` divides by 100, which for `66 / 100` produces exactly `0.66` in IEEE 754. The comparison `> 0.66` is safe. However, test with edge case values (e.g., 66%, 67%, 65%) to confirm.
**Warning signs:** Alert triggers when it shouldn't, or doesn't trigger when it should.

### Pitfall 2: CalculatorInput Not Available in ResultsView
**What goes wrong:** `ResultsView` currently receives only `CalculatorOutput`, `currency`, and `staffCount`. Alert triggers need `entityType`, `vatRate`, and `directCostPct` from `CalculatorInput`.
**Why it happens:** The current `ResultsState` in `CalculatorApp` was designed before alerts were planned.
**How to avoid:** Extend `ResultsState` to include the alert-relevant input fields (or compute alerts upstream and pass the array). The recommended approach is computing alerts at the `CalculatorApp` level.
**Warning signs:** TypeScript errors when trying to access input fields in ResultsView.

### Pitfall 3: Alert Section Breaking Grid Layout
**What goes wrong:** Inserting a new section between the two existing grid sections could break spacing or visual rhythm.
**Why it happens:** The current layout uses `mt-12` between sections. Adding a third section needs consistent spacing.
**How to avoid:** Use the same `mt-12 mb-6` pattern for the alerts section heading. Test with 1 alert, 2 alerts, 3 alerts, and 4 alerts visible simultaneously.
**Warning signs:** Uneven spacing, cramped layout on mobile.

### Pitfall 4: WizardForm onCalculated Callback Signature
**What goes wrong:** Currently `WizardForm` calls `onCalculated(output, currency, staffCount)`. To compute alerts at the CalculatorApp level, we need the full `CalculatorInput` or at least additional fields.
**Why it happens:** The callback was designed for Phase 5 needs only.
**How to avoid:** Extend the callback to pass the full input or add the needed fields. Check WizardForm's `handleSubmit` to see where the input object is available.
**Warning signs:** Having to reconstruct input values from scattered sources.

## Code Examples

### Existing Pattern: output-copy.ts structure
The alert copy file should mirror this exactly:
```typescript
// From src/lib/results/output-copy.ts
type OutputCopyEntry = {
  readonly label: string;
  readonly explanation: string;
};

export const OUTPUT_COPY = {
  monthlyRevenueTarget: {
    label: "Monthly Revenue Goal (Net)",
    explanation: "This is the minimum...",
  },
  // ...
} as const satisfies Record<string, OutputCopyEntry>;
```

### Existing Pattern: FinancialAnchorCard structure
AlertCard should follow this component pattern but with amber styling:
```typescript
// From src/components/results/FinancialAnchorCard.tsx
// White bg: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
// Alert equivalent: "rounded-xl border border-amber-300 bg-amber-50 p-6"
```

### Existing Pattern: ResultsView section structure
```typescript
// From src/components/results/ResultsView.tsx
// Section heading: "text-2xl font-bold text-center mb-6"
// Grid: "grid grid-cols-1 md:grid-cols-3 gap-4"
// Section spacing: "mt-12"
```

### Key Constants Available
```typescript
// From src/lib/calculator/constants.ts
VAT_RATES.IE_REDUCED = 0.135  // Used in ALRT-02 trigger
BUSINESS_RULES.EFFICIENCY_CAP = 0.75  // Referenced in ALRT-03 copy
```

### Current CalculatorApp Data Flow
```typescript
// From src/components/CalculatorApp.tsx
interface ResultsState {
  output: CalculatorOutput;
  currency: Currency;
  staffCount: number;
  // alerts: Alert[] -- needs to be added
}

// WizardForm callback currently:
onCalculated={(output, currency, staffCount) =>
  setResults({ output, currency, staffCount })
}
// Needs extending to include input data or pre-computed alerts
```

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (via vitest.config.ts) |
| Config file | `vitest.config.ts` (exists, jsdom environment) |
| Quick run command | `pnpm vitest run --reporter=verbose` |
| Full suite command | `pnpm vitest run` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ALRT-01 | Gross Draw Warning always fires for both entity types | unit | `pnpm vitest run src/lib/calculator/__tests__/alerts.test.ts -t "gross-draw"` | No -- Wave 0 |
| ALRT-02 | Two-Thirds Rule fires when vatRate=0.135 AND directCostPct>0.66 | unit | `pnpm vitest run src/lib/calculator/__tests__/alerts.test.ts -t "two-thirds"` | No -- Wave 0 |
| ALRT-03 | Efficiency Cap fires when staffCount > 0, does not fire when staffCount = 0 | unit | `pnpm vitest run src/lib/calculator/__tests__/alerts.test.ts -t "efficiency"` | No -- Wave 0 |
| ALRT-04 | CIS/RCT Warning always fires | unit | `pnpm vitest run src/lib/calculator/__tests__/alerts.test.ts -t "cis-rct"` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm vitest run --reporter=verbose`
- **Per wave merge:** `pnpm vitest run`
- **Phase gate:** Full suite green before verification

### Wave 0 Gaps
- [ ] `src/lib/calculator/__tests__/alerts.test.ts` -- covers ALRT-01 through ALRT-04 trigger logic
- [ ] Component test for AlertCard rendering (optional, low complexity component)

## Open Questions

1. **WizardForm callback extension**
   - What we know: `WizardForm` currently passes `(output, currency, staffCount)` to `onCalculated`. We need either the full `CalculatorInput` or additional fields for alert computation.
   - What's unclear: The exact internal structure of WizardForm's submit handler and where the full input object is accessible.
   - Recommendation: Extend the callback to also pass the full `CalculatorInput` (or at minimum: `entityType`, `vatRate`, `directCostPct`). The planner should include a task to read and modify `WizardForm.tsx`.

2. **Alert ordering**
   - What we know: Up to 4 alerts can display simultaneously (ALRT-01 and ALRT-04 always fire, ALRT-02 and ALRT-03 are conditional). Order is at Claude's discretion.
   - Recommendation: Order by importance/actionability: Two-Thirds Rule first (most actionable -- user should change VAT rate), then Gross Draw, then CIS/RCT, then Efficiency Cap. This puts the "do something now" alert first.

## Sources

### Primary (HIGH confidence)
- Project codebase -- direct inspection of all referenced files (types.ts, engine.ts, ResultsView.tsx, CalculatorApp.tsx, output-copy.ts, field-copy.ts, FinancialAnchorCard.tsx, PipelineMetric.tsx, constants.ts)
- CONTEXT.md -- locked decisions D-01 through D-16
- REQUIREMENTS.md -- ALRT-01 through ALRT-04 specifications

### Secondary
- None needed -- this phase is entirely application-level logic with no external library research required

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new libraries, all existing infrastructure
- Architecture: HIGH -- follows established codebase patterns exactly
- Pitfalls: HIGH -- identified from direct code inspection of integration points

**Research date:** 2026-03-28
**Valid until:** Indefinite (no external dependencies that could change)
