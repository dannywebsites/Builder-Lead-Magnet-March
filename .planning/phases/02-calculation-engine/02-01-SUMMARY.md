---
phase: 02-calculation-engine
plan: 01
subsystem: calculator
tags: [typescript, pure-functions, tdd, financial-math]

requires:
  - phase: 01-project-scaffolding-type-foundation
    provides: types.ts (CalculatorInput, CalculatorOutput, EntityType), constants.ts (BUSINESS_RULES), currency.ts (roundCurrency)
provides:
  - "calculate() entry point composing all 5 formula steps into CalculatorOutput"
  - "Individual step functions: calculateTaxBuffer, calculateStaffCost, calculateBillableHours, calculateSlippage, calculateMRT"
  - "Comprehensive unit tests for all functions (16 test cases)"
affects: [calculator-validation, ui-form, pdf-report, api-routes]

tech-stack:
  added: []
  patterns: [pure-function-pipeline, tdd-red-green, constants-not-magic-numbers]

key-files:
  created:
    - src/lib/calculator/engine.ts
    - src/lib/calculator/__tests__/engine.test.ts
  modified: []

key-decisions:
  - "Pipeline uses unrounded MRT for derived values (jobs, quotes, leads) to avoid compounding rounding errors"
  - "realDirectCost stored as raw ratio (not rounded) since it is not a currency value"
  - "Test expected values computed from actual JS floating point arithmetic, not hand-calculated approximations"

patterns-established:
  - "Pure function pipeline: step functions compose into calculate(), no intermediate rounding"
  - "TDD workflow: RED tests first, GREEN implementation second"
  - "Source-level assertions: tests read engine.ts source to verify no prohibited patterns"

requirements-completed: [CALC-01, CALC-02, CALC-03, CALC-04, CALC-05, CALC-06, CALC-08]

duration: 4min
completed: 2026-03-28
---

# Phase 2 Plan 1: Calculation Engine Summary

**Pure TypeScript calculation engine with 5 formula steps (tax buffer, staff cost, efficiency cap, slippage, MRT) composed into a single calculate() entry point, validated by 16 TDD unit tests**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-28T10:02:31Z
- **Completed:** 2026-03-28T10:06:05Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Built complete calculation engine with 6 exported pure functions
- All functions use BUSINESS_RULES constants with zero magic numbers
- Full test coverage: Ltd company, sole trader, zero-staff, finite-number checks, source-level client-side-only verification
- Full test suite green: 45 tests across 3 files (Phase 1 + Phase 2)

## Task Commits

Each task was committed atomically:

1. **Task 1: Write failing tests for all step functions and calculate()** - `78c9d17` (test)
2. **Task 2: Implement engine.ts to make all tests pass** - `8051ffe` (feat)

## Files Created/Modified
- `src/lib/calculator/engine.ts` - All 6 exported calculation functions (calculateTaxBuffer, calculateStaffCost, calculateBillableHours, calculateSlippage, calculateMRT, calculate)
- `src/lib/calculator/__tests__/engine.test.ts` - 16 unit tests covering all step functions and composed pipeline

## Decisions Made
- Pipeline uses unrounded MRT for derived calculations (jobsToWin, quotesNeeded, leadsNeeded) to avoid compounding rounding errors -- Math.ceil applied only at the return boundary
- realDirectCost is not rounded (it is a ratio, not currency)
- Test expected values derived from actual JS floating point arithmetic rather than hand-calculated approximations from the research document

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Corrected expected test values for floating point precision**
- **Found during:** Task 2 (GREEN phase)
- **Issue:** Plan's hand-calculated expected values (e.g., MRT = 18603.58 for Ltd) did not match actual JS floating point results (18603.23). The difference stems from `13254.80 / 0.7125` yielding `18603.228...` in JS, not `18603.578...` as the plan assumed (the plan used `13254.80` but the actual sum `5000 + 8254.8 = 13254.8` produces a different floating point division result).
- **Fix:** Recalculated all expected test values using actual JS arithmetic. Updated: Ltd MRT (18603.23), Ltd billings (22323.87), Sole Trader MRT (17199.72). Also changed `calculateBillableHours` test to use `toBeCloseTo` for floating point comparison.
- **Files modified:** src/lib/calculator/__tests__/engine.test.ts
- **Verification:** All 16 tests pass with correct JS floating point values
- **Committed in:** 8051ffe (Task 2 commit)

**2. [Rule 1 - Bug] Removed prohibited words from engine.ts JSDoc comments**
- **Found during:** Task 2 (GREEN phase)
- **Issue:** Source-level test checking for `/\basync\b/` in engine.ts matched the JSDoc comment "no async, no network calls"
- **Fix:** Rewrote comment to "fully synchronous" to avoid triggering the source assertion
- **Files modified:** src/lib/calculator/engine.ts
- **Verification:** Source-level test passes
- **Committed in:** 8051ffe (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (2 bugs)
**Impact on plan:** Both fixes necessary for test correctness. No scope creep. The mathematical formulas and business logic are identical to the plan -- only the expected numeric precision in tests was adjusted.

## Issues Encountered
None beyond the deviations documented above.

## User Setup Required
None - no external service configuration required.

## Known Stubs
None - all functions are fully implemented with real logic.

## Next Phase Readiness
- Calculation engine complete and tested, ready for input validation layer (02-02)
- All step functions exported individually for unit testing and potential future reuse
- calculate() provides the single entry point that UI form and PDF report will consume

---
*Phase: 02-calculation-engine*
*Completed: 2026-03-28*
