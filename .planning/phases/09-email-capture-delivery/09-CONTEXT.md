# Phase 9: Email Capture & Delivery - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Email-gated PDF download flow — modal intercepts the "Get Your Trade Survival Report" button, captures email with GDPR consent, triggers PDF download, and sends a branded results summary email via Resend serverless function. This phase transforms the existing direct download into a lead capture gate and adds the first API route to the project.

</domain>

<decisions>
## Implementation Decisions

### Modal Trigger & Download Flow
- **D-01:** Clicking "Get Your Trade Survival Report" opens an email capture modal instead of triggering a direct download. The existing `DownloadReportButton` component's onClick is replaced with a modal-open action.
- **D-02:** PDF generates AFTER successful email submission — not before. Flow: user clicks button → modal opens → user enters email + checks consent → submits → API sends email → PDF generates and downloads → modal closes.
- **D-03:** The modal contains: email input field, ConsentCheckbox component (from Phase 8), and a submit button. Minimal fields — just email and consent.

### Email Template Content
- **D-04:** The branded results summary email includes all 6 financial anchor values (Monthly Revenue Goal, Monthly Billings, Hourly Floor Rate, Jobs to Win, Quotes Needed, Leads Needed) with their plain-English explanations.
- **D-05:** Email includes triggered legal alerts — mirrors the report's value so the email stands alone as useful.
- **D-06:** Email uses react-email components for cross-client HTML rendering. Built with the same JSX component model as the rest of the app.
- **D-07:** Email includes the same general disclaimer footer as the PDF report.

### Post-Submission UX
- **D-08:** After successful submission: modal closes, PDF downloads automatically, toast notification confirms "Report sent to your email" (using sonner).
- **D-09:** Loading/submitting state on the modal submit button while the API call is in flight. Prevents double-submission.
- **D-10:** Error state: if email send fails, show error in modal (don't close), still allow PDF download so the user isn't blocked from getting their report.

### Repeat Visitor Handling
- **D-11:** No persistence — email is required every visit. No cookies, no localStorage. Aligns with GDPR-minimal approach and the one-shot calculator nature of the tool.

### Serverless API Route
- **D-12:** Single Next.js API route (`/api/send-report`) handles email submission. Receives email address and calculator results as JSON, sends via Resend, returns success/failure.
- **D-13:** Email storage via Resend contacts/audience — no separate database. Simplest GDPR-compliant approach per Phase 8 D-08.
- **D-14:** API route validates email format and consent flag server-side before sending.

### Carried from Prior Phases
- **D-15:** ConsentCheckbox component uses controlled props pattern (checked/onChange) — integrates with react-hook-form in the modal (Phase 8 D-03/D-04/D-05).
- **D-16:** Trade language, no financial jargon in email copy (Phase 4 D-10/D-11, Phase 5 D-06, Phase 7 D-14).
- **D-17:** "Protect" framing for guardrail language in email (Phase 4 D-09, Phase 7 D-15).
- **D-18:** Copy constants pattern — email template reuses `output-copy.ts` and `alert-copy.ts` (Phase 7 D-17).

### Claude's Discretion
- Modal visual design (overlay, size, animation)
- Email template layout and styling (colors, spacing, branding)
- Email subject line copy
- Resend API key environment variable naming
- Whether to add the email to a Resend audience/contact list automatically or just send the transactional email
- API route error handling specifics
- Form validation library choice for the modal (react-hook-form + zod recommended for consistency)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Email Stack (Chosen)
- `CLAUDE.md` §Recommended Stack — Resend SDK 4.x for transactional email, react-email 3.x for templates

### Existing Components (Integration Points)
- `src/components/results/DownloadReportButton.tsx` — Current direct download button; Phase 9 replaces its onClick with modal trigger
- `src/components/results/ResultsView.tsx` — Parent results screen containing the download button
- `src/components/ui/ConsentCheckbox.tsx` — GDPR consent checkbox component with controlled props (checked/onChange/error)
- `src/components/CalculatorApp.tsx` — Root orchestrator with all calculator data (input, output, currency, alerts)

### Copy Constants (Email Content Source)
- `src/lib/results/output-copy.ts` — Labels and explanations for all 6 output values
- `src/lib/results/alert-copy.ts` — Titles and body text for legal alerts

### Calculator Types
- `src/lib/calculator/types.ts` — CalculatorInput, CalculatorOutput, Currency interfaces
- `src/lib/calculator/alerts.ts` — getTriggeredAlerts() and Alert type
- `src/lib/calculator/currency.ts` — formatCurrency() for monetary values in email

### PDF Generation (Triggered After Submission)
- `src/lib/pdf/generate-report.ts` — generateAndDownloadReport() function called after email submission succeeds

### Prior Phase Context
- `.planning/phases/07-pdf-report-generation/07-CONTEXT.md` — PDF download flow, D-08/D-11 (gate point)
- `.planning/phases/08-gdpr-compliance-privacy-infrastructure/08-CONTEXT.md` — GDPR consent decisions, D-03/D-04/D-05/D-08

### Requirements
- `.planning/REQUIREMENTS.md` — LEAD-01 (modal), LEAD-03 (email capture), LEAD-04 (PDF after submission), LEAD-05 (email delivery)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ConsentCheckbox` — Controlled component with checked/onChange/error props, ready for react-hook-form integration
- `DownloadReportButton` — Contains the lazy-loaded PDF generation logic; modal flow will reuse this generation pattern
- `generateAndDownloadReport()` — Existing PDF generation function, called after email submission
- `OUTPUT_COPY` / `ALERT_COPY` — Copy constants for email template content
- `formatCurrency()` — Currency formatting for email values
- `getTriggeredAlerts()` — Alert computation for email content
- `Footer` component — Already in `src/components/ui/`, site-wide footer exists

### Established Patterns
- react-hook-form + Zod for form validation (used throughout wizard form)
- Lazy loading via dynamic import (PDF library pattern)
- sonner for toast notifications (already in stack per CLAUDE.md)
- Feature-based folder structure (`src/lib/email/`, `src/components/email/`)

### Integration Points
- `DownloadReportButton.tsx` — Replace direct download onClick with modal open
- `src/app/api/send-report/route.ts` — New API route (first in the project)
- `package.json` — Add resend, react-email, sonner dependencies

</code_context>

<specifics>
## Specific Ideas

- The modal should feel lightweight and fast — not a heavy form. Just email + consent + submit.
- The PDF download is the immediate reward. The email is a bonus "we'll send you a copy too."
- Error handling should never block the user from getting their PDF — if email fails, still download.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 09-email-capture-delivery*
*Context gathered: 2026-03-28*
