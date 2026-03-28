---
phase: 7
slug: pdf-report-generation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-28
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 4.x |
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
| 07-01-01 | 01 | 1 | PDF-01 | unit | `pnpm test` | ❌ W0 | ⬜ pending |
| 07-01-02 | 01 | 1 | PDF-02 | unit | `pnpm test` | ❌ W0 | ⬜ pending |
| 07-01-03 | 01 | 1 | PDF-03 | unit | `pnpm test` | ❌ W0 | ⬜ pending |
| 07-02-01 | 02 | 2 | PDF-04 | manual | N/A | N/A | ⬜ pending |
| 07-02-02 | 02 | 2 | PDF-05 | unit | `pnpm test` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/components/pdf/__tests__/` — test directory for PDF component tests
- [ ] Test stubs for PDF document generation (branded content, alerts, disclaimers)
- [ ] Existing vitest infrastructure covers framework needs — no new install required

*Existing infrastructure covers framework requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| PDF renders correctly across browsers | PDF-04 | Requires visual browser verification | Open generated PDF in Chrome, Safari, Firefox, Edge — verify layout, fonts, alignment |
| PDF visual branding | PDF-01 | Visual quality check | Verify branded header, section layout, professional appearance |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
