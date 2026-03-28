# Phase 3: Multi-Step Input Form - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Working multi-step wizard form that collects all required inputs with step-by-step Zod validation and a progress indicator — wired to the calculation engine but not yet displaying results. This phase builds the form UI and validation; results display is Phase 5.

</domain>

<decisions>
## Implementation Decisions

### Step Grouping (4 steps)
- **D-01:** 4-step wizard layout:
  - Step 1: Entity Type + Currency + VAT Rate (business identity)
  - Step 2: Gross Personal Draw + Fixed Overheads (your money)
  - Step 3: Staff Count + Staff Hourly Rate + Staff Hours Per Week (your team)
  - Step 4: Average Job Value + Direct Cost % (job pricing)
- **D-02:** All 3 identity fields (Entity Type, Currency, VAT Rate) are separate dropdown/select inputs — no auto-coupling between them (carries forward Phase 1 D-01, D-02).

### Direct Cost Input
- **D-03:** Claude's Discretion — Choose between percentage slider+number or number-only input for Direct Cost %. Prioritize whichever best enforces the 80% cap and feels natural in the form flow.

### Zero-Staff Behavior
- **D-04:** When staffCount = 0, staff rate and hours fields remain visible but greyed out/disabled with 0 values. User can see what they'd fill in if they had staff.

### Carried from Prior Phases
- **D-05:** Currency is a standalone selector — user explicitly picks GBP or EUR (Phase 1 D-01)
- **D-06:** Zod schemas enforce business rules at schema level — form validation uses the same schemas (Phase 1 D-06)
- **D-07:** `calculate()` returns full CalculatorOutput with intermediates — form wires directly to this after final step (Phase 2 D-01)

### Claude's Discretion
- Form layout and visual style (card-based steps, animations, transitions)
- Validation UX (inline per-field, on-blur vs on-next, error message placement)
- Navigation behavior (back/forward, sequential vs jumpable steps)
- Progress indicator design (stepper, progress bar, step dots)
- URL state management (nuqs or internal state)
- Keyboard navigation and accessibility

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Types & Schemas (Source of Truth)
- `src/lib/calculator/types.ts` — CalculatorInput interface (defines all 10 form fields), CalculatorOutput, EntityType, Currency, VatRateValue, VAT_RATE_OPTIONS
- `src/lib/calculator/schemas.ts` — Zod validation schemas with business rule enforcement (directCostPct max 0.8, staffCount nonnegative integer, grossPersonalDraw positive)
- `src/lib/calculator/index.ts` — Barrel export for all calculator types, schemas, and engine

### Engine
- `src/lib/calculator/engine.ts` — calculate() function that form submits to

### Stack Decisions
- `.planning/research/STACK.md` — react-hook-form 7.x + @hookform/resolvers for form state, nuqs 2.x for URL state, Tailwind 4 for styling
- `.planning/PROJECT.md` — Project constraints (no login, fast-loading, UK/IE markets)

### Requirements
- `.planning/REQUIREMENTS.md` — FORM-02 through FORM-08 (input fields), FORM-12 (validation), FORM-13 (wizard layout)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/calculator/index.ts` — Full barrel export of types, schemas, constants, engine
- `src/lib/calculator/types.ts` — VAT_RATE_OPTIONS array ready for dropdown rendering
- `src/lib/calculator/schemas.ts` — CalculatorInputSchema with all validation rules pre-built
- No existing UI components — this phase creates the first ones

### Established Patterns
- Feature-based folder structure (`src/lib/calculator/`)
- Zod for validation (schemas already defined)
- TypeScript strict mode
- Biome for linting/formatting
- Vitest for testing

### Integration Points
- `src/app/page.tsx` — Currently a placeholder, will host the wizard
- `src/app/layout.tsx` — Root layout with Tailwind globals
- Calculator module imports from `@/lib/calculator`

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches for wizard UX. The key constraint is that tradespeople (non-technical users) need to understand every field without confusion.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-multi-step-input-form*
*Context gathered: 2026-03-28*
