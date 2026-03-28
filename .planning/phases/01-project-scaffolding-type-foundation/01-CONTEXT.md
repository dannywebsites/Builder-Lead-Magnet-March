# Phase 1: Project Scaffolding & Type Foundation - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Standing Next.js 15 project with all TypeScript interfaces, Zod validation schemas, currency formatting utilities (GBP + EUR), and rounding utilities that every subsequent phase consumes. No UI beyond confirming the app builds and runs.

</domain>

<decisions>
## Implementation Decisions

### Currency & Locale
- **D-01:** Currency is a standalone selector in the form — user explicitly picks GBP or EUR. Not auto-detected from browser locale.
- **D-02:** Currency and VAT rate are independent selections. Picking an Irish VAT rate does NOT auto-switch currency. User controls both independently.
- **D-03:** Numbers display without decimals for large values (revenue, billings, overheads) — e.g., £10,250 not £10,250.00. Comma thousands separator, dot for decimals when shown.
- **D-04:** Hourly Floor Rate shows exact value with 2 decimal places (e.g., £47.23/hr) — no rounding up. This is the one exception to the "no decimals" rule since precision matters for quoting.
- **D-05:** Currency formatting utility must support both £ and € symbols with correct locale positioning.

### Type Strictness
- **D-06:** Claude's Discretion — Zod schemas should enforce business rules at the schema level where possible (Direct_Cost_Pct max 0.80, Staff_Count min 0, efficiency cap 0.75). This makes invalid states unrepresentable rather than relying on form validation alone.

### Project Structure
- **D-07:** Claude's Discretion — Feature-based folder structure recommended. Calculation engine lives in its own module (`lib/calculator/`) with zero UI imports so it can be unit tested in isolation.

### Deployment Target
- **D-08:** Claude's Discretion — Vercel is the recommended target (zero-config for Next.js, free hobby tier, serverless functions for email in Phase 9). Research may refine this.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements fully captured in decisions above and in:
- `.planning/PROJECT.md` — Project context, core value, constraints
- `.planning/REQUIREMENTS.md` — FORM-01, FORM-09, CALC-07 (this phase's requirements)
- `.planning/research/STACK.md` — Recommended stack: Next.js 15, React 19, TypeScript, Tailwind 4, Biome
- `.planning/research/SUMMARY.md` — Key synthesis: build calc engine standalone first, currency rounding critical

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project, no existing code.

### Established Patterns
- None — this phase establishes the patterns all subsequent phases follow.

### Integration Points
- Zod schemas will be consumed by react-hook-form in Phase 3
- Currency formatting utility will be used by Phase 5 (results display) and Phase 7 (PDF report)
- TypeScript interfaces define the contract between form (Phase 3), calc engine (Phase 2), and output (Phase 5)

</code_context>

<specifics>
## Specific Ideas

- The complete mathematical model is fully specified in the user's system prompt document — all formulas, variables, and constants are locked. Types must exactly mirror these variable names and relationships.
- Currency selector is part of the input form, not a global setting. Each calculator run has its own currency context.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-project-scaffolding-type-foundation*
*Context gathered: 2026-03-28*
