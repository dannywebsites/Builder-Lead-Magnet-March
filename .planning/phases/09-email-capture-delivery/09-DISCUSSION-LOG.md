# Phase 9: Email Capture & Delivery - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-28
**Phase:** 09-email-capture-delivery
**Areas discussed:** Modal trigger & download flow, Email template content, Post-submission UX, Repeat visitor handling
**Mode:** --auto (all decisions auto-selected)

---

## Modal Trigger & Download Flow

| Option | Description | Selected |
|--------|-------------|----------|
| Generate PDF after email submitted | Submit email → API sends email → PDF generates and downloads | ✓ |
| Generate PDF before modal opens | Pre-generate, then gate the download on email submission | |
| Generate PDF in parallel | Start generation while user fills modal | |

**User's choice:** [auto] Generate PDF after email submitted (recommended — prevents download without email, simpler flow)
**Notes:** Cleanest approach — single trigger point, no wasted generation if user abandons modal.

---

## Email Template Content

| Option | Description | Selected |
|--------|-------------|----------|
| Full results summary with all anchors + pipeline + alerts | Complete value in email | ✓ |
| Teaser with key numbers only | Drive user back to calculator | |
| PDF attachment instead of inline content | Email as delivery mechanism only | |

**User's choice:** [auto] Full results summary (recommended — email should stand alone as useful per LEAD-05)
**Notes:** Including alerts mirrors the PDF report value. Uses react-email for cross-client rendering.

---

## Post-Submission UX

| Option | Description | Selected |
|--------|-------------|----------|
| Modal closes, PDF auto-downloads, toast confirms email sent | Immediate value delivery | ✓ |
| Modal shows success message, manual download button | Extra click required | |
| Redirect to a thank-you page | Separate page, more complex | |

**User's choice:** [auto] Modal closes + auto-download + toast (recommended — builds trust through immediate value delivery)
**Notes:** Error case: if email fails, keep modal open with error but still allow PDF download.

---

## Repeat Visitor Handling

| Option | Description | Selected |
|--------|-------------|----------|
| No persistence — email required every time | GDPR-minimal, no cookies/storage | ✓ |
| localStorage remember email | Convenience, but adds cookie-like storage | |
| Cookie-based bypass | Skip modal if previously submitted | |

**User's choice:** [auto] No persistence (recommended — aligns with GDPR-minimal approach and one-shot calculator nature)
**Notes:** Repeat visits unlikely for a one-shot calculator. No localStorage/cookies keeps the privacy story clean.

---

## Claude's Discretion

- Modal visual design (overlay, animation, sizing)
- Email template layout and branding
- Email subject line
- Resend API configuration details
- API route error handling specifics
- Form validation approach for modal (react-hook-form + zod recommended)

## Deferred Ideas

None — discussion stayed within phase scope
