# Phase 4: Contextual Copy & Input Guidance - Research

**Researched:** 2026-03-28
**Domain:** UI copy, form field guidance, itemized input decomposition
**Confidence:** HIGH

## Summary

This phase is primarily a content and UI layout phase, not a library or infrastructure phase. The work involves: (1) adding plain-English explanation text and asterisk disclaimers to every input field across four wizard steps, (2) converting the single `fixedOverheads` field into an itemized category breakdown with a running total, and (3) updating the Zod schema, form defaults, and transform layer to support the new category fields while keeping the `CalculatorInput` interface unchanged.

No new libraries are needed. The existing stack (react-hook-form, Zod v4, Tailwind CSS, Next.js) handles everything. The core challenge is structural: extending `FormField`/`NumberInput`/`SelectInput` components to render explanation and disclaimer text, then writing clear trade-language copy for every field.

**Primary recommendation:** Extend UI components with `explanation` and `disclaimer` props, then update each step component with copy content. Handle the Fixed Costs breakdown as a self-contained sub-form that sums categories into the existing `fixedOverheads` value.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Fixed Costs field becomes an itemized category breakdown instead of a single number input. Categories: Vehicle/Van, Premises/Rent, Equipment/Tools, Insurance, Technology/Software, Loans/Finance, Professional Fees, Other.
- **D-02:** Each category is a NumberInput with its own label and explanation. A running total displays at the bottom of the group.
- **D-03:** The form state still stores a single `fixedOverheads` value (the sum of all categories). The calculator engine interface does not change.
- **D-04:** Field explanations are always-visible inline text -- no tooltips, accordions, or popovers. Tradespeople should not have to click to understand a field.
- **D-05:** Explanation text appears as a muted paragraph between the label and the input field.
- **D-06:** Asterisk disclaimers (tax buffers, efficiency cap, slippage) appear below the relevant input in a visually distinct style (smaller text, asterisk prefix).
- **D-07:** Each financial field shows a "Typical range" as part of the explanation text (e.g., "Most tradespeople pay 1,500 - 3,000/month in fixed costs").
- **D-08:** No default pre-filled values -- placeholder text shows a realistic example value instead.
- **D-09:** Use "protect" framing for guardrails, not "limit" framing (e.g., "This protects your margin" not "This limits your input").
- **D-10:** Generic examples with trade-relevant framing. Use "e.g. 4,000" style, not per-trade breakdowns.
- **D-11:** Frame in trade language ("your take-home after the business is paid", not "net personal draw"). One example per field.
- **D-12:** All form fields use NumberInput/SelectInput components from Phase 3 (src/components/ui/)
- **D-13:** Zod schemas enforce business rules at schema level -- copy should explain WHY the limits exist (Phase 1 D-06)
- **D-14:** Zero-staff fields greyed out but visible -- explanation text should still be readable when disabled (Phase 3 D-04)

### Claude's Discretion
- Exact wording of all explanations and disclaimers (tone should be direct, no jargon, conversational)
- Visual styling of explanation text and disclaimer text (colors, font size, spacing)
- Whether to add a FormField wrapper that standardizes label + explanation + input + disclaimer layout
- How to handle the running total display for Fixed Costs categories

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FORM-10 | Every input field displays a plain-English note explaining what it means and why it matters | Extend NumberInput/SelectInput with `explanation` prop; write copy for all 10+ fields across 4 steps |
| FORM-11 | Every input field displays contextual asterisk notes where applicable (tax disclaimers, buffer explanations) | Add `disclaimer` prop to components; reference BUSINESS_RULES constants for accurate buffer values |
</phase_requirements>

## Standard Stack

### Core (already installed -- no new packages)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-hook-form | 7.x | Form state, useWatch for running total | Already in use; useWatch enables reactive category sum |
| zod (v4) | 4.x | Schema validation for new category fields | Already in use; extend Step2Schema with category fields |
| Tailwind CSS | 4.x | Styling explanation/disclaimer text | Already in use; utility classes for muted text styles |

### Supporting
No new libraries needed. This phase is entirely UI copy and component extension.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Inline explanation text | Tooltip/popover | D-04 explicitly forbids hidden-by-default guidance |
| Props on NumberInput | Separate copy data file | Separate file adds indirection; props keep copy co-located with field |

## Architecture Patterns

### Recommended Component Extension

The key architectural decision is how to add explanation and disclaimer text to existing components. Two viable approaches:

**Approach A: Extend existing components with new props** (RECOMMENDED)

Add `explanation?: string` and `disclaimer?: string` props to `NumberInput` and `SelectInput`. This is the simplest change with the least disruption.

**Approach B: Create a wrapper component**

Create a `FieldWithGuidance` wrapper that standardizes the label + explanation + input + disclaimer layout. This adds a layer of abstraction but standardizes the pattern.

Recommendation: Use Approach A. The components already render their own labels and errors. Adding two more text slots is cleaner than wrapping everything. The existing `FormField` component is barely used (step components use `NumberInput`/`SelectInput` directly, which render their own labels).

### Copy Data Structure

Store field copy as a constants object rather than inline strings. This keeps step components readable and makes copy easy to review/update in one place.

```typescript
// src/lib/form/field-copy.ts
export const FIELD_COPY = {
  entityType: {
    explanation: "How your business is registered...",
    disclaimer: null,
  },
  grossPersonalDraw: {
    explanation: "What you want to take home each month...",
    disclaimer: "* This is before personal income tax...",
  },
  // ...
} as const;
```

### Fixed Costs Breakdown Pattern

The itemized fixed costs is the most complex structural change. The pattern:

1. Add individual category fields to form state (e.g., `fixedCostVehicle`, `fixedCostPremises`, etc.)
2. Use `useWatch` to observe all category fields and compute the sum
3. Store the sum back into `fixedOverheads` via `setValue` (same pattern as StepStaff zeroing fields)
4. The transform layer continues reading `fixedOverheads` -- no change to CalculatorInput

```typescript
// In StepFinancials
const categories = useWatch({
  name: [
    "fixedCostVehicle", "fixedCostPremises", "fixedCostEquipment",
    "fixedCostInsurance", "fixedCostTechnology", "fixedCostLoans",
    "fixedCostProfessional", "fixedCostOther"
  ]
});
const total = categories.reduce((sum, val) => sum + (val || 0), 0);

useEffect(() => {
  setValue("fixedOverheads", total);
}, [total, setValue]);
```

### Project Structure (files changed/added)
```
src/
  components/
    ui/
      NumberInput.tsx          # Add explanation + disclaimer props
      SelectInput.tsx          # Add explanation + disclaimer props
    wizard/
      steps/
        StepBusinessIdentity.tsx  # Add copy to 3 fields
        StepFinancials.tsx        # Major rewrite: itemized fixed costs
        StepJobPricing.tsx        # Add copy to 2 fields
        StepStaff.tsx             # Add copy to 3 fields
  lib/
    form/
      field-copy.ts            # NEW: centralized copy constants
      step-schemas.ts          # Extend Step2Schema with category fields
      form-defaults.ts         # Add defaults for category fields
      transform.ts             # No change needed (reads fixedOverheads)
```

### Anti-Patterns to Avoid
- **Putting copy inline in JSX:** Makes step components unreadable and copy hard to review. Use a centralized copy file.
- **Changing CalculatorInput interface:** D-03 explicitly locks this. The sum goes into `fixedOverheads`.
- **Using tooltips or click-to-reveal:** D-04 explicitly forbids this. All guidance is always visible.
- **Pre-filling default values:** D-08 says use placeholder text, not default values. Keep defaults at 0.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Reactive sum of category fields | Manual DOM manipulation or state sync | `useWatch` + `useEffect` + `setValue` from react-hook-form | react-hook-form already handles this pattern (see StepStaff.tsx for precedent) |
| Field-level validation for categories | Custom validation logic | Zod schema with `.nonnegative()` on each category | Consistent with existing validation pattern |

## Common Pitfalls

### Pitfall 1: Running Total Desync
**What goes wrong:** The `fixedOverheads` computed value gets out of sync with the category fields, especially when users clear a field (NaN) or navigate away and back.
**Why it happens:** `useWatch` returns `undefined` or `NaN` for empty number inputs. The `reduce` sum becomes NaN.
**How to avoid:** Coerce each category value: `(val || 0)` before summing. Ensure `fixedOverheads` is updated in a `useEffect` that depends on the computed total, not on individual field changes.
**Warning signs:** NaN appearing in the running total display.

### Pitfall 2: Schema Validation on Hidden Computed Field
**What goes wrong:** Zod validation fails on `fixedOverheads` because it is now a computed field, not user-entered, and may be 0 when categories are empty.
**Why it happens:** The existing schema has `.nonnegative()` on `fixedOverheads`. If it becomes computed, the validation timing matters.
**How to avoid:** Keep `fixedOverheads` in the schema as `z.number().nonnegative()` (it is always a valid number since it is the sum of nonnegative category values). The category fields each have their own `.nonnegative()` constraint.
**Warning signs:** "Fixed costs cannot be negative" error showing when user has not entered anything.

### Pitfall 3: Explanation Text on Disabled Fields
**What goes wrong:** Disabled staff fields (when staffCount = 0) show explanation text that looks clickable or active when the input is greyed out.
**Why it happens:** The explanation text does not inherit the disabled styling.
**How to avoid:** Pass the `disabled` prop through to the explanation/disclaimer text rendering and apply `opacity-50` to match the input styling (per D-14: "explanation text should still be readable when disabled").
**Warning signs:** Visual inconsistency between greyed-out input and full-opacity explanation text.

### Pitfall 4: Placeholder vs Default Value Confusion
**What goes wrong:** Developer sets `defaultValues` in form-defaults.ts to example values instead of 0, thinking this implements "typical range" guidance.
**Why it happens:** D-07 says show typical ranges and D-08 says no pre-filled defaults -- these feel contradictory but are not.
**How to avoid:** Typical ranges go in the explanation text. Placeholder attributes show example values (e.g., `placeholder="e.g. 2000"`). Default values stay at 0 in form-defaults.ts.
**Warning signs:** Form submitting with example values the user never consciously entered.

### Pitfall 5: "Protect" vs "Limit" Framing Drift
**What goes wrong:** Copy for validation errors or disclaimers uses negative framing ("you cannot", "maximum", "restricted") instead of protective framing.
**Why it happens:** Developer defaults to technical constraint language.
**How to avoid:** Review all copy for D-09 compliance. Every limit should be framed as protection: "This protects your margin" not "Direct costs cannot exceed 80%". The existing error in step-schemas.ts already uses correct framing: "this protects your margin".
**Warning signs:** Any copy containing "cannot", "maximum", "limited to", "restricted".

## Code Examples

### Extended NumberInput with explanation and disclaimer

```typescript
// Source: Extension of existing src/components/ui/NumberInput.tsx
interface NumberInputProps {
  name: string;
  label: string;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: string;
  explanation?: string;  // NEW
  disclaimer?: string;   // NEW
}

export function NumberInput({
  name, label, prefix, suffix, placeholder,
  disabled = false, min, max, step,
  explanation, disclaimer,
}: NumberInputProps) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-semibold text-foreground">
        {label}
      </label>
      {explanation && (
        <p className={`text-sm text-gray-500 ${disabled ? "opacity-50" : ""}`}>
          {explanation}
        </p>
      )}
      <div className="relative">
        {/* ... existing input rendering ... */}
      </div>
      {error && (
        <p id={`${name}-error`} className="text-sm text-red-600" role="alert">
          {typeof error.message === "string" ? error.message : ""}
        </p>
      )}
      {disclaimer && (
        <p className={`text-xs text-gray-400 ${disabled ? "opacity-50" : ""}`}>
          {disclaimer}
        </p>
      )}
    </div>
  );
}
```

### Fixed Costs Category Schema Extension

```typescript
// Source: Extension of existing src/lib/form/step-schemas.ts
export const Step2Schema = z.object({
  grossPersonalDraw: z.number().positive("Enter your monthly take-home target"),
  fixedCostVehicle: z.number().nonnegative("Cannot be negative"),
  fixedCostPremises: z.number().nonnegative("Cannot be negative"),
  fixedCostEquipment: z.number().nonnegative("Cannot be negative"),
  fixedCostInsurance: z.number().nonnegative("Cannot be negative"),
  fixedCostTechnology: z.number().nonnegative("Cannot be negative"),
  fixedCostLoans: z.number().nonnegative("Cannot be negative"),
  fixedCostProfessional: z.number().nonnegative("Cannot be negative"),
  fixedCostOther: z.number().nonnegative("Cannot be negative"),
  fixedOverheads: z.number().nonnegative("Fixed costs cannot be negative"),
});
```

### Running Total Pattern

```typescript
// Source: Pattern from existing StepStaff.tsx useWatch usage
const FIXED_COST_FIELDS = [
  "fixedCostVehicle", "fixedCostPremises", "fixedCostEquipment",
  "fixedCostInsurance", "fixedCostTechnology", "fixedCostLoans",
  "fixedCostProfessional", "fixedCostOther",
] as const;

// In StepFinancials component:
const { setValue } = useFormContext();
const currency = useWatch({ name: "currency" });
const categories = useWatch({ name: [...FIXED_COST_FIELDS] });
const currencySymbol = currency === "EUR" ? "\u20ac" : "\u00a3";

const total = categories.reduce((sum: number, val: number) => sum + (val || 0), 0);

useEffect(() => {
  setValue("fixedOverheads", total);
}, [total, setValue]);

// Running total display at bottom:
// <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
//   <span>Total Monthly Fixed Costs</span>
//   <span>{currencySymbol}{total.toLocaleString()}</span>
// </div>
```

### Copy Constants Structure

```typescript
// src/lib/form/field-copy.ts
export const FIELD_COPY = {
  entityType: {
    explanation: "How your business is set up with HMRC or Revenue. This affects how we calculate tax buffers.",
    disclaimer: null,
  },
  currency: {
    explanation: "Which currency you trade in. All figures will use this currency.",
    disclaimer: null,
  },
  vatRate: {
    explanation: "The VAT rate you charge on your invoices. If you are not VAT registered, select 0%.",
    disclaimer: null,
  },
  grossPersonalDraw: {
    explanation: "What you want to take home each month, before your personal income tax. This is your take-home after the business is paid. Most tradespeople target between 3,000 and 6,000 per month.",
    disclaimer: "* For Ltd companies, we add a 20% Corp Tax buffer to protect this amount. Your business needs to earn more than your personal draw.",
  },
  // ... etc
} as const;
```

## State of the Art

No relevant technology changes for this phase. This is a content/UI phase using established patterns.

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tooltips for field help | Always-visible inline text | UX research consensus ~2020+ | Better for low-tech-confidence users (tradespeople) |
| Single "fixed costs" field | Itemized category breakdown | This phase (user feedback) | More accurate data, better user understanding |

## Open Questions

1. **fixedOverheads as hidden field vs computed on submit**
   - What we know: D-03 says form state stores a single `fixedOverheads` value. The `useEffect` + `setValue` pattern keeps it synced reactively.
   - What is unclear: Whether `fixedOverheads` should be a visible hidden input or purely a computed value set before validation.
   - Recommendation: Use `setValue` in a `useEffect` (matching StepStaff.tsx precedent). The field exists in state but has no visible input. Zod validates it normally.

2. **SelectInput explanation text placement**
   - What we know: D-05 says explanation goes between label and input. SelectInput currently renders label then select.
   - What is unclear: Whether explanation text above a dropdown looks natural or cluttered.
   - Recommendation: Same pattern as NumberInput -- explanation between label and select element. Keep it short for selects (one sentence max).

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.x |
| Config file | vitest.config.ts |
| Quick run command | `pnpm test` |
| Full suite command | `pnpm test` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FORM-10 | Every input field has explanation text | unit | `pnpm test src/lib/form/field-copy.test.ts -x` | No -- Wave 0 |
| FORM-11 | Fields with tax/buffer implications have disclaimers | unit | `pnpm test src/lib/form/field-copy.test.ts -x` | No -- Wave 0 |
| FORM-10/11 | Fixed costs categories sum to fixedOverheads | unit | `pnpm test src/lib/form/transform.test.ts -x` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm test`
- **Per wave merge:** `pnpm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/lib/form/field-copy.test.ts` -- verify every form field has explanation text, verify fields needing disclaimers have them
- [ ] `src/lib/form/step-schemas.test.ts` -- verify Step2Schema validates category fields correctly, sum logic
- [ ] Vitest environment may need `jsdom` for component tests (currently `node`) -- but pure data tests work with `node`

## Sources

### Primary (HIGH confidence)
- Project codebase -- direct reading of all referenced files (FormField.tsx, NumberInput.tsx, SelectInput.tsx, all Step*.tsx, step-schemas.ts, form-defaults.ts, transform.ts, constants.ts, types.ts)
- CONTEXT.md -- 14 locked decisions from user discussion
- REQUIREMENTS.md -- FORM-10, FORM-11 definitions

### Secondary (MEDIUM confidence)
- react-hook-form useWatch/setValue patterns -- verified against existing StepStaff.tsx implementation in codebase

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new libraries, everything already installed
- Architecture: HIGH -- extending existing components with simple props, following established patterns (useWatch/setValue from StepStaff)
- Pitfalls: HIGH -- pitfalls derived from direct code reading and understanding of react-hook-form behavior with number inputs
- Copy content: MEDIUM -- exact wording is Claude's discretion per CONTEXT.md; tone guidance is clear but specific text needs iteration

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (stable -- no moving parts)
