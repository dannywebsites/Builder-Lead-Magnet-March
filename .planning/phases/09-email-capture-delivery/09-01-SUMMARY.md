---
phase: 09-email-capture-delivery
plan: 01
subsystem: ui
tags: [react-hook-form, zod, sonner, modal, email-capture, gdpr]

requires:
  - phase: 08-gdpr-compliance-privacy-infrastructure
    provides: ConsentCheckbox component with controlled props pattern
  - phase: 07-pdf-report-generation
    provides: generateAndDownloadReport function for PDF download
provides:
  - EmailCaptureModal component with form validation and error handling
  - emailCaptureSchema and sendReportRequestSchema (Zod 4)
  - sendReport() fetch wrapper for /api/send-report
  - Sonner Toaster in root layout
  - DownloadReportButton rewired to open modal instead of direct download
affects: [09-02-email-api-route, results-view, pdf-download-flow]

tech-stack:
  added: [sonner@2.0.7, @testing-library/user-event@14.6.1]
  patterns: [react-hook-form Controller for controlled components, zodResolver for form validation, dynamic import for PDF generation in modal]

key-files:
  created:
    - src/components/email/EmailCaptureModal.tsx
    - src/lib/email/schema.ts
    - src/lib/email/send-report-action.ts
    - src/components/email/__tests__/EmailCaptureModal.test.tsx
    - src/app/api/send-report/__tests__/route.test.ts
  modified:
    - src/components/results/DownloadReportButton.tsx
    - src/app/layout.tsx
    - package.json

key-decisions:
  - "Sonner v2.0.7 installed (CLAUDE.md specifies 1.x but current stable is 2.x with same API surface per RESEARCH.md)"
  - "ConsentCheckbox integrated via react-hook-form Controller to maintain controlled props pattern from Phase 8"
  - "Test selector changed from /email/i to /email address/i to avoid matching ConsentCheckbox label text"

patterns-established:
  - "Modal pattern: fixed backdrop with stopPropagation on card, Escape key listener, auto-focus on open"
  - "Form error + API error dual state: formState.errors for validation, separate apiError state for server errors"
  - "Fallback download: never block user from PDF even if email API fails"

requirements-completed: [LEAD-01, LEAD-04]

duration: 4min
completed: 2026-03-28
---

# Phase 9 Plan 1: Email Capture Modal & Download Gate Summary

**Email capture modal with react-hook-form + Zod validation, GDPR consent gate, and fallback PDF download on API error**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-28T23:16:26Z
- **Completed:** 2026-03-28T23:20:06Z
- **Tasks:** 3
- **Files modified:** 8

## Accomplishments
- EmailCaptureModal component with react-hook-form, zodResolver, loading/error states, and Escape key close
- DownloadReportButton rewired to open modal instead of direct PDF download (LEAD-01 gate)
- Zod schemas for client-side form validation and API request validation
- Sonner toast integration in root layout for success notifications

## Task Commits

Each task was committed atomically:

1. **Task 1: Create failing test stubs (Wave 0 RED)** - `ed7410b` (test)
2. **Task 2: Install sonner, create schema/fetch wrapper, add Toaster** - `f8c99db` (feat)
3. **Task 3: Build EmailCaptureModal, rewire DownloadReportButton** - `370303c` (feat)

## Files Created/Modified
- `src/components/email/EmailCaptureModal.tsx` - Modal with email input, GDPR consent, submit/loading/error states, fallback download
- `src/lib/email/schema.ts` - emailCaptureSchema and sendReportRequestSchema (Zod 4)
- `src/lib/email/send-report-action.ts` - sendReport() fetch wrapper for /api/send-report
- `src/components/email/__tests__/EmailCaptureModal.test.tsx` - 5 test cases for modal behavior
- `src/app/api/send-report/__tests__/route.test.ts` - 3 test stubs for API route (RED until Plan 02)
- `src/components/results/DownloadReportButton.tsx` - Rewired to open modal instead of direct download
- `src/app/layout.tsx` - Added Sonner Toaster component
- `package.json` - Added sonner@2.0.7, @testing-library/user-event@14.6.1

## Decisions Made
- Sonner v2.0.7 used instead of v1.x (CLAUDE.md lists 1.x but RESEARCH.md confirms 2.x is current stable with same API)
- ConsentCheckbox integrated via react-hook-form Controller to preserve Phase 8's controlled props pattern (checked/onChange/error)
- Test selector refined from `/email/i` to `/email address/i` to avoid false match with ConsentCheckbox label containing "email"

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed test selector ambiguity for email input**
- **Found during:** Task 3 (test GREEN verification)
- **Issue:** `getByLabelText(/email/i)` matched both the email input and ConsentCheckbox label (which contains "email")
- **Fix:** Changed test selector to `getByLabelText(/email address/i)` to uniquely match the `aria-label="Email address"` attribute
- **Files modified:** src/components/email/__tests__/EmailCaptureModal.test.tsx
- **Verification:** All 5 tests pass
- **Committed in:** 370303c (Task 3 commit)

**2. [Rule 1 - Bug] Fixed mock data types to match actual TypeScript types**
- **Found during:** Task 1 (test stub creation)
- **Issue:** Plan used `entityType: "ltd"` and `vatRate: 20` but actual types are `"limited_company"` and `0.2`
- **Fix:** Used correct type values in test mock data
- **Files modified:** src/components/email/__tests__/EmailCaptureModal.test.tsx
- **Verification:** Tests compile and run correctly
- **Committed in:** ed7410b (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (2 bugs)
**Impact on plan:** Minor corrections for type safety and test reliability. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Known Stubs
- `src/app/api/send-report/__tests__/route.test.ts` - API route tests are RED stubs; implementation is in Plan 02. This is intentional Wave 0 design.

## Next Phase Readiness
- EmailCaptureModal is complete and ready for Plan 02's API route implementation
- sendReport() fetch wrapper points to `/api/send-report` which Plan 02 will create
- API route test stubs are ready to go GREEN once Plan 02 implements the route
- Sonner Toaster is in layout, ready for toast notifications across the app

---
*Phase: 09-email-capture-delivery*
*Completed: 2026-03-28*
