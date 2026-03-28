---
phase: 4
slug: contextual-copy-input-guidance
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-28
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | vitest.config.ts |
| **Quick run command** | `pnpm test` |
| **Full suite command** | `pnpm test` |
| **Estimated runtime** | ~5 seconds |

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
| 04-01-01 | 01 | 1 | FORM-10 | unit | `pnpm test` | ❌ W0 | ⬜ pending |
| 04-01-02 | 01 | 1 | FORM-11 | unit | `pnpm test` | ❌ W0 | ⬜ pending |
| 04-01-03 | 01 | 1 | FORM-10 | unit | `pnpm test` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/lib/form/__tests__/step-schemas.test.ts` — update for new fixed cost category fields
- [ ] `src/lib/form/__tests__/transform.test.ts` — update for category sum transform

*Existing infrastructure covers test framework — only new test cases needed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Explanation text visible below labels | FORM-10 | Visual rendering | Load each step, verify explanation paragraph visible between label and input |
| Asterisk disclaimers styled distinctly | FORM-11 | Visual rendering | Check disclaimer text appears in smaller, muted style below relevant inputs |
| Fixed costs running total updates | FORM-10 | Interactive behavior | Enter values in category fields, verify total updates reactively |
| Disabled state explanation still readable | FORM-10 | Visual rendering | Set staffCount=0, verify explanation text on disabled fields is still legible |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
