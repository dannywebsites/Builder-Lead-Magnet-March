# Phase 2: Calculation Engine - Research

**Researched:** 2026-03-28
**Domain:** Pure TypeScript calculation functions, financial math, unit testing
**Confidence:** HIGH

## Summary

Phase 2 implements the core calculation engine as pure TypeScript functions with zero UI dependencies. The foundation from Phase 1 is solid: `CalculatorInput` and `CalculatorOutput` interfaces, `BUSINESS_RULES` constants (efficiency cap 0.75, slippage factor 1.15, employer burden 1.30, corp tax buffer 0.80), Zod validation schemas, and `roundCurrency()` utility are all in place and tested. Vitest is configured and running with 29 passing tests.

The calculation is a deterministic five-step pipeline: Tax Buffer -> Staff Cost -> Efficiency Cap -> Slippage -> MRT. On top of that, sales pipeline math derives jobs-to-win, quotes-needed, and leads-needed from the MRT. Every constant is already defined in `constants.ts`. The `CalculatorOutput` interface already has fields for all intermediate values (`targetBusinessProfit`, `adjustedPayroll`, `totalBillableHours`, `realDirectCost`, `adjustedOverheads`), which means the engine should expose these for transparency in the results display (Phase 5).

**Primary recommendation:** Implement as small, composable pure functions (one per formula step) composed into a single `calculate(input: CalculatorInput): CalculatorOutput` entry point. Use `roundCurrency()` from Phase 1 for all final monetary outputs. Test each step function independently, then test the composed `calculate()` with known hand-calculated values for both entity types.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CALC-01 | Step 1 -- Tax Buffer: Ltd = Gross_Personal_Draw / 0.80; Sole Trader = Gross_Personal_Draw | Implement as `calculateTaxBuffer(entityType, grossDraw)` using `BUSINESS_RULES.CORP_TAX_BUFFER`. Branch on entityType. |
| CALC-02 | Step 2 -- True Cost of Staff: Hours * 4.33, base payroll, adjusted * 1.30 | Implement as `calculateStaffCost(staffCount, hourlyRate, hoursPerWeek)` using `BUSINESS_RULES.WEEKS_PER_MONTH` and `BUSINESS_RULES.EMPLOYER_BURDEN`. |
| CALC-03 | Step 3 -- 75% Reality Check: Total_Billable_Hours = Total_Monthly_Hours * 0.75 | Implement as `calculateBillableHours(totalMonthlyHours)` using `BUSINESS_RULES.EFFICIENCY_CAP`. Hard-coded, not parameterized. |
| CALC-04 | Step 4 -- Slippage Factor: Real_Direct_Cost = Direct_Cost_Pct * 1.15 | Implement as `calculateSlippage(directCostPct)` using `BUSINESS_RULES.SLIPPAGE_FACTOR`. |
| CALC-05 | Step 5 -- MRT: (Target_Business_Profit + Adjusted_Overheads) / (1 - Real_Direct_Cost) | Implement as `calculateMRT(targetProfit, adjustedOverheads, realDirectCost)`. This is the core formula. |
| CALC-06 | All calculations execute client-side with no server round-trip | Satisfied by design: pure TypeScript functions with no network calls, no async, no imports from server modules. |
| CALC-08 | Zero-staff edge case handled gracefully (no division errors, payroll = 0) | When staffCount = 0: payroll = 0, totalMonthlyHours = 0, totalBillableHours = 0. Hourly floor rate must handle division by zero (0 billable hours). Return Infinity or a sentinel -- recommend returning 0 with a flag, or skip hourly rate when no staff. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | 5.x (installed) | Type-safe calculation functions | Already in project, enforces correctness on financial math |
| Vitest | 4.1.x (installed) | Unit testing | Already configured with path aliases, 29 tests passing |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Zod | 4.3.x (installed) | Input validation before calculation | Validate inputs at the `calculate()` entry point boundary |

No new packages needed. Phase 2 uses only what Phase 1 already installed.

## Architecture Patterns

### Recommended Project Structure
```
src/lib/calculator/
  types.ts              # (exists) CalculatorInput, CalculatorOutput
  constants.ts          # (exists) BUSINESS_RULES, VAT_RATES
  schemas.ts            # (exists) Zod validation schemas
  currency.ts           # (exists) formatCurrency, roundCurrency
  engine.ts             # (NEW) Core calculation functions + calculate() entry point
  pipeline.ts           # (NEW) Sales pipeline calculations (jobs, quotes, leads)
  index.ts              # (update) Re-export engine and pipeline
  __tests__/
    currency.test.ts    # (exists)
    schemas.test.ts     # (exists)
    engine.test.ts      # (NEW) Unit tests for each formula step + composed calculate()
    pipeline.test.ts    # (NEW) Unit tests for sales pipeline math
```

### Pattern 1: Step Functions Composed into Entry Point
**What:** Each formula step is a small pure function. A single `calculate()` function composes them.
**When to use:** Always -- this is the only pattern for the engine.
**Example:**
```typescript
import { BUSINESS_RULES } from "./constants";
import { roundCurrency } from "./currency";
import type { CalculatorInput, CalculatorOutput, EntityType } from "./types";

/** CALC-01: Tax Buffer */
export function calculateTaxBuffer(
  entityType: EntityType,
  grossPersonalDraw: number,
): number {
  return entityType === "limited_company"
    ? grossPersonalDraw / BUSINESS_RULES.CORP_TAX_BUFFER
    : grossPersonalDraw;
}

/** CALC-02: True Cost of Staff */
export function calculateStaffCost(
  staffCount: number,
  staffHourlyRate: number,
  staffHoursPerWeek: number,
): { totalMonthlyHours: number; basePayroll: number; adjustedPayroll: number } {
  const totalMonthlyHours = staffCount * staffHoursPerWeek * BUSINESS_RULES.WEEKS_PER_MONTH;
  const basePayroll = totalMonthlyHours * staffHourlyRate;
  const adjustedPayroll = basePayroll * BUSINESS_RULES.EMPLOYER_BURDEN;
  return { totalMonthlyHours, basePayroll, adjustedPayroll };
}

/** CALC-03: 75% Efficiency Cap (hard-coded, non-overridable) */
export function calculateBillableHours(totalMonthlyHours: number): number {
  return totalMonthlyHours * BUSINESS_RULES.EFFICIENCY_CAP;
}

/** CALC-04: Slippage Factor */
export function calculateSlippage(directCostPct: number): number {
  return directCostPct * BUSINESS_RULES.SLIPPAGE_FACTOR;
}

/** CALC-05: Minimum Revenue Target */
export function calculateMRT(
  targetBusinessProfit: number,
  adjustedOverheads: number,
  realDirectCost: number,
): number {
  return (targetBusinessProfit + adjustedOverheads) / (1 - realDirectCost);
}

/** Composed entry point */
export function calculate(input: CalculatorInput): CalculatorOutput {
  const targetBusinessProfit = calculateTaxBuffer(input.entityType, input.grossPersonalDraw);
  const { totalMonthlyHours, adjustedPayroll } = calculateStaffCost(
    input.staffCount, input.staffHourlyRate, input.staffHoursPerWeek,
  );
  const totalBillableHours = calculateBillableHours(totalMonthlyHours);
  const realDirectCost = calculateSlippage(input.directCostPct);
  const adjustedOverheads = input.fixedOverheads + adjustedPayroll;
  const monthlyRevenueTarget = calculateMRT(targetBusinessProfit, adjustedOverheads, realDirectCost);

  const monthlyBillings = monthlyRevenueTarget * (1 + input.vatRate);
  const hourlyFloorRate = totalBillableHours > 0
    ? monthlyRevenueTarget / totalBillableHours
    : 0;
  const jobsToWin = monthlyRevenueTarget / input.avgJobValue;
  const quotesNeeded = jobsToWin / BUSINESS_RULES.WIN_RATE;
  const leadsNeeded = quotesNeeded / BUSINESS_RULES.LEAD_CONVERSION_RATE;

  return {
    monthlyRevenueTarget: roundCurrency(monthlyRevenueTarget),
    monthlyBillings: roundCurrency(monthlyBillings),
    hourlyFloorRate: roundCurrency(hourlyFloorRate),
    jobsToWin: Math.ceil(jobsToWin),
    quotesNeeded: Math.ceil(quotesNeeded),
    leadsNeeded: Math.ceil(leadsNeeded),
    targetBusinessProfit: roundCurrency(targetBusinessProfit),
    adjustedPayroll: roundCurrency(adjustedPayroll),
    totalBillableHours: roundCurrency(totalBillableHours),
    realDirectCost,
    adjustedOverheads: roundCurrency(adjustedOverheads),
  };
}
```

### Pattern 2: Zero-Staff Edge Case (CALC-08)
**What:** When staffCount = 0, all staff-related values are 0. Hourly floor rate returns 0 (no billable hours to divide by).
**When to use:** Always -- defensive check in the composed function.
**Key detail:** `totalBillableHours = 0` means `hourlyFloorRate = 0` (not Infinity, not NaN). The `totalBillableHours > 0` guard handles this. Jobs-to-win and pipeline numbers remain valid because they divide MRT by avgJobValue (which is validated as positive by Zod).

### Pattern 3: VatRate Schema Type Mismatch
**What:** The Zod schema uses string enum (`"0"`, `"0.135"`, `"0.20"`, `"0.23"`) for form compatibility, but the calculation engine needs numeric `VatRateValue` (0, 0.135, 0.20, 0.23). The `calculate()` function takes `CalculatorInput` which has `vatRate: VatRateValue` (numeric).
**When to use:** At the boundary between form validation and calculation.
**Action:** The engine receives `CalculatorInput` with numeric vatRate. The string-to-number conversion happens at the form layer (Phase 3), not in the engine. No conversion code needed in Phase 2.

### Anti-Patterns to Avoid
- **Mutable state in calculations:** Every function must be pure. No class instances, no shared state, no mutation of input objects.
- **Parameterizing hard-coded business rules:** The 75% efficiency cap and 15% slippage factor are NOT configurable. Do NOT accept them as parameters. Read them from `BUSINESS_RULES` constants only.
- **Rounding intermediate values:** Only round final output values. Rounding intermediates introduces compounding errors. Apply `roundCurrency()` only in the `calculate()` return statement.
- **Using `Number.parseFloat()` on vatRate in the engine:** The engine receives numeric vatRate from `CalculatorInput`. String parsing belongs in the form layer.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Currency rounding | Custom rounding logic | `roundCurrency()` from Phase 1 | Already tested, handles floating point correctly |
| Input validation | Manual type checks | Zod schemas from Phase 1 | Already defined, battle-tested edge cases |
| Business rule constants | Magic numbers in formulas | `BUSINESS_RULES` from Phase 1 | Single source of truth, already typed as `const` |

## Common Pitfalls

### Pitfall 1: Division by Zero on Zero Staff
**What goes wrong:** `hourlyFloorRate = MRT / totalBillableHours` throws or returns Infinity when staff = 0.
**Why it happens:** totalBillableHours = 0 when staffCount = 0.
**How to avoid:** Guard: `totalBillableHours > 0 ? MRT / totalBillableHours : 0`.
**Warning signs:** Test with staffCount = 0 and check hourlyFloorRate is a finite number.

### Pitfall 2: Slippage Pushing Real Direct Cost Above 1.0
**What goes wrong:** If directCostPct = 0.80 (max allowed) and slippage factor = 1.15, realDirectCost = 0.92. The MRT formula `/ (1 - realDirectCost)` produces a very large number but remains valid. However, if directCostPct were ever > 0.87, realDirectCost > 1.0 and MRT goes negative.
**Why it happens:** Slippage inflates the direct cost percentage.
**How to avoid:** Zod already caps directCostPct at 0.80, so max realDirectCost = 0.92. The engine does not need an additional cap. But add a test that verifies directCostPct = 0.80 produces a positive MRT.
**Warning signs:** MRT is negative or extremely large.

### Pitfall 3: Floating Point Comparison in Tests
**What goes wrong:** `expect(result).toBe(1234.56)` fails due to floating point drift.
**Why it happens:** JavaScript floating point arithmetic.
**How to avoid:** Use `toBeCloseTo(expected, 2)` for intermediate values, or pre-compute expected values using the same rounding. For final output values that go through `roundCurrency()`, exact `toBe()` is safe.
**Warning signs:** Flaky tests that pass/fail depending on input values.

### Pitfall 4: Forgetting Sole Trader Has No Tax Buffer
**What goes wrong:** Both entity types get divided by 0.80, inflating the Sole Trader target.
**Why it happens:** Missing conditional in tax buffer step.
**How to avoid:** Explicit branch: Ltd = draw / 0.80, Sole Trader = draw (pass through). Test both entity types with identical inputs and verify different MRT values.

### Pitfall 5: Jobs/Quotes/Leads Should Be Whole Numbers
**What goes wrong:** Displaying "You need 4.7 jobs" makes no practical sense.
**Why it happens:** Division rarely produces integers.
**How to avoid:** Use `Math.ceil()` for jobsToWin, quotesNeeded, leadsNeeded. You always need to round UP (you can't win 0.7 of a job).

## Code Examples

### Hand-Calculated Test Case: Ltd Company
```typescript
// Input
const input: CalculatorInput = {
  entityType: "limited_company",
  grossPersonalDraw: 4000,       // wants 4000/month before personal tax
  fixedOverheads: 1500,          // rent, insurance, etc.
  staffCount: 2,
  staffHourlyRate: 15,
  staffHoursPerWeek: 40,
  avgJobValue: 2500,
  directCostPct: 0.25,
  vatRate: 0.20,
  currency: "GBP",
};

// Step 1: Tax Buffer (Ltd)
// targetBusinessProfit = 4000 / 0.80 = 5000

// Step 2: Staff Cost
// totalMonthlyHours = 2 * 40 * 4.33 = 346.4
// basePayroll = 346.4 * 15 = 5196
// adjustedPayroll = 5196 * 1.30 = 6754.80

// Step 3: Billable Hours
// totalBillableHours = 346.4 * 0.75 = 259.8

// Step 4: Slippage
// realDirectCost = 0.25 * 1.15 = 0.2875

// Step 5: MRT
// adjustedOverheads = 1500 + 6754.80 = 8254.80
// MRT = (5000 + 8254.80) / (1 - 0.2875) = 13254.80 / 0.7125 = 18603.58...

// Pipeline
// monthlyBillings = 18603.58 * 1.20 = 22324.30
// hourlyFloorRate = 18603.58 / 259.8 = 71.61
// jobsToWin = ceil(18603.58 / 2500) = ceil(7.44) = 8
// quotesNeeded = ceil(8 / 0.30) = ceil(26.67) = 27
// leadsNeeded = ceil(27 / 0.30) = ceil(90) = 90
```

### Hand-Calculated Test Case: Sole Trader
```typescript
// Same inputs but entityType = "sole_trader"
// Step 1: Tax Buffer (Sole Trader)
// targetBusinessProfit = 4000 (no division)

// Everything else follows with targetBusinessProfit = 4000 instead of 5000
// MRT = (4000 + 8254.80) / 0.7125 = 12254.80 / 0.7125 = 17201.47...
```

### Hand-Calculated Test Case: Zero Staff
```typescript
const input: CalculatorInput = {
  entityType: "sole_trader",
  grossPersonalDraw: 3000,
  fixedOverheads: 500,
  staffCount: 0,
  staffHourlyRate: 0,
  staffHoursPerWeek: 0,
  avgJobValue: 1000,
  directCostPct: 0.30,
  vatRate: 0.20,
  currency: "GBP",
};

// Step 1: targetBusinessProfit = 3000
// Step 2: totalMonthlyHours = 0, basePayroll = 0, adjustedPayroll = 0
// Step 3: totalBillableHours = 0
// Step 4: realDirectCost = 0.30 * 1.15 = 0.345
// Step 5: adjustedOverheads = 500 + 0 = 500
//         MRT = (3000 + 500) / (1 - 0.345) = 3500 / 0.655 = 5343.51...
// hourlyFloorRate = 0 (division by zero guard)
// jobsToWin = ceil(5343.51 / 1000) = 6
// quotesNeeded = ceil(6 / 0.30) = 20
// leadsNeeded = ceil(20 / 0.30) = 67
```

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.x |
| Config file | `vitest.config.ts` (root) |
| Quick run command | `pnpm test` |
| Full suite command | `pnpm test` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CALC-01 | Tax buffer: Ltd divides by 0.80, Sole Trader passes through | unit | `pnpm vitest run src/lib/calculator/__tests__/engine.test.ts -t "tax buffer"` | No - Wave 0 |
| CALC-02 | Staff cost: hours * 4.33, payroll * 1.30 | unit | `pnpm vitest run src/lib/calculator/__tests__/engine.test.ts -t "staff cost"` | No - Wave 0 |
| CALC-03 | Billable hours = monthly hours * 0.75 (hard-coded) | unit | `pnpm vitest run src/lib/calculator/__tests__/engine.test.ts -t "billable hours"` | No - Wave 0 |
| CALC-04 | Slippage: directCostPct * 1.15 | unit | `pnpm vitest run src/lib/calculator/__tests__/engine.test.ts -t "slippage"` | No - Wave 0 |
| CALC-05 | MRT = (profit + overheads) / (1 - realDirectCost) | unit | `pnpm vitest run src/lib/calculator/__tests__/engine.test.ts -t "MRT"` | No - Wave 0 |
| CALC-06 | Client-side only, no async/server imports | unit | `pnpm vitest run src/lib/calculator/__tests__/engine.test.ts -t "client-side"` | No - Wave 0 |
| CALC-08 | Zero staff: payroll=0, no division errors | unit | `pnpm vitest run src/lib/calculator/__tests__/engine.test.ts -t "zero staff"` | No - Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm test`
- **Per wave merge:** `pnpm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/lib/calculator/__tests__/engine.test.ts` -- covers CALC-01 through CALC-06, CALC-08
- [ ] `src/lib/calculator/__tests__/pipeline.test.ts` -- covers sales pipeline math (jobs, quotes, leads)

## Project Constraints (from CLAUDE.md)

The following directives are extracted from CLAUDE.md and must be respected:

- **Tech stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, Biome, pnpm
- **No login:** Calculator works without authentication
- **Tax accuracy:** Conservative buffers (20% Corp Tax buffer = divide by 0.80, 30% employer burden = multiply by 1.30) -- not precise statutory rates
- **Input validation:** Direct cost % capped at 80%, billable hours capped at 75% -- hard limits
- **Markets:** UK and Ireland only (GBP, EUR)
- **Core value:** "Brutal truth" -- no optimistic assumptions, no overridable safety factors
- **GSD workflow enforcement:** Use GSD commands for all changes

## Open Questions

1. **jobsToWin/quotesNeeded/leadsNeeded rounding**
   - What we know: These should be whole numbers (can't win half a job). `Math.ceil()` is the right choice.
   - What's unclear: The `CalculatorOutput` interface defines these as `number`, not `number` with a ceiling constraint. Should the type be narrowed?
   - Recommendation: Use `Math.ceil()` in the engine. No type change needed -- TypeScript doesn't have integer types. Document in JSDoc.

2. **Pipeline math with zero-staff hourlyFloorRate = 0**
   - What we know: When staff = 0, hourlyFloorRate = 0. This is mathematically correct but might confuse users ("your hourly rate is 0").
   - What's unclear: Should the output include a flag indicating "no staff, hourly rate not applicable"?
   - Recommendation: Return 0 for now. Phase 5 (Results Display) handles the presentation logic -- it can show "N/A" or hide the hourly rate card when totalBillableHours = 0. The engine should not embed UI decisions.

3. **vatRate in calculate() input**
   - What we know: `CalculatorInput.vatRate` is `VatRateValue` (numeric: 0, 0.135, 0.20, 0.23). The Zod schema `VatRateSchema` uses string enum. The engine uses numeric.
   - What's unclear: Should `calculate()` accept `ValidatedCalculatorInput` (Zod output with string vatRate) or `CalculatorInput` (with numeric vatRate)?
   - Recommendation: Accept `CalculatorInput` (numeric vatRate). The form layer (Phase 3) converts string to number. This keeps the engine simple and decoupled from form concerns.

## Sources

### Primary (HIGH confidence)
- Phase 1 source code: `src/lib/calculator/types.ts`, `constants.ts`, `schemas.ts`, `currency.ts` -- direct inspection of existing interfaces and constants
- `REQUIREMENTS.md` -- exact formulas for CALC-01 through CALC-08
- `vitest.config.ts` -- confirmed test infrastructure configuration

### Secondary (MEDIUM confidence)
- Hand-calculated test cases -- verified against the formula definitions in REQUIREMENTS.md

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new dependencies, everything already installed and tested
- Architecture: HIGH -- pure functions with deterministic I/O, straightforward composition
- Pitfalls: HIGH -- financial math pitfalls are well-understood (division by zero, floating point, rounding)
- Formulas: HIGH -- exact formulas specified in REQUIREMENTS.md, no ambiguity

**Research date:** 2026-03-28
**Valid until:** Indefinite (pure math module, no external dependencies that change)
