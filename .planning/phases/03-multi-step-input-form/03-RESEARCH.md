# Phase 3: Multi-Step Input Form - Research

**Researched:** 2026-03-28
**Domain:** React multi-step form with Zod validation, react-hook-form, nuqs URL state
**Confidence:** HIGH

## Summary

This phase builds a 4-step wizard form that collects 10 calculator inputs, validates them with existing Zod schemas, and wires the final submission to the `calculate()` engine. The stack is well-defined: react-hook-form 7.x with `@hookform/resolvers` for Zod integration, nuqs 2.x for persisting the current step in the URL, and Tailwind 4 for styling. No UI component library -- all components are custom Tailwind.

The most important technical detail is that the existing Zod schemas (`schemas.ts`) use **string enums** for VatRate (`"0"`, `"0.135"`, `"0.20"`, `"0.23"`) while the calculator engine expects **numeric** `VatRateValue` (`0 | 0.135 | 0.2 | 0.23`). The form must collect string values from HTML selects and transform them to numbers before calling `calculate()`. This transform layer is the primary integration risk.

**Primary recommendation:** Use react-hook-form with per-step sub-schemas (split from the existing `CalculatorInputSchema`) to validate each step independently, collect all values as the Zod schema types (strings for enums, numbers for numerics), then transform the full form data to `CalculatorInput` before passing to `calculate()`.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** 4-step wizard: Step 1 (Entity Type + Currency + VAT Rate), Step 2 (Gross Personal Draw + Fixed Overheads), Step 3 (Staff Count + Staff Hourly Rate + Staff Hours Per Week), Step 4 (Average Job Value + Direct Cost %)
- **D-02:** All 3 identity fields (Entity Type, Currency, VAT Rate) are separate dropdown/select inputs -- no auto-coupling
- **D-04:** When staffCount = 0, staff rate and hours fields remain visible but greyed out/disabled with 0 values
- **D-05:** Currency is a standalone selector -- user explicitly picks GBP or EUR
- **D-06:** Zod schemas enforce business rules at schema level -- form validation uses the same schemas
- **D-07:** `calculate()` returns full CalculatorOutput with intermediates -- form wires directly to this after final step

### Claude's Discretion
- **D-03:** Direct Cost % input method -- slider+number vs number-only (recommendation below)
- Form layout and visual style (card-based steps, animations, transitions)
- Validation UX (inline per-field, on-blur vs on-next, error message placement)
- Navigation behavior (back/forward, sequential vs jumpable steps)
- Progress indicator design (stepper, progress bar, step dots)
- URL state management approach with nuqs
- Keyboard navigation and accessibility

### Deferred Ideas (OUT OF SCOPE)
None
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FORM-02 | Gross Personal Draw input | Number input in Step 2, validated by `z.number().positive()` from existing schema |
| FORM-03 | Fixed Overheads input | Number input in Step 2, validated by `z.number().nonnegative()` from existing schema |
| FORM-04 | Staff Count input | Integer input in Step 3, validated by `z.number().int().nonnegative()`, drives D-04 zero-staff disable logic |
| FORM-05 | Staff Hourly Rate input | Number input in Step 3, validated by `z.number().nonnegative()`, disabled when staffCount=0 per D-04 |
| FORM-06 | Staff Hours Per Week input | Number input in Step 3, validated by `z.number().nonnegative().max(168)`, disabled when staffCount=0 per D-04 |
| FORM-07 | Average Job Value input | Number input in Step 4, validated by `z.number().positive()` from existing schema |
| FORM-08 | Direct Cost % input | Step 4, validated by `z.number().min(0).max(0.8)` -- research recommends number input with 0-80 display range |
| FORM-12 | Form validation with helpful errors | react-hook-form + zodResolver per step with custom error messages via Zod v4 error map |
| FORM-13 | Multi-step wizard with progress indicator | 4-step wizard with numbered stepper, nuqs for step URL state |
</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-hook-form | 7.72.0 | Form state management | Uncontrolled components, minimal re-renders, native Zod resolver support |
| zod | 4.3.6 | Schema validation | Already in project, schemas pre-built in `schemas.ts` |
| Next.js | 15.5.14 | Framework | Already in project |
| React | 19.2.4 | UI rendering | Already in project |
| Tailwind CSS | 4.x | Styling | Already in project, utility-first |

### To Install
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @hookform/resolvers | 5.2.2 | Zod-to-react-hook-form bridge | zodResolver adapter for form validation |
| nuqs | 2.8.9 | URL query state | Persisting wizard step in URL for back/forward navigation |

### Not Needed
| Library | Why Not |
|---------|---------|
| @testing-library/react | Component testing deferred -- this phase tests form logic via unit tests against schemas and step validation, not DOM rendering |
| framer-motion | Animations are Claude's discretion; CSS transitions sufficient for step changes |
| Any UI component library | Tailwind custom components per stack decision |

**Installation:**
```bash
pnpm add react-hook-form @hookform/resolvers nuqs
```

**Version verification (confirmed 2026-03-28):**
- react-hook-form: 7.72.0 (latest on npm)
- @hookform/resolvers: 5.2.2 (latest on npm, confirmed Zod v4 support)
- nuqs: 2.8.9 (latest on npm, confirmed Next.js 15 App Router support)

## Architecture Patterns

### Recommended Project Structure
```
src/
  components/
    wizard/
      WizardForm.tsx           # Main wizard container (client component)
      WizardProgress.tsx       # Step indicator/stepper UI
      steps/
        StepBusinessIdentity.tsx  # Step 1: Entity + Currency + VAT
        StepFinancials.tsx        # Step 2: Draw + Overheads
        StepStaff.tsx             # Step 3: Staff x3
        StepJobPricing.tsx        # Step 4: Job Value + Direct Cost %
    ui/
      NumberInput.tsx           # Reusable currency/number input with formatting
      SelectInput.tsx           # Reusable styled select dropdown
      FormField.tsx             # Label + input + error wrapper
  lib/
    calculator/                 # Existing -- DO NOT MODIFY
      types.ts
      schemas.ts
      engine.ts
      ...
    form/
      step-schemas.ts           # Per-step Zod sub-schemas derived from CalculatorInputSchema
      form-defaults.ts          # Default values for each step
      transform.ts              # ValidatedCalculatorInput -> CalculatorInput transform
  app/
    page.tsx                    # Hosts WizardForm
    layout.tsx                  # Add NuqsAdapter wrapper
```

### Pattern 1: Per-Step Schema Validation
**What:** Split the monolithic `CalculatorInputSchema` into per-step sub-schemas so each step validates only its own fields.
**When to use:** Always -- the wizard must validate step-by-step, not all-at-once.
**Example:**
```typescript
// src/lib/form/step-schemas.ts
import * as z from "zod/v4";
import { EntityTypeSchema, CurrencySchema, VatRateSchema } from "@/lib/calculator";

// Step 1: Business Identity
export const Step1Schema = z.object({
  entityType: EntityTypeSchema,
  currency: CurrencySchema,
  vatRate: VatRateSchema,
});

// Step 2: Financials
export const Step2Schema = z.object({
  grossPersonalDraw: z.number().positive("Enter your monthly take-home target"),
  fixedOverheads: z.number().nonnegative("Overheads cannot be negative"),
});

// Step 3: Staff
export const Step3Schema = z.object({
  staffCount: z.number().int().nonnegative("Staff count must be 0 or more"),
  staffHourlyRate: z.number().nonnegative("Rate cannot be negative"),
  staffHoursPerWeek: z.number().nonnegative("Hours cannot be negative").max(168, "Max 168 hours per week"),
});

// Step 4: Job Pricing
export const Step4Schema = z.object({
  avgJobValue: z.number().positive("Enter your average job value"),
  directCostPct: z.number().min(0, "Cannot be negative").max(0.8, "Direct costs cannot exceed 80%"),
});

export const STEP_SCHEMAS = [Step1Schema, Step2Schema, Step3Schema, Step4Schema] as const;
```

### Pattern 2: react-hook-form Multi-Step with Single FormProvider
**What:** One `useForm` instance wraps all steps. Each step renders a subset of fields. Validation runs per-step using the step's sub-schema before advancing.
**When to use:** Always for multi-step forms where you want data to persist across steps.
**Example:**
```typescript
// src/components/wizard/WizardForm.tsx
"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryState, parseAsInteger } from "nuqs";
import { CalculatorInputSchema } from "@/lib/calculator";
import type { ValidatedCalculatorInput } from "@/lib/calculator";
import { STEP_SCHEMAS } from "@/lib/form/step-schemas";
import { FORM_DEFAULTS } from "@/lib/form/form-defaults";

export function WizardForm() {
  const [step, setStep] = useQueryState("step", parseAsInteger.withDefault(0));

  const methods = useForm<ValidatedCalculatorInput>({
    // Use the full schema as the default resolver
    // but validate per-step on "Next"
    mode: "onTouched",
    defaultValues: FORM_DEFAULTS,
  });

  const handleNext = async () => {
    // Validate only current step's fields
    const stepSchema = STEP_SCHEMAS[step];
    const stepFields = Object.keys(stepSchema.shape) as Array<keyof ValidatedCalculatorInput>;
    const isValid = await methods.trigger(stepFields);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const onSubmit = (data: ValidatedCalculatorInput) => {
    // Transform and calculate
    const input = transformToCalculatorInput(data);
    const result = calculate(input);
    // Result display is Phase 5 -- for now, wire up but don't render
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {/* Render current step component */}
        {/* Navigation buttons */}
      </form>
    </FormProvider>
  );
}
```

### Pattern 3: String-to-Number Transform for Engine Integration
**What:** The Zod schemas use string enums for VatRate (`"0"`, `"0.135"`, etc.) matching HTML select values, but `calculate()` expects numeric `VatRateValue`. A transform function bridges the gap.
**When to use:** On final form submission before calling `calculate()`.
**Example:**
```typescript
// src/lib/form/transform.ts
import type { CalculatorInput, VatRateValue } from "@/lib/calculator";
import type { ValidatedCalculatorInput } from "@/lib/calculator";

export function transformToCalculatorInput(validated: ValidatedCalculatorInput): CalculatorInput {
  return {
    ...validated,
    vatRate: Number.parseFloat(validated.vatRate) as VatRateValue,
  };
}
```

### Pattern 4: nuqs Adapter Setup
**What:** Wrap root layout with NuqsAdapter to enable URL state.
**Example:**
```typescript
// src/app/layout.tsx
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
```

### Pattern 5: Zero-Staff Conditional Disable (D-04)
**What:** Watch `staffCount` field and conditionally disable/grey out staffHourlyRate and staffHoursPerWeek.
**Example:**
```typescript
// Inside StepStaff.tsx
const staffCount = useWatch({ name: "staffCount" });
const isStaffDisabled = staffCount === 0;

// Render rate/hours inputs with:
// disabled={isStaffDisabled}
// className={isStaffDisabled ? "opacity-50 cursor-not-allowed" : ""}
```

### Anti-Patterns to Avoid
- **Separate useForm per step:** Loses data when navigating back. Use one FormProvider for the whole wizard.
- **Validating all fields on each step:** Users see errors for fields they haven't reached yet. Validate only current step's fields.
- **Storing form data in URL:** Only the step number goes in the URL. Form data stays in react-hook-form state (sensitive financial data should not be in URLs).
- **Controlled number inputs without coercion:** HTML inputs return strings. Use `valueAsNumber` on `<input type="number">` to get automatic string-to-number coercion with react-hook-form's `register`.
- **Modifying existing schemas.ts:** The calculator schemas are the source of truth. Derive step schemas by referencing the same validation rules, or use `.pick()` if Zod v4 supports it.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form state across steps | Custom useState/useReducer state machine | react-hook-form FormProvider | Handles dirty tracking, validation, re-render optimization, error state |
| URL step persistence | Manual window.history / useSearchParams | nuqs `useQueryState` with `parseAsInteger` | Type-safe, handles serialization, SSR-compatible, back button works |
| Zod-to-form-error mapping | Manual try/catch + error extraction | `zodResolver` from @hookform/resolvers | Maps Zod issues to field-level errors automatically |
| Number input formatting | Manual onChange handlers with regex | `register` with `valueAsNumber: true` | Built into react-hook-form, handles edge cases (empty string, NaN) |
| Accessible form errors | Manual aria attributes | react-hook-form `formState.errors` + aria-describedby pattern | Standard pattern, easy to implement correctly |

## Common Pitfalls

### Pitfall 1: HTML Inputs Return Strings, Not Numbers
**What goes wrong:** `<input type="number">` returns a string from `event.target.value`. Zod schemas expect `z.number()` and validation fails with "Expected number, received string."
**Why it happens:** Default browser behavior. react-hook-form's `register` returns strings unless told otherwise.
**How to avoid:** Always use `{ valueAsNumber: true }` in the `register` options for number fields: `register("grossPersonalDraw", { valueAsNumber: true })`.
**Warning signs:** Zod validation errors saying "Expected number, received string" on fields that look correct to the user.

### Pitfall 2: VatRate String/Number Type Mismatch
**What goes wrong:** The Zod schema validates VatRate as a string enum (`"0.20"`), but `calculate()` expects a numeric VatRateValue (`0.2`). Passing the raw form output to the engine causes type errors or wrong calculations.
**Why it happens:** HTML `<select>` values are always strings. The schema was correctly designed to validate string inputs. The engine was correctly designed to work with numbers. The gap is in the transform layer.
**How to avoid:** Create an explicit `transformToCalculatorInput()` function that converts `ValidatedCalculatorInput` to `CalculatorInput`. Call this only on final submission, not during step validation.
**Warning signs:** TypeScript errors about string not assignable to number, or calculations producing NaN.

### Pitfall 3: Step Navigation Loses Validation State
**What goes wrong:** User fills Step 1, goes to Step 2, goes back to Step 1, changes a value. The form doesn't re-validate Step 1 on the way forward.
**Why it happens:** Validation only triggers on "Next" button, not when re-visiting completed steps.
**How to avoid:** Use `mode: "onTouched"` so fields validate on blur after first interaction. Re-trigger step validation when clicking "Next" regardless of whether fields have been touched.
**Warning signs:** Invalid data reaching the calculation engine.

### Pitfall 4: Direct Cost % Display vs Storage
**What goes wrong:** Direct cost % is stored as a decimal (0.0 to 0.8) in the schema but users think in percentages (0% to 80%). Displaying 0.35 confuses tradespeople.
**Why it happens:** Schema uses decimal representation for calculation correctness.
**How to avoid:** Display the field as 0-80 (percentage), but store as 0.0-0.8 (decimal). Either: (a) use a display transform in the input component, or (b) create a form-specific field that stores 0-80 and transform to decimal on submission. Option (b) is simpler and avoids confusing the user.
**Warning signs:** Users entering "35" and getting validation errors because 35 > 0.8.

### Pitfall 5: Empty Number Inputs Produce NaN
**What goes wrong:** User clears a number input. `valueAsNumber` returns `NaN`. Zod's `z.number()` rejects NaN but the error message is unhelpful ("Expected number, received nan").
**Why it happens:** `valueAsNumber` on an empty `<input type="number">` returns NaN per the HTML spec.
**How to avoid:** Add a Zod `.refine()` or use a custom transform to convert NaN to undefined, then let the `.positive()` or `.nonnegative()` check catch it with a user-friendly message. Alternatively, handle at the input component level.
**Warning signs:** Error messages showing technical terms like "NaN" to non-technical users.

### Pitfall 6: nuqs SSR Hydration Mismatch
**What goes wrong:** The server renders step 0 (no URL params), but the client reads `?step=2` from the URL. React hydration mismatch warning.
**Why it happens:** Server components don't have access to client-side URL state at render time.
**How to avoid:** The WizardForm must be a client component (`"use client"`). Use `useQueryState` with `withDefault(0)` so the initial render is deterministic. The NuqsAdapter handles the hydration correctly when placed in the layout.
**Warning signs:** React hydration warnings in console, flash of wrong step on page load.

## Code Examples

### Number Input with Currency Symbol
```typescript
// src/components/ui/NumberInput.tsx
"use client";

import { useFormContext } from "react-hook-form";

interface NumberInputProps {
  name: string;
  label: string;
  prefix?: string;      // e.g., "GBP" or "EUR" symbol
  suffix?: string;      // e.g., "%" or "hrs"
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: string;        // HTML step attribute for decimals
}

export function NumberInput({ name, label, prefix, suffix, placeholder, disabled, min, max, step }: NumberInputProps) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {prefix}
          </span>
        )}
        <input
          id={name}
          type="number"
          inputMode="decimal"
          disabled={disabled}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`
            w-full rounded-lg border px-3 py-2
            ${prefix ? "pl-10" : ""}
            ${suffix ? "pr-10" : ""}
            ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : "bg-white"}
            ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}
            focus:outline-none focus:ring-2
          `}
          {...register(name, { valueAsNumber: true })}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p id={`${name}-error`} className="text-sm text-red-600" role="alert">
          {error.message as string}
        </p>
      )}
    </div>
  );
}
```

### Select Input for Dropdowns
```typescript
// src/components/ui/SelectInput.tsx
"use client";

import { useFormContext } from "react-hook-form";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectInputProps {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
}

export function SelectInput({ name, label, options, placeholder }: SelectInputProps) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <select
        id={name}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`
          w-full rounded-lg border px-3 py-2 bg-white
          ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}
          focus:outline-none focus:ring-2
        `}
        {...register(name)}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${name}-error`} className="text-sm text-red-600" role="alert">
          {error.message as string}
        </p>
      )}
    </div>
  );
}
```

### Direct Cost % Recommendation (D-03)
**Recommendation: Number input with percentage display (0-80), not a slider.**

Rationale:
- Tradespeople know their material cost percentage as a number ("about 35%"), not as a slider position
- A slider lacks precision for values like 12.5%
- Number input with `min=0 max=80 step="0.1"` enforces the 80% cap naturally via HTML + Zod
- The value must be divided by 100 before storage/validation (form displays 0-80, schema expects 0.0-0.8)
- Add inline helper text: "What percentage of each job goes to materials, fuel, and disposal?"

```typescript
// In StepJobPricing.tsx -- Direct Cost % field
// Display as 0-80 percentage, transform to 0.0-0.8 on submission
<NumberInput
  name="directCostPctDisplay"
  label="Direct Cost %"
  suffix="%"
  placeholder="e.g. 35"
  min={0}
  max={80}
  step="0.1"
/>
// On form submission: directCostPct = directCostPctDisplay / 100
```

Alternatively, keep the field as `directCostPct` storing the decimal (0.0-0.8) and add a display wrapper that multiplies by 100 for showing/editing. Either approach works; the transform-on-submit approach is simpler to reason about.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Zod v3 `z.enum()` | Zod v4 `z.enum()` via `import * as z from "zod/v4"` | Zod 4.0 (2025) | Same API surface, new import path. Project already uses v4. |
| @hookform/resolvers Zod v3 only | @hookform/resolvers 5.x supports Zod v4 | resolvers 5.2.0+ | `zodResolver` works identically with both Zod v3 and v4 schemas |
| nuqs 1.x (Pages Router) | nuqs 2.x (App Router native) | nuqs 2.0 (2024) | Requires NuqsAdapter in layout, uses React 18+ transitions |
| react-hook-form `resolver` only | react-hook-form `trigger` for partial validation | Always available | `trigger(fieldNames)` validates a subset -- essential for multi-step |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 |
| Config file | `vitest.config.ts` (exists, environment: node) |
| Quick run command | `pnpm test` |
| Full suite command | `pnpm test` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FORM-02 | Gross Personal Draw accepts positive numbers, rejects 0/negative | unit | `pnpm test -- src/lib/form/step-schemas.test.ts` | Wave 0 |
| FORM-03 | Fixed Overheads accepts 0 and positive, rejects negative | unit | `pnpm test -- src/lib/form/step-schemas.test.ts` | Wave 0 |
| FORM-04 | Staff Count accepts non-negative integers, rejects decimals/negatives | unit | `pnpm test -- src/lib/form/step-schemas.test.ts` | Wave 0 |
| FORM-05 | Staff Hourly Rate accepts non-negative numbers | unit | `pnpm test -- src/lib/form/step-schemas.test.ts` | Wave 0 |
| FORM-06 | Staff Hours Per Week accepts 0-168, rejects >168 | unit | `pnpm test -- src/lib/form/step-schemas.test.ts` | Wave 0 |
| FORM-07 | Average Job Value accepts positive numbers | unit | `pnpm test -- src/lib/form/step-schemas.test.ts` | Wave 0 |
| FORM-08 | Direct Cost % accepts 0-0.8, rejects >0.8 | unit | `pnpm test -- src/lib/form/step-schemas.test.ts` | Wave 0 |
| FORM-12 | All steps validate with helpful error messages | unit | `pnpm test -- src/lib/form/step-schemas.test.ts` | Wave 0 |
| FORM-13 | Wizard step progression and regression | unit | `pnpm test -- src/lib/form/transform.test.ts` | Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm test`
- **Per wave merge:** `pnpm test && pnpm build`
- **Phase gate:** Full suite green + build passes before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/lib/form/step-schemas.test.ts` -- covers FORM-02 through FORM-08, FORM-12 (per-step schema validation)
- [ ] `src/lib/form/transform.test.ts` -- covers ValidatedCalculatorInput to CalculatorInput transform (VatRate string-to-number)
- [ ] Install: no additional test dependencies needed (vitest + @vitejs/plugin-react already installed; tests are schema-level, not component-level)

**Note:** Component-level tests (rendering, user interaction) would require `@testing-library/react` + `jsdom` environment. For this phase, schema validation and transform logic tests provide sufficient coverage. Component testing can be added in a UX polish phase.

## Open Questions

1. **Direct Cost % UX: display as percentage or decimal?**
   - What we know: Schema stores 0.0-0.8 (decimal). Users think in 0%-80% (percentage).
   - What's unclear: Whether to transform at input or at submission.
   - Recommendation: Display as 0-80 percentage in the input, transform to decimal (divide by 100) on final submission. This is simpler and matches user mental model.

2. **Stepper navigation: sequential-only or jumpable?**
   - What we know: Sequential (can only go forward after validation) is safer. Jumpable (click any completed step) is more flexible.
   - What's unclear: User preference for tradespeople who may want to review earlier steps.
   - Recommendation: Sequential forward (must validate to proceed), but allow jumping back to any completed step by clicking the stepper. This prevents skipping validation while allowing review.

## Project Constraints (from CLAUDE.md)

- GSD workflow must be used for all file changes
- Biome for linting/formatting (`pnpm lint`, `pnpm format`)
- Vitest for testing (`pnpm test`)
- pnpm as package manager
- TypeScript strict mode
- Feature-based folder structure

## Sources

### Primary (HIGH confidence)
- Project source code: `src/lib/calculator/schemas.ts`, `types.ts`, `engine.ts` -- examined directly
- [@hookform/resolvers npm](https://www.npmjs.com/package/@hookform/resolvers) -- v5.2.2 confirmed Zod v4 support
- [nuqs documentation](https://nuqs.dev/docs/adapters) -- NuqsAdapter setup for Next.js App Router
- [nuqs built-in parsers](https://nuqs.dev/docs/parsers/built-in) -- parseAsInteger for step state

### Secondary (MEDIUM confidence)
- [react-hook-form/resolvers GitHub](https://github.com/react-hook-form/resolvers) -- zodResolver import path for Zod v4
- [nuqs GitHub](https://github.com/47ng/nuqs) -- confirmed 2.x is App Router native

### Tertiary (LOW confidence)
- [Zod v4 + hookform issues](https://github.com/colinhacks/zod/issues/4992) -- some reported type errors in early 5.2.0, resolved in 5.2.1+

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries verified against npm registry, versions confirmed, compatibility checked
- Architecture: HIGH -- react-hook-form multi-step pattern is well-documented and battle-tested; existing schemas examined
- Pitfalls: HIGH -- string/number mismatch identified from actual schema code; NaN/valueAsNumber is a known react-hook-form pattern

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (stable libraries, no fast-moving dependencies)
