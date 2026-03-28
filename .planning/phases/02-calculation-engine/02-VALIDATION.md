---
phase: 2
slug: calculation-engine
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-28
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.x |
| **Config file** | `vitest.config.ts` (root) |
| **Quick run command** | `pnpm test` |
| **Full suite command** | `pnpm test` |
| **Estimated runtime** | ~3 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test`
- **After every plan wave:** Run `pnpm test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 3 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | CALC-01 | unit | `pnpm vitest run src/lib/calculator/__tests__/engine.test.ts -t "tax buffer"` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | CALC-02 | unit | `pnpm vitest run src/lib/calculator/__tests__/engine.test.ts -t "staff cost"` | ❌ W0 | ⬜ pending |
| 02-01-03 | 01 | 1 | CALC-03 | unit | `pnpm vitest run src/lib/calculator/__tests__/engine.test.ts -t "billable hours"` | ❌ W0 | ⬜ pending |
| 02-01-04 | 01 | 1 | CALC-04 | unit | `pnpm vitest run src/lib/calculator/__tests__/engine.test.ts -t "slippage"` | ❌ W0 | ⬜ pending |
| 02-01-05 | 01 | 1 | CALC-05 | unit | `pnpm vitest run src/lib/calculator/__tests__/engine.test.ts -t "MRT"` | ❌ W0 | ⬜ pending |
| 02-01-06 | 01 | 1 | CALC-06 | unit | `pnpm vitest run src/lib/calculator/__tests__/engine.test.ts -t "client-side"` | ❌ W0 | ⬜ pending |
| 02-01-07 | 01 | 1 | CALC-08 | unit | `pnpm vitest run src/lib/calculator/__tests__/engine.test.ts -t "zero staff"` | ❌ W0 | ⬜ pending |
| 02-02-01 | 02 | 1 | CALC-05 | unit | `pnpm vitest run src/lib/calculator/__tests__/pipeline.test.ts -t "pipeline"` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/lib/calculator/__tests__/engine.test.ts` — stubs for CALC-01 through CALC-06, CALC-08
- [ ] `src/lib/calculator/__tests__/pipeline.test.ts` — stubs for sales pipeline math

*Existing test infrastructure (Vitest) is already configured from Phase 1.*

---

## Manual-Only Verifications

*All phase behaviors have automated verification.*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 3s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
