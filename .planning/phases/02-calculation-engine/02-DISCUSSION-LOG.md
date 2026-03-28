# Phase 2: Calculation Engine - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-28
**Phase:** 02-calculation-engine
**Areas discussed:** Intermediate values, Pipeline math defaults, Zero-staff edge case

---

## Intermediate Values

| Option | Description | Selected |
|--------|-------------|----------|
| Expose all intermediates | Return targetBusinessProfit, adjustedPayroll, totalBillableHours, realDirectCost in CalculatorOutput | ✓ |
| Final values only | Only return MRT, billings, hourly rate, pipeline numbers | |

**User's choice:** Expose all intermediates (Claude recommendation — simplest, no extra work)
**Notes:** User asked for fastest/simplest approach. Intermediates are already computed; just return them.

---

## Pipeline Math Defaults

| Option | Description | Selected |
|--------|-------------|----------|
| Hardcoded constants | 30%/30% in BUSINESS_RULES, no parameters | ✓ |
| Parameterized | Accept win/conversion rates as optional inputs | |

**User's choice:** Hardcoded constants (Claude recommendation — dead simple, v2 refactor is trivial)
**Notes:** ENH-01 deferred to v2. No extensibility hooks needed now.

---

## Zero-Staff Edge Case

| Option | Description | Selected |
|--------|-------------|----------|
| Return 0 | hourlyFloorRate = 0 when no staff, Phase 5 shows N/A | ✓ |
| Return null | Nullable field, forces downstream null checks | |
| Return Infinity | Mathematical result, but bad for display | |

**User's choice:** Return 0 (Claude recommendation — engine stays pure math, display handles UX)
**Notes:** User wanted simplest approach. No null handling complexity in the engine.

---

## Claude's Discretion

All three areas were resolved via Claude's recommendation at user's request ("What option do you recommend to keep it simple but accurate and fast to complete?").

## Deferred Ideas

None — discussion stayed within phase scope.
