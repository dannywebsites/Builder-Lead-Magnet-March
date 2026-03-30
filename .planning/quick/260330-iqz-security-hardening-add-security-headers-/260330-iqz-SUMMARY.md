---
phase: quick
plan: 260330-iqz
subsystem: api
tags: [security-headers, rate-limiting, zod, middleware, csp]

provides:
  - "Next.js middleware with security headers (CSP, X-Frame-Options, etc.)"
  - "In-memory API rate limiting (10 req/min per IP)"
  - "Strict Zod schemas for calculatorInput, calculatorOutput, and Alert types"
  - "Type-safe send-report route with no unsafe casts"
affects: [api, email]

tech-stack:
  added: []
  patterns: ["Security headers via Next.js middleware", "In-memory rate limiting with Map cleanup"]

key-files:
  created: [src/middleware.ts]
  modified: [src/lib/email/schema.ts, src/app/api/send-report/route.ts, src/app/api/send-report/__tests__/route.test.ts]

key-decisions:
  - "CSP includes unsafe-inline and unsafe-eval for Next.js runtime and react-pdf compatibility"
  - "Rate limiter uses simple in-memory Map (sufficient for single-instance Vercel deployment)"

requirements-completed: []

duration: 6min
completed: 2026-03-30
---

# Quick Task 260330-iqz: Security Hardening Summary

**Security headers via Next.js middleware, API rate limiting at 10 req/min per IP, and strict Zod schemas replacing loose z.record() with exact type-safe field validation**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-30T13:33:14Z
- **Completed:** 2026-03-30T13:38:55Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- All responses now include security headers: X-Frame-Options DENY, CSP, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy, X-DNS-Prefetch-Control
- API routes rate-limited to 10 requests per 60 seconds per IP with automatic expired-entry cleanup
- sendReportRequestSchema now validates exact field shapes matching CalculatorInput, CalculatorOutput, and Alert TypeScript types
- Zero unsafe `as unknown as` casts remain in the send-report route handler

## Task Commits

Each task was committed atomically:

1. **Task 1: Create middleware with security headers and API rate limiting** - `197cdc8` (feat)
2. **Task 2: Replace loose Zod schemas with strict typed schemas and remove unsafe casts** - `c2dcbfc` (fix)

## Files Created/Modified
- `src/middleware.ts` - New middleware with security headers on all responses and rate limiting on /api/* routes
- `src/lib/email/schema.ts` - Replaced z.record(z.string(), z.unknown()) with strict field-level schemas for calculatorInput, calculatorOutput, and alerts
- `src/app/api/send-report/route.ts` - Removed unsafe `as unknown as` casts and unused type imports
- `src/app/api/send-report/__tests__/route.test.ts` - Updated test fixtures with valid data matching strict schemas

## Decisions Made
- CSP includes `unsafe-inline` and `unsafe-eval` in script-src because Next.js runtime and @react-pdf/renderer require them
- Rate limiter uses in-memory Map rather than external store -- sufficient for Vercel's single-instance serverless model
- Used `forEach` instead of `for...of` on Map to avoid TypeScript downlevelIteration requirement

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Updated test fixtures to match strict schemas**
- **Found during:** Task 2 (strict schema replacement)
- **Issue:** Existing test fixtures used incomplete/invalid data (e.g., `entityType: "ltd"` instead of `"limited_company"`, missing required fields, missing `name` field) that only passed against loose z.record validation
- **Fix:** Replaced test fixtures with complete valid data matching all strict schema requirements
- **Files modified:** src/app/api/send-report/__tests__/route.test.ts
- **Verification:** All 3 route tests pass
- **Committed in:** c2dcbfc (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Necessary fix -- strict schemas correctly reject the invalid test data that previously slipped through.

## Issues Encountered
None

## Known Stubs
None

## User Setup Required
None - no external service configuration required.

---
*Quick task: 260330-iqz*
*Completed: 2026-03-30*
