# Phase 1: Project Scaffolding & Type Foundation - Research

**Researched:** 2026-03-28
**Domain:** Next.js 15 project scaffolding, TypeScript type definitions, Zod validation schemas, currency formatting
**Confidence:** HIGH

## Summary

Phase 1 is a greenfield scaffolding phase with well-established tooling. The core task is standing up a Next.js 15 project with TypeScript, Tailwind CSS 4, and Biome, then defining the TypeScript interfaces, Zod validation schemas, and currency/rounding utilities that every subsequent phase consumes. All recommended technologies are current, stable, and well-documented.

The key technical decisions are: (1) use Zod 4 via `zod/v4` import path for 14x faster parsing and smaller bundles, (2) use `Intl.NumberFormat` for currency formatting rather than hand-rolling locale-aware formatting, and (3) enforce business rules at the schema level (Direct_Cost_Pct max 0.80, efficiency cap 0.75) so invalid states are unrepresentable. The `create-next-app` CLI now supports Biome as a linter choice directly, simplifying scaffolding.

**Primary recommendation:** Use `pnpm create next-app` with Biome linter selection, Tailwind CSS 4 via `@tailwindcss/postcss`, Zod 4 (`zod/v4`) for schemas, and `Intl.NumberFormat` for currency formatting. Keep the calculator engine module (`lib/calculator/`) isolated with zero UI imports from day one.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Currency is a standalone selector in the form -- user explicitly picks GBP or EUR. Not auto-detected from browser locale.
- **D-02:** Currency and VAT rate are independent selections. Picking an Irish VAT rate does NOT auto-switch currency.
- **D-03:** Numbers display without decimals for large values (revenue, billings, overheads) -- e.g., 10,250 not 10,250.00. Comma thousands separator, dot for decimals when shown.
- **D-04:** Hourly Floor Rate shows exact value with 2 decimal places (e.g., 47.23/hr) -- no rounding up. This is the one exception to the "no decimals" rule since precision matters for quoting.
- **D-05:** Currency formatting utility must support both pound and euro symbols with correct locale positioning.

### Claude's Discretion
- **D-06:** Zod schemas should enforce business rules at the schema level where possible (Direct_Cost_Pct max 0.80, Staff_Count min 0, efficiency cap 0.75).
- **D-07:** Feature-based folder structure recommended. Calculation engine lives in its own module (`lib/calculator/`) with zero UI imports.
- **D-08:** Vercel is the recommended deployment target.

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FORM-01 | User can select Business Entity type (Limited Company / Sole Trader) | Zod enum schema for entity type; TypeScript union type `"limited_company" \| "sole_trader"` |
| FORM-09 | User can select VAT Rate (20% UK / 13.5% IE / 23% IE / 0% Exempt) | Zod enum schema with literal VAT rate values; TypeScript const tuple for allowed rates |
| CALC-07 | Floating point precision handled correctly (currency rounding to 2 decimal places) | `Intl.NumberFormat` handles rounding internally; utility functions for consistent formatting across the app |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Tech stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, Biome
- **Package manager:** pnpm (per STACK.md recommendation)
- **No ESLint/Prettier:** Biome replaces both
- **Deployment:** Vercel (static export with one API route for email in later phase)
- **GSD Workflow:** All changes must go through GSD commands
- **No login/auth:** Calculator works without authentication
- **Markets:** UK and Ireland only. GBP and EUR only.

## Standard Stack

### Core

| Library | Version (verified) | Purpose | Why Standard |
|---------|-------------------|---------|--------------|
| Next.js | 16.2.1 (latest on npm) | Framework | App Router, static export, Turbopack dev. `create-next-app` scaffolds entire project. |
| React | 19.2.4 | UI rendering | Ships with Next.js. Required by Next.js 15+. |
| TypeScript | 6.0.2 (latest) | Type safety | Financial calculations demand compile-time checking. Non-negotiable. |
| Tailwind CSS | 4.2.2 (latest) | Styling | Zero runtime, CSS-native config in v4, auto content detection. |
| Zod | 4.3.6 (latest, use `zod/v4` import) | Schema validation | 14x faster parsing than v3, 57% smaller bundle. Shared schemas between form and calc. |

### Supporting

| Library | Version (verified) | Purpose | When to Use |
|---------|-------------------|---------|-------------|
| @tailwindcss/postcss | 4.2.2 | PostCSS plugin for Tailwind v4 | Required for Tailwind v4 with Next.js |
| @biomejs/biome | 2.4.9 | Linting + formatting | Single tool replacing ESLint + Prettier. Near-instant. |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Zod 4 (`zod/v4`) | Zod 3 (`zod`) | v3 is more battle-tested with `@hookform/resolvers`, but v4 is 14x faster and stable. Use v4 since we are greenfield. |
| `Intl.NumberFormat` | Custom formatting function | Intl is built-in, handles locale edge cases, does its own rounding. Never hand-roll currency formatting. |
| Biome | ESLint + Prettier | ESLint + Prettier is two tools, slower, more config. Biome is single binary, 100x faster. `create-next-app` now supports Biome directly. |

**Installation (after scaffolding):**
```bash
pnpm add zod
```

Note: Next.js, React, TypeScript, Tailwind CSS, and Biome are all installed by `create-next-app`. Only Zod needs manual addition.

## Architecture Patterns

### Recommended Project Structure
```
src/
  app/                  # Next.js App Router pages
    layout.tsx          # Root layout
    page.tsx            # Home page (placeholder for now)
    globals.css         # Tailwind CSS import
  lib/
    calculator/         # Calculation engine module (zero UI imports)
      types.ts          # TypeScript interfaces and type definitions
      schemas.ts        # Zod validation schemas
      currency.ts       # Currency formatting utilities
      constants.ts      # Business rule constants (VAT rates, caps, etc.)
      index.ts          # Public API barrel export
```

### Pattern 1: Zod Schema with Business Rule Enforcement

**What:** Define Zod schemas that encode business constraints directly, making invalid states unrepresentable.
**When to use:** For all calculator input validation -- enforced at schema level, not just form level.
**Example:**
```typescript
// src/lib/calculator/schemas.ts
import * as z from "zod/v4";

export const EntityType = z.enum(["limited_company", "sole_trader"]);

export const VatRate = z.enum(["0", "0.135", "0.20", "0.23"]);

export const CalculatorInputSchema = z.object({
  entityType: EntityType,
  grossPersonalDraw: z.number().positive(),
  fixedOverheads: z.number().nonnegative(),
  staffCount: z.number().int().nonnegative(),
  staffHourlyRate: z.number().nonnegative(),
  staffHoursPerWeek: z.number().nonnegative().max(168),
  avgJobValue: z.number().positive(),
  directCostPct: z.number().min(0).max(0.80),
  vatRate: VatRate,
  currency: z.enum(["GBP", "EUR"]),
});

export type CalculatorInput = z.infer<typeof CalculatorInputSchema>;
```

### Pattern 2: Currency Formatting with Intl.NumberFormat

**What:** Use the built-in `Intl.NumberFormat` API for locale-aware currency formatting with configurable decimal places.
**When to use:** Every place a monetary value is displayed.
**Example:**
```typescript
// src/lib/calculator/currency.ts
type Currency = "GBP" | "EUR";

const LOCALE_MAP: Record<Currency, string> = {
  GBP: "en-GB",
  EUR: "en-IE",
};

/**
 * Format a monetary value for display.
 * Large values (revenue, billings, overheads): no decimals.
 * Precision values (hourly rate): 2 decimal places.
 */
export function formatCurrency(
  amount: number,
  currency: Currency,
  options?: { decimals?: number }
): string {
  const decimals = options?.decimals ?? 0;
  return new Intl.NumberFormat(LOCALE_MAP[currency], {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

// Usage:
// formatCurrency(10250, "GBP")           => "£10,250"
// formatCurrency(47.23, "GBP", { decimals: 2 }) => "£47.23"
// formatCurrency(10250, "EUR")           => "€10,250"
// formatCurrency(47.23, "EUR", { decimals: 2 }) => "€47.23"
```

### Pattern 3: Type-Safe Constants for Business Rules

**What:** Define business rule constants as `as const` tuples with derived types, so they serve as both runtime values and compile-time types.
**When to use:** VAT rates, efficiency cap, slippage factor, employer burden.
**Example:**
```typescript
// src/lib/calculator/constants.ts
export const VAT_RATES = {
  UK_STANDARD: 0.20,
  IE_REDUCED: 0.135,
  IE_STANDARD: 0.23,
  EXEMPT: 0,
} as const;

export const BUSINESS_RULES = {
  EFFICIENCY_CAP: 0.75,          // Hard-capped billable hours ratio
  SLIPPAGE_FACTOR: 1.15,         // 15% material slippage
  EMPLOYER_BURDEN: 1.30,         // 30% employer burden markup
  CORP_TAX_BUFFER: 0.80,         // Ltd company: divide by 0.80 for 20% buffer
  MAX_DIRECT_COST_PCT: 0.80,     // Hard cap on direct cost percentage
  WEEKS_PER_MONTH: 4.33,         // Standard weeks-per-month conversion
  WIN_RATE: 0.30,                // Quote-to-job conversion rate
  LEAD_CONVERSION_RATE: 0.30,    // Lead-to-quote conversion rate
} as const;
```

### Anti-Patterns to Avoid

- **Putting calculation logic in components:** The `lib/calculator/` module must have zero imports from `react`, `next`, or any UI library. This enables isolated unit testing and prevents coupling.
- **Hand-rolling currency formatting:** Do not build `"£" + number.toFixed(2)`. This breaks for EUR positioning in non-English locales and misses thousands separators. Use `Intl.NumberFormat` exclusively.
- **Using floating-point equality checks:** Never compare currency values with `===`. The formatting utility handles rounding for display. If intermediate comparison is needed, round explicitly with `Math.round(value * 100) / 100`.
- **Using `tailwind.config.js` with Tailwind v4:** Tailwind v4 uses CSS-native configuration via `@theme` directive in globals.css. The old JS config file is not needed and will cause confusion.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Currency formatting | String concatenation with symbols | `Intl.NumberFormat` | Handles locale positioning, thousands separators, decimal rounding. Tested across all browsers. |
| Input validation | Custom if/else chains | Zod schemas | Type inference, composable, reusable between form and calculation layers |
| Linting + formatting | ESLint + Prettier config | Biome | Single config file, 100x faster, fewer conflicts |
| CSS framework config | tailwind.config.js | CSS @theme directive | Tailwind v4 pattern -- JS config is legacy |

## Common Pitfalls

### Pitfall 1: Tailwind v4 Configuration Mismatch
**What goes wrong:** Developers create a `tailwind.config.js` file (v3 pattern) or use `@tailwind base; @tailwind components; @tailwind utilities;` directives.
**Why it happens:** Most tutorials and AI training data reference Tailwind v3. Tailwind v4 changed fundamentally.
**How to avoid:** Use `@import "tailwindcss";` in globals.css. Use `@tailwindcss/postcss` in postcss.config.mjs. No JS config file needed.
**Warning signs:** "Unknown at rule @tailwind" warnings, styles not applying.

### Pitfall 2: Zod v4 Import Path
**What goes wrong:** Importing `from "zod"` gets Zod v3 API. Zod 4 is published at `zod/v4` subpath.
**Why it happens:** The npm package `zod@4.x` exports v4 at a subpath for backwards compatibility.
**How to avoid:** Always import `import * as z from "zod/v4"`. Verify with `z.version` if unsure.
**Warning signs:** Missing v4 features, unexpected API differences.

### Pitfall 3: Floating Point Display Without Rounding
**What goes wrong:** Raw division results displayed directly: `£47.234567891/hr`.
**Why it happens:** JavaScript floating point arithmetic produces long decimals.
**How to avoid:** All monetary display goes through the `formatCurrency()` utility. Never display `number.toString()` for money.
**Warning signs:** Long decimal numbers in UI, inconsistent decimal places.

### Pitfall 4: create-next-app ESLint Leftover Config
**What goes wrong:** After selecting Biome as linter, leftover `.eslintrc` or `next.config` ESLint settings cause conflicts.
**Why it happens:** Some create-next-app versions may still generate partial ESLint config.
**How to avoid:** After scaffolding, verify no `.eslintrc*` files exist. Remove `eslint` and `eslint-config-next` from package.json if present.
**Warning signs:** Duplicate lint errors, conflicting formatting rules.

### Pitfall 5: VAT Rate as String vs Number
**What goes wrong:** VAT rate stored as string from form select but used as number in calculations.
**Why it happens:** HTML `<select>` elements return string values.
**How to avoid:** Define VAT rate schema that coerces or transforms to number. Or use a mapping object from enum string to numeric value. Decide on one canonical representation.
**Warning signs:** `NaN` in calculations, string concatenation instead of addition.

## Code Examples

### Scaffolding Command
```bash
pnpm create next-app@latest trade-survival-calculator \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-pnpm
```
Note: The CLI will prompt for linter choice -- select **Biome**.

### postcss.config.mjs (Tailwind v4)
```javascript
// This should be auto-generated by create-next-app with Tailwind v4
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

### globals.css (Tailwind v4)
```css
@import "tailwindcss";
```

### biome.json
```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.9/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "tab",
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "semicolons": "always"
    }
  }
}
```
Note: `create-next-app` with Biome selection will generate a starter `biome.json`. The above is a reference -- adjust formatting preferences as needed.

### Complete Type Definitions
```typescript
// src/lib/calculator/types.ts

/** Business entity type */
export type EntityType = "limited_company" | "sole_trader";

/** Supported currencies */
export type Currency = "GBP" | "EUR";

/** VAT rate options as decimal values */
export type VatRateValue = 0 | 0.135 | 0.20 | 0.23;

/** VAT rate display labels */
export const VAT_RATE_OPTIONS: ReadonlyArray<{
  label: string;
  value: VatRateValue;
}> = [
  { label: "20% (UK Standard)", value: 0.20 },
  { label: "13.5% (Ireland Reduced)", value: 0.135 },
  { label: "23% (Ireland Standard)", value: 0.23 },
  { label: "0% (VAT Exempt)", value: 0 },
] as const;

/** Raw calculator inputs from the form */
export interface CalculatorInput {
  entityType: EntityType;
  grossPersonalDraw: number;    // Monthly target before personal income tax
  fixedOverheads: number;       // Monthly business bills
  staffCount: number;           // On-site billable employees only
  staffHourlyRate: number;      // Average gross wage per contract
  staffHoursPerWeek: number;    // Contracted weekly hours
  avgJobValue: number;          // Net/excluding VAT
  directCostPct: number;        // Materials, fuel, disposal (0-0.80)
  vatRate: VatRateValue;
  currency: Currency;
}

/** Calculated output results */
export interface CalculatorOutput {
  // Core financial anchors
  monthlyRevenueTarget: number; // MRT (net)
  monthlyBillings: number;     // MRT * (1 + VAT_Rate)
  hourlyFloorRate: number;     // MRT / Total_Billable_Hours

  // Sales pipeline
  jobsToWin: number;           // MRT / Avg_Job_Value
  quotesNeeded: number;        // Jobs_to_Win / 0.30
  leadsNeeded: number;         // Quotes_Needed / 0.30

  // Intermediate values (for transparency in PDF report)
  targetBusinessProfit: number; // After tax buffer
  adjustedPayroll: number;     // Base payroll * 1.30
  totalBillableHours: number;  // Monthly hours * 0.75
  realDirectCost: number;      // Direct_Cost_Pct * 1.15
  adjustedOverheads: number;   // Fixed + Adjusted Payroll
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind v3 JS config | Tailwind v4 CSS-native config | Jan 2025 | No `tailwind.config.js` needed. Use `@import "tailwindcss"` and `@theme` directive. |
| ESLint + Prettier | Biome | 2024-2025 | Single tool, single config, 100x faster. `create-next-app` now offers Biome as option. |
| Zod v3 | Zod v4 (`zod/v4`) | Mid-2025 | 14x faster parsing, 57% smaller bundle. Import from `zod/v4` subpath. |
| `@tailwind` directives | `@import "tailwindcss"` | Tailwind v4 | Old directive syntax does not work in v4. |
| Next.js Pages Router | Next.js App Router | Next.js 13+ | App Router is the standard. All new projects use it. |

**Deprecated/outdated:**
- `tailwind.config.js` / `tailwind.config.ts`: Not needed in Tailwind v4. CSS-native config via `@theme`.
- `@tailwind base; @tailwind components; @tailwind utilities;`: Replaced by `@import "tailwindcss";` in v4.
- ESLint + Prettier combo: Biome is the recommended replacement per project stack decisions.
- `import { z } from "zod"` (default export): Zod v4 uses `import * as z from "zod/v4"`.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (recommended for Next.js + TypeScript projects) |
| Config file | None yet -- Wave 0 must create `vitest.config.ts` |
| Quick run command | `pnpm vitest run --reporter=verbose` |
| Full suite command | `pnpm vitest run` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FORM-01 | EntityType enum validates "limited_company" and "sole_trader", rejects invalid | unit | `pnpm vitest run src/lib/calculator/__tests__/schemas.test.ts -t "entity type"` | No -- Wave 0 |
| FORM-09 | VatRate enum validates 0, 0.135, 0.20, 0.23 and rejects invalid values | unit | `pnpm vitest run src/lib/calculator/__tests__/schemas.test.ts -t "vat rate"` | No -- Wave 0 |
| CALC-07 | Currency formatting rounds to 2dp for hourly rate, 0dp for large values | unit | `pnpm vitest run src/lib/calculator/__tests__/currency.test.ts` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm vitest run --reporter=verbose`
- **Per wave merge:** `pnpm vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `vitest` + `@vitejs/plugin-react` -- install as dev dependencies
- [ ] `vitest.config.ts` -- framework config with path aliases matching tsconfig
- [ ] `src/lib/calculator/__tests__/schemas.test.ts` -- covers FORM-01, FORM-09, schema validation
- [ ] `src/lib/calculator/__tests__/currency.test.ts` -- covers CALC-07, formatting edge cases

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Runtime | Yes | v24.11.0 | -- |
| pnpm | Package manager | Yes | 11.6.1 | npm (available) |
| git | Version control | Yes | 2.50.1 | -- |
| TypeScript | Type safety | Install via create-next-app | 6.0.2 (npm latest) | -- |

**Missing dependencies with no fallback:** None -- all required tools are available.

## Open Questions

1. **Biome indent style preference**
   - What we know: Biome defaults to tabs. The project has no established convention yet.
   - What's unclear: Whether the user prefers tabs or spaces.
   - Recommendation: Use Biome defaults (tabs) unless the user specifies otherwise. This is a cosmetic choice with no functional impact.

2. **Zod v4 + @hookform/resolvers compatibility for Phase 3**
   - What we know: `@hookform/resolvers` v5+ claims Zod v4 support. Some users report type issues.
   - What's unclear: Whether the exact latest versions work together without type workarounds.
   - Recommendation: This is a Phase 3 concern. Define schemas using Zod v4 now. If resolver issues arise in Phase 3, the `standardSchemaResolver` from `@hookform/resolvers` supports Zod v4 via the Standard Schema interface.

3. **VAT rate canonical representation: enum string vs number**
   - What we know: HTML selects return strings. Calculations need numbers.
   - What's unclear: Best pattern for the Zod schema -- enum of string labels that maps to numbers, or direct numeric literals.
   - Recommendation: Store as numeric values in the type system (`0 | 0.135 | 0.20 | 0.23`). The form layer (Phase 3) handles string-to-number conversion. The schema validates the numeric domain.

## Sources

### Primary (HIGH confidence)
- npm registry -- verified versions: next@16.2.1, zod@4.3.6, typescript@6.0.2, tailwindcss@4.2.2, @biomejs/biome@2.4.9
- Node.js `Intl.NumberFormat` -- tested locally for GBP (en-GB) and EUR (en-IE) formatting behavior
- [Tailwind CSS v4 Next.js Installation Guide](https://tailwindcss.com/docs/guides/nextjs) -- PostCSS configuration, @import syntax
- [Next.js Installation Docs](https://nextjs.org/docs/app/getting-started/installation) -- create-next-app flags, Biome support
- [Zod v4 Release Notes](https://zod.dev/v4) -- import path, performance improvements, API changes
- [Biome Configuration Guide](https://biomejs.dev/guides/configure-biome/) -- biome.json structure

### Secondary (MEDIUM confidence)
- [Zod v4 + @hookform/resolvers compatibility](https://github.com/react-hook-form/react-hook-form/issues/12829) -- type issues reported, workarounds available
- [Biome 2.0 Roadmap](https://biomejs.dev/blog/roadmap-2025/) -- Next.js domain support, auto-detection from package.json

### Tertiary (LOW confidence)
- Exact `create-next-app` interactive prompts for Biome selection -- may vary between versions. Verify during scaffolding.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all versions verified against npm registry, tools tested locally
- Architecture: HIGH -- folder structure follows project CONTEXT.md decisions and established Next.js patterns
- Pitfalls: HIGH -- Tailwind v4 config changes and Zod v4 import path are well-documented breaking changes
- Currency formatting: HIGH -- `Intl.NumberFormat` behavior verified with local Node.js tests for both GBP and EUR

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (stable technologies, 30-day validity)
