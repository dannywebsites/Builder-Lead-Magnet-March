---
phase: 9
slug: email-capture-delivery
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-28
---

# Phase 9 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | vitest.config.ts |
| **Quick run command** | `pnpm vitest run --reporter=verbose` |
| **Full suite command** | `pnpm vitest run --reporter=verbose` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm vitest run --reporter=verbose`
- **After every plan wave:** Run `pnpm vitest run --reporter=verbose`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 09-01-01 | 01 | 1 | LEAD-01 | unit | `pnpm vitest run` | ❌ W0 | ⬜ pending |
| 09-01-02 | 01 | 1 | LEAD-01, LEAD-02 | unit | `pnpm vitest run` | ❌ W0 | ⬜ pending |
| 09-01-03 | 01 | 1 | LEAD-04 | unit | `pnpm vitest run` | ❌ W0 | ⬜ pending |
| 09-02-01 | 02 | 2 | LEAD-05 | unit | `pnpm vitest run` | ❌ W0 | ⬜ pending |
| 09-02-02 | 02 | 2 | LEAD-03 | unit | `pnpm vitest run` | ❌ W0 | ⬜ pending |
| 09-02-03 | 02 | 2 | LEAD-05 | manual | N/A | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/components/results/__tests__/EmailCaptureModal.test.tsx` — stubs for LEAD-01
- [ ] `src/app/api/send-report/__tests__/route.test.ts` — stubs for LEAD-05

*Existing infrastructure covers test framework and jest-dom setup.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Email actually delivered to inbox | LEAD-05 | Requires real Resend API call | Send test email with valid RESEND_API_KEY, check inbox |
| SPF/DKIM/DMARC pass | LEAD-05 | DNS configuration | Check email headers in received email |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
