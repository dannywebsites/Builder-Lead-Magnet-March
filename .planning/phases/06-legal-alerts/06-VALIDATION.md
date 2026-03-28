---
phase: 6
slug: legal-alerts
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-28
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (via vitest.config.ts, jsdom environment) |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `pnpm vitest run --reporter=verbose` |
| **Full suite command** | `pnpm vitest run` |
| **Estimated runtime** | ~2 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm vitest run --reporter=verbose`
- **After every plan wave:** Run `pnpm vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | ALRT-01 | unit | `pnpm vitest run src/lib/calculator/__tests__/alerts.test.ts -t "gross-draw"` | ❌ W0 | ⬜ pending |
| 06-01-02 | 01 | 1 | ALRT-02 | unit | `pnpm vitest run src/lib/calculator/__tests__/alerts.test.ts -t "two-thirds"` | ❌ W0 | ⬜ pending |
| 06-01-03 | 01 | 1 | ALRT-03 | unit | `pnpm vitest run src/lib/calculator/__tests__/alerts.test.ts -t "efficiency"` | ❌ W0 | ⬜ pending |
| 06-01-04 | 01 | 1 | ALRT-04 | unit | `pnpm vitest run src/lib/calculator/__tests__/alerts.test.ts -t "cis-rct"` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/lib/calculator/__tests__/alerts.test.ts` �� stubs for ALRT-01 through ALRT-04 trigger logic

*Existing Vitest infrastructure covers framework requirements. Only test file creation needed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Amber/warning visual styling distinct from anchor and pipeline cards | D-03 | Visual styling verification | Inspect rendered alert cards in browser — should be amber background, distinct from white (anchors) and gray-50 (pipeline) |
| Alerts section positioned between Financial Anchors and Sales Pipeline | D-01 | Layout position verification | View results screen — alert section should appear after "What Your Business Needs to Earn" and before "Your Sales Marching Orders" |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
