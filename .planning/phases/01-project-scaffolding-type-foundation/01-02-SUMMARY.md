---
phase: 01-project-scaffolding-type-foundation
plan: 02
subsystem: calculator
tags: [typescript, zod, zod-v4, intl-numberformat, currency, validation, schemas]

# Dependency graph
requires:
  - phase: 01-project-scaffolding-type-foundation/01-01
    provides: "Next.js 15 project scaffold with Vitest, TypeScript, and path aliases"
provides:
  - "TypeScript interfaces (CalculatorInput, CalculatorOutput, EntityType, Currency, VatRateValue)"
  - "Zod v4 validation schemas with business rule enforcement at schema level"
  - "Business rule constants (efficiency cap, slippage, employer burden, etc.)"
  - "Currency formatting utility (GBP/EUR) with configurable decimal places"
  - "roundCurrency utility for floating point precision"
  - "Barrel export at @/lib/calculator"
affects: [calculation-engine, multi-step-form, results-display, pdf-report]

# Tech tracking
tech-stack:
  added: [zod-v4]
  patterns: [schema-level-business-rules, intl-numberformat-currency, barrel-exports, tdd-red-green]

key-files:
  created:
    - src/lib/calculator/types.ts
    - src/lib/calculator/constants.ts
    - src/lib/calculator/schemas.ts
    - src/lib/calculator/currency.ts
    - src/lib/calculator/index.ts
    - src/lib/calculator/__tests__/schemas.test.ts
    - src/lib/calculator/__tests__/currency.test.ts
  modified: []

key-decisions:
  - "VatRate schema uses string enum values matching HTML select output; TypeScript type uses numeric literals for calculation layer"
  - "Zod v4 via zod/v4 import path for 14x faster parsing and smaller bundle"
  - "Business rules enforced at schema level (directCostPct max 0.80, staffCount nonnegative integer)"

patterns-established:
  - "Schema-level validation: Business constraints encoded in Zod schemas, making invalid states unrepresentable"
  - "Currency formatting: All monetary display goes through formatCurrency() with Intl.NumberFormat"
  - "Calculator module isolation: src/lib/calculator/ has zero UI imports, unit-testable in isolation"
  - "Barrel export pattern: Single index.ts re-exports all public types, schemas, constants, and utilities"

requirements-completed: [FORM-01, FORM-09, CALC-07]

# Metrics
duration: 2min
completed: 2026-03-28
---

# Phase 01 Plan 02: Calculator Types & Schemas Summary

**Zod v4 validation schemas enforcing business rules, TypeScript type contracts, and currency formatting utilities for GBP/EUR with Intl.NumberFormat**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-28T02:22:16Z
- **Completed:** 2026-03-28T02:24:40Z
- **Tasks:** 2
- **Files created:** 7

## Accomplishments
- Complete TypeScript type system for calculator inputs/outputs with EntityType, Currency, VatRateValue unions
- Zod v4 schemas enforcing business rules at schema level (directCostPct max 0.80, staffCount nonneg integer, staffHoursPerWeek max 168)
- Currency formatting with Intl.NumberFormat supporting GBP (en-GB) and EUR (en-IE) with configurable decimal places
- 29 unit tests passing covering schema validation and currency formatting

## Task Commits

Each task was committed atomically:

1. **Task 1: Create type definitions, constants, and Zod schemas** - `6c407df` (feat)
2. **Task 2: Create currency formatting utility, barrel export, and currency tests** - `825b20f` (feat)

## Files Created/Modified
- `src/lib/calculator/types.ts` - TypeScript interfaces: EntityType, Currency, VatRateValue, CalculatorInput, CalculatorOutput, VAT_RATE_OPTIONS
- `src/lib/calculator/constants.ts` - Business rule constants: VAT_RATES, BUSINESS_RULES (efficiency cap, slippage, employer burden, etc.)
- `src/lib/calculator/schemas.ts` - Zod v4 schemas: EntityTypeSchema, VatRateSchema, CurrencySchema, CalculatorInputSchema
- `src/lib/calculator/currency.ts` - formatCurrency (Intl.NumberFormat) and roundCurrency utilities
- `src/lib/calculator/index.ts` - Barrel export for all public types, schemas, constants, and utilities
- `src/lib/calculator/__tests__/schemas.test.ts` - 18 tests for schema validation (FORM-01, FORM-09)
- `src/lib/calculator/__tests__/currency.test.ts` - 11 tests for currency formatting and rounding (CALC-07)

## Decisions Made
- VatRate schema uses string enum ("0", "0.135", "0.20", "0.23") matching HTML select output; TypeScript VatRateValue type uses numeric literals (0, 0.135, 0.20, 0.23) for calculation layer. Form layer will handle conversion.
- Used Zod v4 via `zod/v4` import path per research recommendation (14x faster parsing).
- Business rules enforced at schema level per D-06, making invalid states unrepresentable.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Known Stubs
None - all functionality is fully wired.

## Next Phase Readiness
- Type contracts established for calculation engine (Phase 2)
- Schemas ready for react-hook-form integration (Phase 3)
- Currency formatting ready for results display (Phase 5) and PDF report (Phase 7)
- All 29 tests passing, build succeeds

## Self-Check: PASSED

- All 7 created files verified on disk
- Commit 6c407df verified in git log
- Commit 825b20f verified in git log
- 29/29 tests passing
- Build succeeds

---
*Phase: 01-project-scaffolding-type-foundation*
*Completed: 2026-03-28*
