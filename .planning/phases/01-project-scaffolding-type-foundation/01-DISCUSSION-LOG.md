# Phase 1: Project Scaffolding & Type Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-28
**Phase:** 01-project-scaffolding-type-foundation
**Areas discussed:** Currency & locale

---

## Currency & Locale

### Default Currency

| Option | Description | Selected |
|--------|-------------|----------|
| GBP (Recommended) | Start in pounds — switch to EUR if they pick an Irish VAT rate | |
| Auto-detect | Use browser locale to guess GBP or EUR | |
| Let them pick | Currency selector as part of the form | ✓ |

**User's choice:** Let them pick
**Notes:** User wants an explicit currency selector in the form rather than auto-detection or defaults.

### Currency Switching

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-switch (Recommended) | VAT rate implies country — auto-set currency to match | |
| Independent | Let currency and VAT rate be separate choices | ✓ |
| You decide | Claude picks the best approach | |

**User's choice:** Independent
**Notes:** Currency and VAT rate are decoupled. User may be UK-based working in Ireland or vice versa.

### Number Format

| Option | Description | Selected |
|--------|-------------|----------|
| Standard UK/IE | £10,250.00 or €10,250.00 — comma thousands, dot decimals | |
| No decimals | £10,250 or €10,250 — round to nearest pound/euro for cleaner look | ✓ |
| You decide | Claude picks based on context | |

**User's choice:** No decimals
**Notes:** Cleaner presentation for large monetary values.

### Rounding

| Option | Description | Selected |
|--------|-------------|----------|
| Always round up | £47.23/hr becomes £48/hr — simpler, safer | |
| Show exact | £47.23/hr — precise, matches the math | ✓ |
| You decide | Claude picks the best approach for each output | |

**User's choice:** Show exact
**Notes:** Hourly Floor Rate shows exact 2 decimal places. All other values display without decimals.

---

## Claude's Discretion

- Type strictness: Enforce business rules at Zod schema level (max 80% direct cost, etc.)
- Project structure: Feature-based folders, calc engine in `lib/calculator/` with zero UI imports
- Deployment target: Vercel (zero-config Next.js, free tier, serverless for Phase 9 email)

User explicitly said "I trust you" for remaining areas — Claude made pragmatic choices aligned with research recommendations.

## Deferred Ideas

None — discussion stayed within phase scope.
