---
phase: 07-pdf-report-generation
plan: 01
subsystem: pdf-generation
tags: [pdf, react-pdf, report, financial-output, alerts, disclaimers]
dependency_graph:
  requires: [output-copy, alert-copy, calculator-types, currency-formatting]
  provides: [pdf-component-tree, pdf-generation-api]
  affects: [email-capture-gate, download-button]
tech_stack:
  added: ["@react-pdf/renderer 4.x"]
  patterns: ["imperative pdf().toBlob() API", "component-per-section PDF layout", "shared StyleSheet"]
key_files:
  created:
    - src/components/pdf/report-styles.ts
    - src/components/pdf/ReportHeader.tsx
    - src/components/pdf/InputSummary.tsx
    - src/components/pdf/FinancialAnchorsSection.tsx
    - src/components/pdf/AlertsSection.tsx
    - src/components/pdf/PipelineSection.tsx
    - src/components/pdf/DisclaimersFooter.tsx
    - src/components/pdf/TradeSurvivalReport.tsx
    - src/lib/pdf/generate-report.ts
    - src/components/pdf/__tests__/TradeSurvivalReport.test.tsx
    - src/lib/pdf/__tests__/generate-report.test.ts
  modified:
    - package.json
    - pnpm-lock.yaml
decisions:
  - "Used @vitest-environment node directive for PDF tests since react-pdf needs Node APIs not available in jsdom"
  - "PDF component tree uses function call syntax TradeSurvivalReport({...}) instead of JSX for pdf() API compatibility"
  - "No logo image in header to keep PDF size minimal -- text-only branding"
metrics:
  duration: "3min"
  completed: "2026-03-28T15:53:00Z"
  tasks_completed: 2
  tasks_total: 2
  files_created: 11
  files_modified: 2
  tests_added: 11
  tests_total: 114
---

# Phase 7 Plan 1: PDF Document Layout and Generation Summary

Branded PDF report with all financial anchors, pipeline targets, legal alerts, input summary, and disclaimers using @react-pdf/renderer 4.x component tree and imperative generation API.

## One-liner

Complete PDF report layout with 8 section components consuming existing OUTPUT_COPY/ALERT_COPY constants, plus generateAndDownloadReport imperative API with 11 behavioral tests covering all requirement variants.

## What Was Built

### Task 1: PDF Component Tree (bcc5e17)

Installed @react-pdf/renderer 4.x and created 8 PDF component files:

- **report-styles.ts** -- Shared StyleSheet with 20+ style definitions (page, header, metrics, alerts, pipeline, disclaimers)
- **ReportHeader.tsx** -- Branded header with "Trade Survival Report" title and subtitle
- **InputSummary.tsx** -- Shows entity type, gross draw, VAT rate, staff count from CalculatorInput
- **FinancialAnchorsSection.tsx** -- 3 financial metrics (revenue target, billings, hourly rate) with OUTPUT_COPY labels and explanations; includes ZERO_STAFF_HOURLY_NOTE for zero-staff edge case
- **PipelineSection.tsx** -- 3 pipeline metrics (jobs to win, quotes needed, leads needed) with Math.ceil rounding
- **AlertsSection.tsx** -- Conditional rendering of triggered alerts with amber styling
- **DisclaimersFooter.tsx** -- All 5 asterisk disclaimers plus general accountant consultation note
- **TradeSurvivalReport.tsx** -- Document/Page assembly of all sections in correct order

All copy reused from OUTPUT_COPY and ALERT_COPY -- no duplicated strings. No intermediate calculation values (targetBusinessProfit, adjustedPayroll, adjustedOverheads) exposed per D-06.

### Task 2: Tests and Generation API (56cfa78)

- **TradeSurvivalReport.test.tsx** -- 6 behavioral tests covering PDF-01 (valid Blob), PDF-02 (alerts forwarded, size comparison), PDF-03 (disclaimers included), zero-staff edge case, EUR/IE VAT edge case
- **generate-report.ts** -- Imperative API using pdf().toBlob() with DOM download trigger (URL.createObjectURL, link.click pattern)
- **generate-report.test.ts** -- 5 tests including 500KB size assertion (PDF-05), zero alerts, EUR currency, zero staff variants

## Deviations from Plan

None -- plan executed exactly as written.

## Verification Results

- TypeScript compilation: PASS (tsc --noEmit exits 0)
- PDF component tests: 6/6 pass
- PDF generation tests: 5/5 pass
- Full test suite: 114/114 pass
- No @react-pdf/renderer imports outside src/components/pdf/ and src/lib/pdf/

## Known Stubs

None -- all components are fully wired to existing data sources.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | bcc5e17 | PDF component tree with shared styles |
| 2 | 56cfa78 | PDF generation API and test suite |

## Self-Check: PASSED

All 11 created files verified on disk. Both commit hashes (bcc5e17, 56cfa78) found in git log.
