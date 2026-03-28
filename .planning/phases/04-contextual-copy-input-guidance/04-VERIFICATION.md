---
phase: 04-contextual-copy-input-guidance
verified: 2026-03-28T12:55:00Z
status: passed
score: 11/11 must-haves verified
re_verification: false
gaps: []
human_verification:
  - test: "Walk through all 4 wizard steps in the browser"
    expected: "Explanation text appears between label and input on every field; asterisk disclaimers appear below input on grossPersonalDraw, staffHourlyRate, staffHoursPerWeek, directCostPctDisplay; disabled staff fields show reduced-opacity explanation text; Fixed Costs running total updates as values are typed; full calculation still completes."
    why_human: "Visual rendering, opacity appearance on disabled fields, and reactive total update require browser verification."
---

# Phase 4: Contextual Copy & Input Guidance Verification Report

**Phase Goal:** Every input field displays a plain-English explanation and contextual asterisk notes (tax disclaimers, buffer explanations) so tradespeople understand exactly what they are entering and why.
**Verified:** 2026-03-28T12:55:00Z
**Status:** passed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|---------|
| 1 | Every input field across all 4 wizard steps shows a plain-English explanation between the label and the input | VERIFIED | `explanation` prop wired on all 3 SelectInputs in StepBusinessIdentity (entityType, currency, vatRate); all 3 NumberInputs in StepStaff; both NumberInputs in StepJobPricing; grossPersonalDraw + all 8 fixedCost* inputs in StepFinancials |
| 2 | Fields with tax/buffer implications display asterisk disclaimers below the input | VERIFIED | `disclaimer` wired on grossPersonalDraw (Corp Tax), staffHourlyRate (employer burden), staffHoursPerWeek (efficiency cap), directCostPctDisplay (slippage) |
| 3 | Explanation text uses trade language, not financial jargon | VERIFIED | field-copy.ts uses "van lease", "skip hire", "callbacks", "employer National Insurance", "chargeable work" throughout — no generic financial jargon found |
| 4 | Disabled staff fields show explanation text at reduced opacity | VERIFIED | NumberInput renders `opacity-50` class on explanation `<p>` when `disabled=true`; StepStaff passes `disabled={isStaffDisabled}` to staffHourlyRate and staffHoursPerWeek |
| 5 | Guardrail copy uses "protect" framing, not "limit" framing | VERIFIED | All 3 disclaimers contain "protect" or "protects"; no "cannot", "maximum", "limited to", or "restricted" found in field-copy.ts disclaimer strings |
| 6 | Fixed Costs field replaced by 8 itemized category inputs with running total | VERIFIED | StepFinancials iterates over FIXED_COST_FIELDS (8 items); total computed via useWatch + reduce; displayed as "Total Monthly Fixed Costs" with formatted currency |
| 7 | Each fixed cost category has its own label and explanation text | VERIFIED | FIXED_COST_LABELS maps all 8 keys; FIELD_COPY contains explanation for all 8 fixedCost* keys; explanation passed via `FIELD_COPY[fieldName].explanation` in map |
| 8 | Running total updates reactively as user enters values | VERIFIED | `useWatch({ name: [...FIXED_COST_FIELDS] })` + `reduce` + `useEffect(() => setValue("fixedOverheads", total))` pattern matches StepStaff precedent |
| 9 | Calculator engine receives fixedOverheads as single number (sum of categories) | VERIFIED | transform.ts destructures out all 8 fixedCost* fields before spreading `...rest`; `fixedOverheads` stays in `rest` and flows to CalculatorInput |
| 10 | Gross Personal Draw shows explanation and Corp Tax disclaimer | VERIFIED | StepFinancials lines 61-62: `explanation={FIELD_COPY.grossPersonalDraw.explanation}` and `disclaimer={FIELD_COPY.grossPersonalDraw.disclaimer ?? undefined}` |
| 11 | No category field has a pre-filled default value (all default to 0) | VERIFIED | form-defaults.ts: all 8 fixedCost* fields default to 0; placeholders show "e.g. 200" |

**Score:** 11/11 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/lib/form/field-copy.ts` | Centralized copy constants for all form fields | VERIFIED | Exports `FIELD_COPY` as `const satisfies Record<string, FieldCopyEntry>`; 17 keys covering all form fields including all 8 fixedCost* categories |
| `src/components/ui/NumberInput.tsx` | NumberInput with explanation and disclaimer props | VERIFIED | Interface includes `explanation?: string` and `disclaimer?: string`; explanation rendered with `text-sm text-gray-500` + disabled opacity; disclaimer rendered with `text-xs text-gray-400 italic` + disabled opacity + `aria-describedby` wiring |
| `src/components/ui/SelectInput.tsx` | SelectInput with explanation prop | VERIFIED | Interface includes `explanation?: string`; rendered with `text-sm text-gray-500` between label and select |
| `src/lib/form/step-schemas.ts` | Step2Schema with 8 category fields plus fixedOverheads | VERIFIED | All 8 `fixedCost*` fields present as `z.number().nonnegative()`; `fixedOverheads` retained |
| `src/lib/form/form-defaults.ts` | Default values including all category fields at 0 | VERIFIED | All 8 `fixedCost*` fields present at value 0 |
| `src/components/wizard/steps/StepFinancials.tsx` | Itemized fixed costs with running total and explanation copy | VERIFIED | Uses `useWatch`, `useEffect`, `setValue`; iterates FIXED_COST_FIELDS; renders "Total Monthly Fixed Costs" total; no visible fixedOverheads input |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| StepBusinessIdentity.tsx | field-copy.ts | `import { FIELD_COPY }` | WIRED | `FIELD_COPY.entityType.explanation`, `.currency.explanation`, `.vatRate.explanation` all used |
| StepStaff.tsx | field-copy.ts | `import { FIELD_COPY }` | WIRED | `FIELD_COPY.staffCount.explanation`, `.staffHourlyRate.explanation`, `.staffHourlyRate.disclaimer`, `.staffHoursPerWeek.explanation`, `.staffHoursPerWeek.disclaimer` all used |
| StepJobPricing.tsx | field-copy.ts | `import { FIELD_COPY }` | WIRED | `FIELD_COPY.avgJobValue.explanation`, `.directCostPctDisplay.explanation`, `.directCostPctDisplay.disclaimer` all used |
| StepFinancials.tsx | field-copy.ts | `import { FIELD_COPY }` | WIRED | `FIELD_COPY.grossPersonalDraw.explanation`, `.grossPersonalDraw.disclaimer`, `FIELD_COPY[fieldName].explanation` (8 categories) all used |
| StepFinancials.tsx | step-schemas.ts | form field names match schema keys | WIRED | `fixedCostVehicle` through `fixedCostOther` present in both FIXED_COST_FIELDS array and Step2Schema |
| form-defaults.ts | step-schemas.ts | FormValues type import | WIRED | `import type { FormValues } from "./step-schemas"`; all 8 fixedCost* fields at 0 match schema |
| transform.ts | CalculatorInput | destructure + spread | WIRED | All 8 fixedCost* fields destructured out; `fixedOverheads` in `...rest` flows to CalculatorInput |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| StepFinancials.tsx — running total | `total` (computed from `categories`) | `useWatch({ name: [...FIXED_COST_FIELDS] })` observes live form state; `reduce` sums values | Yes — reactive to user input via react-hook-form | FLOWING |
| StepFinancials.tsx — fixedOverheads | `fixedOverheads` (set via `setValue`) | `useEffect` fires on `total` change; `setValue("fixedOverheads", total)` | Yes — computed value written to form state on each change | FLOWING |
| NumberInput explanation/disclaimer | Props from parent | Passed via `FIELD_COPY.*` constants | Yes — constants file populated with real copy strings | FLOWING |

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| TypeScript compilation clean | `npx tsc --noEmit` | No output (zero errors) | PASS |
| All 80 tests pass | `pnpm test` | 80 passed across 6 test files | PASS |
| field-copy.ts contains 75% efficiency cap disclaimer | grep in file | Line 83: "75% efficiency cap" found | PASS |
| field-copy.ts contains 15% slippage disclaimer | grep in file | Line 94: "15% slippage factor" found | PASS |
| field-copy.ts contains 20% Corp Tax disclaimer | grep in file | Line 66: "20% Corporation Tax buffer" found | PASS |
| field-copy.ts contains 30% employer burden disclaimer | grep in file | Line 77: "30%" found | PASS |
| No anti-framing copy in disclaimers | grep for cannot/limit in field-copy.ts | Only "limited companies" (entity name) — not framing language | PASS |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|---------|
| FORM-10 | 04-01, 04-02 | Every input field displays a plain-English note explaining what it means and why it matters | SATISFIED | explanation prop wired on all inputs across all 4 steps via FIELD_COPY constants |
| FORM-11 | 04-01, 04-02 | Every input field displays contextual asterisk notes where applicable | SATISFIED | disclaimer prop wired on grossPersonalDraw (Corp Tax), staffHourlyRate (30% employer burden), staffHoursPerWeek (75% efficiency cap), directCostPctDisplay (15% slippage) |

Both requirement IDs from both plan frontmatters accounted for. REQUIREMENTS.md marks FORM-10 and FORM-11 as `[x]` complete and assigned to Phase 4. No orphaned requirements detected.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| None found | — | — | — | — |

No TODO/FIXME comments, no placeholder text, no empty handlers, no hardcoded empty arrays/objects found across any phase-4 modified files.

---

### Human Verification Required

#### 1. Visual layout and opacity rendering across all 4 steps

**Test:** Run `pnpm dev`, open http://localhost:3000, and step through the full wizard.

**Expected:**
- Step 1 (Your Business): All 3 dropdowns (Business Type, Currency, VAT Rate) show muted explanation text between label and dropdown.
- Step 2 (Your Money): Gross Personal Draw shows explanation + asterisk Corp Tax disclaimer. Eight itemized cost categories appear (Vehicle/Van through Other), each with explanation. Running total at bottom updates as values are typed.
- Step 3 (Your Team): Staff Count shows explanation. Staff Hourly Rate and Staff Hours Per Week show explanation + respective disclaimers. Setting Staff Count to 0 disables those fields — explanation text should still be visible but at reduced opacity.
- Step 4 (Your Jobs): Average Job Value shows explanation. Direct Costs % shows explanation + slippage disclaimer.
- Completing the full form produces a correct calculation result.

**Why human:** Opacity rendering, visual spacing between label/explanation/input, and reactive total require browser rendering to confirm. TypeScript and grep verification cannot validate visual appearance.

---

### Gaps Summary

No gaps. All 11 observable truths are verified against the actual codebase. All artifacts exist, are substantive, and are fully wired with live data flowing. TypeScript compiles clean. All 80 tests pass. Requirements FORM-10 and FORM-11 are satisfied.

One item routed to human verification: visual/browser confirmation of layout and disabled-field opacity across all 4 steps. This does not block the automated verdict — the code implementing these behaviors is correct.

---

_Verified: 2026-03-28T12:55:00Z_
_Verifier: Claude (gsd-verifier)_
