---
phase: 06-legal-alerts
plan: 01
subsystem: ui
tags: [alerts, tax, vat, cis, rct, amber-cards, conditional-rendering]

requires:
  - phase: 05-results-display
    provides: ResultsView component, FinancialAnchorCard pattern, CalculatorApp state management
  - phase: 02-calculation-engine
    provides: CalculatorInput/CalculatorOutput types, calculate function
provides:
  - Alert type and AlertKey union type
  - getTriggeredAlerts pure function for conditional alert logic
  - ALERT_COPY centralized alert copy constants
  - AlertCard amber-styled UI component
  - AlertsSection container component
  - WizardForm passes full CalculatorInput upstream
affects: [07-pdf-report, 08-email-capture]

tech-stack:
  added: []
  patterns: [pure-function alert triggers, centralized copy constants, conditional section rendering]

key-files:
  created:
    - src/lib/calculator/alerts.ts
    - src/lib/results/alert-copy.ts
    - src/lib/calculator/__tests__/alerts.test.ts
    - src/components/results/AlertCard.tsx
    - src/components/results/AlertsSection.tsx
  modified:
    - src/components/results/ResultsView.tsx
    - src/components/CalculatorApp.tsx
    - src/components/wizard/WizardForm.tsx
    - src/components/results/__tests__/ResultsView.test.tsx

key-decisions:
  - "Alert logic in pure function separate from UI for testability and PDF reuse"
  - "WizardForm extended to pass full CalculatorInput upstream for alert computation"

patterns-established:
  - "Alert copy constants: ALERT_COPY in alert-copy.ts mirrors OUTPUT_COPY pattern from output-copy.ts"
  - "Conditional section rendering: AlertsSection returns null when empty, no wrapper needed"

requirements-completed: [ALRT-01, ALRT-02, ALRT-03, ALRT-04]

duration: 3min
completed: 2026-03-28
---

# Phase 6 Plan 1: Legal & Tax Alerts Summary

**Four conditional legal/tax alerts (gross draw, Irish two-thirds VAT rule, efficiency cap, CIS/RCT) with pure trigger logic, centralized copy, amber UI cards, and 10 unit tests**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-28T15:19:31Z
- **Completed:** 2026-03-28T15:22:24Z
- **Tasks:** 3 (2 auto + 1 auto-approved checkpoint)
- **Files modified:** 9

## Accomplishments
- Pure function getTriggeredAlerts with 4 alert conditions: gross-draw (always), two-thirds-rule (IE 13.5% VAT + directCost > 66%), efficiency-cap (staffCount > 0), cis-rct (always)
- Centralized alert copy in ALERT_COPY constants using "protect" framing and trade language
- Amber-styled AlertCard and AlertsSection components inserted between Financial Anchors and Sales Pipeline
- WizardForm extended to pass full CalculatorInput upstream for alert computation
- 10 unit tests covering all trigger conditions, boundary cases, and copy validation

## Task Commits

Each task was committed atomically:

1. **Task 1: Alert trigger logic, copy constants, and unit tests** - `7727dad` (feat)
2. **Task 2: Alert UI components and results screen integration** - `4b367a7` (feat)
3. **Task 3: Visual verification** - auto-approved (checkpoint)

## Files Created/Modified
- `src/lib/calculator/alerts.ts` - Alert type, AlertKey union, getTriggeredAlerts pure function
- `src/lib/results/alert-copy.ts` - ALERT_COPY centralized copy constants for 4 alerts
- `src/lib/calculator/__tests__/alerts.test.ts` - 10 unit tests for alert trigger logic
- `src/components/results/AlertCard.tsx` - Amber-styled alert card with warning icon
- `src/components/results/AlertsSection.tsx` - Container rendering triggered alerts, returns null when empty
- `src/components/results/ResultsView.tsx` - Added alerts prop and AlertsSection between anchors and pipeline
- `src/components/CalculatorApp.tsx` - Computes alerts via getTriggeredAlerts, passes to ResultsView
- `src/components/wizard/WizardForm.tsx` - Extended callback to pass full CalculatorInput upstream
- `src/components/results/__tests__/ResultsView.test.tsx` - Updated defaultProps with alerts array

## Decisions Made
- Alert logic in pure function separate from UI for testability and PDF reuse
- WizardForm extended to pass full CalculatorInput upstream (needed for alert computation, also useful for future PDF generation)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed existing ResultsView tests missing alerts prop**
- **Found during:** Task 2 (UI integration)
- **Issue:** Adding `alerts: Alert[]` to ResultsViewProps broke 10 existing tests that rendered ResultsView without the new prop
- **Fix:** Added `alerts: []` to defaultProps in ResultsView.test.tsx
- **Files modified:** src/components/results/__tests__/ResultsView.test.tsx
- **Verification:** All 103 tests pass
- **Committed in:** 4b367a7 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Necessary fix for interface change. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Alert system complete with pure function logic reusable for PDF report generation
- All 103 tests pass, build succeeds with static export
- Ready for Phase 7 (PDF report) which can import getTriggeredAlerts and ALERT_COPY

---
*Phase: 06-legal-alerts*
*Completed: 2026-03-28*
