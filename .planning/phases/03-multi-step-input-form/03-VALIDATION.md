---
phase: 3
slug: multi-step-input-form
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-28
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 4.1.x |
| **Config file** | vitest.config.ts |
| **Quick run command** | `pnpm test` |
| **Full suite command** | `pnpm test` |
| **Estimated runtime** | ~2 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test`
- **After every plan wave:** Run `pnpm test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | FORM-13 | integration | `pnpm test` | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | FORM-13 | integration | `pnpm test` | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 2 | FORM-02-08 | unit+integration | `pnpm test` | ❌ W0 | ⬜ pending |
| 03-02-02 | 02 | 2 | FORM-12 | unit | `pnpm test` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `@testing-library/react` + `@testing-library/jest-dom` — needed for component tests
- [ ] `jsdom` — vitest environment for React component testing
- [ ] `react-hook-form` + `@hookform/resolvers` — form library (not yet installed)
- [ ] `nuqs` — URL state management (not yet installed)

*Test stubs created during plan execution, not Wave 0.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Progress indicator visually updates | FORM-13 | Visual appearance | Navigate steps, verify indicator updates |
| Form state persists on back/forward | FORM-13 | Browser navigation | Fill Step 2, go back to Step 1, return to Step 2, verify data |
| Disabled fields appearance when staffCount=0 | FORM-04 | Visual styling | Set staff count to 0, verify rate/hours are greyed out |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
