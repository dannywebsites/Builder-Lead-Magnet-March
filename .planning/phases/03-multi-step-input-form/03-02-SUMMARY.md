---
phase: 03-multi-step-input-form
plan: 02
subsystem: ui
tags: [react, react-hook-form, wizard, form-steps]

requires:
  - phase: 03-01
    provides: WizardForm shell, reusable UI components, step schemas, transform layer
provides:
  - 4 step components with all 10 calculator input fields
  - Complete wizard form flow from Step 1 through calculation
  - Zero-staff disable behavior on Step 3
  - Dynamic currency prefix based on Step 1 selection
affects: [phase-04-contextual-copy, phase-05-results-display]

tech-stack:
  added: []
  patterns: [step components use useFormContext/useWatch, no props drilling]

key-files:
  created:
    - src/components/wizard/steps/StepBusinessIdentity.tsx
    - src/components/wizard/steps/StepFinancials.tsx
    - src/components/wizard/steps/StepStaff.tsx
    - src/components/wizard/steps/StepJobPricing.tsx
  modified:
    - src/components/wizard/WizardForm.tsx

key-decisions:
  - "Calculate button uses onClick instead of form submit to avoid cross-step validation blocking"
  - "Step components access form state via useFormContext — no props passed from WizardForm"

patterns-established:
  - "Step components: each step is a self-contained client component using useFormContext/useWatch"
  - "Currency prefix: read currency field via useWatch, derive symbol inline"

requirements-completed: [FORM-02, FORM-03, FORM-04, FORM-05, FORM-06, FORM-07, FORM-08]

duration: 8min
completed: 2026-03-28
---

# Plan 03-02: Step Components Summary

**4 wizard step components with all 10 input fields, zero-staff disable, dynamic currency prefix, and engine wiring**

## Performance

- **Duration:** 8 min
- **Tasks:** 2 (1 auto + 1 human checkpoint)
- **Files created:** 4
- **Files modified:** 1

## Accomplishments
- All 10 calculator inputs across 4 wizard steps: Business (entity, currency, VAT), Money (take-home, fixed costs), Team (count, rate, hours), Pricing (job value, direct cost %)
- Zero-staff disable behavior: rate and hours fields grey out when staff count = 0
- Dynamic currency prefix: £ or € based on Step 1 currency selection
- Calculate button wired to engine — produces result on submit
- Human verification passed: form navigates, validates, and calculates correctly

## Task Commits

1. **Task 1: Build 4 step components and wire into WizardForm** - `612d5ed` (feat)
2. **Task 2: Human verification checkpoint** - approved by user
3. **Fix: Calculate button blocking** - `7740cff` (fix)

## Files Created/Modified
- `src/components/wizard/steps/StepBusinessIdentity.tsx` - Step 1: entity type, currency, VAT rate dropdowns
- `src/components/wizard/steps/StepFinancials.tsx` - Step 2: take-home target, fixed costs with dynamic currency prefix
- `src/components/wizard/steps/StepStaff.tsx` - Step 3: staff count, hourly rate, hours per week with zero-staff disable
- `src/components/wizard/steps/StepJobPricing.tsx` - Step 4: average job value, direct cost % with suffix
- `src/components/wizard/WizardForm.tsx` - Wired step components, fixed calculate button

## Decisions Made
- Changed calculate button from `type="submit"` to `onClick` handler — form-level handleSubmit validates ALL fields across hidden steps, silently blocking submission. onClick validates only Step 4 then calls getValues() directly.

## Deviations from Plan

### Auto-fixed Issues

**1. Submit button blocked by cross-step validation**
- **Found during:** Human verification checkpoint
- **Issue:** `type="submit"` triggered react-hook-form's global validation across all 4 steps. Since steps are conditionally rendered, errors on hidden steps silently prevented submission.
- **Fix:** Changed to `onClick={handleCalculate}` which validates only Step 4 fields, then uses `getValues()` to collect all data and run the calculation.
- **Files modified:** src/components/wizard/WizardForm.tsx
- **Verification:** User confirmed calculate button works and produces result
- **Committed in:** 7740cff

---

**Total deviations:** 1 auto-fixed (blocking bug)
**Impact on plan:** Essential fix for core functionality. No scope creep.

## Issues Encountered
None beyond the submit button fix above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All form fields present and functional — Phase 4 can layer contextual copy and guidance on top
- User feedback captured: wants itemized fixed costs breakdown and trade-specific field explanations in Phase 4
- Results display (Phase 5) can consume calculate() output and render full breakdown

---
*Phase: 03-multi-step-input-form*
*Completed: 2026-03-28*
