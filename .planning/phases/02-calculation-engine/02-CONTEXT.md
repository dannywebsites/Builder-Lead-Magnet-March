# Phase 2: Calculation Engine - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Standalone, fully-tested pure TypeScript calculation module implementing all five formula steps (tax buffer, staff cost, efficiency cap, slippage, MRT) plus sales pipeline math (jobs to win, quotes needed, leads needed). Zero UI dependencies, deterministic, correct. Lives in `src/lib/calculator/`.

</domain>

<decisions>
## Implementation Decisions

### Function Architecture
- **D-01:** Single `calculate()` function that returns the full `CalculatorOutput` including all intermediate values (targetBusinessProfit, adjustedPayroll, totalBillableHours, realDirectCost). Intermediate values are needed by Phase 5 (results display), Phase 6 (legal alerts), and Phase 7 (PDF report).
- **D-02:** Pipeline math (jobsToWin, quotesNeeded, leadsNeeded) computed inline inside `calculate()` — not a separate module. All pipeline fields are part of `CalculatorOutput`.

### Pipeline Defaults
- **D-03:** Win rate (30%) and lead-to-quote conversion rate (30%) are hardcoded constants in `BUSINESS_RULES`. No extensibility hooks, no parameters. If v2 needs adjustable rates (ENH-01), refactoring a constant to a parameter is trivial.

### Zero-Staff Edge Case
- **D-04:** When staffCount=0, hourly rate returns 0 (not null, not Infinity). totalBillableHours=0, so hourly floor rate division is guarded. Phase 5 handles "N/A" display logic — engine stays pure math.
- **D-05:** When staffCount=0, adjustedPayroll=0 and totalBillableHours=0. Pipeline math (jobsToWin, quotesNeeded, leadsNeeded) remains valid because it divides by avgJobValue (validated as positive by Zod).

### Carried from Phase 1
- **D-06:** Hourly Floor Rate uses exact 2dp — no rounding up (Phase 1 D-04).
- **D-07:** Zod schemas enforce business rules at schema level — engine trusts validated input (Phase 1 D-06).
- **D-08:** Feature-based folder structure — engine in `src/lib/calculator/` (Phase 1 D-07).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Types & Constants (Source of Truth)
- `src/lib/calculator/types.ts` — CalculatorInput, CalculatorOutput interfaces
- `src/lib/calculator/constants.ts` — BUSINESS_RULES with all formula constants
- `src/lib/calculator/schemas.ts` — Zod validation schemas (engine trusts these)
- `src/lib/calculator/currency.ts` — roundCurrency() for output formatting

### Requirements
- `.planning/REQUIREMENTS.md` — CALC-01 through CALC-08 (exact formulas)
- `.planning/phases/02-calculation-engine/02-RESEARCH.md` — Hand-calculated test cases, architecture decisions

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `types.ts` — CalculatorInput/CalculatorOutput already define the full contract
- `constants.ts` — BUSINESS_RULES has CORP_TAX_BUFFER (0.80), EMPLOYER_BURDEN (1.30), EFFICIENCY_CAP (0.75), SLIPPAGE_FACTOR (1.15)
- `currency.ts` — roundCurrency() for 2dp rounding on hourly rate output
- `schemas.ts` — Validates directCostPct max 0.80, staffCount non-negative int

### Established Patterns
- Tests in `__tests__/` subdirectory (29 passing from Phase 1)
- Vitest with `@/` path alias support
- Barrel export via `index.ts`

### Integration Points
- `index.ts` barrel export must be updated to re-export `calculate()` and any new exports
- Phase 3 form will call `calculate()` with validated `CalculatorInput`
- Phase 5 will read `CalculatorOutput` fields for display
- Phase 6 will read intermediate values for alert triggers (realDirectCost for Two-Thirds Rule)

</code_context>

<specifics>
## Specific Ideas

- Keep it fast to complete — simplest correct implementation wins
- All formulas are fully specified in REQUIREMENTS.md CALC-01 through CALC-05 — no interpretation needed
- Pipeline math uses Math.ceil() on raw (unrounded) intermediate values for accuracy

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-calculation-engine*
*Context gathered: 2026-03-28*
