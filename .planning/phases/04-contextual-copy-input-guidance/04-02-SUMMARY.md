---
phase: 04-contextual-copy-input-guidance
plan: 02
subsystem: ui
tags: [react-hook-form, zod, useWatch, useEffect, form-validation]

# Dependency graph
requires:
  - phase: 04-01
    provides: NumberInput explanation/disclaimer props, FIELD_COPY object, contextual copy pattern
  - phase: 03-multi-step-input-form
    provides: Multi-step wizard form with StepFinancials component
provides:
  - Itemized fixed cost breakdown (8 categories) with reactive running total
  - Contextual explanation copy on grossPersonalDraw with Corp Tax disclaimer
  - fixedOverheads computed via useEffect from category sum
affects: [05-output-report, pdf-report, any-future-form-changes]

# Tech tracking
tech-stack:
  added: []
  patterns: [useWatch-array-observation, useEffect-computed-field, category-sum-pattern]

key-files:
  created: []
  modified:
    - src/lib/form/step-schemas.ts
    - src/lib/form/form-defaults.ts
    - src/lib/form/field-copy.ts
    - src/lib/form/transform.ts
    - src/components/wizard/steps/StepFinancials.tsx
    - src/lib/form/__tests__/transform.test.ts
    - src/lib/form/__tests__/step-schemas.test.ts

key-decisions:
  - "fixedOverheads kept as computed schema field set via setValue (same pattern as StepStaff)"
  - "Category fields stripped in transform.ts so calculator engine only receives fixedOverheads"

patterns-established:
  - "Category-sum pattern: useWatch array observation + useEffect setValue for computed fields"
  - "Field copy map-iteration: FIXED_COST_FIELDS array drives both labels and FIELD_COPY lookups"

requirements-completed: [FORM-10, FORM-11]

# Metrics
duration: 2min
completed: 2026-03-28
---

# Phase 04 Plan 02: Itemized Fixed Costs Summary

**Replaced single Fixed Costs input with 8 itemized category fields (vehicle, premises, equipment, insurance, technology, loans, professional, other) with reactive running total feeding fixedOverheads to calculator engine**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-28T12:46:22Z
- **Completed:** 2026-03-28T12:48:38Z
- **Tasks:** 2 (1 auto + 1 checkpoint auto-approved)
- **Files modified:** 7

## Accomplishments
- Converted single fixedOverheads input into 8 itemized cost categories with individual explanation copy
- Added reactive running total that sums categories via useWatch and sets fixedOverheads via useEffect
- Wired grossPersonalDraw explanation text and Corp Tax disclaimer in StepFinancials
- Stripped category fields in transform.ts so CalculatorInput remains unchanged
- Updated test fixtures in both transform and step-schemas tests to include new fields

## Task Commits

Each task was committed atomically:

1. **Task 1: Update schema, defaults, copy, and rewrite StepFinancials** - `7c24564` (feat)
2. **Task 2: Verify contextual copy and fixed costs breakdown** - auto-approved checkpoint

**Plan metadata:** pending (docs: complete plan)

## Files Created/Modified
- `src/lib/form/step-schemas.ts` - Added 8 fixedCost* fields to Step2Schema
- `src/lib/form/form-defaults.ts` - Added 8 category defaults (all 0)
- `src/lib/form/field-copy.ts` - Added explanation copy for all 8 fixed cost categories
- `src/lib/form/transform.ts` - Destructure out category fields before spreading to CalculatorInput
- `src/components/wizard/steps/StepFinancials.tsx` - Complete rewrite with itemized categories and running total
- `src/lib/form/__tests__/transform.test.ts` - Updated test fixture with category fields
- `src/lib/form/__tests__/step-schemas.test.ts` - Updated Step2Schema tests with category fields + negative test

## Decisions Made
- Kept fixedOverheads as a computed schema field set via setValue (same pattern as StepStaff zeroing fields) rather than computing it only in transform
- Stripped category fields in transform.ts to prevent extra properties leaking into CalculatorInput
- Added a negative category value test case to step-schemas tests (deviation Rule 2 -- test coverage for new validation)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Updated test fixtures for new schema shape**
- **Found during:** Task 1 (verification step)
- **Issue:** Existing tests in transform.test.ts and step-schemas.test.ts used FormValues without the 8 new category fields, causing TypeScript and test failures
- **Fix:** Added all 8 fixedCost* fields to test fixtures; added negative category validation test
- **Files modified:** src/lib/form/__tests__/transform.test.ts, src/lib/form/__tests__/step-schemas.test.ts
- **Verification:** All 80 tests pass, TypeScript compiles clean
- **Committed in:** 7c24564 (part of Task 1 commit)

**2. [Rule 3 - Blocking] Updated transform.ts to strip category fields**
- **Found during:** Task 1 (plan instructed to check tsc first)
- **Issue:** Category fields would spread into CalculatorInput via ...rest causing type mismatch
- **Fix:** Destructured out all 8 fixedCost* fields before spreading rest
- **Files modified:** src/lib/form/transform.ts
- **Verification:** npx tsc --noEmit passes with zero errors
- **Committed in:** 7c24564 (part of Task 1 commit)

---

**Total deviations:** 2 auto-fixed (1 bug, 1 blocking)
**Impact on plan:** Both fixes directly caused by schema changes in this task. No scope creep.

## Issues Encountered
None beyond the auto-fixed deviations above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All form fields across all 4 wizard steps now have contextual explanation copy
- 4 fields have asterisk disclaimers (Corp Tax, employer burden, efficiency cap, slippage)
- Fixed costs itemized with running total feeding calculator engine
- Ready for Phase 05 (output report / results display)

---
*Phase: 04-contextual-copy-input-guidance*
*Completed: 2026-03-28*
