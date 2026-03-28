---
phase: 1
slug: project-scaffolding-type-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-28
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | vitest.config.ts (Wave 0 installs) |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run --reporter=verbose`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | FORM-01 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 1 | FORM-01 | unit | `npx vitest run src/lib/calculator/__tests__/schemas.test.ts` | ❌ W0 | ⬜ pending |
| 01-02-02 | 02 | 1 | FORM-09 | unit | `npx vitest run src/lib/calculator/__tests__/schemas.test.ts` | ❌ W0 | ⬜ pending |
| 01-02-03 | 02 | 1 | CALC-07 | unit | `npx vitest run src/lib/calculator/__tests__/currency.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest` + `@testing-library/react` — install test framework
- [ ] `vitest.config.ts` — vitest configuration
- [ ] `src/lib/calculator/__tests__/schemas.test.ts` — stubs for FORM-01, FORM-09
- [ ] `src/lib/calculator/__tests__/currency.test.ts` — stubs for CALC-07

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Dev server starts | FORM-01 | Runtime environment | Run `npm run dev`, verify localhost:3000 responds |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
