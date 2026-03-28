---
phase: 03-multi-step-input-form
plan: 01
subsystem: form-infrastructure
tags: [wizard, schemas, transform, ui-components, nuqs]
dependency_graph:
  requires: [calculator-engine, calculator-schemas]
  provides: [step-schemas, form-defaults, transform-layer, wizard-shell, ui-components]
  affects: [page-routing, layout]
tech_stack:
  added: [react-hook-form@7.72.0, "@hookform/resolvers@5.2.2", nuqs@2.8.9]
  patterns: [per-step-zod-validation, form-to-engine-transform, url-state-stepper]
key_files:
  created:
    - src/lib/form/step-schemas.ts
    - src/lib/form/form-defaults.ts
    - src/lib/form/transform.ts
    - src/lib/form/__tests__/step-schemas.test.ts
    - src/lib/form/__tests__/transform.test.ts
    - src/components/ui/FormField.tsx
    - src/components/ui/NumberInput.tsx
    - src/components/ui/SelectInput.tsx
    - src/components/wizard/WizardProgress.tsx
    - src/components/wizard/WizardForm.tsx
  modified:
    - package.json
    - pnpm-lock.yaml
    - src/app/layout.tsx
    - src/app/page.tsx
decisions:
  - "Used Suspense boundary around WizardForm to satisfy Next.js static generation with nuqs useSearchParams"
  - "WizardForm uses placeholder divs for step content (Plan 02 builds actual step components)"
metrics:
  duration: 3min
  completed: "2026-03-28T11:27:00Z"
  tasks_completed: 2
  tasks_total: 2
  tests_added: 23
  tests_total: 79
---

# Phase 3 Plan 1: Wizard Infrastructure Summary

Per-step Zod schemas with TDD tests, form-to-engine transform bridging VatRate string-to-number and directCostPctDisplay percentage-to-decimal, reusable UI input components with accessibility, and a wizard shell with 4-step navigation and URL state via nuqs.

## What Was Built

### Form Infrastructure (Task 1 - TDD)
- **Step schemas** (`step-schemas.ts`): 4 independent Zod schemas (Step1-Step4) importing from calculator schemas, with custom validation error messages
- **Form defaults** (`form-defaults.ts`): Default values for all 11 form fields
- **Transform layer** (`transform.ts`): Converts form values to CalculatorInput -- VatRate string "0.20" to number 0.2, directCostPctDisplay 35 to directCostPct 0.35
- **15 schema tests**: Validates acceptance/rejection of all boundary cases
- **8 transform tests**: Covers VatRate conversion, percentage-to-decimal, type safety, and full round-trip through calculate()

### UI Components and Wizard Shell (Task 2)
- **FormField**: Label + slot + error wrapper with aria-describedby
- **NumberInput**: Number input with prefix/suffix, valueAsNumber, error state, 44px touch target
- **SelectInput**: Styled select dropdown with error state and aria attributes
- **WizardProgress**: Horizontal 4-step stepper (Business/Money/Team/Pricing) with completed/current/upcoming visual states, clickable completed steps
- **WizardForm**: Main wizard container with useForm, useQueryState for URL step persistence, per-step validation via handleNext, navigation buttons (Back/Next Step/Calculate Your Numbers)
- **Layout**: NuqsAdapter wrapping children in layout.tsx
- **Page**: WizardForm rendered in Suspense boundary on home page

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | `8eace24` | Step schemas, form defaults, transform layer with TDD tests |
| 2 | `a166139` | UI components, wizard progress stepper, wizard form shell |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added Suspense boundary for nuqs compatibility**
- **Found during:** Task 2 build verification
- **Issue:** Next.js static generation requires useSearchParams (used by nuqs) to be wrapped in a Suspense boundary
- **Fix:** Wrapped `<WizardForm />` in `<Suspense>` in page.tsx
- **Files modified:** src/app/page.tsx

## Verification Results

- `pnpm test`: 79/79 tests passing (6 test files)
- `pnpm build`: Succeeds with zero TypeScript errors
- All acceptance criteria met

## Known Stubs

| File | Line | Stub | Reason |
|------|------|------|--------|
| src/components/wizard/WizardForm.tsx | ~82-97 | Placeholder divs for steps 0-3 | Intentional -- Plan 02 builds StepBusinessIdentity, StepFinancials, StepStaff, StepJobPricing components |

## Self-Check: PASSED

All 10 created files verified on disk. Both commit hashes (8eace24, a166139) verified in git log.
