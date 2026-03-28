---
phase: 04-contextual-copy-input-guidance
plan: 01
subsystem: ui
tags: [react, tailwind, form-copy, accessibility]

# Dependency graph
requires:
  - phase: 03-multi-step-input-form
    provides: NumberInput, SelectInput components and step components
provides:
  - NumberInput with explanation and disclaimer props
  - SelectInput with explanation prop
  - Centralized FIELD_COPY constants for all form fields
  - Trade-language explanations and protect-framed disclaimers on 8 fields
affects: [04-contextual-copy-input-guidance]

# Tech tracking
tech-stack:
  added: []
  patterns: [centralized copy constants with as const satisfies, explanation/disclaimer prop pattern]

key-files:
  created:
    - src/lib/form/field-copy.ts
  modified:
    - src/components/ui/NumberInput.tsx
    - src/components/ui/SelectInput.tsx
    - src/components/wizard/steps/StepBusinessIdentity.tsx
    - src/components/wizard/steps/StepStaff.tsx
    - src/components/wizard/steps/StepJobPricing.tsx

key-decisions:
  - "Centralized field copy in field-copy.ts with as const satisfies for type safety and literal types"
  - "Disclaimer rendered after error message, not before, to keep error visibility high"

patterns-established:
  - "Field copy pattern: FIELD_COPY.fieldName.explanation / .disclaimer accessed from step components"
  - "Explanation between label and input, disclaimer below input/error"

requirements-completed: [FORM-10, FORM-11]

# Metrics
duration: 2min
completed: 2026-03-28
---

# Phase 4 Plan 01: Field Copy & Input Guidance Summary

**Always-visible plain-English explanations and asterisk disclaimers on all 8 form fields across 3 wizard steps using centralized FIELD_COPY constants**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-28T12:42:23Z
- **Completed:** 2026-03-28T12:44:21Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Extended NumberInput with explanation and disclaimer props including disabled opacity and aria-describedby support
- Extended SelectInput with explanation prop
- Created centralized field-copy.ts with trade-language copy for all 9 field keys including typical ranges and protect-framed disclaimers
- Wired explanations into all 8 fields across StepBusinessIdentity (3), StepStaff (3), and StepJobPricing (2)
- Wired disclaimers into 3 fields with tax/buffer implications (staffHourlyRate, staffHoursPerWeek, directCostPctDisplay)

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend UI components and create field copy constants** - `2a8ffd4` (feat)
2. **Task 2: Wire copy into StepBusinessIdentity, StepStaff, and StepJobPricing** - `6eb71fb` (feat)

## Files Created/Modified
- `src/lib/form/field-copy.ts` - Centralized FIELD_COPY constants with explanation and disclaimer for all 9 form fields
- `src/components/ui/NumberInput.tsx` - Added explanation and disclaimer optional props with conditional rendering and disabled opacity
- `src/components/ui/SelectInput.tsx` - Added explanation optional prop with conditional rendering
- `src/components/wizard/steps/StepBusinessIdentity.tsx` - Wired FIELD_COPY explanations to entityType, currency, vatRate
- `src/components/wizard/steps/StepStaff.tsx` - Wired FIELD_COPY explanations and disclaimers to staffCount, staffHourlyRate, staffHoursPerWeek
- `src/components/wizard/steps/StepJobPricing.tsx` - Wired FIELD_COPY explanations and disclaimers to avgJobValue, directCostPctDisplay

## Decisions Made
- Centralized all field copy in a single file (field-copy.ts) using `as const satisfies` for type safety with literal string types
- Disclaimer rendered after the error message element to maintain error visibility priority
- Used `?? undefined` pattern for disclaimer props to convert null to undefined for optional prop compatibility

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Known Stubs
None - all fields have complete copy wired through FIELD_COPY constants.

## Next Phase Readiness
- Plan 02 (Fixed Costs breakdown) can proceed -- NumberInput explanation/disclaimer pattern is established
- grossPersonalDraw field copy exists in FIELD_COPY but is not yet wired (StepFinancials is handled in Plan 02)

---
*Phase: 04-contextual-copy-input-guidance*
*Completed: 2026-03-28*
